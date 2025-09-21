import axios from "axios";

const finnhub = axios.create({
  baseURL: "https://finnhub.io/api/v1",
  timeout: 10000,
  params: { token: process.env.FINNHUB_API_KEY },
});

export default finnhub;
