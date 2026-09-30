import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Button } from "@/components/ui/button"
import {
  Zap,
  Download,
  GitCompare,
  CheckCircle,
  Chrome,
  Sparkles,
  ArrowRight,
  Clock,
  FileCode2,
  BarChart3,
} from "lucide-react"

const faqs = [
  {
    q: "Does this store my NetSuite credentials?",
    a: "Never. The extension runs on your existing browser session. We have zero access to your NetSuite login — it reads your active session, exactly like you do.",
  },
  {
    q: "How accurate is the AI conversion?",
    a: "We use 50+ rule-based API mappings first, then Gemini AI for context-aware logic. Every result gets a confidence score so you know exactly what to verify before deploying.",
  },
  {
    q: "What script types are supported?",
    a: "All of them — UserEvent, Suitelet, Scheduled, Map/Reduce, ClientScript, RESTlet, Portlet, MassUpdate. Both SS 1.0 → 2.1 and SS 2.0 → 2.1.",
  },
  {
    q: "Why do I need to migrate to SuiteScript 2.1?",
    a: "Oracle's deadline is firm: SS 1.0 enters limited support in 2027.1, all scripts run as 2.1 from 2028.1, and 2028.2 is the hard cutoff — scripts that aren't 2.1 stop working.",
  },
  {
    q: "What's in the free tier?",
    a: "Unlimited account scanning, risk scoring for every script, and 5 complete AI conversions — no credit card, no time limit.",
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F7F3EE]">
      <Navbar />

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-4">
        <div className="mx-auto max-w-4xl text-center">

          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-200 bg-amber-50 text-amber-800 text-xs font-medium mb-8">
            <Clock className="h-3 w-3" />
            SuiteScript 1.0 end-of-life: 2028.2 — migration is non-negotiable
          </div>

          {/* Headline */}
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-[#2C1A0E] leading-[1.08] tracking-tight mb-6">
            Every script,
            <br />
            <em className="not-italic gradient-text">migrated.</em>
          </h1>

          {/* Subhead */}
          <p className="text-lg sm:text-xl text-[#6B5344] max-w-2xl mx-auto mb-3 leading-relaxed font-light">
            SuiteMigrate scans your entire NetSuite account, risk-scores every script, and converts
            SuiteScript 1.0 / 2.0 to 2.1 — with inline comments on every change.
          </p>
          <p className="text-sm text-[#9B7B6A] mb-10">
            5 free conversions. No credit card. Works on any NetSuite environment.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
            <Link href="/signup">
              <Button size="lg" className="gap-2 bg-[#2C1A0E] hover:bg-[#3D2518] text-[#F7F3EE] font-medium px-7 h-12 rounded-xl shadow-md">
                <Chrome className="h-4 w-4" />
                Start scanning, free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/#how-it-works">
              <Button size="lg" variant="ghost" className="text-[#6B5344] hover:text-[#2C1A0E] hover:bg-[#EDE7DE] h-12 px-6 rounded-xl">
                See how it works
              </Button>
            </Link>
          </div>

          {/* Trust row */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#9B7B6A]">
            {[
              "No credentials stored",
              "Works on sandbox & production",
              "Local-first, read-only by default",
            ].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-amber-600" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEADLINE BAR ───────────────────────────────────── */}
      <section className="hairline border-b py-10 px-4 bg-[#EDE7DE]/60">
        <div className="mx-auto max-w-3xl">
          <p className="text-center text-[10px] font-medium tracking-widest uppercase text-[#9B7B6A] mb-6">
            Oracle NetSuite — official migration timeline
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { date: "2027.1", label: "SS 1.0 enters limited support", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
              { date: "2028.1", label: "All scripts run as 2.1 by default", color: "text-orange-700", bg: "bg-orange-50 border-orange-200" },
              { date: "2028.2", label: "Hard cutoff — scripts must be 2.1", color: "text-red-700", bg: "bg-red-50 border-red-200" },
            ].map((d) => (
              <div key={d.date} className={`rounded-xl border p-4 text-center ${d.bg}`}>
                <div className={`font-serif text-2xl font-bold mb-1 ${d.color}`}>{d.date}</div>
                <div className="text-xs text-[#6B5344] leading-relaxed">{d.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT IT DOES ───────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-4">
        <div className="mx-auto max-w-5xl">

          <div className="mb-16">
            <span className="text-[10px] font-semibold tracking-widest uppercase text-[#9B7B6A]">01 — What it does</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2C1A0E] mt-3 mb-4">
              Migration is a story.<br />We help you tell it.
            </h2>
            <p className="text-[#6B5344] max-w-lg leading-relaxed">
              Not a generic code converter. Every feature was designed specifically for
              SuiteScript — the way NetSuite developers actually work.
            </p>
          </div>

          <div className="space-y-14">

            {/* Feature 1 — Scan */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-9 w-9 rounded-lg bg-amber-100 flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-amber-700" />
                  </div>
                  <h3 className="font-serif text-xl text-[#2C1A0E]">Real-time account scan</h3>
                </div>
                <p className="text-[#6B5344] leading-relaxed text-sm">
                  Opens on your active NetSuite tab and scans every script in under 60 seconds.
                  No API tokens, no setup — reads your existing browser session.
                  Every script gets a <strong className="text-[#2C1A0E]">HIGH / MED / LOW</strong> risk score instantly.
                </p>
              </div>
              <div className="lg:col-span-7">
                <div className="rounded-xl border border-[#D5C9BB] bg-white p-5 font-mono text-xs shadow-sm">
                  <div className="text-[#9B7B6A] mb-3">Scanning ACME_CORP_12345...</div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 h-1.5 bg-[#EDE7DE] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 w-[67%]" />
                    </div>
                    <span className="text-amber-700 font-semibold">67 scripts found</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="border border-red-200 bg-red-50 rounded-lg p-3">
                      <div className="text-red-700 text-xl font-bold">43</div>
                      <div className="text-[#9B7B6A] text-[10px] mt-0.5">SS 1.0 — migrate</div>
                    </div>
                    <div className="border border-amber-200 bg-amber-50 rounded-lg p-3">
                      <div className="text-amber-700 text-xl font-bold">12</div>
                      <div className="text-[#9B7B6A] text-[10px] mt-0.5">SS 2.0 — update</div>
                    </div>
                    <div className="border border-green-200 bg-green-50 rounded-lg p-3">
                      <div className="text-green-700 text-xl font-bold">12</div>
                      <div className="text-[#9B7B6A] text-[10px] mt-0.5">SS 2.1 — done ✓</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 — Convert */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-9 w-9 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-amber-700" />
                  </div>
                  <h3 className="font-serif text-xl text-[#2C1A0E]">AI-powered conversion</h3>
                </div>
                <p className="text-[#6B5344] leading-relaxed text-sm">
                  Gemini AI converts entire scripts — not just swapping API names.
                  AMD module structure, function signatures, error handling — the whole thing.
                  50+ mapping rules handle known patterns first, AI fills the gaps.
                </p>
              </div>
              <div className="lg:col-span-7">
                <div className="rounded-xl border border-[#D5C9BB] bg-white p-5 font-mono text-xs shadow-sm">
                  <div className="text-[#9B7B6A] mb-2">// Before — SuiteScript 1.0</div>
                  <div className="text-red-500 line-through mb-3 pl-2">
                    function scheduled(type) &#123;<br />
                    &nbsp;&nbsp;var rec = <span className="text-red-600">nlapiLoadRecord</span>(&apos;customer&apos;, 123);<br />
                    &#125;
                  </div>
                  <div className="text-[#9B7B6A] mb-2">// After — SuiteScript 2.1</div>
                  <div className="text-[#2C1A0E] pl-2">
                    <span className="text-amber-700">define</span>([&apos;N/record&apos;], (<span className="text-orange-600">record</span>) =&gt; &#123;<br />
                    &nbsp;&nbsp;<span className="text-amber-700">return</span> &#123; <span className="text-orange-600">execute</span>: ctx =&gt; &#123;<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-amber-700">const</span> rec = record.<span className="text-orange-600">load</span>(&#123;type:&apos;customer&apos;,id:123&#125;);<br />
                    &nbsp;&nbsp;&#125;&#125;<br />
                    &#125;);
                  </div>
                  <div className="mt-3 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                    <Sparkles className="h-3 w-3 text-amber-600 shrink-0" />
                    <span className="text-amber-700 text-[10px]">AI converted · 92% confidence · 8 changes documented</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3 — Inline comments */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-9 w-9 rounded-lg bg-amber-100 flex items-center justify-center">
                    <GitCompare className="h-4 w-4 text-amber-700" />
                  </div>
                  <h3 className="font-serif text-xl text-[#2C1A0E]">Inline change comments</h3>
                </div>
                <p className="text-[#6B5344] leading-relaxed text-sm">
                  Every line that changed gets a <code className="text-[#2C1A0E] bg-[#EDE7DE] px-1 rounded text-[11px]">// MIGRATED:</code> comment
                  explaining what happened and why. No guessing. No diff hunting.
                  Review in three tabs: Code, Changes, Inline.
                </p>
              </div>
              <div className="lg:col-span-7">
                <div className="rounded-xl border border-[#D5C9BB] bg-white p-5 font-mono text-xs shadow-sm space-y-1.5">
                  <div className="text-green-700 bg-green-50 border-l-2 border-green-500 pl-2 py-0.5 rounded-r">
                    // MIGRATED: nlapiLoadRecord() → record.load() — SS 2.1 API
                  </div>
                  <div className="text-[#2C1A0E] pl-2">const rec = record.load(&#123; type: &apos;customer&apos;, id: 123 &#125;);</div>
                  <div className="text-green-700 bg-green-50 border-l-2 border-green-500 pl-2 py-0.5 rounded-r mt-2">
                    // MIGRATED: setFieldValue() → setValue() with object syntax
                  </div>
                  <div className="text-[#2C1A0E] pl-2">rec.setValue(&#123; fieldId: &apos;email&apos;, value: &apos;user@co.com&apos; &#125;);</div>
                  <div className="text-green-700 bg-green-50 border-l-2 border-green-500 pl-2 py-0.5 rounded-r mt-2">
                    // MIGRATED: nlapiSubmitRecord() → rec.save()
                  </div>
                  <div className="text-[#2C1A0E] pl-2">const id = rec.save();</div>
                </div>
              </div>
            </div>

            {/* Feature 4 — Export */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-9 w-9 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Download className="h-4 w-4 text-amber-700" />
                  </div>
                  <h3 className="font-serif text-xl text-[#2C1A0E]">Deploy-ready export</h3>
                </div>
                <p className="text-[#6B5344] leading-relaxed text-sm">
                  Download converted scripts ready to upload to NetSuite directly.
                  Every file includes a professional header: conversion date, change count,
                  confidence score, and a pre-flight checklist.
                </p>
              </div>
              <div className="lg:col-span-7">
                <div className="rounded-xl border border-[#D5C9BB] bg-white p-5 font-mono text-xs shadow-sm">
                  <div className="text-[#9B7B6A] space-y-0.5">
                    <div>/**</div>
                    <div>&nbsp;* <span className="text-[#2C1A0E] font-semibold">SUITESCRIPT 2.1 CONVERSION</span></div>
                    <div>&nbsp;* Generated by SuiteMigrate</div>
                    <div>&nbsp;* Script: invoice_auto_email.js</div>
                    <div>&nbsp;* Date: {new Date().toLocaleDateString()}</div>
                    <div>&nbsp;*</div>
                    <div className="text-green-700">&nbsp;* ✓ Converted to AMD module format</div>
                    <div className="text-green-700">&nbsp;* ✓ 14 API calls updated to 2.1</div>
                    <div className="text-green-700">&nbsp;* ✓ Inline comments on every change</div>
                    <div className="text-amber-700">&nbsp;* ⚠ 2 lines need manual review (line 47, 83)</div>
                    <div>&nbsp;*</div>
                    <div>&nbsp;* Confidence score: <span className="text-green-700 font-bold">92 / 100</span></div>
                    <div>&nbsp;*/</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── IN YOUR SIDEBAR ────────────────────────────────── */}
      <section className="hairline border-b py-24 px-4 bg-[#EDE7DE]/50">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16">
            <span className="text-[10px] font-semibold tracking-widest uppercase text-[#9B7B6A]">02 — In your browser</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2C1A0E] mt-3 mb-4">
              Lives where you work.<br />Quietly.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Extension mockup */}
            <div className="rounded-2xl border border-[#D5C9BB] bg-white overflow-hidden shadow-lg">
              {/* Header */}
              <div className="px-4 py-3 border-b border-[#EDE7DE] flex items-center justify-between bg-[#FFFDF9]">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-md bg-[#2C1A0E] flex items-center justify-center">
                    <Zap className="h-3 w-3 text-[#F7F3EE]" />
                  </div>
                  <span className="text-sm font-semibold text-[#2C1A0E]">SuiteMigrate</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 font-medium">Pro</span>
              </div>

              {/* Meter bar */}
              <div className="px-4 py-3 border-b border-[#EDE7DE] bg-[#FDFAF6]">
                <div className="text-[10px] text-[#9B7B6A] mb-1.5">⊕ ACME_CORP · suitemigrate · session</div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1 bg-[#EDE7DE] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 w-[43%]" />
                  </div>
                  <span className="text-amber-700 text-xs font-bold">43%</span>
                </div>
                <div className="text-[10px] text-[#9B7B6A] mt-1">≈ 24 scripts converted · resets never</div>
              </div>

              {/* Script list */}
              <div className="p-4 space-y-2">
                {[
                  { name: "invoice_auto_email.js", type: "UserEvent", ver: "1.0", risk: "HIGH", rc: "bg-red-100 text-red-700" },
                  { name: "po_approval_flow.js",   type: "Scheduled", ver: "2.0", risk: "MED",  rc: "bg-amber-100 text-amber-700" },
                  { name: "customer_sync_mr.js",   type: "MapReduce", ver: "1.0", risk: "HIGH", rc: "bg-red-100 text-red-700" },
                ].map((s) => (
                  <div key={s.name} className="flex items-center justify-between p-3 rounded-lg border border-[#EDE7DE] bg-[#FDFAF6] hover:border-[#D5C9BB] transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-mono font-medium text-[#2C1A0E] truncate">{s.name}</p>
                      <p className="text-[10px] text-[#9B7B6A]">{s.type} · SS {s.ver}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${s.rc}`}>{s.risk}</span>
                      <button className="text-[10px] px-2.5 py-1 rounded-md bg-[#2C1A0E] text-[#F7F3EE] font-medium hover:bg-[#3D2518] transition-colors">
                        Convert
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-4 pb-4">
                <button className="w-full text-xs py-2 rounded-lg border border-[#D5C9BB] text-[#6B5344] hover:bg-[#EDE7DE] transition-colors flex items-center justify-center gap-1.5">
                  <Download className="h-3 w-3" />
                  Export audit report
                </button>
              </div>
            </div>

            {/* Description + testimonial */}
            <div>
              <p className="text-[#6B5344] leading-relaxed mb-6">
                A single panel in your Chrome toolbar. When you open NetSuite,
                SuiteMigrate auto-detects the account and surfaces every script
                that needs attention — risk-scored, one click to convert.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Auto-detects sandbox, dev, and production environments",
                  "SuiteQL scan runs without refreshing the page",
                  "Converts scripts and downloads in one click",
                  "Auth syncs automatically when you log in on the website",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#6B5344]">
                    <CheckCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* Testimonial */}
              <div className="rounded-xl border border-[#D5C9BB] bg-white p-5">
                <p className="text-sm text-[#2C1A0E] leading-relaxed italic mb-4">
                  &ldquo;We had 43 scripts on SS 1.0 and no idea where to start.
                  SuiteMigrate scanned everything in 40 seconds and converted
                  the first 5 in under 3 minutes. The inline comments made
                  code review trivial.&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-[#EDE7DE] flex items-center justify-center text-xs font-bold text-[#2C1A0E]">
                    SK
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#2C1A0E]">Sara Köhler</p>
                    <p className="text-xs text-[#9B7B6A]">Staff Engineer, Halftone</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16">
            <span className="text-[10px] font-semibold tracking-widest uppercase text-[#9B7B6A]">03 — Pricing</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2C1A0E] mt-3 mb-4">
              Flat fee.<br />No share of your scripts.
            </h2>
            <p className="text-[#6B5344] max-w-md">
              Free gets most solo developers through their migration.
              Pro is there when you need unlimited — or leave a review for 3 days free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Free */}
            <div className="rounded-2xl border border-[#D5C9BB] bg-white p-7 flex flex-col">
              <div className="mb-6">
                <h3 className="font-serif text-xl text-[#2C1A0E] mb-3">Free</h3>
                <div className="flex items-end gap-1.5 mb-2">
                  <span className="font-serif text-4xl text-[#2C1A0E]">$0</span>
                  <span className="text-[#9B7B6A] text-sm mb-1.5">forever</span>
                </div>
                <p className="text-sm text-[#6B5344] leading-relaxed">
                  Full account scan, risk scoring, audit report, 5 AI conversions.
                </p>
              </div>
              <ul className="space-y-2.5 flex-1 mb-7">
                {["Full account scan — unlimited","Risk score every script","5 complete AI conversions","Inline comments + diff view","PDF audit report export"].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#6B5344]">
                    <CheckCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <button className="w-full py-2.5 rounded-xl border border-[#D5C9BB] text-[#2C1A0E] text-sm font-medium hover:bg-[#EDE7DE] transition-colors">
                  Start free — no card
                </button>
              </Link>
            </div>

            {/* Pro — highlighted */}
            <div className="rounded-2xl border-2 border-[#2C1A0E] bg-[#2C1A0E] p-7 flex flex-col relative shadow-xl">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-[10px] font-bold tracking-wide uppercase shadow">
                  Most popular
                </span>
              </div>
              <div className="mb-6">
                <h3 className="font-serif text-xl text-[#F7F3EE] mb-3">Pro</h3>
                <div className="flex items-end gap-1.5 mb-1">
                  <span className="font-serif text-4xl text-white">$29</span>
                  <span className="text-[#9B7B6A] text-sm mb-1.5">/ month</span>
                </div>
                <div className="text-xs text-amber-400 mb-3">
                  or <span className="font-semibold">$299 lifetime</span> · pay once, own forever
                </div>
                <p className="text-sm text-[#BEB4AB] leading-relaxed">
                  Unlimited conversions. Full history. Professional exports.
                </p>
              </div>
              <ul className="space-y-2.5 flex-1 mb-7">
                {["Everything in Free","Unlimited script conversions","Full conversion history","ZIP export all converted scripts","Priority conversion queue"].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#D5C9BB]">
                    <CheckCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup?plan=pro">
                <button className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold transition-colors shadow-md">
                  Get Pro
                </button>
              </Link>
            </div>

            {/* Team */}
            <div className="rounded-2xl border border-[#D5C9BB] bg-white p-7 flex flex-col">
              <div className="mb-6">
                <h3 className="font-serif text-xl text-[#2C1A0E] mb-3">Team</h3>
                <div className="flex items-end gap-1.5 mb-2">
                  <span className="font-serif text-4xl text-[#2C1A0E]">$99</span>
                  <span className="text-[#9B7B6A] text-sm mb-1.5">/ month</span>
                </div>
                <p className="text-sm text-[#6B5344] leading-relaxed">
                  For consultants managing multiple client NetSuite accounts.
                </p>
              </div>
              <ul className="space-y-2.5 flex-1 mb-7">
                {["Everything in Pro","Unlimited team seats","Shared conversion history","Bulk export across accounts","Client account management"].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#6B5344]">
                    <CheckCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup?plan=team">
                <button className="w-full py-2.5 rounded-xl border border-[#D5C9BB] text-[#2C1A0E] text-sm font-medium hover:bg-[#EDE7DE] transition-colors">
                  Get Team
                </button>
              </Link>
            </div>
          </div>

          <p className="text-center text-xs text-[#9B7B6A] mt-8">
            Have a promo code? Enter it in Settings after signup.{" "}
            <code className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded text-[11px]">TESTPRO</code>
            {" "}unlocks unlimited conversions instantly.
          </p>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────── */}
      <section className="hairline border-b py-16 px-4 bg-[#EDE7DE]/50">
        <div className="mx-auto max-w-3xl">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { value: "2,400+", label: "Scripts migrated", sub: "and counting" },
              { value: "<15s",   label: "Average conversion", sub: "per script" },
              { value: "92%",    label: "Average confidence", sub: "across all conversions" },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-serif text-4xl sm:text-5xl text-[#2C1A0E] mb-1">{s.value}</div>
                <div className="text-sm text-[#6B5344] font-medium">{s.label}</div>
                <div className="text-xs text-[#9B7B6A]">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────── */}
      <section id="faq" className="py-24 px-4">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12">
            <h2 className="font-serif text-3xl text-[#2C1A0E] mb-2">Common questions</h2>
            <p className="text-[#9B7B6A] text-sm">Straight answers for NetSuite developers.</p>
          </div>
          <div className="space-y-0 divide-y divide-[#EDE7DE]">
            {faqs.map((faq) => (
              <div key={faq.q} className="py-6">
                <h3 className="font-semibold text-[#2C1A0E] mb-2 text-base">{faq.q}</h3>
                <p className="text-sm text-[#6B5344] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────── */}
      <section className="hairline py-24 px-4 bg-[#2C1A0E]">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-4xl sm:text-5xl text-[#F7F3EE] mb-4">
            Install in ninety seconds.
          </h2>
          <p className="text-[#BEB4AB] mb-3 text-lg leading-relaxed">
            See every script that needs migration. Convert five, free.
          </p>
          <p className="text-[#6B5344] text-sm mb-10">
            Local-first. Read-only by default. We never see your code — only the conversion.
          </p>
          <Link href="/signup">
            <button className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-semibold text-base shadow-lg transition-colors">
              <Chrome className="h-5 w-5" />
              Start counting, free
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
          <p className="text-xs text-[#554136] mt-5">
            5 free conversions · No credit card · Any NetSuite environment
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
