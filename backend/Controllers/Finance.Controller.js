import finnhub from "../Utils/finnhub.js";

// Forex rates
export const getForexRates = async (req, res) => {
  try {
    const base = (req.query.base || "USD").toUpperCase();
    const { data } = await finnhub.get("/forex/rates", { params: { base } });
    res.json(data);
  } catch (e) {
    console.error("getForexRates error:", e.message);
    res.status(500).json({ error: "Failed to fetch forex rates" });
  }
};

// Crypto quote (current price etc.)
export const getCryptoQuote = async (req, res) => {
  try {
    const { symbol } = req.params; // e.g. BINANCE:BTCUSDT
    if (!symbol) return res.status(400).json({ error: "symbol required" });

    const { data } = await finnhub.get("/quote", { params: { symbol } });
    res.json(data);
  } catch (e) {
    console.error("getCryptoQuote error:", e.message);
    res.status(500).json({ error: "Failed to fetch crypto quote" });
  }
};

// Stock quote
export const getStockQuote = async (req, res) => {
  try {
    const { symbol } = req.params; // e.g. AAPL, TSLA, MSFT
    if (!symbol) return res.status(400).json({ error: "symbol required" });

    const { data } = await finnhub.get("/quote", { params: { symbol } });
    res.json(data);
  } catch (e) {
    console.error("getStockQuote error:", e.message);
    res.status(500).json({ error: "Failed to fetch stock quote" });
  }
};

// Latest market news
export const getMarketNews = async (req, res) => {
  try {
    // category: general, forex, crypto, merger
    const category = req.query.category || "general";
    const { data } = await finnhub.get("/news", { params: { category } });
    res.json(data);
  } catch (e) {
    console.error("getMarketNews error:", e.message);
    res.status(500).json({ error: "Failed to fetch market news" });
  }
};

// Company-specific news
export const getCompanyNews = async (req, res) => {
  try {
    const { symbol } = req.params; // e.g. AAPL
    if (!symbol) return res.status(400).json({ error: "symbol required" });

    const today = new Date();
    const from = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000) // 7 days back
      .toISOString()
      .slice(0, 10);
    const to = today.toISOString().slice(0, 10);

    const { data } = await finnhub.get(`/company-news`, {
      params: { symbol, from, to },
    });
    res.json(data);
  } catch (e) {
    console.error("getCompanyNews error:", e.message);
    res.status(500).json({ error: "Failed to fetch company news" });
  }
};
