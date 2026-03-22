import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Coupon } from "@/lib/models/coupon";

export const dynamic = "force-dynamic";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const payload = await request.json();
  const coupon = await Coupon.findByIdAndUpdate(params.id, payload, { new: true }).lean();
  return NextResponse.json({ data: coupon });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  await Coupon.deleteOne({ _id: params.id });
  return NextResponse.json({ ok: true });
}
