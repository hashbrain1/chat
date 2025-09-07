import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    address: { type: String, unique: true, index: true, required: true }, // 0x...
    lastLoginAt: Date,
    // add: role, plan, username etc.
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
