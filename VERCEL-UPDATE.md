# 🚨 URGENT: Update Vercel Environment Variable

## Issue
Your Vercel deployment is using the **wrong Gemini model name**, causing 503 errors.

## Current (WRONG)
```
GEMINI_MODEL=gemini-3.6-flash  ❌ This model doesn't exist!
```

## Fix Required
Go to [Vercel Dashboard](https://vercel.com/dashboard) → Your Project → Settings → Environment Variables

Update `GEMINI_MODEL` to:
```
GEMINI_MODEL=gemini-3.5-flash  ✅ Stable model (GA since May 2026)
```

## Steps
1. Go to https://vercel.com/dashboard
2. Select your `suitemigrate` project
3. Click **Settings** (top nav)
4. Click **Environment Variables** (left sidebar)
5. Find `GEMINI_MODEL`
6. Click **Edit**
7. Change value to: `gemini-3.5-flash`
8. Select all environments: **Production**, **Preview**, **Development**
9. Click **Save**
10. Go to **Deployments** tab
11. Click **Redeploy** on the latest deployment

## Why This Matters

### Before (Broken)
- ❌ Model name: `gemini-3.6-flash` (doesn't exist)
- ❌ Falls back to `gemini-2.0-flash-exp` (experimental, high demand)
- ❌ Gets 503 errors: "This model is currently experiencing high demand"
- ❌ Even with retry logic, fails if demand stays high

### After (Fixed)
- ✅ Model name: `gemini-3.5-flash` (stable, GA)
- ✅ Production-ready, lower latency
- ✅ Less prone to 503 errors
- ✅ Retry logic handles temporary spikes
- ✅ Same 1M token context window
- ✅ Same quality (actually better than 2.0)

## Available Models (Sept 2026)

| Model | Status | Use Case | 503 Risk |
|-------|--------|----------|----------|
| `gemini-2.0-flash-exp` | Experimental | Testing only | ⚠️ HIGH |
| `gemini-3.5-flash` | ✅ **Stable (GA)** | **Production** | ✅ LOW |
| `gemini-3.8-flash` | Latest | Best quality | ⚠️ MEDIUM |

**Recommendation:** Use `gemini-3.5-flash` for production (best stability).

## What We Fixed in Code
1. ✅ Added exponential backoff retry (2s → 4s → 8s delays)
2. ✅ Changed default fallback to `gemini-3.5-flash`
3. ✅ Better error messages for 503/rate limit errors
4. ✅ Updated local `.env` to use stable model

**But Vercel still needs manual update!**

## Verify After Update
1. Wait 2-3 minutes for redeployment
2. Try converting a script on https://suitemigrate.vercel.app
3. Should work without 503 errors
4. Check Vercel logs: **Deployments → Function Logs**
5. Look for: `[Gemini] Using model: gemini-3.5-flash`

## If Still Getting 503 Errors After Update

This could mean:
1. Vercel env var not saved properly → Check again
2. Old deployment still active → Force redeploy
3. Gemini API quota exhausted → Check API key at https://aistudio.google.com/app/apikey
4. Actual temporary Google overload → Wait 5 minutes and retry

**The retry logic will handle temporary spikes automatically.**

---

**Action Required:** Update Vercel env var NOW before more users hit 503 errors! ⚡
