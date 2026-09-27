import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#050d1a]">
      <Navbar />
      <div className="pt-28 pb-24 px-4">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10">
            <p className="text-sm text-emerald-400 font-medium mb-2">Legal</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Privacy Policy</h1>
            <p className="text-slate-400 text-sm">Last updated: September 2026</p>
          </div>

          <div className="prose prose-invert prose-sm max-w-none space-y-8">
            {[
              {
                title: "1. What We Collect",
                content: `We collect information you provide directly when creating an account (name, email address) and information generated through your use of the service (conversion history, account metadata, plan information).

We do NOT collect, store, or transmit your NetSuite credentials, session tokens, or any sensitive authentication data. The Chrome extension operates entirely using your existing browser session and never exposes credential data to our servers.`,
              },
              {
                title: "2. How We Use Your Information",
                content: `We use the information we collect to:
• Provide, operate, and improve the SuiteMigrate service
• Process payments and manage your subscription
• Send transactional emails (account verification, payment receipts)
• Respond to support requests
• Analyze aggregate usage to improve the product

We do not sell your personal information to third parties.`,
              },
              {
                title: "3. Script Code & Conversion Data",
                content: `When you use the conversion feature, script code is sent to our backend API for processing using the Gemini AI model. Script code is processed in-memory and is not permanently stored on our servers after conversion is complete. Converted script results are stored securely in your account for your own retrieval and download.

We do not use your script code to train AI models or share it with third parties beyond the AI processing provider (Google Gemini API).`,
              },
              {
                title: "4. Chrome Extension Permissions",
                content: `The SuiteMigrate Chrome extension requires access to NetSuite domains (*.netsuite.com, *.app.netsuite.com) to:
• Read the current page URL to detect the active NetSuite account
• Make SuiteQL API calls using your active browser session
• Display the extension popup and side panel

The extension does NOT:
• Read or transmit your NetSuite password
• Access any data outside NetSuite domains
• Store any data outside Chrome's local extension storage and our secure backend`,
              },
              {
                title: "5. Data Storage & Security",
                content: `Your data is stored securely using Supabase (PostgreSQL) with encryption at rest and in transit. Payment processing is handled entirely by Razorpay — we never store your payment card details on our servers.

We implement industry-standard security measures including HTTPS encryption, secure authentication tokens, and regular security reviews.`,
              },
              {
                title: "6. Third-Party Services",
                content: `We use the following third-party services:
• Supabase — authentication and database
• Google Gemini API — AI-powered script conversion
• Razorpay — payment processing
• Resend — transactional email delivery

Each service processes only the data necessary to provide their function and is subject to their own privacy policies.`,
              },
              {
                title: "7. Data Retention",
                content: `We retain your account data for as long as your account is active. Conversion history is retained to allow you to re-download converted scripts. You may delete your account at any time from Account Settings, which permanently deletes all your data.`,
              },
              {
                title: "8. Your Rights",
                content: `You have the right to:
• Access your personal data
• Correct inaccurate data
• Delete your account and all associated data
• Export your conversion history
• Opt out of non-transactional communications

To exercise these rights, use the account settings or contact us at privacy@suitemigrate.com.`,
              },
              {
                title: "9. Cookies",
                content: `We use essential cookies to maintain your authentication session. We do not use tracking cookies for advertising. Analytics (if enabled) uses privacy-friendly, cookieless tracking.`,
              },
              {
                title: "10. Changes to This Policy",
                content: `We may update this Privacy Policy from time to time. We will notify you of significant changes by email or through the application. Continued use of the service after changes constitutes acceptance of the updated policy.`,
              },
              {
                title: "11. Contact",
                content: `For privacy-related questions or concerns, contact us at privacy@suitemigrate.com.`,
              },
            ].map((section) => (
              <div key={section.title} className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
                <h2 className="text-base font-semibold text-white mb-3">{section.title}</h2>
                <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-line">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
