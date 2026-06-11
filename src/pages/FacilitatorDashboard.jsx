import { useEffect, useMemo, useState } from "react";
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

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setErrorMsg("");
      try {
        const { data: cohortRows, error: cErr } = await supabase
          .from("m2m_cohorts")
          .select("id,cohort_name,os_lane,facilitator_email,start_date,status,created_at")
          .order("created_at", { ascending: false });
        if (cErr) throw cErr;
        if (cancelled) return;

        const cohortIds = (cohortRows || []).map((c) => c.id);
        if (!cohortIds.length) {
          setCohorts([]);
          setMembers([]);
          setProgress([]);
          setLoading(false);
          return;
        }

        const { data: memberRows, error: mErr } = await supabase
          .from("m2m_cohort_members")
          .select("id,cohort_id,user_id,email,enrolled_at,status")
          .in("cohort_id", cohortIds);
        if (mErr) throw mErr;
        if (cancelled) return;

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

        if (cancelled) return;
        setCohorts(cohortRows || []);
        setMembers(memberRows || []);
        setProgress(progressRows);
      } catch (err) {
        if (!cancelled) setErrorMsg(err?.message || "Could not load cohort data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (facilitatorEmail) load();
    return () => { cancelled = true; };
  }, [facilitatorEmail]);

  const myCohorts = useMemo(
    () => cohorts.filter((c) => (c.facilitator_email || "").toLowerCase() === facilitatorEmail),
    [cohorts, facilitatorEmail]
  );

  const isFacilitator = myCohorts.length > 0;

  const cohortSummaries = useMemo(() => {
    return myCohorts.map((cohort) => {
      const cohortMembers = members.filter((m) => m.cohort_id === cohort.id);
      const total = laneTotal(cohort.os_lane);

      const perMember = cohortMembers.map((m) => {
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

      const cohortTotalSlots = cohortMembers.length * total;
      const cohortCompleted = perMember.reduce((sum, p) => sum + p.completedCount, 0);

      return {
        ...cohort,
        memberCount: cohortMembers.length,
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

  if (loading) {
    return <FullScreenMessage title="Facilitator Dashboard" sub="Loading cohorts…" />;
  }

  if (!isFacilitator) {
    return (
      <FullScreenMessage
        title="Access restricted"
        sub={`This dashboard is for cohort facilitators. ${facilitatorEmail || "Your account"} is not listed as a facilitator on any active cohort.`}
        action={
          <button onClick={signOut} style={btnGhost}>
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
        <button onClick={signOut} style={btnGhost}>
          Sign out
        </button>
      </header>

      {errorMsg && <div style={errorBanner}>{errorMsg}</div>}

      <section style={statsRow}>
        <StatCard label="Active Cohorts" value={cohortSummaries.length} />
        <StatCard label="Total Members" value={totalMembers} />
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
                  <div style={memberTableWrap}>
                    {cohort.perMember.length === 0 ? (
                      <div style={{ color: T.muted, padding: "14px 18px" }}>No members enrolled.</div>
                    ) : (
                      <table style={memberTable}>
                        <thead>
                          <tr>
                            <th style={thStyle}>Member</th>
                            <th style={thStyle}>Status</th>
                            <th style={thStyle}>Modules</th>
                            <th style={thStyle}>Progress</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cohort.perMember.map((m) => (
                            <tr key={m.memberId}>
                              <td style={tdStyle}>{m.email}</td>
                              <td style={tdStyle}>{m.status || "active"}</td>
                              <td style={tdStyle}>
                                {m.completedCount} / {cohort.totalModules}
                              </td>
                              <td style={tdStyle}>
                                <ProgressBar pct={m.completionPct} />
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
const memberTableWrap = { borderTop: `1px solid ${T.border}`, background: "rgba(0,0,0,0.18)" };
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
const tdStyle = {
  padding: "12px 22px",
  fontSize: 13,
  color: T.white,
  borderBottom: "1px solid rgba(255,255,255,0.04)",
  verticalAlign: "middle",
};
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
