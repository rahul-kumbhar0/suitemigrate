export type Plan = "free" | "pro" | "annual" | "lifetime" | "team"

export interface AuthUser {
  id: string
  email: string
  name: string | null
  plan: Plan
  conversionsUsed: number
  conversionsRemaining: number | null
  unlimited: boolean
}

export interface NSScript {
  id: string
  name: string
  scriptType: string
  apiVersion: string        // "1.0" | "2.0" | "2.1"
  deploymentId?: string
  description?: string
  riskLevel: "HIGH" | "MEDIUM" | "LOW" | "NONE"
  needsMigration: boolean
  hasFile?: boolean         // whether scriptfile column is non-null
  sourceAccess?: "unknown" | "readable" | "no_file" | "restricted" | "protected"
  sourceAccessNote?: string
}

export interface NSAccount {
  accountId: string
  accountName: string
  lastScannedAt: string | null
  scripts: NSScript[]
  scriptsTotal: number
  scriptsNeedingUpdate: number
}

export interface ConversionResult {
  conversionId: string
  scriptName: string
  convertedCode: string
  originalCode: string
  confidenceScore: number
  changeLog: string[]
  manualReviewLines: number[]
  isValid: boolean
  validationErrors: string[]
  scriptType: string
  originalVersion: string
}

export type AppView =
  | "loading"
  | "login_required"
  | "dashboard"
  | "script_list"
  | "converting"
  | "conversion_result"
  | "upgrade"
  | "settings"
