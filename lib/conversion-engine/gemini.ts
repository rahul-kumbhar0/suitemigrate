/**
 * Gemini 2.0 Flash conversion engine
 * Core IP: engineered system prompt + conversion logic
 */

import { GoogleGenerativeAI } from "@google/generative-ai"
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
1. NEVER remove or alter business logic — only modernize the syntax and API calls
2. NEVER add features that weren't in the original
3. ALWAYS preserve all original comments
4. ALWAYS output ONLY valid JavaScript — no markdown, no explanations outside comments
5. The output must be a complete, deployable SuiteScript 2.1 file
6. If you cannot confidently convert a specific call, flag it with TODO: MANUAL REVIEW

## OUTPUT FORMAT
Output ONLY the converted JavaScript code. No markdown code fences. No explanations before or after. Just the clean JS file.`
}

export async function convertScript(input: ConversionInput): Promise<ConversionResult> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured")
  }

  // Step 1: Preprocess
  const preprocessResult = preprocess(input.code)

  // Step 2: Build Gemini prompt
  const systemPrompt = buildSystemPrompt(preprocessResult)
  const userPrompt = `Convert this SuiteScript ${preprocessResult.detectedVersion} script to SuiteScript 2.1:\n\n${preprocessResult.code}`

  // Step 3: Call Gemini
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-3.6-flash",
    systemInstruction: systemPrompt,
  })

  const result = await model.generateContent(userPrompt)
  const rawOutput = result.response.text()

  // Step 4: Postprocess
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
