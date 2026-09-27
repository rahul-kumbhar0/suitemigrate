# Bug Fixes - Extension View Flashing

## Issue
When clicking "View Scripts to Migrate" button in the extension, the script list page would appear for 1 second and then flash back to the dashboard.

**Error shown in console:**
```
Uncaught Error: Extension context invalidated.
```

## Root Causes

### 1. Auth Polling Overriding View Navigation
**Problem:** The `tryAuth()` function runs every 2 seconds and was calling `setView("dashboard")` unconditionally, overriding any other view state.

**Fix:** Only set view to "dashboard" when transitioning from "loading" or "login_required" states:
```typescript
// BEFORE
if (cached) {
  setUser(cached)
  setView("dashboard") // ❌ Always resets to dashboard
}

// AFTER
if (cached) {
  setUser(cached)
  if (view === "loading" || view === "login_required") {
    setView("dashboard") // ✅ Only resets during initial auth
  }
}
```

**File:** `extension/src/popup/App.tsx`

---

### 2. Missing Error Handling for Chrome APIs
**Problem:** `chrome.tabs.query()` and `chrome.runtime.sendMessage()` can fail with "Extension context invalidated" when the extension is reloaded/updated during use.

**Fix:** Added error handling with `chrome.runtime.lastError` checks and try-catch blocks:

**In DashboardView.tsx:**
```typescript
// Wrap chrome.tabs.query with error handling
try {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (chrome.runtime.lastError) {
      console.warn("Chrome API error:", chrome.runtime.lastError)
      return
    }
    // ... rest of logic
  })
} catch (err) {
  console.warn("Failed to query tabs:", err)
}
```

**In ScriptListView.tsx:**
```typescript
// Wrap chrome.runtime.sendMessage with proper error handling
const codeResult = await new Promise<{ code: string; error?: string }>((resolve, reject) => {
  try {
    chrome.runtime.sendMessage(
      { type: "FETCH_SCRIPT_CODE", scriptId: script.id },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message))
        } else {
          resolve(response)
        }
      }
    )
  } catch (err) {
    reject(err)
  }
})
```

---

### 3. Early View Reset in ScriptListView
**Problem:** When `activeAccount` is null, the component was calling `setView("dashboard")` directly in the render function, causing a render loop.

**Fix:** Return early with a placeholder UI instead of calling `setView()`:
```typescript
// BEFORE
if (!activeAccount) {
  setView("dashboard") // ❌ Causes render loop
  return null
}

// AFTER
if (!activeAccount) {
  return (
    <div className="flex flex-col">
      <Header showBack onBack={() => setView("dashboard")} title="Scripts" />
      <div className="p-4 text-center text-slate-500 text-xs">
        No account selected. Returning to dashboard...
      </div>
    </div>
  ) // ✅ Clean early return
}
```

---

## Testing

### Before Fix
1. Open extension on NetSuite page
2. Click "Scan"
3. Click "View Scripts to Migrate"
4. ❌ Script list flashes for 1 second
5. ❌ Returns to dashboard
6. ❌ Console error: "Extension context invalidated"

### After Fix
1. Open extension on NetSuite page
2. Click "Scan"
3. Click "View Scripts to Migrate"
4. ✅ Script list stays visible
5. ✅ Can filter and search scripts
6. ✅ Can click "Convert" button
7. ✅ No console errors

---

## Files Modified
- `extension/src/popup/App.tsx` — Fixed auth polling view override
- `extension/src/popup/pages/DashboardView.tsx` — Added Chrome API error handling
- `extension/src/popup/pages/ScriptListView.tsx` — Fixed early return and message passing

---

## Build & Deploy
```bash
cd extension
npm run build

# Extension rebuilt: 186.52 KB popup.js (58.15 KB gzipped)
# Committed: 54df1b4
# Pushed to GitHub
```

---

## Status
✅ **Fixed and deployed**

The extension now properly handles:
- View navigation without flashing
- Chrome extension context invalidation
- Auth polling without disrupting user flow
- Proper error boundaries for all Chrome APIs

---

**Last Updated:** 2026-09-21  
**Commit:** 54df1b4
