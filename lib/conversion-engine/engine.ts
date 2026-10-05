/**
 * SuiteMigrate AI conversion engine
 * Core IP: engineered system prompt + conversion logic
 *
 * Provider details are intentionally kept server-side only.
 * No provider name is returned to clients in any response field.
 */

import { GoogleGenAI } from "@google/genai"
import { preprocess, type PreprocessResult } from "./preprocessor"
import { postprocess } from "./postprocessor"
import { SS1_TO_21_MAPPINGS } from "./api-mappings"

export interface ConversionInput {
  code: string
  scriptName?: string
}

export interface ConversionResult {
  convertedCode: string
  originalVersion: string
  scriptType: string
  confidenceScore: number
  changeLog: string[]
  manualReviewLines: number[]
  isValid: boolean
  validationErrors: string[]
  requiredModules: string[]
  detectedApiCalls: string[]
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Retry with exponential backoff — handles transient upstream failures.
 * Logs server-side only; callers receive a generic error.
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 2000
): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error: unknown) {
      lastError = error as Error
      const msg = error instanceof Error ? error.message : String(error)

      const shouldRetry =
        msg.includes("503") ||
        msg.includes("high demand") ||
        msg.includes("rate limit") ||
        msg.includes("quota")

      if (!shouldRetry || attempt === maxRetries - 1) throw error

      const delay = baseDelay * Math.pow(2, attempt)
      // Server-side log only — never surfaced to clients
      console.warn(`[engine] attempt ${attempt + 1} failed, retrying in ${delay}ms`)
      await sleep(delay)
    }
  }

  throw lastError
}

function buildApiMappingReference(): string {
  return SS1_TO_21_MAPPINGS.slice(0, 20)
    .map((m) => `  ${m.old}() → ${m.newCall} [${m.newModule}]`)
    .join("\n")
}

function buildSystemPrompt(preprocessResult: PreprocessResult): string {
  const { detectedVersion, detectedScriptType, detectedApiCalls, requiredModules } = preprocessResult

  const moduleList = requiredModules.length > 0
    ? requiredModules.map((m) => `'${m}'`).join(", ")
    : "'N/record', 'N/search', 'N/runtime', 'N/log'"

  return `You are an expert NetSuite SuiteScript migration engineer. Your task is to convert SuiteScript ${detectedVersion} code to SuiteScript 2.1.

## DETECTED SCRIPT INFO
- Source Version: SuiteScript ${detectedVersion}
- Script Type: ${detectedScriptType}
- API Calls Found: ${detectedApiCalls.join(", ") || "none detected"}
- Required Modules: ${moduleList}

## SUITESCRIPT 2.1 RULES — FOLLOW EXACTLY

### 1. File Header (always required)
\`\`\`javascript
/**
 * @NApiVersion 2.1
 * @NScriptType ${detectedScriptType}
 */
\`\`\`

### 2. AMD Module Structure (always required)
\`\`\`javascript
define([${moduleList}], function(/* module params */) {
  'use strict';
  // script body
  return { /* entry points */ };
});
\`\`\`

### 3. Entry Point Functions by Script Type
- UserEvent: beforeLoad(context), beforeSubmit(context), afterSubmit(context)
- Suitelet: onRequest(context) — use context.request / context.response
- ScheduledScript: execute(context)
- MapReduce: getInputData(), map(context), reduce(context), summarize(context)
- ClientScript: pageInit(context), fieldChanged(context), saveRecord(context)
- RESTlet: get(params), post(datain), put(datain), delete_(params)
- Portlet: render(params)
- MassUpdate: each(params)

### 4. SuiteScript 1.0 → 2.1 API Mappings (apply ALL of these)
${buildApiMappingReference()}

### 5. Variable Declarations
- Replace ALL \`var\` with \`const\` (for values that don't change) or \`let\` (for values that change)
- Never use \`var\`

### 6. Modern JavaScript (ES6+)
- Use arrow functions: \`const fn = (x) => x + 1\`
- Use template literals: \`\`Hello \${name}\`\`
- Use destructuring: \`const { id, type } = context.newRecord\`
- Use async/await instead of .then() chains

### 7. Inline Comments
For EVERY change you make, add an inline comment directly on that line:
\`\`\`javascript
const rec = record.load({ type: 'customer', id: customerId }); // MIGRATED: nlapiLoadRecord → record.load()
\`\`\`

### 8. Manual Review Flags
If a conversion is ambiguous or complex, add this comment:
\`\`\`javascript
// TODO: MANUAL REVIEW — original logic may need adjustment
\`\`\`

## CRITICAL RULES
1. NEVER remove or alter business logic — only modernise the syntax and API calls
2. NEVER add features that weren't in the original
3. ALWAYS preserve all original comments
4. ALWAYS output ONLY valid JavaScript — no markdown, no explanations outside comments
5. The output must be a complete, deployable SuiteScript 2.1 file
6. If you cannot confidently convert a specific call, flag it with TODO: MANUAL REVIEW

## OUTPUT FORMAT
Output ONLY the converted JavaScript code. No markdown code fences. No explanations before or after. Just the clean JS file.`
}

export async function convertScript(input: ConversionInput): Promise<ConversionResult> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error("[engine] AI_API_KEY not configured")
    throw new Error("AI service configuration error")
  }

  const requestedModel = process.env.GEMINI_MODEL || "gemini-3.8-flash"
  const fallbackModel  = process.env.GEMINI_FALLBACK_MODEL || "gemini-3.5-flash"
  const isProduction   = process.env.NODE_ENV === "production"

  const useModel =
    isProduction && /(preview|exp)/i.test(requestedModel)
      ? fallbackModel
      : requestedModel
  const MAX_TOKENS = 900_000

  if (estimatedTokens > MAX_TOKENS) {
    throw new Error(
      `Script too large: ~${Math.round(estimatedTokens / 1000)}K tokens ` +
      `(max ${Math.round(MAX_TOKENS / 1000)}K). Try splitting into smaller modules.`
    )
  }

  const preprocessResult = preprocess(input.code)
  const systemPrompt = buildSystemPrompt(preprocessResult)
  const userPrompt = `Convert this SuiteScript ${preprocessResult.detectedVersion} script to SuiteScript 2.1:\n\n${preprocessResult.code}`

  // Provider/model details stay server-side; never returned to clients.
  const ai = new GoogleGenAI({ apiKey })

  const generate = (model: string) =>
    ai.models.generateContent({
      model,
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.2,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 64000,
      },
    })

  let result
  try {
    result = await retryWithBackoff(() => generate(useModel), 3, 2000)
  } catch (primaryError) {
    if (fallbackModel === useModel) throw primaryError
    console.error(`[engine] Primary model unavailable; trying configured fallback.`)
    result = await retryWithBackoff(() => generate(fallbackModel), 2, 2000)
  }

  const rawOutput = result.text || ""

  const postResult = postprocess(
    rawOutput,
    preprocessResult.detectedApiCalls.length,
    preprocessResult.changeLog
  )

  return {
    convertedCode: postResult.code,
    originalVersion: preprocessResult.detectedVersion,
    scriptType: preprocessResult.detectedScriptType,
    confidenceScore: postResult.confidenceScore,
    changeLog: postResult.changeLog,
    manualReviewLines: postResult.manualReviewLines,
    isValid: postResult.isValid,
    validationErrors: postResult.validationErrors,
    requiredModules: preprocessResult.requiredModules,
    detectedApiCalls: preprocessResult.detectedApiCalls,
  }
}
