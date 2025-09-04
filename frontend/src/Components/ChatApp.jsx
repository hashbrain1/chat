import { useState, useEffect } from "react";
import ChatWindow from "./ChatWindow";
import Sidebar from "./Sidebar";
import { getSessions } from "../lib/axios";

const ChatApp = () => {
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [hasMessages, setHasMessages] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const initChat = async () => {
      try {
        const { data } = await getSessions();
        const list = Array.isArray(data?.sessions) ? data.sessions : Array.isArray(data) ? data : [];
        setSessions(list);
        setCurrentSessionId(list.length > 0 ? list[0].sessionId : null);
      } catch (err) {
        console.error("Error loading sessions:", err);
        setSessions([]);
      }
    };
    initChat();
  }, []);

  return (
    <div className="flex md:flex-row flex-col h-[100svh] bg-black text-white">
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center gap-3 p-3 border-b border-gray-800/60 sticky top-0 z-30 bg-black/80">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800"
        >
          ☰
        </button>
        <span className="font-semibold">Hash Brain Chat</span>
      </div>

      {/* Sidebar */}
      <Sidebar
        sessions={sessions}
        setSessions={setSessions}
        onSelectSession={(id) => { setCurrentSessionId(id); setHasMessages(false); }}
        currentSessionId={currentSessionId}
        hasMessages={hasMessages}
        isMobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Backdrop */}
      {mobileSidebarOpen && (
        <button
          onClick={() => setMobileSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}

      {/* Chat Window */}
      <div className="flex-1 min-h-0">
        <ChatWindow
          sessionId={currentSessionId}
          setCurrentSessionId={setCurrentSessionId}
          setSessions={setSessions}
          onMessagesChange={(msgs) => setHasMessages(msgs.length > 0)}
        />
      </div>
    </div>
  );
};

export default ChatApp;
