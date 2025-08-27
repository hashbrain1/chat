import OpenAI from "openai";
import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import axios from "axios";

const app = express();
const port = 5000;

dotenv.config();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🔎 Function to fetch Tavily real-time results
async function fetchRealTimeData(query) {
  try {
    const response = await axios.post(
      "https://api.tavily.com/search",
      { query, max_results: 5 },
      { headers: { Authorization: `Bearer ${process.env.TAVILY_API_KEY}` } }
    );

    return response.data.results
      .map((r) => `• ${r.title}: ${r.content}`)
      .join("\n");
  } catch (err) {
    console.error("Tavily error:", err.message);
    return "No real-time data available.";
  }
}

app.post("/chat", async (req, res) => {
  const { messages } = req.body;

  try {
    const userMessage = messages[messages.length - 1].content;

    // Step 1: Fetch real-time context from Tavily
    const realTimeContext = await fetchRealTimeData(userMessage);

    // Step 2: Pass both real-time context + user question to GPT
    const completion = await openai.chat.completions.create({
      model: "gpt-5-nano", // Or switch to "gpt-5" if you want more powerful
      messages: [
        { role: "system", content: "You are a helpful assistant with real-time data." },
        { role: "system", content: `Real-time info:\n${realTimeContext}` },
        ...messages, // include user’s conversation
      ],
    });

    const responseMessage = completion.choices[0].message.content;
    res.json({ message: responseMessage });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to get response from OpenAI" });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
