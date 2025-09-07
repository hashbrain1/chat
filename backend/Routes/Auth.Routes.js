import { Router } from "express";
import { getNonce, logout, me, verifySiwe } from "../Controllers/Auth.Controller.js";

const router = Router();

router.get("/nonce", getNonce);
router.post("/verify", verifySiwe);
router.get("/me", me);
router.post("/logout", logout);

export default router;
