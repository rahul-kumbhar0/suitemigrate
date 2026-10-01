import { LogOut } from "lucide-react"
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
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 14px",
      borderBottom: "1px solid var(--rule)",
      background: "var(--paper)",
    }}>
      {/* Left: back + brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {showBack && (
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-mute)", fontSize: 14, padding: "0 2px", display: "flex", alignItems: "center" }}
            aria-label="Back">
            ←
          </button>
        )}
        {/* Clay dot brand */}
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--clay)", display: "inline-block", flexShrink: 0 }} />
        <span style={{ fontFamily: "var(--f-head)", fontSize: 14, fontWeight: 400, letterSpacing: "-0.01em", color: "var(--ink)" }}>
          {title || "SuiteMigrate"}
        </span>
      </div>

      {/* Right: plan badge + sign out */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {user && (
          <span style={{
            fontFamily: "var(--f-mono)", fontSize: 9, textTransform: "uppercase",
            letterSpacing: ".14em", padding: "2px 7px", borderRadius: 3,
            background: user.plan === "free" ? "rgba(15,23,42,.07)" : "rgba(217,74,31,.10)",
            color: user.plan === "free" ? "var(--ink-mute)" : "var(--clay)",
            border: "1px solid var(--rule)",
          }}>
            {user.plan === "free" ? "Free" : user.plan === "lifetime" ? "Lifetime" : user.plan}
          </span>
        )}
        <button onClick={handleSignOut} title="Sign out"
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-mute)", display: "flex", padding: 3, borderRadius: 3, transition: "color .15s" }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--clay)")}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--ink-mute)")}>
          <LogOut size={13} />
        </button>
      </div>
    </div>
  )
}
