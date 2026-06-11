-- Sprint 4: audit table for Make.com bulk cohort provisioning
-- One row per /api/provision-cohort call

CREATE TABLE IF NOT EXISTS public.m2m_provision_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id uuid REFERENCES public.m2m_cohorts(id) ON DELETE SET NULL,
  cohort_name text,
  os_lane text,
  facilitator_email text,
  member_count integer,
  invite_errors jsonb DEFAULT '[]'::jsonb,
  triggered_by text DEFAULT 'make.com',
  provisioned_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS m2m_provision_log_cohort_id_idx
  ON public.m2m_provision_log (cohort_id);
CREATE INDEX IF NOT EXISTS m2m_provision_log_provisioned_at_idx
  ON public.m2m_provision_log (provisioned_at DESC);

ALTER TABLE public.m2m_provision_log ENABLE ROW LEVEL SECURITY;

-- Match the sovereign-stack convention: authenticated read-only, service_role writes.
CREATE POLICY "m2m_provision_log_authenticated_select"
  ON public.m2m_provision_log
  FOR SELECT
  TO authenticated
  USING (true);
