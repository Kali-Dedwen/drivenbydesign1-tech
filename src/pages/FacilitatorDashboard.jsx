import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuthUser } from "../components/AuthGate";

const T = {
  navy:      "#0f2545",
  navyMid:   "#1a3a6b",
  navyLight: "#2a4f8f",
  gold:      "#c9a84c",
  goldLight: "#e8c96a",
  goldDim:   "#8a6e2e",
  cream:     "#faf8f4",
  ink:       "#1a1a2e",
  muted:     "#6b7a99",
  border:    "rgba(201,168,76,0.2)",
  borderGray:"rgba(26,58,107,0.12)",
  success:   "#2d7a4a",
  danger:    "#c4444f",
  white:     "#ffffff",
};

const LANE_TOTAL_MODULES = {
  PIVOT_OS: 12,
  BRIDGE_OS: 12,
  HUMAN_OS: 12,
};

const LANE_LABEL = {
  PIVOT_OS: "PIVOT OS™",
  BRIDGE_OS: "BRIDGE OS™",
  HUMAN_OS: "Human OS™",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function laneTotal(laneKey) {
  return LANE_TOTAL_MODULES[laneKey] ?? 12;
}

function pct(numerator, denominator) {
  if (!denominator) return 0;
  return Math.min(100, Math.round((numerator / denominator) * 100));
}

export default function FacilitatorDashboard() {
  const { user, signOut } = useAuthUser();
  const facilitatorEmail = (user?.email || "").toLowerCase();

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [cohorts, setCohorts] = useState([]);
  const [members, setMembers] = useState([]);
  const [progress, setProgress] = useState([]);
  const [expandedCohortId, setExpandedCohortId] = useState(null);
  // { [cohortId]: { email, busy, error } }
  const [enrollState, setEnrollState] = useState({});
  const [removeBusyId, setRemoveBusyId] = useState(null);

  const refresh = useCallback(async () => {
    setErrorMsg("");
    try {
      const { data: cohortRows, error: cErr } = await supabase
        .from("m2m_cohorts")
        .select("id,cohort_name,os_lane,facilitator_email,start_date,status,created_at")
        .order("created_at", { ascending: false });
      if (cErr) throw cErr;

      const cohortIds = (cohortRows || []).map((c) => c.id);
      if (!cohortIds.length) {
        setCohorts([]);
        setMembers([]);
        setProgress([]);
        return;
      }

      const { data: memberRows, error: mErr } = await supabase
        .from("m2m_cohort_members")
        .select("id,cohort_id,user_id,email,enrolled_at,status")
        .in("cohort_id", cohortIds);
      if (mErr) throw mErr;

      const memberEmails = Array.from(
        new Set((memberRows || []).map((m) => (m.email || "").toLowerCase()).filter(Boolean))
      );

      let progressRows = [];
      if (memberEmails.length) {
        const { data: progData, error: pErr } = await supabase
          .from("m2m_module_progress")
          .select("email,os_lane,module_id,completed,completed_at,status")
          .in("email", memberEmails);
        if (pErr) throw pErr;
        progressRows = progData || [];
      }

      setCohorts(cohortRows || []);
      setMembers(memberRows || []);
      setProgress(progressRows);
    } catch (err) {
      setErrorMsg(err?.message || "Could not load cohort data.");
    }
  }, []);

  useEffect(() => {
    if (!facilitatorEmail) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      await refresh();
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [facilitatorEmail, refresh]);

  const myCohorts = useMemo(
    () => cohorts.filter((c) => (c.facilitator_email || "").toLowerCase() === facilitatorEmail),
    [cohorts, facilitatorEmail]
  );

  const isFacilitator = myCohorts.length > 0;

  const cohortSummaries = useMemo(() => {
    return myCohorts.map((cohort) => {
      const allCohortMembers = members.filter((m) => m.cohort_id === cohort.id);
      const activeCohortMembers = allCohortMembers.filter((m) => m.status === "active");
      const total = laneTotal(cohort.os_lane);

      const perMember = activeCohortMembers.map((m) => {
        const email = (m.email || "").toLowerCase();
        const memberProgress = progress.filter(
          (p) =>
            (p.email || "").toLowerCase() === email &&
            (p.os_lane === cohort.os_lane || !p.os_lane)
        );
        const completedSet = new Set(
          memberProgress
            .filter((p) => p.completed === true || p.status === "completed")
            .map((p) => p.module_id)
        );
        const completedCount = completedSet.size;
        return {
          memberId: m.id,
          email: m.email,
          status: m.status,
          enrolledAt: m.enrolled_at,
          completedCount,
          completionPct: pct(completedCount, total),
        };
      });

      const cohortTotalSlots = activeCohortMembers.length * total;
      const cohortCompleted = perMember.reduce((sum, p) => sum + p.completedCount, 0);

      return {
        ...cohort,
        memberCount: activeCohortMembers.length,
        cohortCompletionPct: pct(cohortCompleted, cohortTotalSlots),
        perMember,
        totalModules: total,
      };
    });
  }, [myCohorts, members, progress]);

  const totalMembers = cohortSummaries.reduce((s, c) => s + c.memberCount, 0);
  const avgCompletion =
    cohortSummaries.length
      ? Math.round(
          cohortSummaries.reduce((s, c) => s + c.cohortCompletionPct, 0) / cohortSummaries.length
        )
      : 0;

  const handleSignOut = useCallback(async () => {
    try { await signOut(); } catch { /* ignore */ }
    if (typeof window !== "undefined") {
      window.location.assign("/dashboard");
    }
  }, [signOut]);

  const setEnrollField = (cohortId, patch) =>
    setEnrollState((prev) => ({
      ...prev,
      [cohortId]: { email: "", busy: false, error: "", ...(prev[cohortId] || {}), ...patch },
    }));

  const handleAddMember = async (cohort) => {
    const current = enrollState[cohort.id] || { email: "" };
    const trimmed = (current.email || "").trim();
    if (!trimmed) {
      setEnrollField(cohort.id, { error: "Enter an email." });
      return;
    }
    if (!EMAIL_RE.test(trimmed)) {
      setEnrollField(cohort.id, { error: "That doesn't look like a valid email." });
      return;
    }
    const lower = trimmed.toLowerCase();

    const existing = members.find(
      (m) =>
        m.cohort_id === cohort.id &&
        (m.email || "").toLowerCase() === lower
    );

    if (existing && existing.status === "active") {
      setEnrollField(cohort.id, { error: "Already enrolled in this cohort." });
      return;
    }

    setEnrollField(cohort.id, { busy: true, error: "" });
    try {
      if (existing && existing.status !== "active") {
        // Reactivate an inactive row rather than creating a duplicate.
        const { error: updErr } = await supabase
          .from("m2m_cohort_members")
          .update({ status: "active" })
          .eq("id", existing.id);
        if (updErr) throw updErr;
      } else {
        const { error: insErr } = await supabase
          .from("m2m_cohort_members")
          .insert({ cohort_id: cohort.id, email: trimmed, status: "active" });
        if (insErr) {
          if (/duplicate|unique/i.test(insErr.message || "")) {
            setEnrollField(cohort.id, { busy: false, error: "Already enrolled in this cohort." });
            return;
          }
          throw insErr;
        }
      }
      await refresh();
      setEnrollField(cohort.id, { email: "", busy: false, error: "" });
    } catch (err) {
      setEnrollField(cohort.id, { busy: false, error: err?.message || "Could not enroll member." });
    }
  };

  const handleRemoveMember = async (memberId) => {
    setRemoveBusyId(memberId);
    setErrorMsg("");
    try {
      const { error: rmErr } = await supabase
        .from("m2m_cohort_members")
        .update({ status: "inactive" })
        .eq("id", memberId);
      if (rmErr) throw rmErr;
      await refresh();
    } catch (err) {
      setErrorMsg(err?.message || "Could not remove member.");
    } finally {
      setRemoveBusyId(null);
    }
  };

  if (loading) {
    return <FullScreenMessage title="Facilitator Dashboard" sub="Loading cohorts…" />;
  }

  if (!isFacilitator) {
    return (
      <FullScreenMessage
        title="Access restricted"
        sub={`This dashboard is for cohort facilitators. ${facilitatorEmail || "Your account"} is not listed as a facilitator on any active cohort.`}
        action={
          <button onClick={handleSignOut} style={btnGhost}>
            Sign out
          </button>
        }
      />
    );
  }

  return (
    <div style={page}>
      <header style={header}>
        <div>
          <div style={brandMark}>M2M~Inc.</div>
          <div style={kicker}>Facilitator Dashboard</div>
          <h1 style={h1}>Cohort Command</h1>
          <div style={subline}>
            Signed in as <span style={{ color: T.goldLight }}>{facilitatorEmail}</span>
          </div>
        </div>
        <button onClick={handleSignOut} style={btnGhost}>
          Sign out
        </button>
      </header>

      {errorMsg && <div style={errorBanner}>{errorMsg}</div>}

      <section style={statsRow}>
        <StatCard label="Active Cohorts" value={cohortSummaries.length} />
        <StatCard label="Active Members" value={totalMembers} />
        <StatCard label="Avg Cohort Completion" value={`${avgCompletion}%`} />
      </section>

      <section style={{ display: "grid", gap: 18 }}>
        {cohortSummaries.length === 0 ? (
          <div style={emptyState}>
            No cohorts assigned to {facilitatorEmail} yet. Add a row to <code>m2m_cohorts</code> with this email as
            facilitator to begin.
          </div>
        ) : (
          cohortSummaries.map((cohort) => {
            const expanded = expandedCohortId === cohort.id;
            const enroll = enrollState[cohort.id] || { email: "", busy: false, error: "" };
            return (
              <article key={cohort.id} style={cohortCard}>
                <button
                  type="button"
                  onClick={() => setExpandedCohortId(expanded ? null : cohort.id)}
                  style={cohortHeader}
                >
                  <div style={{ textAlign: "left" }}>
                    <div style={cohortTitle}>{cohort.cohort_name}</div>
                    <div style={cohortMeta}>
                      {LANE_LABEL[cohort.os_lane] || cohort.os_lane} ·{" "}
                      {cohort.start_date ? `Started ${cohort.start_date}` : "No start date"} ·{" "}
                      {cohort.status || "active"}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <MetricChip label="Members" value={cohort.memberCount} />
                    <MetricChip label="Completion" value={`${cohort.cohortCompletionPct}%`} />
                    <span style={chevron(expanded)}>▾</span>
                  </div>
                </button>

                {expanded && (
                  <div style={memberPanel}>
                    <form
                      onSubmit={(e) => { e.preventDefault(); handleAddMember(cohort); }}
                      style={enrollRow}
                    >
                      <input
                        type="email"
                        placeholder="member@email.com"
                        value={enroll.email}
                        disabled={enroll.busy}
                        onChange={(e) => setEnrollField(cohort.id, { email: e.target.value, error: "" })}
                        style={enrollInput}
                      />
                      <button
                        type="submit"
                        disabled={enroll.busy || !enroll.email.trim()}
                        style={enroll.busy || !enroll.email.trim() ? btnPrimaryDisabled : btnPrimary}
                      >
                        {enroll.busy ? "Enrolling…" : "Add Member"}
                      </button>
                    </form>
                    {enroll.error && <div style={inlineError}>{enroll.error}</div>}

                    {cohort.perMember.length === 0 ? (
                      <div style={{ color: T.muted, padding: "14px 18px" }}>No active members enrolled.</div>
                    ) : (
                      <table style={memberTable}>
                        <thead>
                          <tr>
                            <th style={thStyle}>Member</th>
                            <th style={thStyle}>Enrolled</th>
                            <th style={thStyle}>Modules</th>
                            <th style={thStyle}>Progress</th>
                            <th style={thStyleRight}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {cohort.perMember.map((m) => (
                            <tr key={m.memberId}>
                              <td style={tdStyle}>{m.email}</td>
                              <td style={tdStyle}>{formatDate(m.enrolledAt)}</td>
                              <td style={tdStyle}>
                                {m.completedCount} / {cohort.totalModules}
                              </td>
                              <td style={tdStyle}>
                                <ProgressBar pct={m.completionPct} />
                              </td>
                              <td style={tdStyleRight}>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveMember(m.memberId)}
                                  disabled={removeBusyId === m.memberId}
                                  style={btnRemove}
                                >
                                  {removeBusyId === m.memberId ? "Removing…" : "Remove"}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </article>
            );
          })
        )}
      </section>

      <footer style={footer}>FL/II Doctrine · Trust/Liability Gate active · To the work.</footer>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toISOString().slice(0, 10);
}

function FullScreenMessage({ title, sub, action }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.ink,
        color: T.white,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        padding: "32px 20px",
        fontFamily: "'Inter','Segoe UI',sans-serif",
        textAlign: "center",
      }}
    >
      <div style={{ color: T.gold, fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 600 }}>
        M2M~Inc.
      </div>
      <div style={{ fontSize: 20, fontWeight: 700 }}>{title}</div>
      <div style={{ color: T.muted, maxWidth: 480, lineHeight: 1.55 }}>{sub}</div>
      {action}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={statCard}>
      <div style={statLabel}>{label}</div>
      <div style={statValue}>{value}</div>
    </div>
  );
}

function MetricChip({ label, value }) {
  return (
    <div style={metricChip}>
      <span style={{ color: T.muted, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase" }}>{label}</span>
      <span style={{ color: T.goldLight, fontWeight: 700, fontSize: 15 }}>{value}</span>
    </div>
  );
}

function ProgressBar({ pct }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 180 }}>
      <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" }}>
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${T.gold}, ${T.goldLight})`,
            transition: "width 0.3s ease",
          }}
        />
      </div>
      <span style={{ color: T.goldLight, fontSize: 12, fontWeight: 700, minWidth: 38, textAlign: "right" }}>
        {pct}%
      </span>
    </div>
  );
}

const page = {
  minHeight: "100vh",
  background: T.ink,
  color: T.white,
  fontFamily: "'Inter','Segoe UI',sans-serif",
  padding: "40px 32px 80px",
  maxWidth: 1200,
  margin: "0 auto",
};
const header = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, gap: 24 };
const brandMark = { color: T.gold, fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 600, letterSpacing: "0.04em" };
const kicker = { color: T.gold, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginTop: 4 };
const h1 = { fontSize: 30, margin: "8px 0 6px", color: T.white };
const subline = { color: T.muted, fontSize: 13 };
const errorBanner = {
  background: "rgba(255,90,90,0.1)",
  border: "1px solid rgba(255,90,90,0.3)",
  borderRadius: 8,
  padding: "10px 14px",
  color: "#ffb3b3",
  marginBottom: 18,
  fontSize: 13,
};
const statsRow = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 28 };
const statCard = {
  background: T.navy,
  border: `1px solid ${T.border}`,
  borderRadius: 12,
  padding: "16px 18px",
};
const statLabel = { color: T.muted, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 700 };
const statValue = { color: T.goldLight, fontSize: 28, fontWeight: 800, marginTop: 6, fontFamily: "'Cormorant Garamond',serif" };
const cohortCard = {
  background: T.navy,
  border: `1px solid ${T.border}`,
  borderRadius: 14,
  overflow: "hidden",
};
const cohortHeader = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  padding: "18px 22px",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  color: T.white,
  fontFamily: "inherit",
  gap: 16,
};
const cohortTitle = { fontSize: 18, fontWeight: 700, color: T.white };
const cohortMeta = { color: T.muted, fontSize: 12, marginTop: 4, letterSpacing: 0.3 };
const metricChip = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: 2,
  padding: "6px 12px",
  background: "rgba(201,168,76,0.08)",
  border: `1px solid ${T.border}`,
  borderRadius: 8,
  minWidth: 96,
};
const chevron = (expanded) => ({
  color: T.gold,
  fontSize: 18,
  transition: "transform 0.2s",
  transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
});
const memberPanel = { borderTop: `1px solid ${T.border}`, background: "rgba(0,0,0,0.18)" };
const enrollRow = {
  display: "flex",
  gap: 10,
  padding: "16px 22px",
  alignItems: "center",
};
const enrollInput = {
  flex: 1,
  background: "rgba(255,255,255,0.05)",
  border: `1px solid ${T.border}`,
  borderRadius: 8,
  padding: "10px 14px",
  color: T.white,
  fontSize: 14,
  outline: "none",
  fontFamily: "inherit",
};
const btnPrimary = {
  background: T.gold,
  border: "none",
  borderRadius: 8,
  padding: "10px 18px",
  color: T.navy,
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: 0.5,
  cursor: "pointer",
};
const btnPrimaryDisabled = {
  ...{
    background: "rgba(201,168,76,0.25)",
    border: "none",
    borderRadius: 8,
    padding: "10px 18px",
    color: T.goldDim,
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: 0.5,
    cursor: "not-allowed",
  },
};
const btnRemove = {
  background: "transparent",
  border: `1px solid rgba(196,68,79,0.4)`,
  color: "#ff9aa3",
  padding: "6px 12px",
  borderRadius: 6,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 0.5,
  cursor: "pointer",
  textTransform: "uppercase",
};
const inlineError = {
  color: "#ff9aa3",
  fontSize: 12,
  padding: "0 22px 14px",
};
const memberTable = { width: "100%", borderCollapse: "collapse" };
const thStyle = {
  textAlign: "left",
  padding: "12px 22px",
  fontSize: 10,
  letterSpacing: 1.8,
  textTransform: "uppercase",
  color: T.gold,
  fontWeight: 700,
  borderBottom: `1px solid ${T.border}`,
};
const thStyleRight = { ...thStyle, textAlign: "right" };
const tdStyle = {
  padding: "12px 22px",
  fontSize: 13,
  color: T.white,
  borderBottom: "1px solid rgba(255,255,255,0.04)",
  verticalAlign: "middle",
};
const tdStyleRight = { ...tdStyle, textAlign: "right" };
const emptyState = {
  background: T.navy,
  border: `1px dashed ${T.border}`,
  borderRadius: 12,
  padding: "28px 22px",
  color: T.muted,
  fontSize: 14,
  lineHeight: 1.55,
};
const btnGhost = {
  background: "transparent",
  border: `1px solid ${T.border}`,
  color: T.gold,
  padding: "9px 16px",
  borderRadius: 8,
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 1,
  textTransform: "uppercase",
  cursor: "pointer",
};
const footer = {
  marginTop: 48,
  textAlign: "center",
  color: "rgba(255,255,255,0.35)",
  fontSize: 11,
  letterSpacing: 1.5,
};
