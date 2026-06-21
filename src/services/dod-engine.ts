// ============================================================
// M2M~Inc. Definition of Done Engine
// Cross-platform DoD standard — DART Skill System
// Enforces: FL/II Doctrine | VOICE-GATE | Trust/Liability Gate
// ============================================================

import type { DefinitionOfDone, DodCriteria, GateResults, OsLane } from "../types.js";

// -----------------------------------------------------------
// DoD Template Builder — per OS lane, per platform
// -----------------------------------------------------------

export function buildDodCriteria(
  skillId: string,
  osLane: OsLane,
  platform: DefinitionOfDone["platform"]
): DodCriteria {
  const base: DodCriteria = {
    functional: [
      `Skill ${skillId} executes without error on ${platform}`,
      "Input validation passes Zod/schema enforcement",
      "Output schema matches declared contract",
      "Error handling returns actionable, structured failure messages",
      "Idempotency confirmed — repeat execution produces identical result",
    ],
    compliance: [
      "No hardcoded secrets, keys, or credentials in output",
      "No status transition to approved_production without human_signature",
      "SAF entity never receives SDVOSB attribution in any output",
      "All DB writes carry trace_id — zero orphaned records",
      "OWASP Top 10 compliant code patterns only",
      "No curl * | bash or equivalent shell injection patterns",
    ],
    voice_gate: [
      "Output contains zero banned vocabulary (Anti-AI-Tell Doctrine v1.0)",
      "No filler phrases, no corporate boilerplate, no generic aesthetics",
      "Sovereign register confirmed — reads as M2M, not commodity AI output",
      "VOICE-GATE fires as Step 0 before Trust/Liability Gate",
      "No em-dash overuse, no listicle structure where prose is appropriate",
    ],
    trust_gate: [
      "Binary gate passes: output builds TRUST, not LIABILITY",
      "Must-Have 01 (Trust): earns the room before asking anything of it",
      "Must-Have 03 (Liability): no unverified claims, no overpromised outcomes",
      "Must-Have 05 (Intent): sovereign objective declared in first 30% of output",
      "Must-Have 06 (Intentional Intent): Architect's 20% is felt, not appended",
      "Must-Have 07 (Fractional Legitimacy): 80/20 split honored, FL/II authenticated",
    ],
    integration: [],
    audit_trail: [
      "trace_id present on every DB write and API call",
      "prometheus_audit_log entry created for every state transition",
      "workflow_run_id stamped when executed via n8n or Make.com",
      "Execution logged in dart_skill_executions table",
      "DoD status written to dart_definition_of_done on completion",
    ],
  };

  // -----------------------------------------------------------
  // OS Lane — specific functional criteria
  // -----------------------------------------------------------
  const laneOverrides: Record<OsLane, string[]> = {
    PIVOT_OS: [
      "Individual reinvention workflow path confirmed",
      "PIVOT OS intake → output pipeline tested end-to-end",
      "Trust/Liability Gate runs before delivery to individual",
    ],
    BRIDGE_OS: [
      "Employer/SMB transformation workflow path confirmed",
      "BRIDGE OS Judge Model (Make scenario 4677623) integration verified",
      "WF1 intake pipeline (scenario 4549097) VOICE-GATE enforced",
      "Seven Must-Haves confirmed on all ROI claims",
    ],
    HUMAN_OS: [
      "Enterprise/GovCon workflow path confirmed",
      "Full seven must-haves + C-suite distribution check on all board-level assets",
      "PROMETHEUS governance review triggered for enterprise state transitions",
      "SDVOSB attribution verified: M2M only — never SAF",
    ],
  };

  base.functional.push(...laneOverrides[osLane]);

  // -----------------------------------------------------------
  // Platform — specific integration criteria
  // -----------------------------------------------------------
  const platformIntegration: Record<DefinitionOfDone["platform"], string[]> = {
    SUPABASE: [
      "RLS policy fires — agent_worker role enforced",
      "processing_tier = agent_orchestrated scope confirmed",
      "Row-level security tested with explicit non-service_role credential",
      "Migration applied via supabase migration up",
      "All new tables have RLS enabled before data write",
    ],
    NOTION: [
      "Sovereign Command Hub page updated or created",
      "PROMETHEUS governance pages reflect current state",
      "DART Sovereign Skill Vault entry created/updated",
      "Notion MCP connection confirmed (mcp.notion.com/mcp)",
    ],
    MAKE: [
      "Scenario activated and scenario ID documented",
      "Webhook bind confirmed (DEL-004 pattern)",
      "Judge Model HTTP module fires Trust/Liability Gate pre-approval",
      "Error path routes to HUMAN_REQUIRED — not silent fail",
      "VOICE-GATE enforced before AUTO_APPROVE routing",
    ],
    N8N: [
      "Workflow node connections all verified — no orphaned nodes",
      "Error branch node present — silent failure not permitted",
      "AI agent output schema defined and structured",
      "Vector store wired to agent as named tool",
      "Write-back node updates status after assessment",
      "Webhook endpoint: POST /v1/workflows/procurement-engine confirmed live",
    ],
    VERCEL: [
      "Production deployment confirmed via GitHub Desktop push",
      "model2message.net stack healthy post-deploy",
      "Sovereign Command Dashboard (/sovereign) data feeds live",
      "No broken routes or 404s on mobile nav",
    ],
    GITHUB: [
      "MCP server pushed to Kali-Dedwen/drivenbydesign1-tech",
      "CLAUDE.md present in repo root",
      "governance.yaml present at .claude/governance.yaml",
      "README.md includes ultracode usage policy",
      "No hardcoded credentials in any committed file",
      ".env.example present — .env in .gitignore",
    ],
    OBSIDIAN: [
      "Vault entry created at correct path: C:\\Users\\kali-\\OneDrive\\Desktop\\claude-kevin\\M2M-Sovereign-Vault\\",
      "MCP bridge live at vault-bridge.model2message.net port 22360",
      "DART skill record created/updated in vault",
      "Internal links functional — no broken references",
    ],
  };

  base.integration.push(...platformIntegration[platform]);

  return base;
}

// -----------------------------------------------------------
// DoD Evaluator — runs gate checks against a skill's output
// -----------------------------------------------------------

export function evaluateGates(
  criteria: DodCriteria,
  evidence: Partial<Record<keyof DodCriteria, boolean[]>>
): GateResults {
  const evaluate = (key: keyof DodCriteria): boolean => {
    const evidenceArray = evidence[key];
    if (!evidenceArray || evidenceArray.length === 0) return false;
    return evidenceArray.every(Boolean);
  };

  const functional_pass = evaluate("functional");
  const compliance_pass = evaluate("compliance");
  const voice_gate_pass = evaluate("voice_gate");
  const trust_gate_pass = evaluate("trust_gate");
  const integration_pass = evaluate("integration");
  const audit_trail_pass = evaluate("audit_trail");

  return {
    functional_pass,
    compliance_pass,
    voice_gate_pass,
    trust_gate_pass,
    integration_pass,
    audit_trail_pass,
    all_pass:
      functional_pass &&
      compliance_pass &&
      voice_gate_pass &&
      trust_gate_pass &&
      integration_pass &&
      audit_trail_pass,
  };
}

// -----------------------------------------------------------
// DoD Summary Formatter — human-readable status report
// -----------------------------------------------------------

export function formatDodReport(dods: DefinitionOfDone[]): string {
  if (dods.length === 0) return "No DoD records found for this skill.";

  const lines: string[] = [
    `DEFINITION OF DONE — ${dods[0].skill_id} | ${dods[0].os_lane}`,
    "=".repeat(60),
    "",
  ];

  for (const dod of dods) {
    const g = dod.gate_results;
    const status = dod.dod_status === "COMPLETE" ? "✅ COMPLETE" :
                   dod.dod_status === "BLOCKED" ? "🚫 BLOCKED" : "⏳ INCOMPLETE";

    lines.push(`Platform: ${dod.platform} — ${status}`);
    lines.push(`  Functional:   ${g.functional_pass ? "PASS" : "FAIL"}`);
    lines.push(`  Compliance:   ${g.compliance_pass ? "PASS" : "FAIL"}`);
    lines.push(`  VOICE-GATE:   ${g.voice_gate_pass ? "PASS" : "FAIL"}`);
    lines.push(`  Trust Gate:   ${g.trust_gate_pass ? "PASS" : "FAIL"}`);
    lines.push(`  Integration:  ${g.integration_pass ? "PASS" : "FAIL"}`);
    lines.push(`  Audit Trail:  ${g.audit_trail_pass ? "PASS" : "FAIL"}`);
    if (dod.completed_at) lines.push(`  Completed:    ${dod.completed_at}`);
    lines.push("");
  }

  const allComplete = dods.every(d => d.dod_status === "COMPLETE");
  lines.push(allComplete
    ? "FL/II authenticated — To the work."
    : "Gate failures present — do not ship until all platforms pass."
  );

  return lines.join("\n");
}
