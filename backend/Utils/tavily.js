import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const fetchRealTimeData = async (query) => {
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
};
