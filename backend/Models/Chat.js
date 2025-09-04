import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true }, // unique chat session
    message: { type: String, required: true },
    response: { type: String, required: true },
  },
  { timestamps: true }
);

const chatModel = mongoose.model("Chat", chatSchema);

export default chatModel;
