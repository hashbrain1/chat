// src/pages/Upgrade.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { createPayment, fetchCoins } from "@/lib/payments";

const tiers = [
  {
    id: "plus",
    name: "Plus",
    price: 3,
    cadence: "month",
    cta: "Get Plus",
    highlight: true,
    features: [
      "Access to Hash 2.0",
      "Unlimited messaging",
      "Longer memory",
      "Unlimited deep search",
      "Early access to new features",
      "Image creation soon",
      "Real-time data",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 33,
    cadence: "month",
    cta: "Get Pro",
    highlight: false,
    features: [
      "Everything in Plus",
      "Live support from our team",
      "Advanced financial search",
    ],
  },
];

export default function Upgrade() {
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const [coins, setCoins] = useState({ usdt: [], top10: [] });
  const [selectedCoin, setSelectedCoin] = useState("USDTTRC20");

  // Load available coins
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchCoins(); // { usdt, top10 }
        setCoins(data);
        const prefers = ["USDTTRC20", "USDTBSC", "USDTERC20"];
        const flat = [...(data.usdt || []), ...(data.top10 || [])];
        const preferred = prefers.find((c) => flat.includes(c));
        if (preferred) setSelectedCoin(preferred);
      } catch (e) {
        console.warn("[Upgrade] coins fetch failed; continuing with defaults.", e?.message);
      }
    })();
  }, []);

  const subscribe = async (plan) => {
    setError("");
    if (!isConnected || !address) {
      setError("Please connect your wallet first.");
      return;
    }
    try {
      setLoading(plan.id);
      const payload = { amount: plan.price, payCurrency: selectedCoin, userAddress: address };
      console.log("[Upgrade] subscribe payload →", payload);

      const data = await createPayment(payload);
      console.log("[Upgrade] createPayment response ←", data);

      if (data?.error) {
        setError(data.error);
        return;
      }
      if (data?.invoice_url) {
        window.location.href = data.invoice_url; // Hosted NOWPayments checkout
        return;
      }
      setError("No invoice URL returned from server. Check backend logs.");
    } catch (e) {
      console.error("[Upgrade] subscribe error ←", e);
      setError(e?.message || "Payment failed. Please try again.");
    } finally {
      setLoading("");
    }
  };

  const options = [
    ...(coins.usdt || []).map((c) => ({ group: "USDT", value: c })),
    ...(coins.top10 || []).map((c) => ({ group: "Top", value: c })),
  ];

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white w-full mt-10">
      <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold">Upgrade your plan</h1>
          <Link to="/chat" className="rounded-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white">
            Back to Chat
          </Link>
        </div>

        {/* Coin selector */}
        <div className="mb-10">
          <label className="block mb-2 text-sm opacity-80">Pay with:</label>
          <select
            value={selectedCoin}
            onChange={(e) => setSelectedCoin(e.target.value)}
            className="bg-zinc-900/50 border border-zinc-700 rounded-lg px-3 py-2 text-sm"
          >
            {options.length === 0 ? (
              <option value="USDTTRC20">USDT – TRC20</option>
            ) : (
              options.map(({ group, value }) => (
                <option key={group + value} value={value}>
                  {group === "USDT" ? `USDT – ${value.replace("USDT", "")}` : value}
                </option>
              ))
            )}
          </select>
          <p className="mt-2 text-xs text-white/60">
            You’ll be redirected to a secure NOWPayments checkout page.
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
          {tiers.map((t) => (
            <div
              key={t.id}
              className={`rounded-2xl border shadow-2xl/10 bg-white/[0.03] backdrop-blur
                ${t.highlight ? "border-white/30" : "border-white/10"}`}
            >
              <div className="p-6 sm:p-8">
                <div className="text-xl sm:text-2xl font-bold mb-1">{t.name}</div>
                <div className="text-3xl sm:text-4xl font-extrabold">
                  ${t.price} <span className="text-base font-medium">/ {t.cadence}</span>
                </div>
                <button
                  onClick={() => subscribe(t)}
                  disabled={loading === t.id}
                  className={`mt-6 w-full rounded-full px-4 py-3 text-center font-semibold
                    ${
                      t.highlight
                        ? "bg-emerald-400 text-black hover:bg-emerald-300"
                        : "bg-white text-black hover:bg-white/90"
                    } disabled:opacity-60`}
                >
                  {loading === t.id ? "Processing…" : t.cta}
                </button>
                <ul className="mt-6 space-y-3 text-sm text-white/90">
                  {t.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {error && <p className="mt-6 text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}
