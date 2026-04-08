import mongoose, { Schema } from "mongoose";

const CustomerSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String, unique: true, sparse: true, index: true },
    passwordHash: { type: String },
    authProvider: {
      type: String,
      enum: ["password", "google"],
      default: "password"
    },
    googleId: { type: String, sparse: true, index: true },
    emailVerified: { type: Boolean, default: false },
    emailVerification: {
      codeHash: { type: String },
      expiresAt: { type: Date },
      sentAt: { type: Date },
      attempts: { type: Number, default: 0 },
      lastAttemptAt: { type: Date }
    },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    totalOrders: { type: Number, default: 0 },
    totalSpend: { type: Number, default: 0 },
    lastOrderDate: { type: Date },
    notes: { type: String },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    wishlist: [{ type: String }],
    creditLimit: { type: Number, default: 0 },
    creditBalance: { type: Number, default: 0 },
    addresses: [
      {
        name: { type: String },
        phone: { type: String },
        line1: { type: String },
        line2: { type: String },
        city: { type: String },
        state: { type: String },
        postalCode: { type: String },
        country: { type: String, default: "India" },
        isDefault: { type: Boolean, default: false }
      }
    ],
    preferences: {
      email: { type: Boolean, default: true },
      offers: { type: Boolean, default: true },
      orders: { type: Boolean, default: true }
    },
    margMapping: {
      margPartyCode: { type: String },
      syncStatus: { type: String, enum: ["Synced", "Pending", "Failed"], default: "Pending" }
    }
  },
  { timestamps: true }
);

export const Customer =
  mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);
