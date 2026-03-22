import mongoose, { Schema } from "mongoose";

const InventorySchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", index: true },
    sku: { type: String, required: true, index: true },
    currentStock: { type: Number, default: 0 },
    reorderLevel: { type: Number, default: 10 },
    stockStatus: { type: String, enum: ["In Stock", "Low", "Out"], default: "In Stock" },
    warehouse: { type: String }
  },
  { timestamps: true }
);

export const Inventory =
  mongoose.models.Inventory || mongoose.model("Inventory", InventorySchema);
