import { useState, useEffect } from "react";
import ChatWindow from "./ChatWindow";
import Sidebar from "./Sidebar";
import { createSession, getSessions } from "../lib/axios";

const ChatApp = () => {
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [hasMessages, setHasMessages] = useState(false);
  const [sessions, setSessions] = useState([]);

  // 🚀 Create or load session on first visit
  useEffect(() => {
    const initChat = async () => {
      try {
        const { data } = await getSessions(); // get all sessions from backend
        if (data.length === 0) {
          // no session -> create one
          const res = await createSession();
          setSessions([res.data]);
          setCurrentSessionId(res.data.sessionId);
        } else {
          // open latest session
          setSessions(data);
          setCurrentSessionId(data[0].sessionId);
        }
      } catch (err) {
        console.error("Error loading sessions:", err);
      }
    };

    initChat();
  }, []);

  return (
    <div className="flex flex-1 h-screen bg-black text-white">
      {/* Sidebar */}
      <Sidebar
        sessions={sessions}                // ✅ pass sessions for history
        setSessions={setSessions}          // ✅ update sessions when new chat created
        onSelectSession={(id) => {
          setCurrentSessionId(id);
          setHasMessages(false);           // reset, ChatWindow will update later
        }}
        currentSessionId={currentSessionId}
        hasMessages={hasMessages}
      />

      {/* Chat Window */}
      <div className="flex-1">
        {currentSessionId ? (
          <ChatWindow
            sessionId={currentSessionId}
            onMessagesChange={(msgs) => setHasMessages(msgs.length > 0)}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Loading chat...
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
