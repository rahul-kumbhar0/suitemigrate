# SuiteMigrate Deployment Checklist

## 🎯 Pre-Deployment Setup

### 1. Supabase Configuration ✅ (Completed)
- [x] Database schema deployed (`supabase/schema.sql`)
- [ ] Run the SQL in Supabase Dashboard → SQL Editor
- [ ] Verify all tables exist: users, conversions, ns_accounts, payments, teams, team_members
- [ ] Verify RLS policies are enabled
- [ ] Verify trigger `on_auth_user_created` is working

### 2. Environment Variables
**Required for Production:**
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Gemini AI
GEMINI_API_KEY=AIzaSyxxx...
GEMINI_MODEL=gemini-2.0-flash-exp

# Google OAuth (configured in Supabase)
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPXxxx...

# App URL
NEXT_PUBLIC_APP_URL=https://suitemigrate.vercel.app
```

**Optional (for full functionality):**
```bash
# Razorpay (when ready)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=xxx
RAZORPAY_WEBHOOK_SECRET=xxx
```

### 3. Supabase Auth Configuration
- [ ] Enable Google OAuth provider
- [ ] Add redirect URLs:
  - `https://suitemigrate.vercel.app/auth/callback`
  - `http://localhost:3000/auth/callback` (for testing)
- [ ] Set site URL: `https://suitemigrate.vercel.app`
- [ ] Email templates (optional): customize signup/reset emails

### 4. Gemini API Setup
- [ ] Get API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
- [ ] Verify quota: Free tier = 15 RPM, 1M TPM, 1500 RPD
- [ ] Test API key locally with a sample conversion

---

## 🚀 Website Deployment (Vercel)

### 1. Connect GitHub Repository
```bash
# Push all changes
git add .
git commit -m "Deploy: Auth sync fix + Phase 2 conversion engine"
git push origin main
```

### 2. Vercel Project Setup
1. Go to [vercel.com](https://vercel.com)
2. Import repository: `github.com/rahul-kumbhar0/suitemigrate`
3. Framework preset: **Next.js**
4. Root directory: `./` (project root)
5. Build command: `npm run build` (default)
6. Output directory: `.next` (default)

### 3. Add Environment Variables in Vercel
Go to **Settings → Environment Variables** and add:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY`
- `GEMINI_MODEL` (set to `gemini-2.0-flash-exp`)
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXT_PUBLIC_APP_URL` (set to `https://suitemigrate.vercel.app`)

### 4. Deploy
- Click **Deploy**
- Wait for build to complete
- Test at `https://suitemigrate.vercel.app`

### 5. Post-Deployment Verification
- [ ] Visit homepage — loads correctly
- [ ] Click "Sign Up" → creates account
- [ ] Google OAuth works
- [ ] Dashboard loads
- [ ] `/api/auth/session` returns proper CORS headers
- [ ] Check Vercel logs for errors

---

## 🧩 Chrome Extension Deployment

### 1. Build Production Extension
```bash
cd extension
npm install
npm run build
```

### 2. Update Extension Config
Edit `extension/.env.production`:
```bash
VITE_APP_URL=https://suitemigrate.vercel.app
```

Rebuild:
```bash
npm run build
```

### 3. Package Extension
```bash
# On Windows:
Compress-Archive -Path extension/dist/* -DestinationPath suitemigrate-extension-v1.0.0.zip

# On Mac/Linux:
cd extension
zip -r ../suitemigrate-extension-v1.0.0.zip dist/
```

### 4. Chrome Web Store Submission
1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Click **New Item**
3. Upload `suitemigrate-extension-v1.0.0.zip`
4. Fill in details:
   - **Name:** SuiteMigrate — SuiteScript 2.1 Migrator
   - **Description:** (from manifest.json)
   - **Category:** Developer Tools
   - **Language:** English
5. Add screenshots (already generated in `extension/assets/`)
6. Privacy practices:
   - **Do NOT select "Does not collect user data"** — the extension handles user email, session info, and website content (script code). See CWS-LISTING.md for the full data-use disclosure.
   - Privacy policy URL: `https://suitemigrate.vercel.app/privacy`
7. Submit for review (takes 1-3 days)

### 5. Test Unpacked Extension
Before submitting, test locally:
1. Open `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select `extension/dist` folder
5. Test:
   - [ ] Popup opens
   - [ ] Login button opens website
   - [ ] After website login, extension shows dashboard within 2s
   - [ ] Logout on website clears extension within 2s
   - [ ] Convert a script (test with sample SS 1.0 code)

---

## 🧪 End-to-End Testing

### Test Case 1: Auth Sync (Website → Extension)
1. Open `https://suitemigrate.vercel.app`
2. Sign up with email/password
3. Wait for email verification (check inbox)
4. Log in
5. Open Chrome extension
6. **Expected:** Dashboard loads within 2 seconds (no login screen)

### Test Case 2: Auth Sync (Extension → Website)
1. Open extension (logged out)
2. Click "Log in" → opens website
3. Complete login on website
4. Return to extension popup
5. **Expected:** Dashboard loads automatically (no manual refresh)

### Test Case 3: Logout Sync
1. Log in on website
2. Open extension → verify dashboard shows
3. Log out from website
4. Reopen extension
5. **Expected:** Login screen shows within 2 seconds

### Test Case 4: Conversion Flow
1. Log into extension
2. Navigate to NetSuite script page (or paste test script)
3. Click "Convert to 2.1"
4. **Expected:**
   - Loading spinner shows
   - Conversion completes in 3-10 seconds
   - Converted code displays
   - Confidence score shows (0-100%)
   - Change log lists transformations
   - Download button works

### Test Case 5: Plan Limits
1. Create new free account
2. Convert 5 scripts
3. Try 6th conversion
4. **Expected:** "Conversion limit reached" error with upgrade prompt

---

## 📊 Monitoring & Analytics

### Supabase Logs
- Monitor API usage: **Dashboard → Logs**
- Check RLS policies: **Authentication → Policies**
- Query recent conversions:
```sql
SELECT * FROM conversions ORDER BY created_at DESC LIMIT 10;
```

### Vercel Logs
- Go to **Deployment → Logs**
- Filter by errors: `level:error`
- Check API route performance

### Gemini API Quota
- Monitor usage: [Google AI Studio → Quota](https://aistudio.google.com/app/quota)
- Free tier: 15 requests/min, 1M tokens/min, 1500 requests/day
- Upgrade if hitting limits

---

## 🔧 Post-Launch Tasks

### Week 1
- [ ] Monitor Vercel logs for errors
- [ ] Check Supabase user signups
- [ ] Test conversion quality on 10+ real scripts
- [ ] Collect user feedback
- [ ] Monitor Gemini API usage (stay under free tier)

### Week 2-4
- [ ] Implement Razorpay payment integration (when keys received)
- [ ] Add conversion history page in dashboard
- [ ] Build team collaboration features
- [ ] Add NetSuite account linking
- [ ] Improve conversion confidence scoring

### Month 2+
- [ ] Launch blog with migration guides
- [ ] Create video tutorial
- [ ] Submit to Product Hunt
- [ ] Reach out to NetSuite communities
- [ ] Add support chat (Intercom/Crisp)

---

## 🆘 Rollback Plan

If critical issues occur after deployment:

### Website Rollback
1. Go to Vercel → **Deployments**
2. Find last working deployment
3. Click **⋯ → Promote to Production**

### Extension Rollback
1. Update manifest version: `1.0.0` → `1.0.1`
2. Rebuild and resubmit to Chrome Web Store
3. Users will auto-update within 24 hours

### Database Rollback
**⚠️ DANGEROUS — Only if schema breaks auth/core features**
```sql
-- Backup first
-- Then restore from Supabase Dashboard → Database → Backups
```

---

## ✅ Launch Day Checklist

**Morning:**
- [ ] Deploy website to Vercel
- [ ] Submit extension to Chrome Web Store
- [ ] Test all auth flows
- [ ] Test 3+ real conversions
- [ ] Verify Gemini API is working
- [ ] Check Supabase triggers

**Post-Launch:**
- [ ] Announce on Twitter
- [ ] Post in NetSuite Professionals group
- [ ] Email 10 beta testers
- [ ] Monitor logs for 2 hours
- [ ] Be ready for hotfixes

**Within 24 hours:**
- [ ] Check extension review status
- [ ] Monitor first signups
- [ ] Review error logs
- [ ] Respond to user feedback

---

## 📞 Emergency Contacts

**Supabase Status:** https://status.supabase.com  
**Vercel Status:** https://www.vercel-status.com  
**Gemini API Status:** https://status.cloud.google.com

**Support Email:** support@suitemigrate.com  
**Developer:** rahul@suitemigrate.com

---

**Last Updated:** 2026-09-21  
**Deployment Status:** Ready for production ✅
