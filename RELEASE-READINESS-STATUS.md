# SuiteMigrate release readiness — 8 October 2026

Status: **NO-GO for Chrome Web Store submission** until production and live QA gates pass.

## Repository and deployment

PR #5 is merged into main at `1e112467debb27b66ea86ebb0c282e4a439de4ef`.
The production health endpoint already reports release 1.1.4. The PR preview deployment failed on 7 October with Vercel's `api-deployments-free-per-day` limit. GitHub-integrated main updates should trigger a production deployment; inspect the resulting GitHub deployment/check status to verify success.

## Confirmed production blockers

The production smoke test on 8 October returned HTTP 503 from `/api/health`, `readyForConversions: false`, Supabase `Invalid API key`, and unconfigured Upstash. Public homepage/privacy/terms/support/refund pages, unauthenticated API protections, and the Chrome Store origin CORS check passed.

1. Repair Vercel's existing production Supabase configuration: URL, public anon key, and server-only service-role key must belong to the same active production project. Never put keys in GitHub or client bundles.
2. Apply the corrected `supabase/review-ready-security.sql` if security setup is incomplete, then `supabase/fix-conversion-backend-v1.1.4.sql`. Run counter reconciliation during a quiet maintenance window with no conversions in progress; reservations are included in the quota counter while requests run.
3. Configure the existing production Upstash environment variables. Production conversion/promo requests now fail closed without Redis configuration.
4. Redeploy the resulting main commit through the GitHub integration after any environment changes. Code deployment does not execute Supabase SQL or repair Vercel environment variables.
5. Require `npm run smoke:prod` to pass. Health checks both quota RPCs without touching a real account and requires AI/rate-limit configuration. AI key presence is not proof of a successful AI conversion.

## Changes and evidence

- Correct PostgreSQL dollar delimiters and repeatable security policy creation.
- Wrap both migrations in transactions.
- Enforce expired entitlements and the five-conversion Free quota inside the reservation row lock.
- Count persisted conversion rows for history and completed-count displays; reserve-counter accounting remains responsible for available Free slots.
- Keep a successful server conversion visible if the extension's local cache fails.
- Anchor Annual expiry to the original payment timestamp, so verification/webhook retries do not extend a purchase.
- Add `npm run test:quota` and run it in CI. Local PostgreSQL tests verify repeatable migrations, Free sixth-request rejection, failure release, Pro/Annual access, Annual expiry, stale Free limits, history reconciliation, service-role-only RPC privileges, and safe health probes. These tests are not live Supabase, real payment, or NetSuite E2E certification.

## Live QA still required

Follow `PRO-E2E-TEST-CHECKLIST.md` using dedicated test users and a NetSuite Sandbox. Validate Free, Pro, Annual, signed Razorpay Test Mode checkout/webhook retries, cancellation/downgrade, expiry, extension/website count synchronization, and failed conversion quota release.

Protected source remains a migration blocker: no-file, role-restricted, or vendor-hidden files must never be sent as HTML/error pages for conversion or consume quota. Use only an authorized source copy for manual input; do not bypass NetSuite protections. The existing source-access classification and manual-source flow require real Sandbox verification.

For the final Store package, require the exact tested CI extension artifact, real screenshots, verified reviewer accounts/role, consent/privacy consistency, third-party-cookie-disabled authentication, and every blocker in `CHROME-STORE-REVIEW-CHECKLIST.md`. No live NetSuite session, reviewer account, or Razorpay test purchase has been verified in this session. Do not mark these checks complete or submit yet.
