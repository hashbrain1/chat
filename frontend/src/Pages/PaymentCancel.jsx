// src/pages/PaymentCancel.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";

export default function PaymentCancel() {
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);

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
      {!confirm ? (
        <div className="max-w-md w-full bg-zinc-900/70 border border-zinc-700 rounded-2xl p-8 text-center shadow-xl">
          <h1 className="text-2xl font-bold mb-4">Cancel Payment?</h1>
          <p className="text-white/80 mb-6">
            {finalAddr
              ? `Payment attempt from wallet ${finalAddr.slice(0, 6)}…${finalAddr.slice(-4)} was interrupted.`
              : "Payment attempt was interrupted."}
            <br />
            Do you really want to cancel your subscription upgrade?
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setConfirm(true)}
              className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium"
            >
              Yes, Cancel
            </button>
            <button
              onClick={() => navigate("/upgrade")}
              className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black font-medium"
            >
              Back to Payment
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-md w-full bg-zinc-900/70 border border-zinc-700 rounded-2xl p-8 text-center shadow-xl">
          <h1 className="text-2xl font-bold mb-4 text-red-400">Payment Cancelled</h1>
          <p className="text-white/80 mb-6">
            Your subscription upgrade has been cancelled.
          </p>
          <Link
            to="/chat"
            className="inline-block px-6 py-2 rounded-lg bg-white text-black font-semibold hover:bg-white/90"
          >
            Back to Chat
          </Link>
        </div>
      )}
    </div>
  );
}
