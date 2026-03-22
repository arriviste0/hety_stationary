import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { SyncJob } from "@/lib/models/syncJob";
import { SyncLog } from "@/lib/models/syncLog";
import { createSyncJob } from "@/lib/marg-sync";

export async function GET() {
  await connectToDatabase();
  const jobs = await SyncJob.find().sort({ createdAt: -1 }).limit(10).lean();
  const logs = await SyncLog.find().sort({ createdAt: -1 }).limit(6).lean();
  return NextResponse.json({ jobs, logs });
}

export async function POST(request: Request) {
  await connectToDatabase();
  const { syncType } = await request.json();
  const job = await createSyncJob(syncType || "Masters");
  return NextResponse.json({ job }, { status: 201 });
}
