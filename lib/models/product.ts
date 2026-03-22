import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema(
  {
    sku: { type: String, required: true, unique: true, index: true },
    barcode: { type: String, index: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: { type: String },
    description: { type: String },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    subcategory: { type: Schema.Types.ObjectId, ref: "Category" },
    brand: { type: Schema.Types.ObjectId, ref: "Brand" },
    pricing: {
      mrp: { type: Number, required: true },
      sellingPrice: { type: Number, required: true },
      costPrice: { type: Number, required: true },
      discountPrice: { type: Number },
      gstPercent: { type: Number, default: 0 },
      hsnCode: { type: String },
      discountRules: [
        {
          ruleType: { type: String },
          value: { type: Number },
          minQty: { type: Number }
        }
      ]
    },
    inventory: {
      stockQuantity: { type: Number, default: 0 },
      reorderLevel: { type: Number, default: 10 },
      unit: { type: String, default: "pcs" },
      minOrderQty: { type: Number, default: 1 },
      maxOrderQty: { type: Number, default: 100 }
    },
    images: [{ type: Schema.Types.ObjectId, ref: "ProductImage" }],
    imageUrls: [{ type: String }],
    attributes: {
      color: { type: String },
      size: { type: String },
      packSize: { type: String },
      paperType: { type: String },
      gsm: { type: String },
      brandName: { type: String }
    },
    seo: {
      metaTitle: { type: String },
      metaDescription: { type: String }
    },
    visibility: {
      status: { type: String, enum: ["Active", "Inactive", "Draft"], default: "Active" },
      featured: { type: Boolean, default: false },
      tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }]
    },
    margMapping: {
      margItemCode: { type: String },
      lastSyncedAt: { type: Date }
    }
  },
  { timestamps: true }
);

export const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
