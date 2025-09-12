// src/pages/PaymentSuccess.jsx
import { Link } from "react-router-dom";

export default function PaymentSuccess() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold text-emerald-400 mb-4">✅ Payment Successful!</h1>
      <p className="mb-6">Your subscription has been activated.</p>
      <Link
        to="/chat"
        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded text-white"
      >
        Back to Chat
      </Link>
    </div>
  );
}
