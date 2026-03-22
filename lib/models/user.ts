import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: Schema.Types.ObjectId, ref: "Role" },
    status: { type: String, enum: ["Active", "Disabled"], default: "Active" },
    passwordHash: { type: String }
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
