/**
 * Server-side model selection for SuiteMigrate's authenticated converter.
 * Multiple model fallbacks are not multiple quotas: all keys in a Google
 * project share the project's limits. Do not rotate API keys to evade quotas.
 *
 * This module contains no API credentials and can be regression-tested
 * independently of the Gemini SDK or customer source code.
 */

const DEFAULT_PRIMARY = "gemini-3.6-flash"
const DEFAULT_FALLBACK = "gemini-3.5-flash-lite"
const DEFAULT_LAST_RESORT = "gemini-3.1-flash-lite"

export type ModelFailure = "capacity" | "transient" | "not_found" | "credential" | "other"

/**
 * Prefer the newly rotated key in Production when provided, preserving the
 * original name for Preview and rollback. Key selection is deterministic:
 * never alternate keys on a 429 or quota error; quotas apply per project.
 * Only the env variable name may appear in server logs, never key material.
 */
export function selectGeminiCredential(
  env: Record<string, string | undefined>
): { value: string; variable: "GEMINI_API_KEY2" | "GEMINI_API_KEY" } | null {
  const replacement = env.GEMINI_API_KEY2?.trim()
  if (replacement) return { value: replacement, variable: "GEMINI_API_KEY2" }

  const legacy = env.GEMINI_API_KEY?.trim()
  if (legacy) return { value: legacy, variable: "GEMINI_API_KEY" }
  return null
}

export function modelCandidates(env: Record<string, string | undefined>): string[] {
  const requested = [
    env.GEMINI_MODEL?.trim() || DEFAULT_PRIMARY,
    env.GEMINI_FALLBACK_MODEL?.trim() || DEFAULT_FALLBACK,
    env.GEMINI_SECOND_FALLBACK_MODEL?.trim() || DEFAULT_LAST_RESORT,
  ]
  const safe = requested.filter((name) => /^gemini-[a-z0-9][a-z0-9.-]{2,100}$/i.test(name))

  // Production should use stable models. Do not silently send customer code
  // to a preview or experimental model when an approved stable one is present.
  const prodSafe = env.NODE_ENV === "production"
    ? safe.filter((name) => !/(preview|experimental|exp)/i.test(name))
    : safe

  return [...new Set(prodSafe)]
}

export function modelFailure(error: unknown): ModelFailure {
  const status = typeof error === "object" && error !== null && "status" in error
    ? Number((error as { status: unknown }).status)
    : NaN
  const msg = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase()

  if (status === 401 || status === 403 ||
      /api key (not valid|invalid|expired)|permission denied|billing (disabled|not enabled)/.test(msg)) {
    return "credential"
  }
  if (status === 404 || /\b404\b|model.*not found|not found.*model|unsupported model/.test(msg)) {
    return "not_found"
  }
  if (status === 429 || /\b429\b|resource_exhausted|quota exceeded|rate.limit|too many requests/.test(msg)) {
    return "capacity"
  }
  if ([500, 502, 503, 504].includes(status) || /\b(500|502|503|504)\b|high demand|temporarily unavailable|unavailable due to overload/.test(msg)) {
    return "transient"
  }
  return "other"
}

export function canTryAnotherModel(failure: ModelFailure): boolean {
  return failure === "capacity" || failure === "transient" || failure === "not_found"
}
