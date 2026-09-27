/**
 * Auth — reads token from chrome.storage (written by website content script)
 * No executeScript, no cookies, no race conditions.
 */

import { setStorage, clearAuth, getStorage } from "./storage"
import type { AuthUser } from "./types"

const APP_URL = import.meta.env.VITE_APP_URL || "http://localhost:3000"

/** Get token from chrome.storage (written by website.js content script) */
async function getStoredToken(): Promise<string | null> {
  return new Promise((resolve) => {
    chrome.storage.local.get(["authToken", "authTokenExpiresAt"], (result) => {
      const token = result.authToken as string | undefined
      const expiresAt = result.authTokenExpiresAt as number | undefined

      if (!token) {
        resolve(null)
        return
      }

      // Check expiry
      if (expiresAt && Date.now() / 1000 > expiresAt) {
        chrome.storage.local.remove(["authToken", "authTokenExpiresAt"])
        resolve(null)
        return
      }

      resolve(token)
    })
  })
}

/** Verify token with backend */
async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    const res = await fetch(
      `${APP_URL}/api/auth/token?token=${encodeURIComponent(token)}`
    )
    if (!res.ok) return null
    const data = await res.json()
    if (!data.authenticated) return null

    return {
      id: data.id,
      email: data.email,
      name: data.name,
      plan: data.plan,
      conversionsUsed: data.conversionsUsed,
      conversionsRemaining: data.conversionsRemaining,
      unlimited: data.unlimited,
    }
  } catch (err) {
    console.error("[SuiteMigrate] verifyToken:", err)
    return null
  }
}

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  const token = await getStoredToken()
  if (!token) return null

  const user = await verifyToken(token)
  if (user) {
    await setStorage("authUser", user)
    await setStorage("authToken", token)
  }
  return user
}

export async function getCachedUser(): Promise<AuthUser | null> {
  return (await getStorage("authUser")) ?? null
}

export async function signOut(): Promise<void> {
  chrome.storage.local.remove(["authToken", "authTokenExpiresAt"])
  await clearAuth()
}

export function getLoginUrl(): string {
  return `${APP_URL}/login`
}

export function getSignupUrl(): string {
  return `${APP_URL}/signup`
}
