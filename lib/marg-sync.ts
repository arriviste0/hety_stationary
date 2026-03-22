import { randomUUID } from "crypto";
import { SyncJob } from "@/lib/models/syncJob";
import { SyncLog } from "@/lib/models/syncLog";

export async function createSyncJob(syncType: string) {
  const job = await SyncJob.create({
    jobId: `JOB-${randomUUID().slice(0, 8)}`,
    syncType,
    startTime: new Date(),
    status: "Running"
  });

  await SyncLog.create({
    job: job._id,
    level: "Info",
    message: `Started ${syncType} sync.`
  });

  // Simulated background completion
  const recordsFetched = Math.floor(Math.random() * 120) + 10;
  const recordsUpdated = Math.floor(recordsFetched * 0.8);

  await SyncJob.updateOne(
    { _id: job._id },
    {
      endTime: new Date(),
      status: "Success",
      recordsFetched,
      recordsUpdated
    }
  );

  await SyncLog.create({
    job: job._id,
    level: "Info",
    message: `Sync completed with ${recordsUpdated} updates.`
  });

  return job;
}
