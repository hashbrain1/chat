import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    address: { type: String, unique: true, index: true, required: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

UserSchema.pre("save", function (next) {
  if (this.address) this.address = this.address.toLowerCase();
  next();
});

export default mongoose.model("User", UserSchema);
