import mongoose, { Schema } from "mongoose";

const VendorSchema = new Schema(
  {
    supplierName: { type: String, required: true, index: true },
    contactPerson: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String },
    gstNumber: { type: String },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active"
    }
  },
  { timestamps: true }
);

export const Vendor = mongoose.models.Vendor || mongoose.model("Vendor", VendorSchema);
