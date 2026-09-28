# Screenshot Creation Guide for Chrome Web Store

## Requirements
- **Resolution:** 1280x800 pixels (recommended) or 640x400 pixels (minimum)
- **Format:** PNG or JPEG
- **Count:** Minimum 1, recommended 5
- **File Size:** Max 5MB per image

## How to Create Screenshots

### Method 1: Browser Developer Tools (Recommended)
1. Open Chrome DevTools (F12)
2. Click the device toolbar icon (Ctrl+Shift+M)
3. Set custom dimensions: 1280 x 800
4. Take screenshots with DevTools screenshot tool

### Method 2: Extension Viewport
1. Open extension popup
2. Use Windows Snipping Tool (Win + Shift + S)
3. Capture the entire popup
4. Resize to 1280x800 in image editor

### Method 3: Full Page Capture
1. Use screenshot extensions like "GoFullPage"
2. Capture entire flow
3. Crop to highlights
4. Resize to 1280x800

## Screenshot Specifications

### Screenshot 1: Extension Popup - Dashboard
**File:** `screenshot-1-dashboard.png`  
**Dimensions:** 1280 x 800  
**Caption:** "Dashboard showing conversion limits and quick access to migrate scripts"

**How to Capture:**
1. Load extension in Chrome
2. Login with test account that has Pro plan
3. Open extension popup
4. Make sure it shows:
   - User name/email in header
   - Conversion statistics (e.g., "15 conversions this month")
   - Plan name: "Pro Plan - Unlimited"
   - "Quick Convert" button
   - Navigation menu
5. Set browser to 1280x800 using DevTools
6. Screenshot the popup centered on canvas

**Design Tips:**
- Use light background to contrast popup
- Center the popup in the 1280x800 canvas
- Add subtle drop shadow to popup for depth
- Ensure text is readable at thumbnail size

---

### Screenshot 2: Script Detection List
**File:** `screenshot-2-script-list.png`  
**Dimensions:** 1280 x 800  
**Caption:** "Automatic detection of SuiteScript 1.0 scripts in your NetSuite account"

**How to Capture:**
1. Login to extension
2. Navigate to a NetSuite page (or mock the URL in address bar)
3. Click "Scan All Scripts" or mock a script list
4. Show list with at least 3-4 scripts:
   - `customscript_scheduled_export.js` - Scheduled Script
   - `customscript_restlet_api.js` - RESTlet
   - `customscript_user_event.js` - User Event Script
   - `customscript_client_validation.js` - Client Script
5. Each item shows:
   - Script filename
   - Script type
   - "Migrate" button
6. Screenshot the popup

**Mockup Option:**
Since you may not have real NetSuite scripts ready, you can:
1. Modify the extension code temporarily to show hardcoded scripts
2. Take screenshot
3. Revert changes

---

### Screenshot 3: Conversion Result - Inline View
**File:** `screenshot-3-inline-comments.png`  
**Dimensions:** 1280 x 800  
**Caption:** "Review every change with inline comments highlighting modifications"

**How to Capture:**
1. Convert a test script (use Test Script 1 from checklist)
2. Click on "Inline" tab
3. Ensure code shows green-highlighted lines with `// MIGRATED:` comments
4. Scroll to show 3-4 highlighted sections
5. Screenshot showing:
   - Tab navigation (Code | Changes | **Inline**)
   - Code with at least 3 green highlights
   - Readable comment text
   - Download button at bottom

**Highlight Examples to Show:**
```javascript
// MIGRATED: Changed from function scheduled(type) to define module
define(['N/runtime', 'N/record'], (runtime, record) => {

// MIGRATED: Replaced nlapiGetContext() with runtime.getCurrentUser()
const context = runtime.getCurrentUser();

// MIGRATED: Replaced nlapiLoadRecord() with record.load()
const customer = record.load({ type: 'customer', id: 123 });
```

---

### Screenshot 4: Three-Tab Display
**File:** `screenshot-4-three-tabs.png`  
**Dimensions:** 1280 x 800  
**Caption:** "Three viewing modes: Clean code, side-by-side comparison, and inline comments"

**How to Capture:**
1. Show conversion result page
2. Capture moment showing all three tabs clearly visible:
   - **Code** tab (active)
   - **Changes** tab
   - **Inline** tab
3. Code panel shows clean converted code
4. Tabs are clearly labeled
5. Download button visible

**Layout:**
```
┌─────────────────────────────────────┐
│  [Code] [Changes] [Inline]          │
├─────────────────────────────────────┤
│ define(['N/record'], (record) => {  │
│   return {                          │
│     execute: (context) => {         │
│       const rec = record.load({     │
│         type: 'customer',           │
│         id: 123                     │
│       });                           │
│     }                               │
│   };                                │
│ });                                 │
│                                     │
│          [Download Code]            │
└─────────────────────────────────────┘
```

---

### Screenshot 5: Professional Download Preview
**File:** `screenshot-5-download-preview.png`  
**Dimensions:** 1280 x 800  
**Caption:** "Download production-ready files with conversion reports and testing checklists"

**How to Capture:**
1. After converting a script, click "Download Code"
2. Open downloaded `.js` file in text editor (VS Code recommended)
3. Show the file with:
   - Professional header at top:
     ```
     /**
      * SUITESCRIPT 2.1 CONVERSION
      * Generated by SuiteMigrate
      * Date: [timestamp]
      * Original: customscript_scheduled_export.js
      */
     ```
   - Conversion summary section
   - Clean code below
4. Screenshot VS Code window
5. Resize/crop to 1280x800

**Alternative:**
- Show two side-by-side views:
  - Left: Original SS 1.0 code
  - Right: Converted SS 2.1 code with header
- Add arrow between them labeled "SuiteMigrate"

---

## Creating Screenshots Without Real NetSuite Access

If you don't have NetSuite access yet, you can create mockups:

### Option A: Figma/Sketch Mockups
1. Design extension UI in Figma
2. Use actual dimensions (1280x800)
3. Export as PNG
4. Ensure it looks realistic (use actual extension styling)

### Option B: Staged Testing Environment
1. Temporarily modify extension to show hardcoded data
2. Add sample scripts to script list
3. Add pre-generated conversion results
4. Take screenshots
5. Revert changes before submission

### Option C: Hybrid Approach
1. Screenshot real extension UI (popup, tabs, buttons)
2. Overlay with actual conversion results from test scripts
3. Use image editor to compose professional screenshots

## Quick Screenshot Checklist

Before submitting each screenshot:
- [ ] Exactly 1280x800 pixels
- [ ] PNG format (better quality than JPEG)
- [ ] File size under 5MB
- [ ] No personal information visible (real emails, API keys)
- [ ] Text is readable when thumbnail (scale down to 200x125 to test)
- [ ] Colors match extension branding
- [ ] No browser UI visible (address bar, bookmarks) unless necessary
- [ ] Professional appearance (no debug console, no Lorem Ipsum)
- [ ] Shows actual extension functionality
- [ ] Clearly demonstrates the feature in caption

## Image Editing Tools

### Free Options
- **GIMP** - Full-featured, cross-platform
- **Paint.NET** (Windows) - Easy to use
- **Photopea** (Web) - Photoshop alternative in browser
- **Canva** (Web) - Quick mockups and resizing

### Paid Options
- **Adobe Photoshop** - Professional standard
- **Sketch** - Mac only, great for UI
- **Figma** - Web-based, collaborative

## Pro Tips

1. **Consistency:** Use the same background/styling across all screenshots
2. **Context:** Show cursor/hover states to indicate interactivity
3. **Annotations:** Add subtle arrows or highlights to draw attention to key features
4. **Branding:** Include SuiteMigrate logo/colors consistently
5. **Real Data:** Use realistic script names (not "test.js" or "foo.js")
6. **Readable Text:** Ensure code is readable even at thumbnail size
7. **White Space:** Don't crowd screenshots - let UI breathe
8. **Action Shots:** Show extension "in action" rather than static empty states

## Screenshot Priority

If you can only create 1-2 screenshots initially:

**Must Have:**
1. Screenshot 3 (Inline Comments) - Shows core value proposition
2. Screenshot 2 (Script List) - Shows detection functionality

**Should Have:**
3. Screenshot 1 (Dashboard) - Shows extension UI
4. Screenshot 4 (Three Tabs) - Shows versatility

**Nice to Have:**
5. Screenshot 5 (Download Preview) - Shows final output

## Next Steps After Screenshots Ready

1. Save all screenshots to `extension/store-assets/screenshots/`
2. Name them clearly: `screenshot-1-dashboard.png`, etc.
3. Review each at 200x125 (thumbnail size) for readability
4. Get feedback from team/users
5. Proceed with Chrome Web Store submission

---

**Need Help?**
If you need assistance creating screenshots, I can:
- Provide HTML mockups you can screenshot
- Suggest specific test scripts to convert
- Review your screenshots before submission
- Create Figma templates for mockups
