import mongoose, { Schema } from "mongoose";

const PaymentSchema = new Schema(
  {
    order: { type: Schema.Types.ObjectId, ref: "Order", index: true },
    method: { type: String },
    status: {
      type: String,
      enum: ["Paid", "Pending", "Failed", "Refunded"],
      default: "Pending"
    },
    amount: { type: Number, required: true },
    transactions: [
      {
        status: { type: String },
        date: { type: Date },
        reference: { type: String }
      }
    ]
  },
  { timestamps: true }
);

export const Payment =
  mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
