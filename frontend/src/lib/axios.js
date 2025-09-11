// src/lib/axios.js
import axios from "axios";

// Chat client (goes to /api/*)
export const api = axios.create({
  baseURL:
    (import.meta.env.VITE_BASE_PATH && import.meta.env.VITE_BASE_PATH.trim()) ||
    "/api",
  withCredentials: true,
});

// Auth client (goes to /auth/*)
export const authApi = axios.create({
  baseURL: "/", // root, same-origin
  withCredentials: true,
});

// Chat helpers
export const getSessions = () => api.get("/sessions");
export const getMessages = (sessionId) =>
  api.get(`/${encodeURIComponent(sessionId)}`);
export const sendMessage = (sessionId, messages) =>
  api.post("/chat", { sessionId, messages });

export default api;
