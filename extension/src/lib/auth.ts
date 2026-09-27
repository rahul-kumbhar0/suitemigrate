/**
 * Auth — reads Supabase token written by the website's AuthBridge component.
 * Primary: chrome.storage.local (written by website.js content script)
 * Fallback: inject into website tab and read localStorage directly
 */

import { getStorage, setStorage, clearAuth } from "./storage"
import type { AuthUser } from "./types"

const APP_URL = import.meta.env.VITE_APP_URL || "http://localhost:3000"
const STORAGE_KEY = "suitemigrate_auth"

/** Read token from chrome.storage (written by website.js content script) */
async function getTokenFromChromeStorage(): Promise<string | null> {
  return new Promise((resolve) => {
    chrome.storage.local.get(["authToken", "authTokenExpiresAt"], (result) => {
      const token = result.authToken as string | undefined
      const expiresAt = result.authTokenExpiresAt as number | undefined

      if (!token) { resolve(null); return }

      if (expiresAt && Date.now() / 1000 > expiresAt) {
        chrome.storage.local.remove(["authToken", "authTokenExpiresAt"])
        resolve(null)
        return
      }

      resolve(token)
    })
  })
}

/** Fallback: inject into website tab and read localStorage directly */
async function getTokenByInjection(): Promise<string | null> {
  try {
    const tabs = await chrome.tabs.query({})
    // Find any tab with our website
    const websiteTab = tabs.find(t =>
      t.url?.includes("suitemigrate.vercel.app") ||
      t.url?.includes("localhost:3000")
    )

    if (!websiteTab?.id) return null

    const results = await chrome.scripting.executeScript({
      target: { tabId: websiteTab.id },
      func: (key: string) => {
        try {
          const raw = localStorage.getItem(key)
          if (!raw) return null
          const parsed = JSON.parse(raw) as { token: string; expiresAt: number }
          if (!parsed?.token) return null
          if (parsed.expiresAt && Date.now() / 1000 > parsed.expiresAt) return null
          return parsed
        } catch { return null }
      },
      args: [STORAGE_KEY],
    })

    const result = results?.[0]?.result as { token: string; expiresAt: number } | null
    if (!result?.token) return null

    // Save to chrome.storage for next time
    chrome.storage.local.set({
      authToken: result.token,
      authTokenExpiresAt: result.expiresAt,
    })

    return result.token
  } catch {
    return null
  }
}

/** Verify token with backend and get user profile */
async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    const res = await fetch(
      `${APP_URL}/api/auth/token?token=${encodeURIComponent(token)}`
    )

    // Only treat as invalid on explicit 401 — not on network errors or 500s
    if (res.status === 401) {
      chrome.storage.local.remove(["authToken", "authTokenExpiresAt"])
      return null
    }

    if (!res.ok) {
      // Network or server error — return null but keep token cached
      return null
    }

    const data = await res.json() as {
      authenticated: boolean
      id: string
      email: string
      name: string
      plan: string
      conversionsUsed: number
      conversionsRemaining: number | null
      unlimited: boolean
    }

    if (!data.authenticated) {
      chrome.storage.local.remove(["authToken", "authTokenExpiresAt"])
      return null
    }

    return {
      id: data.id,
      email: data.email,
      name: data.name,
      plan: data.plan as AuthUser["plan"],
      conversionsUsed: data.conversionsUsed,
      conversionsRemaining: data.conversionsRemaining,
      unlimited: data.unlimited,
    }
  } catch {
    // Network error — don't clear token, might just be offline
    return null
  }
}

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  // Try chrome.storage first (fastest — set by content script)
  let token = await getTokenFromChromeStorage()

  // Fallback: inject into website tab
  if (!token) {
    token = await getTokenByInjection()
  }

  if (!token) return null

  // Verify with backend
  const user = await verifyToken(token)
  if (user) {
    await setStorage("authUser", user)
    await setStorage("authToken", token)
  }
  // Don't clear on null — could be network error, keep cached user
  return user
}

export async function getCachedUser(): Promise<AuthUser | null> {
  return (await getStorage("authUser")) ?? null
}

export async function signOut(): Promise<void> {
  // Clear extension storage
  chrome.storage.local.remove(["authToken", "authTokenExpiresAt"])
  await clearAuth()

  // Tell website tab to sign out too
  try {
    const tabs = await chrome.tabs.query({})
    const websiteTab = tabs.find(t =>
      t.url?.includes("suitemigrate.vercel.app") ||
      t.url?.includes("localhost:3000")
    )
    if (websiteTab?.id) {
      chrome.tabs.sendMessage(websiteTab.id, { type: "SUITEMIGRATE_SIGNOUT" })
    }
  } catch {
    // Website tab might not be open — that's fine, token is cleared anyway
  }
}

export function getLoginUrl(): string {
  return `${APP_URL}/login`
}

export function getSignupUrl(): string {
  return `${APP_URL}/signup`
}
