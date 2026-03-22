import mongoose, { Schema } from "mongoose";

const BrandSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    logo: { type: String },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" }
  },
  { timestamps: true }
);

export const Brand = mongoose.models.Brand || mongoose.model("Brand", BrandSchema);
