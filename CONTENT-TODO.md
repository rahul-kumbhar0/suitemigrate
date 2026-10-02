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
