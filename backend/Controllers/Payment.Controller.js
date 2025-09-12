// Controllers/Payment.Controller.js
import axios from "axios";
import User from "../Models/User.js";

// Safe env defaults for local dev
const FRONTEND =
  process.env.FRONTEND_URL ||
  process.env.FRONTEND_URL1 ||
  process.env.FRONTEND_URL2 ||
  "http://localhost:5173";

const BACKEND =
  process.env.BACKEND_URL ||
  `http://localhost:${process.env.PORT || 5000}`;

// ---- helpers ---------------------------------------------------------------

async function getMinUSDForCurrency(currency) {
  try {
    const r = await axios.get(
      `https://api.nowpayments.io/v1/min-amount?currency_from=usd&currency_to=${encodeURIComponent(
        currency
      )}`,
      { headers: { "x-api-key": process.env.NOWPAYMENTS_API_KEY } }
    );
    return Number(r?.data?.min_amount || 0);
  } catch (e) {
    console.warn("[min-amount] failed:", e?.response?.data || e.message);
    return 0; // don't block invoice creation if precheck fails
  }
}

// ---- controllers -----------------------------------------------------------

/**
 * POST /payments/create
 * Always returns a hosted checkout invoice_url (Invoice API).
 * If selected coin is below NOWPayments minimum → falls back to coin selector.
 */
export const createPayment = async (req, res) => {
  try {
    const { amount, userAddress, payCurrency } = req.body;

    if (!process.env.NOWPAYMENTS_API_KEY) {
      return res.status(500).json({ error: "NOWPAYMENTS_API_KEY is missing" });
    }
    if (!amount || !userAddress) {
      return res.status(400).json({ error: "Missing required params" });
    }

    const orderId = `order_${Date.now()}_${userAddress}`;

    // Decide if we preselect the currency (based on min-amount)
    let preselect = false;
    let note;

    if (payCurrency) {
      const minUSD = await getMinUSDForCurrency(payCurrency);
      if (!minUSD || amount >= minUSD) {
        preselect = true;
      } else {
        note = `Selected coin requires at least $${minUSD}. Opening checkout with coin selection.`;
      }
    }

    const body = {
      price_amount: amount,
      price_currency: "usd",
      order_id: orderId,
      order_description: "Hash Brain AI Subscription",
      ipn_callback_url: `${BACKEND}/payments/ipn`,
      success_url: `${FRONTEND}/upgrade/success`,
      cancel_url: `${FRONTEND}/upgrade/cancel`,
    };
    if (preselect && payCurrency) body.pay_currency = payCurrency;

    console.log("[invoice:create] →", body);

    const resp = await axios.post("https://api.nowpayments.io/v1/invoice", body, {
      headers: {
        "x-api-key": process.env.NOWPAYMENTS_API_KEY,
        "Content-Type": "application/json",
      },
    });

    console.log("[invoice:create] ←", resp.data);

    // 👇 FIX: NOWPayments returns `invoice_url` (sometimes docs show `url`)
    const { id, invoice_url, url, status } = resp.data || {};
    const finalUrl = invoice_url || url;

    if (!finalUrl) {
      return res.status(500).json({
        error: "Invoice created but invoice_url/url missing from NOWPayments response.",
        details: resp.data,
      });
    }

    return res.json({
      invoice_id: id,
      invoice_status: status,
      invoice_url: finalUrl,             // frontend expects this
      note,
      preselected_currency: preselect ? payCurrency : null,
    });
  } catch (err) {
    const status = err?.response?.status || 500;
    const details = err?.response?.data || err.message;
    console.error("❌ /payments/create failed:", { status, details });
    return res.status(500).json({ error: "Payment creation failed", details });
  }
};

/**
 * GET /payments/status/:paymentId
 * (Optional) Check payment by NOWPayments paymentId
 */
export const getPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const r = await axios.get(
      `https://api.nowpayments.io/v1/payment/${paymentId}`,
      { headers: { "x-api-key": process.env.NOWPAYMENTS_API_KEY } }
    );
    res.json(r.data);
  } catch (err) {
    console.error("❌ Status check error:", err?.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch payment status" });
  }
};

/**
 * POST /payments/ipn
 * IPN webhook: activates subscription when status === "finished"
 */
export const handleIPN = async (req, res) => {
  try {
    const { payment_status, order_id } = req.body;
    console.log("[IPN] payload ←", req.body);

    if (payment_status === "finished" && order_id) {
      const wallet = order_id.split("_").pop()?.toLowerCase();
      if (wallet) {
        const user = await User.findOne({ address: wallet });
        if (user) {
          const now = new Date();
          const base =
            user.subscriptionExpiresAt && user.subscriptionExpiresAt > now
              ? new Date(user.subscriptionExpiresAt)
              : new Date(now);
          base.setDate(base.getDate() + 30);

          user.isSubscribed = true;
          user.subscriptionExpiresAt = base;
          await user.save();

          console.log(`🎉 Subscription activated for ${user.address} until ${user.subscriptionExpiresAt}`);
        }
      }
    }
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ IPN error:", err?.response?.data || err.message);
    res.sendStatus(400);
  }
};

/**
 * GET /payments/coins
 * Returns USDT variants + top majors currently supported
 */
export const getAvailableCoins = async (req, res) => {
  try {
    const r = await axios.get("https://api.nowpayments.io/v1/merchant/coins", {
      headers: { "x-api-key": process.env.NOWPAYMENTS_API_KEY },
    });
    const all = r.data.selectedCurrencies || [];
    const usdt = all.filter((c) => c.startsWith("USDT"));
    const TOP10 = ["BTC", "ETH", "BNBMAINNET", "USDC", "MATIC", "DOGE", "XRP", "SOL", "TRX", "LTC"];
    const top10 = TOP10.filter((c) => all.includes(c));
    res.json({ usdt, top10 });
  } catch (e) {
    console.error("❌ Coins fetch error:", e?.response?.data || e.message);
    res.status(500).json({ error: "Failed to fetch coins" });
  }
};
