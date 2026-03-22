import mongoose, { Schema } from "mongoose";

const TagSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true }
  },
  { timestamps: true }
);

export const Tag = mongoose.models.Tag || mongoose.model("Tag", TagSchema);
