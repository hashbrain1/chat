import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    message: { type: String, required: true },
    response: { type: String, required: true },
    owner: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

chatSchema.index({ owner: 1, sessionId: 1, createdAt: 1 });

const chatModel = mongoose.model("Chat", chatSchema);
export default chatModel;
