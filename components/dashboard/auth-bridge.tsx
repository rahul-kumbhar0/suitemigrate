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
    // Also postMessage for content script if already loaded
    window.postMessage(
      { type: "SUITEMIGRATE_AUTH_TOKEN", token, expiresAt },
      "*"
    )
  } catch {
    // ignore storage errors
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.access_token) {
          writeToken(session.access_token, session.expires_at)
        } else {
          // Logged out — clear token
          try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return null
}
