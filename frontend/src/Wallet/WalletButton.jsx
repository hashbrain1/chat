import React, { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useWalletClient, useChainId, useDisconnect } from "wagmi";
import { getAddress as toChecksum } from "viem";

import ProfileMenu from "@/Wallet/ProfileMenu";
import api from "@/lib/axios";
import { prepareSiweMessage } from "@/lib/siwe";

export default function WalletButton({ variant = "navbar", onLogout, onLogin }) {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const chainId = useChainId();
  const { disconnect } = useDisconnect();

  const [authed, setAuthed] = useState(false);
  const [signing, setSigning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [blocked, setBlocked] = useState(false); // prevent retry loop after cancel

  // ✅ Check backend session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await api.get("/auth/me", { withCredentials: true });
        setAuthed(data?.authenticated || false);
      } catch {
        setAuthed(false);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  // ✅ Run SIWE only if wallet connected + no session
  useEffect(() => {
    const runSiwe = async () => {
      if (!isConnected || !walletClient || !address || authed || signing || loading || blocked)
        return;
      try {
        setSigning(true);

        // 1. Get nonce
        const { data } = await api.get("/auth/nonce", { withCredentials: true });
        const nonce = data?.nonce;

        // 2. Build SIWE message
        const domain = window.location.host; // frontend domain only
        const message = prepareSiweMessage({
          domain,
          address: toChecksum(address),
          statement: "Sign in to Hash Brain using your wallet.",
          uri: window.location.origin,
          version: "1",
          chainId: chainId || 1,
          nonce,
        });

        // 3. Sign message
        const signature = await walletClient.signMessage({
          account: address,
          message,
        });

        // 4. Verify with backend
        const res = await api.post(
          "/auth/verify",
          { message, signature },
          { withCredentials: true }
        );

        if (res.data?.ok) {
          setAuthed(true);
          if (typeof onLogin === "function") onLogin(); // ✅ refresh sessions
        }
      } catch (err) {
        console.error("❌ SIWE failed:", err);

        // If user cancels signing → stop retry loop
        if (err?.code === 4001 || err?.message?.toLowerCase().includes("user rejected")) {
          setBlocked(true);
        }

        setAuthed(false);
      } finally {
        setSigning(false);
      }
    };

    runSiwe();
  }, [isConnected, walletClient, address, chainId, authed, signing, loading, blocked, onLogin]);

  // ✅ Logout clears cookies + sessions + wallet
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout error:", err);
    }

    setAuthed(false);
    setBlocked(false);
    disconnect();

    if (typeof onLogout === "function") onLogout(); // ✅ clear chat history immediately
  };

  // ✅ UI states
  if (!isConnected) return <ConnectButton chainStatus="icon" showBalance={false} />;
  if (loading) return <div className="text-sm text-gray-500">Checking session…</div>;
  if (signing && !authed) return <div className="text-sm text-gray-500">Check your wallet…</div>;
  if (authed) return <ProfileMenu onLogout={handleLogout} variant={variant} />;
  if (blocked) {
    return (
      <button
        onClick={() => setBlocked(false)}
        className="text-sm text-red-500 underline"
      >
        Sign-in cancelled. Retry?
      </button>
    );
  }

  return <div className="text-sm text-gray-500">Preparing sign-in…</div>;
}
