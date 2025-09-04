import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true },
    title: { type: String, default: "New Chat" }, // shown in sidebar
  },
  { timestamps: true }
);

const sessionModel = mongoose.model("Session", sessionSchema);

export default sessionModel