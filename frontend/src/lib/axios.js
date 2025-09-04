import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_PATH1}`,
  withCredentials: true,
});

export const getSessions = () => API.get("/sessions");

export const createSession = () => API.post("/sessions");

export const getMessages = (sessionId) => API.get(`/${sessionId}`);

export const sendMessage = (sessionId, messages) =>
  API.post("/chat", { sessionId, messages });
