import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_PATH, // /api
  withCredentials: true, // include cookies for auth
});

// Chat helpers
export const getSessions = () => api.get("/sessions");
export const getMessages = (sessionId) =>
  api.get(`/${encodeURIComponent(sessionId)}`);
export const sendMessage = (sessionId, messages) =>
  api.post("/chat", { sessionId, messages });

export default api;
