# SuiteMigrate Chrome Web Store Submission — v1.1.1

## Do not submit an older ZIP

Build a new package from the final reviewed source. Do not reuse the previous v1.0.0 or v1.1.0 ZIP.

## 1. Build

From `extension/`:

```bash
npm ci
npm run build:store
```

The production build guard must fail if release-blocking text such as localhost, owner placeholders, test promo text, stale AI model text or unsupported paid-feature claims appears in the final bundle.

ZIP the **contents of `extension/dist/`**, with `manifest.json` at the ZIP root.

## 2. Create a Chrome Web Store draft first

Upload the package as a draft item. Record the stable extension ID generated for the item.

Set the production backend environment variable:

```
EXTENSION_ID=<chrome-web-store-extension-id>
```

Redeploy the backend before reviewer testing so strict CORS accepts the store extension.

## 3. Listing

Use `CWS-LISTING.md` / `extension/STORE_LISTING.md` as the single source of truth.

Do not claim:
- batch conversion
- ZIP export
- PDF export
- priority queue
- Team collaboration
- automatic deployment
- production-ready converted code

until those capabilities actually exist.

## 4. Privacy

Privacy Policy URL:

https://suitemigrate.vercel.app/privacy

Declare account/email data as applicable, authentication information and website content used for conversion. Do not select “does not collect user data.”

The final backend and policy must agree that selected original source is processed for conversion but not retained by SuiteMigrate after processing; converted output may be retained in the user's account.

## 5. Permission justifications

**storage** — local auth/user cache, scan metadata, conversion cache and consent state.

**scripting** — executes packaged scan/source-read functions inside the user-selected NetSuite tab.

**activeTab** — temporary access to the current NetSuite tab after user interaction.

**https://suitemigrate.vercel.app/** — authentication, account status and conversion API access.

## 6. Final end-to-end test

Use the exact ZIP intended for submission on a clean Chrome profile:

1. Install package.
2. Sign into SuiteMigrate.
3. Open a NetSuite sandbox/test tab.
4. Scan.
5. Confirm active legacy scripts appear.
6. Confirm a script with no file cannot consume a conversion.
7. Convert a script with a readable source file.
8. Confirm privacy notice appears on first conversion.
9. Confirm source-fetch failure stops before calling conversion.
10. Review result and download output.
11. Clear local history/cache.
12. Sign out and back in.
13. Repeat with stricter third-party-cookie settings.

## 7. Reviewer access

Provide Google reviewers with test credentials and exact steps in the Web Store reviewer/test-instructions field. Do not store credentials in source control.

## 8. Submit only when

- v1.1.1 version is consistent
- release guard passes
- production CORS knows the store extension ID
- privacy page matches backend behavior
- no placeholder or unsupported-feature copy remains
- real NetSuite sandbox scan/source fetch has been verified
- screenshots match the actual submitted build
