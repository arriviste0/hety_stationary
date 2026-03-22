import mongoose, { Schema } from "mongoose";

const OrderItemSchema = new Schema(
  {
    order: { type: Schema.Types.ObjectId, ref: "Order", index: true },
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    sku: { type: String },
    name: { type: String },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const OrderItem =
  mongoose.models.OrderItem || mongoose.model("OrderItem", OrderItemSchema);
