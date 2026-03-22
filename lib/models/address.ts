import mongoose, { Schema } from "mongoose";

const AddressSchema = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: "Customer", index: true },
    label: { type: String },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String, default: "India" },
    isDefault: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Address =
  mongoose.models.Address || mongoose.model("Address", AddressSchema);
