import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/lib/models/product";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);
  const query = searchParams.get("q");
  const category = searchParams.get("category");
  const status = searchParams.get("status");

  const filter: Record<string, unknown> = {};

  if (query) {
    filter.$or = [
      { name: { $regex: query, $options: "i" } },
      { sku: { $regex: query, $options: "i" } },
      { barcode: { $regex: query, $options: "i" } }
    ];
  }

  if (category) {
    filter.category = category;
  }

  if (status) {
    filter["visibility.status"] = status;
  }

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate("category")
    .populate("brand")
    .sort({ updatedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return NextResponse.json({ data: products, total, page, limit });
}

export async function POST(request: Request) {
  await connectToDatabase();
  const payload = await request.json();
  if (!payload.name || !payload.sku) {
    return NextResponse.json(
      { error: "Product name and SKU are required" },
      { status: 400 }
    );
  }
  const product = await Product.create(payload);
  return NextResponse.json({ data: product }, { status: 201 });
}
