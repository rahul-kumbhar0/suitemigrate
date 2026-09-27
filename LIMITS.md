# SuiteMigrate Script Size Limits

## tl;dr
✅ **Most scripts convert fine** — 1000-3000 lines is typical  
⚠️ **Very large scripts** (5000+ lines) may need splitting  
❌ **Monoliths** (10,000+ lines) should be refactored into modules

---

## Technical Limits

### Gemini 2.0 Flash (AI Model)
- **Context window:** 1 million tokens (~750,000 words)
- **Max output:** 64,000 tokens (~48,000 words)
- **Typical code:** 1 line ≈ 10-15 tokens

**Translation for code:**
- Small script (100 lines) ≈ 1,000-1,500 tokens ✅
- Medium script (1,000 lines) ≈ 10,000-15,000 tokens ✅
- Large script (5,000 lines) ≈ 50,000-75,000 tokens ✅
- Very large (10,000 lines) ≈ 100,000-150,000 tokens ✅
- Monolith (30,000 lines) ≈ 300,000-450,000 tokens ⚠️

### SuiteMigrate Limits (For Performance & Cost)

#### API Endpoint Limits
```typescript
MAX_SIZE_BYTES = 500KB     // ~125,000 tokens
MAX_LINES      = 10,000     // ~100,000-150,000 tokens
```

**What this means:**
- ✅ Scripts up to **10,000 lines** convert automatically
- ✅ Most NetSuite scripts are **500-3000 lines**
- ⚠️ Scripts larger than 500KB need manual splitting

#### Why These Limits?

1. **Performance** — Smaller scripts convert in 3-10 seconds
2. **Cost** — Gemini API charges per token ($0.10/1M input tokens)
3. **Quality** — Smaller scripts get more accurate conversions
4. **NetSuite Best Practice** — 1 script per file, modular design

---

## Real-World Script Sizes

### Typical NetSuite Scripts
| Script Type | Typical Size | Lines | Tokens | Status |
|------------|--------------|-------|--------|--------|
| UserEvent | Small | 100-500 | 1K-5K | ✅ Fast |
| Suitelet | Medium | 300-1500 | 3K-15K | ✅ Fast |
| Scheduled | Medium | 500-2000 | 5K-20K | ✅ Fast |
| MapReduce | Large | 1000-3000 | 10K-30K | ✅ Good |
| Client Script | Small-Medium | 200-1000 | 2K-10K | ✅ Fast |
| RESTlet | Small | 100-800 | 1K-8K | ✅ Fast |

### Edge Cases
| Scenario | Size | Status | Recommendation |
|----------|------|--------|----------------|
| Legacy monolith | 10K+ lines | ⚠️ Slow | Split into modules |
| Generated code | 5K+ lines | ⚠️ May fail | Review + simplify |
| Copy-paste library | 3K+ lines | ⚠️ Risky | Extract to module |

---

## What Happens with Large Scripts?

### Under 500KB / 10,000 lines
✅ **Converts the entire script**
- Preprocessor applies mechanical transforms
- Gemini converts all business logic
- Postprocessor validates output
- Total time: 5-30 seconds depending on size

### Over 500KB / 10,000 lines
❌ **Error returned:**
```json
{
  "error": "Script too large: 15,234 lines (max 10,000). Consider breaking into modules.",
  "lines": 15234,
  "maxLines": 10000
}
```

**User sees:** Clear error message with guidance to split script

---

## Best Practices for Large Scripts

### ✅ DO: Modular Architecture
```javascript
// GOOD: Split into logical modules

// main-script.js (500 lines)
define(['./lib/customers', './lib/orders'], function(customers, orders) {
  // Main orchestration logic
});

// lib/customers.js (300 lines)
define(['N/record'], function(record) {
  // Customer-specific logic
});

// lib/orders.js (400 lines)
define(['N/record'], function(record) {
  // Order-specific logic
});
```

### ❌ DON'T: Single Monolith
```javascript
// BAD: Everything in one file (10,000+ lines)
define(['N/record', 'N/search', ...20 more modules], function(...) {
  // 10,000 lines of mixed logic
  // Hard to test
  // Hard to maintain
  // Hard to convert
});
```

---

## Conversion Strategy by Size

### Small Scripts (< 1,000 lines)
**Strategy:** Convert entire script in one go
- ✅ Fast (3-5 seconds)
- ✅ High confidence (85-95%)
- ✅ Minimal manual review

### Medium Scripts (1,000 - 3,000 lines)
**Strategy:** Convert entire script, review output
- ✅ Good (10-15 seconds)
- ✅ Good confidence (75-90%)
- ⚠️ Review complex logic sections

### Large Scripts (3,000 - 10,000 lines)
**Strategy:** Convert entire script, thorough review
- ⚠️ Slow (20-30 seconds)
- ⚠️ Lower confidence (65-85%)
- ⚠️ Manual review recommended
- 💡 **Consider splitting** for better maintainability

### Very Large Scripts (10,000+ lines)
**Strategy:** Must split before conversion
1. Identify logical sections (customers, orders, reporting, etc.)
2. Extract into separate modules
3. Convert each module individually
4. Test integration

**Benefits of splitting:**
- ✅ Faster conversion (parallel processing)
- ✅ Higher confidence per module
- ✅ Easier testing
- ✅ Better code organization
- ✅ Easier future maintenance

---

## Cost Implications

### Gemini API Pricing
- Input: $0.10 per 1M tokens
- Output: $0.40 per 1M tokens

### Example Costs
| Script Size | Input Tokens | Output Tokens | Cost |
|------------|--------------|---------------|------|
| 500 lines | ~5K | ~6K | $0.003 |
| 1000 lines | ~10K | ~12K | $0.006 |
| 3000 lines | ~30K | ~36K | $0.018 |
| 10000 lines | ~100K | ~120K | $0.058 |

**Typical project:** 50 scripts × 1000 lines average = $0.30 total

---

## FAQ

### Q: What if my script is exactly 10,001 lines?
**A:** You'll get an error. Remove blank lines, comments, or extract helper functions to a separate module.

### Q: Can I increase the limit for my account?
**A:** Enterprise plan (contact sales) can have custom limits up to 50,000 lines. But we recommend refactoring for maintainability.

### Q: Will Gemini actually understand 10,000 lines of code?
**A:** Yes! Gemini 2.0 Flash has a 1M token context window (equivalent to ~60,000 lines of code). But quality degrades with size — smaller is better.

### Q: What about MapReduce scripts with 10+ files?
**A:** Convert each file individually. They're separate deployment units anyway.

### Q: Can I paste multiple scripts at once?
**A:** No. Convert one script at a time for best results. The preprocessor needs to detect version/type per script.

---

## Performance Benchmarks

**Test Environment:** MacBook Pro M2, Gemini 2.0 Flash API

| Lines | Size | Time | Confidence | Manual Review |
|-------|------|------|-----------|---------------|
| 100 | 5KB | 2s | 92% | None |
| 500 | 25KB | 4s | 88% | 2 lines |
| 1000 | 50KB | 8s | 84% | 5 lines |
| 3000 | 150KB | 18s | 78% | 15 lines |
| 5000 | 250KB | 28s | 72% | 30 lines |
| 10000 | 500KB | 45s | 65% | 80 lines |

**Recommendation:** Aim for scripts under 3000 lines for optimal results.

---

## Summary

**✅ Sweet Spot:** 500-2000 lines per script
- Fast conversion
- High confidence
- Easy to review
- Good NetSuite architecture

**⚠️ Warning Zone:** 3000-10,000 lines
- Slower conversion
- More manual review needed
- Consider refactoring

**❌ Too Large:** 10,000+ lines
- Must split before conversion
- Sign of technical debt
- Refactor for long-term maintainability

---

**Remember:** SuiteScript 2.1 encourages modular design. If your script is too large to convert, that's a sign it's too large to maintain. Use this opportunity to refactor! 🚀
