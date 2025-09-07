// Utils/cookies.js
export const COOKIE_NAME = process.env.COOKIE_NAME || "hb_sess";

const isProd = process.env.NODE_ENV === "production";

// Use SAME options for set & clear.
// In prod (Vercel + Render are cross-site), we MUST use SameSite=None; Secure.
const baseCookieOpts = {
  httpOnly: true,
  sameSite: isProd ? "none" : "lax",
  secure: isProd ? true : false,
  path: "/",
};

// Standard setters
export function setCookie(res, name, value, maxAgeMs) {
  res.cookie(name, value, { ...baseCookieOpts, maxAge: maxAgeMs });
}

// Standard clear (matches the flags above)
export function clearCookie(res, name) {
  res.clearCookie(name, baseCookieOpts);
}

// OPTIONAL: sweep both historical variants if you previously shipped Lax in prod.
// This sends two Set-Cookie headers and guarantees removal.
export function clearAllVariants(res, name) {
  // host-only cookie (no Domain attr) — matches how we set it
  res.clearCookie(name, { httpOnly: true, path: "/", sameSite: "lax", secure: false });
  res.clearCookie(name, { httpOnly: true, path: "/", sameSite: "none", secure: true });
}
