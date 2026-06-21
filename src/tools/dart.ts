// ============================================================
// M2M~Inc. MCP Tools — DART Skill System + Definition of Done
// SKL-001 through SKL-012 | Cross-platform DoD enforcement
// VOICE-GATE Step 0 | Trust/Liability Gate enforced
// ============================================================

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { supabaseService, generateTraceId } from "../services/supabase.js";
import {
  buildDodCriteria,
  evaluateGates,
  formatDodReport,
} from "../services/dod-engine.js";
import type { DefinitionOfDone, OsLane } from "../types.js";

const DART_SKILL_IDS = [
  "SKL-001", "SKL-002", "SKL-003", "SKL-004",
  "SKL-005", "SKL-006", "SKL-007", "SKL-008",
  "SKL-009", "SKL-010", "SKL-011", "SKL-012",
] as const;

const PLATFORMS = [
  "SUPABASE", "NOTION", "MAKE", "N8N", "VERCEL", "GITHUB", "OBSIDIAN",
] as const;

const OS_LANES = ["PIVOT_OS", "BRIDGE_OS", "HUMAN_OS"] as const;

export function registerDartTools(server: McpServer): void {

  // -----------------------------------------------------------
  // Tool: dart_log_skill_execution
  // Logs a DART skill execution with gate results
  // -----------------------------------------------------------
  server.registerTool(
    "dart_log_skill_execution",
    {
      title: "Log DART Skill Execution",
      description: "Records a DART Sovereign Skill System execution event. Captures OS lane, gate results (VOICE-GATE + Trust/Liability Gate), and execution status. All skill outputs must pass both gates before status can be COMPLETE.",
      inputSchema: {
        skill_id: z.enum(DART_SKILL_IDS).describe("DART skill identifier SKL-001 through SKL-012"),
        os_lane: z.enum(OS_LANES).describe("Operating system lane: PIVOT_OS | BRIDGE_OS | HUMAN_OS"),
        input_payload: z.record(z.unknown()).describe("Input data provided to the skill"),
        output_result: z.record(z.unknown()).optional().describe("Output produced by the skill"),
        trust_gate_passed: z.boolean().describe("Trust/Liability Gate result — all Seven Must-Haves must pass"),
        voice_gate_passed: z.boolean().describe("VOICE-GATE result — Anti-AI-Tell Doctrine v1.0 enforced"),
        execution_status: z.enum([
          "PENDING", "RUNNING", "COMPLETE", "FAILED", "HUMAN_REQUIRED",
        ]).describe("Current execution status"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async ({ skill_id, os_lane, input_payload, output_result, trust_gate_passed, voice_gate_passed, execution_status }) => {
      // Enforce: cannot be COMPLETE if gates failed
      if (execution_status === "COMPLETE" && (!trust_gate_passed || !voice_gate_passed)) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              success: false,
              error: "BLOCKED: Execution status cannot be COMPLETE when Trust Gate or VOICE-GATE has failed. Route to HUMAN_REQUIRED.",
              trace_id: generateTraceId(),
            }, null, 2),
          }],
        };
      }

      const traceId = generateTraceId();
      const result = await supabaseService.logSkillExecution({
        skill_id,
        os_lane,
        input_payload,
        output_result,
        trust_gate_passed,
        voice_gate_passed,
        execution_status,
        trace_id: traceId,
      });

      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        structuredContent: result,
      };
    }
  );

  // -----------------------------------------------------------
  // Tool: dart_build_dod
  // Generates DoD criteria for a skill/platform/lane combination
  // -----------------------------------------------------------
  server.registerTool(
    "dart_build_dod",
    {
      title: "Build Definition of Done Criteria",
      description: "Generates the complete Definition of Done criteria set for a DART skill across a specific platform and OS lane. Includes functional, compliance, VOICE-GATE, Trust Gate, integration, and audit trail requirements. Use this before implementing any skill to understand all exit criteria.",
      inputSchema: {
        skill_id: z.string().describe("DART skill identifier (SKL-001 through SKL-012 or custom)"),
        os_lane: z.enum(OS_LANES).describe("Operating system lane"),
        platform: z.enum(PLATFORMS).describe("Target platform for this DoD instance"),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ skill_id, os_lane, platform }) => {
      const criteria = buildDodCriteria(skill_id, os_lane as OsLane, platform);
      const response = {
        skill_id,
        os_lane,
        platform,
        criteria,
        total_criteria_count:
          criteria.functional.length +
          criteria.compliance.length +
          criteria.voice_gate.length +
          criteria.trust_gate.length +
          criteria.integration.length +
          criteria.audit_trail.length,
        generated_at: new Date().toISOString(),
      };

      return {
        content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
        structuredContent: response,
      };
    }
  );

  // -----------------------------------------------------------
  // Tool: dart_submit_dod
  // Persists DoD completion status to Supabase
  // -----------------------------------------------------------
  server.registerTool(
    "dart_submit_dod",
    {
      title: "Submit Definition of Done Status",
      description: "Persists a DoD gate evaluation for a skill/platform combination to the dart_definition_of_done table. All six gate layers must pass before dod_status can be COMPLETE. Upserts on skill_id + platform — safe to call repeatedly as gates are completed.",
      inputSchema: {
        skill_id: z.string().describe("DART skill identifier"),
        os_lane: z.enum(OS_LANES).describe("Operating system lane"),
        platform: z.enum(PLATFORMS).describe("Platform being evaluated"),
        gate_results: z.object({
          functional_pass: z.boolean(),
          compliance_pass: z.boolean(),
          voice_gate_pass: z.boolean(),
          trust_gate_pass: z.boolean(),
          integration_pass: z.boolean(),
          audit_trail_pass: z.boolean(),
        }).describe("Results for all six gate layers"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ skill_id, os_lane, platform, gate_results }) => {
      const all_pass =
        gate_results.functional_pass &&
        gate_results.compliance_pass &&
        gate_results.voice_gate_pass &&
        gate_results.trust_gate_pass &&
        gate_results.integration_pass &&
        gate_results.audit_trail_pass;

      const criteria = buildDodCriteria(skill_id, os_lane as OsLane, platform);

      const dod: DefinitionOfDone = {
        skill_id,
        platform,
        os_lane: os_lane as OsLane,
        criteria,
        gate_results: { ...gate_results, all_pass },
        dod_status: all_pass ? "COMPLETE" : "INCOMPLETE",
        completed_at: all_pass ? new Date().toISOString() : undefined,
      };

      const result = await supabaseService.upsertDod(dod);

      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        structuredContent: result,
      };
    }
  );

  // -----------------------------------------------------------
  // Tool: dart_get_dod_status
  // Returns DoD status across all platforms for a skill
  // -----------------------------------------------------------
  server.registerTool(
    "dart_get_dod_status",
    {
      title: "Get Definition of Done Status",
      description: "Returns the current DoD status for a DART skill across all platforms. Generates a formatted report showing gate pass/fail status per platform. A skill is fully done only when all platforms show COMPLETE.",
      inputSchema: {
        skill_id: z.string().describe("DART skill identifier to check"),
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async ({ skill_id }) => {
      const result = await supabaseService.getDodStatus(skill_id);

      if (!result.success || !result.data) {
        return {
          content: [{ type: "text", text: `DoD status lookup failed: ${result.error}` }],
        };
      }

      const report = formatDodReport(result.data);
      const summary = {
        skill_id,
        platforms_evaluated: result.data.length,
        platforms_complete: result.data.filter(d => d.dod_status === "COMPLETE").length,
        platforms_blocked: result.data.filter(d => d.dod_status === "BLOCKED").length,
        fully_done: result.data.every(d => d.dod_status === "COMPLETE"),
        report,
      };

      return {
        content: [{ type: "text", text: report }],
        structuredContent: summary,
      };
    }
  );
}
