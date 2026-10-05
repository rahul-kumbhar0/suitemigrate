"use client"

import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Download, GitCompare, CheckCircle, Sparkles, BarChart3, Zap, Search, FileText, AlertTriangle } from "lucide-react"

// ---------------------------------------------------------------------------
// Part 1 + 2 of 2 — copy update complete
//  items are listed in CONTENT-TODO.md
// ---------------------------------------------------------------------------

// NOTE: promo codes are never displayed in public UI.
const faqs = [
  // ── Core product ──────────────────────────────────────────────
  {
    q: "Why not just paste my script into ChatGPT?",
    a: "Pasting one script is straightforward. SuiteMigrate does the parts that don't scale: it scans your whole account, risk-scores every script, checks for known SuiteScript 2.1 behaviour differences, and produces a report you can hand to a client or manager. One-off pastes don't give you the inventory, the risk prioritisation, or the audit trail.",
  },
  {
    q: "Do I need to migrate my 2.0 scripts?",
    a: "Yes. SuiteScript 2.0 and 2.x scripts are in scope for the 2028.2 deadline. From 2028.1, NetSuite will run them under the 2.1 engine by default. Oracle documents engine differences (ES2023 vs ES5.1) that can silently change results — decimal handling, date operations, RESTlet responses.",
  },
  {
    q: "Can I use NetSuite's own preference to run 2.0 scripts as 2.1?",
    a: "Yes, that setting exists. But it doesn't tell you which of your scripts will behave differently once the engine changes — it just flips the switch. SuiteMigrate's scan and behaviour-difference checks show you exactly which scripts are at risk before anything breaks.",
  },
  {
    q: "Is my code safe?",
    // §9.2 — links to the security section
    a: "See the Security & privacy section below. In short: the extension reads script records using your existing NetSuite session and never modifies your account. If you choose to convert a script, the code is sent to the AI provider for that conversion only. See the data-handling note near the top of the page for full details.",
  },
  {
    q: "What happens to my scripts if I cancel?",
    a: "Any scripts you have already downloaded are yours — they are standard JavaScript files on your machine. Conversion history stored in your account is accessible until your subscription ends. We do not delete your data immediately on cancellation; see the Terms of Service for the retention period.",
  },
  {
    q: "Do you offer refunds?",
    //  refund period (7 or 14 days) — matches §7.5 placeholder
    a: "Monthly plans can be cancelled at any time; you keep access until the end of the billing period. For the first payment on any paid plan, a 7-day money-back guarantee applies if the service does not work as described — contact us at support@suitemigrate.com.",
  },
  // ── Technical ─────────────────────────────────────────────────
  {
    q: "Does SuiteMigrate store my NetSuite credentials?",
    a: "No. The extension authenticates using your existing browser session — the same session you already have open. Your NetSuite credentials are never entered into, captured by, or transmitted through SuiteMigrate.",
  },
  {
    q: "How accurate is the AI conversion?",
    a: "SuiteMigrate runs mapping rules first, then its AI engine handles structural changes. Every result includes a confidence score (0–100%) and explicit flags on any lines that need manual review. Complex patterns are flagged, not silently converted.",
  },
  {
    q: "Which script types are supported?",
    a: "UserEvent, Suitelet, Scheduled, Map/Reduce, ClientScript, RESTlet, Portlet, MassUpdate — all types are supported. Both SS 1.0 → 2.1 and SS 2.0 / 2.x → 2.1 conversion paths are covered.",
  },
  {
    q: "Does it work with multiple accounts or Sandbox environments?",
    a: "Yes. The extension detects the current NetSuite environment automatically — Production, Sandbox, and Release Preview are all supported. Consultants and partners can scan multiple accounts by switching environments.",
  },
  {
    q: "What does the free plan include?",
    a: "Unlimited active-script scanning and version-risk inventory, plus 5 AI conversions with confidence scoring, change notes, manual-review flags, and JavaScript downloads. Pro and Lifetime add unlimited conversions and the HTML migration audit report.",
  },
]

export default function LandingPage() {
  // Countdown to 2028.2. The exact release date is unconfirmed by Oracle.
  //  Replace "2029-01-01" with confirmed 2028.2 date once known.
  // Until confirmed, we show "Releases until 2028.2" rather than a day count.
  const CONFIRMED_2028_2_DATE = "" // leave empty until confirmed
  const countdownLabel = CONFIRMED_2028_2_DATE
    ? `${Math.ceil((new Date(CONFIRMED_2028_2_DATE).getTime() - Date.now()) / 86_400_000)} releases until 2028.2`
    : "Releases until 2028.2"

  return (
    <div style={{ background: "var(--paper)" }}>
      <Navbar />

      {/* ═══════════════════════════════════════════
          HERO  (§2 of brief)
          — New headline, subheadline, buttons
          — Local-first / "never leave" claims removed
      ═══════════════════════════════════════════ */}
      <header className="landing-hero-padding" style={{ maxWidth: 1240, margin: "0 auto", position: "relative" }}>

        <div className="fade-up delay-1" style={{ marginBottom: 28 }}>
          <span className="eyebrow" style={{ fontSize: 10 }}>
            For NetSuite consultants, admins &amp; developers · Chrome extension · {countdownLabel}
          </span>
        </div>

        {/* §2.1 headline */}
        <h1 className="fade-up delay-2" style={{
          fontFamily: "var(--f-head)", fontWeight: 300,
          fontSize: "clamp(38px,7vw,96px)",
          lineHeight: .97, letterSpacing: "-0.035em",
          maxWidth: 900, marginBottom: 28,
        }}>
          Find every legacy SuiteScript<br />
          before the <em style={{ fontStyle: "italic", color: "var(--clay)" }}>2028.2 deadline does.</em>
        </h1>

        {/* §2.2 subheadline */}
        <p className="fade-up delay-3" style={{
          fontSize: "clamp(15px,2vw,18px)", color: "var(--ink-soft)",
          maxWidth: 560, lineHeight: 1.65, marginBottom: 36,
        }}>
          Scan your NetSuite account, see which scripts will break, and convert
          SuiteScript 1.0 / 2.0 / 2.x to 2.1 with a risk score on every script.
        </p>

        {/* §2.3 CTAs + §2.4 trust line */}
        <div className="fade-up delay-4 landing-hero-actions" style={{ marginBottom: 14 }}>
          {/* §2.3 primary */}
          <Link href="/signup" className="btn-pill">
            Scan my account free
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7h12m0 0L8 2m5 5L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </Link>
          {/* §2.3 secondary */}
          <Link href="/#pricing" className="ghost-cta" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            color: "var(--ink-soft)", fontSize: 14, textDecoration: "none",
          }}>
            See pricing →
          </Link>
        </div>

        {/* §2.4 micro-trust line */}
        <p className="fade-up delay-4" style={{
          fontFamily: "var(--f-mono)", fontSize: 10.5,
          color: "var(--ink-mute)", letterSpacing: ".04em",
          marginBottom: 0,
        }}>
          5 free conversions. No credit card.
        </p>

        {/* §9.1 — accurate data-handling statement (replaces removed "local-first" claim) */}
        <p className="fade-up delay-4" style={{
          fontFamily: "var(--f-mono)", fontSize: 10,
          color: "var(--ink-mute)", letterSpacing: ".04em",
          marginTop: 8,
        }}>
          Read-only · Never writes to NetSuite · Not affiliated with Oracle
        </p>
        
        <div className="fade-up delay-4" style={{
          marginTop: 14, padding: "10px 16px",
          border: "1px solid var(--rule)", borderRadius: 4,
          background: "rgba(15,23,42,.03)",
          maxWidth: 560, display: "inline-block", textAlign: "left",
        }}>
          <p style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: "var(--ink-mute)", lineHeight: 1.7 }}>
            <strong style={{ color: "var(--ink-soft)" }}>Data handling:</strong>{" "}
            The extension reads script metadata in your browser using your active NetSuite session.{" "}When you convert a script, that script&apos;s code is sent to our servers and processed by a third-party AI service. Converted scripts are stored on our servers for re-download.
            {" "}·{" "}
            <a href="#security" style={{ color: "var(--clay)", textDecoration: "none" }}>Security &amp; privacy details ↓</a>
          </p>
        </div>

        {/* Hero mock card */}
        <div className="landing-hero-card" style={{
          position: "absolute", top: 200, right: 40, width: 370,
          background: "var(--ink)", color: "var(--paper)",
          padding: 26, borderRadius: 8, fontFamily: "var(--f-mono)",
          boxShadow: "0 32px 64px -20px rgba(0,0,0,.3)",
          transform: "rotate(1.5deg)", pointerEvents: "none",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 9, textTransform: "uppercase", letterSpacing: ".2em", color: "rgba(250,250,249,.4)", marginBottom: 14 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
            Account scan · 67 scripts found
          </div>
          <div style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: 50, lineHeight: 1, letterSpacing: "-0.04em", marginBottom: 4 }}>
            43<span style={{ fontSize: 24, opacity: .4 }}> to migrate</span>
          </div>
          <div style={{ fontSize: 10, color: "rgba(250,250,249,.4)", letterSpacing: ".1em", marginBottom: 18 }}>
            SuiteScript 1.0 / 2.0 · risk-scored
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 3, marginBottom: 10 }}>
            {[
              {l:"UserEvt",a:true},{l:"Scheduled",a:true},{l:"MapReduce",w:true},{l:"Suitelet",a:false},
              {l:"RESTlet",a:true},{l:"Client",a:false},{l:"Portlet",a:true},{l:"MassUpd",w:true},
            ].map((m,i) => (
              <div key={i} style={{ height: 28, borderRadius: 2, background: m.w ? "rgba(217,74,31,.3)" : m.a ? "rgba(217,74,31,.15)" : "rgba(250,250,249,.08)", display: "flex", alignItems: "flex-end", padding: 3 }}>
                <span style={{ fontSize: 7, textTransform: "uppercase", color: "rgba(250,250,249,.5)" }}>{m.l}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "rgba(250,250,249,.3)", borderTop: "1px solid rgba(250,250,249,.08)", paddingTop: 9 }}>
            <span>12 HIGH · 18 MED · 13 LOW</span><span>scan complete →</span>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════
          DEADLINE TIMELINE  (§3 of brief)
          — 3-step timeline with accurate labels
          — Source line added
          — 2.0 behaviour note added
          — Dynamic countdown (unconfirmed date → label)
          — CTA at bottom
      ═══════════════════════════════════════════ */}
      <section style={{ borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)", padding: "48px 0" }}>
        <div className="landing-section-padding">

          <p style={{ fontFamily: "var(--f-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: ".2em", color: "var(--ink-mute)", textAlign: "center", marginBottom: 28 }}>
            Oracle NetSuite — official migration timeline
          </p>

          {/* §3.1 three-step timeline */}
          <div className="landing-deadline-strip" style={{ marginBottom: 24 }}>
            {[
              {
                date: "2027.1",
                label: "SuiteScript 1.0 enters end-of-life support",
                detail: "Critical issues only — no new features or general fixes.",
                color: "#b45309",
              },
              {
                date: "2028.1",
                label: "SuiteScript 2.0 and 2.x run as 2.1 by default",
                detail: "Scripts run under the 2.1 engine even without code changes.",
                color: "#c2410c",
              },
              {
                date: "2028.2",
                label: "Scripts using 1.0, 2.0 or 2.x stop working",
                detail: "Hard cutoff. Non-compliant scripts are blocked from execution.",
                color: "var(--clay)",
              },
            ].map(d => (
              <div key={d.date} style={{ flex: 1, minWidth: 200, textAlign: "center", padding: "8px 12px" }}>
                <div style={{ fontFamily: "var(--f-head)", fontWeight: 700, fontSize: "clamp(20px,3vw,28px)", letterSpacing: "-0.02em", marginBottom: 6, color: d.color }}>
                  {d.date}
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 500, color: "var(--ink)", lineHeight: 1.4, marginBottom: 4 }}>
                  {d.label}
                </div>
                <div style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, color: "var(--ink-mute)", lineHeight: 1.5 }}>
                  {d.detail}
                </div>
              </div>
            ))}
          </div>

          {/* §3.2 source line */}
          <p style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: "var(--ink-mute)", textAlign: "center", letterSpacing: ".04em", marginBottom: 20, lineHeight: 1.7 }}>
            Source: Oracle NetSuite SuiteAnswers article 1047412 — &ldquo;SuiteScript 2.1 Required for All Custom Scripts in NetSuite 2028.2&rdquo;
            {/*  Verify wording matches the live article before launch */}
          </p>

          {/* §3.4 2.0 behaviour note */}
          <div style={{
            maxWidth: 680, margin: "0 auto 28px",
            padding: "14px 20px", border: "1px solid var(--rule)",
            borderLeft: "3px solid var(--clay)", borderRadius: "0 4px 4px 0",
            background: "rgba(217,74,31,.03)",
          }}>
            <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.7 }}>
              <strong style={{ color: "var(--ink)" }}>2.0 scripts aren&apos;t &ldquo;working fine&rdquo; — they&apos;re a silent risk.</strong>{" "}
              SuiteScript 2.1 runs a different engine (ES2023 vs ES5.1). Oracle documents behaviour
              differences that can silently change results — decimal handling, date operations,
              RESTlet response formats. Scripts that run under 2.1 without code changes
              may produce different output.
            </p>
          </div>

          {/* §3.5 CTA under timeline */}
          <div style={{ textAlign: "center" }}>
            <Link href="/signup" className="btn-pill" style={{ fontSize: 14 }}>
              Scan my account free
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M1 7h12m0 0L8 2m5 5L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          00 — WHO IT'S FOR
          Audience reordered: consultants → admins → developers
      ═══════════════════════════════════════════ */}
      <section style={{ padding: "80px 0", borderTop: "1px solid var(--rule)" }}>
        <div className="landing-section-padding">
          <div className="landing-section-header">
            <div className="section-num">00 — Who it&apos;s for</div>
            <h2 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(26px,4.5vw,54px)", lineHeight: 1.04, letterSpacing: "-0.025em" }}>
              Built for the people who{" "}
              <em style={{ fontStyle: "italic", color: "var(--clay)" }}>own the migration.</em>
            </h2>
          </div>
          {/* Audience priority: consultants first, then admins, then developers */}
          <div className="landing-persona-grid">
            {[
              {
                title: "NetSuite Consultants &amp; Partners",
                desc: "Managing migrations across client accounts on a deadline. Get an active-script inventory, clear migration priority, reviewable conversions, and an HTML audit report for project handoff.",
                tags: ["Account inventory","Migration priority","HTML audit report"],
              },
              {
                title: "NetSuite Admins",
                desc: "Responsible for your organisation's scripts but not sure where to start. Scan active scripts and see which API versions still need migration before converting anything.",
                tags: ["Active-script inventory","Version risk","Audit report"],
              },
              {
                title: "NetSuite Developers",
                desc: "Need to convert scripts without losing the ability to review what changed. Get SuiteScript 2.1 output with change notes, manual-review flags, and downloadable JavaScript.",
                tags: ["2.1 conversion","Change review","JS download"],
              },
            ].map(p => (
              <div key={p.title} className="hover-warm" style={{ background: "var(--paper)", padding: "32px 26px", transition: "background .14s" }}>
                <h3 style={{ fontFamily: "var(--f-head)", fontWeight: 400, fontSize: 19, letterSpacing: "-0.015em", marginBottom: 10 }} dangerouslySetInnerHTML={{ __html: p.title }} />
                <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.65, marginBottom: 14 }}>{p.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {p.tags.map(t => (
                    <span key={t} style={{ fontFamily: "var(--f-mono)", fontSize: 9, textTransform: "uppercase", letterSpacing: ".1em", padding: "3px 8px", borderRadius: 3, background: "rgba(15,23,42,.07)", color: "var(--ink-mute)" }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PROBLEM STRIP (dark)
      ═══════════════════════════════════════════ */}
      <section style={{ padding: "48px 0", background: "var(--ink)" }}>
        <div className="landing-section-padding">
          <p style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".18em", color: "rgba(250,250,249,.35)", marginBottom: 14 }}>
            The situation before SuiteMigrate
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 8 }}>
            {[
              '"We have 200+ custom scripts and no clear picture of which are 1.0 vs 2.0 vs 2.1."',
              '"Manual conversion takes a full day per script — we can\'t do 200 scripts manually."',
              '"I assumed 2.0 scripts were fine. Now I hear they may break too in 2028.2."',
              '"I converted a script and it broke in production — no visibility into what changed."',
            ].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "13px 14px", border: "1px solid rgba(250,250,249,.08)", borderRadius: 4, fontSize: 13.5, color: "rgba(250,250,249,.7)", lineHeight: 1.5 }}>
                <span style={{ color: "var(--clay)", flexShrink: 0 }}>⚠</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          01 — FEATURES  (§6 of brief)
          — Row 1: scan, risk score, 2.1 behaviour checks, batch conversion
          — Row 2: diff, MIGRATED comments, PDF report, ZIP export
          — Known limits note added
          — "Everything free. Really." removed
          — "Local-first / never leave" feature removed (§2.5)
      ═══════════════════════════════════════════ */}
      <section id="features" style={{ padding: "100px 0", borderTop: "1px solid var(--rule)" }}>
        <div className="landing-section-padding">
          <div className="landing-section-header">
            <div className="section-num">01 — What it does</div>
            <h2 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(26px,4.5vw,54px)", lineHeight: 1.04, letterSpacing: "-0.025em" }}>
              Built for{" "}
              <em style={{ fontStyle: "italic", color: "var(--clay)" }}>NetSuite&apos;s reality.</em>
            </h2>
          </div>

          {/* §6.1 Row 1 — discovery & analysis */}
          <div className="landing-features-grid" style={{ marginBottom: 1 }}>
            {[
              {
                icon: Search,
                title: "Active-script scan & inventory",
                desc: "Scans active script records visible to your current NetSuite role. See script name, type, API version and whether a source file is attached. No NetSuite API key is required.",
                admin: "Gives admins and consultants a practical starting inventory before conversion work begins.",
              },
              {
                icon: BarChart3,
                title: "Version-based migration priority",
                desc: "Legacy scripts are labelled HIGH or MEDIUM priority primarily from their SuiteScript API version, while 2.1 scripts are marked current. Conversion results separately show confidence and manual-review flags.",
                admin: "Use the version-risk inventory to identify the oldest scripts first without presenting it as a full code-risk assessment.",
              },
              {
                icon: AlertTriangle,
                title: "Search and filter the migration inventory",
                desc: "Search scripts by name or type and filter between scripts that need an update, all active scripts, and scripts already on SuiteScript 2.1.",
                admin: "Keeps large inventories manageable without claiming unverified behaviour analysis.",
              },
              {
                icon: Zap,
                title: "Read-only NetSuite workflow",
                desc: "SuiteMigrate reads script metadata and selected source files but does not create, modify, deploy, or delete anything inside NetSuite.",
                admin: "Converted code stays under the user's control and should be tested in NetSuite Sandbox before production deployment.",
              },
            ].map(f => (
              <div key={f.title} className="hover-warm" style={{ background: "var(--paper)", padding: "34px 26px", transition: "background .14s" }}>
                <div style={{ marginBottom: 22 }}><f.icon size={22} style={{ color: "var(--ink)" }} /></div>
                <h3 style={{ fontFamily: "var(--f-head)", fontWeight: 400, fontSize: 18, letterSpacing: "-0.015em", marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.65, marginBottom: 10 }}>{f.desc}</p>
                <p style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, color: "var(--ink-mute)", lineHeight: 1.6, borderTop: "1px solid var(--rule)", paddingTop: 10 }}>{f.admin}</p>
              </div>
            ))}
          </div>

          {/* §6.2 Row 2 — conversion output */}
          <div className="landing-features-grid" style={{ marginBottom: 24 }}>
            {[
              {
                icon: GitCompare,
                title: "Three review views",
                desc: "Review the converted code, a structured change list, and highlighted inline migration comments from the same conversion result.",
                admin: "Makes generated changes easier to inspect before sandbox testing.",
              },
              {
                icon: Sparkles,
                title: "// MIGRATED: comments in converted code",
                desc: "Every modified line gets a // MIGRATED: comment explaining the specific change. The converted file is self-documenting — reviewers can understand each change without referring back to the original.",
                admin: "Clients and project managers can see exactly what was changed without needing to diff files manually.",
              },
              {
                icon: FileText,
                title: "HTML migration audit report",
                desc: "Paid plans can export a portable HTML report of the scanned active-script inventory, API versions, migration status, and version-risk labels.",
                admin: "Useful for migration scoping and stakeholder handoff without requiring a proprietary report viewer.",
              },
              {
                icon: Download,
                title: "Download converted JavaScript",
                desc: "Download each converted script as a standard JavaScript file with a conversion header, change summary, and reminders to review and test in Sandbox.",
                admin: "Keeps output portable and easy to review in an editor or source-control workflow.",
              },
            ].map(f => (
              <div key={f.title} className="hover-warm" style={{ background: "var(--paper)", padding: "34px 26px", transition: "background .14s" }}>
                <div style={{ marginBottom: 22 }}><f.icon size={22} style={{ color: "var(--ink)" }} /></div>
                <h3 style={{ fontFamily: "var(--f-head)", fontWeight: 400, fontSize: 18, letterSpacing: "-0.015em", marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.65, marginBottom: 10 }}>{f.desc}</p>
                <p style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, color: "var(--ink-mute)", lineHeight: 1.6, borderTop: "1px solid var(--rule)", paddingTop: 10 }}>{f.admin}</p>
              </div>
            ))}
          </div>

          {/* §6.4 Known limits note */}
          <div style={{
            padding: "16px 22px",
            border: "1px solid var(--rule)",
            borderLeft: "3px solid var(--ink-mute)",
            borderRadius: "0 4px 4px 0",
            background: "rgba(15,23,42,.03)",
          }}>
            <p style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, textTransform: "uppercase", letterSpacing: ".12em", color: "var(--ink-mute)", marginBottom: 6 }}>
              Known limits
            </p>
            <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.7 }}>
              Complex search logic, custom libraries, dynamic record-type handling, and unusual coding patterns
              are <strong style={{ color: "var(--ink)" }}>flagged for manual review</strong>, not silently converted.
              SuiteMigrate tells you what it cannot safely automate rather than producing code that
              appears correct but may fail at runtime.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          02 — HOW IT WORKS  (§4 of brief)
          — 4 steps: scan → review → convert → test+deploy
          — Step 4 sandbox warning added
          — Step 1 clarifies what is read and that nothing is modified
      ═══════════════════════════════════════════ */}
      <section id="how-it-works" style={{ padding: "100px 0", borderTop: "1px solid var(--rule)", background: "rgba(237,233,223,.4)" }}>
        <div className="landing-section-padding">
          <div className="landing-section-header">
            <div className="section-num">02 — How it works</div>
            <h2 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(26px,4.5vw,54px)", lineHeight: 1.04, letterSpacing: "-0.025em" }}>
              Four steps from{" "}
              <em style={{ fontStyle: "italic", color: "var(--clay)" }}>scan to production.</em>
            </h2>
          </div>
          <div className="landing-how-grid">
            <ol style={{ listStyle: "none" }}>
              {[
                {
                  n: "01",
                  title: "Scan — read-only inventory of every script",
                  // §4.3 — states what is read and that it does not modify the account
                  //  exact API endpoints and permissions used
                  desc: "Install the extension and open it on any logged-in NetSuite tab. SuiteMigrate reads script records via the SuiteQL REST API (/services/rest/query/v1/suiteql). It never creates, modifies or deletes any data in your NetSuite account.",
                },
                {
                  n: "02",
                  title: "Review — risk report with every script prioritised",
                  desc: "The scan produces a full inventory with a HIGH / MED / LOW risk score on every script. Filter by risk, type, or API version. Export the inventory as a PDF audit report before converting a single line of code.",
                },
                {
                  n: "03",
                  title: "Convert — structural rewrite with full documentation",
                  desc: "Click Convert on any script. SuiteMigrate AI runs mapping rules then SuiteMigrate AI for structural changes. Review the three-tab output — Code, Changes, Inline comments — before downloading.",
                },
                {
                  n: "04",
                  // §4.2 sandbox warning
                  title: "Test in Sandbox — then deploy to Production",
                  desc: "Always test converted scripts in a Sandbox account before moving to Production. Upload the converted file, run your business process, and validate the output against the original. Deploy to Production only after sandbox validation passes.",
                },
              ].map(s => (
                <li key={s.n} style={{ display: "flex", gap: 16, padding: "20px 0", borderBottom: "1px solid var(--rule)" }}>
                  <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: ".12em", color: "var(--ink-mute)", paddingTop: 3, flexShrink: 0, width: 26 }}>
                    {s.n}
                  </span>
                  <div>
                    <h4 style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>{s.title}</h4>
                    <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.65 }}>{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>

            {/* Diff card mock — hidden on mobile */}
            <div className="landing-diff-card" style={{ background: "var(--ink)", color: "var(--paper)", borderRadius: 8, overflow: "hidden", boxShadow: "0 32px 80px -20px rgba(0,0,0,.5)", transform: "rotate(-1.5deg)" }}>
              <div style={{ background: "#222226", height: 32, display: "flex", alignItems: "center", padding: "0 12px", gap: 4, borderBottom: "1px solid rgba(255,255,255,.07)" }}>
                {["#ff5f57","#febc2e","#28c840"].map(c => <span key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c, display: "inline-block" }} />)}
                <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: "rgba(250,250,249,.3)", marginLeft: 8 }}>invoice_ue.js → 2.1</span>
              </div>
              <div style={{ padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 9, fontFamily: "var(--f-mono)", color: "rgba(250,250,249,.3)" }}>
                  <span>8 changes documented</span>
                  <span style={{ color: "var(--clay)" }}>review before deploy</span>
                </div>
                {[
                  { badge: "MIGRATED", label: "AMD define() module structure", type: "changed" },
                  { badge: "MIGRATED", label: "nlapiLoadRecord → record.load()", type: "changed" },
                  { badge: "MIGRATED", label: "setFieldValue → setValue()", type: "changed" },
                  { badge: "REVIEW",   label: "Complex search — manual review", type: "warn" },
                  { badge: "MIGRATED", label: "nlapiSubmitRecord → rec.save()", type: "ok" },
                ].map(row => (
                  <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 9px", borderRadius: 3, marginBottom: 3, fontFamily: "var(--f-mono)", fontSize: 10, background: row.type === "changed" ? "rgba(217,74,31,.15)" : row.type === "warn" ? "rgba(250,250,249,.05)" : "rgba(74,222,128,.07)" }}>
                    <span style={{ fontSize: 8, textTransform: "uppercase", letterSpacing: ".12em", padding: "1px 5px", borderRadius: 2, flexShrink: 0, background: row.type === "changed" ? "var(--clay)" : row.type === "warn" ? "rgba(250,250,249,.12)" : "rgba(74,222,128,.18)", color: row.type === "changed" ? "var(--paper)" : row.type === "warn" ? "rgba(250,250,249,.6)" : "#4ade80" }}>
                      {row.badge}
                    </span>
                    <span style={{ flex: 1, color: "rgba(250,250,249,.8)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {row.label}
                    </span>
                  </div>
                ))}
                <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid rgba(250,250,249,.07)", fontSize: 9, fontFamily: "var(--f-mono)", color: "rgba(250,250,249,.25)", textAlign: "center" }}>
                  test in Sandbox before deploying to Production
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SOCIAL PROOF  (§5 of brief)
          — Testimonial (Sara Köhler / Halftone) removed
          — Stats (2,400+ / 92%) removed
          — Neutral placeholder added
          — Slot for real testimonials left in comments
      ═══════════════════════════════════════════ */}
      <section style={{ padding: "80px 0", borderTop: "1px solid var(--rule)" }}>
        <div className="landing-section-padding">
          {/*
             Replace this placeholder with real testimonials/stats when available.
            Slot: add up to 3 quotes here — name, role, company, quote text.
            Do not publish unverified stats (script counts, confidence percentages, company names).
          */}
          <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(20px,3vw,32px)", lineHeight: 1.3, letterSpacing: "-0.02em", color: "var(--ink)", marginBottom: 16 }}>
              Built by NetSuite developers who migrate scripts for clients.
            </p>
            <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.7 }}>
              {/* */}
              SuiteMigrate was built by a NetSuite developer to solve the SuiteScript migration problem.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          03 — COMPARISON TABLE  (§8 of brief)
          Only rows that differ across plans are shown.
          Rows where all three plans are identical are omitted.
      ═══════════════════════════════════════════ */}
      <section style={{ padding: "0 0 100px" }}>
        <div className="landing-section-padding">
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div className="section-num" style={{ display: "block", marginBottom: 10 }}>03 — Plan comparison</div>
            <h2 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(22px,3.5vw,42px)", lineHeight: 1.04, letterSpacing: "-0.025em" }}>
              What changes between plans.
            </h2>
            <p style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 10, maxWidth: 480, marginLeft: "auto", marginRight: "auto", lineHeight: 1.65 }}>
              Active-script scanning, version-risk inventory, AI conversion, change review, confidence score, and JavaScript downloads are included on all plans.
            </p>
          </div>

          {/* §8.1 — only differing rows */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid var(--rule)" }}>
              <thead>
                <tr style={{ background: "rgba(15,23,42,.04)", borderBottom: "1px solid var(--rule)" }}>
                  <th style={{ textAlign: "left", padding: "12px 20px", fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--ink-mute)", fontWeight: 500, width: "44%" }}>
                    Feature
                  </th>
                  {["Free", "Pro", "Lifetime"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "center", fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--ink)", fontWeight: 600 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { f: "AI conversions",          free: "5",          pro: "Unlimited",  team: "Unlimited" },
                  { f: "Active-script scan",       free: "✓",          pro: "✓",          team: "✓" },
                  { f: "Change review + JS download", free: "✓",       pro: "✓",          team: "✓" },
                  { f: "HTML migration audit report", free: "—",       pro: "✓",          team: "✓" },
                ].map((row, i) => (
                  <tr key={row.f} style={{ borderBottom: "1px solid var(--rule)", background: i % 2 === 0 ? "var(--paper)" : "rgba(15,23,42,.015)" }}>
                    <td style={{ padding: "11px 20px", fontSize: 13.5, color: "var(--ink-soft)" }}>{row.f}</td>
                    {[row.free, row.pro, row.team].map((v, j) => (
                      <td key={j} style={{
                        padding: "11px 16px", textAlign: "center", fontSize: 13,
                        color: v === "✓" ? "var(--clay)" : v === "—" ? "var(--ink-mute)" : "var(--ink)",
                        fontFamily: (v === "✓" || v === "—") ? "var(--f-mono)" : "var(--f-sans)",
                        fontWeight: v === "✓" ? 600 : 400,
                      }}>
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          04 — PRICING  (§7 of brief)
          Three full cards: Free / Pro (highlighted) / Team
          Lifetime repositioned as early-adopter footnote
      ═══════════════════════════════════════════ */}
      <section id="pricing" style={{ padding: "100px 0", borderTop: "1px solid var(--rule)" }}>
        <div className="landing-section-padding">
          <div className="landing-section-header">
            <div className="section-num">04 — Pricing</div>
            <h2 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(26px,4.5vw,54px)", lineHeight: 1.04, letterSpacing: "-0.025em" }}>
              Start free.{" "}
              <em style={{ fontStyle: "italic", color: "var(--clay)" }}>Upgrade when you need more.</em>
            </h2>
          </div>

          {/* §7.1 Three cards — responsive 3-col */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 32 }}>

            {/* §7.3 FREE */}
            <div style={{ padding: "32px 28px", border: "1px solid var(--rule)", borderRadius: 5, background: "var(--paper)", display: "flex", flexDirection: "column" }}>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, textTransform: "uppercase", letterSpacing: ".15em", color: "var(--ink-mute)", marginBottom: 6 }}>Free</div>
              {/* §7.2 audience line */}
              <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 18, fontStyle: "italic" }}>Try it on your account</div>
              <div style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(32px,4vw,48px)", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 4 }}>$0</div>
              <div style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 4 }}>forever</div>
              <div style={{ fontSize: 12, color: "var(--ink-mute)", marginBottom: 20 }}>No credit card required</div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8, marginBottom: 24, flex: 1 }}>
                {[
                  "Active-script scan & inventory",
                  "Version-risk label per script",
                  "5 AI conversions",
                  "Code, Changes & Inline review tabs",
                  "Inline // MIGRATED: comments",
                  "Confidence score",
                ].map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13.5, color: "var(--ink-soft)" }}>
                    <span style={{ color: "var(--ink-mute)", flexShrink: 0, fontFamily: "var(--f-mono)" }}>—</span>{f}
                  </li>
                ))}
                <li style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "var(--ink-mute)", opacity: .8 }}>
                  <span style={{ flexShrink: 0, fontFamily: "var(--f-mono)" }}>—</span>HTML audit report requires a paid plan
                </li>
              </ul>
              <Link href="/signup" className="free-plan-cta" style={{ display: "block", textAlign: "center", padding: "12px 16px", borderRadius: 4, fontSize: 13.5, fontWeight: 500, border: "1px solid var(--rule)", color: "var(--ink)", textDecoration: "none", marginTop: "auto" }}>
                Start free
              </Link>
            </div>

            {/* §7.1 PRO — highlighted, Most popular badge */}
            <div style={{ padding: "32px 28px", border: "2px solid var(--ink)", borderRadius: 5, background: "var(--ink)", color: "var(--paper)", display: "flex", flexDirection: "column", position: "relative" }}>
              {/* §7.1 badge */}
              <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: "var(--clay)", color: "var(--paper)", fontFamily: "var(--f-mono)", fontSize: 9, textTransform: "uppercase", letterSpacing: ".14em", padding: "3px 12px", borderRadius: 3, whiteSpace: "nowrap" }}>
                Most popular
              </div>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, textTransform: "uppercase", letterSpacing: ".15em", color: "rgba(250,250,249,.45)", marginBottom: 6 }}>Pro</div>
              {/* §7.2 audience line */}
              <div style={{ fontSize: 12.5, color: "rgba(250,250,249,.55)", marginBottom: 18, fontStyle: "italic" }}>One developer, one migration</div>
              <div style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(32px,4vw,48px)", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 4 }}>
                
                $29
              </div>
              <div style={{ fontSize: 13, color: "rgba(250,250,249,.5)", marginBottom: 4 }}>per month</div>
              {/* §7.5 guarantee + cancel */}
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, color: "rgba(250,250,249,.35)", marginBottom: 20, letterSpacing: ".04em" }}>
                Cancel anytime · 7-day money-back guarantee
              </div>
              {/* §7.4 feature order */}
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8, marginBottom: 24, flex: 1 }}>
                {[
                  "Unlimited script conversions",
                  "HTML migration audit report",
                  "Code, Changes & Inline review tabs",
                  "Manual-review flags",
                  "Converted JavaScript downloads",
                ].map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13.5, color: "rgba(250,250,249,.75)" }}>
                    <span style={{ color: "var(--clay)", flexShrink: 0, fontFamily: "var(--f-mono)" }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link href="/signup?plan=pro" className="pro-plan-cta" style={{ display: "block", textAlign: "center", padding: "12px 16px", borderRadius: 4, fontSize: 13.5, fontWeight: 500, background: "var(--clay)", color: "var(--paper)", textDecoration: "none", border: "1px solid var(--clay)", marginTop: "auto" }}>
                Get Pro
              </Link>
            </div>

            {/* LIFETIME */}
            <div style={{ padding: "32px 28px", border: "1px solid var(--rule)", borderRadius: 5, background: "var(--paper)", display: "flex", flexDirection: "column" }}>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, textTransform: "uppercase", letterSpacing: ".15em", color: "var(--ink-mute)", marginBottom: 6 }}>Lifetime</div>
              <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 18, fontStyle: "italic" }}>One payment, same Pro access</div>
              <div style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(32px,4vw,48px)", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 4 }}>$299</div>
              <div style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 4 }}>one time</div>
              <div style={{ fontSize: 12, color: "var(--ink-mute)", marginBottom: 20 }}>Pro access for the life of the product</div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8, marginBottom: 24, flex: 1 }}>
                {[
                  "Unlimited script conversions",
                  "HTML migration audit report",
                  "Code review and JavaScript downloads",
                  "No monthly renewal",
                ].map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13.5, color: "var(--ink-soft)" }}>
                    <span style={{ color: "var(--clay)", flexShrink: 0, fontFamily: "var(--f-mono)" }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link href="/signup?plan=lifetime" className="free-plan-cta" style={{ display: "block", textAlign: "center", padding: "12px 16px", borderRadius: 4, fontSize: 13.5, fontWeight: 500, border: "1px solid var(--rule)", color: "var(--ink)", textDecoration: "none", marginTop: "auto" }}>
                Get Lifetime
              </Link>
            </div>
          </div>

          {/* §7.9 small print */}
          <p style={{ textAlign: "center", fontFamily: "var(--f-mono)", fontSize: 10, color: "var(--ink-mute)", letterSpacing: ".04em", lineHeight: 1.9 }}>
            {/*  currency, tax, payment provider */}
            Prices in USD · Applicable taxes may be added at checkout · Payments by Razorpay
            <br />
            Payments processed by Razorpay ·{" "}
            <Link href="/terms" style={{ color: "var(--ink-soft)", textDecoration: "underline" }}>Billing &amp; refund terms</Link>
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          05 — SECURITY & PRIVACY  (§9 of brief)
          What the extension reads, what is sent to AI,
          no modifications to NetSuite.
      ═══════════════════════════════════════════ */}
      <section id="security" style={{ padding: "80px 0", borderTop: "1px solid var(--rule)", background: "rgba(237,233,223,.4)" }}>
        <div className="landing-section-padding">
          <div className="landing-section-header">
            <div className="section-num">05 — Security &amp; privacy</div>
            <h2 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(26px,4.5vw,54px)", lineHeight: 1.04, letterSpacing: "-0.025em" }}>
              What the extension does{" "}
              <em style={{ fontStyle: "italic", color: "var(--clay)" }}>— and doesn&apos;t do.</em>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 1, background: "var(--rule)", border: "1px solid var(--rule)" }}>
            {[
              {
                title: "What the extension reads",
                 items: [
                   "Script records via SuiteQL (/services/rest/query/v1/suiteql)",
                   "Script file content via your active NetSuite session",
                   "Current page URL to detect the active account and environment",
                   "Your active NetSuite browser session cookie (your credentials are never read)",
                 ],
                 footer: null,
              },
              {
                title: "What the extension never does",
                items: [
                  "Never creates, modifies or deletes any NetSuite data",
                  "Never reads or stores your NetSuite password",
                  "Never sends your NetSuite session token to our servers",
                  "Never sends your session token to our servers",
                ],
                footer: null,
              },
              {
                title: "What is processed by our AI service",
                
                items: [
                  "The script code you explicitly choose to convert",
                  "Sent to a third-party AI service for that conversion only",
                  "Original source is not retained by SuiteMigrate after processing",
                  "Converted results may be stored in your account for re-download",
                ],
                footer: null,
              },
              {
                title: "Your data",
                items: [
                  "Converted scripts are stored in your account for re-download",
                  "You can delete your account and all data at any time",
                  "Payment details are processed by Razorpay — never stored by us",
                  "See Privacy Policy for full retention details",
                ],
                footer: null,
              },
            ].map(block => (
              <div key={block.title} className="hover-warm" style={{ background: "var(--paper)", padding: "28px 24px", transition: "background .14s" }}>
                <h3 style={{ fontFamily: "var(--f-head)", fontWeight: 400, fontSize: 17, letterSpacing: "-0.01em", color: "var(--ink)", marginBottom: 14 }}>{block.title}</h3>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                  {block.items.map((item, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.6 }}>
                      <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--ink-mute)", flexShrink: 0, marginTop: 1 }}>—</span>
                      {item}
                    </li>
                  ))}
                </ul>
                {block.footer && (
                  <p style={{ marginTop: 12, fontFamily: "var(--f-mono)", fontSize: 9.5, color: "var(--clay)", lineHeight: 1.6 }}>
                    {block.footer}
                  </p>
                )}
              </div>
            ))}
          </div>
          {/* §9.3 BYOK / redaction TODO placeholder — visible only in code */}
          }
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          06 — FAQ  (§10 of brief)
      ═══════════════════════════════════════════ */}
      <section id="faq" style={{ padding: "100px 0", borderTop: "1px solid var(--rule)" }}>
        <div className="landing-section-padding">
          <div className="landing-section-header">
            <div className="section-num">06 — FAQ</div>
            <h2 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(26px,4.5vw,54px)", lineHeight: 1.04, letterSpacing: "-0.025em" }}>
              Common <em style={{ fontStyle: "italic", color: "var(--clay)" }}>questions.</em>
            </h2>
          </div>
          <div className="landing-faq-grid">
            {faqs.map(f => (
              <div key={f.q} className="hover-warm" style={{ background: "var(--paper)", padding: "28px 24px", transition: "background .14s" }}>
                <h4 style={{ fontSize: 14.5, fontWeight: 500, marginBottom: 9, letterSpacing: "-0.01em" }}>{f.q}</h4>
                <p style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.75 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FINAL CTA
          — "never leaves your browser" removed
      ═══════════════════════════════════════════ */}
      <section style={{ padding: "120px 0", borderTop: "1px solid var(--rule)", textAlign: "center" }}>
        <div className="landing-section-padding">
          <h2 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(28px,5vw,60px)", lineHeight: 1.04, letterSpacing: "-0.025em", marginBottom: 16 }}>
            Find every legacy script.<br />
            <em style={{ fontStyle: "italic", color: "var(--clay)" }}>Before 2028.2 does it for you.</em>
          </h2>
          <p style={{ fontSize: 16, color: "var(--ink-soft)", maxWidth: 420, margin: "0 auto 36px", lineHeight: 1.65 }}>
            Scan your account, review the risk report, and start converting — 5 free conversions, no credit card.
          </p>
          <Link href="/signup" className="btn-pill" style={{ fontSize: "clamp(14px,2vw,16px)", padding: "14px 30px" }}>
            Scan my account free
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7h12m0 0L8 2m5 5L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </Link>
          <p style={{ marginTop: 18, fontFamily: "var(--f-mono)", fontSize: 9.5, color: "var(--ink-mute)", letterSpacing: ".06em" }}>
            5 free conversions · No credit card · Read-only · Not affiliated with Oracle
          </p>
        </div>
      </section>

      <Footer />

      <style>{`
        .ghost-cta:hover        { color: var(--ink) !important; }
        .hover-warm:hover       { background: var(--paper-warm) !important; }
        .free-plan-cta:hover    { background: var(--ink) !important; color: var(--paper) !important; border-color: var(--ink) !important; }
        .pro-plan-cta:hover     { background: #c23d15 !important; }
        .team-contact-link:hover { color: var(--ink) !important; }
        .lifetime-link:hover    { text-decoration: underline !important; }
      `}</style>
    </div>
  )
}
