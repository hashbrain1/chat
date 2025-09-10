import React, { useEffect, useRef, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useWalletClient, useChainId, useDisconnect } from "wagmi";
import { getAddress as toChecksum } from "viem";

import ProfileMenu from "@/Wallet/ProfileMenu";
import api from "@/lib/axios";
import { prepareSiweMessage } from "@/lib/siwe";

export default function WalletButton({ variant = "navbar", onLogout, onLogin }) {
  const { address, isConnected, status } = useAccount(); // includes 'status'
  const { data: walletClient } = useWalletClient();
  const chainId = useChainId();
  const { disconnect } = useDisconnect();

  const [authed, setAuthed] = useState(false);
  const [signing, setSigning] = useState(false);
  const [blocked, setBlocked] = useState(false);

  // Detect mobile (for ProfileMenu variant only)
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Check cookie session only (does NOT open wallet or create nonce)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get("/auth/me", { withCredentials: true });
        if (mounted) setAuthed(Boolean(data?.authenticated));
      } catch {
        if (mounted) setAuthed(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // ---- SIWE flow (run ONLY after user connects) ----
  const [shouldRunSiwe, setShouldRunSiwe] = useState(false);

  // Detect a *user-initiated* connect:
  //  (connecting -> connected) OR (isConnected false -> true)
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

    if (userInitiated) setShouldRunSiwe(true);
  }, [status, isConnected]);

  // Actually run SIWE once wallet is connected and client is ready
  useEffect(() => {
    const run = async () => {
      if (!shouldRunSiwe) return;
      if (!isConnected || !walletClient || !address || authed || signing) return;

      try {
        setSigning(true);

        // Request nonce ONLY AFTER user-initiated connect
        const { data } = await api.get("/auth/nonce", { withCredentials: true });
        const nonce = data?.nonce;

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
        const res = await api.post(
          "/auth/verify",
          { message, signature },
          { withCredentials: true }
        );

        if (res.data?.ok) {
          setAuthed(true);
          setBlocked(false);
          if (typeof onLogin === "function") onLogin();
        } else {
          setAuthed(false);
        }
      } catch (err) {
        // If user cancels signing or error, allow them to try again
        console.error("❌ SIWE failed:", err);
        setAuthed(false);
        setBlocked(true);
      } finally {
        setSigning(false);
        setShouldRunSiwe(false); // prevent repeats until user reconnects
      }
    };
    run();
  }, [shouldRunSiwe, isConnected, walletClient, address, chainId, authed, signing, onLogin]);

  // Logout (also broadcasts hb-logout so other pages/components clear instantly)
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout error:", err);
    }
    setAuthed(false);
    setBlocked(false);
    disconnect();
    // notify other parts of the app
    window.dispatchEvent(new CustomEvent("hb-logout"));
    if (typeof onLogout === "function") onLogout();
  };

  // -------- UI (layout preserved) --------
  // Until SIWE auth succeeds, ALWAYS show the Connect button.
  // (No "preparing" text on load; SIWE only runs after user connects.)
  if (!authed) {
    if (blocked && !signing) setBlocked(false); // reset small flag between attempts
    return <ConnectButton chainStatus="icon" showBalance={false} />;
  }

  // After SIWE success, show Profile menu (wallet options)
  return (
    <ProfileMenu
      onLogout={handleLogout}
      variant={isMobile ? "mobile" : variant}
    />
  );
}
