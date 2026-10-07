import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

export default function RefundPage() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <Navbar />
      <main style={{ padding: "112px 24px 96px" }}>
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--f-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: ".18em", color: "var(--ink-mute)", marginBottom: 14 }}>Legal</p>
          <h1 style={{ fontFamily: "var(--f-head)", fontWeight: 300, fontSize: "clamp(34px,5vw,54px)", letterSpacing: "-0.025em", color: "var(--ink)", marginBottom: 12 }}>Refund Policy</h1>
          <p style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--ink-mute)", marginBottom: 34 }}>Last updated: October 2026</p>

          <div style={{ border: "1px solid var(--rule)", background: "var(--paper)" }}>
            <div style={{ padding: "24px 28px", borderBottom: "1px solid var(--rule)" }}>
              <h2 style={{ fontFamily: "var(--f-head)", fontWeight: 400, fontSize: 18, marginBottom: 10 }}>Initial purchase refund window</h2>
              <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.8 }}>
                Pro and Annual Pro purchases may be eligible for a refund request within 7 days of the initial purchase if SuiteMigrate did not function as described. Requests are reviewed against account and payment records.
              </p>
            </div>
            <div style={{ padding: "24px 28px", borderBottom: "1px solid var(--rule)" }}>
              <h2 style={{ fontFamily: "var(--f-head)", fontWeight: 400, fontSize: 18, marginBottom: 10 }}>Monthly subscriptions</h2>
              <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.8 }}>
                After the initial refund window, monthly subscription charges are non-refundable. You may cancel Pro at any time and retain access through the end of the paid billing period.
              </p>
            </div>
            <div style={{ padding: "24px 28px" }}>
              <h2 style={{ fontFamily: "var(--f-head)", fontWeight: 400, fontSize: 18, marginBottom: 10 }}>How to request a refund</h2>
              <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.8 }}>
                Contact support@suitemigrate.com from the email address associated with your SuiteMigrate account and include the payment date and reason for the request. Do not send card numbers or NetSuite credentials.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
