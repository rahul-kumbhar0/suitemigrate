/**
 * UpgradeView — E13 of brief
 *
 * Rules:
 * - Show only features that actually exist and are gated
 * - ZIP export removed: downloadAllConversions is multi-download, not a real ZIP
 * - Diff/Changes view removed: exists and is FREE (not a paid differentiator)
 * - Team card removed until Team features exist [OWNER TO CONFIRM]
 * - Prices kept as-is until confirmed [OWNER TO CONFIRM]
 */

import { ArrowRight } from "lucide-react"
import { useStore } from "../../lib/store"
import { getUpgradeUrl } from "../../lib/api"
import Header from "../components/Header"

// TODO [OWNER TO CONFIRM]: finalise Pro price before launch
// TODO [OWNER TO CONFIRM]: add Team card only when team features are implemented
const PRO_FEATURES = [
  "Unlimited conversions",
  "Batch conversion (convert whole account at once)",
  "HTML audit report export",
  "Conversion history (up to 100 scripts)",
  "Priority conversion queue",
] as const

export default function UpgradeView() {
  const { setView } = useStore()

  const handleUpgrade = () => {
    chrome.tabs.create({ url: getUpgradeUrl("pro") })
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Header showBack onBack={() => setView("script_list")} title="Upgrade to Pro" />

      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>

        {/* Limit notice */}
        <div className="card" style={{ padding: "10px 12px", borderColor: "rgba(217,74,31,.25)", background: "rgba(217,74,31,.04)", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".12em", color: "var(--clay)", marginBottom: 4 }}>
            Free conversions used
          </p>
          <p style={{ fontSize: 11.5, color: "var(--ink-soft)", lineHeight: 1.55 }}>
            You&apos;ve used your 5 free conversions. Upgrade to keep migrating.
          </p>
        </div>

        {/* Pro card */}
        <div style={{
          border: "1px solid var(--ink)",
          borderRadius: 4, padding: "16px",
          background: "var(--ink)",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
            <div>
              <p style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".14em", color: "rgba(250,250,249,.45)", marginBottom: 2 }}>
                Pro
              </p>
              <p style={{ fontSize: 11, fontStyle: "italic", color: "rgba(250,250,249,.5)" }}>
                One developer, one migration
              </p>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              {/* [OWNER TO CONFIRM] price */}
              <span style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: 24, letterSpacing: "-0.02em", color: "var(--paper)" }}>
                $29
              </span>
              <span style={{ fontSize: 10.5, color: "rgba(250,250,249,.45)", marginLeft: 2 }}>
                /month
              </span>
            </div>
          </div>

          <p style={{ fontFamily: "var(--f-mono)", fontSize: 9, color: "rgba(250,250,249,.35)", marginBottom: 12, letterSpacing: ".04em" }}>
            or one-time Migration Pass · [OWNER TO CONFIRM price]
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 14 }}>
            {PRO_FEATURES.map(f => (
              <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 7, fontSize: 11.5, color: "rgba(250,250,249,.75)" }}>
                <span style={{ color: "var(--clay)", fontFamily: "var(--f-mono)", fontSize: 10, flexShrink: 0, marginTop: 1 }}>✓</span>
                {f}
              </div>
            ))}
          </div>

          <button
            onClick={handleUpgrade}
            className="upgrade-btn-dark"
            style={{
              width: "100%", padding: "9px 14px", borderRadius: 999,
              background: "var(--clay)", color: "var(--paper)",
              border: "1px solid var(--clay)",
              fontSize: 12, fontWeight: 500, fontFamily: "var(--f-sans)",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              transition: "background .2s",
            }}
          >
            Get Pro <ArrowRight size={12} />
          </button>
        </div>

        {/* Lifetime footnote */}
        <p style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, color: "var(--ink-mute)", textAlign: "center", lineHeight: 1.6 }}>
          Lifetime deal also available on the website ·{" "}
          {/* [OWNER TO CONFIRM] lifetime price and end date */}
          [OWNER TO CONFIRM price &amp; availability]
        </p>

        <p style={{ fontFamily: "var(--f-mono)", fontSize: 9, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--ink-mute)", textAlign: "center" }}>
          Secured by Razorpay · UPI · Cards · Net Banking
        </p>
      </div>

      <style>{`.upgrade-btn-dark:hover { background: #c23d15 !important; }`}</style>
    </div>
  )
}
