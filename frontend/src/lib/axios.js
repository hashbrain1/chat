import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_PATH}`,
  withCredentials: true,
});

export const getSessions = () => API.get("/api/sessions");

export const createSession = () => API.post("/api/sessions");

export const getMessages = (sessionId) => API.get(`/api/:${sessionId}`);

export const sendMessage = (sessionId, messages) =>
  API.post("/api/chat", { sessionId, messages });
