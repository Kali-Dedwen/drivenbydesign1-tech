-- ============================================================
-- M2M~Inc. Supabase Migration — Defect 1: RLS posture correction
-- Inverts the broken posture (anon could READ, authenticated agent
-- could not WRITE) to: no anon access; authenticated agent reads +
-- writes within the agent_orchestrated tier; approved_production
-- hard-blocked at the DB layer (defense in depth).
-- Project: jnmywpfdykuybrxkdcmc
-- Pairs with: src/services/supabase.ts (agent now signs in as authenticated)
-- ============================================================

-- -----------------------------------------------------------
-- 1. Drop ALL anon-role policies on procurement_pipeline.
--    The exposing SELECT policy was hand-added out-of-band, so we
--    drop by role rather than by a known name.
-- -----------------------------------------------------------
DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'procurement_pipeline'
      AND 'anon' = ANY (roles)
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.procurement_pipeline;', pol.policyname);
  END LOOP;
END $$;

-- -----------------------------------------------------------
-- 2. Authenticated SELECT, scoped to the agent tier.
-- -----------------------------------------------------------
DROP POLICY IF EXISTS procurement_agent_select ON public.procurement_pipeline;
CREATE POLICY procurement_agent_select
  ON public.procurement_pipeline
  FOR SELECT TO authenticated
  USING (processing_tier = 'agent_orchestrated');

-- -----------------------------------------------------------
-- 3. Authenticated UPDATE for status transitions, with a DB-level
--    mirror of the app's approved_production hard-block.
-- -----------------------------------------------------------
DROP POLICY IF EXISTS procurement_agent_update ON public.procurement_pipeline;
CREATE POLICY procurement_agent_update
  ON public.procurement_pipeline
  FOR UPDATE TO authenticated
  USING (processing_tier = 'agent_orchestrated')
  WITH CHECK (
    processing_tier = 'agent_orchestrated'
    AND status IN ('pending_human_review', 'flagged_for_compliance_deviation', 'ai_reviewed')
  );

-- -----------------------------------------------------------
-- 4. Replace the compliance_assessments policy. The original
--    (20260621_dart_dod_schema.sql) used
--    USING (processing_tier = 'agent_orchestrated' OR true) — but
--    compliance_assessments has no processing_tier column. Clean it up.
-- -----------------------------------------------------------
DROP POLICY IF EXISTS compliance_assessments_agent_policy ON public.compliance_assessments;
DROP POLICY IF EXISTS compliance_assessments_agent_write ON public.compliance_assessments;
CREATE POLICY compliance_assessments_agent_write
  ON public.compliance_assessments
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);
