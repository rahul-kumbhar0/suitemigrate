/**
 * SuiteScript 1.0 → 2.1 API Mappings
 * Complete lookup table of deprecated SS 1.0 functions → modern equivalents
 */

export interface ApiMapping {
  old: string
  newModule: string
  newCall: string
  description: string
  requiresAwait?: boolean
  isComplex?: boolean // needs manual review
}

export const SS1_TO_21_MAPPINGS: ApiMapping[] = [
  // ── Record Operations ──────────────────────────────────────────────
  {
    old: "nlapiLoadRecord",
    newModule: "N/record",
    newCall: "record.load({ type: $1, id: $2 })",
    description: "Load a NetSuite record",
  },
  {
    old: "nlapiCreateRecord",
    newModule: "N/record",
    newCall: "record.create({ type: $1 })",
    description: "Create a new NetSuite record",
  },
  {
    old: "nlapiSubmitRecord",
    newModule: "N/record",
    newCall: "record.save()",
    description: "Submit/save a record",
  },
  {
    old: "nlapiDeleteRecord",
    newModule: "N/record",
    newCall: "record.delete({ type: $1, id: $2 })",
    description: "Delete a record",
  },
  {
    old: "nlapiCopyRecord",
    newModule: "N/record",
    newCall: "record.copy({ type: $1, id: $2 })",
    description: "Copy a record",
  },
  {
    old: "nlapiTransformRecord",
    newModule: "N/record",
    newCall: "record.transform({ fromType: $1, fromId: $2, toType: $3 })",
    description: "Transform a record to another type",
  },
  {
    old: "nlapiSubmitField",
    newModule: "N/record",
    newCall: "record.submitFields({ type: $1, id: $2, values: { $3: $4 } })",
    description: "Submit individual field values",
  },
  {
    old: "nlapiGetFieldValue",
    newModule: "N/record",
    newCall: "currentRecord.getValue({ fieldId: '$1' })",
    description: "Get field value from current record",
  },
  {
    old: "nlapiSetFieldValue",
    newModule: "N/record",
    newCall: "currentRecord.setValue({ fieldId: '$1', value: $2 })",
    description: "Set field value on current record",
  },
  {
    old: "nlapiGetFieldText",
    newModule: "N/record",
    newCall: "currentRecord.getText({ fieldId: '$1' })",
    description: "Get display text of a field",
  },
  {
    old: "nlapiSetFieldText",
    newModule: "N/record",
    newCall: "currentRecord.setText({ fieldId: '$1', text: $2 })",
    description: "Set display text of a field",
  },
  {
    old: "nlapiGetLineItemValue",
    newModule: "N/record",
    newCall: "currentRecord.getSublistValue({ sublistId: '$1', fieldId: '$2', line: $3 })",
    description: "Get sublist line item value",
  },
  {
    old: "nlapiSetLineItemValue",
    newModule: "N/record",
    newCall: "currentRecord.setSublistValue({ sublistId: '$1', fieldId: '$2', line: $3, value: $4 })",
    description: "Set sublist line item value",
  },
  {
    old: "nlapiGetLineItemCount",
    newModule: "N/record",
    newCall: "currentRecord.getLineCount({ sublistId: '$1' })",
    description: "Get number of lines in a sublist",
  },
  {
    old: "nlapiInsertLineItem",
    newModule: "N/record",
    newCall: "currentRecord.insertLine({ sublistId: '$1', line: $2 })",
    description: "Insert a line in a sublist",
  },
  {
    old: "nlapiRemoveLineItem",
    newModule: "N/record",
    newCall: "currentRecord.removeLine({ sublistId: '$1', line: $2 })",
    description: "Remove a line from a sublist",
  },
  {
    old: "nlapiSelectNewLineItem",
    newModule: "N/record",
    newCall: "currentRecord.selectNewLine({ sublistId: '$1' })",
    description: "Select a new line in a sublist",
  },
  {
    old: "nlapiCommitLineItem",
    newModule: "N/record",
    newCall: "currentRecord.commitLine({ sublistId: '$1' })",
    description: "Commit the current sublist line",
  },

  // ── Search Operations ──────────────────────────────────────────────
  {
    old: "nlapiSearchRecord",
    newModule: "N/search",
    newCall: "search.create({ type: $1, filters: $2, columns: $3 }).run().getRange({ start: 0, end: 1000 })",
    description: "Search for records",
    isComplex: true,
  },
  {
    old: "nlapiCreateSearch",
    newModule: "N/search",
    newCall: "search.create({ type: $1, filters: $2, columns: $3 })",
    description: "Create a search object",
  },
  {
    old: "nlapiLoadSearch",
    newModule: "N/search",
    newCall: "search.load({ id: '$1' })",
    description: "Load a saved search",
  },
  {
    old: "nlapiLookupField",
    newModule: "N/search",
    newCall: "search.lookupFields({ type: $1, id: $2, columns: [$3] })",
    description: "Look up field values on a record",
  },

  // ── Context & Runtime ──────────────────────────────────────────────
  {
    old: "nlapiGetContext",
    newModule: "N/runtime",
    newCall: "runtime.getCurrentScript()",
    description: "Get current script context",
  },
  {
    old: "nlapiGetUser",
    newModule: "N/runtime",
    newCall: "runtime.getCurrentUser()",
    description: "Get current logged-in user",
  },
  {
    old: "nlapiGetRole",
    newModule: "N/runtime",
    newCall: "runtime.getCurrentUser().role",
    description: "Get current user role",
  },
  {
    old: "nlapiGetDepartment",
    newModule: "N/runtime",
    newCall: "runtime.getCurrentUser().department",
    description: "Get current user department",
  },
  {
    old: "nlapiGetSubsidiary",
    newModule: "N/runtime",
    newCall: "runtime.getCurrentUser().subsidiary",
    description: "Get current user subsidiary",
  },
  {
    old: "nlapiGetRecordType",
    newModule: "N/currentRecord",
    newCall: "currentRecord.type",
    description: "Get current record type",
  },
  {
    old: "nlapiGetRecordId",
    newModule: "N/currentRecord",
    newCall: "currentRecord.id",
    description: "Get current record ID",
  },

  // ── Email & Communication ──────────────────────────────────────────
  {
    old: "nlapiSendEmail",
    newModule: "N/email",
    newCall: "email.send({ author: $1, recipients: $2, subject: $3, body: $4 })",
    description: "Send an email",
  },
  {
    old: "nlapiSendFax",
    newModule: "N/email",
    newCall: "email.sendBulk({ author: $1, recipients: $2, subject: $3, body: $4 })",
    description: "Send a fax",
    isComplex: true,
  },

  // ── HTTP / URL ─────────────────────────────────────────────────────
  {
    old: "nlapiRequestURL",
    newModule: "N/https",
    newCall: "https.get({ url: $1 })",
    description: "Make an HTTP GET request",
  },
  {
    old: "nlapiRequestURLWithCredentials",
    newModule: "N/https",
    newCall: "https.get({ url: $1, credentials: $2 })",
    description: "HTTP request with credentials",
    isComplex: true,
  },
  {
    old: "nlapiResolveURL",
    newModule: "N/url",
    newCall: "url.resolveRecord({ recordType: $1, recordId: $2 })",
    description: "Resolve a URL for a record",
  },

  // ── File & Folder ──────────────────────────────────────────────────
  {
    old: "nlapiLoadFile",
    newModule: "N/file",
    newCall: "file.load({ id: $1 })",
    description: "Load a file from the file cabinet",
  },
  {
    old: "nlapiCreateFile",
    newModule: "N/file",
    newCall: "file.create({ name: $1, fileType: $2, contents: $3 })",
    description: "Create a new file",
  },
  {
    old: "nlapiDeleteFile",
    newModule: "N/file",
    newCall: "file.delete({ id: $1 })",
    description: "Delete a file",
  },

  // ── XML ────────────────────────────────────────────────────────────
  {
    old: "nlapiStringToXML",
    newModule: "N/xml",
    newCall: "xml.Parser.fromString({ text: $1 })",
    description: "Parse XML string",
  },
  {
    old: "nlapiXMLToString",
    newModule: "N/xml",
    newCall: "xml.Serializer.asString({ node: $1 })",
    description: "Serialize XML to string",
  },
  {
    old: "nlapiSelectValue",
    newModule: "N/xml",
    newCall: "xml.XPath.select({ node: $1, xpath: $2 })",
    description: "XPath select",
    isComplex: true,
  },

  // ── Format / Number ────────────────────────────────────────────────
  {
    old: "nlapiFormatCurrency",
    newModule: "N/format",
    newCall: "format.format({ value: $1, type: format.Type.CURRENCY })",
    description: "Format currency value",
  },
  {
    old: "nlapiFormatDate",
    newModule: "N/format",
    newCall: "format.format({ value: $1, type: format.Type.DATE })",
    description: "Format date value",
  },
  {
    old: "nlapiStringToDate",
    newModule: "N/format",
    newCall: "format.parse({ value: $1, type: format.Type.DATE })",
    description: "Parse date string",
  },
  {
    old: "nlapiDateToString",
    newModule: "N/format",
    newCall: "format.format({ value: $1, type: format.Type.DATE })",
    description: "Convert date to string",
  },

  // ── Logging ────────────────────────────────────────────────────────
  {
    old: "nlapiLogExecution",
    newModule: "N/log",
    newCall: "log.debug({ title: $1, details: $2 })",
    description: "Log execution details",
  },

  // ── Scheduling / Governance ────────────────────────────────────────
  {
    old: "nlapiYieldScript",
    newModule: "N/runtime",
    newCall: "// NOTE: Use runtime.getCurrentScript().getRemainingUsage() to check governance",
    description: "Yield script execution",
    isComplex: true,
  },
  {
    old: "nlapiGetRemainingUsage",
    newModule: "N/runtime",
    newCall: "runtime.getCurrentScript().getRemainingUsage()",
    description: "Get remaining governance units",
  },
  {
    old: "nlapiScheduleScript",
    newModule: "N/task",
    newCall: "task.create({ taskType: task.TaskType.SCHEDULED_SCRIPT, scriptId: $1 }).submit()",
    description: "Schedule a script",
  },

  // ── UI / Portlet ───────────────────────────────────────────────────
  {
    old: "nlapiCreateForm",
    newModule: "N/ui/serverWidget",
    newCall: "serverWidget.createForm({ title: $1 })",
    description: "Create a UI form",
  },
  {
    old: "nlapiCreateList",
    newModule: "N/ui/serverWidget",
    newCall: "serverWidget.createList({ title: $1 })",
    description: "Create a UI list",
  },
  {
    old: "nlapiCreateAssistant",
    newModule: "N/ui/serverWidget",
    newCall: "serverWidget.createAssistant({ title: $1 })",
    description: "Create a UI assistant",
  },
]

// Quick lookup map: old function name → mapping
export const MAPPING_LOOKUP = new Map<string, ApiMapping>(
  SS1_TO_21_MAPPINGS.map((m) => [m.old, m])
)

// All unique modules required
export function getRequiredModules(code: string): string[] {
  const modules = new Set<string>()
  for (const mapping of SS1_TO_21_MAPPINGS) {
    if (code.includes(mapping.old)) {
      modules.add(mapping.newModule)
    }
  }
  return Array.from(modules)
}

// SS 2.0 → 2.1 modernization patterns
export const SS20_MODERNIZATION_RULES = [
  {
    pattern: /\bvar\b/g,
    description: "Replace var with const/let",
    suggestion: "const or let",
  },
  {
    pattern: /@NApiVersion\s+2\.0/g,
    description: "Update API version tag",
    suggestion: "@NApiVersion 2.1",
  },
  {
    pattern: /\.then\s*\(/g,
    description: "Promise .then() chains can use async/await",
    suggestion: "async/await",
    isComplex: true,
  },
  {
    pattern: /function\s*\(/g,
    description: "Anonymous functions can be arrow functions",
    suggestion: "() =>",
  },
]
