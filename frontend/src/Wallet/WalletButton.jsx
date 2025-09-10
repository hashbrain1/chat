import React, { useEffect, useRef, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useWalletClient, useChainId, useDisconnect } from "wagmi";
import { getAddress as toChecksum } from "viem";

import ProfileMenu from "@/Wallet/ProfileMenu";
import api from "@/lib/axios";
import { prepareSiweMessage } from "@/lib/siwe";

export default function WalletButton({ variant = "navbar", onLogout, onLogin }) {
  const { address, isConnected, status } = useAccount(); // connecting / connected / ...
  const { data: walletClient } = useWalletClient();
  const chainId = useChainId();
  const { disconnect } = useDisconnect();

  const [authed, setAuthed] = useState(false);
  const [signing, setSigning] = useState(false);
  const [blocked, setBlocked] = useState(false);

  // Prefetched SIWE nonce to speed up mobile
  const [prefetchedNonce, setPrefetchedNonce] = useState(null);
  const [prefetching, setPrefetching] = useState(false);

  // Mobile variant for ProfileMenu only (no layout change)
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Check cookie session (does NOT open wallet nor create nonce)
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
    return () => { mounted = false; };
  }, []);

  // Cross-tab sync (login/logout)
  useEffect(() => {
    const onLocalLogout = () => {
      setAuthed(false);
      setPrefetchedNonce(null);
      try { disconnect(); } catch {}
    };
    const onLocalLogin = () => setAuthed(true);

    window.addEventListener("hb-logout", onLocalLogout);
    window.addEventListener("hb-login", onLocalLogin);

    let bc;
    if ("BroadcastChannel" in window) {
      bc = new BroadcastChannel("hb-auth");
      bc.onmessage = (evt) => {
        if (evt?.data?.type === "logout") onLocalLogout();
        if (evt?.data?.type === "login") onLocalLogin();
      };
    }
    const onStorage = (e) => {
      if (e.key === "hb-auth-evt" && e.newValue) {
        try {
          const p = JSON.parse(e.newValue);
          if (p?.type === "logout") onLocalLogout();
          if (p?.type === "login") onLocalLogin();
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("hb-logout", onLocalLogout);
      window.removeEventListener("hb-login", onLocalLogin);
      window.removeEventListener("storage", onStorage);
      if (bc) bc.close();
    };
  }, [disconnect]);

  // ----------------- Gate SIWE to user-initiated connect -----------------
  const [shouldRunSiwe, setShouldRunSiwe] = useState(false);
  const lastStatusRef = useRef(status);
  const lastIsConnectedRef = useRef(isConnected);

  // Prefetch nonce as soon as the user starts connecting (mobile win)
  const prefetchNonce = async () => {
    if (prefetching || prefetchedNonce) return;
    try {
      setPrefetching(true);
      const { data } = await api.get("/auth/nonce", { withCredentials: true });
      if (data?.nonce) setPrefetchedNonce(data.nonce);
    } catch {
      // no-op; we'll fetch again inside SIWE if needed
    } finally {
      setPrefetching(false);
    }
  };

  useEffect(() => {
    const prevStatus = lastStatusRef.current;
    const prevIsConn = lastIsConnectedRef.current;
    lastStatusRef.current = status;
    lastIsConnectedRef.current = isConnected;

    const userInitiated =
      (prevStatus === "connecting" && status === "connected") ||
      (!prevIsConn && isConnected);

    // When user begins connecting, prefetch nonce in parallel (speed boost on mobile)
    if (status === "connecting") prefetchNonce();

    if (userInitiated) setShouldRunSiwe(true);
  }, [status, isConnected]);

  // Run SIWE once wallet is connected & client ready
  useEffect(() => {
    const run = async () => {
      if (!shouldRunSiwe) return;
      if (!isConnected || !walletClient || !address || authed || signing) return;

      try {
        setSigning(true);

        // Use prefetched nonce if available; otherwise fetch now
        let nonce = prefetchedNonce;
        if (!nonce) {
          const { data } = await api.get("/auth/nonce", { withCredentials: true });
          nonce = data?.nonce;
        }

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
          setPrefetchedNonce(null);

          // broadcast login so other tabs update
          window.dispatchEvent(new CustomEvent("hb-login"));
          if ("BroadcastChannel" in window) {
            new BroadcastChannel("hb-auth").postMessage({ type: "login", t: Date.now() });
          }
          localStorage.setItem("hb-auth-evt", JSON.stringify({ type: "login", t: Date.now() }));

          if (typeof onLogin === "function") onLogin();
        } else {
          setAuthed(false);
        }
      } catch (err) {
        console.error("❌ SIWE failed:", err);
        setAuthed(false);
        setBlocked(true);
      } finally {
        setSigning(false);
        setShouldRunSiwe(false);
      }
    };
    run();
  }, [shouldRunSiwe, isConnected, walletClient, address, chainId, authed, signing, prefetchedNonce, onLogin]);

  // If authed=true but wallet disconnected elsewhere, fall back to Connect
  useEffect(() => {
    if (authed && !isConnected) setAuthed(false);
  }, [authed, isConnected]);

  // Logout
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout error:", err);
    }
    setAuthed(false);
    setBlocked(false);
    setPrefetchedNonce(null);
    disconnect();

    window.dispatchEvent(new CustomEvent("hb-logout"));
    if ("BroadcastChannel" in window) {
      new BroadcastChannel("hb-auth").postMessage({ type: "logout", t: Date.now() });
    }
    localStorage.setItem("hb-auth-evt", JSON.stringify({ type: "logout", t: Date.now() }));

    if (typeof onLogout === "function") onLogout();
  };

  // ---------------- UI (layout preserved) ----------------
  // Until SIWE succeeds, keep showing the standard Connect button.
  if (!authed || !isConnected) {
    if (blocked && !signing) setBlocked(false);
    return <ConnectButton chainStatus="icon" showBalance={false} />;
  }

  return (
    <ProfileMenu
      onLogout={handleLogout}
      variant={isMobile ? "mobile" : variant}
    />
  );
}
