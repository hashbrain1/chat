import { useState, useEffect } from "react";
import { getMessages, sendMessage } from "../lib/axios";

const ChatWindow = ({ sessionId, onMessagesChange }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (sessionId) loadMessages();
  }, [sessionId]);

  const loadMessages = async () => {
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
    <div className="flex flex-col h-screen bg-black/85 text-white">
      {/* Centered Chat Container */}
      <div className="flex-1 flex justify-center overflow-y-auto py-6">
        <div className="w-full max-w-3xl px-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i}>
              {/* User bubble */}
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl max-w-xs shadow">
                  {m.message}
                </div>
              </div>

              {/* AI bubble */}
              {m.response && (
                <div className="flex justify-start mt-2">
                  <div className="bg-gray-800 text-gray-100 px-4 py-2 rounded-2xl max-w-xl shadow">
                    {m.response}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* AI typing */}
          {isTyping && (
            <div className="flex justify-start mt-2">
              <div className="bg-gray-800 text-gray-400 px-4 py-2 rounded-2xl italic">
                AI is typing...
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Bar */}
      <div className="p-4 flex justify-center">
        <div className="w-full max-w-3xl flex items-center bg-gray-900 rounded-full px-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            className="flex-1 bg-transparent text-white outline-none resize-none py-3"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSend}
            className="ml-3 bg-green-600 hover:bg-green-500 px-5 py-2 rounded-full text-white"
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
  );
};

export default ChatWindow;
