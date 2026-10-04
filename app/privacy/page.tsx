import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

const sections = [
  { title: "1. What We Collect", content: `We collect information you provide directly when creating an account (name, email address) and information generated through your use of the service (conversion history, account metadata, plan information).\n\nWe do NOT collect, store, or transmit your NetSuite credentials, session tokens, or any sensitive authentication data. The Chrome extension operates entirely using your existing browser session and never exposes credential data to our servers.` },
  { title: "2. How We Use Your Information", content: `We use the information we collect to:\n— Provide, operate, and improve the SuiteMigrate service\n— Process payments and manage your subscription\n— Send transactional emails (account verification, payment receipts)\n— Respond to support requests\n\nWe do not sell your personal information to third parties.` },
  { title: "3. Script Code & Conversion Data", content: `When you use the conversion feature, script code is sent to our backend API for processing using the SuiteMigrate AI engine. Script code is processed in-memory and is not permanently stored after conversion is complete. Converted results are stored securely in your account for your own retrieval and download.\n\nWe do not use your script code to train AI models or share it with third parties beyond the AI processing provider used to perform the conversion. ` },
  { title: "4. Chrome Extension Permissions", content: `The SuiteMigrate Chrome extension requires access to NetSuite domains to:\n— Read the current page URL to detect the active account\n— Make SuiteQL API calls using your active browser session\n— Display the extension popup\n\nThe extension does NOT read or transmit your NetSuite password, access data outside NetSuite domains, or store data outside Chrome's local extension storage and our secure backend.` },
  { title: "5. Data Storage & Security", content: `Your data is stored securely using Supabase (PostgreSQL) with encryption at rest and in transit. Payment processing is handled entirely by Razorpay — we never store your payment card details on our servers.\n\nWe implement industry-standard security measures including HTTPS encryption, secure authentication tokens, and regular security reviews.` },
  { title: "6. Third-Party Services", content: `We use the following third-party services:\n— Supabase — authentication and database\n— Third-party AI service — processes submitted script code for conversion (provider name available on request; see legal@suitemigrate.com) \n— Razorpay — payment processing\n— Resend — transactional email delivery` },
  { title: "7. Data Retention", content: `We retain your account data for as long as your account is active. Conversion history is retained to allow you to re-download converted scripts. You may delete your account at any time from Account Settings, which permanently deletes all your data.` },
  { title: "8. Your Rights", content: `You have the right to access your personal data, correct inaccurate data, delete your account and all associated data, export your conversion history, and opt out of non-transactional communications.\n\nTo exercise these rights, use account settings or contact privacy@suitemigrate.com.` },
  { title: "9. Cookies", content: `We use essential cookies to maintain your authentication session. We do not use tracking cookies for advertising.` },
  { title: "10. Changes to This Policy", content: `We may update this Privacy Policy from time to time. We will notify you of significant changes by email or through the application.` },
  { title: "11. Contact", content: `For privacy-related questions, contact privacy@suitemigrate.com.` },
]

export default function PrivacyPage() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ paddingTop: 112, paddingBottom: 96, padding: "112px 24px 96px" }}>
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: 48 }}>
            <p style={{ fontFamily: "var(--f-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: ".18em", color: "var(--ink-mute)", marginBottom: 14 }}>
              Legal
            </p>
            <h1 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(32px,5vw,52px)", letterSpacing: "-0.025em", color: "var(--ink)", marginBottom: 10, lineHeight: 1.08 }}>
              Privacy Policy
            </h1>
            <p style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--ink-mute)", letterSpacing: ".08em" }}>
              Last updated: September 2026
            </p>
          </div>

          {/* Sections */}
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
