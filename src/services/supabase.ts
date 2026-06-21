// ============================================================
// M2M~Inc. Supabase Service Client
// RLS-enforced | agent_worker role | trace_id stamped
// Project: jnmywpfdykuybrxkdcmc
// ============================================================

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type {
  ProcurementRecord,
  ComplianceAssessment,
  PrometheusReview,
  RiskRegisterEntry,
  DartSkillExecution,
  DefinitionOfDone,
  RecordStatus,
  M2MApiResponse,
} from "../types.js";

const SUPABASE_URL = process.env.SUPABASE_URL ?? "https://jnmywpfdykuybrxkdcmc.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY ?? "";

// CRITICAL: Use anon key + agent_worker role — NOT service_role
// service_role bypasses RLS. agent_worker enforces the policy.
// See: governance.yaml + procurement_pipeline RLS policy
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? "";

function generateTraceId(): string {
  return `M2M-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
}

function buildResponse<T>(data: T | null, error: string | null): M2MApiResponse<T> {
  return {
    success: !error && data !== null,
    data: data ?? undefined,
    error: error ?? undefined,
    trace_id: generateTraceId(),
    timestamp: new Date().toISOString(),
  };
}

export class M2MSupabaseService {
  private client: SupabaseClient;

  constructor() {
    if (!SUPABASE_ANON_KEY && !SUPABASE_SERVICE_KEY) {
      throw new Error("SUPABASE_ANON_KEY or SUPABASE_SERVICE_KEY must be set");
    }
    // Use anon key so RLS fires. Service key is emergency-only.
    this.client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY || SUPABASE_SERVICE_KEY);
  }

  // -----------------------------------------------------------
  // Procurement Pipeline Operations
  // RLS restricts to processing_tier = 'agent_orchestrated'
  // Status transitions hard-blocked to approved_production
  // -----------------------------------------------------------

  async getPendingComplianceRecords(): Promise<M2MApiResponse<ProcurementRecord[]>> {
    const { data, error } = await this.client
      .from("procurement_pipeline")
      .select("*")
      .eq("status", "pending_compliance_review")
      .eq("processing_tier", "agent_orchestrated")
      .order("created_at", { ascending: true });

    return buildResponse(data as ProcurementRecord[] | null, error?.message ?? null);
  }

  async updateRecordStatus(
    recordId: string,
    newStatus: "pending_human_review" | "flagged_for_compliance_deviation" | "ai_reviewed",
    traceId: string,
    workflowRunId?: string
  ): Promise<M2MApiResponse<ProcurementRecord>> {
    // Enforce: agent can NEVER write approved_production
    const blockedStatuses = ["approved_production"];
    if (blockedStatuses.includes(newStatus)) {
      return buildResponse<ProcurementRecord>(null, `BLOCKED: Status transition to '${newStatus}' requires human cryptographic signature. Route to HUMAN_REQUIRED.`);
    }

    const { data, error } = await this.client
      .from("procurement_pipeline")
      .update({
        status: newStatus,
        trace_id: traceId,
        workflow_run_id: workflowRunId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", recordId)
      .eq("processing_tier", "agent_orchestrated")
      .select()
      .single();

    return buildResponse(data as ProcurementRecord | null, error?.message ?? null);
  }

  async logComplianceAssessment(
    assessment: Omit<ComplianceAssessment, "assessed_at">
  ): Promise<M2MApiResponse<ComplianceAssessment>> {
    const record = { ...assessment, assessed_at: new Date().toISOString() };
    const { data, error } = await this.client
      .from("compliance_assessments")
      .insert(record)
      .select()
      .single();

    return buildResponse(data as ComplianceAssessment | null, error?.message ?? null);
  }

  // -----------------------------------------------------------
  // PROMETHEUS Governance Operations
  // -----------------------------------------------------------

  async createPrometheusReview(
    review: Omit<PrometheusReview, "id" | "created_at">
  ): Promise<M2MApiResponse<PrometheusReview>> {
    const { data, error } = await this.client
      .from("prometheus_reviews")
      .insert({ ...review, created_at: new Date().toISOString() })
      .select()
      .single();

    return buildResponse(data as PrometheusReview | null, error?.message ?? null);
  }

  async getActiveRiskRegister(): Promise<M2MApiResponse<RiskRegisterEntry[]>> {
    const { data, error } = await this.client
      .from("prometheus_risk_register")
      .select("*")
      .in("mitigation_status", ["OPEN", "IN_PROGRESS"])
      .order("severity", { ascending: false });

    return buildResponse(data as RiskRegisterEntry[] | null, error?.message ?? null);
  }

  async logAuditEvent(
    entityType: string,
    entityId: string,
    event: string,
    details: Record<string, unknown>,
    traceId: string
  ): Promise<M2MApiResponse<{ id: string }>> {
    const { data, error } = await this.client
      .from("prometheus_audit_log")
      .insert({
        entity_type: entityType,
        entity_id: entityId,
        event,
        details,
        trace_id: traceId,
        logged_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    return buildResponse(data as { id: string } | null, error?.message ?? null);
  }

  // -----------------------------------------------------------
  // DART Skill Execution Log
  // -----------------------------------------------------------

  async logSkillExecution(
    execution: Omit<DartSkillExecution, "executed_at">
  ): Promise<M2MApiResponse<DartSkillExecution>> {
    const record = { ...execution, executed_at: new Date().toISOString() };
    const { data, error } = await this.client
      .from("dart_skill_executions")
      .insert(record)
      .select()
      .single();

    return buildResponse(data as DartSkillExecution | null, error?.message ?? null);
  }

  // -----------------------------------------------------------
  // Definition of Done — Cross-Platform Registry
  // -----------------------------------------------------------

  async upsertDod(dod: DefinitionOfDone): Promise<M2MApiResponse<DefinitionOfDone>> {
    const { data, error } = await this.client
      .from("dart_definition_of_done")
      .upsert(dod, { onConflict: "skill_id,platform" })
      .select()
      .single();

    return buildResponse(data as DefinitionOfDone | null, error?.message ?? null);
  }

  async getDodStatus(skillId: string): Promise<M2MApiResponse<DefinitionOfDone[]>> {
    const { data, error } = await this.client
      .from("dart_definition_of_done")
      .select("*")
      .eq("skill_id", skillId)
      .order("platform");

    return buildResponse(data as DefinitionOfDone[] | null, error?.message ?? null);
  }

  // -----------------------------------------------------------
  // Compliance Embedding Retrieval (Vector Store)
  // -----------------------------------------------------------

  async retrieveComplianceEmbeddings(
    queryVector: number[],
    matchCount: number = 3
  ): Promise<M2MApiResponse<Array<{ content: string; similarity: number }>>> {
    const { data, error } = await this.client.rpc("match_compliance_embeddings", {
      query_embedding: queryVector,
      match_count: matchCount,
    });

    return buildResponse(
      data as Array<{ content: string; similarity: number }> | null,
      error?.message ?? null
    );
  }
}

export const supabaseService = new M2MSupabaseService();
export { generateTraceId };
