// ============================================================
// M2M~Inc. Sovereign MCP Server — Core Type Definitions
// FL/II Doctrine compliant | PROMETHEUS governance enforced
// ============================================================

// -----------------------------------------------------------
// Procurement Pipeline Types
// -----------------------------------------------------------

export type ProcessingTier = "agent_orchestrated" | "human_review" | "escalated";

export type RecordStatus =
  | "pending_compliance_review"
  | "pending_human_review"
  | "flagged_for_compliance_deviation"
  | "ai_reviewed"
  | "escalated"
  | "closed";

export interface ProcurementRecord {
  id: string;
  vendor_name: string;
  transaction_amount: number;
  processing_tier: ProcessingTier;
  status: RecordStatus;
  trace_id: string;
  workflow_run_id?: string;
  compliance_score?: number;
  risk_flags?: string[];
  human_signature?: string;
  created_at: string;
  updated_at: string;
}

export interface ComplianceAssessment {
  record_id: string;
  risk_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  policy_deviations: string[];
  recommended_action: RecordStatus;
  reasoning: string;
  trace_id: string;
  assessed_at: string;
}

// -----------------------------------------------------------
// PROMETHEUS Governance Types
// -----------------------------------------------------------

export type PrometheusReviewStatus = "PASS" | "FAIL" | "ESCALATE" | "HUMAN_REQUIRED";

export interface PrometheusReview {
  id: string;
  entity_type: "SAF" | "M2M" | "CENTERMARQ";
  entity_id: string;
  trigger_event: string;
  review_status: PrometheusReviewStatus;
  risk_score: number;
  audit_notes: string;
  created_at: string;
}

export interface RiskRegisterEntry {
  id: string;
  risk_category: string;
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  mitigation_status: "OPEN" | "IN_PROGRESS" | "MITIGATED" | "ACCEPTED";
  owner: string;
  created_at: string;
}

// -----------------------------------------------------------
// DART Skill System Types
// -----------------------------------------------------------

export type DartSkillId =
  | "SKL-001" | "SKL-002" | "SKL-003" | "SKL-004"
  | "SKL-005" | "SKL-006" | "SKL-007" | "SKL-008"
  | "SKL-009" | "SKL-010" | "SKL-011" | "SKL-012";

export type OsLane = "PIVOT_OS" | "BRIDGE_OS" | "HUMAN_OS";

export interface DartSkillExecution {
  skill_id: DartSkillId;
  os_lane: OsLane;
  input_payload: Record<string, unknown>;
  output_result?: Record<string, unknown>;
  trust_gate_passed: boolean;
  voice_gate_passed: boolean;
  execution_status: "PENDING" | "RUNNING" | "COMPLETE" | "FAILED" | "HUMAN_REQUIRED";
  trace_id: string;
  executed_at: string;
}

// -----------------------------------------------------------
// Definition of Done — Cross-Platform Standard
// -----------------------------------------------------------

export interface DefinitionOfDone {
  skill_id: string;
  platform: "SUPABASE" | "NOTION" | "MAKE" | "N8N" | "VERCEL" | "GITHUB" | "OBSIDIAN";
  os_lane: OsLane;
  criteria: DodCriteria;
  gate_results: GateResults;
  dod_status: "INCOMPLETE" | "COMPLETE" | "BLOCKED";
  completed_at?: string;
}

export interface DodCriteria {
  functional: string[];      // What the skill must DO
  compliance: string[];      // What the skill must NOT do (liability gates)
  voice_gate: string[];      // Anti-AI-tell checks
  trust_gate: string[];      // Seven Must-Haves passages
  integration: string[];     // Cross-platform wire checks
  audit_trail: string[];     // Traceability requirements
}

export interface GateResults {
  functional_pass: boolean;
  compliance_pass: boolean;
  voice_gate_pass: boolean;
  trust_gate_pass: boolean;
  integration_pass: boolean;
  audit_trail_pass: boolean;
  all_pass: boolean;
}

// -----------------------------------------------------------
// Ultracode Workflow Types
// -----------------------------------------------------------

export interface UltracodeTaskScope {
  task_id: string;
  task_type: "RLS_AUDIT" | "SCHEMA_MIGRATION" | "COMPLIANCE_SWEEP" | "WORKFLOW_COMPLETION";
  target_scope: string;
  effort_level: "high" | "xhigh" | "ultracode";
  subagent_budget_cap?: number;
  stop_condition: string;
  trace_id: string;
}

// -----------------------------------------------------------
// API Response Envelope
// -----------------------------------------------------------

export interface M2MApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  trace_id: string;
  timestamp: string;
  [key: string]: unknown;
}
