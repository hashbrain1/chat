import { useState, useEffect } from "react";
import ChatWindow from "./ChatWindow";
import Sidebar from "./Sidebar";
import { getSessions } from "../lib/axios";

const ChatApp = () => {
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [hasMessages, setHasMessages] = useState(false);
  const [sessions, setSessions] = useState([]);

  // 🚀 Load existing sessions on first visit
useEffect(() => {
  const initChat = async () => {
    try {
      const { data } = await getSessions(); // could be array or object
      const list = Array.isArray(data?.sessions) ? data.sessions
                 : Array.isArray(data) ? data
                 : [];
      setSessions(list);

      if (list.length > 0) {
        setCurrentSessionId(list[0].sessionId);
      } else {
        setCurrentSessionId(null);
      }
    } catch (err) {
      console.error("Error loading sessions:", err);
      setSessions([]); // keep it an array to avoid crashes
    }
  };
  initChat();
}, []);


  return (
    <div className="flex flex-1 h-screen bg-black text-white">
      {/* Sidebar */}
      <Sidebar
        sessions={sessions}
        setSessions={setSessions}
        onSelectSession={(id) => {
          setCurrentSessionId(id);
          setHasMessages(false);
        }}
        currentSessionId={currentSessionId}
        hasMessages={hasMessages}
        setCurrentSessionId={setCurrentSessionId}  // ✅ pass this down
      />

      {/* Chat Window */}
      <div className="flex-1">
        <ChatWindow
          sessionId={currentSessionId}
          setCurrentSessionId={setCurrentSessionId} // ✅ so it can assign real ID
          setSessions={setSessions}                 // ✅ update sessions after save
          onMessagesChange={(msgs) => setHasMessages(msgs.length > 0)}
        />
      </div>
    </div>
  );
};

export default ChatApp;
