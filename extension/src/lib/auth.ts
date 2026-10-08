/**
 * Extension authentication.
 *
 * The website session cookie is not a reliable auth transport for a
 * chrome-extension:// origin because browser third-party-cookie policies can
 * block it. The website therefore hands the authenticated Supabase session to
 * the extension through the first-party auth bridge. API calls then use the
 * access token as a Bearer token and refresh it server-side when needed.
 */

import { getStorage, setStorage, clearAuth } from "./storage"
import type { AuthUser } from "./types"

const APP_URL = import.meta.env.VITE_APP_URL || "https://suitemigrate.vercel.app"

type RefreshResponse = {
  accessToken: string
  refreshToken: string
  expiresAt: number | null
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await getStorage("authRefreshToken")
  if (!refreshToken) return null

  try {
    const res = await fetch(`${APP_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "omit",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    })

    if (!res.ok) {
      await clearAuth()
      return null
    }

    const data = await res.json() as RefreshResponse
    if (!data.accessToken || !data.refreshToken) {
      await clearAuth()
      return null
    }

    await Promise.all([
      setStorage("authToken", data.accessToken),
      setStorage("authRefreshToken", data.refreshToken),
      setStorage("authExpiresAt", data.expiresAt ?? undefined),
    ])

    return data.accessToken
  } catch (err) {
    console.error("[auth] refreshAccessToken error:", err)
    return null
  }
}

function withAuthHeader(headers: HeadersInit | undefined, token: string | undefined) {
  const next = new Headers(headers)
  if (token) next.set("Authorization", `Bearer ${token}`)
  return next
}

export async function authFetch(path: string, init: RequestInit = {}): Promise<Response> {
  let token = await getStorage("authToken")

  let res = await fetch(`${APP_URL}${path}`, {
    ...init,
    credentials: "include", // cookie fallback for older/dev sessions
    headers: withAuthHeader(init.headers, token),
  })

  if (res.status !== 401) return res

  token = (await refreshAccessToken()) ?? undefined
  if (!token) return res

  return fetch(`${APP_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: withAuthHeader(init.headers, token),
  })
}

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  try {
    const res = await authFetch("/api/auth/session", {
      headers: { "Content-Type": "application/json" },
    })

    if (!res.ok) {
      if (res.status === 401) await clearAuth()
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
    // Website logout is best effort; extension credentials are already cleared.
  }
}

export function getLoginUrl(): string {
  return `${APP_URL}/login?from=extension`
}

export function getSignupUrl(): string {
  return `${APP_URL}/signup?from=extension`
}
