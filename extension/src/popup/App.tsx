import { useEffect } from "react"
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

  useEffect(() => {
    async function init() {
      // Show cached user instantly while we verify
      const cached = await getCachedUser()
      if (cached) {
        setUser(cached)
        const accounts = await getAllAccounts()
        setAccounts(accounts)
        setView("dashboard")
      }

      // Always verify with server (handles logout from website)
      const fresh = await fetchCurrentUser()
      if (fresh) {
        setUser(fresh)
        const accounts = await getAllAccounts()
        setAccounts(accounts)
        setView("dashboard")
      } else {
        // Not authenticated — clear any stale cache
        setUser(null)
        setView("login_required")
      }
    }
    init()
  }, [setUser, setView, setAccounts])

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
