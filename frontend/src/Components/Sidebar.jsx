import { useState } from "react";
import { createSession } from "../lib/axios";

const Sidebar = ({ sessions, setSessions, onSelectSession, currentSessionId, hasMessages }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleNewChat = async () => {
    if (!hasMessages) return;

    const res = await createSession();
    setSessions((prev) => [res.data, ...prev]);
    onSelectSession(res.data.sessionId);
  };

  return (
    <div
      className={`h-full bg-gray-900 text-white shadow-lg transition-all duration-300 ease-in-out ${
        isOpen ? "w-72" : "w-16"
      } flex flex-col overflow-hidden`}
    >
      {/* Header with Toggle Button */}
      <div className="p-3 flex items-center justify-between bg-gray-800/50 border-b border-gray-700">
        {isOpen && <h2 className="text-lg font-semibold truncate">Chat Sessions</h2>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      {/* New Chat Button */}
      <div className={`p-3 ${isOpen ? "block" : "hidden"}`}>
        <button
          onClick={handleNewChat}
          disabled={!hasMessages}
          className={`w-full p-2 rounded-lg bg-blue-600 text-white font-medium transition-all duration-200 ${
            !hasMessages
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-500 active:scale-95"
          } flex items-center justify-center gap-2`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Chat
        </button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {sessions.map((session) => (
          <div
            key={session.sessionId}
            onClick={() => onSelectSession(session.sessionId)}
            className={`p-2 m-1 rounded-lg cursor-pointer transition-all duration-200 ${
              currentSessionId === session.sessionId
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-200 hover:bg-gray-700"
            } flex items-center gap-2 ${isOpen ? "justify-start" : "justify-center"}`}
            title={isOpen ? "" : session.title}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onSelectSession(session.sessionId);
              }
            }}
          >
            <svg
              className={`w-5 h-5 ${isOpen ? "opacity-100" : "opacity-60"}`}
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
            {isOpen && (
              <span className="truncate flex-1">{session.title}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;