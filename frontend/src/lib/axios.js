// src/lib/axios.ts (or .js)
import axios from "axios";

const base =
  (import.meta.env.VITE_BASE_PATH && import.meta.env.VITE_BASE_PATH.trim()) || "/api";

export const api = axios.create({
  baseURL: base.replace(/\/+$/, ""),   // remove trailing slash
  withCredentials: true,
});

// Helpers — NOTE: no '/api' here anymore
export const getSessions   = () => api.get("/sessions");
export const getMessages   = (sessionId) => api.get(`/${encodeURIComponent(sessionId)}`);
export const sendMessage   = (sessionId, messages) => api.post("/chat", { sessionId, messages });

export default api;
