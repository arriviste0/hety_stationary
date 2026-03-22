import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Vendor } from "@/lib/models/vendor";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 20);
  const q = searchParams.get("q");
  const filter = q
    ? {
        $or: [
          { supplierName: { $regex: q, $options: "i" } },
          { contactPerson: { $regex: q, $options: "i" } },
          { phone: { $regex: q, $options: "i" } }
        ]
      }
    : {};

  const total = await Vendor.countDocuments(filter);
  const vendors = await Vendor.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return NextResponse.json({ data: vendors, total, page, limit });
}

export async function POST(request: Request) {
  await connectToDatabase();
  const payload = await request.json();

  if (!payload.supplierName || !payload.contactPerson || !payload.phone) {
    return NextResponse.json(
      { error: "Supplier name, contact person, and phone are required" },
      { status: 400 }
    );
  }

  const vendor = await Vendor.create(payload);
  return NextResponse.json({ data: vendor }, { status: 201 });
}
