import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#050d1a]">
      <Navbar />
      <div className="pt-28 pb-24 px-4">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10">
            <p className="text-sm text-emerald-400 font-medium mb-2">Legal</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Terms of Service</h1>
            <p className="text-slate-400 text-sm">Last updated: September 2026</p>
          </div>

          <div className="space-y-5">
            {[
              {
                title: "1. Acceptance of Terms",
                content: `By installing the SuiteMigrate Chrome extension, creating an account, or using any part of the SuiteMigrate service, you agree to be bound by these Terms of Service. If you do not agree, do not use the service.`,
              },
              {
                title: "2. Description of Service",
                content: `SuiteMigrate is a Chrome browser extension and web application that helps NetSuite developers scan their NetSuite accounts for outdated SuiteScript files and convert them to SuiteScript 2.1. The service uses AI-powered conversion and provides export capabilities for migrated scripts.`,
              },
              {
                title: "3. Account Registration",
                content: `You must create an account to use most features. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must provide accurate and complete information during registration. You must be at least 18 years old to create an account.`,
              },
              {
                title: "4. Free Trial and Paid Plans",
                content: `The free plan includes 2 script conversions with full pro features. No credit card is required for the free plan.

Paid plans (Pro Monthly, Lifetime, Team Monthly) unlock additional conversions and features as described on the pricing page. Subscription plans are billed in advance on a monthly basis. The Lifetime plan is a one-time payment granting perpetual access to Pro features.

We reserve the right to change pricing with 30 days notice to existing subscribers.`,
              },
              {
                title: "5. Refund Policy",
                content: `Monthly subscriptions: You may cancel at any time. No refunds are issued for the current billing period. Access continues until the period ends.

Lifetime plan: Refunds may be requested within 7 days of purchase if the service did not function as described. Contact support@suitemigrate.com with your order details.

Refunds are not available for abuse of the free trial or violations of these terms.`,
              },
              {
                title: "6. Acceptable Use",
                content: `You agree not to:
• Use the service to process scripts belonging to accounts you do not have authorization to access
• Attempt to reverse engineer, decompile, or extract the AI conversion logic or system prompts
• Resell, sublicense, or redistribute the service or converted output as your own product
• Use the service in any way that violates applicable laws or regulations
• Attempt to circumvent usage limits or access controls
• Use automated means to make excessive API requests`,
              },
              {
                title: "7. Intellectual Property",
                content: `SuiteMigrate and its original content, features, and functionality are owned by the service provider and are protected by applicable intellectual property laws.

The converted script output you generate through the service is yours. You retain all rights to your original script code and the converted output. We claim no ownership over your NetSuite scripts or converted code.`,
              },
              {
                title: "8. Disclaimer of Warranties",
                content: `The service is provided "as is" without warranties of any kind. AI-generated code conversions are provided as a starting point and may require manual review. We do not guarantee that converted scripts will be error-free or production-ready without testing. You are responsible for validating converted code before deploying to any NetSuite environment.`,
              },
              {
                title: "9. Limitation of Liability",
                content: `To the maximum extent permitted by law, SuiteMigrate shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service, including but not limited to loss of data, loss of profits, or damage to your NetSuite environment.

Our total liability shall not exceed the amount you paid for the service in the 12 months preceding the claim.`,
              },
              {
                title: "10. Termination",
                content: `We may suspend or terminate your account for violations of these Terms. You may terminate your account at any time from Account Settings. Upon termination, your right to use the service ceases and your data will be deleted within 30 days.`,
              },
              {
                title: "11. Changes to Terms",
                content: `We may update these Terms from time to time. We will notify you of material changes via email or in-app notification at least 14 days before they take effect. Continued use after that period constitutes acceptance of the new Terms.`,
              },
              {
                title: "12. Governing Law",
                content: `These Terms are governed by the laws of India. Any disputes shall be resolved in the courts of the applicable jurisdiction in India.`,
              },
              {
                title: "13. Contact",
                content: `For questions about these Terms, contact us at support@suitemigrate.com.`,
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
