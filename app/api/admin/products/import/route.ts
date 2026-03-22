import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/lib/models/product";
import { Category } from "@/lib/models/category";
import { Brand } from "@/lib/models/brand";
import { Inventory } from "@/lib/models/inventory";
import { slugify } from "@/lib/utils/slug";

export const dynamic = "force-dynamic";

function parseCsvLine(line: string) {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];

    if (char === "\"") {
      if (inQuotes && line[index + 1] === "\"") {
        current += "\"";
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  result.push(current.trim());
  return result;
}

export async function POST(request: Request) {
  await connectToDatabase();
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "CSV file is required" }, { status: 400 });
  }

  const text = await file.text();
  const lines = text.split(/\r?\n/).filter(Boolean);

  if (lines.length < 2) {
    return NextResponse.json({ error: "CSV has no data rows" }, { status: 400 });
  }

  const headers = parseCsvLine(lines[0]);
  let imported = 0;

  for (const line of lines.slice(1)) {
    const values = parseCsvLine(line);
    const row = Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]));

    const name = row.name?.trim();
    const sku = row.sku?.trim();

    if (!name || !sku) {
      continue;
    }

    const category =
      row.category?.trim()
        ? await Category.findOne({ name: row.category.trim() })
        : null;
    const brand =
      row.brand?.trim() ? await Brand.findOne({ name: row.brand.trim() }) : null;

    const payload = {
      name,
      sku,
      slug: row.slug?.trim() || slugify(name),
      category: category?._id,
      brand: brand?._id,
      pricing: {
        mrp: Number(row.mrp || 0),
        sellingPrice: Number(row.sellingPrice || 0),
        costPrice: Number(row.costPrice || 0),
        gstPercent: 0
      },
      inventory: {
        stockQuantity: Number(row.stockQuantity || 0),
        reorderLevel: 10,
        unit: "pcs",
        minOrderQty: 1,
        maxOrderQty: 100
      },
      visibility: {
        status: row.status || "Active",
        featured: false,
        tags: []
      }
    };

    const product = await Product.findOneAndUpdate(
      { sku },
      payload,
      { new: true, upsert: true }
    );

    await Inventory.findOneAndUpdate(
      { sku },
      {
        product: product._id,
        sku,
        currentStock: payload.inventory.stockQuantity,
        reorderLevel: payload.inventory.reorderLevel,
        stockStatus:
          payload.inventory.stockQuantity === 0
            ? "Out"
            : payload.inventory.stockQuantity < payload.inventory.reorderLevel
              ? "Low"
              : "In Stock"
      },
      { upsert: true }
    );

    imported += 1;
  }

  return NextResponse.json({ ok: true, imported });
}
