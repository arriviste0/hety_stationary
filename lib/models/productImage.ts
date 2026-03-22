import mongoose, { Schema } from "mongoose";

const ProductImageSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", index: true },
    url: { type: String, required: true },
    altText: { type: String },
    isPrimary: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const ProductImage =
  mongoose.models.ProductImage ||
  mongoose.model("ProductImage", ProductImageSchema);
