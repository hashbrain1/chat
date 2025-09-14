import React, { useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";

const truncate = (addr = "") =>
  addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : "";

export default function ProfileMenu({ variant = "navbar", onLogout }) {
  const { address, isConnected, status } = useAccount();

  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const menuRef = useRef(null);
  const btnRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("touchstart", onDoc, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("touchstart", onDoc);
    };
  }, [open]);

  // Let containers recompute height
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("hb-profile-toggle"));
  }, [open]);

  // ✅ Allow showing Profile if cookie session exists
  let hasCookieSession = false;
  try {
    const stored = JSON.parse(localStorage.getItem("hb-auth-evt") || "{}");
    if (stored?.type === "login") hasCookieSession = true;
  } catch {}

  if (!isConnected && !hasCookieSession) return null;

  const isSidebar = variant === "sidebar";
  const isMobile = variant === "mobile";

  const baseButton =
    "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-white bg-black hover:bg-neutral-900 transition-colors shadow-sm cursor-pointer";

  const cardNavbar =
    "absolute left-0 top-full mt-3 z-50 w-64 rounded-xl border border-gray-200 bg-white text-gray-900 shadow-xl ring-1 ring-black/5 overflow-hidden";
  const cardSidebar =
    "mt-3 w-full md:w-64 max-w-full rounded-xl border border-gray-700 bg-gray-800 text-gray-100 shadow-lg ring-1 ring-white/10 overflow-hidden";
  const cardMobile =
    "mt-3 w-full rounded-xl border border-gray-200 bg-white text-gray-900 shadow-xl ring-1 ring-black/5 overflow-hidden";

  const row = "flex items-center justify-between px-3 py-2";
  const avatar =
    "inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-black text-xs font-bold";

  const handleClickLogout = async () => {
    setLoggingOut(true);
    try {
      if (onLogout) await onLogout();
    } finally {
      setLoggingOut(false);
      setOpen(false);
    }
  };

  // ✅ Always show correct wallet initials
  const getInitials = () => {
    if (address) return address.slice(2, 4).toUpperCase();
    try {
      const storedAddr = localStorage.getItem("hb-auth-addr");
      if (storedAddr) return storedAddr.slice(2, 4).toUpperCase();
    } catch {}
    return "W";
  };

  return (
    <div className={isSidebar ? "w-full min-w-0" : "relative"}>
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        className={
          isSidebar
            ? "w-full flex items-center justify-between rounded-lg px-3 py-2 bg-black text-white hover:bg-neutral-900 cursor-pointer"
            : baseButton
        }
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="flex items-center gap-2 min-w-0">
          <span className={avatar}>{getInitials()}</span>
          <span className="text-sm truncate">Profile</span>
        </span>
        <svg
          className={`h-4 w-4 shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.062l-4.24 4.24a.75.75 0 01-1.06 0l-4.24-4.24a.75.75 0 01.02-1.06z" />
        </svg>
      </button>

      {open && (
        <div
          ref={menuRef}
          className={isSidebar ? cardSidebar : isMobile ? cardMobile : cardNavbar}
          role="menu"
        >
          <div
            className={
              isSidebar
                ? "px-3 pt-3 pb-3 border-b border-gray-700"
                : "px-3 pt-3 pb-3 border-b border-gray-200"
            }
          >
            <div className="text-xs uppercase tracking-wide opacity-70 mb-1">
              Wallet
            </div>
            <div className="flex items-center justify-between gap-2">
              <code className="text-sm break-words">
                {truncate(address || localStorage.getItem("hb-auth-addr") || "")}
              </code>
              <div className="relative">
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(
                        address || localStorage.getItem("hb-auth-addr") || ""
                      );
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1200);
                    } catch {}
                  }}
                  className="text-xs px-2 py-1 rounded bg-black text-white hover:bg-neutral-900 cursor-pointer shrink-0"
                  title="Copy address"
                >
                  Copy
                </button>
                <span
                  className={`absolute -top-7 right-0 text-xs rounded-md px-2 py-1 bg-emerald-500 text-white shadow transition-opacity duration-150 ${
                    copied ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                  aria-live="polite"
                >
                  Copied!
                </span>
              </div>
            </div>
          </div>

          <div className={row}>
            <span className="text-sm opacity-80">Status</span>
            <span className="inline-flex items-center gap-1 text-sm font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {status === "connected" || hasCookieSession
                ? "Signed in"
                : "Connecting…"}
            </span>
          </div>

          <div className="px-3 pt-1 pb-5">
            <button
              onClick={handleClickLogout}
              disabled={loggingOut}
              className={`w-full rounded-md text-white text-sm py-2 cursor-pointer transition-colors ${
                loggingOut
                  ? "bg-gray-500 cursor-wait"
                  : "bg-black hover:bg-neutral-900"
              }`}
            >
              {loggingOut ? "Logging out…" : "Logout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
