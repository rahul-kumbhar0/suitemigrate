import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

const sections = [
  { title: "1. Acceptance of Terms", content: `By installing the SuiteMigrate Chrome extension, creating an account, or using any part of the SuiteMigrate service, you agree to be bound by these Terms of Service. If you do not agree, do not use the service.` },
  { title: "2. Description of Service", content: `SuiteMigrate is a Chrome browser extension and web application that helps NetSuite developers scan their NetSuite accounts for outdated SuiteScript files and convert them to SuiteScript 2.1. The service uses AI-powered conversion and provides export capabilities for migrated scripts.` },
  { title: "3. Account Registration", content: `You must create an account to use most features. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must provide accurate and complete information during registration.` },
  { title: "4. Free Plan and Paid Plans", content: `The free plan includes active-script scanning, migration inventory, 5 script conversions, conversion review views, and JavaScript downloads. The Migration Readiness Report is a paid-plan feature.\n\nPaid plans:\n— Pro: $29/month — unlimited script conversions and the current Pro feature set\n— Annual Pro: $299/year — the current Pro feature set for 12 months\n\nMonthly and annual purchases are billed in advance. Annual Pro provides 12 months of access from activation. We may change pricing for future purchases.` },
  { title: "5. Refund Policy", content: `Pro and Annual Pro purchases may be eligible for a refund request within 7 days of the initial purchase if the service did not function as described. After that period, monthly subscription charges are non-refundable. You may cancel Pro at any time and access continues until the end of the paid billing period. Contact support@suitemigrate.com for refund requests.` },
  { title: "6. Acceptable Use", content: `You agree not to:\n— Process scripts from accounts you do not have authorization to access\n— Attempt to reverse engineer the AI conversion logic or system prompts\n— Resell or redistribute the service or converted output as your own product\n— Use the service in any way that violates applicable laws\n— Attempt to circumvent usage limits or access controls` },
  { title: "7. Intellectual Property", content: `SuiteMigrate and its original content are owned by the service provider and protected by applicable intellectual property laws.\n\nThe converted script output you generate is yours. You retain all rights to your original script code and the converted output. We claim no ownership over your NetSuite scripts or converted code.` },
  { title: "8. Disclaimer of Warranties", content: `The service is provided "as is" without warranties of any kind. AI-generated code conversions are provided as a starting point and may require manual review. We do not guarantee that converted scripts will be error-free or production-ready without testing. You are responsible for validating converted code before deploying to any NetSuite environment.` },
  { title: "9. Limitation of Liability", content: `To the maximum extent permitted by law, SuiteMigrate shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.\n\nOur total liability shall not exceed the amount you paid for the service in the 12 months preceding the claim.` },
  { title: "10. Termination", content: `We may suspend or terminate your account for violations of these Terms. You may terminate your account at any time from Account Settings. When you delete your account through the supported account-deletion flow, associated SuiteMigrate profile and conversion records are scheduled for deletion as part of that action.` },
  { title: "11. Changes to Terms", content: `We may update these Terms from time to time. We will notify you of material changes via email or in-app notification at least 14 days before they take effect.` },
  { title: "12. Governing Law", content: `These Terms are governed by the laws of India. Any disputes shall be resolved in the courts of the applicable jurisdiction in India.` },
  { title: "13. Contact", content: `For questions about these Terms, contact support@suitemigrate.com.` },
]

export default function TermsPage() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ padding: "112px 24px 96px" }}>
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          <div style={{ marginBottom: 48 }}>
            <p style={{ fontFamily: "var(--f-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: ".18em", color: "var(--ink-mute)", marginBottom: 14 }}>Legal</p>
            <h1 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(32px,5vw,52px)", letterSpacing: "-0.025em", color: "var(--ink)", marginBottom: 10, lineHeight: 1.08 }}>
              Terms of Service
            </h1>
            <p style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--ink-mute)", letterSpacing: ".08em" }}>Last updated: October 2026</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "var(--rule)", border: "1px solid var(--rule)" }}>
            {sections.map(s => (
              <div key={s.title} style={{ background: "var(--paper)", padding: "24px 28px" }}>
                <h2 style={{ fontFamily: "var(--f-head)", fontWeight: 400, fontSize: 17, letterSpacing: "-0.01em", color: "var(--ink)", marginBottom: 10 }}>{s.title}</h2>
                <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.8, whiteSpace: "pre-line" }}>{s.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
