/**
 * Postprocessor — runs AFTER AI conversion
 * Validates output, calculates confidence score, extracts change log
 */

export interface PostprocessResult {
  code: string
  confidenceScore: number
  manualReviewLines: number[]
  changeLog: string[]
  isValid: boolean
  validationErrors: string[]
}

/** Check if output has required SuiteScript 2.1 structure */
function validateStructure(code: string): string[] {
  const errors: string[] = []

  if (!/@NApiVersion\s+2\.1/.test(code)) {
    errors.push("Missing or incorrect @NApiVersion 2.1 tag")
  }
  if (!/@NScriptType/.test(code)) {
    errors.push("Missing @NScriptType tag")
  }
  if (!/define\s*\(/.test(code) && !/require\s*\(/.test(code)) {
    errors.push("Missing AMD define() or require() module wrapper")
  }
  if (/\bnlapi[A-Z]/.test(code)) {
    errors.push("Legacy nlapi* calls still present — conversion incomplete")
  }

  return errors
}

/** Find line numbers that need manual review */
function findManualReviewLines(code: string): number[] {
  const lines = code.split("\n")
  const flaggedLines: number[] = []

  const reviewPatterns = [
    /TODO|FIXME|MANUAL.?REVIEW|needs.?review/i,
    /\/\*\s*REVIEW/i,
    /nlapiYieldScript/,
    /nlapiSendFax/,
    /nlapiSelectValue/,
    /\beval\s*\(/,
  ]

  lines.forEach((line, index) => {
    for (const pattern of reviewPatterns) {
      if (pattern.test(line)) {
        flaggedLines.push(index + 1) // 1-indexed
        break
      }
    }
  })

  return flaggedLines
}

/** Calculate confidence score 0-100 */
function calculateConfidence(
  code: string,
  validationErrors: string[],
  manualReviewLines: number[],
  originalApiCallCount: number
): number {
  let score = 100

  // Deduct for validation errors
  score -= validationErrors.length * 15

  // Deduct for remaining nlapi calls
  const remainingNlapi = (code.match(/\bnlapi[A-Z]/g) || []).length
  score -= remainingNlapi * 10

  // Deduct for manual review lines
  score -= manualReviewLines.length * 5

  // Deduct for TODO/FIXME markers
  const todoCount = (code.match(/TODO|FIXME/gi) || []).length
  score -= todoCount * 3

  // Bonus if original had many api calls and all converted
  if (originalApiCallCount > 0 && remainingNlapi === 0) {
    score = Math.min(score + 5, 100)
  }

  return Math.max(0, Math.min(100, score))
}

/** Extract change log from AI output (looks for comment markers) */
function extractChangeLog(code: string): string[] {
  const changes: string[] = []
  const lines = code.split("\n")

  for (const line of lines) {
    // AI adds inline comments like: // MIGRATED: ...
    const migratedMatch = line.match(/\/\/\s*MIGRATED:\s*(.+)/)
    if (migratedMatch) changes.push(migratedMatch[1].trim())

    // Also catch: // CHANGED: ...
    const changedMatch = line.match(/\/\/\s*CHANGED:\s*(.+)/)
    if (changedMatch) changes.push(changedMatch[1].trim())
  }

  return changes
}

/** Strip any markdown code fences the AI engine might add */
function stripMarkdown(code: string): string {
  return code
    .replace(/^```(?:javascript|typescript|js|ts)?\s*\n?/gm, "")
    .replace(/^```\s*$/gm, "")
    .trim()
}

/** Main postprocessor entry point */
export function postprocess(
  rawAIOutput: string,
  originalApiCallCount: number,
  preprocessChangeLog: string[]
): PostprocessResult {
  const code = stripMarkdown(rawAIOutput)
  const validationErrors = validateStructure(code)
  const manualReviewLines = findManualReviewLines(code)
  const inlineChanges = extractChangeLog(code)
  const changeLog = [...preprocessChangeLog, ...inlineChanges]

  // Add standard change entries based on what's in the code
  if (/@NApiVersion\s+2\.1/.test(code)) {
    if (!changeLog.some((c) => c.includes("NApiVersion"))) {
      changeLog.unshift("Updated @NApiVersion to 2.1")
    }
  }
  if (/define\s*\(\[/.test(code) && !changeLog.some((c) => c.includes("AMD"))) {
    changeLog.push("Wrapped in AMD define() module structure")
  }
  if (!/\bvar\b/.test(code) && changeLog.length > 0) {
    changeLog.push("Replaced var declarations with const/let")
  }

  const confidenceScore = calculateConfidence(
    code,
    validationErrors,
    manualReviewLines,
    originalApiCallCount
  )

  return {
    code,
    confidenceScore,
    manualReviewLines,
    changeLog: [...new Set(changeLog)], // deduplicate
    isValid: validationErrors.length === 0,
    validationErrors,
  }
}
