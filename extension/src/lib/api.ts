/**
 * API client — calls the SuiteMigrate backend with the extension auth session.
 */

import { authFetch } from "./auth"

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
  const res = await authFetch("/api/convert", {
    method: "POST",
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
    if (res.status === 402 && data.error === "conversion_limit_reached") {
      throw new Error("conversion_limit_reached")
    }
    if (res.status === 403) {
      throw new Error("SuiteMigrate blocked this extension request. Check the production EXTENSION_ID/CORS configuration.")
    }
    const serverMessage = data.message || data.error
    const supportCode = data.supportCode ? ` [${data.supportCode}]` : ""
    if (res.status >= 500) {
      throw new Error((serverMessage || `SuiteMigrate server error (HTTP ${res.status}). Please retry.`) + supportCode)
    }
    throw new Error((serverMessage || `Conversion failed (HTTP ${res.status}).`) + supportCode)
  }

  return data as ConvertResponse
}

export async function getUserInfo() {
  const res = await authFetch("/api/user", {
    headers: { "Content-Type": "application/json" },
  })
  if (!res.ok) throw new Error("Not authenticated")
  return res.json()
}

export function getUpgradeUrl(_plan: string): string {
  return `${APP_URL}/dashboard/billing`
}
