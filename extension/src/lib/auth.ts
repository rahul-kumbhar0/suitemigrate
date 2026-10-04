/**
 * Auth — polls /api/auth/session to check auth status
 * Uses credentials:include (HTTP-only cookies set by Supabase)
 * No Bearer token needed — session cookie handles auth.
 *
 * Item 1 fix: all fallbacks default to production URL, not localhost
 */

import { getStorage, setStorage, clearAuth } from "./storage"
import type { AuthUser } from "./types"

// Single source — Vite replaces at build time; default is production URL
const APP_URL = import.meta.env.VITE_APP_URL || "https://suitemigrate.vercel.app"

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  try {
    const res = await fetch(`${APP_URL}/api/auth/session`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })

    if (!res.ok) {
      if (res.status === 401) { await clearAuth(); return null }
      return null
    }

    const data = await res.json() as {
      authenticated: boolean
      id?: string
      email?: string
      name?: string
      plan?: string
      conversionsUsed?: number
      conversionsRemaining?: number | null
      unlimited?: boolean
    }

    if (!data.authenticated || !data.id) { await clearAuth(); return null }

    const user: AuthUser = {
      id: data.id,
      email: data.email ?? "",
      name: data.name ?? "",
      plan: (data.plan as AuthUser["plan"]) ?? "free",
      conversionsUsed: data.conversionsUsed ?? 0,
      conversionsRemaining: data.conversionsRemaining ?? null,
      unlimited: data.unlimited ?? false,
    }

    await setStorage("authUser", user)
    return user
  } catch (err) {
    console.error("[auth] fetchCurrentUser error:", err)
    return null
  }
}

export async function getCachedUser(): Promise<AuthUser | null> {
  return (await getStorage("authUser")) ?? null
}

export async function signOut(): Promise<void> {
  await clearAuth()
  try {
    await fetch(`${APP_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    })
  } catch {
    // Server logout failed — local cache is already cleared
  }
}

export function getLoginUrl():  string { return `${APP_URL}/login` }
export function getSignupUrl(): string { return `${APP_URL}/signup` }
