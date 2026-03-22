import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { PurchaseOrder } from "@/lib/models/purchaseOrder";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 20);
  const status = searchParams.get("status");
  const filter = status ? { status } : {};

  const total = await PurchaseOrder.countDocuments(filter);
  const rows = await PurchaseOrder.find(filter)
    .populate("vendor")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return NextResponse.json({ data: rows, total, page, limit });
}

export async function POST(request: Request) {
  await connectToDatabase();
  const payload = await request.json();
  if (!payload.poNumber || !payload.vendor) {
    return NextResponse.json({ error: "PO number and vendor are required" }, { status: 400 });
  }
  const row = await PurchaseOrder.create(payload);
  return NextResponse.json({ data: row }, { status: 201 });
}
