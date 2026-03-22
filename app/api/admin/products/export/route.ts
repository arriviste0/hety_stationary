import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/lib/models/product";

export const dynamic = "force-dynamic";

function escapeCsv(value: string | number) {
  const text = String(value ?? "");
  if (text.includes(",") || text.includes("\"") || text.includes("\n")) {
    return `"${text.replace(/"/g, "\"\"")}"`;
  }
  return text;
}

export async function GET() {
  await connectToDatabase();
  const products = (await Product.find()
    .populate("category")
    .populate("brand")
    .sort({ createdAt: -1 })
    .lean()) as Array<Record<string, any>>;

  const headers = [
    "name",
    "sku",
    "slug",
    "category",
    "brand",
    "mrp",
    "sellingPrice",
    "costPrice",
    "stockQuantity",
    "status"
  ];

  const rows = products.map((product) => [
    product.name || "",
    product.sku || "",
    product.slug || "",
    (product.category as Record<string, any> | undefined)?.name || "",
    (product.brand as Record<string, any> | undefined)?.name || "",
    product.pricing?.mrp || 0,
    product.pricing?.sellingPrice || 0,
    product.pricing?.costPrice || 0,
    product.inventory?.stockQuantity || 0,
    product.visibility?.status || "Active"
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((value) => escapeCsv(value)).join(","))
    .join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="products.csv"'
    }
  });
}
