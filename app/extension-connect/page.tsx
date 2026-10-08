"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

type Status = "checking" | "connecting" | "connected" | "missing" | "error"

export default function ExtensionConnectPage() {
  const [status, setStatus] = useState<Status>("checking")
  const [message, setMessage] = useState("Checking your SuiteMigrate session…")

  useEffect(() => {
    const supabase = createClient()
    let timer: ReturnType<typeof setInterval> | null = null
    let timeout: ReturnType<typeof setTimeout> | null = null
    let stopped = false

    const cleanup = () => {
      if (timer) clearInterval(timer)
      if (timeout) clearTimeout(timeout)
      window.removeEventListener("message", onMessage)
    }

    const onMessage = (event: MessageEvent) => {
      if (event.source !== window || event.origin !== window.location.origin) return
      if (event.data?.type !== "SUITEMIGRATE_AUTH_ACK" || event.data?.source !== "suitemigrate-extension") return

      if (event.data?.ok) {
        stopped = true
        cleanup()
        setStatus("connected")
        setMessage("Extension connected. Open SuiteMigrate from the Chrome toolbar to continue.")
        return
      }

      stopped = true
      cleanup()
      setStatus("error")
      setMessage("The extension received the session but could not save it. Reload the extension and try again.")
    }

    window.addEventListener("message", onMessage)

    const start = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error || !data.session) {
        cleanup()
        window.location.replace("/login?from=extension")
        return
      }

      setStatus("connecting")
      setMessage("Connecting your signed-in account to the extension…")

      const userId = data.session.user.id

      const [{ data: profile }, { count }] = await Promise.all([
        supabase
          .from("users")
          .select("plan, conversions_limit, entitlement_expires_at, name")
          .eq("id", userId)
          .maybeSingle(),
        supabase
          .from("conversions")
          .select("id", { count: "exact", head: true })
          .eq("user_id", userId),
      ])

      const expired = Boolean(
        profile?.entitlement_expires_at &&
        new Date(profile.entitlement_expires_at).getTime() <= Date.now()
      )
      const plan = expired ? "free" : (profile?.plan || "free")
      const used = count ?? 0
      const unlimited = plan !== "free"

      const payload = {
        type: "SUITEMIGRATE_AUTH_SESSION",
        source: "suitemigrate-web",
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: data.session.expires_at ?? null,
        authUser: {
          id: userId,
          email: data.session.user.email ?? "",
          name: profile?.name || data.session.user.user_metadata?.name || "",
          plan,
          conversionsUsed: used,
          conversionsRemaining: unlimited ? null : Math.max(0, 5 - used),
          unlimited,
        },
      }

      const send = () => {
        if (!stopped) window.postMessage(payload, window.location.origin)
      }

      send()
      timer = setInterval(send, 600)
      timeout = setTimeout(() => {
        if (stopped) return
        cleanup()
        setStatus("missing")
        setMessage("The SuiteMigrate extension did not respond. Make sure the latest test extension is installed and enabled, then reload this page.")
      }, 8000)
    }

    start().catch((err) => {
      console.error("[extension-connect]", err)
      cleanup()
      setStatus("error")
      setMessage("Could not connect the extension. Please reload this page and try again.")
    })

    return cleanup
  }, [])

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "var(--paper-warm)" }}>
      <div style={{ width: "100%", maxWidth: 460, border: "1px solid var(--rule)", borderRadius: 8, background: "var(--paper)", padding: 32 }}>
        <p style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--clay)", marginBottom: 10 }}>
          SuiteMigrate extension
        </p>
        <h1 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: 30, color: "var(--ink)", marginBottom: 12 }}>
          {status === "connected" ? "You’re connected." : "Connect your account."}
        </h1>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--ink-soft)", marginBottom: 22 }}>
          {message}
        </p>

        {status === "connected" && (
          <div style={{ padding: "12px 14px", border: "1px solid var(--rule)", borderRadius: 5, marginBottom: 18, fontSize: 13, color: "var(--ink-soft)" }}>
            You can close this tab. Your extension now has the same signed-in SuiteMigrate session.
          </div>
        )}

        {(status === "missing" || status === "error") && (
          <button
            onClick={() => window.location.reload()}
            className="btn-pill"
            style={{ width: "100%", justifyContent: "center", marginBottom: 10 }}
          >
            Try again
          </button>
        )}

        <Link href="/dashboard" style={{ display: "block", textAlign: "center", fontSize: 13, color: "var(--ink-soft)", textDecoration: "none" }}>
          Open dashboard
        </Link>
      </div>
    </main>
  )
}
