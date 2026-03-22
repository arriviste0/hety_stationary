import mongoose, { Schema } from "mongoose";

const AdminUserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["super_admin", "product_manager", "order_manager", "inventory_manager"],
      required: true
    },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" }
  },
  { timestamps: true }
);

export const AdminUser =
  mongoose.models.AdminUser || mongoose.model("AdminUser", AdminUserSchema);
