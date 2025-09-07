import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true },
    title: { type: String, default: "New Chat" }, // shown in sidebar
    owner: { type: String, index: true, required: true }, // wallet address (lowercased)
  },
  { timestamps: true }
);

sessionSchema.index({ owner: 1, updatedAt: -1 });

const sessionModel = mongoose.model("Session", sessionSchema);

export default sessionModel;
