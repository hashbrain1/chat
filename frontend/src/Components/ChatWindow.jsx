import { useState, useEffect, useRef } from "react";
import { getMessages, sendMessage } from "../lib/axios";

const ChatWindow = ({ sessionId, setCurrentSessionId, setSessions, onMessagesChange }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const taRef = useRef(null);

  useEffect(() => {
    if (sessionId) loadMessages();
    else setMessages([]);
  }, [sessionId]);

  const loadMessages = async () => {
    if (!sessionId) return;
    const { data } = await getMessages(sessionId);
    setMessages(data);
    onMessagesChange(data);
  };

  const autoGrow = () => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = { message: input, response: null };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    onMessagesChange(updatedMessages);

    setInput("");
    setIsTyping(true);
    autoGrow();

    try {
      const { data } = await sendMessage(sessionId, [
        ...messages
          .map((m) => [
            { role: "user", content: m.message },
            { role: "assistant", content: m.response },
          ])
          .flat()
          .filter((m) => m.content),
        { role: "user", content: newMessage.message },
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

  useEffect(() => autoGrow(), [input]);

  return (
    <div className="flex flex-col h-[100svh] md:h-screen bg-black/85 text-white">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 px-2">
        <div className="w-full max-w-3xl mx-auto space-y-4">
          {messages.map((m, i) => (
            <div key={i}>
              <div className="text-right bg-blue-600 p-2 rounded-lg inline-block">{m.message}</div>
              {m.response && (
                <div className="mt-2 text-left bg-gray-700 p-2 rounded-lg inline-block">{m.response}</div>
              )}
            </div>
          ))}
          {isTyping && <p className="italic text-gray-400">Assistant is typing...</p>}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-800 p-3 bg-black sticky bottom-0">
        <div className="w-full max-w-3xl mx-auto flex gap-2">
          <textarea
            ref={taRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 resize-none bg-gray-900 rounded-lg p-2 focus:outline-none"
            rows={1}
            placeholder="Type your message..."
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
