import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String },
    sortOrder: { type: Number, default: 0 },
    visibility: { type: String, enum: ["Visible", "Hidden"], default: "Visible" },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    parent: { type: Schema.Types.ObjectId, ref: "Category" }
  },
  { timestamps: true }
);

export const Category =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);
