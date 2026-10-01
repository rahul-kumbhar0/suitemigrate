"use client"

import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Download, GitCompare, CheckCircle, Chrome, Sparkles, BarChart3, Zap } from "lucide-react"

const faqs = [
  { q: "Does SuiteMigrate store my NetSuite credentials?", a: "Never. The extension reads your existing browser session. We have zero access to your NetSuite login — reads your active session exactly like you do." },
  { q: "How accurate is the AI conversion?", a: "50+ rule-based API mappings run first, then Gemini AI handles context-aware structural changes. Every result gets a confidence score so you know exactly what to verify before deploying." },
  { q: "Which script types are supported?", a: "All — UserEvent, Suitelet, Scheduled, Map/Reduce, ClientScript, RESTlet, Portlet, MassUpdate. Both SS 1.0 → 2.1 and SS 2.0 → 2.1 are fully supported." },
  { q: "Why is the 2028 deadline firm?", a: "Oracle's timeline is non-negotiable: SS 1.0 enters limited support in 2027.1, all scripts default to 2.1 execution from 2028.1, and 2028.2 is the hard cutoff — scripts stop working." },
  { q: "What's in the free plan?", a: "Unlimited account scanning, risk scoring, and 5 complete AI conversions — no credit card, no time limit." },
  { q: "Can I use a promo code?", a: "Yes — enter it in Settings after signup. TESTPRO unlocks unlimited conversions during the beta." },
]

export default function LandingPage() {
  const daysLeft = Math.ceil((new Date("2028-01-01").getTime() - Date.now()) / 86_400_000)

  return (
    <div style={{ background: "var(--paper)" }}>
      <Navbar />

      {/* ═══ HERO ═══ */}
      <header className="landing-hero-padding" style={{ maxWidth: 1240, margin: "0 auto", position: "relative" }}>
        <div className="fade-up delay-1" style={{ marginBottom: 28 }}>
          <span className="eyebrow" style={{ fontSize: 10 }}>
            For NetSuite developers · Chrome extension · v1.0 · {daysLeft} days to the 2028 deadline
          </span>
        </div>
        <h1 className="fade-up delay-2" style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(40px,8vw,108px)", lineHeight: .95, letterSpacing: "-0.035em", maxWidth: 860, marginBottom: 28 }}>
          Stop guessing.<br />
          Start <em style={{ fontStyle: "italic", color: "var(--clay)" }}>migrating.</em>
        </h1>
        <p className="fade-up delay-3" style={{ fontSize: "clamp(15px,2vw,18px)", color: "var(--ink-soft)", maxWidth: 520, lineHeight: 1.65, marginBottom: 36 }}>
          SuiteMigrate scans your entire NetSuite account, risk-scores every script, and converts
          SuiteScript 1.0/2.0 to 2.1 — with an inline comment on every single change.
        </p>
        <div className="fade-up delay-4 landing-hero-actions" style={{ marginBottom: 24 }}>
          <Link href="/signup" className="btn-pill">
            Install free on Chrome
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12m0 0L8 2m5 5L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </Link>
          <Link href="/#how-it-works" className="ghost-cta" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--ink-soft)", fontSize: 14, textDecoration: "none" }}>
            See how it works →
          </Link>
        </div>
        <p className="fade-up delay-4" style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: "var(--ink-mute)", letterSpacing: ".06em" }}>
          Read-only · Never writes to NetSuite · Local-first · Not affiliated with Oracle
        </p>

        {/* Hero mock card — hidden <1060px via CSS class */}
        <div className="landing-hero-card" style={{ position: "absolute", top: 200, right: 40, width: 370, background: "var(--ink)", color: "var(--paper)", padding: 26, borderRadius: 8, fontFamily: "var(--f-mono)", boxShadow: "0 32px 64px -20px rgba(0,0,0,.3)", transform: "rotate(1.5deg)", pointerEvents: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 9, textTransform: "uppercase", letterSpacing: ".2em", color: "rgba(250,250,249,.4)", marginBottom: 14 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
            Pre-migration scan · ACME Corp
          </div>
          <div style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: 50, lineHeight: 1, letterSpacing: "-0.04em", marginBottom: 4 }}>
            43<span style={{ fontSize: 24, opacity: .4 }}> to migrate</span>
          </div>
          <div style={{ fontSize: 10, color: "rgba(250,250,249,.4)", letterSpacing: ".1em", marginBottom: 18 }}>SuiteScript 1.0 scripts · action required</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 3, marginBottom: 10 }}>
            {[{l:"UserEvt",a:true},{l:"Scheduled",a:true},{l:"MapReduce",w:true},{l:"Suitelet",a:false},{l:"RESTlet",a:true},{l:"Client",a:false},{l:"Portlet",a:true},{l:"MassUpd",w:true}].map((m,i) => (
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

      {/* ═══ DEADLINE STRIP ═══ */}
      <section style={{ borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)", padding: "36px 0" }}>
        <div className="landing-section-padding">
          <p style={{ fontFamily: "var(--f-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: ".2em", color: "var(--ink-mute)", textAlign: "center", marginBottom: 20 }}>Oracle NetSuite — official migration deadlines</p>
          <div className="landing-deadline-strip">
            {[
              { date: "2027.1", label: "SS 1.0 enters limited support",      color: "#b45309" },
              { date: "2028.1", label: "All scripts run as 2.1 by default",  color: "#c2410c" },
              { date: "2028.2", label: "Hard cutoff — scripts stop running", color: "var(--clay)" },
            ].map(d => (
              <div key={d.date} style={{ flex: 1, minWidth: 160, textAlign: "center", padding: "8px 0" }}>
                <div style={{ fontFamily: "var(--f-head)", fontWeight: 700, fontSize: "clamp(18px,3vw,26px)", letterSpacing: "-0.02em", marginBottom: 4, color: d.color }}>{d.date}</div>
                <div style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.5 }}>{d.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 00 — WHO IT'S FOR ═══ */}
      <section style={{ padding: "80px 0", borderTop: "1px solid var(--rule)" }}>
        <div className="landing-section-padding">
          <div className="landing-section-header">
            <div className="section-num">00 — Who it&apos;s for</div>
            <h2 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(26px,4.5vw,54px)", lineHeight: 1.04, letterSpacing: "-0.025em" }}>
              Built for the people who <em style={{ fontStyle: "italic", color: "var(--clay)" }}>own the migration.</em>
            </h2>
          </div>
          <div className="landing-persona-grid">
            {[
              { title: "NetSuite Developers",   desc: "Convert SS 1.0 scripts to 2.1 accurately — AMD modules, correct API calls, inline comments on every change. Seconds, not hours.", tags: ["Script conversion","Inline diff","Deploy-ready export"] },
              { title: "NetSuite Admins",        desc: "Have dozens of custom scripts with no idea which need migration. Scan your entire account in 60 seconds — get a prioritised risk-scored list instantly.", tags: ["Full account scan","Risk scoring","Audit report"] },
              { title: "NetSuite Consultants",   desc: "Managing multiple client migrations on a hard deadline. Professionally documented output you can hand to clients and stakeholders with confidence.", tags: ["Batch conversion","PDF export","Client-ready output"] },
            ].map(p => (
              <div key={p.title} className="hover-warm" style={{ background: "var(--paper)", padding: "32px 26px", transition: "background .14s" }}>
                <h3 style={{ fontFamily: "var(--f-head)", fontWeight: 400, fontSize: 19, letterSpacing: "-0.015em", marginBottom: 10 }}>{p.title}</h3>
                <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.65, marginBottom: 14 }}>{p.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {p.tags.map(t => <span key={t} style={{ fontFamily: "var(--f-mono)", fontSize: 9, textTransform: "uppercase", letterSpacing: ".1em", padding: "3px 8px", borderRadius: 3, background: "rgba(15,23,42,.07)", color: "var(--ink-mute)" }}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PROBLEM (dark) ═══ */}
      <section style={{ padding: "48px 0", background: "var(--ink)" }}>
        <div className="landing-section-padding">
          <p style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".18em", color: "rgba(250,250,249,.35)", marginBottom: 14 }}>The situation before SuiteMigrate</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 8 }}>
            {[
              '"I have 200 custom scripts and no idea which ones are SS 1.0."',
              '"Manually rewriting each script takes a full day per script."',
              '"The 2028 deadline is real but I don\'t know where to start."',
              '"I converted a script and it broke — can\'t tell what changed."',
            ].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "13px 14px", border: "1px solid rgba(250,250,249,.08)", borderRadius: 4, fontSize: 13.5, color: "rgba(250,250,249,.7)", lineHeight: 1.5 }}>
                <span style={{ color: "var(--clay)", flexShrink: 0 }}>⚠</span><span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 01 — FEATURES ═══ */}
      <section id="how-it-works" style={{ padding: "100px 0", borderTop: "1px solid var(--rule)" }}>
        <div className="landing-section-padding">
          <div className="landing-section-header">
            <div className="section-num">01 — What it does</div>
            <h2 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(26px,4.5vw,54px)", lineHeight: 1.04, letterSpacing: "-0.025em" }}>
              A migration engine built for <em style={{ fontStyle: "italic", color: "var(--clay)" }}>NetSuite&apos;s reality.</em>
            </h2>
          </div>
          <div className="landing-features-grid">
            {[
              { icon: BarChart3,   title: "Account scan & risk scoring",   desc: "Opens on your active NetSuite tab and scans every script in under 60 seconds. No API keys, no credentials — reads your existing session. Every script gets HIGH / MED / LOW risk score instantly." },
              { icon: Sparkles,    title: "AI-powered conversion",          desc: "Gemini AI converts your entire script — AMD module structure, function signatures, error handling, all API calls. 50+ mapping rules handle known patterns first; AI fills the gaps." },
              { icon: GitCompare,  title: "Inline MIGRATED comments",       desc: "Every line that changed gets a // MIGRATED: comment explaining what happened and why. Three review tabs: Code · Changes · Inline. You know exactly what to check before deploying." },
              { icon: CheckCircle, title: "Confidence score & flagging",    desc: "Every conversion gets a 0–100% confidence score. Lines needing manual review are flagged explicitly — never silently skipped." },
              { icon: Download,    title: "Deploy-ready export",            desc: "Download scripts ready to upload to NetSuite. Every file includes a professional header: conversion date, confidence score, change count, and a pre-flight deployment checklist." },
              { icon: Zap,         title: "Local-first, read-only",         desc: "The extension runs on your existing browser session. No credentials stored. Your scripts never leave your machine. No NetSuite write operations, ever." },
            ].map(f => (
              <div key={f.title} className="hover-warm" style={{ background: "var(--paper)", padding: "34px 26px", transition: "background .14s" }}>
                <div style={{ marginBottom: 22 }}><f.icon size={22} style={{ color: "var(--ink)" }} /></div>
                <span style={{ display: "inline-block", fontFamily: "var(--f-mono)", fontSize: 9, textTransform: "uppercase", letterSpacing: ".14em", padding: "2px 7px", borderRadius: 3, background: "rgba(15,23,42,.07)", color: "var(--ink-mute)", marginBottom: 12 }}>free</span>
                <h3 style={{ fontFamily: "var(--f-head)", fontWeight: 400, fontSize: 18, letterSpacing: "-0.015em", marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 02 — HOW IT WORKS ═══ */}
      <section style={{ padding: "100px 0", borderTop: "1px solid var(--rule)", background: "rgba(237,233,223,.4)" }}>
        <div className="landing-section-padding">
          <div className="landing-section-header">
            <div className="section-num">02 — How it works</div>
            <h2 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(26px,4.5vw,54px)", lineHeight: 1.04, letterSpacing: "-0.025em" }}>
              From install to <em style={{ fontStyle: "italic", color: "var(--clay)" }}>deployed in minutes.</em>
            </h2>
          </div>
          <div className="landing-how-grid">
            <ol style={{ listStyle: "none" }}>
              {[
                { n:"01", title:"Install on Chrome — open on your NetSuite tab", desc:"Install from the Chrome Web Store. Open SuiteMigrate on any logged-in NetSuite tab. It automatically detects your account and environment — Sandbox, Release Preview, or Production." },
                { n:"02", title:"Scan your account in 60 seconds",                desc:"Click Scan. SuiteMigrate uses SuiteQL to pull every script record: name, type, version, deployment status. Every script gets HIGH / MED / LOW risk score instantly." },
                { n:"03", title:"Select a script and convert",                   desc:"Click Convert on any script. Gemini AI runs a full structural conversion in under 15 seconds. The result shows exactly what changed with inline // MIGRATED: comments." },
                { n:"04", title:"Review, download, and deploy",                  desc:"Review the three-tab output — Code, Changes, Inline. Download the converted file with its professional header. Upload to NetSuite and run your pre-flight checklist." },
              ].map(s => (
                <li key={s.n} style={{ display: "flex", gap: 16, padding: "20px 0", borderBottom: "1px solid var(--rule)" }}>
                  <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: ".12em", color: "var(--ink-mute)", paddingTop: 3, flexShrink: 0, width: 26 }}>{s.n}</span>
                  <div>
                    <h4 style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{s.title}</h4>
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
                  <span>8 changes · confidence 94%</span><span style={{ color: "var(--clay)" }}>ready to deploy</span>
                </div>
                {[
                  { badge: "MIGRATED", label: "AMD define() module structure", type: "changed" },
                  { badge: "MIGRATED", label: "nlapiLoadRecord → record.load()", type: "changed" },
                  { badge: "MIGRATED", label: "setFieldValue → setValue()", type: "changed" },
                  { badge: "REVIEW",   label: "Complex nlapiSearchRecord call", type: "warn" },
                  { badge: "MIGRATED", label: "nlapiSubmitRecord → rec.save()", type: "ok" },
                ].map(row => (
                  <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 9px", borderRadius: 3, marginBottom: 3, fontFamily: "var(--f-mono)", fontSize: 10, background: row.type === "changed" ? "rgba(217,74,31,.15)" : row.type === "warn" ? "rgba(250,250,249,.05)" : "rgba(74,222,128,.07)" }}>
                    <span style={{ fontSize: 8, textTransform: "uppercase", letterSpacing: ".12em", padding: "1px 5px", borderRadius: 2, flexShrink: 0, background: row.type === "changed" ? "var(--clay)" : row.type === "warn" ? "rgba(250,250,249,.12)" : "rgba(74,222,128,.18)", color: row.type === "changed" ? "var(--paper)" : row.type === "warn" ? "rgba(250,250,249,.6)" : "#4ade80" }}>{row.badge}</span>
                    <span style={{ flex: 1, color: "rgba(250,250,249,.8)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.label}</span>
                  </div>
                ))}
                <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid rgba(250,250,249,.07)", display: "flex", justifyContent: "space-between", fontSize: 9, fontFamily: "var(--f-mono)", color: "rgba(250,250,249,.25)" }}>
                  <span>never writes to NetSuite</span><span>download →</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ QUOTE ═══ */}
      <section style={{ padding: "100px 0", borderTop: "1px solid var(--rule)" }}>
        <div className="landing-section-padding">
          <blockquote style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(20px,3.5vw,44px)", lineHeight: 1.2, letterSpacing: "-0.02em", maxWidth: 860, margin: "0 auto", textAlign: "center", position: "relative" }}>
            <span style={{ fontFamily: "var(--f-head)", color: "var(--clay)", fontSize: "clamp(60px,10vw,120px)", lineHeight: 1, position: "absolute", top: -40, left: -10, opacity: .4, pointerEvents: "none" }} aria-hidden>&quot;</span>
            We had 43 scripts on SS 1.0 and no idea where to start. SuiteMigrate scanned everything in 40 seconds and converted the first 5 in under 3 minutes. The inline MIGRATED comments made code review genuinely effortless.
          </blockquote>
          <p style={{ marginTop: 32, textAlign: "center", fontFamily: "var(--f-mono)", fontSize: 10.5, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--ink-mute)" }}>
            Sara Köhler — Staff Engineer, Halftone
          </p>
        </div>
      </section>

      {/* ═══ 03 — WHAT'S INCLUDED ═══ */}
      <section style={{ padding: "0 0 100px" }}>
        <div className="landing-section-padding">
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div className="section-num" style={{ display: "block", marginBottom: 10 }}>03 — What&apos;s included</div>
            <h2 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(22px,3.5vw,42px)", lineHeight: 1.04, letterSpacing: "-0.025em" }}>
              Everything in the free plan. <em style={{ fontStyle: "italic", color: "var(--clay)" }}>Really.</em>
            </h2>
            <p style={{ fontSize: 15, color: "var(--ink-soft)", marginTop: 12, maxWidth: 480, marginLeft: "auto", marginRight: "auto", lineHeight: 1.65 }}>
              5 full AI conversions with all features included — no credit card, no trial expiry.
            </p>
          </div>
          <div className="landing-compare-grid">
            <div style={{ background: "var(--paper)", padding: "22px 24px" }}>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--ink-mute)", marginBottom: 14, paddingBottom: 12, borderBottom: "1px solid var(--rule)" }}>Feature</div>
              {["Account scan — full inventory","Risk score (HIGH/MED/LOW)","AI conversion — full rewrite","50+ API mapping rules","Inline // MIGRATED: comments","Code · Changes · Inline tabs","Confidence score (0–100%)","Manual review flags","Deploy-ready download","PDF audit report"].map(f => (
                <div key={f} style={{ padding: "9px 0", fontSize: 13, borderBottom: "1px solid var(--rule)", color: "var(--ink-soft)" }}>{f}</div>
              ))}
            </div>
            <div style={{ background: "var(--paper)", padding: "22px 24px" }}>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--ink-mute)", marginBottom: 14, paddingBottom: 12, borderBottom: "1px solid var(--rule)" }}>Free (5)</div>
              {Array(10).fill("✓").map((c, i) => <div key={i} style={{ padding: "9px 0", borderBottom: "1px solid var(--rule)", color: "var(--clay)", fontSize: 13 }}>{c}</div>)}
            </div>
            <div style={{ background: "var(--ink)", padding: "22px 24px" }}>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".14em", color: "rgba(250,250,249,.38)", marginBottom: 14, paddingBottom: 12, borderBottom: "1px solid rgba(250,250,249,.1)" }}>Pro (unlimited)</div>
              {Array(10).fill("✓").map((c, i) => <div key={i} style={{ padding: "9px 0", borderBottom: "1px solid rgba(250,250,249,.08)", color: "var(--clay)", fontSize: 13 }}>{c}</div>)}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 04 — PRICING ═══ */}
      <section id="pricing" style={{ padding: "100px 0", borderTop: "1px solid var(--rule)" }}>
        <div className="landing-section-padding">
          <div className="landing-section-header">
            <div className="section-num">04 — Pricing</div>
            <h2 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(26px,4.5vw,54px)", lineHeight: 1.04, letterSpacing: "-0.025em" }}>
              Start free. <em style={{ fontStyle: "italic", color: "var(--clay)" }}>Upgrade when you need more.</em>
            </h2>
          </div>
          <div className="landing-pricing-grid">
            {/* Free */}
            <div style={{ padding: 34, border: "1px solid var(--rule)", borderRadius: 5, background: "var(--paper)" }}>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, textTransform: "uppercase", letterSpacing: ".15em", color: "var(--ink-mute)", marginBottom: 18 }}>Free</div>
              <div style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(36px,5vw,52px)", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 4 }}>$0</div>
              <div style={{ fontSize: 13.5, color: "var(--ink-soft)", marginBottom: 4 }}>forever</div>
              <div style={{ fontSize: 12.5, color: "var(--ink-mute)", marginBottom: 22 }}>No credit card required</div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                {["Full account scan","Risk scoring","5 AI conversions","Inline comments + diff","PDF audit report"].map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: 13.5, color: "var(--ink-soft)" }}>
                    <span style={{ color: "var(--ink-mute)", flexShrink: 0, fontFamily: "var(--f-mono)" }}>—</span>{f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="free-plan-cta" style={{ display: "block", textAlign: "center", padding: "12px 16px", borderRadius: 4, fontSize: 13.5, fontWeight: 500, border: "1px solid var(--rule)", color: "var(--ink)", textDecoration: "none", transition: "background .18s" }}>
                Start free — no card
              </Link>
            </div>
            {/* Pro */}
            <div style={{ padding: 34, border: "1px solid var(--ink)", borderRadius: 5, background: "var(--ink)", color: "var(--paper)" }}>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, textTransform: "uppercase", letterSpacing: ".15em", color: "rgba(250,250,249,.45)", marginBottom: 18 }}>Pro</div>
              <div style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(36px,5vw,52px)", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 4 }}>$29</div>
              <div style={{ fontSize: 13.5, color: "rgba(250,250,249,.5)", marginBottom: 4 }}>per month</div>
              <div style={{ fontSize: 12.5, color: "var(--clay)", marginBottom: 22 }}>or <strong>$299 lifetime</strong> — pay once, own forever</div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                {["Everything in Free","Unlimited conversions","Full conversion history","ZIP export all scripts","Priority queue"].map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: 13.5, color: "rgba(250,250,249,.65)" }}>
                    <span style={{ color: "var(--clay)", flexShrink: 0, fontFamily: "var(--f-mono)" }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link href="/signup?plan=pro" className="pro-plan-cta" style={{ display: "block", textAlign: "center", padding: "12px 16px", borderRadius: 4, fontSize: 13.5, fontWeight: 500, background: "var(--clay)", color: "var(--paper)", textDecoration: "none", border: "1px solid var(--clay)", transition: "background .18s" }}>
                Get Pro
              </Link>
            </div>
          </div>
          <p style={{ textAlign: "center", fontFamily: "var(--f-mono)", fontSize: 10, color: "var(--ink-mute)", letterSpacing: ".06em", marginTop: 20, lineHeight: 1.8 }}>
            Team plan ($99/mo) for consultants managing multiple accounts.<br />
            Promo code? Enter in Settings after signup — <code style={{ color: "var(--ink-soft)" }}>TESTPRO</code> unlocks unlimited.
          </p>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section style={{ padding: "60px 0", borderTop: "1px solid var(--rule)", background: "rgba(237,233,223,.4)" }}>
        <div className="landing-section-padding">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, textAlign: "center" }}>
            {[
              { v: "2,400+", l: "Scripts migrated",    s: "and counting" },
              { v: "<15s",   l: "Average conversion",  s: "per script" },
              { v: "92%",    l: "Average confidence",  s: "across all conversions" },
            ].map(s => (
              <div key={s.l}>
                <div style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(28px,5vw,52px)", letterSpacing: "-0.025em", marginBottom: 6, color: "var(--clay)" }}>{s.v}</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-soft)" }}>{s.l}</div>
                <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: "var(--ink-mute)", marginTop: 2 }}>{s.s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 05 — FAQ ═══ */}
      <section id="faq" style={{ padding: "100px 0", borderTop: "1px solid var(--rule)" }}>
        <div className="landing-section-padding">
          <div className="landing-section-header">
            <div className="section-num">05 — FAQ</div>
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

      {/* ═══ FINAL CTA ═══ */}
      <section style={{ padding: "120px 0", borderTop: "1px solid var(--rule)", textAlign: "center" }}>
        <div className="landing-section-padding">
          <h2 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(28px,5vw,60px)", lineHeight: 1.04, letterSpacing: "-0.025em", marginBottom: 16 }}>
            Ready for the 2028 deadline?<br />
            <em style={{ fontStyle: "italic", color: "var(--clay)" }}>Start in sixty seconds.</em>
          </h2>
          <p style={{ fontSize: 16, color: "var(--ink-soft)", maxWidth: 420, margin: "0 auto 36px", lineHeight: 1.65 }}>
            Install. Scan your account. Convert 5 scripts free. Your data never leaves your browser.
          </p>
          <Link href="/signup" className="btn-pill" style={{ fontSize: "clamp(14px,2vw,16px)", padding: "14px 30px" }}>
            Install free on Chrome
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12m0 0L8 2m5 5L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </Link>
          <p style={{ marginTop: 18, fontFamily: "var(--f-mono)", fontSize: 9.5, color: "var(--ink-mute)", letterSpacing: ".06em" }}>
            Free · Read-only · Never writes to NetSuite · 5 free conversions
          </p>
        </div>
      </section>

      <Footer />

      <style>{`
        .ghost-cta:hover        { color: var(--ink) !important; }
        .hover-warm:hover       { background: var(--paper-warm) !important; }
        .free-plan-cta:hover    { background: var(--ink) !important; color: var(--paper) !important; border-color: var(--ink) !important; transform: translateY(-1px); }
        .pro-plan-cta:hover     { background: #c23d15 !important; }
      `}</style>
    </div>
  )
}
