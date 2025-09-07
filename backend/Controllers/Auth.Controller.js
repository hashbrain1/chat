import jwt from "jsonwebtoken";
import { SiweMessage, generateNonce } from "siwe";
import { clearAllVariants, clearCookie, COOKIE_NAME, setCookie } from "../Utils/cookies.js";
import User from "../Models/User.js";

/**
 * GET /auth/nonce
 * Issue a short-lived nonce; store it in a temp cookie (JWT) to avoid server storage.
 */
export const getNonce = (req, res) => {
  const nonce = generateNonce();
  const token = jwt.sign({ nonce }, process.env.JWT_SECRET, { expiresIn: "10m" });
  setCookie(res, "siwe_nonce", token, 10 * 60 * 1000);
  res.json({ nonce });
};

/**
 * POST /auth/verify
 * Verify the SIWE message + signature, upsert user, and create a session (HttpOnly cookie).
 */
export const verifySiwe = async (req, res) => {
  try {
    const { message, signature } = req.body || {};
    if (!message || !signature) return res.status(400).json({ error: "Missing params" });

    const nonceToken = req.cookies?.siwe_nonce;
    if (!nonceToken) return res.status(440).json({ error: "Nonce expired" });

    const { nonce } = jwt.verify(nonceToken, process.env.JWT_SECRET);

    const siwe = new SiweMessage(message);

    // TEMP LOGS
console.log("[SIWE] expectedDomain:", req.get("host"));
console.log("[SIWE] msg.domain:", siwe.domain);
console.log("[SIWE] msg.nonce:", siwe.nonce);

    const { data, success } = await siwe.verify({
      signature,
      nonce,
      domain: req.get("host"),
      time: new Date().toISOString(),
    });

    if (!success) return res.status(401).json({ error: "Invalid signature" });

    const address = data.address.toLowerCase();

    // OPTIONAL: enforce a specific chain (e.g., BNB mainnet = 56)
    // if (data.chainId !== 56) return res.status(400).json({ error: "Wrong network" });

    // Upsert user document
    const user = await User.findOneAndUpdate(
      { address },
      { $set: { address, lastLoginAt: new Date() } },
      { new: true, upsert: true }
    );

    // Create session
    const session = jwt.sign(
      { sub: user._id.toString(), address },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    setCookie(res, COOKIE_NAME, session, 7 * 24 * 60 * 60 * 1000);
    clearCookie(res, "siwe_nonce");

    res.json({ ok: true, address, userId: user._id });
  } catch (e) {
    console.error("[SIWE VERIFY]", e);
   return res.status(401).json({ error: "Verification failed" });
  }
};

/**
 * GET /auth/me
 * Return session status & wallet address.
 */
export const me = (req, res) => {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) return res.json({ authenticated: false });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ authenticated: true, address: payload.address, userId: payload.sub });
  } catch {
    res.json({ authenticated: false });
  }
};

/**
 * POST /auth/logout
 * Clear session cookie.
 */
export const logout = (req, res) => {
  clearCookie(res, COOKIE_NAME);
  clearCookie(res, "siwe_nonce");

  // OPTIONAL sweep (handles any legacy cookies with different SameSite/Secure):
  clearAllVariants(res, COOKIE_NAME);
  clearAllVariants(res, "siwe_nonce");

  return res.json({ ok: true });

};
