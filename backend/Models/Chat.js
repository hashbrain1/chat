import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true }, // unique chat session
    message: { type: String, required: true },
    response: { type: String, required: true },
    owner: { type: String, index: true, required: true }, // wallet address
  },
  { timestamps: true }
);

chatSchema.index({ owner: 1, sessionId: 1, createdAt: 1 });

const chatModel = mongoose.model("Chat", chatSchema);

export default chatModel;
