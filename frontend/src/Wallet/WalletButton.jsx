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
  const [blocked, setBlocked] = useState(false);

  const [prefetchedNonce, setPrefetchedNonce] = useState(null);
  const [prefetching, setPrefetching] = useState(false);

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ✅ Check cookie session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await authApi.get("/auth/me");
        if (res.data?.authenticated) {
          setAuthed(true);
        } else {
          setAuthed(false);
        }
      } catch {
        setAuthed(false);
      }
    };
    checkSession();
  }, []);

  // Cross-tab sync
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

  // ----------------- SIWE -----------------
  const [shouldRunSiwe, setShouldRunSiwe] = useState(false);
  const lastStatusRef = useRef(status);
  const lastIsConnectedRef = useRef(isConnected);

  const prefetchNonce = async () => {
    if (prefetching || prefetchedNonce) return;
    try {
      setPrefetching(true);
      const { data } = await authApi.get("/auth/nonce");
      if (data?.nonce) setPrefetchedNonce(data.nonce);
    } catch {
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

    if (status === "connecting") prefetchNonce();
    if (userInitiated) {
      // debounce SIWE run to avoid Trust Wallet race condition
      setTimeout(() => setShouldRunSiwe(true), 400);
    }
  }, [status, isConnected]);

  useEffect(() => {
    const run = async () => {
      if (!shouldRunSiwe) return;
      if (!isConnected || !walletClient || !address || authed || signing) return;

      try {
        setSigning(true);

        // Always ensure a fresh nonce
        let nonce = prefetchedNonce;
        if (!nonce) {
          const { data } = await authApi.get("/auth/nonce");
          nonce = data?.nonce;
        }

        const buildMessage = (nonceVal) =>
          prepareSiweMessage({
            domain: window.location.host,
            address: toChecksum(address),
            statement: "Sign in to Hash Brain using your wallet.",
            uri: window.location.origin,
            version: "1",
            chainId: chainId || 1,
            nonce: nonceVal,
          });

        let message = buildMessage(nonce);
        let signature = await walletClient.signMessage({ account: address, message });

        let verified = false;
        try {
          const res = await authApi.post("/auth/verify", { message, signature });
          verified = res.data?.ok;
        } catch {
          const { data } = await authApi.get("/auth/nonce");
          message = buildMessage(data.nonce);
          signature = await walletClient.signMessage({ account: address, message });
          const res = await authApi.post("/auth/verify", { message, signature });
          verified = res.data?.ok;
        }

        if (verified) {
          setAuthed(true);
          setBlocked(false);
          setPrefetchedNonce(null);

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
        setAuthed(false);
        setBlocked(true);
      } finally {
        setSigning(false);
        setShouldRunSiwe(false);
      }
    };
    run();
  }, [shouldRunSiwe, isConnected, walletClient, address, chainId, authed, signing, prefetchedNonce, onLogin]);

  useEffect(() => {
    if (authed && !isConnected) setAuthed(false);
  }, [authed, isConnected]);

  const handleLogout = async () => {
    try {
      await authApi.post("/auth/logout");
    } catch {}
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

  if (!authed || !isConnected) {
    if (blocked && !signing) setBlocked(false);
    return <ConnectButton chainStatus="icon" showBalance={false} />;
  }

  return <ProfileMenu onLogout={handleLogout} variant={isMobile ? "mobile" : variant} />;
}
