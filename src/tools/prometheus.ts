// ============================================================
// M2M~Inc. MCP Tools — PROMETHEUS Governance
// Auto-escalation triggers | Risk register | Audit log
// Hard rule: SAF never receives SDVOSB attribution
// ============================================================

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { supabaseService, generateTraceId } from "../services/supabase.js";

// Hard-blocked entity/certification combinations
const BLOCKED_ATTRIBUTIONS: Array<{ entity: string; cert: string }> = [
  { entity: "SAF", cert: "SDVOSB" },
  { entity: "Solutions Afoot LLC", cert: "SDVOSB" },
  { entity: "CENTERMARQ", cert: "SDVOSB" },
];

function checkAttributionBlock(entity: string, certifications: string[]): string | null {
  for (const blocked of BLOCKED_ATTRIBUTIONS) {
    if (
      entity.toUpperCase().includes(blocked.entity) &&
      certifications.some(c => c.toUpperCase().includes(blocked.cert))
    ) {
      return `BLOCKED: ${blocked.entity} cannot hold ${blocked.cert}. M2M~Inc. holds SDVOSB — SAF holds VBE + CAGE 9QVH2 ONLY. This is a hard governance rule, not a configuration.`;
    }
  }
  return null;
}

export function registerPrometheusTools(server: McpServer): void {

  // -----------------------------------------------------------
  // Tool: prometheus_create_review
  // Fires PROMETHEUS governance review for any entity event
  // -----------------------------------------------------------
  server.registerTool(
    "prometheus_create_review",
    {
      title: "Create PROMETHEUS Governance Review",
      description: "Triggers a PROMETHEUS governance review for an entity state change. Validates certification attributions — hard-blocks SAF from receiving SDVOSB in any review. Routes ESCALATE and HUMAN_REQUIRED status to human review queue.",
      inputSchema: {
        entity_type: z.enum(["SAF", "M2M", "CENTERMARQ"]).describe("Entity being reviewed"),
        entity_id: z.string().describe("Entity identifier or transaction ID"),
        trigger_event: z.string().describe("Event that triggered this review"),
        review_status: z.enum(["PASS", "FAIL", "ESCALATE", "HUMAN_REQUIRED"]).describe("Governance review outcome"),
        risk_score: z.number().min(0).max(100).describe("Risk score 0–100"),
        audit_notes: z.string().describe("Detailed audit notes — maps trigger to outcome"),
        certifications_claimed: z.array(z.string()).optional().describe("Certifications being attributed in this event — validated against governance rules"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async ({ entity_type, entity_id, trigger_event, review_status, risk_score, audit_notes, certifications_claimed }) => {
      // Hard attribution check
      if (certifications_claimed && certifications_claimed.length > 0) {
        const blockError = checkAttributionBlock(entity_type, certifications_claimed);
        if (blockError) {
          return {
            content: [{ type: "text", text: JSON.stringify({ success: false, error: blockError, trace_id: generateTraceId() }, null, 2) }],
          };
        }
      }

      const traceId = generateTraceId();
      const result = await supabaseService.createPrometheusReview({
        entity_type,
        entity_id,
        trigger_event,
        review_status,
        risk_score,
        audit_notes,
      });

      // Auto-escalation: high risk or human required → log to audit
      if (review_status === "HUMAN_REQUIRED" || review_status === "ESCALATE" || risk_score >= 75) {
        await supabaseService.logAuditEvent(
          entity_type,
          entity_id,
          "AUTO_ESCALATION_TRIGGERED",
          { review_status, risk_score, trigger_event },
          traceId
        );
      }

      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        structuredContent: result,
      };
    }
  );

  // -----------------------------------------------------------
  // Tool: prometheus_get_risk_register
  // Returns all open/in-progress risk entries
  // -----------------------------------------------------------
  server.registerTool(
    "prometheus_get_risk_register",
    {
      title: "Get Active Risk Register",
      description: "Returns all open and in-progress risk register entries from the PROMETHEUS governance stack, ordered by severity descending. Used for executive dashboards and compliance reporting.",
      inputSchema: {},
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async () => {
      const result = await supabaseService.getActiveRiskRegister();
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        structuredContent: result,
      };
    }
  );

  // -----------------------------------------------------------
  // Tool: prometheus_log_audit
  // Manual audit event logging with full trace
  // -----------------------------------------------------------
  server.registerTool(
    "prometheus_log_audit",
    {
      title: "Log PROMETHEUS Audit Event",
      description: "Manually logs an audit event to the PROMETHEUS audit trail. Every state transition, certification claim, and governance decision must have a corresponding audit entry. Required for regulatory inspection compliance.",
      inputSchema: {
        entity_type: z.string().describe("Type of entity: procurement_pipeline, SAF, M2M, CENTERMARQ, etc."),
        entity_id: z.string().describe("Unique identifier of the entity"),
        event: z.string().describe("Event name — use SCREAMING_SNAKE_CASE: STATUS_TRANSITION, CERT_CLAIM_VALIDATED, etc."),
        details: z.record(z.unknown()).describe("Structured event details — maps input traces to downstream outputs"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async ({ entity_type, entity_id, event, details }) => {
      const traceId = generateTraceId();
      const result = await supabaseService.logAuditEvent(
        entity_type,
        entity_id,
        event,
        details,
        traceId
      );

      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        structuredContent: result,
      };
    }
  );
}
