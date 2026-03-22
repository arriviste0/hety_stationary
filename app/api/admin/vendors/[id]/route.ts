import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Vendor } from "@/lib/models/vendor";

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const vendor = await Vendor.findById(params.id).lean();
  if (!vendor) {
    return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
  }
  return NextResponse.json({ data: vendor });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const payload = await request.json();
  const vendor = await Vendor.findByIdAndUpdate(params.id, payload, { new: true }).lean();
  return NextResponse.json({ data: vendor });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  await Vendor.deleteOne({ _id: params.id });
  return NextResponse.json({ ok: true });
}
