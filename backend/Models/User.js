import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    address: { type: String, unique: true, index: true, required: true },
    lastLoginAt: { type: Date },

    // 🔹 Subscription fields
    isSubscribed: { type: Boolean, default: false },
    subscriptionExpiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

UserSchema.pre("save", function (next) {
  if (this.address) this.address = this.address.toLowerCase();
  next();
});

export default mongoose.model("User", UserSchema);
