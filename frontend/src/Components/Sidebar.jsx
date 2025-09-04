import { useState, useEffect } from "react";

const Sidebar = ({
  sessions,
  setSessions,
  onSelectSession,
  currentSessionId,
  hasMessages,
  isMobileOpen = true,
  onCloseMobile,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 768) setIsCollapsed(false);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleNewChat = async () => {
    if (!hasMessages) return;
    const placeholder = { sessionId: null, title: "New Chat" };
    setSessions((prev) => [placeholder, ...prev]);
    onSelectSession(null);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <div
      className={`h-full bg-gray-900 text-white shadow-lg transition-all duration-300 ease-in-out
      ${isCollapsed ? "w-16" : "w-72"}
      md:relative md:translate-x-0
      fixed inset-y-0 left-0 z-40 md:z-auto
      ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* Header */}
      <div className="p-3 flex items-center justify-between bg-gray-800/50 border-b border-gray-700">
        {!isCollapsed && <h2 className="text-base md:text-lg font-semibold truncate">Chat Sessions</h2>}
        <div className="flex items-center gap-2">
          <button
            onClick={onCloseMobile}
            className="md:hidden p-2 rounded-full bg-gray-700 hover:bg-gray-600"
          >
            ✖
          </button>
          <button
            onClick={() => setIsCollapsed((s) => !s)}
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600"
          >
            ◀
          </button>
        </div>
      </div>

      {/* New Chat */}
      <div className={`${isCollapsed ? "hidden" : "p-3"}`}>
        <button
          onClick={handleNewChat}
          disabled={!hasMessages}
          className={`w-full p-2 rounded-lg bg-blue-600 text-white font-medium transition-all duration-200
            ${!hasMessages ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-500 active:scale-95"}`}
        >
          + New Chat
        </button>
      </div>

      {/* Sessions */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {Array.isArray(sessions) && sessions.map((session, idx) => (
          <div
            key={idx}
            onClick={() => { onSelectSession(session.sessionId); if (onCloseMobile) onCloseMobile(); }}
            className={`p-2 m-1 rounded-lg cursor-pointer transition-all duration-200
              ${currentSessionId === session.sessionId ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-200 hover:bg-gray-700"}`}
          >
            {session.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
