/**
 * Rate limiting using Upstash Redis.
 * Falls back gracefully (allows the request) when Redis is not configured.
 *
 * Limits:
 *  - /api/convert   : 10 requests per user per minute  (per-user)
 *                   + 30 requests per IP per minute     (per-IP)
 *  - /api/promo/redeem: 5 requests per user per hour
 *                     + 10 requests per IP per hour
 */

import { Ratelimit } from "@upstash/ratelimit"
import { Redis }     from "@upstash/redis"

function makeRedis(): Redis | null {
  const url   = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token || url.startsWith("https://your-db")) return null
  return new Redis({ url, token })
}

const redis = makeRedis()

// ── Convert limits ─────────────────────────────────────────────────────────
const convertUserLimit = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "1 m"), prefix: "rl:convert:user" })
  : null

const convertIpLimit = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(30, "1 m"), prefix: "rl:convert:ip" })
  : null

// ── Promo limits ───────────────────────────────────────────────────────────
const promoUserLimit = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, "1 h"), prefix: "rl:promo:user" })
  : null

const promoIpLimit = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "1 h"), prefix: "rl:promo:ip" })
  : null

// ── Shared check ───────────────────────────────────────────────────────────

interface RateLimitResult {
  limited: boolean
  /** Seconds until the limit resets, or 0 if not limited */
  resetIn: number
}

async function check(
  limiter: Ratelimit | null,
  identifier: string
): Promise<RateLimitResult> {
  if (!limiter) return { limited: false, resetIn: 0 }
  const { success, reset } = await limiter.limit(identifier)
  return {
    limited: !success,
    resetIn: success ? 0 : Math.ceil((reset - Date.now()) / 1000),
  }
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Check rate limits for /api/convert.
 * Returns the first exceeded limit, or { limited: false } if both pass.
 */
export async function checkConvertRateLimit(
  userId: string,
  ip: string
): Promise<RateLimitResult> {
  const [byUser, byIp] = await Promise.all([
    check(convertUserLimit, userId),
    check(convertIpLimit,   ip),
  ])
  if (byUser.limited) return byUser
  if (byIp.limited)   return byIp
  return { limited: false, resetIn: 0 }
}

/**
 * Check rate limits for /api/promo/redeem.
 */
export async function checkPromoRateLimit(
  userId: string,
  ip: string
): Promise<RateLimitResult> {
  const [byUser, byIp] = await Promise.all([
    check(promoUserLimit, userId),
    check(promoIpLimit,   ip),
  ])
  if (byUser.limited) return byUser
  if (byIp.limited)   return byIp
  return { limited: false, resetIn: 0 }
}

/**
 * Extract the client IP from the request.
 * Prefers x-forwarded-for (Vercel/proxy), falls back to "unknown".
 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  )
}
