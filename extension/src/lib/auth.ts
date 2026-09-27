/**
 * Auth — polls /api/auth/session to check auth status
 * No localStorage sync needed — uses HTTP-only cookies set by Supabase
 */

import { getStorage, setStorage, clearAuth } from "./storage"
import type { AuthUser } from "./types"

const APP_URL = import.meta.env.VITE_APP_URL || "http://localhost:3000"

/**
 * Fetch current user session from /api/auth/session
 * Uses credentials:include to send HTTP-only cookies
 */
export async function fetchCurrentUser(): Promise<AuthUser | null> {
  try {
    const res = await fetch(`${APP_URL}/api/auth/session`, {
      credentials: "include", // Send HTTP-only cookies
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      // 401 = not authenticated
      if (res.status === 401) {
        await clearAuth()
        return null
      }
      // Network or server error — return cached user if available
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

    if (!data.authenticated || !data.id) {
      await clearAuth()
      return null
    }

    const user: AuthUser = {
      id: data.id,
      email: data.email ?? "",
      name: data.name ?? "",
      plan: (data.plan as AuthUser["plan"]) ?? "free",
      conversionsUsed: data.conversionsUsed ?? 0,
      conversionsRemaining: data.conversionsRemaining ?? null,
      unlimited: data.unlimited ?? false,
    }

    // Cache for instant display
    await setStorage("authUser", user)
    return user
  } catch (err) {
    console.error("[fetchCurrentUser]", err)
    // Network error — return cached user (might be offline)
    return null
  }
}

export async function getCachedUser(): Promise<AuthUser | null> {
  return (await getStorage("authUser")) ?? null
}

export async function signOut(): Promise<void> {
  // Clear extension storage
  await clearAuth()

  // Call website logout API
  const APP_URL = import.meta.env.VITE_APP_URL || "http://localhost:3000"
  try {
    await fetch(`${APP_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    })
  } catch {
    // Logout failed on server — at least we cleared local cache
  }
}

export function getLoginUrl(): string {
  const APP_URL = import.meta.env.VITE_APP_URL || "http://localhost:3000"
  return `${APP_URL}/login`
}

export function getSignupUrl(): string {
  const APP_URL = import.meta.env.VITE_APP_URL || "http://localhost:3000"
  return `${APP_URL}/signup`
}
