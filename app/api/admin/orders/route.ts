import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import "@/lib/models/customer";
import { Order } from "@/lib/models/order";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);
  const status = searchParams.get("status");
  const paymentStatus = searchParams.get("paymentStatus");

  const filter: Record<string, unknown> = {};
  if (status) filter.orderStatus = status;
  if (paymentStatus) filter.paymentStatus = paymentStatus;

  const total = await Order.countDocuments(filter);
  const orders = await Order.find()
    .find(filter)
    .populate("customer")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return NextResponse.json({ data: orders, total, page, limit });
}

export async function POST(request: Request) {
  await connectToDatabase();
  const payload = await request.json();
  if (!payload.orderId || !payload.totalAmount) {
    return NextResponse.json(
      { error: "Order id and total amount are required" },
      { status: 400 }
    );
  }
  const order = await Order.create(payload);
  return NextResponse.json({ data: order }, { status: 201 });
}
