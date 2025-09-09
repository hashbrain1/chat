import jwt from "jsonwebtoken";
import { SiweMessage, generateNonce } from "siwe";
import {
  clearAllVariants,
  clearCookie,
  COOKIE_NAME,
  setCookie,
} from "../Utils/cookies.js";
import User from "../Models/User.js";

/**
 * GET /auth/nonce
 * Creates a nonce, stores it in a short-lived cookie.
 */
export const getNonce = (req, res) => {
  try {
    const nonce = generateNonce();
    const token = jwt.sign({ nonce }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    // ⏳ Store nonce in cookie (short-lived)
    setCookie(res, "siwe_nonce", token, 10 * 60 * 1000);

    res.json({ nonce });
  } catch (e) {
    console.error("❌ [getNonce]", e);
    res.status(500).json({ error: "Failed to generate nonce" });
  }
};

/**
 * POST /auth/verify
 * Verifies SIWE message, saves user to DB, sets auth cookie.
 */
export const verifySiwe = async (req, res) => {
  try {
    const { message, signature } = req.body || {};
    if (!message || !signature) {
      return res.status(400).json({ error: "Missing params" });
    }

    const nonceToken = req.cookies?.siwe_nonce;
    if (!nonceToken) {
      return res.status(440).json({ error: "Nonce expired" });
    }

    const { nonce } = jwt.verify(nonceToken, process.env.JWT_SECRET);
    const siwe = new SiweMessage(message);

    console.log("➡️ SIWE domain (from message):", siwe.domain);
    console.log("➡️ Expected frontend domain:", process.env.FRONTEND_DOMAIN);

    const { data, success, error } = await siwe.verify({
      signature,
      nonce,
      domain: process.env.FRONTEND_DOMAIN, // ✅ must match frontend host (e.g. localhost:5173 or hashbrain.ai)
      time: new Date().toISOString(),
    });

    if (!success) {
      console.error("❌ [verifySiwe] failed:", error);
      return res.status(401).json({ error: "Invalid signature or domain mismatch" });
    }

    const address = data.address.toLowerCase();

    // Save/update user
    const user = await User.findOneAndUpdate(
      { address },
      { $set: { address, lastLoginAt: new Date() } },
      { new: true, upsert: true }
    );

    // Issue session cookie (7 days)
    const session = jwt.sign(
      { sub: user._id.toString(), address },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    setCookie(res, COOKIE_NAME, session, 7 * 24 * 60 * 60 * 1000);
    clearCookie(res, "siwe_nonce"); // ✅ clear nonce on successful login
    clearAllVariants(res, "siwe_nonce");

    return res.json({ ok: true, address, userId: user._id });
  } catch (e) {
    console.error("❌ [verifySiwe]", e);
    res.status(401).json({ error: "Verification failed" });
  }
};

/**
 * GET /auth/me
 * Checks if user is authenticated.
 */
export const me = (req, res) => {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) {
      return res.json({ authenticated: false });
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    res.json({
      authenticated: true,
      address: payload.address,
      userId: payload.sub,
    });
  } catch {
    res.json({ authenticated: false });
  }
};

/**
 * POST /auth/logout
 * Clears session cookies.
 */
export const logout = (req, res) => {
  try {
    clearCookie(res, COOKIE_NAME);
    clearCookie(res, "siwe_nonce");

    clearAllVariants(res, COOKIE_NAME);
    clearAllVariants(res, "siwe_nonce");

    return res.json({ ok: true });
  } catch (e) {
    console.error("❌ [logout]", e);
    res.status(500).json({ error: "Logout failed" });
  }
};
