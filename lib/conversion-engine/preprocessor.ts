/**
 * Rule-based preprocessor
 * Runs BEFORE the AI engine — handles known mechanical transforms
 * so the AI only needs to handle context-aware logic
 */

import { SS1_TO_21_MAPPINGS, getRequiredModules } from "./api-mappings"

export type ScriptVersion = "1.0" | "2.0"
export type ScriptType =
  | "UserEvent"
  | "Suitelet"
  | "ScheduledScript"
  | "MapReduce"
  | "ClientScript"
  | "RESTlet"
  | "Portlet"
  | "MassUpdate"
  | "Unknown"

export interface PreprocessResult {
  code: string
  detectedVersion: ScriptVersion
  detectedScriptType: ScriptType
  detectedApiCalls: string[]
  requiredModules: string[]
  changeLog: string[]
  manualReviewFlags: string[]
}

/** Detect SS version from @NApiVersion tag or by presence of nlapi* calls */
export function detectVersion(code: string): ScriptVersion {
  const versionMatch = code.match(/@NApiVersion\s+([\d.]+)/)
  if (versionMatch) {
    const v = versionMatch[1]
    if (v === "2.1") return "2.0" // already partially modern
    if (v.startsWith("2")) return "2.0"
    return "1.0"
  }
  // Fallback: detect by nlapi* usage
  if (/\bnlapi[A-Z]/.test(code)) return "1.0"
  return "2.0"
}

/** Detect script type from @NScriptType tag */
export function detectScriptType(code: string): ScriptType {
  const match = code.match(/@NScriptType\s+(\w+)/i)
  if (!match) return "Unknown"
  const raw = match[1].toLowerCase()
  const typeMap: Record<string, ScriptType> = {
    userevent: "UserEvent",
    suitelet: "Suitelet",
    scheduled: "ScheduledScript",
    scheduledscript: "ScheduledScript",
    mapreduce: "MapReduce",
    clientscript: "ClientScript",
    restlet: "RESTlet",
    portlet: "Portlet",
    massupdate: "MassUpdate",
  }
  return typeMap[raw] ?? "Unknown"
}

/** Find all nlapi* calls present in code */
export function detectApiCalls(code: string): string[] {
  const found: string[] = []
  for (const mapping of SS1_TO_21_MAPPINGS) {
    if (code.includes(mapping.old)) {
      found.push(mapping.old)
    }
  }
  return [...new Set(found)]
}

/** Apply mechanical SS 1.0 → 2.1 transforms where safe */
function applyMechanicalTransforms(
  code: string,
  changeLog: string[],
  manualReviewFlags: string[]
): string {
  let result = code

  // Fix @NApiVersion tag
  if (/@NApiVersion\s+1\.0/.test(result)) {
    result = result.replace(/@NApiVersion\s+1\.0/g, "@NApiVersion 2.1")
    changeLog.push("Updated @NApiVersion from 1.0 to 2.1")
  } else if (!/@NApiVersion/.test(result)) {
    // Inject version tag if missing
    result = "/**\n * @NApiVersion 2.1\n */\n" + result
    changeLog.push("Added missing @NApiVersion 2.1 tag")
  }

  // nlapiLogExecution → log.debug / log.error / log.audit
  if (/nlapiLogExecution\s*\(\s*['"]DEBUG['"]/g.test(result)) {
    result = result.replace(
      /nlapiLogExecution\s*\(\s*['"]DEBUG['"]\s*,\s*([^,)]+)\s*,\s*([^)]+)\)/g,
      "log.debug({ title: $1, details: $2 })"
    )
    changeLog.push("Replaced nlapiLogExecution(DEBUG) with log.debug()")
  }
  if (/nlapiLogExecution\s*\(\s*['"]ERROR['"]/g.test(result)) {
    result = result.replace(
      /nlapiLogExecution\s*\(\s*['"]ERROR['"]\s*,\s*([^,)]+)\s*,\s*([^)]+)\)/g,
      "log.error({ title: $1, details: $2 })"
    )
    changeLog.push("Replaced nlapiLogExecution(ERROR) with log.error()")
  }
  if (/nlapiLogExecution\s*\(\s*['"]AUDIT['"]/g.test(result)) {
    result = result.replace(
      /nlapiLogExecution\s*\(\s*['"]AUDIT['"]\s*,\s*([^,)]+)\s*,\s*([^)]+)\)/g,
      "log.audit({ title: $1, details: $2 })"
    )
    changeLog.push("Replaced nlapiLogExecution(AUDIT) with log.audit()")
  }

  // Flag complex patterns for manual review
  const complexPatterns = SS1_TO_21_MAPPINGS.filter((m) => m.isComplex)
  for (const p of complexPatterns) {
    if (result.includes(p.old)) {
      manualReviewFlags.push(
        `${p.old} — ${p.description} requires manual review for correct parameter mapping`
      )
    }
  }

  return result
}

/** Apply SS 2.0 → 2.1 modernization (var→const/let, version tag, etc.) */
function applyModernization(
  code: string,
  changeLog: string[],
): string {
  let result = code

  // Update @NApiVersion 2.0 → 2.1
  if (/@NApiVersion\s+2\.0/.test(result)) {
    result = result.replace(/@NApiVersion\s+2\.0/g, "@NApiVersion 2.1")
    changeLog.push("Updated @NApiVersion from 2.0 to 2.1")
  }

  return result
}

/** Main preprocessor entry point */
export function preprocess(code: string): PreprocessResult {
  const changeLog: string[] = []
  const manualReviewFlags: string[] = []

  const detectedVersion = detectVersion(code)
  const detectedScriptType = detectScriptType(code)
  const detectedApiCalls = detectApiCalls(code)
  const requiredModules = getRequiredModules(code)

  let processedCode = code

  if (detectedVersion === "1.0") {
    processedCode = applyMechanicalTransforms(processedCode, changeLog, manualReviewFlags)
  } else {
    processedCode = applyModernization(processedCode, changeLog)
  }

  return {
    code: processedCode,
    detectedVersion,
    detectedScriptType,
    detectedApiCalls,
    requiredModules,
    changeLog,
    manualReviewFlags,
  }
}
