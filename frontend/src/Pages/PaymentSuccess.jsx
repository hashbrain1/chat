// src/pages/PaymentSuccess.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";

export default function PaymentSuccess() {
  const { address, isConnected } = useAccount();

  // Fallback for Trust Wallet refresh
  const storedAddr = (() => {
    try {
      return localStorage.getItem("hb-auth-addr") || "";
    } catch {
      return "";
    }
  })();
  const finalAddr = isConnected ? address : storedAddr;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      <div className="max-w-md w-full bg-zinc-900/70 border border-zinc-700 rounded-2xl p-8 text-center shadow-xl">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-black"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2 text-emerald-400">
          Payment Successful
        </h1>
        <p className="text-white/80 mb-6">
          {finalAddr
            ? `Your subscription upgrade was confirmed for wallet ${finalAddr.slice(0, 6)}…${finalAddr.slice(-4)}.`
            : "Your subscription upgrade was confirmed."}
        </p>
        <Link
          to="/chat"
          className="inline-block px-6 py-2 rounded-lg bg-emerald-500 text-black font-semibold hover:bg-emerald-400"
        >
          Go to Chat
        </Link>
      </div>
    </div>
  );
}
