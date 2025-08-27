import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.BACKEND_URL}/chat`, {
        messages: [...messages, userMessage],
      });

      const aiMessage = { role: 'assistant', content: response.data.message };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '⚠️ Sorry, something went wrong.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black text-gray-800">
      
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/30 backdrop-blur-md shadow-md text-white p-4 flex justify-center">
        <h1 className="text-lg sm:text-xl font-semibold tracking-wide">💬 AI Chat</h1>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.length === 0 && !loading && (
            <div className="text-center text-gray-300 mt-10">
              <p className="text-lg font-medium">Start the conversation 🚀</p>
              <p className="text-sm">Type a message below to chat with AI.</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] p-3 sm:p-4 rounded-2xl shadow-lg backdrop-blur-md 
                  ${msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-white/90 text-gray-900 rounded-bl-sm'
                  }`}
              >
                <p className="text-sm sm:text-base">{msg.content}</p>
              </div>
            </motion.div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[75%] p-3 sm:p-4 rounded-2xl bg-white/70 text-gray-700 shadow-md italic">
                AI is typing...
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-black/40 backdrop-blur-lg border-t border-gray-700 p-4 sm:p-6">
        <div className="max-w-3xl mx-auto flex gap-3 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            disabled={loading}
            className="flex-1 p-3 rounded-full border border-gray-500 bg-white/90 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className={`p-3 sm:p-4 rounded-full transition-colors shadow-md ${
              input.trim()
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-500 cursor-not-allowed text-gray-200'
            }`}
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

export default Chat;
