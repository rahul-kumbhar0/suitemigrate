/**
 * SuiteMigrate AI conversion engine
 * Core IP: engineered system prompt + conversion logic
 *
 * Provider details are intentionally kept server-side only.
 * No provider name is returned to clients in any response field.
 */

import { GoogleGenerativeAI } from "@google/generative-ai"
import { preprocess, type PreprocessResult } from "./preprocessor"
import { postprocess } from "./postprocessor"
import { SS1_TO_21_MAPPINGS } from "./api-mappings"
import { modelCandidates, modelFailure, canTryAnotherModel, selectGeminiCredential } from "./model-routing"

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
  modelName: string
): Promise<T> {
  // Only retry transient service errors once. A hard quota/429 must go to
  // a different approved model (if available) rather than repeatedly hammer
  // the same quota, and invalid credentials must not trigger provider hopping.
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn()
    } catch (error: unknown) {
      const failure = modelFailure(error)
      if (failure !== "transient" || attempt >= 1) throw error
      console.warn("[engine] transient upstream failure", {
        model: modelName, attempt: attempt + 1,
      })
      await sleep(1000)
    }
  }
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

### 5. Preserve JavaScript Semantics
- Change var to const/let ONLY when hoisting, scope, mutation, and closure behavior are preserved.
- Do not change function declarations, this-binding, promise handling, or execution order just for style.
- Keep synchronous NetSuite entry points synchronous unless the original API and NetSuite runtime explicitly support an asynchronous pattern.
- Never invent async/await migrations, new API methods, or N/* modules.

### 6. Source-Level Migration Discipline
- Only modify code where required for SuiteScript 2.1 compatibility.
- Preserve business rules, governance handling, query filters, runtime behavior, error paths, and entry-point contracts.
- Validate that the actual N/* replacement API supports the exact parameters/return values.
- For unsupported or ambiguous APIs, preserve the logic as much as possible and add a TODO: MANUAL REVIEW comment rather than guessing.

### 7. Review Notes
- Add short MIGRATED: comments for important changed APIs, but do not add comments that would break syntax or change output.
- Explain ambiguities with // TODO: MANUAL REVIEW and preserve original intent.
- Do not claim conversion has passed NetSuite runtime or business-logic testing.

### 8. Completeness
- Keep file header, @NScriptType and all originally supported entry points.
- Preserve original comments where possible and the full script body.
- Avoid unnecessary new dependencies and minimize code movement.

## CRITICAL RULES
1. NEVER intentionally alter business logic or add unrequested features.
2. NEVER guess API mappings or behavior. Flag unsupported cases for manual review.
3. Output ONLY JavaScript; no markdown, no explanations outside comments.
4. Include a complete SuiteScript 2.1 migration draft, not a claim of production deployment readiness.
5. Keep NetSuite module calls, sublist/subrecord APIs, and execution context semantics intact.
6. Explicitly flag potentially incompatible calls and test requirements.

## OUTPUT FORMAT
Output ONLY the converted JavaScript code. No markdown code fences. No explanations before or after. Just the clean JS file.`
}

export async function convertScript(input: ConversionInput): Promise<ConversionResult> {
  const credential = selectGeminiCredential(process.env)
  if (!credential) {
    console.error("[engine] No server-side Gemini API credential configured")
    throw new Error("AI service configuration error")
  }

  const candidates = modelCandidates(process.env)
  if (!candidates.length) {
    throw new Error("AI service configuration error: no approved model configured")
  }
  const MAX_TOKENS = 900_000
  // Conservative character-based estimate used only as an early size guard.
  const estimatedTokens = Math.ceil(input.code.length / 4)

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
  // Keep the legacy SDK for this release; migrate SDK + lockfile together later.
  const genAI = new GoogleGenerativeAI(credential.value)

  const generate = async (modelName: string) => {
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: systemPrompt,
      generationConfig: {
        temperature: 0.2,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 64000,
      },
    })
    return model.generateContent(userPrompt)
  }

  // Key2 takes precedence when provided. This is a deliberate key
  // replacement, not a quota-bypass strategy: one key is used per conversion.
  // Never log, expose or cycle API credentials in conversion responses.
  // No cross-provider routing: every model uses the same explicitly approved
  // Gemini project and the same privacy terms. No new API keys are sent to
  // Chrome. If all models hit a project-level quota, conversion fails safely.
  let rawOutput = ""
  for (const [index, modelName] of candidates.entries()) {
    try {
      const result = await retryWithBackoff(() => generate(modelName), modelName)
      rawOutput = result.response.text()
      if (!rawOutput.trim()) {
        throw new Error("AI service returned an empty response")
      }
      break
    } catch (error: unknown) {
      const failure = modelFailure(error)
      console.warn("[engine] model attempt failed", {
        model: modelName, failure, fallbackAvailable: index < candidates.length - 1,
      })
      if (index === candidates.length - 1 || !canTryAnotherModel(failure)) throw error
    }
  }

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
