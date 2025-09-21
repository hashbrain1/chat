// Controllers/Chat.Controller.js
import { v4 as uuidv4 } from "uuid";
import openai from "../Utils/openai.js";
import { fetchRealTimeData } from "../Utils/tavily.js";
import finnhub from "../Utils/finnhub.js";   // 🔹 Added
import chatModel from "../Models/Chat.js";
import sessionModel from "../Models/Session.js";

export const sendMessage = async (req, res) => {
  try {
    let { messages, sessionId } = req.body;
    const owner = req.user?.address || null;

    if (!messages?.length) return res.status(400).json({ error: "messages[] required" });

    // Ensure session
    if (owner) {
      if (sessionId) {
        const s = await sessionModel.findOne({ sessionId, owner });
        if (!s) return res.status(404).json({ error: "Session not found" });
      } else {
        sessionId = uuidv4();
        await sessionModel.create({ sessionId, title: "New Chat", owner });
      }
    } else {
      sessionId = null;
    }

    const userMessage = messages[messages.length - 1]?.content || "";
    let rt = "";

    // 🔹 Finance queries → Finnhub
    if (/(btc|bitcoin|eth|ethereum|forex|eur|usd|inr|price|stock|market)/i.test(userMessage)) {
      try {
        if (/btc|bitcoin/i.test(userMessage)) {
          const { data } = await finnhub.get("/quote", { params: { symbol: "BINANCE:BTCUSDT" } });
          rt = `Current BTC/USDT price: $${data.c}`;
        } 
        else if (/eth|ethereum/i.test(userMessage)) {
          const { data } = await finnhub.get("/quote", { params: { symbol: "BINANCE:ETHUSDT" } });
          rt = `Current ETH/USDT price: $${data.c}`;
        } 
        else if (/usd.*inr|inr.*usd/i.test(userMessage)) {
          const { data } = await finnhub.get("/forex/rates", { params: { base: "USD" } });
          rt = `USD/INR rate: ₹${data.quote.INR}`;
        } 
        else if (/aapl|apple/i.test(userMessage)) {
          const { data } = await finnhub.get("/quote", { params: { symbol: "AAPL" } });
          rt = `Apple (AAPL) price: $${data.c}`;
        } 
        else if (/tsla|tesla/i.test(userMessage)) {
          const { data } = await finnhub.get("/quote", { params: { symbol: "TSLA" } });
          rt = `Tesla (TSLA) price: $${data.c}`;
        }
      } catch (err) {
        console.error("Finnhub fetch failed:", err.message);
      }
    }

    // 🔹 Fallback → Tavily (news, market info)
    if (!rt && /(news|today|latest|market)/i.test(userMessage)) {
      try { rt = await fetchRealTimeData(userMessage); } catch {}
    }

    // Build messages for OpenAI
    const modelMessages = [
      { role: "system", content: "You are Hash Brain AI. Be concise and accurate." },
      ...(rt ? [{ role: "system", content: `Real-time notes:\n${rt}` }] : []),
      ...messages,
    ];

    const model = process.env.OPENAI_MODEL || "gpt-5-nano";
    const completion = await openai.chat.completions.create({ model, messages: modelMessages });
    const reply = completion.choices?.[0]?.message?.content?.trim() || "…";

    // Save chat + update session title
    if (owner) {
      await chatModel.create({ sessionId, message: userMessage, response: reply, owner });
      await sessionModel.findOneAndUpdate(
        { sessionId, owner },
        { $set: { title: userMessage.slice(0, 40) + (userMessage.length > 40 ? "…" : "") } },
        { new: true }
      );
    }

    res.json({ sessionId, response: reply });
  } catch (e) {
    console.error("❌ Error in sendMessage:", e);
    res.status(500).json({ error: "Chat error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const owner = req.user?.address || null;
    if (!owner) return res.json([]);

    const { sessionId } = req.params;
    const s = await sessionModel.findOne({ sessionId, owner });
    if (!s) return res.status(404).json({ error: "Not found" });

    const chats = await chatModel.find({ sessionId, owner }).sort({ createdAt: 1 });
    res.json(chats);
  } catch (e) {
    console.error("❌ Error in getMessages:", e);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

export const getSessions = async (req, res) => {
  try {
    const owner = req.user?.address || null;
    if (!owner) return res.json([]);
    const sessions = await sessionModel.find({ owner }).sort({ updatedAt: -1 });
    res.json(sessions);
  } catch (e) {
    console.error("❌ Error in getSessions:", e);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
};

export const createSession = async (req, res) => {
  try {
    const owner = req.user?.address || null;
    if (!owner) return res.json({ sessionId: null, title: "New Chat" });
    const sessionId = uuidv4();
    const session = await sessionModel.create({ sessionId, title: "New Chat", owner });
    res.json(session);
  } catch (e) {
    console.error("❌ Error in createSession:", e);
    res.status(500).json({ message: "Failed to create session", error: e });
  }
};
