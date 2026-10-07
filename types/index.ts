export type Plan = "free" | "pro" | "annual" | "lifetime" | "team"

export interface User {
  id: string
  email: string
  name: string | null
  plan: Plan
  conversions_used: number
  conversions_limit: number | null
  entitlement_expires_at?: string | null
  team_id: string | null
  created_at: string
}

export interface NSAccount {
  id: string
  user_id: string
  account_id: string
  account_name: string
  last_scanned_at: string | null
  scripts_total: number
  scripts_needing_update: number
}

export interface Conversion {
  id: string
  user_id: string
  ns_account_id: string
  script_id: string
  script_name: string
  original_version: "1.0" | "2.0" | "2.x" | "unknown"
  script_type: string
  original_code: string | null
  converted_code: string
  confidence_score: number
  changes_log: string[]
  manual_review_lines: number[]
  created_at: string
}

export interface PricingPlan {
  id: string
  name: string
  price: string
  period: string
  description: string
  features: string[]
  cta: string
  highlighted: boolean
  badge?: string
}
