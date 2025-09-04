import { v4 as uuidv4 } from "uuid";
import openai from "../Utils/openai.js";
import { fetchRealTimeData } from "../Utils/tavily.js";
import chatModel from "../Models/Chat.js";
import sessionModel from "../Models/Session.js";


// Create / Send Message
export const sendMessage = async (req, res) => {
  let { messages, sessionId } = req.body;

  if (!sessionId) {
    sessionId = uuidv4(); // generate new chat session
    // create new session in DB
    await sessionModel.create({ sessionId, title: "New Chat" });
  }

  try {
    const userMessage = messages[messages.length - 1].content;

    // 1️⃣ Fetch real-time context
    const realTimeContext = await fetchRealTimeData(userMessage);

    // 2️⃣ Ask OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-5-nano",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant with real-time data.",
        },
        { role: "system", content: `Real-time info:\n${realTimeContext}` },
        ...messages,
      ],
    });

    const responseMessage = completion.choices[0].message.content;

    // 3️⃣ Save message in DB
    const chatEntry = new chatModel({
      sessionId,
      message: userMessage,
      response: responseMessage,
    });
    await chatEntry.save();

    // 4️⃣ Update session title if still "New Chat"
    await sessionModel.findOneAndUpdate(
      { sessionId },
      { $set: { title: userMessage.slice(0, 20) + "..." } },
      { new: true }
    );

    res.json({ sessionId, response: responseMessage });
  } catch (error) {
    console.error("Error in sendMessage:", error);
    return res
      .status(500)
      .json({ error: "Failed to get response from OpenAI" });
  }
};

// Get all messages of one session
export const getMessages = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const chats = await chatModel.find({ sessionId }).sort({ createdAt: 1 });
    res.json(chats);
  } catch (error) {
    console.error("Error in getMessages:", error);
    return res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// Get all sessions (for sidebar)
export const getSessions = async (req, res) => {
  try {
    const sessions = await sessionModel.find().sort({ updatedAt: -1 });
    res.json(sessions);
  } catch (error) {
    console.error("Error in getSessions:", error);
    return res.status(500).json({ error: "Failed to fetch sessions" });
  }
};


// export const createSession = async (req, res) => {
//   try {
//     // always create a fresh session
//     const session = new sessionModel({
//       sessionId: uuidv4(),
//       title: "New Chat",
//     });

//     await session.save();
//     res.status(201).json(session);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to create session", error });
//   }
// };

export const createSession = async (req, res) => {
  try {
    // 🚫 don't save to DB, just return placeholder
    const session = {
      sessionId: null,   // no ID yet
      title: "New Chat",
    };

    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: "Failed to create placeholder session", error });
  }
};