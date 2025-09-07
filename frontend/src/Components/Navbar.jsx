import WalletButton from "@/Wallet/WalletButton";
import ProfileMenu from "@/Wallet/ProfileMenu";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const barRef = useRef(null);
  const panelRef = useRef(null);
  const contentRef = useRef(null);

  const [barH, setBarH] = useState(0);
  const [panelH, setPanelH] = useState(0);

  const { isConnected } = useAccount();

  // Desktop media query
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 768px)").matches
      : true
  );
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const onChange = (e) => setIsDesktop(e.matches);
    if (mql.addEventListener) mql.addEventListener("change", onChange);
    else mql.addListener(onChange);
    setIsDesktop(mql.matches);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", onChange);
      else mql.removeListener(onChange);
    };
  }, []);

  // Measure navbar height so mobile panel attaches right under it
  useEffect(() => {
    const measureBar = () => {
      if (barRef.current) {
        const h = barRef.current.getBoundingClientRect().height;
        setBarH(h + 12);
      }
    };
    measureBar();
    window.addEventListener("resize", measureBar);
    return () => window.removeEventListener("resize", measureBar);
  }, []);

  // ESC to close
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    const handleOutside = (e) => {
      const bar = barRef.current;
      const panel = panelRef.current;
      const target = e.target;
      if (bar && !bar.contains(target) && panel && !panel.contains(target)) {
        setOpen(false);
      }
    };
    const options = { passive: true };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside, options);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside, options);
    };
  }, [open]);

  // Compute natural content height for smooth height animation
  const recalcPanelHeight = () => {
    if (!contentRef.current) return;
    const full = contentRef.current.scrollHeight;
    setPanelH(open ? full : 0);
  };

  useEffect(() => {
    recalcPanelHeight();
  }, [open]);

  // Auto-resize when inner content grows/shrinks (e.g., Profile submenu)
  useEffect(() => {
    if (!contentRef.current) return;
    const ro = new ResizeObserver(() => {
      if (open) recalcPanelHeight();
    });
    ro.observe(contentRef.current);
    const onToggle = () => open && recalcPanelHeight();
    window.addEventListener("hb-profile-toggle", onToggle);
    return () => {
      ro.disconnect();
      window.removeEventListener("hb-profile-toggle", onToggle);
    };
  }, [open]);

  const navItems = [
    { label: "Home", to: "/", type: "link" },
    { label: "Product", to: "/product", type: "link" },
    { label: "Docs", to: "/docs", type: "link" },
    { label: "Ecosystem", href: "#", type: "a" },
  ];

  const handleMobileClick = () => setOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-4">
      <div className="mx-auto max-w-7xl">
        <div
          ref={barRef}
          className={`mt-3 sm:mt-4 flex items-center justify-between rounded-2xl
                      bg-white text-gray-900 backdrop-blur px-3 sm:px-5 py-2
                      shadow-md ring-1 ring-black/5 ${open ? "rounded-b-none" : "rounded-2xl"}`}
        >
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/Images/logo.png"
              alt="Hash Brain logo"
              className="w-9 h-9 rounded-full object-cover"
            />
            <span className="text-sm sm:text-base font-extrabold tracking-tight text-gray-900 group-hover:text-gray-700 transition-colors">
              HASH BRAIN
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) =>
              item.type === "link" ? (
                <Link
                  key={item.label}
                  to={item.to}
                  className="text-gray-900 hover:text-gray-700 text-sm font-medium"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-gray-900 hover:text-gray-700 text-sm font-medium"
                >
                  {item.label}
                </a>
              )
            )}

            {/* Chat AI button — black with white text */}
            <Link
              to="/chat"
              target="_blank"
              className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold
                         bg-black text-white hover:bg-neutral-900 transition-colors shadow-sm"
            >
              Chat AI
            </Link>

            {/* Profile (connected) OR Wallet (you can style WalletButton similarly) */}
            {isDesktop && (isConnected ? (
              <ProfileMenu />
            ) : (
              // If your WalletButton supports className, pass the black style:
              // <WalletButton className="rounded-full px-4 py-2 text-sm font-semibold bg-black text-white hover:bg-neutral-900 shadow-sm" />
              <WalletButton />
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-full text-gray-900 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          >
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {open ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <>
                  <path d="M4 6h16" />
                  <path d="M4 12h16" />
                  <path d="M4 18h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drop-down (white bg) */}
      <div
        ref={panelRef}
        id="mobile-menu"
        className="md:hidden fixed left-0 right-0 z-40 mx-3 sm:mx-4 rounded-b-2xl
                   bg-white/95 text-gray-900 backdrop-blur shadow-xl ring-1 ring-black/5
                   overflow-hidden transition-all duration-300"
        style={{ top: barH, height: panelH }}
        aria-hidden={!open}
      >
        <div ref={contentRef} className="px-4 py-4 flex flex-col gap-1">
          {navItems.map((item) =>
            item.type === "link" ? (
              <Link
                key={`m-${item.label}`}
                to={item.to}
                onClick={handleMobileClick}
                className="block rounded-xl px-3 py-3 hover:bg-gray-100 text-base font-medium"
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={`m-${item.label}`}
                href={item.href}
                onClick={handleMobileClick}
                className="block rounded-xl px-3 py-3 hover:bg-gray-100 text-base font-medium"
              >
                {item.label}
              </a>
            )
          )}

          {/* Chat AI (mobile) — black */}
          <Link
            to="/chat"
            target="_blank"
            onClick={handleMobileClick}
            className="mt-1 block rounded-full px-16 py-3 text-center text-base font-semibold
                       bg-black text-white hover:bg-neutral-900 w-fit shadow-sm"
          >
            Chat AI
          </Link>

          {/* Mobile: Profile submenu (black button) OR Wallet */}
          <div className="mt-2">
            {!isDesktop && (isConnected ? (
              <ProfileMenu />
            ) : (
              // If WalletButton supports className, pass black style here too:
              // <WalletButton className="rounded-full px-4 py-2 text-sm font-semibold bg-black text-white hover:bg-neutral-900 shadow-sm" />
              <WalletButton />
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
