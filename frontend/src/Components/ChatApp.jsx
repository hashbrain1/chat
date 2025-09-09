import { useState, useEffect } from "react";
import ChatWindow from "./ChatWindow";
import Sidebar from "./Sidebar";
import { getSessions } from "../lib/axios";

const ChatApp = () => {
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [hasMessages, setHasMessages] = useState(false);
  const [sessions, setSessions] = useState([]);

  // ✅ fetch sessions
  const refreshSessions = async () => {
    try {
      const { data } = await getSessions();
      const list = Array.isArray(data?.sessions)
        ? data.sessions
        : Array.isArray(data)
        ? data
        : [];
      setSessions(list);
      if (list.length > 0) setCurrentSessionId(list[0].sessionId);
      else setCurrentSessionId(null);
    } catch (err) {
      console.error("Error loading sessions:", err);
      setSessions([]);
    }
  };

  // ✅ clear sessions
  const handleLogout = () => {
    setSessions([]);
    setCurrentSessionId(null);
    setHasMessages(false);
  };

  useEffect(() => {
    refreshSessions();
  }, []);

  return (
    <div className="flex h-screen bg-black text-white w-full overflow-hidden">
      <Sidebar
        sessions={sessions}
        setSessions={setSessions}
        onSelectSession={(id) => {
          setCurrentSessionId(id);
          setHasMessages(false);
        }}
        currentSessionId={currentSessionId}
        hasMessages={hasMessages}
        setCurrentSessionId={setCurrentSessionId}
        onLogout={handleLogout}       // ✅ clear sessions
        onLogin={refreshSessions}     // ✅ reload sessions
      />
      <div className="flex-1 h-full overflow-hidden">
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
