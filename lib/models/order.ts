import mongoose, { Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    date: { type: Date, default: Date.now },
    customer: { type: Schema.Types.ObjectId, ref: "Customer" },
    paymentMode: {
      type: String,
      enum: ["COD", "PhonePe"],
      default: "COD"
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Pending", "Failed", "Refunded"],
      default: "Pending"
    },
    paymentGateway: { type: String },
    paymentGatewayOrderId: { type: String },
    paymentGatewayTransactionId: { type: String },
    paymentGatewayRedirectUrl: { type: String },
    metricsRecorded: { type: Boolean, default: false },
    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Packed",
        "Shipped",
        "Delivered",
        "Cancelled"
      ],
      default: "Pending"
    },
    totalAmount: { type: Number, required: true },
    shippingStatus: {
      type: String,
      enum: ["Not Shipped", "In Transit", "Delivered"],
      default: "Not Shipped"
    },
    source: { type: String, enum: ["Web", "Marg"], default: "Web" },
    invoiceNumber: { type: String },
    items: [{ type: Schema.Types.ObjectId, ref: "OrderItem" }],
    paymentTimeline: [
      {
        status: { type: String },
        date: { type: Date },
        note: { type: String }
      }
    ],
    shipment: {
      courier: { type: String },
      awb: { type: String },
      status: { type: String }
    },
    shippingAddress: {
      name: { type: String },
      phone: { type: String },
      line1: { type: String },
      line2: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String }
    },
    internalNotes: { type: String },
    customerNotes: { type: String },
    auditLog: [
      {
        status: { type: String },
        updatedBy: { type: String },
        updatedAt: { type: Date },
        note: { type: String }
      }
    ]
  },
  { timestamps: true }
);

export const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
