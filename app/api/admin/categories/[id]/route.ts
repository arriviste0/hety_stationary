import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Category } from "@/lib/models/category";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const category = await Category.findById(params.id).lean();
  if (!category) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ data: category });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const payload = await request.json();
  const category = await Category.findByIdAndUpdate(params.id, payload, { new: true });
  return NextResponse.json({ data: category });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  await Category.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
