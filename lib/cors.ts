/**
 * CORS helper for API routes accessed by the Chrome extension
 */

export function getCorsHeaders(origin: string | null) {
  const allowed =
    !origin ||
    origin.startsWith("chrome-extension://") ||
    origin.startsWith("http://localhost") ||
    origin.startsWith("https://suitemigrate.com")

  return {
    "Access-Control-Allow-Origin": allowed ? (origin ?? "*") : "null",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, x-suitemigrate-token",
  }
}

export function corsOptions(request: Request) {
  const origin = request.headers.get("origin")
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  })
}
