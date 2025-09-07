import { Router } from 'express'
import { createSession, getMessages, getSessions, sendMessage } from '../Controllers/Chat.Controller.js';
import  { maybeAuth } from '../Middlewares/Auth.Middleware.js';
const router = Router()

router.post("/chat",maybeAuth, sendMessage);
router.post("/sessions",maybeAuth, createSession); 
router.get("/sessions",maybeAuth, getSessions);
router.get("/:sessionId",maybeAuth, getMessages);

export default router