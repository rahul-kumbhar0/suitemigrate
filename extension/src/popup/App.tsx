import { useEffect, useCallback } from "react"
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

  const tryAuth = useCallback(async () => {
    // Show cached instantly — no flicker
    const cached = await getCachedUser()
    if (cached) {
      setUser(cached)
      const accounts = await getAllAccounts()
      setAccounts(accounts)
      setView("dashboard")
    }

    // Verify fresh in background
    const fresh = await fetchCurrentUser()
    if (fresh) {
      setUser(fresh)
      const accounts = await getAllAccounts()
      setAccounts(accounts)
      setView("dashboard")
    } else if (!cached) {
      // No cache and no fresh — show login
      setUser(null)
      setView("login_required")
    }
    // If fresh null but cached exists — keep showing dashboard (network issue)
  }, [setUser, setView, setAccounts])

  useEffect(() => {
    tryAuth()

    // Re-check when popup regains focus (user comes back from website)
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        tryAuth()
      }
    }
    document.addEventListener("visibilitychange", handleVisibility)

    // Listen for chrome.storage changes — fires when website.js writes token
    const storageListener = (
      changes: { [key: string]: chrome.storage.StorageChange }
    ) => {
      if (changes.authToken?.newValue) {
        // Token appeared — user just logged in on website
        tryAuth()
      }
      if (changes.authToken?.oldValue && !changes.authToken?.newValue) {
        // Token removed — user logged out
        setUser(null)
        setView("login_required")
      }
    }
    chrome.storage.local.onChanged.addListener(storageListener)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility)
      chrome.storage.local.onChanged.removeListener(storageListener)
    }
  }, [tryAuth, setUser, setView])

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
