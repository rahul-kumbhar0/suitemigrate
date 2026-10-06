import { useEffect, useCallback, useRef } from "react"
import { useStore } from "../lib/store"
import { fetchCurrentUser, getCachedUser } from "../lib/auth"
import { getAllAccounts } from "../lib/storage"
import LoadingView from "./pages/LoadingView"
import LoginRequiredView from "./pages/LoginRequiredView"
import DashboardView from "./pages/DashboardView"
import ScriptListView from "./pages/ScriptListView"
import ConvertingView from "./pages/ConvertingView"
import ConversionResultView from "./pages/ConversionResultView"
import UpgradeView from "./pages/UpgradeView"

export default function App() {
  const { view, setView, setUser, setAccounts } = useStore()
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const tryAuth = useCallback(async () => {
    // Show cached instantly — no flicker
    const cached = await getCachedUser()
    if (cached) {
      setUser(cached)
      const accounts = await getAllAccounts()
      setAccounts(accounts)
      // Only set view to dashboard if we're on loading or login_required
      if (view === "loading" || view === "login_required") {
        setView("dashboard")
      }
    }

    // Verify fresh in background
    const fresh = await fetchCurrentUser()
    if (fresh) {
      setUser(fresh)
      const accounts = await getAllAccounts()
      setAccounts(accounts)
      // Only set view to dashboard if we're on loading or login_required
      if (view === "loading" || view === "login_required") {
        setView("dashboard")
      }
    } else if (!cached) {
      // No cache and no fresh — show login
      setUser(null)
      setView("login_required")
    }
    // If fresh null but cached exists — keep showing dashboard (network issue)
  }, [setUser, setView, setAccounts, view])

  useEffect(() => {
    // Initial auth check
    tryAuth()

    // Light fallback polling; focus/visibility changes trigger immediate refresh.
    pollIntervalRef.current = setInterval(() => {
      tryAuth()
    }, 30000)

    // Re-check when popup regains focus (user comes back from website)
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        tryAuth()
      }
    }
    document.addEventListener("visibilitychange", handleVisibility)

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [tryAuth])

  switch (view) {
    case "loading":           return <LoadingView />
    case "login_required":    return <LoginRequiredView />
    case "dashboard":         return <DashboardView />
    case "script_list":       return <ScriptListView />
    case "converting":        return <ConvertingView />
    case "conversion_result": return <ConversionResultView />
    case "upgrade":           return <UpgradeView />
    default:                  return <DashboardView />
  }
}
