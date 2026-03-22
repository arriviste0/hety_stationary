import mongoose, { Schema } from "mongoose";

const BannerSchema = new Schema(
  {
    imageUrl: { type: String, required: true },
    linkUrl: { type: String },
    activeFrom: { type: Date },
    activeTo: { type: Date },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Banner =
  mongoose.models.Banner || mongoose.model("Banner", BannerSchema);
