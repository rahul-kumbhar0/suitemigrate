/**
 * Customer-facing source access groups.
 * "Locked" means not available for automatic conversion under the current
 * NetSuite role. It also includes missing files and manual-source cases;
 * descriptions retain the exact reason instead of claiming vendor protection.
 *
 * Do not classify unknown/unverified scripts as unlocked or locked.
 * A script already on 2.1 needs no migration and is displayed separately.
 */
import type { NSScript } from "./types"

export type SourceGroup = "unlocked" | "locked" | "checking" | "current"

export function getSourceGroup(script: NSScript): SourceGroup {
  if (!script.needsMigration) return "current"
  if (script.sourceAccess === "readable") return "unlocked"
  if (script.sourceAccess === "protected" ||
      script.sourceAccess === "restricted" ||
      script.sourceAccess === "no_file" ||
      script.sourceAccess === "manual") return "locked"
  return "checking"
}
