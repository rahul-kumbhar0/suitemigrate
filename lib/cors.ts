/**
 * CORS helper — strict allowlist.
 *
 * Allowed origins:
 *   1. https://suitemigrate.vercel.app     (production website)
 *   2. chrome-extension://<EXTENSION_ID>   (configured via EXTENSION_ID env var)
 *   3. http://localhost:* / http://127.0.0.1:* (local dev only, not production)
 *
 * Never uses "*".
 * Sets Access-Control-Allow-Credentials: true only for allowed origins.
 * https://suitemigrate.com is NOT included until the domain is confirmed owned.
 */

const PROD_ORIGIN  = "https://suitemigrate.vercel.app"
const EXTENSION_ID = process.env.EXTENSION_ID          // e.g. "abcdefghijklmnopqrstuvwxyz123456"
const IS_PROD      = process.env.NODE_ENV === "production"

function isAllowed(origin: string | null): boolean {
  if (!origin) return false                               // non-browser / server calls — let through without CORS

  if (origin === PROD_ORIGIN) return true

  // Chrome extension — only allow if EXTENSION_ID is configured; otherwise reject
  if (origin.startsWith("chrome-extension://")) {
    if (!EXTENSION_ID) {
      // TODO: Set EXTENSION_ID env var on Vercel once extension is published
      // In dev, allow any chrome-extension origin so testing works
      return !IS_PROD
    }
    return origin === `chrome-extension://${EXTENSION_ID}`
  }

  // Localhost — only in non-production
  if (!IS_PROD && (origin.startsWith("http://localhost") || origin.startsWith("http://127.0.0.1"))) {
    return true
  }

  return false
}

export function getCorsHeaders(origin: string | null): Record<string, string> {
  if (!origin) {
    // Server-to-server call — return minimal headers, no CORS
    return {
      "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-suitemigrate-token",
    }
  }

  const allowed = isAllowed(origin)
  return {
    "Access-Control-Allow-Origin":      allowed ? origin : "null",
    "Access-Control-Allow-Credentials": allowed ? "true" : "false",
    "Access-Control-Allow-Methods":     "GET, POST, PATCH, OPTIONS",
    "Access-Control-Allow-Headers":     "Content-Type, Authorization, x-suitemigrate-token",
    "Vary":                             "Origin",
  }
}

export function corsOptions(request: Request): Response {
  const origin  = request.headers.get("origin")
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  })
}
