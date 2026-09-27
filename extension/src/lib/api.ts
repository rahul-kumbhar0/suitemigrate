/**
 * API client — calls the SuiteMigrate backend
 * Always sends Bearer token in Authorization header (no cookies needed)
 */

import { getStorage } from "./storage"

const APP_URL = import.meta.env.VITE_APP_URL || "http://localhost:3000"

async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await getStorage("authToken")
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

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
  const headers = await getAuthHeaders()
  const res = await fetch(`${APP_URL}/api/convert`, {
    method: "POST",
    headers,
    body: JSON.stringify(req),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "Conversion failed")
  return data
}

export async function getUserInfo() {
  const headers = await getAuthHeaders()
  const res = await fetch(`${APP_URL}/api/user`, { headers })
  if (!res.ok) throw new Error("Not authenticated")
  return res.json()
}

export function getUpgradeUrl(plan: string): string {
  return `${APP_URL}/api/payments/checkout?plan=${plan}`
}
