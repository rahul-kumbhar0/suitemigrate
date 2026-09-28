# Chrome Web Store Listing - SuiteMigrate

## Basic Information

**Name:** SuiteMigrate — SuiteScript 2.1 Migrator

**Short Name:** SuiteMigrate

**Version:** 1.0.0

**Category:** Developer Tools

**Language:** English (United States)

## Short Description (132 characters max)
Automatically migrate NetSuite SuiteScript 1.0/2.0 to 2.1 with AI. Detect scripts, convert code, and download with inline comments.

## Detailed Description

### Overview
SuiteMigrate automates the migration of NetSuite SuiteScript 1.0 and 2.0 to SuiteScript 2.1, helping you meet Oracle's January 2028 end-of-support deadline. Our AI-powered conversion engine handles the heavy lifting while you maintain full control over your code.

### Key Features
✨ **Automatic Script Detection** - Scans your NetSuite account and identifies all SuiteScript 1.0 scripts that need migration

🤖 **AI-Powered Conversion** - Converts your scripts to SuiteScript 2.1 format with 50+ API mapping rules and intelligent code restructuring

📝 **Inline Change Comments** - Every modification is documented with `// MIGRATED:` comments explaining what changed and why

📊 **Three-View Display** - Review conversions with:
- **Code View:** Clean converted code
- **Changes View:** Side-by-side comparison
- **Inline View:** Highlighted comments showing every change

⬇️ **Professional Downloads** - Get production-ready files with conversion reports, change summaries, and testing checklists

🔐 **Secure Authentication** - Seamless sync with your SuiteMigrate account using cookie-based authentication

🎯 **Batch Processing** - Select multiple scripts and migrate them all at once

### How It Works
1. **Install Extension** - Add SuiteMigrate to your Chrome browser
2. **Login to NetSuite** - Navigate to your NetSuite account as usual
3. **Scan Scripts** - Click the extension icon to detect all SuiteScript 1.0 scripts
4. **Select & Convert** - Choose scripts to migrate and let AI handle the conversion
5. **Review & Download** - Examine the changes with inline comments and download when ready
6. **Deploy with Confidence** - Use the included testing checklist to validate your migrated scripts

### What Gets Converted
- **Function Signatures:** `function scheduled(type)` → `define(['N/...'], (modules) => {...})`
- **API Calls:** `nlapiLoadRecord()` → `record.load()`
- **Search Objects:** `nlobjSearchFilter` → `search.createFilter()`
- **Error Handling:** `nlapiCreateError()` → Custom error classes
- **Module Structure:** Converts to AMD module format with proper dependencies
- **All 50+ API Mappings:** Complete transformation to SuiteScript 2.1 standards

### Conversion Quality
- **Structural Changes:** Converts entire script with proper AMD modules, not just API calls
- **Type Safety:** Adds JSDoc comments for better IntelliSense
- **Best Practices:** Follows Oracle's official migration guidelines
- **Confidence Scoring:** Each conversion includes a quality assessment
- **Validation:** Automatic checks for syntax errors and common issues

### Privacy & Security
- No scripts are stored or shared without your permission
- Cookie-based authentication - no credentials stored in extension
- All conversions happen securely through HTTPS
- Full privacy policy: https://suitemigrate.vercel.app/privacy

### Pricing
- **Free Tier:** 5 conversions per month
- **Pro Plan:** Unlimited conversions
- **Testing:** Use promo code `TESTPRO` for unlimited access during beta

### Support
- Website: https://suitemigrate.vercel.app
- Documentation: https://suitemigrate.vercel.app/docs
- Privacy Policy: https://suitemigrate.vercel.app/privacy
- Terms of Service: https://suitemigrate.vercel.app/terms

### Requirements
- Active NetSuite account
- Free SuiteMigrate account (sign up at https://suitemigrate.vercel.app)
- Chrome browser

### Why SuiteMigrate?
Oracle NetSuite will end support for SuiteScript 1.0 in January 2028. Manual migration of thousands of lines of code is time-consuming and error-prone. SuiteMigrate:
- **Saves Time:** Convert scripts in seconds instead of hours
- **Reduces Errors:** AI handles syntax and API changes consistently
- **Maintains Context:** Inline comments explain every change
- **Ensures Quality:** Built-in validation and confidence scoring
- **Provides Documentation:** Conversion reports detail what changed and why

Start migrating your NetSuite scripts today!

---

## Keywords
netsuite, suitescript, migration, converter, automation, javascript, oracle, erp, development, code-migration

## Screenshots Required (1280x800 or 640x400)

### Screenshot 1: Extension Popup - Dashboard
**Caption:** "Dashboard showing conversion limits and quick access to migrate scripts"
**Shows:** Extension popup with user logged in, displaying conversion statistics and CTA button

### Screenshot 2: Script Detection
**Caption:** "Automatic detection of SuiteScript 1.0 scripts in your NetSuite account"
**Shows:** List of detected scripts with file names, types, and migrate buttons

### Screenshot 3: Conversion Result - Inline View
**Caption:** "Review every change with inline comments highlighting modifications"
**Shows:** Code view with green-highlighted `// MIGRATED:` comments

### Screenshot 4: Three-Tab Display
**Caption:** "Three viewing modes: Clean code, side-by-side comparison, and inline comments"
**Shows:** Tabs at top (Code, Changes, Inline) with one active

### Screenshot 5: Professional Download
**Caption:** "Download production-ready files with conversion reports and testing checklists"
**Shows:** Downloaded file preview with header showing conversion summary

## Promotional Images (Optional)

### Small Tile (440x280)
**Design:** SuiteMigrate logo + "Migrate SuiteScript to 2.1" + "AI-Powered"

### Marquee (1400x560)
**Design:** Split screen showing SS 1.0 code on left, SS 2.1 on right, with arrow and "SuiteMigrate" branding

## Permissions Justification

### storage
**Why needed:** Store user authentication tokens and conversion history locally in the extension.

### alarms
**Why needed:** Schedule periodic checks for authentication status to keep extension synced with website login state.

### scripting
**Why needed:** Inject content scripts into NetSuite pages to detect SuiteScript files and extract script content for conversion.

### tabs
**Why needed:** Detect when user is on a NetSuite page to enable script detection features.

### Host Permissions - NetSuite domains
**Why needed:** Access NetSuite pages to scan for SuiteScript files and extract script content that the user wants to convert.

### Host Permissions - suitemigrate.vercel.app
**Why needed:** Authenticate with SuiteMigrate backend API to process conversions and sync user account status.

## Privacy Policy URL
https://suitemigrate.vercel.app/privacy

## Terms of Service URL
https://suitemigrate.vercel.app/terms

## Support Email
support@suitemigrate.com (or your actual support email)

## Website
https://suitemigrate.vercel.app

---

## Pre-Submission Checklist

- [ ] All screenshots captured at correct resolution (1280x800 or 640x400)
- [ ] Screenshots show actual extension functionality (not mockups)
- [ ] Privacy policy is live and accessible
- [ ] Terms of service is live and accessible
- [ ] Support email is monitored
- [ ] Extension package uploaded (dist folder as ZIP)
- [ ] All permissions have written justifications
- [ ] Description does not contain prohibited content (pricing claims, competitor references)
- [ ] Icons are professional and recognizable at all sizes

## Review Timeline
- **Submission:** Immediately after screenshots ready
- **Initial Review:** 1-3 business days
- **Possible Rejection Reasons:**
  - Missing or low-quality screenshots
  - Privacy policy missing or inadequate
  - Permissions not justified
  - Code issues found during review
- **Approval:** 2-7 days after submission
- **Public Listing:** Immediately after approval

## Post-Approval Actions
- [ ] Add Chrome Web Store badge to website
- [ ] Update README with installation link
- [ ] Announce launch on social media
- [ ] Monitor reviews and respond to users
- [ ] Track installation metrics
