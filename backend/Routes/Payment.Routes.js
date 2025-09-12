// Routes/Payment.Routes.js
import { Router } from "express";
import {
  createPayment,
  getPaymentStatus,
  handleIPN,
  getAvailableCoins,
} from "../Controllers/Payment.Controller.js";

const router = Router();

router.post("/create", createPayment);
router.get("/status/:paymentId", getPaymentStatus);
router.post("/ipn", handleIPN);
router.get("/coins", getAvailableCoins);

export default router;
