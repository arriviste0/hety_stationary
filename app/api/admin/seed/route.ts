import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { seedAdminData } from "@/lib/seed-data";

export async function POST() {
  await connectToDatabase();
  const result = await seedAdminData();
  return NextResponse.json({ ok: true, ...result });
}
