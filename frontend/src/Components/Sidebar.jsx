import { useState, useEffect, useRef } from "react";

const Sidebar = ({
  sessions,
  setSessions,
  onSelectSession,
  currentSessionId,
  hasMessages,
  setCurrentSessionId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null); // NEW: sidebar element ref

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(true);
      else setIsOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // NEW: Close on outside click for ≥ md screens
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        window.innerWidth >= 768 && // desktop only
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  const handleNewChat = async () => {
    if (!hasMessages) return;
    const placeholder = { sessionId: null, title: "New Chat" };
    setSessions((prev) => [placeholder, ...prev]);
    onSelectSession(null);
    if (window.innerWidth < 768) setIsOpen(false);
  };

  return (
    <>
      {/* Mobile toggle when CLOSED (floating at left-4) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-full bg-gray-700 hover:bg-gray-600
                     focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          aria-label="Open sidebar"
        >
          <svg
            className="w-5 h-5 transition-transform duration-300 rotate-180"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Backdrop for mobile — click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}  // NEW: attach ref
        className={`h-full bg-gray-900 text-white shadow-lg transition-all duration-300 ease-in-out
                    flex flex-col overflow-hidden
                    md:flex md:flex-col
                    ${isOpen ? "w-64 md:w-72 translate-x-0" : "w-0 md:w-16 -translate-x-full md:translate-x-0"}
                    fixed md:static inset-y-0 left-0 z-40`}  // <-- relative so the inside button can anchor
      >
        {/* Mobile toggle when OPEN (inside, top-right of the sidebar) */}
        {isOpen && (
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-3 md:hidden p-2 rounded-full bg-gray-700 hover:bg-gray-600
                       focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 z-50"
            aria-label="Close sidebar"
          >
            <svg
              className="w-5 h-5 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Header */}
        <div
          className={`p-4.5 flex items-center ${
            isOpen ? "justify-between" : "justify-center"
          } bg-gray-800/50 border-b border-gray-700 md:flex md:items-center md:justify-between`}
        >
          {isOpen && <h2 className="text-base md:text-lg font-semibold truncate">Chat Sessions</h2>}

          {/* Desktop toggle (ONLY on ≥ md) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden md:inline-flex p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "" : "rotate-180"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* New Chat Button */}
        <div className={`p-3 ${isOpen ? "block" : "hidden"}`}>
          <button
            onClick={handleNewChat}
            disabled={!hasMessages}
            className={`w-full p-2 rounded-lg bg-blue-600 text-white font-medium transition-all duration-200 ${
              !hasMessages ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-500 active:scale-95"
            } flex items-center justify-center gap-2 text-sm md:text-base`}
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            New Chat
          </button>
        </div>

        {/* Sessions List */}
        <div className={`flex-1 overflow-y-auto px-2 pb-2 ${isOpen ? "block" : "hidden md:block"}`}>
          {Array.isArray(sessions) &&
            sessions.map((session, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onSelectSession(session.sessionId);
                  if (window.innerWidth < 768) setIsOpen(false);
                }}
                className={`p-2 m-1 rounded-lg cursor-pointer transition-all duration-200 ${
                  currentSessionId === session.sessionId
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-200 hover:bg-gray-700"
                } flex items-center gap-2 ${isOpen ? "justify-start" : "justify-center"} text-sm md:text-base`}
                title={isOpen ? "" : session.title}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    onSelectSession(session.sessionId);
                    if (window.innerWidth < 768) setIsOpen(false);
                  }
                }}
              >
                <svg
                  className={`w-4 h-4 md:w-5 md:h-5 ${isOpen ? "opacity-100" : "opacity-60"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5v-4a2 2 0 012-2h10a2 2 0 012 2v4h-4M9 16l3 3m0 0l3-3m-3 3V7"
                  />
                </svg>
                {isOpen && <span className="truncate flex-1">{session.title}</span>}
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
