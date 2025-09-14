import { useState, useEffect } from "react";
import ChatWindow from "./ChatWindow";
import Sidebar from "./Sidebar";
import { getSessions } from "../lib/axios";

const ChatApp = () => {
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [hasMessages, setHasMessages] = useState(false);
  const [sessions, setSessions] = useState([]);

  // 🔄 Load sessions from backend
  const refreshSessions = async () => {
    try {
      const { data } = await getSessions();
      const list = Array.isArray(data?.sessions)
        ? data.sessions
        : Array.isArray(data)
        ? data
        : [];
      setSessions(list);
      if (list.length > 0 && !currentSessionId) {
        setCurrentSessionId(list[0].sessionId);
      }
    } catch (err) {
      console.error("Error loading sessions:", err);
      setSessions([]);
    }
  };

  // 🔒 Reset state on logout
  const handleLogout = () => {
    setSessions([]);
    setCurrentSessionId(null);
    setHasMessages(false);
  };

  useEffect(() => {
    refreshSessions();

    const onGlobalLogout = () => handleLogout();
    const onGlobalLogin = () => refreshSessions();

    // same-tab
    window.addEventListener("hb-logout", onGlobalLogout);
    window.addEventListener("hb-login", onGlobalLogin);

    // cross-tab BroadcastChannel
    let bc;
    if ("BroadcastChannel" in window) {
      bc = new BroadcastChannel("hb-auth");
      bc.onmessage = (evt) => {
        if (evt?.data?.type === "logout") handleLogout();
        if (evt?.data?.type === "login") refreshSessions();
      };
    }

    // cross-tab via localStorage
    const onStorage = (e) => {
      if (e.key === "hb-auth-evt" && e.newValue) {
        try {
          const payload = JSON.parse(e.newValue);
          if (payload?.type === "logout") handleLogout();
          if (payload?.type === "login") refreshSessions();
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("hb-logout", onGlobalLogout);
      window.removeEventListener("hb-login", onGlobalLogin);
      window.removeEventListener("storage", onStorage);
      if (bc) bc.close();
    };
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
        onLogout={handleLogout}
        onLogin={refreshSessions}
      />
      <div className="flex-1 h-full overflow-hidden">
        <ChatWindow
          sessionId={currentSessionId}
          setCurrentSessionId={setCurrentSessionId}
          setSessions={setSessions}
          onMessagesChange={(msgs) => setHasMessages(msgs.length > 0)}
          onSessionUpdate={refreshSessions}   // ✅ added safely
        />
      </div>
    </div>
  );
};

export default ChatApp;
