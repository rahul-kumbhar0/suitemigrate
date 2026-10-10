"use client"

import { useState } from "react"
import { ArrowRight, Check, ClipboardCopy, Code2, FileCheck2, LockKeyhole, ShieldCheck } from "lucide-react"

type MigrationExample = {
  id: string
  title: string
  filename: string
  original: string
  migrated: string
  changes: string[]
}

const examples: MigrationExample[] = [
  {
    id: "user-event",
    title: "User Event",
    filename: "customer_beforeload.js",
    original: [
      "// SuiteScript 1.0 — User Event",
      "function beforeLoad(type, form) {",
      "  if (type !== 'view') return;",
      "  var rec = nlapiGetNewRecord();",
      "  var entityId = rec.getFieldValue('entity');",
      "  nlapiLogExecution('AUDIT', 'Entity', entityId);",
      "}",
    ].join("\n"),
    migrated: [
      "/**",
      " * @NApiVersion 2.1",
      " * @NScriptType UserEventScript",
      " */",
      "define(['N/log'], (log) => {",
      "  const beforeLoad = (context) => {",
      "    if (context.type !== context.UserEventType.VIEW) return;",
      "    const entityId = context.newRecord.getValue({",
      "      fieldId: 'entity'",
      "    });",
      "    log.audit({ title: 'Entity', details: entityId });",
      "  };",
      "  return { beforeLoad };",
      "});",
    ].join("\n"),
    changes: [
      "Uses the 2.1 User Event context instead of 1.0 arguments",
      "Reads the active record through context.newRecord",
      "Replaces nlapiLogExecution with N/log.audit",
      "Adds the required module wrapper and 2.1 annotations",
    ],
  },
  {
    id: "scheduled",
    title: "Scheduled Script",
    filename: "customer_scheduled.js",
    original: [
      "// SuiteScript 1.0 — Scheduled",
      "function scheduled(type) {",
      "  var customer = nlapiLoadRecord('customer', 123);",
      "  var name = customer.getFieldValue('companyname');",
      "  nlapiLogExecution('AUDIT', 'Name', name);",
      "}",
    ].join("\n"),
    migrated: [
      "/**",
      " * @NApiVersion 2.1",
      " * @NScriptType ScheduledScript",
      " */",
      "define(['N/record', 'N/log'], (record, log) => {",
      "  const execute = () => {",
      "    const customer = record.load({",
      "      type: record.Type.CUSTOMER, id: 123",
      "    });",
      "    const name = customer.getValue({",
      "      fieldId: 'companyname'",
      "    });",
      "    log.audit({ title: 'Name', details: name });",
      "  };",
      "  return { execute };",
      "});",
    ].join("\n"),
    changes: [
      "Uses the 2.1 ScheduledScript execute entry point",
      "Replaces nlapiLoadRecord with N/record.load",
      "Replaces getFieldValue with getValue",
      "Uses N/log and the 2.1 module wrapper",
    ],
  },
]

function CodePanel({ title, subtitle, code, after }: { title: string; subtitle: string; code: string; after?: boolean }) {
  return (
    <div className="sm-code-panel">
      <div className="sm-code-header">
        <div>
          <div className="sm-code-label">{title}</div>
          <div className="sm-code-subtitle">{subtitle}</div>
        </div>
        <span className={after ? "sm-code-pill sm-code-pill-after" : "sm-code-pill"}>
          {after ? "2.1 migration draft" : "legacy source"}
        </span>
      </div>
      <div className="sm-code-body" role="region" aria-label={title + " code example"} tabIndex={0}>
        {code.split("\n").map((line, i) => (
          <div className="sm-code-line" key={i}>
            <span className="sm-code-number" aria-hidden="true">{i + 1}</span>
            <span className={line.trim().startsWith("//") || line.trim().startsWith("*") ? "sm-code-comment" : ""}>{line || " "}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function MigrationCodeDemo() {
  const [selected, setSelected] = useState(examples[0].id)
  const [copied, setCopied] = useState(false)
  const example = examples.find(item => item.id === selected) || examples[0]

  const copyExample = async () => {
    try {
      await navigator.clipboard.writeText(example.migrated)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section id="code-example" className="sm-demo-section" aria-labelledby="sm-demo-heading">
      <div className="landing-section-padding">
        <div className="sm-demo-intro">
          <div>
            <span className="eyebrow">See an actual API migration pattern</span>
            <h2 id="sm-demo-heading" className="sm-demo-title">
              Legacy source. <em>Readable 2.1.</em>
            </h2>
          </div>
          <p>
            Explore two small, illustrative SuiteScript migration patterns. Real scripts require
            developer review, NetSuite Sandbox testing, and verification of business behavior.
          </p>
        </div>

        <div className="sm-demo-switcher" role="group" aria-label="Choose a code migration example">
          {examples.map(item => (
            <button
              key={item.id}
              type="button"
              className={selected === item.id ? "sm-demo-option active" : "sm-demo-option"}
              aria-pressed={selected === item.id}
              onClick={() => { setSelected(item.id); setCopied(false) }}
            >
              <Code2 size={14} /> {item.title}
            </button>
          ))}
          <span className="sm-demo-filename">{example.filename}</span>
        </div>

        <div className="sm-compare-grid">
          <CodePanel key={example.id + "-before"} title="Before" subtitle="SuiteScript 1.0" code={example.original} />
          <CodePanel key={example.id + "-after"} title="After" subtitle="SuiteScript 2.1" code={example.migrated} after />
        </div>

        <div className="sm-demo-bottom">
          <div className="sm-demo-changes">
            <span className="sm-demo-kicker">What changes in this example</span>
            <div className="sm-demo-change-grid">
              {example.changes.map(change => (
                <div className="sm-demo-change" key={change}>
                  <Check size={14} aria-hidden="true" />
                  <span>{change}</span>
                </div>
              ))}
            </div>
          </div>
          <button type="button" onClick={copyExample} className="sm-copy-code">
            {copied ? <Check size={15} /> : <ClipboardCopy size={15} />}
            {copied ? "Copied 2.1 example" : "Copy 2.1 example"}
          </button>
        </div>
        <p className="sm-demo-disclaimer">
          Illustrative, hand-reviewed examples—not live SuiteMigrate outputs or a guarantee of automatic correctness.
          The extension produces reviewable migration drafts; it never deploys to NetSuite.
        </p>
      </div>
    </section>
  )
}

export function ReadinessReportPreview() {
  return (
    <div className="sm-report-preview" aria-label="Illustrative migration readiness report preview">
      <div className="sm-report-top">
        <span className="sm-report-brand"><span className="sm-report-dot" /> SuiteMigrate</span>
        <span className="sm-report-example">Illustrative report preview</span>
      </div>
      <div className="sm-report-content">
        <span className="sm-report-eyebrow">Migration readiness · Sample workspace</span>
        <h3>Know what can move.<br /><em>Know what is blocked.</em></h3>
        <p className="sm-report-lede">Scan results classified under the active NetSuite role. No source code in the report.</p>
        <div className="sm-report-metrics">
          <div><strong>24</strong><span>Scripts</span></div>
          <div><strong>9</strong><span>Legacy</span></div>
          <div><strong>5</strong><span>Readable</span></div>
          <div><strong>2</strong><span>Blocked</span></div>
          <div><strong>2</strong><span>Unverified</span></div>
        </div>
        <div className="sm-report-list">
          <div><FileCheck2 size={15} /><span>Customer User Event</span><span className="sm-status ready">Readable</span></div>
          <div><LockKeyhole size={15} /><span>Vendor integration</span><span className="sm-status blocked">Protected</span></div>
          <div><ShieldCheck size={15} /><span>Scheduled cleanup</span><span className="sm-status unknown">Unverified</span></div>
        </div>
        <div className="sm-report-footer">HTML/PDF report · Pro inventory CSV · Read-only analysis</div>
      </div>
    </div>
  )
}
