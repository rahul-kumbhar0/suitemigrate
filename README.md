# SuiteMigrate

**Automatically convert NetSuite SuiteScript 1.0 → 2.1 before the 2028 deadline.**

SuiteMigrate is a Chrome extension + web app that scans your NetSuite account and uses AI (SuiteMigrate AI) to convert legacy SuiteScript code to the modern 2.1 standard.

## 🚀 Features

- **Chrome Extension** — Scan NetSuite accounts directly from the browser
- **AI-Powered Conversion** — rule-based preprocessing plus AI with hardcoded SS 1.0→2.1 API mappings
- **Rule-Based Preprocessing** — Apply known mechanical transforms before AI
- **Confidence Scoring** — See conversion quality (0-100%) with manual review flags
- **Plan Enforcement** — Free (5 conversions), Pro, Lifetime, Team plans
- **Dashboard** — Track conversion history, usage, and account details

## 📋 Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Shadcn UI components

**Backend:**
- Next.js API routes
- Supabase (auth + database)
- AI conversion service (server-side)

**Chrome Extension:**
- Vite + React
- TypeScript
- Content scripts for NetSuite integration

**Payments:**
- Razorpay (India-focused)

## 🛠️ Local Development Setup

### 1. Prerequisites
```bash
node >= 18.x
npm >= 9.x
```

### 2. Clone & Install
```bash
git clone https://github.com/rahul-kumbhar0/suitemigrate.git
cd suitemigrate
npm install
```

### 3. Environment Variables
```bash
# Copy template
cp .env.local.example .env.local

# Edit .env.local and fill in:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - GEMINI_API_KEY
# - (Optional) Razorpay keys for testing payments
```

### 4. Supabase Setup
1. Create project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → Run `supabase/schema.sql`
3. Enable **Google OAuth** in Authentication → Providers
4. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://suitemigrate.vercel.app/auth/callback`

### 5. Run Dev Server
```bash
npm run dev
# Visit http://localhost:3000
```

## 🧩 Chrome Extension Setup

### Development Build
```bash
cd extension
npm install
npm run build

# Load unpacked extension in Chrome:
# 1. Open chrome://extensions
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select extension/dist folder
```

### Production Build
```bash
cd extension
npm run build

# Package will be in extension/dist/
# ZIP it for Chrome Web Store submission
```

## 🧪 Testing the Auth Sync Fix

**The Problem (Before):**
- Login on website → extension showed "Log in to convert"
- Login from extension → returning to extension showed login screen
- Auth state did NOT sync automatically

**The Fix (After):**
- Extension polls `/api/auth/session` every 2 seconds
- Uses `credentials: include` to read HTTP-only cookies
- Login on website → extension auto-updates within 2s
- Logout on website → extension clears within 2s

**Test Steps:**

1. **Website → Extension Sync**
   - Open website: `http://localhost:3000`
   - Log in with email/password or Google OAuth
   - Open Chrome extension popup
   - ✅ Should show dashboard (not login screen) within 2 seconds

2. **Extension → Website Sync**
   - Open extension popup (logged out)
   - Click "Log in" → opens website
   - Sign up / log in on website
   - Return to extension popup
   - ✅ Should show dashboard automatically (no manual refresh needed)

3. **Logout Sync**
   - Log out from website
   - Open extension popup
   - ✅ Should show login screen within 2 seconds

## 🔄 Testing Conversion Engine

### Sample SS 1.0 Script
```javascript
/**
 * @NApiVersion 1.0
 * @NScriptType UserEvent
 */

function beforeSubmit(type) {
  var rec = nlapiGetNewRecord();
  var customerId = nlapiGetFieldValue('entity');
  var customer = nlapiLoadRecord('customer', customerId);
  nlapiLogExecution('DEBUG', 'Customer', customer);
}
```

### Test Conversion
1. Log into extension
2. Navigate to NetSuite Script page
3. Click "Convert to 2.1"
4. Extension should:
   - Call `/api/convert` with script code
   - Show loading state
   - Display converted code with confidence score
   - Allow download as `.js` file

### Expected Converted Output
```javascript
/**
 * @NApiVersion 2.1
 * @NScriptType UserEvent
 */
define(['N/record', 'N/log'], function(record, log) {
  'use strict';

  function beforeSubmit(context) {
    const newRecord = context.newRecord;
    const customerId = newRecord.getValue({ fieldId: 'entity' });
    const customer = record.load({ type: 'customer', id: customerId });
    log.debug({ title: 'Customer', details: customer });
  }

  return { beforeSubmit };
});
```

## 📦 Deployment

### Vercel (Website)
```bash
# Connect GitHub repo to Vercel
# Environment variables are auto-imported from .env.local

# Deploy:
git push origin main
```

### Chrome Web Store (Extension)
1. Build production extension: `cd extension && npm run build`
2. ZIP the `extension/dist` folder
3. Upload to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
4. Fill in:
   - Extension name: "SuiteMigrate"
   - Description: See `extension/public/manifest.json`
   - Screenshots: Use pre-generated images in `extension/assets/`
   - Privacy policy URL: `https://suitemigrate.vercel.app/privacy`

## 🗄️ Database Schema

All tables are created via `supabase/schema.sql`:

- **users** — User profiles, plans, conversion limits
- **conversions** — Conversion history with original/converted code
- **ns_accounts** — Linked NetSuite accounts per user
- **payments** — Razorpay payment records
- **teams** — Team workspaces (for Team plan)
- **team_members** — Team membership

## 🔐 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | ✅ |
| `GEMINI_API_KEY` | Google Gemini API key | ✅ |
| `GEMINI_MODEL` | Model name (default: `gemini-2.0-flash-exp`) | ❌ |
| `RAZORPAY_KEY_ID` | Razorpay publishable key | ❌ |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key | ❌ |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay webhook secret | ❌ |

## 🐛 Known Issues & Troubleshooting

### Extension shows "Log in to convert" after website login
**Cause:** Polling interval not triggering or CORS issue  
**Fix:** Check browser console for errors, verify CORS headers in `/api/auth/session`

### Gemini API returns 400 error
**Cause:** AI service configuration error  
**Fix:** Check server logs and verify AI API key is set in Vercel environment variables

### "Conversion limit reached" error on first conversion
**Cause:** User profile not created in database  
**Fix:** Check Supabase trigger `on_auth_user_created` is enabled

### Extension can't access NetSuite scripts
**Cause:** Content script not injected  
**Fix:** Ensure extension has `host_permissions` for `*.netsuite.com` in `manifest.json`

## 📝 License

All rights reserved. See LICENSE file.
<!-- TODO (OWNER): Replace with final licence once chosen with legal advice. -->

## 🤝 Contributing

This is a private repository. Please contact the owner before contributing.

## 📧 Support

Email: support@suitemigrate.com  
Twitter: [@suitemigrate](https://twitter.com/suitemigrate)
