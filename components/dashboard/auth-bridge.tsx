"use client"

/**
 * AuthBridge — writes Supabase token to localStorage
 * The Chrome extension website.js content script reads it from there.
 * localStorage persists across page loads — no race conditions.
 */

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

const STORAGE_KEY = "suitemigrate_auth"

function writeToken(token: string, expiresAt: number | undefined) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ token, expiresAt: expiresAt ?? 0 })
    )
    window.postMessage(
      { type: "SUITEMIGRATE_AUTH_TOKEN", token, expiresAt },
      "*"
    )
  } catch {
    // ignore storage errors
  }
}

function clearToken() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    window.postMessage({ type: "SUITEMIGRATE_AUTH_LOGOUT" }, "*")
  } catch {
    // ignore
  }
}

export function AuthBridge() {
  useEffect(() => {
    const supabase = createClient()

    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.access_token) {
        writeToken(session.access_token, session.expires_at)
      }
    }

    init()

    // Listen for signout request from extension
    const handleSignout = (event: MessageEvent) => {
      if (event.source !== window) return
      if (event.data?.type !== "SUITEMIGRATE_DO_SIGNOUT") return
      supabase.auth.signOut()
    }
    window.addEventListener("message", handleSignout)

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.access_token) {
          writeToken(session.access_token, session.expires_at)
        } else {
          // Logged out from website — clear token so extension picks it up
          clearToken()
          try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
        }
      }
    )

    return () => {
      subscription.unsubscribe()
      window.removeEventListener("message", handleSignout)
    }
  }, [])

  return null
}
