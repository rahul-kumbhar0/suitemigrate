# SuiteMigrate — Chrome Web Store Final Review Checklist

Release candidate: **v1.1.4**

Do not submit until every **BLOCKER** item is checked.

## A. Extension functionality — BLOCKER

- [ ] Install the exact CI artifact / store ZIP on a clean Chrome profile.
- [ ] Manifest shows version 1.1.4.
- [ ] Extension opens normally from the toolbar.
- [ ] Sign-up and sign-in work from the extension flow.
- [ ] Returning to the extension after sign-in shows the authenticated account.
- [ ] Open a real NetSuite Sandbox/test account using the reviewer role.
- [ ] Scan succeeds and lists active scripts visible to that role.
- [ ] Search and All / Update / Done filters work.
- [ ] SuiteScript 1.0, 2.0 and 2.x are marked as needing migration; 2.1 is current.
- [ ] A script without an attached file shows “No file” and cannot consume a conversion.
- [ ] A script with an attached File Cabinet source can be read successfully.
- [ ] A source-file 401/403/404 gives a clear NetSuite-specific error.
- [ ] A backend /api/convert 404 gives a clear SuiteMigrate-deployment error.
- [ ] A failed source read does not increment the conversion counter.
- [ ] A successful conversion returns converted code, change log, confidence and manual-review flags.
- [ ] Copy Code works.
- [ ] Download JavaScript works.
- [ ] Migration Readiness Report works for the paid test account and shows blocker/source-access states accurately.
- [ ] Clear scan history/cache works.
- [ ] Sign out and sign back in works.
- [ ] Test with a slow/unreliable network and confirm errors are readable.
- [ ] Test with third-party cookies disabled; if auth fails, do not submit until the auth flow is made reliable.

## B. Production website/backend — BLOCKER

- [ ] Run `supabase/review-ready-security.sql` in the production Supabase project.
- [ ] Confirm users cannot directly change their own `plan`, `conversions_limit`, or `conversions_used`.
- [ ] Confirm original source code is not persisted in `conversions.original_code` after new conversions.
- [ ] Confirm `reserve_conversion_slot_v2` and `release_conversion_slot_v2` exist and work.
- [ ] Confirm Free starts at exactly 5 conversions.
- [ ] Confirm failed conversions release a reserved Free slot.
- [ ] Confirm Promo codes are not publicly enumerable.
- [ ] Confirm seeded test codes are removed from production.
- [ ] Confirm account deletion removes the auth user and cascading SuiteMigrate data.
- [ ] Confirm `/privacy` and `/terms` render successfully in production.
- [ ] Confirm `/api/convert` exists in production and never returns a Vercel/Next.js 404.
- [ ] Confirm `/api/auth/session` and `/api/user` work from the Store extension ID.
- [ ] Configure Upstash rate limiting in production; do not intentionally ship production in fail-open mode.
- [ ] Production accepts Store ID `ohdcofhfnjahaoblipdcpflainibhcld` and the deployed `/api/health` reports release 1.1.4.

## C. Payments — BLOCKER if payments are enabled at submission

- [ ] Razorpay production account is configured.
- [ ] Pro Monthly plan is exactly **$29/month USD** and `RAZORPAY_PLAN_PRO_MONTHLY` points to it.
- [ ] Annual Pro checkout is exactly **$299/year USD**.
- [ ] `RAZORPAY_WEBHOOK_SECRET` is configured.
- [ ] Webhook endpoint is `/api/webhooks/razorpay`.
- [ ] Invalid/missing webhook signatures are rejected.
- [ ] Old/stale low-price payments cannot activate an entitlement.
- [ ] Successful Pro payment activates Pro.
- [ ] Successful Annual Pro payment activates 12 months of Annual Pro.
- [ ] Subscription cancellation/expiry returns the account to Free with 5-conversion limit.
- [ ] Test checkout first in Razorpay test mode, then repeat a production smoke test before launch.

## D. Privacy & Chrome policy — BLOCKER

- [ ] Chrome Web Store single-purpose statement says only: scan NetSuite legacy SuiteScript and convert selected scripts to SuiteScript 2.1.
- [ ] Store listing discloses that selected script source code is transmitted for conversion.
- [ ] Privacy Policy discloses Google Gemini API as the AI processing provider.
- [ ] Privacy Policy explains that original source is not retained in the SuiteMigrate conversion database.
- [ ] Privacy Policy explains that converted results may be stored in the user's account.
- [ ] Extension shows the conversion disclosure before the first source-code transmission.
- [ ] User must affirmatively click Continue before first conversion.
- [ ] Chrome privacy questionnaire declares account/email, authentication information and website content/source code as applicable.
- [ ] Do not select “does not collect user data.”
- [ ] Data use is limited to extension functionality; no ad targeting or sale of user data.
- [ ] Store listing, privacy policy and actual behavior use the same wording and retention model.
- [ ] No remote JavaScript or remote executable code is loaded by the extension.
- [ ] No remote CSS/font imports remain in the extension bundle.
- [ ] Only minimum required permissions remain: `storage`, `scripting`, `activeTab`, and SuiteMigrate backend host access.
- [ ] Permission justifications are filled in accurately in the Store dashboard.

## E. Store listing assets — BLOCKER

- [ ] Final 128×128 icon is the same brand mark used in the extension and website.
- [ ] 16×16, 32×32, 48×48 and 128×128 icons are generated from the same master artwork and remain legible at small size.
- [ ] Store description contains no unsupported Batch, ZIP, PDF, Priority Queue, Team collaboration, automatic deployment or “production-ready” claims.
- [ ] At least one real screenshot clearly shows the working scan flow.
- [ ] At least one real screenshot shows the conversion result.
- [ ] Screenshots come from the exact v1.1.4 release candidate, not mock UI.
- [ ] Promo images match the same logo/colors/UI and do not promise future features.
- [ ] Listing has no placeholder copy, test codes, internal TODOs or owner-confirm text.
- [ ] Support URL/email and Privacy Policy URL work publicly without login.

## F. Reviewer access — BLOCKER

- [ ] Create a dedicated SuiteMigrate reviewer account.
- [ ] Create or provide a restricted NetSuite Sandbox/test role/account the reviewer is authorized to use.
- [ ] Include test scripts: one SuiteScript 1.0, one 2.0/2.x, one 2.1, one no-file example.
- [ ] The reviewer role can run the read-only SuiteQL scan.
- [ ] The reviewer role can open/read the selected test script's File Cabinet source.
- [ ] Put credentials only in the Chrome Web Store reviewer/test-instructions field, never in the repository or public listing.
- [ ] Reviewer instructions are numbered and reproduce the exact Scan → Convert → Review → Download path.
- [ ] Reviewer can exercise the core feature without needing your personal account or production NetSuite instance.

## G. Release package integrity — BLOCKER

- [ ] `npm ci && npm run build:store` succeeds in `extension/`.
- [ ] Website production build succeeds in CI.
- [ ] Store release guard finds no localhost, owner placeholders, test promo codes, stale models or unsupported launch claims.
- [ ] ZIP root contains `manifest.json` directly.
- [ ] No source maps, secrets, test credentials, private keys or `.env` files are present in the uploaded ZIP.
- [ ] Inspect final ZIP manually before upload.
- [ ] Upload the exact tested ZIP to the Chrome Web Store draft.
- [ ] Test the Store/draft-installed build again after the ID/CORS change.

## H. Final go / no-go

Submit only when all of these are true:

- [ ] Real NetSuite Sandbox scan works.
- [ ] Real NetSuite source retrieval works.
- [ ] Real conversion works end-to-end.
- [ ] Website production backend is deployed and healthy.
- [ ] Privacy/Terms/listing match behavior.
- [ ] Reviewer credentials and steps are verified from a clean browser profile.
- [ ] Final v1.1.4 ZIP is the same artifact that passed testing.

If any item above is unchecked, treat the release as **NO-GO** for Chrome Web Store submission.
