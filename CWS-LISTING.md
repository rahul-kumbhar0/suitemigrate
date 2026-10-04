# Chrome Web Store Listing — SuiteMigrate

## (a) Single-Purpose Description

SuiteMigrate has a single purpose: helping NetSuite developers migrate SuiteScript
1.0 / 2.0 / 2.x scripts to SuiteScript 2.1 before Oracle's 2028.2 deadline.

The extension does this by:
1. Reading the user's NetSuite script records via the SuiteQL REST API using
   their existing browser session.
2. Displaying a risk-scored inventory of scripts that need migration.
3. Sending a script the user explicitly selects to the SuiteMigrate backend for
   conversion by an AI service.
4. Displaying the converted code with inline change comments and a confidence score.

No other functionality is present. The extension does not read, modify or transmit
any other data from the user's browser or NetSuite account.

---

## (b) Permission Justifications

### Manifest Permissions

| Permission | Why it is needed |
|------------|-----------------|
| `storage`  | Stores the user's authentication state (session cache) and local conversion history in `chrome.storage.local`. This is required so the popup shows the user's status without a round-trip on every open. |
| `scripting` | Used to inject the SuiteQL scan function directly into the active NetSuite tab. This is the only way to make SuiteQL REST API calls authenticated with the user's existing NetSuite session cookie. The injected function is defined inline in the extension source and does not load remote code. |
| `activeTab` | Required to get the tab ID of the currently open NetSuite page so the `scripting` injection targets the correct tab. No other tabs are accessed. |

### Host Permissions

| Host | Why it is needed |
|------|-----------------|
| `https://*.app.netsuite.com/*` | SuiteQL API calls and script file fetches against the user's NetSuite account. |
| `https://*.netsuite.com/*` | Same — covers both the legacy and current NetSuite URL patterns. |
| `https://*.suitetapp.com/*` | NetSuite sandbox environments use this domain. |
| `https://suitemigrate.vercel.app/*` | The SuiteMigrate backend API (authentication, conversion endpoint). |

---

## (c) Data-Use Disclosure

### Data the extension handles

| Data type | How it is used | Stored? | Shared? |
|-----------|---------------|---------|---------|
| **Account email address** | Identifies the signed-in user. Read from the SuiteMigrate session API. | Yes — in SuiteMigrate database (Supabase). | No. |
| **Authentication / session info** | The user's SuiteMigrate session cookie is sent with API calls to authenticate. The user's NetSuite session cookie is used locally within the browser tab to make SuiteQL calls; it is never transmitted to SuiteMigrate servers. | Session cookie: browser-managed. SuiteMigrate session: server-managed (Supabase). | No. |
| **Website content (script code)** | When the user clicks Convert on a specific script, that script's source code is sent to SuiteMigrate's servers and processed by a third-party AI service for conversion. The converted result is stored in the user's SuiteMigrate account for re-download. | Yes — converted scripts stored in SuiteMigrate database per user account. Original code: TODO (confirm). | Sent to third-party AI service for the conversion only. |
| **Script metadata** | Script name, type, and API version from the SuiteQL scan. Used to display the inventory and risk score. | Stored locally in `chrome.storage.local` (cleared by "Clear history" button). Not sent to SuiteMigrate servers unless a conversion is requested. | No. |

### What is NOT collected

- No browsing history outside NetSuite domains.
- No NetSuite passwords or credential tokens.
- No NetSuite business data (records, transactions, contacts).
- No keyboard input, mouse events or screen captures.

---

## (d) "Does not collect user data" selection

**Do NOT select "Does not collect user data".**

The extension handles:
- User email (account identification)
- Authentication / session information (sign-in)
- Website content: the script code the user explicitly chooses to convert

All three categories must be disclosed in the CWS data-use declaration.

---

## TODO — before submission

- [ ] Replace `EXTENSION_ID` placeholder in `EXTENSION_ID` env var on Vercel once
      the extension is published and a stable ID is assigned.
- [ ] Confirm original script code retention policy (stored or discarded after conversion).
- [ ] Confirm whether the AI provider's paid-tier terms allow "not used for training"
      claim; only add that to the store listing if confirmed.
- [ ] Add the Privacy Policy URL to the store listing:
      `https://suitemigrate.vercel.app/privacy`
- [ ] Ensure Privacy Policy covers the data types above and names the AI subprocessor
      (or states it is available on request).
- [ ] Review manifest `host_permissions` before submission — remove any permission
      that is no longer needed after testing.
