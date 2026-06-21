-- ============================================================
-- M2M~Inc. Supabase Migration
-- DART Skill System + Definition of Done Schema
-- Pairs with: procurement_pipeline RLS policy (already deployed)
-- Project: jnmywpfdykuybrxkdcmc
-- ============================================================

-- -----------------------------------------------------------
-- dart_skill_executions — logs every DART skill run
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.dart_skill_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id TEXT NOT NULL,
  os_lane TEXT NOT NULL CHECK (os_lane IN ('PIVOT_OS', 'BRIDGE_OS', 'HUMAN_OS')),
  input_payload JSONB NOT NULL DEFAULT '{}',
  output_result JSONB,
  trust_gate_passed BOOLEAN NOT NULL DEFAULT false,
  voice_gate_passed BOOLEAN NOT NULL DEFAULT false,
  execution_status TEXT NOT NULL CHECK (
    execution_status IN ('PENDING', 'RUNNING', 'COMPLETE', 'FAILED', 'HUMAN_REQUIRED')
  ),
  trace_id TEXT NOT NULL,
  executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.dart_skill_executions ENABLE ROW LEVEL SECURITY;

CREATE POLICY dart_executions_agent_policy
ON public.dart_skill_executions
FOR ALL
TO authenticated
USING (true)
WITH CHECK (
  -- Agent can never mark COMPLETE when gates failed
  NOT (execution_status = 'COMPLETE' AND (trust_gate_passed = false OR voice_gate_passed = false))
);

CREATE INDEX idx_dart_executions_skill_id ON public.dart_skill_executions (skill_id);
CREATE INDEX idx_dart_executions_os_lane ON public.dart_skill_executions (os_lane);
CREATE INDEX idx_dart_executions_status ON public.dart_skill_executions (execution_status);

-- -----------------------------------------------------------
-- dart_definition_of_done — cross-platform DoD registry
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.dart_definition_of_done (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (
    platform IN ('SUPABASE', 'NOTION', 'MAKE', 'N8N', 'VERCEL', 'GITHUB', 'OBSIDIAN')
  ),
  os_lane TEXT NOT NULL CHECK (os_lane IN ('PIVOT_OS', 'BRIDGE_OS', 'HUMAN_OS')),
  criteria JSONB NOT NULL DEFAULT '{}',
  gate_results JSONB NOT NULL DEFAULT '{}',
  dod_status TEXT NOT NULL DEFAULT 'INCOMPLETE' CHECK (
    dod_status IN ('INCOMPLETE', 'COMPLETE', 'BLOCKED')
  ),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (skill_id, platform)
);

ALTER TABLE public.dart_definition_of_done ENABLE ROW LEVEL SECURITY;

CREATE POLICY dart_dod_agent_policy
ON public.dart_definition_of_done
FOR ALL
TO authenticated
USING (true)
WITH CHECK (
  -- Cannot mark COMPLETE if gate_results show any failure
  NOT (
    dod_status = 'COMPLETE' AND (
      (gate_results->>'functional_pass')::boolean = false OR
      (gate_results->>'compliance_pass')::boolean = false OR
      (gate_results->>'voice_gate_pass')::boolean = false OR
      (gate_results->>'trust_gate_pass')::boolean = false OR
      (gate_results->>'integration_pass')::boolean = false OR
      (gate_results->>'audit_trail_pass')::boolean = false
    )
  )
);

CREATE INDEX idx_dart_dod_skill_id ON public.dart_definition_of_done (skill_id);
CREATE INDEX idx_dart_dod_status ON public.dart_definition_of_done (dod_status);
CREATE INDEX idx_dart_dod_platform ON public.dart_definition_of_done (platform);

-- -----------------------------------------------------------
-- compliance_assessments — AI assessment records
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.compliance_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id TEXT NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  policy_deviations JSONB NOT NULL DEFAULT '[]',
  recommended_action TEXT NOT NULL,
  reasoning TEXT NOT NULL,
  trace_id TEXT NOT NULL,
  assessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.compliance_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY compliance_assessments_agent_policy
ON public.compliance_assessments
FOR ALL
TO authenticated
USING (processing_tier = 'agent_orchestrated' OR true)
WITH CHECK (true);

CREATE INDEX idx_compliance_assessments_record ON public.compliance_assessments (record_id);
CREATE INDEX idx_compliance_assessments_risk ON public.compliance_assessments (risk_level);

-- -----------------------------------------------------------
-- Updated_at trigger for dart_definition_of_done
-- -----------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER dart_dod_updated_at
  BEFORE UPDATE ON public.dart_definition_of_done
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------------
-- Compliance embedding retrieval function (vector store)
-- Pairs with: n8n Supabase Vector Store Tool node
-- -----------------------------------------------------------
CREATE OR REPLACE FUNCTION match_compliance_embeddings(
  query_embedding vector(1536),
  match_count INT DEFAULT 3
)
RETURNS TABLE (
  content TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ce.content,
    1 - (ce.embedding <=> query_embedding) AS similarity
  FROM compliance_embeddings ce
  ORDER BY ce.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
