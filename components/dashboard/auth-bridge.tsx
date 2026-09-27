"use client"

/**
 * AuthBridge — runs in the dashboard, broadcasts the Supabase
 * access token so the Chrome extension can pick it up.
 * The extension injects a content script that listens for this message.
 */

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export function AuthBridge() {
  useEffect(() => {
    const supabase = createClient()

    async function broadcastToken() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) return

      // Post message to page — extension content script picks this up
      window.postMessage(
        {
          type: "SUITEMIGRATE_AUTH_TOKEN",
          token: session.access_token,
          expiresAt: session.expires_at,
        },
        "*"
      )

      // Also store in sessionStorage so extension can read it
      // via chrome.scripting.executeScript
      try {
        sessionStorage.setItem(
          "suitemigrate_token",
          JSON.stringify({
            token: session.access_token,
            expiresAt: session.expires_at,
          })
        )
      } catch {
        // ignore
      }
    }

    broadcastToken()

    // Re-broadcast on auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.access_token) {
          window.postMessage(
            {
              type: "SUITEMIGRATE_AUTH_TOKEN",
              token: session.access_token,
              expiresAt: session.expires_at,
            },
            "*"
          )
          try {
            sessionStorage.setItem(
              "suitemigrate_token",
              JSON.stringify({
                token: session.access_token,
                expiresAt: session.expires_at,
              })
            )
          } catch {
            // ignore
          }
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return null // renders nothing
}
