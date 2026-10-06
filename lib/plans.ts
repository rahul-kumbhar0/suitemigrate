import type { Plan } from "@/types"

export const PLAN_LIMITS: Record<Plan, number> = {
  free: 5,
  pro: Infinity,
  lifetime: Infinity,
  team: Infinity, // retained only for backwards compatibility with existing accounts
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
