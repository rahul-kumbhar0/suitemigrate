import type { Plan } from "@/types"

// ---------------------------------------------------------------------------
// Conversion limits
// ---------------------------------------------------------------------------
export const PLAN_LIMITS: Record<Plan, number> = {
  free:     5,        // 5 free conversions
  pro:      Infinity,
  lifetime: Infinity,
  team:     Infinity,
}

export function canConvert(plan: Plan, conversionsUsed: number): boolean {
  return conversionsUsed < PLAN_LIMITS[plan]
}

export function getRemainingConversions(plan: Plan, conversionsUsed: number): number {
  const limit = PLAN_LIMITS[plan]
  if (limit === Infinity) return Infinity
  return Math.max(0, limit - conversionsUsed)
}

export function isUnlimited(plan: Plan): boolean {
  return PLAN_LIMITS[plan] === Infinity
}

// ---------------------------------------------------------------------------
// Feature gating — §12 of brief
// All gating is checked server-side before returning a response.
// Never rely on UI-only checks for paid features.
// ---------------------------------------------------------------------------

/**
 * §12.1 PDF audit report — Pro and Team only.
 * Free plan users see a paywall response when requesting a PDF export.
 */
export function canExportPDF(plan: Plan): boolean {
  return plan === "pro" || plan === "lifetime" || plan === "team"
}

/**
 * §12.2 Batch conversion — Pro and Team only.
 * Converting multiple scripts in one API call is blocked for free users.
 */
export function canBatchConvert(plan: Plan): boolean {
  return plan === "pro" || plan === "lifetime" || plan === "team"
}

/**
 * §12.3 ZIP export and conversion history — Pro and Team only.
 */
export function canZipExport(plan: Plan): boolean {
  return plan === "pro" || plan === "lifetime" || plan === "team"
}

export function canAccessHistory(plan: Plan): boolean {
  return plan === "pro" || plan === "lifetime" || plan === "team"
}

// ---------------------------------------------------------------------------
// §12.4 SuiteScript 2.1 behaviour-difference check stub
// ---------------------------------------------------------------------------
// [OWNER TO PROVIDE] the full list from Oracle's documentation.
// This is a starting rule-based list of patterns Oracle documents as
// behaving differently under the 2.1 engine (ES2023 vs ES5.1).
// Each rule has:
//   pattern  — regex to detect the risky code pattern
//   flag     — short label shown in the scan result
//   detail   — explanation for the developer
// ---------------------------------------------------------------------------

export interface BehaviourFlag {
  pattern: RegExp
  flag: string
  detail: string
}

export const BEHAVIOUR_DIFFERENCE_RULES: BehaviourFlag[] = [
  // [OWNER TO CONFIRM] — these are placeholder examples only.
  // Replace/extend with Oracle's documented list before launch.
  {
    pattern: /parseFloat\s*\(/,
    flag: "DECIMAL_RISK",
    detail:
      "parseFloat() may return different precision under ES2023. " +
      "Oracle documents decimal handling differences between SS 2.0 and 2.1. " +
      "[OWNER TO CONFIRM against SuiteAnswers documentation]",
  },
  {
    pattern: /new Date\s*\(/,
    flag: "DATE_RISK",
    detail:
      "Date constructor and date arithmetic behave differently in ES2023 vs ES5.1 " +
      "in some edge cases. Review date-dependent logic after conversion. " +
      "[OWNER TO CONFIRM against SuiteAnswers documentation]",
  },
  {
    pattern: /nlapiRequestURL|N\/https/,
    flag: "HTTP_RESPONSE_RISK",
    detail:
      "RESTlet and HTTP response handling has documented differences in SuiteScript 2.1. " +
      "Review response parsing logic. " +
      "[OWNER TO CONFIRM against SuiteAnswers documentation]",
  },
]

/**
 * Run behaviour-difference checks on a script's source code.
 * Returns an array of flags for any patterns detected.
 *
 * INTERNAL USE ONLY — do not expose results in UI or marketing copy
 * until the rule list is confirmed against Oracle documentation (TODO E-4).
 * See CONTENT-TODO.md item E-4.
 *
 * @internal
 */
export function checkBehaviourDifferences(code: string): BehaviourFlag[] {
  return BEHAVIOUR_DIFFERENCE_RULES.filter(rule => rule.pattern.test(code))
}
