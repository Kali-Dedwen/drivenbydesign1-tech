// api/provision-cohort.js — M2M~Inc. BRIDGE OS bulk cohort provisioning
// Server-to-server endpoint called by Make.com after employer intake.
// Uses Supabase service role; protected by shared-secret header.

import { createClient } from "@supabase/supabase-js";

export const config = { maxDuration: 60 };

const OS_LANES = new Set(["PIVOT_OS", "BRIDGE_OS", "HUMAN_OS"]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const expectedSecret = process.env.MAKE_WEBHOOK_SECRET;
  const presentedSecret = req.headers["x-make-secret"];
  if (!expectedSecret || presentedSecret !== expectedSecret) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.VITE_SUPABASE_SERVICE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return res.status(500).json({ error: "Server misconfigured: missing Supabase credentials" });
  }

  const body = req.body || {};
  const { cohort_name, os_lane, facilitator_email, member_emails, start_date } = body;

  const validationErrors = [];
  if (!cohort_name || typeof cohort_name !== "string") {
    validationErrors.push("cohort_name is required");
  }
  if (!os_lane || !OS_LANES.has(os_lane)) {
    validationErrors.push("os_lane must be one of PIVOT_OS, BRIDGE_OS, HUMAN_OS");
  }
  if (!facilitator_email || !EMAIL_RE.test(facilitator_email)) {
    validationErrors.push("facilitator_email is required and must be a valid email");
  }
  if (!Array.isArray(member_emails) || member_emails.length === 0) {
    validationErrors.push("member_emails must be a non-empty array");
  }
  if (start_date && !/^\d{4}-\d{2}-\d{2}$/.test(start_date)) {
    validationErrors.push("start_date must be YYYY-MM-DD");
  }
  if (validationErrors.length) {
    return res.status(400).json({ error: "validation_failed", details: validationErrors });
  }

  const normalizedEmails = [
    ...new Set(
      member_emails
        .map((e) => String(e).trim().toLowerCase())
        .filter((e) => EMAIL_RE.test(e))
    ),
  ];
  if (normalizedEmails.length === 0) {
    return res.status(400).json({ error: "validation_failed", details: ["member_emails contained no valid email addresses"] });
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const cohortRow = {
    cohort_name,
    os_lane,
    facilitator_email: facilitator_email.toLowerCase(),
  };
  if (start_date) cohortRow.start_date = start_date;

  const { data: cohort, error: cohortErr } = await admin
    .from("m2m_cohorts")
    .insert(cohortRow)
    .select("id, cohort_name")
    .single();
  if (cohortErr) {
    return res.status(500).json({ error: "cohort_insert_failed", detail: cohortErr.message });
  }

  const memberRows = normalizedEmails.map((email) => ({
    cohort_id: cohort.id,
    email,
    status: "active",
  }));
  const { error: memberErr } = await admin.from("m2m_cohort_members").insert(memberRows);
  if (memberErr) {
    return res.status(500).json({
      error: "members_insert_failed",
      detail: memberErr.message,
      cohort_id: cohort.id,
    });
  }

  const inviteResults = await Promise.allSettled(
    normalizedEmails.map((email) =>
      admin.auth.admin.inviteUserByEmail(email, {
        data: {
          cohort_id: cohort.id,
          cohort_name: cohort.cohort_name,
          os_lane,
        },
      })
    )
  );

  const invite_errors = [];
  inviteResults.forEach((r, i) => {
    const email = normalizedEmails[i];
    if (r.status === "rejected") {
      invite_errors.push({ email, error: String(r.reason?.message || r.reason) });
    } else if (r.value?.error) {
      invite_errors.push({ email, error: r.value.error.message });
    }
  });

  const { error: logErr } = await admin.from("m2m_provision_log").insert({
    cohort_id: cohort.id,
    cohort_name: cohort.cohort_name,
    os_lane,
    facilitator_email: facilitator_email.toLowerCase(),
    member_count: normalizedEmails.length,
    invite_errors,
    triggered_by: "make.com",
  });
  if (logErr) {
    console.error("[provision-cohort] audit log insert failed:", logErr.message);
  }

  return res.status(200).json({
    cohort_id: cohort.id,
    cohort_name: cohort.cohort_name,
    members_provisioned: normalizedEmails.length - invite_errors.length,
    invite_errors,
  });
}
