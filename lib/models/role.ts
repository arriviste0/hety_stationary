import mongoose, { Schema } from "mongoose";

const RoleSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    permissions: [{ type: String }]
  },
  { timestamps: true }
);

export const Role = mongoose.models.Role || mongoose.model("Role", RoleSchema);
