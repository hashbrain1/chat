export const COOKIE_NAME = process.env.COOKIE_NAME || "hb_sess";

const isProd = process.env.NODE_ENV === "production";

/**
 * Base cookie options.
 * - In dev → lax + insecure (works on http://localhost)
 * - In prod → none + secure (required for cross-site: Vercel <-> Render)
 * - Do NOT set `domain`: let browser bind cookies to backend host automatically.
 */
const baseCookieOpts = {
  httpOnly: true,
  sameSite: isProd ? "none" : "lax",
  secure: isProd,
  path: "/",
};

/**
 * Set a cookie.
 * - `siwe_nonce` → session cookie (expires when browser closes).
 * - Others respect `maxAgeMs`.
 */
export function setCookie(res, name, value, maxAgeMs) {
  if (name === "siwe_nonce") {
    res.cookie(name, value, { ...baseCookieOpts });
  } else {
    res.cookie(name, value, { ...baseCookieOpts, maxAge: maxAgeMs });
  }
}

/**
 * Clear a cookie with base options.
 */
export function clearCookie(res, name) {
  res.clearCookie(name, baseCookieOpts);
}

/**
 * Clear common variants for reliability.
 * Useful if cookies were set differently in dev/prod.
 */
export function clearAllVariants(res, name) {
  // Localhost (dev)
  res.clearCookie(name, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
  });

  // Production cross-site (Vercel <-> Render)
  res.clearCookie(name, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/",
  });
}
