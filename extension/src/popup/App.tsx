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
    const cached = await getCachedUser()
    if (cached) {
      setUser(cached)
      const accounts = await getAllAccounts()
      setAccounts(accounts)
      if (view === "loading" || view === "login_required") {
        setView("dashboard")
      }
    }

    const fresh = await fetchCurrentUser()
    if (fresh) {
      setUser(fresh)
      const accounts = await getAllAccounts()
      setAccounts(accounts)
      if (view === "loading" || view === "login_required") {
        setView("dashboard")
      }
    } else if (!cached) {
      setUser(null)
      setView("login_required")
    }
  }, [setUser, setView, setAccounts, view])

  useEffect(() => {
    tryAuth()

    pollIntervalRef.current = setInterval(() => {
      tryAuth()
    }, 30000)

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        tryAuth()
      }
    }

    // The website auth bridge writes authUser/authToken while this popup may
    // already be open. React immediately instead of waiting for focus or the
    // 30-second fallback poll.
    const handleStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if (
        areaName === "local" &&
        (changes.authUser || changes.authToken || changes.authRefreshToken)
      ) {
        tryAuth()
      }
    }

    document.addEventListener("visibilitychange", handleVisibility)
    chrome.storage.onChanged.addListener(handleStorageChange)

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
      document.removeEventListener("visibilitychange", handleVisibility)
      chrome.storage.onChanged.removeListener(handleStorageChange)
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
