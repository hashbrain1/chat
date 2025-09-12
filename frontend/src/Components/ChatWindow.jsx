import { useState, useEffect } from "react";
import { getMessages, sendMessage } from "../lib/axios";
import { Link } from "react-router-dom";

const ChatWindow = ({ sessionId, setCurrentSessionId, setSessions, onMessagesChange }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (sessionId) loadMessages();
    else {
      setMessages([]);
      onMessagesChange([]);
    }
  }, [sessionId]);

  // 🔔 Clear messages immediately on global/cross-tab logout
  useEffect(() => {
    const clearAll = () => {
      setMessages([]);
      onMessagesChange([]);
    };

    window.addEventListener("hb-logout", clearAll);

    let bc;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      bc = new BroadcastChannel("hb-auth");
      bc.onmessage = (evt) => {
        if (evt?.data?.type === "logout") clearAll();
      };
    }

    const onStorage = (e) => {
      if (e.key === "hb-auth-evt" && e.newValue) {
        try {
          const payload = JSON.parse(e.newValue);
          if (payload?.type === "logout") clearAll();
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("hb-logout", clearAll);
      window.removeEventListener("storage", onStorage);
      if (bc) bc.close();
    };
  }, [onMessagesChange]);

  const loadMessages = async () => {
    if (!sessionId) return;
    const { data } = await getMessages(sessionId);
    setMessages(data);
    onMessagesChange(data);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = { message: input, response: null };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    onMessagesChange(updatedMessages);

    setInput("");
    setIsTyping(true);

    try {
      const { data } = await sendMessage(sessionId, [
        ...messages
          .map((m) => [
            { role: "user", content: m.message },
            { role: "assistant", content: m.response },
          ])
          .flat()
          .filter((m) => m.content),
        { role: "user", content: input },
      ]);

      if (!sessionId && data.sessionId) {
        setCurrentSessionId(data.sessionId);
        setSessions((prev) => [{ sessionId: data.sessionId, title: "New Chat" }, ...prev]);
      }

      const withResponse = [...updatedMessages];
      withResponse[withResponse.length - 1].response = data.response;

      setMessages(withResponse);
      onMessagesChange(withResponse);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[100svh] bg-black/85 text-white">
      {/* …unchanged UI… */}
      <div className="sticky top-0 z-20">
        <div className="px-2 sm:px-4 pt-3 bg-black/80 backdrop-blur">
          <div className="w-full max-w-full sm:max-w-3xl mx-auto">
            <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3
                            flex flex-col sm:flex-row items-stretch sm:items-center
                            justify-between gap-3">
              <Link
                to="/upgrade"
                className="rounded-full px-4 py-2 bg-white text-black hover:bg-white/90
                           text-sm font-semibold text-center w-full sm:w-auto"
              >
                Upgrade
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* …rest of your UI unchanged… */}
      <div className="flex-1 flex justify-center overflow-y-auto py-4 sm:py-6 pb-28 md:pb-6">
        <div className="w-full max-w-full sm:max-w-3xl px-2 sm:px-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i}>
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-2xl
                                max-w-[80%] sm:max-w-xs text-sm sm:text-base shadow">
                  {m.message}
                </div>
              </div>
              {m.response && (
                <div className="flex justify-start mt-2">
                  <div className="bg-gray-800 text-gray-100 px-3 sm:px-4 py-2 rounded-2xl
                                  max-w-[80%] sm:max-w-xl text-sm sm:text-base shadow">
                    {m.response}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start mt-2">
              <div className="bg-gray-800 text-gray-400 px-3 sm:px-4 py-2 rounded-2xl italic text-sm sm:text-base">
                AI is typing...
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className="
          fixed inset-x-0 bottom-0 z-30
          md:sticky md:bottom-0 md:inset-x-auto
          bg-black/85 backdrop-blur supports-[backdrop-filter]:bg-black/60
          pb-[env(safe-area-inset-bottom)]
        "
      >
        <div className="w-full max-w-full sm:max-w-3xl mx-auto p-2 sm:p-4">
          <div className="flex items-center bg-gray-900 rounded-full px-3 sm:px-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              className="flex-1 bg-transparent text-white outline-none resize-none py-2 sm:py-3
                         text-sm sm:text-base min-h-[40px] sm:min-h-[48px]"
              placeholder="Type your message..."
            />
            <button
              onClick={handleSend}
              className="ml-2 sm:ml-3 bg-green-600 hover:bg-green-500 px-4 sm:px-5 py-2 rounded-full text-white"
              aria-label="Send message"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
