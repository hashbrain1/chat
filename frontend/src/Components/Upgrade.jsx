// src/pages/Upgrade.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

const tiers = [
  {
    id: "free",
    name: "free",
    price: "0",
    cadence: "Unlimited",
    cta: "Switch to Plus",
    highlight: false,
    features: [
      "Access to Hash 1.0 version (standard)",
      "Limited messaging",
      "Shorter mermory",
      "Limited deep research",
      "Hash projects and task",
    ],
  },
  {
    id: "plus",
    name: "Plus",
    price: "$3",
    cadence: "month",
    cta: "Get Plus",
    highlight: true,
    features: [
      "Access to hash 2.0",
      "Unlimited messaging",
      "Hash projects and task",
      "Longer memory",
      "Unlimited deep search",
      "Early access to new features",
      "Image creation soon",
      "Real time data",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$199",
    cadence: "month",
    cta: "Get Pro",
    highlight: false,
    features: [
      "Access to hash 2.0",
      "Unlimited messaging",
      "Hash projects and task",
      "Longer memory",
      "Unlimited deep search",
      "Early access to new features",
      "Image creation soon",
      "Live support from our team",
      "Real time data",
      "Advance financial search",
    ],
  },
];

export default function Upgrade() {
  const [loading, setLoading] = useState("");

  const subscribe = async (planId) => {
    try {
      setLoading(planId);
      // TODO: call your backend here, e.g.:
      // await axios.post("/api/billing/subscribe", { plan: planId })
      // For now we just simulate:
      await new Promise((r) => setTimeout(r, 900));
      alert(`Subscribed to ${planId.toUpperCase()} (stub)`);
    } catch (e) {
      alert(e?.message || "Failed to subscribe");
    } finally {
      setLoading("");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white w-full mt-10">
      <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold">Upgrade your plan</h1>
          <Link
            to="/chat"
            className="rounded-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white"
          >
            Back to Chat
          </Link>
        </div>

        <div className="flex gap-2 mb-8">
          <button className="px-3 py-1 rounded-full bg-white text-black text-sm font-semibold">
            Personal
          </button>
          <button className="px-3 py-1 rounded-full bg-white/10 text-white text-sm">
            Business
          </button>
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.id}
              className={`rounded-2xl border shadow-2xl/10 bg-white/[0.03] backdrop-blur
                          ${
                            t.highlight ? "border-white/30" : "border-white/10"
                          }`}
            >
              <div className="p-6 sm:p-8">
                <div className="text-xl sm:text-2xl font-bold mb-1">
                  {t.name}
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold">
                  {t.price}{" "}
                  <span className="text-base font-medium">$ / {t.cadence}</span>
                </div>

                <button
                  onClick={() => subscribe(t.id)}
                  disabled={loading === t.id}
                  className={`mt-6 w-full rounded-full px-4 py-3 text-center font-semibold
                              ${
                                t.highlight
                                  ? "bg-emerald-400 text-black hover:bg-emerald-300"
                                  : "bg-white text-black hover:bg-white/90"
                              }
                              disabled:opacity-60`}
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

        {/* Fine print */}
        <p className="mt-10 text-xs text-white/60">
          Prices shown are for illustration. You can connect wallet and pay in
          HASH/crypto when billing is enabled.
        </p>
      </div>
    </div>
  );
}
