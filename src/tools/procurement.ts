// ============================================================
// M2M~Inc. MCP Tools — Procurement Compliance
// RLS-enforced | PROMETHEUS-governed | trace_id stamped
// ============================================================

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { supabaseService, generateTraceId } from "../services/supabase.js";

export function registerProcurementTools(server: McpServer): void {

  // -----------------------------------------------------------
  // Tool: procurement_get_pending
  // Pulls all records awaiting compliance review
  // -----------------------------------------------------------
  server.registerTool(
    "procurement_get_pending",
    {
      title: "Get Pending Compliance Records",
      description: "Retrieves all procurement pipeline records with status 'pending_compliance_review' scoped to agent_orchestrated tier. RLS enforced — agent cannot access records outside its processing tier.",
      inputSchema: {},
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async () => {
      const result = await supabaseService.getPendingComplianceRecords();
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        structuredContent: result,
      };
    }
  );

  // -----------------------------------------------------------
  // Tool: procurement_update_status
  // Hard-blocked from approved_production — requires human sig
  // -----------------------------------------------------------
  server.registerTool(
    "procurement_update_status",
    {
      title: "Update Procurement Record Status",
      description: "Transitions a procurement record status. BLOCKED: cannot set approved_production — that requires human cryptographic signature. Valid targets: pending_human_review | flagged_for_compliance_deviation | ai_reviewed. Stamps trace_id and workflow_run_id on every write.",
      inputSchema: {
        record_id: z.string().describe("UUID of the procurement_pipeline record"),
        new_status: z.enum([
          "pending_human_review",
          "flagged_for_compliance_deviation",
          "ai_reviewed",
        ]).describe("Target status — approved_production is hard-blocked"),
        workflow_run_id: z.string().optional().describe("n8n or Make.com workflow run identifier for audit trail"),
        reason: z.string().describe("Reason for status transition — required for audit log"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async ({ record_id, new_status, workflow_run_id, reason }) => {
      const traceId = generateTraceId();

      // Write status update
      const updateResult = await supabaseService.updateRecordStatus(
        record_id,
        new_status,
        traceId,
        workflow_run_id
      );

      // Log to PROMETHEUS audit trail
      if (updateResult.success) {
        await supabaseService.logAuditEvent(
          "procurement_pipeline",
          record_id,
          "STATUS_TRANSITION",
          { new_status, reason, workflow_run_id },
          traceId
        );
      }

      return {
        content: [{ type: "text", text: JSON.stringify(updateResult, null, 2) }],
        structuredContent: updateResult,
      };
    }
  );

  // -----------------------------------------------------------
  // Tool: procurement_log_assessment
  // Persists AI compliance assessment with full audit trail
  // -----------------------------------------------------------
  server.registerTool(
    "procurement_log_assessment",
    {
      title: "Log Compliance Assessment",
      description: "Persists the AI agent's compliance assessment for a procurement record. Includes risk level, policy deviations detected, recommended action, and full reasoning chain. Required before any status transition.",
      inputSchema: {
        record_id: z.string().describe("UUID of the assessed record"),
        risk_level: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).describe("Assessed risk classification"),
        policy_deviations: z.array(z.string()).describe("List of policy deviations detected"),
        recommended_action: z.enum([
          "pending_human_review",
          "flagged_for_compliance_deviation",
          "ai_reviewed",
          "escalated",
        ]).describe("Recommended next status"),
        reasoning: z.string().describe("Full reasoning chain — maps input to output for regulatory inspection"),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async ({ record_id, risk_level, policy_deviations, recommended_action, reasoning }) => {
      const traceId = generateTraceId();
      const result = await supabaseService.logComplianceAssessment({
        record_id,
        risk_level,
        policy_deviations,
        recommended_action,
        reasoning,
        trace_id: traceId,
      });

      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        structuredContent: result,
      };
    }
  );
}
