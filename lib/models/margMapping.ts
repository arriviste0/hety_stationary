import mongoose, { Schema } from "mongoose";

const MargMappingSchema = new Schema(
  {
    mappingType: { type: String, enum: ["Product", "Customer"], required: true },
    margCode: { type: String, required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    customer: { type: Schema.Types.ObjectId, ref: "Customer" },
    lastSyncedAt: { type: Date },
    syncStatus: { type: String, enum: ["Synced", "Pending", "Failed"], default: "Pending" }
  },
  { timestamps: true }
);

export const MargMapping =
  mongoose.models.MargMapping ||
  mongoose.model("MargMapping", MargMappingSchema);
