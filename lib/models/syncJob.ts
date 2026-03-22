import mongoose, { Schema } from "mongoose";

const SyncJobSchema = new Schema(
  {
    jobId: { type: String, required: true, unique: true },
    syncType: { type: String, required: true },
    startTime: { type: Date },
    endTime: { type: Date },
    status: { type: String, enum: ["Queued", "Running", "Success", "Failed"], default: "Queued" },
    recordsFetched: { type: Number, default: 0 },
    recordsUpdated: { type: Number, default: 0 },
    errors: [{ type: String }]
  },
  { timestamps: true }
);

export const SyncJob =
  mongoose.models.SyncJob || mongoose.model("SyncJob", SyncJobSchema);
