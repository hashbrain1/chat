import React, { useEffect, useRef, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useChainId,
  useDisconnect,
  useWalletClient,
} from "wagmi";
import { getAddress as toChecksum } from "viem";
import api from "@/lib/axios";
import { prepareSiweMessage } from "@/lib/siwe";

export default function WalletButton() {
  const { address, isConnected, status } = useAccount(); // 'connecting' | 'reconnecting' | 'connected' | 'disconnected'
  const chainId = useChainId();
  const { disconnect } = useDisconnect();
  const { data: walletClient } = useWalletClient();

  const [authed, setAuthed] = useState(false);
  const [signing, setSigning] = useState(false);
  const [autoTried, setAutoTried] = useState(false);
  const prevStatus = useRef(status);
  const loggingOutRef = useRef(false);

  // Keep UI in sync with server session after refresh/account change
  useEffect(() => {
    setAutoTried(false);
    api.get("/auth/me")
      .then(({ data }) => setAuthed(!!data?.authenticated))
      .catch(() => setAuthed(false));
  }, [address]);

  // Auto SIWE when wallet is truly ready
  useEffect(() => {
    if (
      status === "connected" &&
      isConnected &&
      address &&
      walletClient &&
      !authed &&
      !signing &&
      !autoTried
    ) {
      (async () => {
        try {
          setSigning(true);
          setAutoTried(true);

          // 1) nonce (sets siwe_nonce cookie)
          const { data } = await api.get("/auth/nonce");
          const nonce = data?.nonce;
          if (!nonce) throw new Error("No nonce from server");

          // 2) domain must equal backend host
          const backendHost = new URL(
            import.meta.env.VITE_BASE_PATH || window.location.origin
          ).host;

          // 3) build + sign message
          const message = prepareSiweMessage({
            domain: backendHost,
            address: toChecksum(address),
            statement: "Sign in to Hash Brain using your wallet.",
            uri: window.location.origin,
            version: "1",
            chainId: chainId || 1,
            nonce,
          });

          const signature = await walletClient.signMessage({
            account: address,
            message,
          });

          // 4) verify (sets hb_sess cookie)
          const res = await api.post("/auth/verify", { message, signature });
          setAuthed(!!res.data?.ok);
        } catch (e) {
          console.error("Auto SIWE failed:", e);
          setAuthed(false);
        } finally {
          setSigning(false);
        }
      })();
    }
  }, [
    status,
    isConnected,
    address,
    walletClient,
    authed,
    signing,
    autoTried,
    chainId,
  ]);

  // Log out server session when user truly disconnects (connected → disconnected)
  useEffect(() => {
    const prev = prevStatus.current;
    if (prev === "connected" && status === "disconnected" && authed && !loggingOutRef.current) {
      loggingOutRef.current = true;
      api.post("/auth/logout").finally(() => {
        setAuthed(false);
        loggingOutRef.current = false;
      });
    }
    prevStatus.current = status;
  }, [status, authed]);

  async function handleLogout() {
    if (loggingOutRef.current) return;
    loggingOutRef.current = true;
    try {
      await api.post("/auth/logout"); // clears HttpOnly cookie on server
      setAuthed(false);
      if (isConnected) disconnect();  // also disconnect wallet
    } catch (e) {
      console.error("logout error", e);
    } finally {
      loggingOutRef.current = false;
    }
  }

  // Shared pill classes so "Signed in" == "Logout" size/shape
  const pill = "rounded-full px-4 py-2 text-sm font-semibold bg-black text-white hover:bg-neutral-900 shadow-sm";

  return (
    <div className="flex items-center gap-3">
      {/* RainbowKit connect pill (themed to black in WalletProvider) */}
      <ConnectButton accountStatus="address" chainStatus="icon" showBalance={false} />

      {/* Status pill (same padding as Logout) */}
      {signing ? (
        <span className={pill}>Signing…</span>
      ) : authed ? (
        <span className={pill}>Signed in ✓</span>
      ) : null}

      {/* Logout pill (same padding) */}
      {authed && (
        <button
          onClick={handleLogout}
          className={`${pill} hover:opacity-90 focus:ring-2 focus:ring-black/30`}
        >
          Logout
        </button>
      )}
    </div>
  );
}
