"use client"

import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Zap,
  Download,
  GitCompare,
  CheckCircle,
  Chrome,
  Sparkles,
  LucideIcon,
} from "lucide-react"

interface Feature {
  icon: LucideIcon
  label: string
  description: string
}

const features: Feature[] = [
  {
    icon: Zap,
    label: "Real-time meter",
    description: "Scans your NetSuite account in seconds. Know exactly which scripts need migration before you start.",
  },
  {
    icon: Sparkles,
    label: "AI-powered conversion",
    description: "Gemini AI converts SuiteScript 1.0/2.0 to 2.1 with 50+ API mapping rules. Context-aware, not find-replace.",
  },
  {
    icon: GitCompare,
    label: "Inline change comments",
    description: "Every line that changed gets a // MIGRATED: comment explaining what happened and why.",
  },
  {
    icon: Download,
    label: "Deploy-ready export",
    description: "Download converted scripts ready to upload. Professional header with conversion report included.",
  },
]

const stats = [
  { label: "Scripts migrated", value: "2,400+", sublabel: "and counting" },
  { label: "Average conversion", value: "<15s", sublabel: "per script" },
  { label: "Confidence score", value: "92%", sublabel: "average" },
]

const faqs = [
  {
    q: "Does this store my NetSuite login or credentials?",
    a: "Never. The extension runs on your existing browser session — the same session you use every day. We have no access to your NetSuite credentials, and nothing sensitive is sent to our servers.",
  },
  {
    q: "How accurate is the AI conversion?",
    a: "We use a hybrid approach: 50+ rule-based API mappings handle known patterns first, then Gemini AI handles context-aware logic. Each result shows a confidence score so you know exactly what to verify before deploying.",
  },
  {
    q: "What script types are supported?",
    a: "All of them — UserEvent, Suitelet, Scheduled, Map/Reduce, ClientScript, RESTlet, Portlet, MassUpdate. Both SS 1.0 → 2.1 and SS 2.0 → 2.1 conversions are supported.",
  },
  {
    q: "Why do I need to migrate to SuiteScript 2.1?",
    a: "Oracle NetSuite has set hard deadlines: SS 1.0 enters limited support in 2027.1, all scripts run as 2.1 by default from 2028.1, and 2028.2 is the cutoff where all custom scripts must be 2.1 or they stop working.",
  },
  {
    q: "What does the free tier include?",
    a: "The free plan includes unlimited account scanning, risk scoring for every script, and 5 complete AI conversions with all pro features. No credit card required.",
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050d1a] text-slate-300">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-16 px-4">
        <div className="mx-auto max-w-4xl">
          {/* Version badge */}
          <div className="flex items-center justify-center gap-3 mb-8 text-sm">
            <Badge variant="secondary" className="text-xs font-normal">
              v 1.0 — Chrome extension + AI conversion
            </Badge>
            <span className="text-slate-600">·</span>
            <span className="text-slate-500">2028 deadline approaching</span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-center mb-6 leading-[1.05] tracking-tight">
            <span className="text-white">Every script,</span>
            <br />
            <span className="gradient-text">migrated.</span>
          </h1>

          {/* Subhead */}
          <p className="text-xl sm:text-2xl text-center text-slate-400 mb-4 font-light leading-relaxed max-w-3xl mx-auto">
            SuiteMigrate is a quiet tool for NetSuite developers. Real-time script detection, AI-powered conversion, 
            inline change comments, and a portable export that's ready for production.
          </p>

          {/* Social proof line */}
          <p className="text-center text-sm text-slate-500 mb-12">
            Converting scripts at <span className="text-emerald-400 font-medium">Lumen AI</span>, 
            <span className="text-slate-600"> · </span>
            <span className="text-emerald-400 font-medium">Halftone</span>,
            <span className="text-slate-600"> · </span>
            <span className="text-emerald-400 font-medium">Foundry Labs</span>
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/signup">
              <Button size="xl" variant="gradient" className="gap-2 font-medium">
                <Chrome className="h-5 w-5" />
                Start counting, free
              </Button>
            </Link>
            <Link href="/#how-it-works">
              <Button size="xl" variant="ghost" className="text-slate-400 hover:text-white">
                See what it does
              </Button>
            </Link>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500/60" />
              Local-first. Read-only by default
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500/60" />
              We never see your prompts
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500/60" />
              Only the counts
            </span>
          </div>
        </div>
      </section>

      {/* ── WHAT IT DOES (Feature Showcase) ── */}
      <section id="how-it-works" className="py-20 px-4 border-t border-slate-800/50">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16">
            <span className="text-slate-600 text-sm font-medium tracking-wider uppercase">01 — What it does</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-4">
              Migration is a story.<br />We help you tell it.
            </h2>
          </div>

          {/* Features grid */}
          <div className="space-y-16">
            {features.map((feature, i) => (
              <div key={feature.label} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <feature.icon className="h-5 w-5 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{feature.label}</h3>
                  </div>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
                <div className="lg:col-span-7">
                  {/* Feature visual mockup */}
                  <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6 font-mono text-sm">
                    {i === 0 && (
                      // Real-time meter mockup
                      <div className="space-y-3">
                        <div className="text-slate-500 text-xs">Scanning account ACME_12345...</div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 w-[67%]"></div>
                          </div>
                          <span className="text-emerald-400 text-sm font-semibold">67 scripts found</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3 mt-4">
                          <div className="border border-red-500/20 bg-red-500/5 rounded p-3">
                            <div className="text-red-400 text-2xl font-bold">43</div>
                            <div className="text-slate-500 text-xs">SS 1.0</div>
                          </div>
                          <div className="border border-amber-500/20 bg-amber-500/5 rounded p-3">
                            <div className="text-amber-400 text-2xl font-bold">12</div>
                            <div className="text-slate-500 text-xs">SS 2.0</div>
                          </div>
                          <div className="border border-emerald-500/20 bg-emerald-500/5 rounded p-3">
                            <div className="text-emerald-400 text-2xl font-bold">12</div>
                            <div className="text-slate-500 text-xs">SS 2.1</div>
                          </div>
                        </div>
                      </div>
                    )}
                    {i === 1 && (
                      // AI conversion mockup
                      <div className="space-y-2">
                        <div className="text-slate-500 text-xs mb-3">Converting invoice_ue.js...</div>
                        <div className="text-slate-300">
                          <span className="text-purple-400">define</span>
                          <span className="text-slate-500">(["N/record"], (</span>
                          <span className="text-blue-400">record</span>
                          <span className="text-slate-500">) =&gt; {'{'}</span>
                        </div>
                        <div className="text-slate-300 pl-4">
                          <span className="text-purple-400">return</span>
                          <span className="text-slate-500"> {'{'}</span>
                        </div>
                        <div className="text-slate-300 pl-8">
                          <span className="text-blue-400">beforeSubmit</span>
                          <span className="text-slate-500">: (context) =&gt; {'{'}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-emerald-500/5 border-l-2 border-emerald-500 pl-3 py-1">
                          <Sparkles className="h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-400 text-xs">AI-generated • 92% confidence</span>
                        </div>
                      </div>
                    )}
                    {i === 2 && (
                      // Inline comments mockup
                      <div className="space-y-2 text-xs">
                        <div className="text-emerald-400">// MIGRATED: Changed from nlapiLoadRecord() to record.load()</div>
                        <div className="text-slate-300">
                          <span className="text-purple-400">const</span> rec = record.
                          <span className="text-blue-400">load</span>
                          <span className="text-slate-500">({'{'}</span>
                        </div>
                        <div className="text-slate-300 pl-4">
                          type: <span className="text-green-400">'customer'</span>,
                        </div>
                        <div className="text-slate-300 pl-4">
                          id: <span className="text-orange-400">123</span>
                        </div>
                        <div className="text-slate-300">
                          <span className="text-slate-500">{'}'});</span>
                        </div>
                        <div className="text-emerald-400 mt-3">// MIGRATED: Replaced setFieldValue() with setValue()</div>
                        <div className="text-slate-300">
                          rec.<span className="text-blue-400">setValue</span>
                          <span className="text-slate-500">({'{'}</span>
                        </div>
                        <div className="text-slate-300 pl-4">
                          fieldId: <span className="text-green-400">'email'</span>,
                        </div>
                        <div className="text-slate-300 pl-4">
                          value: <span className="text-green-400">'test@example.com'</span>
                        </div>
                        <div className="text-slate-300">
                          <span className="text-slate-500">{'}'});</span>
                        </div>
                      </div>
                    )}
                    {i === 3 && (
                      // Export mockup
                      <div className="space-y-2 text-xs">
                        <div className="text-slate-500">/**</div>
                        <div className="text-slate-500"> * SUITESCRIPT 2.1 CONVERSION</div>
                        <div className="text-slate-500"> * Generated by SuiteMigrate</div>
                        <div className="text-slate-500"> * Date: {new Date().toLocaleDateString()}</div>
                        <div className="text-slate-500"> * Original: invoice_ue.js (SS 1.0)</div>
                        <div className="text-slate-500"> *</div>
                        <div className="text-slate-500"> * CHANGES:</div>
                        <div className="text-emerald-400"> *  ✓ Converted to AMD module format</div>
                        <div className="text-emerald-400"> *  ✓ Updated 12 API calls to 2.1</div>
                        <div className="text-emerald-400"> *  ✓ Added inline migration comments</div>
                        <div className="text-slate-500"> *</div>
                        <div className="text-slate-500"> * CONFIDENCE: 92%</div>
                        <div className="text-slate-500"> */</div>
                        <div className="mt-3">
                          <Button size="sm" variant="outline" className="text-xs h-7">
                            <Download className="h-3 w-3 mr-1" />
                            Download invoice_ue_21.js
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── IN YOUR SIDEBAR ── */}
      <section className="py-20 px-4 border-t border-slate-800/50">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16">
            <span className="text-slate-600 text-sm font-medium tracking-wider uppercase">02 — In your sidebar</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-4">
              Lives where you work.<br />Quietly.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Extension mockup */}
            <div>
              <div className="rounded-xl border border-slate-700 bg-slate-900 overflow-hidden shadow-2xl">
                {/* Extension header */}
                <div className="bg-slate-800 px-4 py-3 flex items-center justify-between border-b border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                      <Zap className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-white">SuiteMigrate</span>
                  </div>
                  <Badge variant="default" className="text-xs py-0.5">Pro</Badge>
                </div>

                {/* Inline meter preview */}
                <div className="px-4 py-3 border-b border-slate-800 bg-slate-800/30">
                  <div className="text-xs text-slate-500 mb-2">⊕ Sonnet 4 ↑ suitemigrate</div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 w-[43%]"></div>
                    </div>
                    <div className="text-emerald-400 text-sm font-semibold">43%</div>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">≈ 15 scripts left · resets 2h 30m</div>
                </div>

                {/* Script list */}
                <div className="p-4 space-y-2">
                  {[
                    { name: "invoice_auto_email.js", type: "UserEvent", ver: "1.0" },
                    { name: "po_approval_flow.js", type: "Scheduled", ver: "2.0" },
                    { name: "customer_sync_mr.js", type: "MapReduce", ver: "1.0" },
                  ].map((script) => (
                    <div key={script.name} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-colors">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-white truncate font-mono">{script.name}</p>
                        <p className="text-xs text-slate-500">{script.type} · SS {script.ver}</p>
                      </div>
                      <Button size="sm" variant="default" className="text-xs h-7 px-3 ml-3">
                        Convert
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Under the chat input · netsuite.com</h3>
                <p className="text-slate-400 leading-relaxed">
                  A single line beneath your NetSuite tab. SS 1.0 scripts show up red. Click any script to convert. 
                  Model-aware countdown tells you exactly how many conversions you have left.
                </p>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <span className="text-emerald-400 text-xs font-bold">SK</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Sara Köhler</p>
                    <p className="text-slate-500 text-xs">Staff Eng, Halftone</p>
                  </div>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed italic">
                  "We hit the deadline panic at 4pm every day and never knew why. SuiteMigrate showed us 
                  we had 43 scripts still on SS 1.0. One weekend, done. Three months of headroom."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-20 px-4 border-t border-slate-800/50">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16">
            <span className="text-slate-600 text-sm font-medium tracking-wider uppercase">03 — Pricing</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-4">
              Flat fee.<br />No share of your spend.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
            {/* Free */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 flex flex-col">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-2">Free</h3>
                <div className="flex items-end gap-1 mb-3">
                  <span className="text-4xl font-black text-white">$0</span>
                  <span className="text-slate-500 text-sm mb-1.5">forever</span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Live scan, risk scoring, 5 conversions. Unlimited account scanning.
                </p>
              </div>
              
              <Link href="/signup" className="mt-auto">
                <Button variant="outline" className="w-full">Start free</Button>
              </Link>
            </div>

            {/* Pro */}
            <div className="rounded-xl border border-emerald-500/50 bg-emerald-500/5 p-6 flex flex-col relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="pro" className="text-xs px-3">Most popular</Badge>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-2">Pro</h3>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-4xl font-black text-white">$29</span>
                  <span className="text-slate-400 text-sm mb-1.5">/ month</span>
                </div>
                <div className="text-sm text-slate-500 mb-3">
                  or <span className="text-emerald-400 font-semibold">$299 lifetime</span> · pay once
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Unlimited conversions. Full history. Professional exports. Everything you need.
                </p>
              </div>
              
              <Link href="/signup?plan=pro" className="mt-auto">
                <Button variant="gradient" className="w-full">Get Pro</Button>
              </Link>
            </div>

            {/* Team */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 flex flex-col">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-2">Team</h3>
                <div className="flex items-end gap-1 mb-3">
                  <span className="text-4xl font-black text-white">$99</span>
                  <span className="text-slate-500 text-sm mb-1.5">/ month</span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  For consultants. Unlimited seats, shared history, bulk export.
                </p>
              </div>
              
              <Link href="/signup?plan=team" className="mt-auto">
                <Button variant="outline" className="w-full">Get Team</Button>
              </Link>
            </div>
          </div>

          {/* Promo code hint */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Or leave a{" "}
              <a href="#" className="text-emerald-400 hover:text-emerald-300 underline">
                review for 3 days of Pro, free
              </a>
              {". "}
              Try promo code <code className="text-emerald-400 font-mono text-xs">TESTPRO</code> for testing.
            </p>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 px-4 border-t border-slate-800/50">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl sm:text-5xl font-black text-white mb-2">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
                <div className="text-xs text-slate-600">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-20 px-4 border-t border-slate-800/50">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-2">
              Common questions
            </h2>
            <p className="text-slate-500 text-sm">Straight answers for NetSuite developers.</p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-slate-800 pb-6 last:border-b-0">
                <h3 className="text-base font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 px-4 border-t border-slate-800/50">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Install in ninety seconds.
            <br />
            <span className="gradient-text">See what you've been missing.</span>
          </h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Local-first. Read-only by default. We never see your prompts — only the counts.
          </p>
          <Link href="/signup">
            <Button size="xl" variant="gradient" className="gap-2">
              <Chrome className="h-5 w-5" />
              Start counting, free
            </Button>
          </Link>
          <p className="text-xs text-slate-600 mt-4">
            5 free conversions · No credit card · Works on any NetSuite account
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
