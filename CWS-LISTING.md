# Chrome Web Store Listing — SuiteMigrate

## Product

**Name:** SuiteMigrate — SuiteScript 2.1 Migrator  
**Version:** 1.1.3  
**Category:** Developer Tools  
**Website:** https://suitemigrate.vercel.app  
**Privacy policy:** https://suitemigrate.vercel.app/privacy  
**Support:** https://suitemigrate.vercel.app/support

## Single purpose

SuiteMigrate helps NetSuite developers identify active legacy SuiteScript and migrate selected SuiteScript 1.0 / 2.0 scripts to SuiteScript 2.1.

The extension:
1. Scans active script records in the NetSuite tab the user explicitly opens.
2. Shows which scripts are already on 2.1 and which need migration.
3. Retrieves the source file only after the user chooses a script to convert.
4. Sends that selected source to SuiteMigrate for conversion.
5. Shows converted code, change notes, manual-review flags and download actions.

It does not write to NetSuite or automatically deploy converted code.

## Store summary

Scan active NetSuite scripts, identify legacy SuiteScript, and convert selected 1.0/2.0 scripts to SuiteScript 2.1.

## Current features

- Read-only active-script inventory
- SuiteScript version detection
- Version-based migration risk indicator
- Search and filters
- Five free script conversions
- Converted SuiteScript 2.1 output
- Change log and manual-review markers
- Download converted JavaScript
- HTML migration audit report for paid plans
- Local scan/history cache with clear-cache action

Do not advertise batch conversion, ZIP export, PDF export, priority queue, Team collaboration or automatic deployment until those features are implemented end-to-end.

## Permissions

### storage

Stores local extension state such as the signed-in user cache, scanned account metadata, converted-result metadata and privacy-consent state. Original NetSuite source code is not intentionally persisted in Chrome local storage.

### scripting

Runs the packaged SuiteMigrate scan/source-read functions in the active NetSuite tab after explicit user interaction. No remote executable code is loaded.

### activeTab

Grants temporary access to the NetSuite tab the user is actively using. SuiteMigrate does not request persistent access to all NetSuite pages.

### Host permission: https://suitemigrate.vercel.app/*

Required for SuiteMigrate authentication, account status and conversion API calls.

## Data-use disclosure

| Data | Use | Storage |
|---|---|---|
| Account email | Identify signed-in SuiteMigrate account | SuiteMigrate account database |
| Authentication/session | Authenticate SuiteMigrate API calls | Browser/server session mechanisms |
| NetSuite script metadata | Build the migration inventory | Local Chrome storage |
| Selected script source | Perform the user-requested conversion | Transmitted for processing; not retained by SuiteMigrate after processing |
| Converted result | Review and re-download converted code | User's SuiteMigrate account |

The NetSuite session cookie remains in the user's browser and is not sent to SuiteMigrate servers.

## Chrome privacy selections

Do **not** select “Does not collect user data.”

Disclose:
- Personally identifiable information / account email where required by the form
- Authentication information
- Website content (the selected SuiteScript source code)

Purpose:
- App functionality only

No advertising, selling of user data, browsing-history collection, keystroke capture or screen capture.

## Reviewer test instructions

1. Sign in to the supplied SuiteMigrate reviewer account.
2. Open the supplied NetSuite sandbox/test account.
3. Navigate to a normal NetSuite application tab.
4. Open SuiteMigrate.
5. Click **Scan**.
6. Open the list of active scripts.
7. Choose a legacy script with an attached file and click **Convert**.
8. Accept the first-conversion privacy notice.
9. Review the converted result and download the JavaScript file.
10. Confirm that SuiteMigrate never modifies or deploys anything in NetSuite.

Provide working reviewer credentials in the Chrome Web Store test-instructions field. Never place credentials in this repository.

## Before submission

- Build only from the final reviewed branch.
- Upload a draft item first and obtain the stable Chrome extension ID.
- Confirm the production backend allows the stable Store ID `ohdcofhfnjahaoblipdcpflainibhcld` (the code also has this public ID as a fallback).
- Verify authentication/conversion using the exact store package.
- Confirm the production Privacy Policy matches actual backend retention behavior.
- Capture screenshots from the real v1.1.3 build.
- Run `npm run build:store` from `extension/`; the release guard must pass.
