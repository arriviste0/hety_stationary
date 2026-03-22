import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/lib/models/product";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const product = await Product.findById(params.id).lean();
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ data: product });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const payload = await request.json();
  const product = await Product.findByIdAndUpdate(params.id, payload, { new: true });
  return NextResponse.json({ data: product });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  await Product.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
