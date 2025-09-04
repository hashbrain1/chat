import { Router } from 'express'
import { createSession, getMessages, getSessions, sendMessage } from '../Controllers/Chat.Controller.js';
const router = Router()

router.post("/chat", sendMessage);
router.post("/sessions", createSession); 
router.get("/sessions", getSessions);
router.get("/:sessionId", getMessages);

export default router