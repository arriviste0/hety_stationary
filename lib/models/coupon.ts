import mongoose, { Schema } from "mongoose";

const CouponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    type: { type: String, enum: ["Flat", "Percentage"], default: "Flat" },
    discountValue: { type: Number, default: 0 },
    minimumCartValue: { type: Number, default: 0 },
    maximumDiscount: { type: Number, default: 0 },
    validFrom: { type: Date },
    validTo: { type: Date },
    usageLimit: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Coupon =
  mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);
