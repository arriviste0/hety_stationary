import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Category } from "@/lib/models/category";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const parent = searchParams.get("parent");
  const filter = parent ? { parent } : {};
  const categories = await Category.find(filter).sort({ sortOrder: 1 }).lean();
  return NextResponse.json({ data: categories });
}

export async function POST(request: Request) {
  await connectToDatabase();
  const payload = await request.json();
  if (!payload.name) {
    return NextResponse.json({ error: "Category name is required" }, { status: 400 });
  }
  const category = await Category.create(payload);
  return NextResponse.json({ data: category }, { status: 201 });
}
