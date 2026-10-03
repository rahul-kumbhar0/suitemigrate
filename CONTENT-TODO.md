# SuiteMigrate — Owner Action Items
## Part 1 content update · [DATE TBD]

This file lists every item marked **[OWNER TO CONFIRM]** in the codebase.
Complete these before the public launch or Part 2 goes live.

---

## SECURITY

### S-1 · Promo code single-use enforcement
**File:** `app/api/promo/redeem/route.ts`
**Priority:** HIGH — do before any paid campaign

The promo redemption API now validates codes from the database only (no
codes in source code). The next step is preventing re-use:

- [ ] Add a `promo_redemptions` table (or `used_by` JSONB column on
  `promo_codes`) to track who has redeemed each code.
- [ ] On redemption, reject if the code has already been used by this user
  (or globally, for single-use codes).
- [ ] Set `expires_at` on every code row in the database — do not leave
  codes open-ended.
- [ ] Run the migration in `supabase/schema.sql` (promo_codes table) if
  not already done.

### S-2 · Client-side paywall bypass audit
**Priority:** HIGH — do before any paid launch

Review the codebase for any logic that could bypass billing checks without
a server-side validation:

- [ ] Search for `localStorage` reads that set plan/unlimited flags.
- [ ] Search for URL param reads (`?plan=`, `?unlock=`, etc.) that affect
  feature gating.
- [ ] Confirm that all conversion limit checks hit the `/api/user` or
  `/api/convert` server endpoint, not client-side state alone.
- [ ] Confirm the Chrome extension's `conversionsUsed` counter is
  reconciled with the server on every session start.

### S-3 · Rotate any exposed promo codes
**Priority:** HIGH

TESTPRO, FOUNDER2026, PRO30, and BETA100 were previously visible in
source code and are therefore compromised. If any of these codes still
exist as active rows in the `promo_codes` database table:

- [ ] Set `active = false` on all four codes immediately.
- [ ] Issue new codes only via the database — never in source code.

---

## CONTENT

### C-1 · Confirm 2028.2 exact release date
**File:** `app/(landing)/page.tsx` — `CONFIRMED_2028_2_DATE` constant
**Priority:** HIGH — affects hero eyebrow and deadline countdown

The exact calendar date of the NetSuite 2028.2 release is not yet
confirmed. Until it is:

- The countdown label shows "Releases until 2028.2" instead of a day count.
- [ ] When Oracle publishes the 2028.2 release date, set
  `CONFIRMED_2028_2_DATE` to that date string (e.g. `"2028-10-01"`) and
  the dynamic countdown will activate automatically.

### C-2 · Verify SuiteAnswers article 1047412 wording
**File:** `app/(landing)/page.tsx` — deadline source line
**Priority:** HIGH — legal accuracy

The source line currently reads:

> "Source: Oracle NetSuite SuiteAnswers article 1047412 — SuiteScript 2.1
> Required for All Custom Scripts in NetSuite 2028.2"

- [ ] Open SuiteAnswers article 1047412 and confirm:
  - The article number is correct.
  - The article title matches the quoted wording exactly.
  - The article is publicly accessible (or note if login is required).
- [ ] If the wording differs, update the source line in the landing page.

### C-3 · Confirm extension permissions (How It Works, Step 1)
**File:** `app/(landing)/page.tsx` — How it works, step 01
**Priority:** MEDIUM — affects accuracy of product description

Step 1 currently says:

> "SuiteMigrate reads your script records and deployment records using the
> SuiteQL REST API. It does not create, modify, or delete any data in your
> account. [OWNER TO CONFIRM exact permissions required]"

- [ ] Confirm the exact Chrome extension host permissions required
  (currently: `*.netsuite.com`, `*.app.netsuite.com`, `*.suitetapp.com`).
- [ ] Confirm whether a NetSuite Administrator role is required for a full
  scan, or whether lesser roles can scan a subset.
- [ ] Update the step text with the confirmed permissions statement.
- [ ] Update `extension/manifest.json` host_permissions if needed.

### C-4 · Company description for social proof section
**File:** `app/(landing)/page.tsx` — social proof placeholder
**Priority:** MEDIUM — improves credibility before launch

The social proof section currently shows:

> "Built by NetSuite developers who migrate scripts for clients."
> "[OWNER TO CONFIRM] Add verified company description here"

- [ ] Replace with one or two sentences describing who built SuiteMigrate
  (company name, background, or relevant NetSuite experience).
- [ ] When real customer testimonials are available, add up to 3 quotes
  in the commented slot in the code. Each quote needs:
  - Full name
  - Job title
  - Company name
  - Written consent to publish
  - The quote text (verbatim or approved paraphrase)

### C-5 · Real customer statistics (currently removed)
**File:** `app/(landing)/page.tsx` — stats section removed in Part 1
**Priority:** LOW — Part 2 scope

The stats section (scripts migrated, average conversion time, average
confidence score) was removed because the previous values were
unverified. When real data is available:

- [ ] Source the numbers from actual production usage data.
- [ ] Confirm the methodology (e.g. "conversions processed since [date]").
- [ ] Re-add the stats section in Part 2 with verified values only.

---

## LEGAL / COMPLIANCE

### L-1 · Privacy policy — data handling accuracy
**File:** `app/privacy/page.tsx`
**Priority:** MEDIUM

Now that the "scripts never leave your machine" and "local-first" claims
have been removed from the landing page, review the privacy policy to
ensure it accurately describes:

- [ ] Where converted script code is processed (server-side via Gemini API).
- [ ] How long script code is retained after a conversion.
- [ ] Whether script code is logged or stored in any intermediate system.
- [ ] Update sections 3 and 4 of the privacy policy accordingly.

### L-2 · Terms of service — plan pricing accuracy
**File:** `app/terms/page.tsx`
**Priority:** LOW

- [ ] Confirm the pricing listed in the Terms ($29/mo, $299 lifetime,
  $99/mo Team) matches the live Razorpay checkout prices exactly.
- [ ] Add a clause covering what happens to Lifetime plan holders if the
  service is discontinued.

---

## PART 2 SCOPE (not in this update)

The following items are deferred to Part 2:

- Pricing section copy update (comparison table, trust badges, payment
  method list, refund policy link)
- FAQ additions / removals based on actual support questions
- Footer update (links, legal notices)
- Backend gating audit (conversion limits server enforcement)
- Chrome Web Store listing update to match new landing page copy

---

*Generated by the Part 1 content update. Last updated: see git log.*

---

## PART 2 ADDITIONS (pricing, comparison, data handling, FAQ, footer, backend)

### P-1 · Confirm Pro plan pricing and Migration Pass
**File:** `app/(landing)/page.tsx` — pricing section, Pro card
**Priority:** HIGH — blocks launch

- [ ] Confirm monthly price for Pro (currently $29/mo — verify in Razorpay)
- [ ] Define "Migration Pass": one-time payment, fixed period or script pack count, price
- [ ] Set the refund guarantee period: 7 days or 14 days (currently shown as "[7/14]-day")
- [ ] Update the Pro card copy once prices are confirmed

### P-2 · Confirm Team plan pricing
**File:** `app/(landing)/page.tsx` — pricing section, Team card
**Priority:** HIGH

- [ ] Confirm monthly price for Team (currently $99/mo — verify in Razorpay)
- [ ] Confirm what "multiple seats" means: unlimited or a cap (e.g. up to 5)
- [ ] Confirm whether client-branded PDF reports are already implemented

### P-3 · Bring-your-own-API-key / redaction option
**File:** `app/(landing)/page.tsx` — code comment in Security section
**Priority:** LOW — post-launch

- [ ] Decide whether to offer a BYOK (Bring Your Own API Key) mode for
  NDA-bound consultants who cannot send client code to a shared AI provider
- [ ] If yes, add a Gemini API key field to dashboard Settings and pass it
  through to the /api/convert route
- [ ] If no, add a redaction option that strips identifiers before conversion

### P-4 · Confirm AI provider data handling
**File:** `app/(landing)/page.tsx` — data-handling note in hero + Security section
**Priority:** HIGH — legal accuracy

The data-handling note currently shows:
  "[OWNER TO CONFIRM: stored after conversion yes/no · used for model training yes/no]"

- [ ] Check the Gemini API terms of service for the current API key tier
- [ ] Confirm whether input prompts are retained by Google
- [ ] Confirm whether input prompts are used to improve Gemini models
- [ ] Update both the hero data-handling note and the Security & privacy section

### P-5 · Savings line figures
**File:** `app/(landing)/page.tsx` — savings line under pricing cards
**Priority:** MEDIUM

Currently shows: "Manual migration: about 1 day per script. 43 scripts = 43 days."
- [ ] Confirm "1 day per script" against real customer time estimates
- [ ] Confirm "under an hour" for scan + convert against real usage data

### P-6 · Refund policy page
**File:** `components/landing/footer.tsx` — Refund Policy link points to /refund
**Priority:** HIGH — link is live but page may not exist

- [ ] Verify /refund page exists and is accessible
- [ ] If not, create it (see /privacy and /terms as templates)
- [ ] Refund period must match the "[7/14]-day guarantee" shown on the Pro card

### P-7 · Support email
**File:** `components/landing/footer.tsx`
**Priority:** MEDIUM

Currently shows: support@suitemigrate.com
- [ ] Confirm this email is monitored
- [ ] Set up email forwarding or inbox for this address

### P-8 · Currency and tax disclosure
**File:** `app/(landing)/page.tsx` — small print under pricing
**Priority:** HIGH — required before charging customers

Currently shows: "Prices in USD · Tax not included · [OWNER TO CONFIRM]"
- [ ] Confirm currency (USD or INR for Razorpay)
- [ ] Confirm whether prices shown include or exclude GST/VAT
- [ ] Update the small print line with confirmed values

### P-9 · Lifetime deal visibility and expiry
**File:** `app/(landing)/page.tsx` — early-adopter footnote under pricing
**Priority:** MEDIUM

Currently shows: "Limited availability or end date: [OWNER TO CONFIRM]"
- [ ] Decide whether the lifetime deal has a hard end date or a unit limit
- [ ] Set the price: [OWNER TO CONFIRM]
- [ ] If promoting it actively, consider making it a full card temporarily

---

## EXTENSION TODOS (from 8-item extension fix)

### E-1 · Confirm SuiteQL file fetch endpoint
**File:** `extension/src/lib/suiteql.ts` — fetchScriptCode function
**Priority:** HIGH — needed for script code fetch to work

The fixed implementation tries `/core/media/media.nl?id=<fileId>` first
then falls back to `/services/rest/platform/v1/record/file/<fileId>`.
- [ ] Test against a real NetSuite account to confirm the media.nl endpoint works
- [ ] Verify the scriptfile column returns a usable file ID for all script types
- [ ] Confirm the file content field name in the REST response

### E-2 · Confirm extension permissions for non-admin roles
**File:** `extension/src/popup/pages/DashboardView.tsx` — scan handler
**Priority:** MEDIUM

- [ ] Test the SuiteQL scan with a non-Administrator NetSuite role
- [ ] Document the minimum role required for a full scan
- [ ] If a limited role is used, document which modules return "Unavailable"

### E-3 · AI provider name in privacy notice
**File:** `extension/src/popup/pages/ScriptListView.tsx` — consent banner
**Priority:** HIGH — show before first conversion

The consent banner currently says "Google Gemini AI".
- [ ] Confirm this is still the provider being used
- [ ] Update if a different or additional AI provider is added later

### E-4 · Confirm behaviour-difference rule list
**File:** `lib/plans.ts` — BEHAVIOUR_DIFFERENCE_RULES array
**Priority:** HIGH — rules are stubs only

- [ ] Review Oracle's SuiteAnswers documentation for documented 2.1 behaviour
  differences (decimal, date, RESTlet, etc.)
- [ ] Replace the three placeholder rules with the confirmed list
- [ ] Add the behaviour-difference flag display to the scan results UI
