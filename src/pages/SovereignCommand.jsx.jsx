import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const STATUS_COLOR = {
  CLOSED: "#22c55e",
  APPROVED: "#3b82f6",
  RUNNING: "#f59e0b",
  INITIATED: "#8b5cf6",
  HUMAN_REQUIRED: "#ef4444",
  default: "#6b7280",
};

function Badge({ status }) {
  const color = STATUS_COLOR[status] || STATUS_COLOR.default;
  return (
    <span style={{ background: color + "22", color, border: `1px solid ${color}55`, borderRadius: 4, padding: "2px 8px", fontSize: 11, fontFamily: "monospace", fontWeight: 700, letterSpacing: 1 }}>
      {status}
    </span>
  );
}

function Section({ label, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #C9A84C33", paddingBottom: 8, marginBottom: 16 }}>
        <span style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: 2, color: "#C9A84C", textTransform: "uppercase" }}>
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

function Card({ children, highlight }) {
  return (
    <div style={{ background: highlight ? "#C9A84C0A" : "#0D1B2A", border: `1px solid ${highlight ? "#C9A84C44" : "#1e3a5f"}`, borderRadius: 6, padding: "14px 18px", marginBottom: 10 }}>
      {children}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div style={{ color: "#4b6080", fontSize: 13, padding: "20px 0", textAlign: "center", fontStyle: "italic" }}>
      {message}
    </div>
  );
}

function daysUntil(dateStr) {
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function SovereignCommand() {
  const [briefs, setBriefs] = useState([]);
  const [loops, setLoops] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [activeBrief, setActiveBrief] = useState(null);

  async function fetchAll() {
    setLoading(true);
    const [briefRes, loopRes, oppRes] = await Promise.all([
      supabase.from("m2m_daily_intel").select("*").order("created_at", { ascending: false }).limit(5),
      supabase.from("loop_executions").select("id, loop_name, status, last_gate_verdict, updated_at, make_scenario_id").order("updated_at", { ascending: false }).limit(10),
      supabase.from("m2m_human_opportunities").select("*").order("deadline", { ascending: true }).limit(10),
    ]);
    setBriefs(briefRes.data || []);
    setLoops(loopRes.data || []);
    setOpportunities(oppRes.data || []);
    setLastRefresh(new Date());
    setLoading(false);
  }

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const latestBrief = briefs[0];

  return (
    <div style={{ minHeight: "100vh", background: "#060E18", color: "#e2eaf4", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid #C9A84C33", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#060E18", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e" }} />
          <span style={{ fontFamily: "monospace", fontSize: 13, letterSpacing: 2, color: "#C9A84C", fontWeight: 700 }}>SOVEREIGN COMMAND</span>
          <span style={{ color: "#4b6080", fontSize: 11 }}>M2M~Inc.</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {lastRefresh && (
            <span style={{ color: "#4b6080", fontSize: 11, fontFamily: "monospace" }}>{lastRefresh.toLocaleTimeString()}</span>
          )}
          <button onClick={fetchAll} disabled={loading} style={{ background: "transparent", border: "1px solid #C9A84C44", color: "#C9A84C", borderRadius: 4, padding: "4px 12px", fontSize: 11, fontFamily: "monospace", cursor: loading ? "wait" : "pointer", letterSpacing: 1 }}>
            {loading ? "SYNCING..." : "REFRESH"}
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px" }}>

        {/* Latest Brief */}
        <Section label="Latest Brief">
          {latestBrief ? (
            <Card highlight>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <span style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: 1, color: "#C9A84C" }}>
                  {latestBrief.brief_type} — {new Date(latestBrief.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
                {!latestBrief.kev_reviewed && (
                  <span style={{ background: "#f59e0b22", color: "#f59e0b", border: "1px solid #f59e0b44", borderRadius: 4, padding: "2px 8px", fontSize: 10, fontFamily: "monospace" }}>UNREVIEWED</span>
                )}
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.7, color: "#c8d8ea", whiteSpace: "pre-wrap", maxHeight: activeBrief === latestBrief.id ? "none" : 200, overflow: "hidden" }}>
                {latestBrief.content || "No content."}
              </div>
              <button onClick={() => setActiveBrief(activeBrief === latestBrief.id ? null : latestBrief.id)} style={{ marginTop: 10, background: "transparent", border: "none", color: "#C9A84C", fontSize: 11, fontFamily: "monospace", cursor: "pointer", padding: 0, letterSpacing: 1 }}>
                {activeBrief === latestBrief.id ? "COLLAPSE" : "READ FULL BRIEF"}
              </button>
            </Card>
          ) : (
            <EmptyState message="No briefs yet. LOOP-WATCHER generates a new one every 15 minutes." />
          )}
        </Section>

        {/* Certification Deadlines */}
        <Section label="Certification Deadlines">
          {opportunities.length === 0 ? (
            <EmptyState message="No active opportunities." />
          ) : (
            opportunities.map((opp) => {
              const days = daysUntil(opp.deadline);
              const urgent = days <= 30;
              const overdue = days < 0;
              return (
                <Card key={opp.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{opp.opportunity_title}</div>
                      <div style={{ fontSize: 12, color: "#4b6080" }}>
                        {opp.agency} · {opp.entity}{opp.solicitation_num && ` · ${opp.solicitation_num}`}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 16 }}>
                      <div style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: overdue ? "#ef4444" : urgent ? "#f59e0b" : "#22c55e" }}>
                        {overdue ? `${Math.abs(days)}d overdue` : days === 0 ? "TODAY" : `${days}d`}
                      </div>
                      <div style={{ fontSize: 11, color: "#4b6080", fontFamily: "monospace" }}>
                        {new Date(opp.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </div>
                    </div>
                  </div>
                  {opp.capability_draft && (
                    <div style={{ marginTop: 8, fontSize: 12, color: "#4b6080", lineHeight: 1.5, borderTop: "1px solid #1e3a5f", paddingTop: 8 }}>
                      {opp.capability_draft.slice(0, 180)}{opp.capability_draft.length > 180 && "…"}
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </Section>

        {/* Loop Execution Log */}
        <Section label="Loop Execution Log">
          {loops.length === 0 ? (
            <EmptyState message="No loop executions found." />
          ) : (
            loops.map((loop) => (
              <Card key={loop.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{loop.loop_name}</div>
                    <div style={{ fontSize: 11, color: "#4b6080", fontFamily: "monospace" }}>
                      {new Date(loop.updated_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                      {loop.last_gate_verdict && ` · GATE: ${loop.last_gate_verdict}`}
                    </div>
                  </div>
                  <Badge status={loop.status} />
                </div>
              </Card>
            ))
          )}
        </Section>

        {/* Brief History */}
        {briefs.length > 1 && (
          <Section label="Brief History">
            {briefs.slice(1).map((b) => (
              <Card key={b.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: activeBrief === b.id ? 10 : 0 }}>
                  <span style={{ fontFamily: "monospace", fontSize: 12, color: "#C9A84C" }}>
                    {b.brief_type} — {new Date(b.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  <button onClick={() => setActiveBrief(activeBrief === b.id ? null : b.id)} style={{ background: "transparent", border: "none", color: "#4b6080", fontSize: 11, fontFamily: "monospace", cursor: "pointer", letterSpacing: 1 }}>
                    {activeBrief === b.id ? "COLLAPSE" : "VIEW"}
                  </button>
                </div>
                {activeBrief === b.id && (
                  <div style={{ fontSize: 13, lineHeight: 1.7, color: "#c8d8ea", whiteSpace: "pre-wrap", borderTop: "1px solid #1e3a5f", paddingTop: 10 }}>
                    {b.content || "No content."}
                  </div>
                )}
              </Card>
            ))}
          </Section>
        )}

        {/* Footer */}
        <div style={{ borderTop: "1px solid #C9A84C22", paddingTop: 20, marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "monospace", fontSize: 10, color: "#4b6080", letterSpacing: 1 }}>
            FL/II DOCTRINE ACTIVE · LOOP-WATCHER-5403849 · M2M~Inc. SDVOSB+VBE
          </span>
          <span style={{ fontFamily: "monospace", fontSize: 10, color: "#4b6080" }}>AUTO-REFRESH 5MIN</span>
        </div>
      </div>
    </div>
  );
}
