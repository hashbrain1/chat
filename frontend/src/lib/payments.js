// src/lib/payments.js
import axios from "axios";

const BASE = import.meta.env.VITE_BASE_PATH || "http://localhost:5000";

// Create hosted invoice
export async function createPayment({ amount, payCurrency, userAddress }) {
  const payload = { amount, payCurrency, userAddress };
  console.log("[createPayment] request →", BASE + "/payments/create", payload);

  try {
    const res = await axios.post(`${BASE}/payments/create`, payload, {
      withCredentials: true,
    });
    console.log("[createPayment] success ←", res.data);
    return res.data; // { invoice_url, invoice_id, ... }
  } catch (err) {
    const data = err?.response?.data;
    const status = err?.response?.status;
    console.error("[createPayment] error ←", { status, data, message: err.message });
    const msg =
      data?.error ||
      data?.message ||
      (status ? `Request failed (${status})` : "Request failed") +
        (data?.details ? `: ${JSON.stringify(data.details)}` : "");
    throw new Error(msg || err.message);
  }
}

// Optional: payment status by paymentId
export async function getPaymentStatus(paymentId) {
  try {
    const res = await axios.get(`${BASE}/payments/status/${paymentId}`, {
      withCredentials: true,
    });
    console.log("[getPaymentStatus] success ←", res.data);
    return res.data;
  } catch (err) {
    console.error("[getPaymentStatus] error ←", err?.response?.data || err.message);
    throw err;
  }
}

// Coins for dropdown (USDT variants + top coins)
export async function fetchCoins() {
  console.log("[fetchCoins] request →", BASE + "/payments/coins");
  try {
    const res = await axios.get(`${BASE}/payments/coins`, {
      withCredentials: true,
    });
    console.log("[fetchCoins] success ←", res.data);
    return res.data; // { usdt: [...], top10: [...] }
  } catch (err) {
    console.error("[fetchCoins] error ←", err?.response?.data || err.message);
    throw err;
  }
}
