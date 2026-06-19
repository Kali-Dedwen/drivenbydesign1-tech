-- =====================================================================
-- PROMETHEUS — Legal & Compliance Governance Agent
-- Supabase migration v1.0  |  project: jnmywpfdykuybrxkdcmc
-- Author: M2M~Inc. Sovereign Architecture  |  Built: June 2026
-- Reuses existing global enums: gate_verdict_enum (TRUST/MARGINAL/LIABILITY),
-- must_have_result_enum (PASS/FAIL/MARGINAL), os_lane_enum (PIVOT_OS/BRIDGE_OS/HUMAN_OS)
-- Prometheus is the 4th gate. It speaks the same verdict language as the
-- Judge (judge_verdicts) and Gate v2.0 (gate_checkpoints).
-- =====================================================================

-- ---------------------------------------------------------------------
-- TABLE 1 — prometheus_reviews
-- One row per legal/compliance review. The core verdict record.
-- ---------------------------------------------------------------------
create table if not exists public.prometheus_reviews (
  id                          uuid primary key default gen_random_uuid(),
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now(),

  -- Linkage into the existing stack
  review_ref                  text,                 -- maps to deliverable_queue.deliverable_ref
  sel_record_id               text,                 -- maps to sovereign_execution_log.record_id
  loop_id                     uuid references public.loop_executions(id),
  verdict_id                  uuid references public.judge_verdicts(id),  -- Judge sibling link

  -- Context
  entity                      text not null check (entity = any (array[
                                'M2M~Inc.','CenterMarq LLC','Solutions Afoot LLC',
                                'KGM / Sanctuary','GNWSH','Client'])),
  engagement_name             text,
  is_client_facing            boolean not null default false,
  os_lane                     os_lane_enum,
  artifact_type               text check (artifact_type = any (array[
                                'PRD','ICP','MCP','Framework','SOW','Proposal','Contract',
                                'Governance Doc','Policy','Capability Statement','Email',
                                'Social Content','Keynote','Research Brief','Automation Output','Other'])),

  -- How it arrived at Prometheus
  review_trigger              text not null default 'COO_ROUTE' check (review_trigger = any (array[
                                'COO_ROUTE','DART_LEGAL','JUDGE_ESCALATE','MANUAL','SCHEDULED_AUDIT'])),
  module_invoked              text check (module_invoked = any (array[
                                '01_DOC_SUMMARY','02_LEGAL_RESEARCH','03_CLIENT_COMMS','04_CONTRACT_REVIEW',
                                '05_KNOWLEDGE_BASE','06_WORKFLOW_TEMPLATE','07_POSITION_STRUCTURING','08_DRAFTING'])),

  content_snapshot            text,

  -- ===== THE EIGHT COUNSEL CHECKS (PASS / FAIL / MARGINAL) =====
  check_ip_trademark          must_have_result_enum,  -- 9 USPTO-pending marks; ™ usage; third-party marks
  check_cert_posture          must_have_result_enum,  -- SDVOSB/VBE/DOBE accuracy; SAF != SDVOSB hard rule
  check_contract_obligation   must_have_result_enum,  -- clauses, obligations, missing terms, conflicts
  check_regulatory            must_have_result_enum,  -- GovCon set-aside, FAR flow-down, IRS 990, privacy
  check_unverified_claims     must_have_result_enum,  -- stats/guarantees/borrowed credibility (legal lens)
  check_upl_boundary          must_have_result_enum,  -- no unauthorized practice of law; escalate true legal Qs
  check_confidentiality       must_have_result_enum,  -- NDA / PII / client-confidential exposure
  check_authority_scope       must_have_result_enum,  -- authority to make this representation / commitment

  note_ip_trademark           text,
  note_cert_posture           text,
  note_contract_obligation    text,
  note_regulatory             text,
  note_unverified_claims      text,
  note_upl_boundary           text,
  note_confidentiality        text,
  note_authority_scope        text,

  -- Hard-rule flags (mirrors existing scattered flags, now owned by one agent)
  saf_sdvosb_flag             boolean default false,  -- TRUE = SAF wrongly attributed SDVOSB -> auto-FAIL
  cert_posture_verified       boolean default false,
  ip_marks_referenced         text[],                 -- e.g. {PIVOT OS™, BRIDGE OS™, Human OS™}
  third_party_marks           text[],                 -- marks requiring reference-only treatment

  -- Verdict (same language as Judge + Gate v2.0)
  legal_verdict               gate_verdict_enum,      -- TRUST / MARGINAL / LIABILITY
  risk_level                  text check (risk_level = any (array['Low','Medium','High','Critical'])),
  route_decision              text check (route_decision = any (array[
                                'CLEAR_TO_SHIP','REVISE','COUNSEL_REVIEW','HUMAN_REQUIRED','BLOCK'])),
  verdict_rationale           text,
  remediation                 text,

  -- Counsel escalation (UPL boundary terminus)
  counsel_escalation_required boolean default false,
  counsel_escalation_reason   text,

  -- FL/II authentication (the 20%)
  kev_authenticated           boolean default false,
  authenticated_at            timestamptz,
  authenticated_by            text default 'Dr. Kevin A. Smith',
  reviewed_by                 text default 'prometheus-legal-agent',
  gate_version                text default 'PROMETHEUS-v1.0'
);

comment on table public.prometheus_reviews is
  'Prometheus — 4th gate. Legal/IP/cert/regulatory governance verdict per artifact. Sibling to judge_verdicts. Owns the legal dimension of Must-Have 03 (Liability). LIABILITY verdicts never auto-clear; FL/II authentication or counsel escalation required.';

-- ---------------------------------------------------------------------
-- TABLE 2 — prometheus_risk_register
-- Standing portfolio-level legal/compliance risk log (not per-artifact).
-- ---------------------------------------------------------------------
create table if not exists public.prometheus_risk_register (
  id                     uuid primary key default gen_random_uuid(),
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  entity                 text not null check (entity = any (array[
                           'M2M~Inc.','CenterMarq LLC','Solutions Afoot LLC',
                           'KGM / Sanctuary','GNWSH','Client'])),
  risk_category          text not null check (risk_category = any (array[
                           'IP/Trademark','Certification','Contractual','Regulatory/GovCon',
                           'Confidentiality','UPL','Tax/Nonprofit','Authority/Scope','Other'])),
  risk_title             text not null,
  risk_description        text,
  severity               text check (severity = any (array['Low','Medium','High','Critical'])),
  likelihood             text check (likelihood = any (array['Low','Medium','High'])),
  status                 text default 'Open' check (status = any (array[
                           'Open','Monitoring','Mitigated','Escalated','Closed'])),
  owner                  text default 'Dr. Kevin A. Smith',
  mitigation_plan        text,
  counsel_involved       boolean default false,
  source_review_id       uuid references public.prometheus_reviews(id),
  target_resolution_date date
);

comment on table public.prometheus_risk_register is
  'Prometheus standing risk register — portfolio-level legal/compliance exposure across all entities. Feeds the Sovereign Command Hub legal panel.';

-- ---------------------------------------------------------------------
-- TABLE 3 — prometheus_audit_log
-- Immutable audit trail of every Prometheus action (mirrors loop_audit_trail).
-- ---------------------------------------------------------------------
create table if not exists public.prometheus_audit_log (
  id              bigint primary key generated always as identity,
  created_at      timestamptz not null default now(),
  review_id       uuid references public.prometheus_reviews(id),
  event_type      text not null,            -- REVIEW_OPENED, VERDICT_RENDERED, ROUTED, AUTHENTICATED, ESCALATED
  entity          text,
  module_invoked  text,
  legal_verdict   gate_verdict_enum,
  route_decision  text,
  actor           text default 'prometheus-legal-agent',
  detail          jsonb default '{}'::jsonb
);

comment on table public.prometheus_audit_log is
  'Immutable chain of custody for every Prometheus legal review. Full audit for compliance and counsel handoff.';

-- ---------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------
create index if not exists idx_prometheus_reviews_entity        on public.prometheus_reviews(entity);
create index if not exists idx_prometheus_reviews_verdict       on public.prometheus_reviews(legal_verdict);
create index if not exists idx_prometheus_reviews_route         on public.prometheus_reviews(route_decision);
create index if not exists idx_prometheus_reviews_loop          on public.prometheus_reviews(loop_id);
create index if not exists idx_prometheus_reviews_unauth        on public.prometheus_reviews(kev_authenticated) where kev_authenticated = false;
create index if not exists idx_prometheus_risk_status           on public.prometheus_risk_register(status);
create index if not exists idx_prometheus_audit_review          on public.prometheus_audit_log(review_id);

-- ---------------------------------------------------------------------
-- Row Level Security (matches stack pattern; service-role writes from Make.com bypass RLS)
-- ---------------------------------------------------------------------
alter table public.prometheus_reviews        enable row level security;
alter table public.prometheus_risk_register  enable row level security;
alter table public.prometheus_audit_log      enable row level security;

-- Authenticated read policies (adjust to your auth model as needed)
create policy "prometheus_reviews_auth_read"       on public.prometheus_reviews       for select to authenticated using (true);
create policy "prometheus_risk_auth_read"          on public.prometheus_risk_register for select to authenticated using (true);
create policy "prometheus_audit_auth_read"         on public.prometheus_audit_log     for select to authenticated using (true);

-- ---------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------
create or replace function public.prometheus_touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists trg_prometheus_reviews_touch on public.prometheus_reviews;
create trigger trg_prometheus_reviews_touch before update on public.prometheus_reviews
  for each row execute function public.prometheus_touch_updated_at();

drop trigger if exists trg_prometheus_risk_touch on public.prometheus_risk_register;
create trigger trg_prometheus_risk_touch before update on public.prometheus_risk_register
  for each row execute function public.prometheus_touch_updated_at();

-- =====================================================================
-- HARD-RULE GUARD: SAF can never carry SDVOSB.
-- Any review flagging SAF + SDVOSB is forced to LIABILITY at the data layer.
-- =====================================================================
create or replace function public.prometheus_enforce_saf_rule()
returns trigger language plpgsql as $$
begin
  if new.entity = 'Solutions Afoot LLC' and new.saf_sdvosb_flag = true then
    new.legal_verdict := 'LIABILITY';
    new.route_decision := 'BLOCK';
    new.check_cert_posture := 'FAIL';
    new.note_cert_posture := coalesce(new.note_cert_posture,'') ||
      ' [HARD RULE] SAF holds VBE + CAGE 9QVH2 only. SDVOSB attribution to SAF is prohibited. Auto-BLOCK.';
  end if;
  return new;
end; $$;

drop trigger if exists trg_prometheus_saf_rule on public.prometheus_reviews;
create trigger trg_prometheus_saf_rule before insert or update on public.prometheus_reviews
  for each row execute function public.prometheus_enforce_saf_rule();

-- =====================================================================
-- END migration v1.0
-- =====================================================================
