# SuiteMigrate Pro / Annual Pro End-to-End QA

Use a dedicated test user and a NetSuite Sandbox/test account. Do not use a production client account for destructive or payment QA.

## 1. Production backend readiness

- Deploy the same commit being tested.
- Run `supabase/fix-conversion-backend-v1.1.4.sql` in the matching Supabase project.
- Open `/api/health`.
- Confirm:
  - release = `1.1.4`
  - status = `ok`
  - readyForConversions = `true`
  - quotaRpc = `ok`
  - ai = `configured`
- Run `npm run smoke:prod`.

## 2. Free-plan conversion accounting

Use a new Free test account.

- Extension shows `0 / 5 free conversions used`.
- Convert one readable legacy script successfully.
- Confirm extension immediately changes to `1 / 5 free conversions used`.
- Open website → Conversion History.
- Confirm the new conversion appears without a hard browser refresh (use the page Refresh button if already open).
- Confirm website total says 1 converted.
- Confirm Supabase:
  - one conversion row exists
  - users.conversions_used = 1
  - original_code is NULL
- Trigger a source-access failure/protected-source flow.
- Confirm conversions_used does NOT increase.
- Trigger an AI/backend failure if safely possible.
- Confirm conversions_used is released back to its prior value.
- Complete 5 successful conversions.
- Confirm the 6th conversion routes to Upgrade.

## 3. Pro feature test without real payment

For feature QA only, use a dedicated test user and update that user from the Supabase admin/SQL console:

```sql
UPDATE public.users
SET plan = 'pro',
    conversions_limit = NULL,
    entitlement_expires_at = NULL
WHERE email = 'YOUR_TEST_EMAIL';
```

Then sign out/in or refocus the extension.

Confirm:
- extension displays Pro and the completed-conversion count
- no 5-conversion block
- Migration Readiness Report is unlocked
- successful conversions continue incrementing conversions_used
- website Conversion History refreshes correctly
- converted JS download works
- Code / Changes / Inline tabs work
- manual-review flags render
- protected/missing/role-restricted source remains a blocker and is not charged

Reset after feature QA:

```sql
UPDATE public.users
SET plan = 'free',
    conversions_limit = 5,
    entitlement_expires_at = NULL
WHERE email = 'YOUR_TEST_EMAIL';
```

## 4. Monthly Pro payment QA

Use Razorpay Test Mode in a staging/preview environment with test keys and a test monthly plan ID. Do not swap production payment keys just for QA.

Confirm:
- checkout opens
- amount/currency match the configured Pro plan
- successful test payment verifies server-side
- user plan becomes `pro`
- extension reflects Pro after refocus/re-auth
- payment row is stored once (no duplicate on webhook retry)
- webhook signature verification passes
- cancelled/expired subscription returns the user to Free
- conversions_limit returns to 5 after downgrade

## 5. Annual Pro payment QA

In Razorpay Test Mode:

- choose Annual Pro
- verify order amount = $299 equivalent in configured currency handling
- successful verification sets:
  - plan = `annual`
  - conversions_limit = NULL
  - entitlement_expires_at ≈ 365 days after activation
- extension displays Annual Pro
- Migration Readiness Report is unlocked
- simulate expiry on the dedicated test user, then call /api/user or /api/auth/session
- confirm the account returns to Free with limit 5

## 6. Migration Readiness Report QA

Use a scan containing:
- readable legacy script
- 2.1 script
- no-file script
- role-restricted script if available
- protected/vendor-hidden script if available
- manually supplied authorized source

Confirm the report shows:
- active script total
- need-migration total
- ready-to-work total
- blocker total
- source access per script
- correct recommended action
- readable/print-friendly layout
- escaped script/account text (no broken HTML)

## 7. Chrome reviewer flow

From the exact release ZIP:

- install the extension
- sign in
- scan NetSuite Sandbox
- open legacy script
- convert
- review result
- download JS
- open Migration Readiness Report
- test one blocker
- verify no NetSuite data was written/changed

Only submit the Store draft after all sections above pass.
