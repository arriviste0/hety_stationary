import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { PurchaseOrder } from "@/lib/models/purchaseOrder";

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const row = await PurchaseOrder.findById(params.id).populate("vendor").lean();
  if (!row) {
    return NextResponse.json({ error: "Purchase order not found" }, { status: 404 });
  }
  return NextResponse.json({ data: row });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const payload = await request.json();
  const row = await PurchaseOrder.findByIdAndUpdate(params.id, payload, { new: true }).lean();
  return NextResponse.json({ data: row });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  await PurchaseOrder.deleteOne({ _id: params.id });
  return NextResponse.json({ ok: true });
}
