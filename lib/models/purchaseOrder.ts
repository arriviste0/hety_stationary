import mongoose, { Schema } from "mongoose";

const PurchaseOrderSchema = new Schema(
  {
    poNumber: { type: String, required: true, unique: true, index: true },
    vendor: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
    status: {
      type: String,
      enum: ["Draft", "Pending", "Ordered", "Partially Received", "Received", "Cancelled"],
      default: "Draft"
    },
    orderDate: { type: Date, default: Date.now },
    expectedDate: { type: Date },
    receivedDate: { type: Date },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        sku: { type: String },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
        receivedQuantity: { type: Number, default: 0 },
        costPrice: { type: Number, required: true, default: 0 }
      }
    ],
    notes: { type: String },
    totalAmount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const PurchaseOrder =
  mongoose.models.PurchaseOrder || mongoose.model("PurchaseOrder", PurchaseOrderSchema);
