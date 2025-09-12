// src/pages/PaymentCancel.jsx
import { Link } from "react-router-dom";

export default function PaymentCancel() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold text-red-500 mb-4">❌ Payment Canceled</h1>
      <p className="mb-6">Your payment was canceled. Please try again.</p>
      <Link
        to="/upgrade"
        className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded text-white"
      >
        Back to Upgrade
      </Link>
    </div>
  );
}
