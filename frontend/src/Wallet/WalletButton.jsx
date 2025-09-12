import React, { useEffect, useRef, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useWalletClient, useChainId, useDisconnect } from "wagmi";
import { getAddress as toChecksum } from "viem";

import ProfileMenu from "@/Wallet/ProfileMenu";
import { authApi } from "@/lib/axios";
import { prepareSiweMessage } from "@/lib/siwe";

export default function WalletButton({ variant = "navbar", onLogout, onLogin }) {
  const { address, isConnected, status } = useAccount();
  const { data: walletClient } = useWalletClient();
  const chainId = useChainId();
  const { disconnect } = useDisconnect();

  const [authed, setAuthed] = useState(false);
  const [signing, setSigning] = useState(false);

  // ✅ Prevent auto-SIWE on refresh
  useEffect(() => {
    localStorage.setItem("hb_skip_autosiwe", "1");
  }, []);

  // ✅ Check backend cookie session on mount
  useEffect(() => {
    (async () => {
      try {
        const { data } = await authApi.get("/auth/me");
        setAuthed(Boolean(data?.authenticated));
      } catch {
        setAuthed(false);
      }
    })();
  }, []);

  // ----------------- SIWE -----------------
  const [shouldRunSiwe, setShouldRunSiwe] = useState(false);
  const lastStatusRef = useRef(status);
  const lastIsConnectedRef = useRef(isConnected);

  useEffect(() => {
    const prevStatus = lastStatusRef.current;
    const prevIsConn = lastIsConnectedRef.current;
    lastStatusRef.current = status;
    lastIsConnectedRef.current = isConnected;

    const userInitiated =
      (prevStatus === "connecting" && status === "connected") ||
      (!prevIsConn && isConnected);

    // ✅ Only run SIWE if user clicked connect (not auto-restore)
    if (userInitiated && !localStorage.getItem("hb_skip_autosiwe")) {
      setShouldRunSiwe(true);
    }
  }, [status, isConnected]);

  useEffect(() => {
    const run = async () => {
      if (!shouldRunSiwe) return;
      if (!isConnected || !walletClient || !address || authed || signing) return;

      try {
        setSigning(true);

        const { data: nonceRes } = await authApi.get("/auth/nonce");
        const nonce = nonceRes?.nonce;

        const message = prepareSiweMessage({
          domain: window.location.host,
          address: toChecksum(address),
          statement: "Sign in to Hash Brain using your wallet.",
          uri: window.location.origin,
          version: "1",
          chainId: chainId || 1,
          nonce,
        });

        const signature = await walletClient.signMessage({ account: address, message });
        const res = await authApi.post("/auth/verify", { message, signature });

        if (res.data?.ok) {
          setAuthed(true);
          if (typeof onLogin === "function") onLogin();
        } else {
          setAuthed(false);
        }
      } catch (err) {
        console.error("❌ SIWE failed:", err);
        setAuthed(false);
      } finally {
        setSigning(false);
        setShouldRunSiwe(false);
      }
    };
    run();
  }, [shouldRunSiwe, isConnected, walletClient, address, chainId, authed, signing, onLogin]);

  const handleLogout = async () => {
    try {
      await authApi.post("/auth/logout");
    } catch {}
    setAuthed(false);
    disconnect();

    // ✅ Clear WalletConnect/RainbowKit sessions
    try {
      localStorage.removeItem("wagmi.store");
      localStorage.removeItem("walletconnect");
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith("wc@") || k.includes("walletconnect")) {
          localStorage.removeItem(k);
        }
      });
    } catch (err) {
      console.warn("Storage cleanup failed:", err);
    }

    if (typeof onLogout === "function") onLogout();
  };

  // ✅ Always prioritize cookie session
  if (authed) {
    return <ProfileMenu onLogout={handleLogout} variant={variant} />;
  }

  return (
    <ConnectButton
      chainStatus="icon"
      showBalance={false}
      // ✅ When user clicks connect, allow SIWE again
      onConnect={() => localStorage.removeItem("hb_skip_autosiwe")}
    />
  );
}
