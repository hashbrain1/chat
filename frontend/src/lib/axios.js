import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_PATH || "http://localhost:5000",
  withCredentials: true,
});

// Chat helpers
export const getSessions = () => api.get("/api/sessions");
export const getMessages = (sessionId) => api.get(`/api/${encodeURIComponent(sessionId)}`);
export const sendMessage = (sessionId, messages) =>
  api.post("/api/chat", { sessionId, messages });

export default api;
