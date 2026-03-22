import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/lib/models/order";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const order = await Order.findById(params.id).lean();
  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ data: order });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const payload = await request.json();
  const order = await Order.findByIdAndUpdate(params.id, payload, { new: true });
  return NextResponse.json({ data: order });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  await Order.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
