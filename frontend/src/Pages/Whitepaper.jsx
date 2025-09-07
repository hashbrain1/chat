import React, { useEffect, useRef, useState } from "react";

export default function Whitepaper() {
  const [loaded, setLoaded] = useState(false);
  const headerRef = useRef(null);
  const [viewerH, setViewerH] = useState("70vh");

  // Dynamically size the viewer to fill the screen under the header
  useEffect(() => {
    const compute = () => {
      const headerH = headerRef.current?.offsetHeight ?? 0;
      const padding = 48; // page section padding below header
      const h = Math.max(360, window.innerHeight - headerH - padding);
      setViewerH(`${h}px`);
    };
    compute();
    window.addEventListener("resize", compute);
    window.addEventListener("orientationchange", compute);
    return () => {
      window.removeEventListener("resize", compute);
      window.removeEventListener("orientationchange", compute);
    };
  }, []);

  return (
    <div className="min-h-[100svh] w-full bg-white text-gray-900 flex flex-col">
      {/* Page header */}
      <div
        ref={headerRef}
        className="w-full mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-200 bg-white/90 backdrop-blur"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Whitepaper</h1>
          <p className="text-sm text-gray-600">Read online, open in a new tab, or download the PDF.</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <a
            href="/whitepaper.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full px-4 py-2 bg-black text-white hover:bg-neutral-900 text-sm font-semibold w-full sm:w-auto text-center"
            aria-label="Open whitepaper in a new tab"
          >
            Open
          </a>
          <a
            href="/whitepaper.pdf"
            download
            className="rounded-full px-4 py-2 bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200 text-sm font-semibold w-full sm:w-auto text-center"
            aria-label="Download whitepaper PDF"
          >
            Download
          </a>
        </div>
      </div>

      {/* Viewer section */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1">
        <div className="relative rounded-2xl border border-gray-200 ring-1 ring-black/5 shadow-sm overflow-hidden bg-white">
          {/* Loader until iframe is ready */}
          {!loaded && (
            <div className="absolute inset-0 grid place-items-center bg-gray-50">
              <div className="w-10 h-10 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" />
              <p className="mt-3 text-xs text-gray-500">Loading preview…</p>
            </div>
          )}

          {/* PDF iframe (height computed to fill remaining space) */}
          <iframe
            title="Whitepaper PDF"
            src="/whitepaper.pdf#view=FitH"
            className="w-full block"
            style={{ height: viewerH }}
            onLoad={() => setLoaded(true)}
          />
        </div>

        {/* Fallback links */}
        <p className="mt-3 text-sm text-gray-600">
          If the PDF doesn’t render,{" "}
          <a className="underline" href="/whitepaper.pdf" target="_blank" rel="noopener noreferrer">
            open it in a new tab
          </a>{" "}
          or{" "}
          <a className="underline" href="/whitepaper.pdf" download>
            download it
          </a>.
        </p>
      </div>
    </div>
  );
}
