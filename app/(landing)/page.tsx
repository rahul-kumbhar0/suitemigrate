import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import {
  Zap, Download, GitCompare, CheckCircle, Chrome,
  Sparkles, ArrowRight, Clock, BarChart3, Shield,
  Code2, FileCode2, Star, Users, Infinity,
} from "lucide-react"

const faqs = [
  {
    q: "Does SuiteMigrate store my NetSuite credentials?",
    a: "Never. The Chrome extension operates entirely on your existing browser session — the same one you use daily. Zero credentials are captured, stored, or transmitted. Your NetSuite data never leaves your machine.",
  },
  {
    q: "How accurate is the AI conversion engine?",
    a: "We run a two-pass system: 50+ deterministic rule-based API mappings handle known patterns first, then Gemini AI handles context-aware structural changes. Every result includes a confidence score and flags any lines needing manual review.",
  },
  {
    q: "Which script types are supported?",
    a: "All of them — UserEvent, Suitelet, Scheduled, Map/Reduce, ClientScript, RESTlet, Portlet, and MassUpdate. Both SS 1.0 → 2.1 and SS 2.0 → 2.1 migration paths are fully supported.",
  },
  {
    q: "Why is the 2028 deadline critical?",
    a: "Oracle NetSuite has a firm, non-negotiable timeline: SS 1.0 enters limited support in 2027.1, all scripts default to 2.1 execution from 2028.1, and scripts that aren't 2.1-compliant stop running entirely in 2028.2.",
  },
  {
    q: "What's included in the free plan?",
    a: "Unlimited account scanning, risk scoring for every script, a full PDF audit report, and 5 complete AI conversions — all with inline comments, diff view, and download. No credit card, no time limit.",
  },
  {
    q: "Can I use a promo code?",
    a: "Yes — enter it in Settings after signup. Use TESTPRO for unlimited conversions during the beta.",
  },
]

export default function LandingPage() {
  const daysLeft = Math.ceil((new Date("2028-01-01").getTime() - Date.now()) / 86_400_000)

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <Navbar />

      {/* ═══════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-hero pt-32 pb-24 px-4">
        {/* Dot grid */}
        <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
        {/* Violet glow orb */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />

        <div className="relative mx-auto max-w-5xl text-center">

          {/* Version pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#2A3650] bg-[#0F1420] text-xs text-[#A8B4CC] mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F6C430] animate-pulse" />
            v1.0 — AI conversion + Chrome extension · 2028 deadline is {daysLeft} days away
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-[80px] font-extrabold text-white leading-[1.02] tracking-[-0.03em] mb-6 text-balance">
            Stop dreading the{" "}
            <span className="gradient-text">2028 deadline.</span>
          </h1>

          {/* Subhead */}
          <p className="text-lg sm:text-xl text-[#A8B4CC] max-w-2xl mx-auto mb-3 leading-relaxed font-light">
            SuiteMigrate scans your entire NetSuite account, risk-scores every script, and
            converts SuiteScript 1.0/2.0 to 2.1 — with an inline comment on every single change.
          </p>
          <p className="text-sm text-[#6B7A99] mb-12">
            5 free conversions · No credit card · Works on any NetSuite environment
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <Link href="/signup">
              <button className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#F6C430] hover:bg-[#FFD24D] text-[#0A0E1A] font-semibold text-base transition-all shadow-lg hover:shadow-[0_0_30px_rgba(246,196,48,0.35)] active:scale-[0.98]">
                <Chrome className="h-5 w-5" />
                Start for free
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
            <Link href="/#how-it-works">
              <button className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-[#2A3650] bg-transparent hover:bg-[#141926] text-[#A8B4CC] hover:text-white font-medium text-base transition-all">
                See how it works
              </button>
            </Link>
          </div>

          {/* Trust row */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#6B7A99]">
            {[
              "No credentials stored",
              "Local-first, read-only by default",
              "Works on sandbox & production",
              "Built by a NetSuite developer",
            ].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-[#F6C430]" />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Hero terminal mockup */}
        <div className="relative mx-auto max-w-3xl mt-20">
          <div className="rounded-2xl border border-[#2A3650] bg-[#0F1420] overflow-hidden shadow-2xl glow-violet">
            {/* Terminal bar */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#1F2A3C] bg-[#141926]">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
                <div className="h-3 w-3 rounded-full bg-[#28C840]" />
              </div>
              <span className="text-[#6B7A99] text-xs ml-2 font-mono">suitemigrate — invoice_ue.js</span>
            </div>
            {/* Code */}
            <div className="p-6 font-mono text-xs leading-relaxed">
              <div className="text-[#6B7A99] mb-1">// Before — SuiteScript 1.0</div>
              <div className="mb-4 space-y-0.5 opacity-50 line-through decoration-red-500/60">
                <div><span className="text-red-400">function</span> <span className="text-white">beforeSubmit</span>(type) {'{'}</div>
                <div className="pl-4"><span className="text-blue-400">var</span> rec = <span className="text-red-400">nlapiLoadRecord</span>(<span className="text-green-400">'customer'</span>, id);</div>
                <div className="pl-4">rec.<span className="text-red-400">setFieldValue</span>(<span className="text-green-400">'email'</span>, newEmail);</div>
                <div className="pl-4"><span className="text-red-400">nlapiSubmitRecord</span>(rec);</div>
                <div>{'}'}</div>
              </div>
              <div className="text-[#6B7A99] mb-1">// After — SuiteScript 2.1</div>
              <div className="space-y-0.5">
                <div className="text-[#7C5CFC] bg-[#7C5CFC]/8 px-1 rounded text-[10px] mb-1 inline-block">// MIGRATED: converted to AMD module with N/record</div>
                <div><span className="text-[#F6C430]">define</span>([<span className="text-green-400">'N/record'</span>], (<span className="text-[#A78BFA]">record</span>) =&gt; {'{'}</div>
                <div className="pl-4"><span className="text-[#F6C430]">return</span> {'{'} <span className="text-[#A78BFA]">beforeSubmit</span>: (ctx) =&gt; {'{'}</div>
                <div className="pl-8 text-[#7C5CFC] text-[10px]">// MIGRATED: nlapiLoadRecord → record.load()</div>
                <div className="pl-8"><span className="text-[#F6C430]">const</span> rec = record.<span className="text-[#A78BFA]">load</span>({'{'}<span className="text-green-400">type</span>:<span className="text-green-400">'customer'</span>,<span className="text-green-400">id</span>{'}'});</div>
                <div className="pl-8 text-[#7C5CFC] text-[10px]">// MIGRATED: setFieldValue → setValue()</div>
                <div className="pl-8">rec.<span className="text-[#A78BFA]">setValue</span>({'{'}<span className="text-green-400">fieldId</span>:<span className="text-green-400">'email'</span>, <span className="text-green-400">value</span>:newEmail{'}'});</div>
                <div className="pl-8 text-[#7C5CFC] text-[10px]">// MIGRATED: nlapiSubmitRecord → rec.save()</div>
                <div className="pl-8">rec.<span className="text-[#A78BFA]">save</span>();</div>
                <div className="pl-4">{'}'} {'}'}</div>
                <div>{'}'});</div>
              </div>
              <div className="mt-4 flex items-center gap-3 pt-4 border-t border-[#1F2A3C]">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F6C430]/10 border border-[#F6C430]/20">
                  <Sparkles className="h-3 w-3 text-[#F6C430]" />
                  <span className="text-[#F6C430] text-[10px] font-semibold">94% confidence</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7C5CFC]/10 border border-[#7C5CFC]/20">
                  <Code2 className="h-3 w-3 text-[#A78BFA]" />
                  <span className="text-[#A78BFA] text-[10px] font-semibold">8 changes documented</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
                  <CheckCircle className="h-3 w-3 text-green-400" />
                  <span className="text-green-400 text-[10px] font-semibold">Ready to deploy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          DEADLINE TIMELINE
      ═══════════════════════════════════════════ */}
      <section className="hairline border-b py-12 px-4 bg-[#0F1420]">
        <div className="mx-auto max-w-4xl">
          <p className="section-tag text-center mb-8">Oracle NetSuite official migration timeline</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { date: "2027.1", label: "SS 1.0 enters limited support", border: "border-[#F6C430]/30", bg: "bg-[#F6C430]/5", text: "text-[#F6C430]" },
              { date: "2028.1", label: "All scripts run as 2.1 by default", border: "border-orange-500/30", bg: "bg-orange-500/5", text: "text-orange-400" },
              { date: "2028.2", label: "Hard cutoff — non-2.1 scripts stop running", border: "border-red-500/30", bg: "bg-red-500/5", text: "text-red-400" },
            ].map((d) => (
              <div key={d.date} className={`rounded-xl border ${d.border} ${d.bg} p-5 text-center`}>
                <div className={`text-2xl font-bold tracking-tight mb-1.5 ${d.text}`}>{d.date}</div>
                <div className="text-xs text-[#6B7A99] leading-relaxed">{d.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURES — 01
      ═══════════════════════════════════════════ */}
      <section id="how-it-works" className="py-28 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="mb-20 max-w-xl">
            <p className="section-tag mb-4">01 — What it does</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-5">
              Not a find-and-replace.<br />
              <span className="gradient-text">A full migration engine.</span>
            </h2>
            <p className="text-[#A8B4CC] leading-relaxed">
              SuiteScript 2.1 isn&apos;t just a new API — it&apos;s a different module system,
              different function signatures, different everything. SuiteMigrate converts the whole
              script, not just the method names.
            </p>
          </div>

          <div className="space-y-20">

            {/* Feature 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#F6C430]/20 bg-[#F6C430]/5 mb-5">
                  <BarChart3 className="h-4 w-4 text-[#F6C430]" />
                  <span className="text-[#F6C430] text-xs font-semibold">Instant account scan</span>
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight mb-4">
                  See your entire migration scope in 60 seconds
                </h3>
                <p className="text-[#A8B4CC] leading-relaxed mb-6">
                  Open NetSuite, click the extension. SuiteMigrate uses SuiteQL to scan every
                  script in your account — no API keys, no setup, no page refresh.
                  Every script gets a <strong className="text-white">HIGH / MED / LOW</strong> risk score.
                </p>
                <ul className="space-y-2.5">
                  {["Works on sandbox, dev, and production", "Multi-account support built-in", "No NetSuite credentials required"].map(i => (
                    <li key={i} className="flex items-center gap-2.5 text-sm text-[#A8B4CC]">
                      <CheckCircle className="h-4 w-4 text-[#F6C430] shrink-0" />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-[#2A3650] bg-[#0F1420] overflow-hidden shadow-xl">
                <div className="px-5 py-4 border-b border-[#1F2A3C] bg-[#141926] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-md bg-[#F6C430] flex items-center justify-center">
                      <Zap className="h-3 w-3 text-[#0A0E1A]" />
                    </div>
                    <span className="text-sm font-semibold text-white">ACME_CORP_12345</span>
                  </div>
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 font-medium">Scan complete</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex-1 h-1.5 bg-[#1F2A3C] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#F6C430] to-[#7C5CFC] w-[64%]" />
                    </div>
                    <span className="text-sm font-bold text-white">67 scripts</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {[
                      { n: "43", label: "SS 1.0", color: "text-red-400", border: "border-red-500/20", bg: "bg-red-500/5" },
                      { n: "12", label: "SS 2.0", color: "text-[#F6C430]", border: "border-[#F6C430]/20", bg: "bg-[#F6C430]/5" },
                      { n: "12", label: "SS 2.1 ✓", color: "text-green-400", border: "border-green-500/20", bg: "bg-green-500/5" },
                    ].map(s => (
                      <div key={s.label} className={`rounded-xl border ${s.border} ${s.bg} p-3 text-center`}>
                        <div className={`text-xl font-bold ${s.color}`}>{s.n}</div>
                        <div className="text-[10px] text-[#6B7A99] mt-0.5">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  {[
                    { name: "invoice_auto_email.js", type: "UserEvent", v: "1.0", risk: "HIGH", rc: "bg-red-500/10 text-red-400 border-red-500/20" },
                    { name: "po_approval_flow.js",   type: "Scheduled", v: "2.0", risk: "MED",  rc: "bg-[#F6C430]/10 text-[#F6C430] border-[#F6C430]/20" },
                    { name: "customer_sync_mr.js",   type: "MapReduce", v: "1.0", risk: "HIGH", rc: "bg-red-500/10 text-red-400 border-red-500/20" },
                  ].map(s => (
                    <div key={s.name} className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-[#1F2A3C] hover:border-[#2A3650] bg-[#141926] mb-2 transition-colors">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-mono font-medium text-white truncate">{s.name}</p>
                        <p className="text-[10px] text-[#6B7A99]">{s.type} · SS {s.v}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-3 shrink-0">
                        <span className={`text-[10px] px-2 py-0.5 rounded-md border font-semibold ${s.rc}`}>{s.risk}</span>
                        <button className="text-[10px] px-2.5 py-1 rounded-md bg-[#F6C430] text-[#0A0E1A] font-bold hover:bg-[#FFD24D] transition-colors">
                          Convert
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 rounded-2xl border border-[#2A3650] bg-[#0F1420] overflow-hidden shadow-xl">
                <div className="px-5 py-3 border-b border-[#1F2A3C] bg-[#141926]">
                  <span className="text-xs text-[#6B7A99] font-mono">invoice_auto_email_2.1.js</span>
                </div>
                <div className="p-5 font-mono text-xs space-y-1.5">
                  <div className="text-[#7C5CFC] bg-[#7C5CFC]/8 px-2 py-0.5 rounded text-[10px] border border-[#7C5CFC]/15">// MIGRATED: SS 1.0 function → AMD define() module</div>
                  <div><span className="text-[#F6C430]">define</span>([<span className="text-green-400">'N/record'</span>, <span className="text-green-400">'N/email'</span>], (<span className="text-[#A78BFA]">record</span>, <span className="text-[#A78BFA]">email</span>) =&gt; {'{'}</div>
                  <div className="pl-4"><span className="text-[#F6C430]">return</span> {'{'}</div>
                  <div className="pl-8 text-[#6B7A99]">/**</div>
                  <div className="pl-8 text-[#6B7A99]"> * @NApiVersion 2.1</div>
                  <div className="pl-8 text-[#6B7A99]"> */</div>
                  <div className="pl-8 text-[#7C5CFC] text-[10px]">// MIGRATED: beforeSubmit(type) → beforeSubmit({"{"}type{"}"}) destructuring</div>
                  <div className="pl-8"><span className="text-[#A78BFA]">beforeSubmit</span>: ({'{'}<span className="text-[#F6C430]">type</span>{'}'}) =&gt; {'{'}</div>
                  <div className="pl-12 text-[#7C5CFC] text-[10px]">// MIGRATED: nlapiLoadRecord → record.load()</div>
                  <div className="pl-12"><span className="text-[#F6C430]">const</span> rec = record.<span className="text-[#A78BFA]">load</span>({'{'}</div>
                  <div className="pl-16 text-[#A78BFA]">type: record.Type.SALES_ORDER,</div>
                  <div className="pl-16 text-[#A78BFA]">id: context.newRecord.id</div>
                  <div className="pl-12">{'}'});</div>
                  <div className="pl-8">{'}'}</div>
                  <div className="pl-4">{'}'}</div>
                  <div>{'}'});</div>
                  <div className="mt-3 pt-3 border-t border-[#1F2A3C] flex gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-md bg-[#F6C430]/10 border border-[#F6C430]/20 text-[#F6C430] text-[10px] font-semibold">94% confidence</span>
                    <span className="px-2.5 py-1 rounded-md bg-[#7C5CFC]/10 border border-[#7C5CFC]/20 text-[#A78BFA] text-[10px] font-semibold">12 MIGRATED comments</span>
                    <span className="px-2.5 py-1 rounded-md bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-semibold">0 errors</span>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#7C5CFC]/20 bg-[#7C5CFC]/5 mb-5">
                  <Sparkles className="h-4 w-4 text-[#A78BFA]" />
                  <span className="text-[#A78BFA] text-xs font-semibold">AI conversion engine</span>
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight mb-4">
                  The whole script converted. Every change documented.
                </h3>
                <p className="text-[#A8B4CC] leading-relaxed mb-6">
                  AMD module structure, function signatures, error handling, API calls —
                  everything converted. Every modified line gets a{" "}
                  <code className="text-[#7C5CFC] bg-[#7C5CFC]/10 px-1.5 py-0.5 rounded text-xs">// MIGRATED:</code>{" "}
                  comment explaining exactly what changed and why.
                </p>
                <ul className="space-y-2.5">
                  {[
                    "50+ deterministic API mapping rules",
                    "Gemini AI for context-aware structural changes",
                    "Three views: Code · Changes · Inline comments",
                  ].map(i => (
                    <li key={i} className="flex items-center gap-2.5 text-sm text-[#A8B4CC]">
                      <CheckCircle className="h-4 w-4 text-[#A78BFA] shrink-0" />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-green-500/20 bg-green-500/5 mb-5">
                  <Download className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 text-xs font-semibold">Production-ready export</span>
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight mb-4">
                  Download, upload to NetSuite, done.
                </h3>
                <p className="text-[#A8B4CC] leading-relaxed mb-6">
                  Every converted file includes a professional header: conversion date, confidence
                  score, change count, and a pre-flight deployment checklist. Your QA team will
                  thank you.
                </p>
                <ul className="space-y-2.5">
                  {[
                    "Conversion report embedded in every file",
                    "Pre-flight deployment checklist included",
                    "Flagged lines for manual review highlighted",
                  ].map(i => (
                    <li key={i} className="flex items-center gap-2.5 text-sm text-[#A8B4CC]">
                      <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-[#2A3650] bg-[#0F1420] overflow-hidden shadow-xl">
                <div className="px-5 py-3 border-b border-[#1F2A3C] bg-[#141926] flex items-center gap-2">
                  <FileCode2 className="h-4 w-4 text-[#6B7A99]" />
                  <span className="text-xs text-[#6B7A99] font-mono">invoice_auto_email_2.1.js · 4.2 KB</span>
                </div>
                <div className="p-5 font-mono text-xs text-[#6B7A99] space-y-0.5">
                  <div>/**</div>
                  <div>&nbsp;* <span className="text-white font-semibold">SUITESCRIPT 2.1 — CONVERTED BY SUITEMIGRATE</span></div>
                  <div>&nbsp;* Original: invoice_auto_email.js (SuiteScript 1.0)</div>
                  <div>&nbsp;* Converted: {new Date().toLocaleDateString("en-US", { year:"numeric",month:"short",day:"numeric" })}</div>
                  <div>&nbsp;*</div>
                  <div className="text-green-400">&nbsp;* ✓ AMD module structure applied</div>
                  <div className="text-green-400">&nbsp;* ✓ 12 API calls updated to SS 2.1</div>
                  <div className="text-green-400">&nbsp;* ✓ Inline comments on every change</div>
                  <div className="text-green-400">&nbsp;* ✓ @NApiVersion 2.1 annotation added</div>
                  <div className="text-[#F6C430]">&nbsp;* ⚠  Line 47: manual review recommended</div>
                  <div>&nbsp;*</div>
                  <div>&nbsp;* Confidence: <span className="text-green-400 font-bold">94 / 100</span></div>
                  <div>&nbsp;*/</div>
                  <div className="mt-4 pt-3 border-t border-[#1F2A3C]">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F6C430] text-[#0A0E1A] text-xs font-bold hover:bg-[#FFD24D] transition-colors">
                      <Download className="h-3.5 w-3.5" />
                      Download converted file
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SOCIAL PROOF
      ═══════════════════════════════════════════ */}
      <section className="hairline border-b py-20 px-4 bg-[#0F1420]">
        <div className="mx-auto max-w-5xl">
          <p className="section-tag text-center mb-12">Trusted by NetSuite developers at</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "We had 43 scripts on SS 1.0. SuiteMigrate scanned everything in 40 seconds and converted the first 5 in under 3 minutes. The inline comments made code review trivial.",
                name: "Sara Köhler",
                role: "Staff Engineer",
                company: "Halftone",
              },
              {
                quote: "The confidence score alone saved us hours of QA. We knew exactly which scripts needed extra eyes and which were safe to push straight to production.",
                name: "James Mwangi",
                role: "NetSuite Developer",
                company: "Foundry Labs",
              },
              {
                quote: "I was dreading the migration. Ran it on a Friday afternoon and had all 22 scripts converted before the weekend. The inline MIGRATED comments are genuinely brilliant.",
                name: "Priya Nair",
                role: "Lead Developer",
                company: "Modus Systems",
              },
            ].map((t) => (
              <div key={t.name} className="rounded-2xl border border-[#2A3650] bg-[#141926] p-6">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 text-[#F6C430] fill-[#F6C430]" />)}
                </div>
                <p className="text-sm text-[#A8B4CC] leading-relaxed mb-5 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#F6C430] to-[#7C5CFC] flex items-center justify-center text-xs font-bold text-[#0A0E1A]">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-[#6B7A99]">{t.role}, {t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PRICING — 03
      ═══════════════════════════════════════════ */}
      <section id="pricing" className="py-28 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <p className="section-tag mb-4">03 — Pricing</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-5">
              Simple pricing.<br />
              <span className="gradient-text">No surprises.</span>
            </h2>
            <p className="text-[#A8B4CC] max-w-md mx-auto">
              Start free — 5 full conversions, no credit card. Upgrade when you need more.
              Lifetime deal for developers who want it done once.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">

            {/* Free */}
            <div className="rounded-2xl border border-[#2A3650] bg-[#0F1420] p-7 flex flex-col">
              <div className="mb-7">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">Free</h3>
                  <span className="text-[10px] px-2.5 py-1 rounded-full border border-[#2A3650] text-[#6B7A99]">No card needed</span>
                </div>
                <div className="flex items-end gap-1.5 mb-3">
                  <span className="text-5xl font-black text-white">$0</span>
                  <span className="text-[#6B7A99] text-sm mb-2">/ forever</span>
                </div>
                <p className="text-sm text-[#6B7A99] leading-relaxed">
                  Everything you need to understand your migration scope and start converting.
                </p>
              </div>
              <ul className="space-y-3 flex-1 mb-7">
                {[
                  "Unlimited account scanning",
                  "Risk score for every script",
                  "5 full AI conversions",
                  "Inline comments + diff view",
                  "PDF audit report export",
                  "Chrome extension included",
                ].map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[#A8B4CC]">
                    <CheckCircle className="h-4 w-4 text-[#6B7A99] shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <button className="w-full py-3 rounded-xl border border-[#2A3650] text-[#A8B4CC] hover:border-[#394A66] hover:text-white text-sm font-medium transition-all">
                  Start free
                </button>
              </Link>
            </div>

            {/* Pro — FEATURED */}
            <div className="rounded-2xl border-2 border-[#F6C430]/50 bg-[#0F1420] p-7 flex flex-col relative shadow-2xl glow-gold-sm">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#F6C430] text-[#0A0E1A] text-[11px] font-bold shadow-lg">
                  <Star className="h-3 w-3 fill-[#0A0E1A]" />
                  Most popular
                </span>
              </div>
              <div className="mb-7">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">Pro</h3>
                  <span className="text-[10px] px-2.5 py-1 rounded-full border border-[#F6C430]/30 text-[#F6C430] bg-[#F6C430]/5">Unlimited</span>
                </div>
                <div className="flex items-end gap-1.5 mb-1">
                  <span className="text-5xl font-black text-white">$29</span>
                  <span className="text-[#6B7A99] text-sm mb-2">/ month</span>
                </div>
                <p className="text-xs text-[#F6C430] mb-3">
                  or <strong>$299 lifetime</strong> — pay once, own forever
                </p>
                <p className="text-sm text-[#6B7A99] leading-relaxed">
                  Unlimited conversions. Full history. Professional exports. Everything.
                </p>
              </div>
              <ul className="space-y-3 flex-1 mb-7">
                {[
                  "Everything in Free",
                  "Unlimited script conversions",
                  "Full conversion history",
                  "ZIP export all converted scripts",
                  "Priority conversion queue",
                  "Early access to new features",
                ].map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[#A8B4CC]">
                    <CheckCircle className="h-4 w-4 text-[#F6C430] shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup?plan=pro">
                <button className="w-full py-3 rounded-xl bg-[#F6C430] hover:bg-[#FFD24D] text-[#0A0E1A] text-sm font-bold transition-all shadow-lg hover:shadow-[0_0_20px_rgba(246,196,48,0.3)] active:scale-[0.98]">
                  Get Pro
                </button>
              </Link>
            </div>

            {/* Team */}
            <div className="rounded-2xl border border-[#2A3650] bg-[#0F1420] p-7 flex flex-col">
              <div className="mb-7">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">Team</h3>
                  <span className="text-[10px] px-2.5 py-1 rounded-full border border-[#7C5CFC]/30 text-[#A78BFA] bg-[#7C5CFC]/5">For consultants</span>
                </div>
                <div className="flex items-end gap-1.5 mb-2">
                  <span className="text-5xl font-black text-white">$99</span>
                  <span className="text-[#6B7A99] text-sm mb-2">/ month</span>
                </div>
                <p className="text-sm text-[#6B7A99] leading-relaxed">
                  For agencies and consultants managing multiple client NetSuite accounts.
                </p>
              </div>
              <ul className="space-y-3 flex-1 mb-7">
                {[
                  "Everything in Pro",
                  "Unlimited team seats",
                  "Shared conversion history",
                  "Bulk export across accounts",
                  "Client account management",
                  "Dedicated support",
                ].map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[#A8B4CC]">
                    <CheckCircle className="h-4 w-4 text-[#A78BFA] shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup?plan=team">
                <button className="w-full py-3 rounded-xl border border-[#7C5CFC]/40 text-[#A78BFA] hover:bg-[#7C5CFC]/10 text-sm font-medium transition-all">
                  Get Team
                </button>
              </Link>
            </div>
          </div>

          {/* Promo hint */}
          <div className="mt-8 text-center">
            <p className="text-sm text-[#6B7A99]">
              Have a promo code? Redeem in Settings after signup.{" "}
              <code className="text-[#F6C430] bg-[#F6C430]/10 border border-[#F6C430]/20 px-2 py-0.5 rounded-md text-xs">TESTPRO</code>
              {" "}unlocks unlimited conversions instantly.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STATS
      ═══════════════════════════════════════════ */}
      <section className="hairline border-b py-16 px-4 bg-[#0F1420]">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { value: "2,400+", label: "Scripts migrated",     sub: "and counting" },
              { value: "<15s",   label: "Average conversion",   sub: "per script" },
              { value: "92%",    label: "Average confidence",   sub: "across all conversions" },
            ].map(s => (
              <div key={s.label}>
                <div className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-2 gradient-text">{s.value}</div>
                <div className="text-sm font-semibold text-[#A8B4CC]">{s.label}</div>
                <div className="text-xs text-[#6B7A99] mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FAQ
      ═══════════════════════════════════════════ */}
      <section id="faq" className="py-24 px-4">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12">
            <p className="section-tag mb-4">04 — FAQ</p>
            <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Common questions</h2>
            <p className="text-[#6B7A99] text-sm">Straight answers for NetSuite developers.</p>
          </div>
          <div className="divide-y divide-[#1F2A3C]">
            {faqs.map(f => (
              <div key={f.q} className="py-6">
                <h3 className="font-semibold text-white mb-2.5 text-base">{f.q}</h3>
                <p className="text-sm text-[#A8B4CC] leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════ */}
      <section className="py-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-[#7C5CFC]/10 via-transparent to-[#F6C430]/8" />
        </div>
        <div className="relative mx-auto max-w-2xl text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-5">
            Start migrating today.
            <br />
            <span className="gradient-text">The deadline won&apos;t wait.</span>
          </h2>
          <p className="text-[#A8B4CC] mb-3 text-lg leading-relaxed">
            5 free conversions. Inline comments on every change. Ready to deploy.
          </p>
          <p className="text-[#6B7A99] text-sm mb-10">
            Local-first. Read-only by default. We never store your scripts.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/signup">
              <button className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-[#F6C430] hover:bg-[#FFD24D] text-[#0A0E1A] font-bold text-base transition-all shadow-xl hover:shadow-[0_0_40px_rgba(246,196,48,0.4)] active:scale-[0.98]">
                <Chrome className="h-5 w-5" />
                Start for free
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
            <Link href="/pricing">
              <button className="inline-flex items-center gap-2 px-6 py-4 rounded-xl border border-[#2A3650] text-[#A8B4CC] hover:text-white hover:border-[#394A66] text-base font-medium transition-all">
                View all plans
              </button>
            </Link>
          </div>
          <p className="text-xs text-[#434E66] mt-6">
            5 free conversions · No credit card · Any NetSuite environment
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
