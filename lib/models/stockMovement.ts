import mongoose, { Schema } from "mongoose";

const StockMovementSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    sku: { type: String, required: true },
    quantityChange: { type: Number, required: true },
    reason: { type: String },
    reference: { type: String },
    user: { type: String }
  },
  { timestamps: true }
);

export const StockMovement =
  mongoose.models.StockMovement ||
  mongoose.model("StockMovement", StockMovementSchema);
