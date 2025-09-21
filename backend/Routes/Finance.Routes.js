import { Router } from "express";
import {
  getForexRates,
  getCryptoQuote,
  getStockQuote,
  getMarketNews,
  getCompanyNews,
} from "../Controllers/Finance.Controller.js";

const router = Router();

router.get("/forex/rates", getForexRates);
router.get("/crypto/quote/:symbol", getCryptoQuote);
router.get("/stocks/quote/:symbol", getStockQuote);
router.get("/news/market", getMarketNews);
router.get("/news/company/:symbol", getCompanyNews);

export default router;
