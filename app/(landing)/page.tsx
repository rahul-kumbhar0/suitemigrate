"use client"

import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

const faqs = [
  {
    q: "Does SuiteMigrate store my NetSuite credentials?",
    a: "Never. The extension reads your existing browser session — the same one you use every day. Nothing is captured, stored or transmitted. Your NetSuite credentials never leave your machine.",
  },
  {
    q: "How accurate is the AI conversion?",
    a: "We run a two-pass system: 50+ deterministic API mapping rules handle known patterns first, then Gemini AI handles context-aware structural changes. Every result gets a confidence score and flags lines needing manual review.",
  },
  {
    q: "Which script types are supported?",
    a: "All of them — UserEvent, Suitelet, Scheduled, Map/Reduce, ClientScript, RESTlet, Portlet, MassUpdate. Both SS 1.0 → 2.1 and SS 2.0 → 2.1 paths are fully supported.",
  },
  {
    q: "Why is the 2028 deadline firm?",
    a: "Oracle's timeline is non-negotiable: SS 1.0 enters limited support in 2027.1, all scripts default to 2.1 execution from 2028.1, and scripts that aren't 2.1-compliant stop running in 2028.2.",
  },
  {
    q: "What's in the free plan?",
    a: "Unlimited account scanning, risk scoring for every script, a full audit report, and 5 complete AI conversions — with inline comments, diff view, and download. No credit card, no time limit.",
  },
  {
    q: "Can I use a promo code?",
    a: "Yes — enter it in Settings after signup. TESTPRO unlocks unlimited conversions during the beta.",
  },
]

export default function LandingPage() {
  const daysLeft = Math.ceil((new Date("2028-01-01").getTime() - Date.now()) / 86_400_000)

  return (
    <div style={{ background: "var(--paper)", color: "var(--ink)" }}>
      <Navbar />

      {/* ═══════════════════════════════════════
          HERO
      ═══════════════════════════════════════ */}
      <header style={{
        padding: "176px 40px 120px",
        maxWidth: 1240,
        margin: "0 auto",
        position: "relative",
      }}>
        {/* Eyebrow */}
        <div className="fade-up delay-1" style={{ marginBottom: 30 }}>
          <span className="eyebrow">
            For NetSuite developers · Chrome extension · v1.0 · {daysLeft} days to the 2028 deadline
          </span>
        </div>

        {/* H1 */}
        <h1 className="fade-up delay-2" style={{
          fontFamily: "var(--f-head)",
          fontWeight: 300,
          fontSize: "clamp(50px, 8vw, 108px)",
          lineHeight: .95,
          letterSpacing: "-0.035em",
          color: "var(--ink)",
          maxWidth: 860,
          marginBottom: 30,
        }}>
          Stop guessing.<br />
          Start <span style={{ color: "var(--clay)", fontStyle: "italic" }}>migrating.</span>
        </h1>

        {/* Sub */}
        <p className="fade-up delay-3" style={{
          fontSize: 18,
          color: "var(--ink-soft)",
          maxWidth: 510,
          lineHeight: 1.65,
          marginBottom: 40,
        }}>
          SuiteMigrate scans your entire NetSuite account, risk-scores every script, and converts
          SuiteScript 1.0/2.0 to 2.1 — with an inline comment on every single change. Right from your browser.
        </p>

        {/* CTAs */}
        <div className="fade-up delay-4" style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
          <Link href="/signup" className="btn-pill">
            Install free on Chrome
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7h12m0 0L8 2m5 5L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </Link>
          <Link href="/#how-it-works" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            color: "var(--ink-soft)", fontSize: 14, fontFamily: "var(--f-sans)",
          }}>
            See how it works →
          </Link>
        </div>

        <p className="fade-up delay-4" style={{
          marginTop: 28,
          fontFamily: "var(--f-mono)",
          fontSize: 10.5,
          color: "var(--ink-mute)",
          letterSpacing: ".06em",
        }}>
          Read-only · Never writes to NetSuite · Your scripts stay in your browser · Not affiliated with Oracle
        </p>

        {/* Hero mock card — rotated */}
        <div style={{
          position: "absolute",
          top: 200, right: 40,
          width: 390,
          background: "var(--ink)",
          color: "var(--paper)",
          padding: 30,
          borderRadius: 10,
          fontFamily: "var(--f-mono)",
          boxShadow: "0 32px 64px -20px rgba(0,0,0,.32)",
          transform: "rotate(1.5deg)",
          pointerEvents: "none",
        }} className="hero-card-hide">
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".2em", color: "rgba(250,250,249,.45)", marginBottom: 18 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", animation: "blink 1.4s ease-in-out infinite", flexShrink: 0, display: "inline-block" }} />
            Pre-migration scan · ACME Corp · 67 scripts
          </div>
          <div style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: 60, lineHeight: 1, letterSpacing: "-0.04em", marginBottom: 5 }}>
            43<span style={{ fontSize: 28, opacity: .4 }}> to migrate</span>
          </div>
          <div style={{ fontSize: 10.5, color: "rgba(250,250,249,.45)", letterSpacing: ".1em", marginBottom: 26 }}>
            SuiteScript 1.0 scripts · action required
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 4, marginBottom: 14 }}>
            {[
              { label: "UserEvent", active: true },
              { label: "Scheduled", active: true },
              { label: "MapReduce", warn: true },
              { label: "Suitelet", active: false },
              { label: "RESTlet", active: true },
              { label: "Client", active: false },
              { label: "Portlet", active: true },
              { label: "MassUpd", warn: true },
            ].map((m) => (
              <div key={m.label} style={{
                height: 34, borderRadius: 2,
                background: m.warn ? "rgba(217,74,31,.3)" : m.active ? "rgba(217,74,31,.15)" : "rgba(250,250,249,.08)",
                display: "flex", alignItems: "flex-end", padding: 4,
              }}>
                <span style={{ fontSize: 7.5, letterSpacing: ".07em", textTransform: "uppercase", color: "rgba(250,250,249,.55)" }}>{m.label}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5, color: "rgba(250,250,249,.38)", letterSpacing: ".1em", borderTop: "1px solid rgba(250,250,249,.08)", paddingTop: 12 }}>
            <span>12 HIGH · 18 MED · 13 LOW risk</span>
            <span>scan complete →</span>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════
          DEADLINE STRIP
      ═══════════════════════════════════════ */}
      <section style={{ borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)", padding: "44px 0" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 40px" }}>
          <p style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, textTransform: "uppercase", letterSpacing: ".2em", color: "var(--ink-mute)", textAlign: "center", marginBottom: 22 }}>
            Oracle NetSuite — official migration deadlines
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
            {[
              { date: "2027.1", label: "SS 1.0 enters limited support",      color: "#b45309" },
              { date: "2028.1", label: "All scripts run as 2.1 by default",  color: "#c2410c" },
              { date: "2028.2", label: "Hard cutoff — non-2.1 scripts stop", color: "var(--clay)" },
            ].map((d) => (
              <div key={d.date} style={{ flex: 1, minWidth: 200, textAlign: "center" }}>
                <div style={{ fontFamily: "var(--f-head)", fontWeight: 700, fontSize: 28, letterSpacing: "-0.02em", marginBottom: 6, color: d.color }}>{d.date}</div>
                <div style={{ fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.5 }}>{d.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          WHO IT'S FOR  — 00
      ═══════════════════════════════════════ */}
      <section style={{ padding: "120px 0", borderTop: "1px solid var(--rule)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 40px" }}>
          {/* Section header */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2.2fr", gap: 80, marginBottom: 80, alignItems: "flex-end" }}>
            <div className="section-num">00 — Who it&apos;s for</div>
            <h2 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(34px,4.5vw,60px)", lineHeight: 1.04, letterSpacing: "-0.025em" }}>
              Built for the people who <span style={{ color: "var(--clay)", fontStyle: "italic" }}>own the migration.</span>
            </h2>
          </div>

          {/* Persona grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "var(--rule)", border: "1px solid var(--rule)" }}>
            {[
              {
                title: "NetSuite Developers",
                desc: "You build SuiteScripts. You need your SS 1.0 scripts converted to 2.1 accurately — AMD module structure, correct API calls, inline comments explaining every change. SuiteMigrate gets you there in seconds, not hours.",
                tags: ["Script conversion", "Inline diff view", "Deploy-ready export"],
              },
              {
                title: "NetSuite Admins",
                desc: "You manage a NetSuite account with dozens — maybe hundreds — of custom scripts. You have no idea which ones need migration and in which order. SuiteMigrate scans everything and gives you a prioritised risk-scored list in 60 seconds.",
                tags: ["Full account scan", "Risk scoring", "Audit report"],
              },
              {
                title: "NetSuite Consultants",
                desc: "You're managing multiple client migrations on a hard deadline. You need a reliable, repeatable conversion tool that produces professionally documented output you can hand to clients and stakeholders with confidence.",
                tags: ["Batch conversion", "PDF audit export", "Client-ready output"],
              },
            ].map((p) => (
              <div key={p.title} style={{ background: "var(--paper)", padding: "40px 34px", transition: "background .14s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--paper-warm)")}
                onMouseLeave={e => (e.currentTarget.style.background = "var(--paper)")}>
                <h3 style={{ fontFamily: "var(--f-head)", fontWeight: 400, fontSize: 22, letterSpacing: "-0.015em", marginBottom: 12 }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.65, marginBottom: 20 }}>{p.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {p.tags.map(t => (
                    <span key={t} style={{ fontFamily: "var(--f-mono)", fontSize: 9, textTransform: "uppercase", letterSpacing: ".1em", padding: "4px 9px", borderRadius: 3, background: "rgba(15,23,42,.07)", color: "var(--ink-mute)" }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PROBLEM STRIP (dark)
      ═══════════════════════════════════════ */}
      <section style={{ padding: "60px 0", background: "var(--ink)", color: "var(--paper)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={{ fontFamily: "var(--f-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: ".18em", color: "rgba(250,250,249,.4)" }}>
              The situation before SuiteMigrate
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
              {[
                '"I have 200 custom scripts and no idea which ones are SS 1.0."',
                '"I\'m manually rewriting each script — it takes a full day per script."',
                '"The 2028 deadline is real but I don\'t know where to even start."',
                '"I converted a script and it broke — I can\'t tell what changed and why."',
              ].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "16px 18px", border: "1px solid rgba(250,250,249,.08)", borderRadius: 6, fontSize: 14, color: "rgba(250,250,249,.7)", lineHeight: 1.5 }}>
                  <span style={{ color: "var(--clay)", flexShrink: 0, marginTop: 1, fontSize: 16 }}>⚠</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FEATURES  — 01
      ═══════════════════════════════════════ */}
      <section id="how-it-works" style={{ padding: "140px 0", borderTop: "1px solid var(--rule)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2.2fr", gap: 80, marginBottom: 80, alignItems: "flex-end" }}>
            <div className="section-num">01 — What SuiteMigrate does</div>
            <h2 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(34px,4.5vw,60px)", lineHeight: 1.04, letterSpacing: "-0.025em" }}>
              A migration engine built for{" "}
              <span style={{ color: "var(--clay)", fontStyle: "italic" }}>NetSuite&apos;s reality.</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "var(--rule)", border: "1px solid var(--rule)" }}>
            {[
              {
                tag: "free",
                title: "Account scan & risk scoring",
                desc: "Opens on your active NetSuite tab and scans every script in under 60 seconds. No API keys, no credentials — reads your existing session. Every script gets a HIGH / MED / LOW risk score instantly.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M4 20h20M4 14h14M4 8h8" stroke="var(--ink)" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                ),
              },
              {
                tag: "free",
                title: "AI-powered conversion",
                desc: "Gemini AI converts your entire script — AMD module structure, function signatures, error handling, all API calls. 50+ mapping rules handle known patterns first; AI fills the gaps. Not find-and-replace.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M6 22l4-8 4 4 4-10 4 14" stroke="var(--clay)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
              },
              {
                tag: "free",
                title: "Inline MIGRATED comments",
                desc: "Every line that changed gets a // MIGRATED: comment explaining what happened and why. Three review tabs: Code · Changes · Inline. You know exactly what to check before deploying.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <rect x="4" y="4" width="20" height="20" rx="2" stroke="var(--ink)" strokeWidth="1.2"/>
                    <path d="M8 10h12M8 14h8M8 18h10" stroke="var(--clay)" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                ),
              },
              {
                tag: "free",
                title: "Confidence score & flagging",
                desc: "Every conversion gets a 0–100% confidence score. Lines needing manual review are flagged explicitly — never silently skipped. You always know what the AI is certain about and what needs your eyes.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <circle cx="14" cy="14" r="10" stroke="var(--ink)" strokeWidth="1.2"/>
                    <path d="M14 8v6l4 2" stroke="var(--clay)" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                ),
              },
              {
                tag: "free",
                title: "Deploy-ready export",
                desc: "Download converted scripts ready to upload to NetSuite. Every file includes a professional header: conversion date, confidence score, change count, and a pre-flight deployment checklist.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M14 4v14m0 0l-5-5m5 5l5-5M6 22h16" stroke="var(--ink)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
              },
              {
                tag: "free",
                title: "Local-first, read-only",
                desc: "The extension runs on your existing browser session. No credentials are stored or transmitted. Your scripts never leave your machine until you explicitly download them. No NetSuite write operations, ever.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <rect x="4" y="10" width="20" height="14" rx="2" stroke="var(--ink)" strokeWidth="1.2"/>
                    <path d="M9 10V7a5 5 0 0110 0v3" stroke="var(--clay)" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                ),
              },
            ].map((f) => (
              <div key={f.title} style={{ background: "var(--paper)", padding: "46px 34px", transition: "background .14s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--paper-warm)")}
                onMouseLeave={e => (e.currentTarget.style.background = "var(--paper)")}>
                <div style={{ width: 30, height: 30, marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {f.icon}
                </div>
                <span style={{ display: "inline-flex", alignItems: "center", fontFamily: "var(--f-mono)", fontSize: 9, textTransform: "uppercase", letterSpacing: ".14em", padding: "3px 8px", borderRadius: 3, background: "rgba(15,23,42,.07)", color: "var(--ink-mute)", marginBottom: 18 }}>
                  {f.tag}
                </span>
                <h3 style={{ fontFamily: "var(--f-head)", fontWeight: 400, fontSize: 22, letterSpacing: "-0.015em", marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          HOW IT WORKS  — 02
      ═══════════════════════════════════════ */}
      <section style={{ padding: "140px 0", borderTop: "1px solid var(--rule)", background: "rgba(237,233,223,.4)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2.2fr", gap: 80, marginBottom: 80, alignItems: "flex-end" }}>
            <div className="section-num">02 — How it works</div>
            <h2 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(34px,4.5vw,60px)", lineHeight: 1.04, letterSpacing: "-0.025em" }}>
              From install to{" "}
              <span style={{ color: "var(--clay)", fontStyle: "italic" }}>deployed in minutes.</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            {/* Steps */}
            <ol style={{ listStyle: "none" }}>
              {[
                {
                  n: "01",
                  title: "Install on Chrome — open on your NetSuite tab",
                  desc: "Install from the Chrome Web Store. Open SuiteMigrate on any logged-in NetSuite tab. It detects your account automatically — Sandbox, Release Preview, or Production.",
                },
                {
                  n: "02",
                  title: "Scan your account — every script in 60 seconds",
                  desc: "Click Scan. SuiteMigrate uses SuiteQL to pull every script record: name, type, version, deployment status. Every script gets a HIGH / MED / LOW migration risk score.",
                },
                {
                  n: "03",
                  title: "Select a script and convert",
                  desc: "Click Convert on any script. Gemini AI runs a full structural conversion in under 15 seconds. The result shows exactly what changed with inline // MIGRATED: comments.",
                },
                {
                  n: "04",
                  title: "Review, download, and deploy",
                  desc: "Review the three-tab output — Code, Changes, Inline. Download the converted file with its professional header. Upload to NetSuite and run your pre-flight checklist.",
                },
              ].map((s) => (
                <li key={s.n} style={{ display: "flex", gap: 18, padding: "22px 0", borderBottom: "1px solid var(--rule)" }}>
                  <span style={{ fontFamily: "var(--f-mono)", fontSize: 10.5, letterSpacing: ".12em", color: "var(--ink-mute)", paddingTop: 4, flexShrink: 0, width: 28 }}>{s.n}</span>
                  <div>
                    <h4 style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{s.title}</h4>
                    <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.6 }}>{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>

            {/* Diff card mock */}
            <div style={{
              background: "var(--ink)", color: "var(--paper)",
              borderRadius: 10, overflow: "hidden",
              boxShadow: "0 32px 80px -20px rgba(0,0,0,.5)",
              transform: "rotate(-1.5deg)",
              fontFamily: "var(--f-mono)",
            }}>
              <div style={{ background: "#222226", height: 36, display: "flex", alignItems: "center", padding: "0 14px", gap: 5, borderBottom: "1px solid rgba(255,255,255,.07)" }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e", marginLeft: 3, display: "inline-block" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840", marginLeft: 3, display: "inline-block" }} />
                <span style={{ marginLeft: 10, fontFamily: "var(--f-mono)", fontSize: 10.5, color: "rgba(250,250,249,.35)", flex: 1 }}>
                  SuiteMigrate · invoice_auto_email.js → 2.1
                </span>
              </div>
              <div style={{ padding: 22 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <span style={{ fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".14em", color: "rgba(250,250,249,.35)" }}>8 changes · confidence 94%</span>
                  <span style={{ fontSize: 9.5, color: "var(--clay)" }}>ready to deploy</span>
                </div>
                {[
                  { badge: "MIGRATED", label: "AMD define() module structure", id: "L1–4", type: "changed" },
                  { badge: "MIGRATED", label: "nlapiLoadRecord → record.load()", id: "L12", type: "changed" },
                  { badge: "MIGRATED", label: "setFieldValue → setValue()", id: "L18", type: "changed" },
                  { badge: "REVIEW",   label: "Complex nlapiSearchRecord call", id: "L47", type: "missing" },
                  { badge: "MIGRATED", label: "nlapiSubmitRecord → rec.save()", id: "L52", type: "same" },
                ].map((row) => (
                  <div key={row.id} style={{
                    display: "flex", alignItems: "center", gap: 11,
                    padding: "9px 11px", borderRadius: 4, marginBottom: 4,
                    background: row.type === "changed" ? "rgba(217,74,31,.15)" : row.type === "missing" ? "rgba(250,250,249,.05)" : "rgba(74,222,128,.07)",
                    fontFamily: "var(--f-mono)", fontSize: 10.5,
                  }}>
                    <span style={{
                      fontSize: 8.5, textTransform: "uppercase", letterSpacing: ".12em",
                      padding: "2px 6px", borderRadius: 2, flexShrink: 0,
                      background: row.type === "changed" ? "var(--clay)" : row.type === "missing" ? "rgba(250,250,249,.12)" : "rgba(74,222,128,.18)",
                      color: row.type === "changed" ? "var(--paper)" : row.type === "missing" ? "rgba(250,250,249,.65)" : "#4ade80",
                    }}>{row.badge}</span>
                    <span style={{ flex: 1, color: "rgba(250,250,249,.85)" }}>{row.label}</span>
                    <span style={{ color: "rgba(250,250,249,.3)", fontSize: 9.5 }}>{row.id}</span>
                  </div>
                ))}
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(250,250,249,.07)", display: "flex", justifyContent: "space-between", fontSize: 9.5, color: "rgba(250,250,249,.3)" }}>
                  <span>1 review flagged · never writes to NetSuite</span>
                  <span>download →</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          QUOTE
      ═══════════════════════════════════════ */}
      <section style={{ padding: "120px 0", borderTop: "1px solid var(--rule)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 40px" }}>
          <blockquote style={{
            fontFamily: "var(--f-head)", fontWeight: 300,
            fontSize: "clamp(24px,3.5vw,46px)", lineHeight: 1.18,
            letterSpacing: "-0.02em", maxWidth: 860, margin: "0 auto",
            textAlign: "center", position: "relative",
          }}>
            <span style={{ fontFamily: "var(--f-head)", color: "var(--clay)", fontSize: 120, lineHeight: 1, position: "absolute", top: -48, left: -28, opacity: .5, pointerEvents: "none" }} aria-hidden>&quot;</span>
            We had 43 scripts on SS 1.0 and no idea where to start. SuiteMigrate scanned everything in 40 seconds and converted the first 5 in under 3 minutes. The inline MIGRATED comments made code review genuinely effortless.
          </blockquote>
          <p style={{ marginTop: 36, textAlign: "center", fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: ".15em", textTransform: "uppercase", color: "var(--ink-mute)" }}>
            Sara Köhler — Staff Engineer, Halftone
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          WHAT'S INCLUDED  — 03
      ═══════════════════════════════════════ */}
      <section style={{ padding: "0 0 140px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div className="section-num" style={{ marginBottom: 12, display: "block" }}>03 — What&apos;s included</div>
            <h2 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(26px,3.5vw,44px)", lineHeight: 1.04, letterSpacing: "-0.025em" }}>
              Everything in the free plan.{" "}
              <span style={{ color: "var(--clay)", fontStyle: "italic" }}>Really.</span>
            </h2>
            <p style={{ fontSize: 16, color: "var(--ink-soft)", marginTop: 16, maxWidth: 560, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
              5 full AI conversions with all features included — no credit card, no trial expiry. Upgrade to Pro when you need unlimited.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 1, background: "var(--rule)", border: "1px solid var(--rule)", borderRadius: 6, overflow: "hidden" }}>
            {/* Feature col */}
            <div style={{ background: "var(--paper)", padding: "28px 30px" }}>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--ink-mute)", marginBottom: 18, paddingBottom: 14, borderBottom: "1px solid var(--rule)" }}>Feature</div>
              {[
                "Account scan — full script inventory",
                "Risk score (HIGH / MED / LOW) for every script",
                "AI conversion — full structural rewrite",
                "50+ API mapping rules (deterministic pass)",
                "Inline // MIGRATED: comments on every change",
                "Three review tabs: Code · Changes · Inline",
                "Confidence score (0–100%) per conversion",
                "Manual review flags — nothing silently skipped",
                "Deploy-ready download with professional header",
                "PDF audit report export",
              ].map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", fontSize: 13.5, borderBottom: "1px solid var(--rule)", color: "var(--ink-soft)" }}>{f}</div>
              ))}
            </div>
            {/* Free col */}
            <div style={{ background: "var(--paper)", padding: "28px 30px" }}>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--ink-mute)", marginBottom: 18, paddingBottom: 14, borderBottom: "1px solid var(--rule)" }}>Free (5 conversions)</div>
              {Array(10).fill("✓").map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--rule)", color: "var(--clay)", fontSize: 13 }}>{c}</div>
              ))}
            </div>
            {/* Pro col */}
            <div style={{ background: "var(--ink)", color: "var(--paper)", padding: "28px 30px" }}>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: ".14em", color: "rgba(250,250,249,.38)", marginBottom: 18, paddingBottom: 14, borderBottom: "1px solid rgba(250,250,249,.1)" }}>Pro (unlimited)</div>
              {Array(10).fill("✓").map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid rgba(250,250,249,.08)", color: "var(--clay)", fontSize: 13 }}>{c}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PRICING  — 04
      ═══════════════════════════════════════ */}
      <section id="pricing" style={{ padding: "140px 0", borderTop: "1px solid var(--rule)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2.2fr", gap: 80, marginBottom: 80, alignItems: "flex-end" }}>
            <div className="section-num">04 — Pricing</div>
            <h2 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(34px,4.5vw,60px)", lineHeight: 1.04, letterSpacing: "-0.025em" }}>
              Start free.{" "}
              <span style={{ color: "var(--clay)", fontStyle: "italic" }}>Upgrade when you need more.</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 840, margin: "0 auto 40px" }}>
            {/* Free */}
            <div style={{ padding: 38, border: "1px solid var(--rule)", borderRadius: 6, background: "var(--paper)", transition: "transform .18s" }}>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: ".15em", color: "var(--ink-mute)", marginBottom: 22 }}>Free</div>
              <div style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: 56, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 5 }}>$0</div>
              <div style={{ fontSize: 14, color: "var(--ink-soft)", marginBottom: 5 }}>forever</div>
              <div style={{ fontSize: 13.5, color: "var(--ink-mute)", marginBottom: 26 }}>No credit card required</div>
              <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.6, marginBottom: 22 }}>
                Full scan, risk scoring, audit report, and 5 complete AI conversions. Every feature, no restrictions — just 5 uses.
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 9, marginBottom: 30 }}>
                {["Full account scan", "Risk scoring", "5 AI conversions", "Inline comments + diff view", "PDF audit report"].map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "var(--ink-soft)" }}>
                    <span style={{ color: "var(--ink-mute)", flexShrink: 0, fontFamily: "var(--f-mono)" }}>—</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" style={{ display: "block", width: "100%", padding: "13px 20px", borderRadius: 4, textAlign: "center", fontSize: 14, fontWeight: 500, border: "1px solid var(--rule)", background: "transparent", color: "var(--ink)", transition: "background .18s, color .18s" }}
                className="plan-cta-free">
                Start free — no card
              </Link>
            </div>

            {/* Pro */}
            <div style={{ padding: 38, border: "1px solid var(--ink)", borderRadius: 6, background: "var(--ink)", color: "var(--paper)", transition: "transform .18s" }}>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, textTransform: "uppercase", letterSpacing: ".15em", color: "rgba(250,250,249,.5)", marginBottom: 22 }}>Pro</div>
              <div style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: 56, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 5 }}>$29</div>
              <div style={{ fontSize: 14, color: "rgba(250,250,249,.55)", marginBottom: 5 }}>per month</div>
              <div style={{ fontSize: 13.5, marginBottom: 26 }}>
                or <strong style={{ color: "var(--clay)" }}>$299 lifetime</strong>
                <span style={{ color: "rgba(250,250,249,.45)" }}> · pay once, own forever</span>
              </div>
              <p style={{ fontSize: 14, color: "rgba(250,250,249,.6)", lineHeight: 1.6, marginBottom: 22 }}>
                Unlimited conversions. Full history. Professional exports. Everything — for every script in every account.
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 9, marginBottom: 30 }}>
                {["Everything in Free", "Unlimited conversions", "Full conversion history", "ZIP export all scripts", "Priority queue"].map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "rgba(250,250,249,.65)" }}>
                    <span style={{ color: "var(--clay)", flexShrink: 0, fontFamily: "var(--f-mono)" }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup?plan=pro" style={{ display: "block", width: "100%", padding: "13px 20px", borderRadius: 4, textAlign: "center", fontSize: 14, fontWeight: 500, background: "var(--clay)", color: "var(--paper)", border: "1px solid var(--clay)", transition: "background .18s" }}>
                Get Pro
              </Link>
            </div>
          </div>

          <p style={{ textAlign: "center", fontFamily: "var(--f-mono)", fontSize: 10.5, color: "var(--ink-mute)", letterSpacing: ".06em", lineHeight: 1.7 }}>
            Team plan ($99/mo) available for consultants managing multiple client accounts.<br />
            Have a promo code? Enter it in Settings after signup —{" "}
            <code style={{ color: "var(--ink-soft)" }}>TESTPRO</code> unlocks unlimited conversions during beta.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FAQ  — 05
      ═══════════════════════════════════════ */}
      <section id="faq" style={{ padding: "120px 0", borderTop: "1px solid var(--rule)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2.2fr", gap: 80, marginBottom: 80, alignItems: "flex-end" }}>
            <div className="section-num">05 — FAQ</div>
            <h2 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(34px,4.5vw,60px)", lineHeight: 1.04, letterSpacing: "-0.025em" }}>
              Common <span style={{ color: "var(--clay)", fontStyle: "italic" }}>questions.</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "var(--rule)", border: "1px solid var(--rule)" }}>
            {faqs.map(f => (
              <div key={f.q} style={{ background: "var(--paper)", padding: 32, transition: "background .14s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--paper-warm)")}
                onMouseLeave={e => (e.currentTarget.style.background = "var(--paper)")}>
                <h4 style={{ fontSize: 15, fontWeight: 500, marginBottom: 10, letterSpacing: "-0.01em" }}>{f.q}</h4>
                <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.7 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════ */}
      <section style={{ padding: "160px 0", borderTop: "1px solid var(--rule)", textAlign: "center" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 40px" }}>
          <h2 style={{
            fontFamily: "var(--f-head)", fontWeight: 300,
            fontSize: "clamp(34px,5vw,64px)", lineHeight: 1.04,
            letterSpacing: "-0.025em", marginBottom: 18,
          }}>
            Ready for the 2028 deadline?<br />
            <span style={{ color: "var(--clay)", fontStyle: "italic" }}>Start in sixty seconds.</span>
          </h2>
          <p style={{ fontSize: 17, color: "var(--ink-soft)", maxWidth: 460, margin: "0 auto 40px", lineHeight: 1.6 }}>
            Install. Scan your account. Convert 5 scripts free. Your data never leaves your browser.
          </p>
          <Link href="/signup" className="btn-pill" style={{ fontSize: 16, padding: "15px 32px" }}>
            Install free on Chrome
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7h12m0 0L8 2m5 5L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </Link>
          <p style={{ marginTop: 20, fontFamily: "var(--f-mono)", fontSize: 10, color: "var(--ink-mute)", letterSpacing: ".06em" }}>
            Free · Read-only · Never writes to NetSuite · 5 free conversions · No credit card
          </p>
        </div>
      </section>

      <Footer />

      {/* Responsive hero card hide */}
      <style>{`
        @media (max-width: 1060px) { .hero-card-hide { display: none !important; } }
        .plan-cta-free:hover { background: var(--ink) !important; color: var(--paper) !important; border-color: var(--ink) !important; transform: translateY(-1px); }
      `}</style>
    </div>
  )
}
