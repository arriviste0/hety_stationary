import mongoose, { Schema } from "mongoose";

const SyncLogSchema = new Schema(
  {
    job: { type: Schema.Types.ObjectId, ref: "SyncJob", index: true },
    level: { type: String, enum: ["Info", "Warning", "Error"], default: "Info" },
    message: { type: String, required: true }
  },
  { timestamps: true }
);

export const SyncLog =
  mongoose.models.SyncLog || mongoose.model("SyncLog", SyncLogSchema);
