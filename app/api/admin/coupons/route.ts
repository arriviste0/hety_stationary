import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Coupon } from "@/lib/models/coupon";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const active = searchParams.get("active");
  const filter =
    active === null ? {} : { isActive: active === "true" };

  const coupons = await Coupon.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ data: coupons });
}

export async function POST(request: Request) {
  await connectToDatabase();
  const payload = await request.json();
  if (!payload.code) {
    return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
  }
  const coupon = await Coupon.create(payload);
  return NextResponse.json({ data: coupon }, { status: 201 });
}
