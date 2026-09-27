import { Zap, Settings, LogOut } from "lucide-react"
import { useStore } from "../../lib/store"
import { signOut } from "../../lib/auth"

interface HeaderProps {
  showBack?: boolean
  onBack?: () => void
  title?: string
}

export default function Header({ showBack, onBack, title }: HeaderProps) {
  const { user, setUser, setView } = useStore()

  const handleSignOut = async () => {
    await signOut()
    setUser(null)
    setView("login_required")
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e3a5f] bg-[#0a1628]">
      <div className="flex items-center gap-2">
        {showBack ? (
          <button
            onClick={onBack}
            className="text-slate-400 hover:text-white mr-1 transition-colors"
            aria-label="Back"
          >
            ←
          </button>
        ) : null}
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-emerald-500 to-teal-500">
          <Zap className="h-3 w-3 text-white" />
        </div>
        <span className="text-sm font-bold text-white">
          {title || <><span>Suite</span><span className="gradient-text">Migrate</span></>}
        </span>
      </div>

      <div className="flex items-center gap-1">
        {user && (
          <div className="flex items-center gap-1 mr-1">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold
              ${user.plan === "free"
                ? "bg-slate-700 text-slate-300"
                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"}`}>
              {user.plan === "free" ? "Free" : user.plan === "lifetime" ? "Pro ∞" : user.plan}
            </span>
          </div>
        )}
        <button
          onClick={handleSignOut}
          className="p-1.5 text-slate-500 hover:text-red-400 transition-colors rounded"
          title="Sign out"
        >
          <LogOut className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
