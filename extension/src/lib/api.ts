/**
 * API client — calls the SuiteMigrate backend
 *
 * Item 2 fix: auth uses credentials:"include" to send HTTP-only session cookies
 * (matching /api/auth/session which already uses cookies, not Bearer tokens).
 * Bearer token logic removed — authToken is never populated anyway.
 */

const APP_URL = import.meta.env.VITE_APP_URL || "https://suitemigrate.vercel.app"

export interface ConvertRequest {
  code: string
  scriptName: string
  nsAccountId: string
}

export interface ConvertResponse {
  success: boolean
  conversionId: string
  convertedCode: string
  originalVersion: string
  scriptType: string
  confidenceScore: number
  changeLog: string[]
  manualReviewLines: number[]
  isValid: boolean
  validationErrors: string[]
  requiredModules: string[]
  detectedApiCalls: string[]
  usage: { used: number; plan: string }
  error?: string
}

export async function convertScript(req: ConvertRequest): Promise<ConvertResponse> {
  const res = await fetch(`${APP_URL}/api/convert`, {
    method: "POST",
    credentials: "include",           // Item 2: send HTTP-only session cookie
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  })
  const contentType = res.headers.get("content-type") || ""
  const data = contentType.includes("application/json")
    ? await res.json()
    : { error: (await res.text()).slice(0, 300) }

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(
        "SuiteMigrate conversion API returned HTTP 404. The latest website/backend is not deployed at /api/convert yet."
      )
    }
    if (res.status === 401) {
      throw new Error("Your SuiteMigrate session expired. Sign in again, then retry the conversion.")
    }
    if (res.status === 403) {
      throw new Error("SuiteMigrate blocked this extension request. Check the production EXTENSION_ID/CORS configuration.")
    }
    if (res.status >= 500) {
      throw new Error(data.error || `SuiteMigrate server error (HTTP ${res.status}). Please retry.`)
    }
    throw new Error(data.error || `Conversion failed (HTTP ${res.status}).`)
  }
  return data as ConvertResponse
}

export async function getUserInfo() {
  const res = await fetch(`${APP_URL}/api/user`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  })
  if (!res.ok) throw new Error("Not authenticated")
  return res.json()
}

export function getUpgradeUrl(plan: string): string {
  return `${APP_URL}/dashboard/billing`  // direct to billing page, not checkout API
}
