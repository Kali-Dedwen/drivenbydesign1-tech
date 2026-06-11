// api/provision-cohort.js — M2M~Inc. BRIDGE OS bulk cohort provisioning
// Server-to-server endpoint called by Make.com after employer intake.
// Uses Supabase service role; protected by shared-secret header.

import { createClient } from "@supabase/supabase-js";

export const config = { maxDuration: 60 };

const OS_LANES = new Set(["PIVOT_OS", "BRIDGE_OS", "HUMAN_OS"]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Make.com sometimes sends array fields as comma/newline-delimited strings
// or JSON-stringified arrays. Accept all three shapes; dedupe and normalize.
function normalizeMemberEmails(input) {
  if (input == null) return [];

  let candidates;
  if (Array.isArray(input)) {
    candidates = input;
  } else if (typeof input === "string") {
    const trimmed = input.trim();
    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed);
        candidates = Array.isArray(parsed) ? parsed : trimmed.split(/[\s,;]+/);
      } catch {
        candidates = trimmed.split(/[\s,;]+/);
      }
    } else {
      candidates = trimmed.split(/[\s,;]+/);
    }
  } else {
    return [];
  }

  // Flatten one level — handles ["a@x.com, b@y.com"] (array with delimited string)
  const flat = candidates.flatMap((c) =>
    typeof c === "string" ? c.split(/[\s,;]+/) : [c]
  );

  return [
    ...new Set(
      flat
        .map((e) => String(e ?? "").trim().toLowerCase())
        .filter((e) => EMAIL_RE.test(e))
    ),
  ];
}

// If member insertion fails after the cohort row is already written, delete
// the cohort so we don't leave orphan rows that Kev has to clean up by hand.
// m2m_cohort_members CASCADE-deletes via FK, so partial member inserts also clear.
async function cleanupOrphanCohort(admin, cohortId) {
  const { error } = await admin.from("m2m_cohorts").delete().eq("id", cohortId);
  if (error) {
    console.error("[provision-cohort] orphan_cleanup_failed", {
      cohort_id: cohortId,
      detail: error.message,
    });
    return { cleaned: false, error: error.message };
  }
  return { cleaned: true };
}

export default async function handler(req, res) {
  console.log(
    "[provision-cohort] body received:",
    JSON.stringify(req.body).slice(0, 500)
  );

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

  // Vercel Node runtime auto-parses application/json; defensively parse if a
  // raw string slips through (some Make.com configurations send text/plain).
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};
  const { cohort_name, os_lane, facilitator_email, start_date } = body;
  let member_emails = body.member_emails;

  // Make.com's scenarios_run API wraps array fields as JSON-stringified strings.
  // Unwrap here so downstream sees a real array. Helper still handles edge shapes.
  if (typeof member_emails === "string") {
    try { member_emails = JSON.parse(member_emails); } catch (e) {}
  }

  const normalizedEmails = normalizeMemberEmails(member_emails);

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
  if (normalizedEmails.length === 0) {
    validationErrors.push(
      "member_emails must contain at least one valid email (accepts array, " +
      "delimited string, or JSON-stringified array)"
    );
  }
  if (start_date && !/^\d{4}-\d{2}-\d{2}$/.test(start_date)) {
    validationErrors.push("start_date must be YYYY-MM-DD");
  }
  if (validationErrors.length) {
    console.error("[provision-cohort] validation_failed", {
      validationErrors,
      received_member_emails_type: Array.isArray(member_emails)
        ? "array"
        : typeof member_emails,
      received_member_emails_sample:
        typeof member_emails === "string"
          ? member_emails.slice(0, 200)
          : Array.isArray(member_emails)
          ? member_emails.slice(0, 5)
          : member_emails,
    });
    return res.status(400).json({ error: "validation_failed", details: validationErrors });
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

  // .select() after .insert() so we can verify how many rows actually landed.
  // Without it, supabase-js returns { data: null, error: null } on success —
  // a silent 0-row insert (RLS quirk, trigger, partial constraint) would be invisible.
  const { data: insertedMembers, error: memberErr } = await admin
    .from("m2m_cohort_members")
    .insert(memberRows)
    .select("id, cohort_id, email");

  if (memberErr) {
    console.error("[provision-cohort] members_insert_failed", {
      cohort_id: cohort.id,
      attempted: memberRows.length,
      detail: memberErr.message,
    });
    const orphan_cleanup = await cleanupOrphanCohort(admin, cohort.id);
    return res.status(500).json({
      error: "members_insert_failed",
      detail: memberErr.message,
      cohort_id: cohort.id,
      attempted_rows: memberRows.length,
      orphan_cleanup,
    });
  }

  const insertedCount = insertedMembers?.length ?? 0;
  if (insertedCount !== memberRows.length) {
    console.error("[provision-cohort] member_count_mismatch", {
      cohort_id: cohort.id,
      expected: memberRows.length,
      inserted: insertedCount,
      emails_attempted: normalizedEmails,
    });
    const orphan_cleanup = await cleanupOrphanCohort(admin, cohort.id);
    return res.status(500).json({
      error: "member_count_mismatch",
      detail: `Inserted ${insertedCount} of ${memberRows.length} member rows`,
      cohort_id: cohort.id,
      expected: memberRows.length,
      inserted: insertedCount,
      orphan_cleanup,
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
