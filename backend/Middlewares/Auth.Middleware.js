import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "../Utils/cookies.js";

export default function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, address: (payload.address || "").toLowerCase() };
    return next();
  } catch (err) {
    console.error("❌ Auth error:", err.message);
    return res.status(401).json({ error: "Invalid/expired session" });
  }
}

export function maybeAuth(req, _res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (token) {
    try {
      const p = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: p.sub, address: p.address.toLowerCase() };
    } catch {
      // ignore
    }
  }
  next();
}
