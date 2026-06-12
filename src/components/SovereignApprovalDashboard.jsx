import { useState, useEffect } from "react";

// ============================================================
// M2M SOVEREIGN COO AGENT — KEV APPROVAL INTERFACE
// HOTL Checkpoint Dashboard v1.0
// Supabase: jnmywpfdykuybrxkdcmc
// Deploy to: src/components/SovereignApprovalDashboard.jsx
// Route: /portal/approvals
// ============================================================

const SUPABASE_URL = "https://jnmywpfdykuybrxkdcmc.supabase.co";

const RISK_COLORS = {
  Critical: { border: "border-red-600",    badge: "bg-red-600 text-white",      dot: "bg-red-500" },
  High:     { border: "border-orange-500", badge: "bg-orange-500 text-white",   dot: "bg-orange-400" },
  Medium:   { border: "border-yellow-500", badge: "bg-yellow-600 text-white",   dot: "bg-yellow-400" },
  Low:      { border: "border-emerald-600",badge: "bg-emerald-600 text-white",  dot: "bg-emerald-500" },
};

const TIER_BADGE = {
  HITL:  "bg-red-600 text-white",
  HOTL:  "bg-orange-500 text-white",
  HOOTL: "bg-emerald-600 text-white",
};

const PRIORITY_ORDER = { Critical: 0, High: 1, Normal: 2, Low: 3 };

// ── helpers ──────────────────────────────────────────────────
function timeAgo(ts) {
  const d = (Date.now() - new Date(ts)) / 1000;
  if (d < 60)    return `${Math.floor(d)}s ago`;
  if (d < 3600)  return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
}

function deadlineStatus(ts) {
  if (!ts) return null;
  const h = (new Date(ts) - Date.now()) / 3600000;
  if (h < 0)  return { label: "OVERDUE",          cls: "text-red-400 animate-pulse font-bold" };
  if (h < 2)  return { label: `${Math.floor(h * 60)}m left`, cls: "text-red-400 font-semibold" };
  if (h < 8)  return { label: `${Math.floor(h)}h left`,      cls: "text-orange-400" };
  return       { label: `${Math.floor(h)}h left`,             cls: "text-zinc-400" };
}

// ── Demo data ─────────────────────────────────────────────────
const DEMO = [
  {
    id: "demo-1",
    created_at: new Date(Date.now() - 720000).toISOString(),
    deliverable_ref: "DQ-20260612-A1B2C3",
    entity: "M2M~Inc.",
    engagement_name: "Presidio BD Initiative",
    deliverable_type: "Executive Summary",
    governance_tier: "HOTL",
    dart_risk_level: "High",
    is_client_facing: true,
    voice_gate_passed: true,
    gates_passed: true,
    saf_sdvosb_flag: false,
    priority: "High",
    action_summary: "Two-page executive summary for Todd Hawthorne / Presidio — Human OS™ positioning aligned to Tammy Sala (CHRO) workforce transformation priorities.",
    full_content: "M2M~Inc. delivers Human OS™ — a governed workforce transformation infrastructure built for enterprise environments where AI accountability is not optional.\n\nEvery engagement operates under a documented Client Governance Standard: classified before execution, risk-tiered, audit-logged, and available for review on demand.\n\nFor Presidio, Human OS™ addresses the gap between workforce capability and business velocity — specifically the translation problem between what your people can do and what the organization gives them credit for.\n\nEngagement entry point: 90-day diagnostic and program design. Investment range: available upon qualification.",
    decision_deadline: new Date(Date.now() + 21600000).toISOString(),
    status: "Pending",
  },
  {
    id: "demo-2",
    created_at: new Date(Date.now() - 2700000).toISOString(),
    deliverable_ref: "DQ-20260612-D4E5F6",
    entity: "Solutions Afoot LLC",
    engagement_name: "NGA IDIQ Pursuit",
    deliverable_type: "Capability Statement",
    governance_tier: "HOTL",
    dart_risk_level: "Critical",
    is_client_facing: true,
    voice_gate_passed: true,
    gates_passed: false,
    saf_sdvosb_flag: true,
    priority: "Critical",
    action_summary: "SAF capability statement for NGA $947M IDIQ — CERT POSTURE FLAG RAISED. Review required before any external use.",
    full_content: "SAF CERT POSTURE ALERT:\n\nSolutions Afoot LLC holds: VBE + CAGE 9QVH2 ONLY.\nSAF does NOT hold SDVOSB certification.\n\nAny representation of SDVOSB status for SAF in this document must be removed before delivery.\n\nPrimary signatory: Josh Schuminsky (CEO).\nKevin A. Smith role: COO (Part-Time).\n\nDocument content pending cert posture clearance.",
    decision_deadline: new Date(Date.now() + 5400000).toISOString(),
    status: "Pending",
  },
  {
    id: "demo-3",
    created_at: new Date(Date.now() - 300000).toISOString(),
    deliverable_ref: "DQ-20260612-G7H8I9",
    entity: "M2M~Inc.",
    engagement_name: "Internal — Sprint 2",
    deliverable_type: "Pipeline Report",
    governance_tier: "HOOTL",
    dart_risk_level: "Low",
    is_client_facing: false,
    voice_gate_passed: true,
    gates_passed: true,
    saf_sdvosb_flag: false,
    priority: "Normal",
    action_summary: "Weekly pipeline health report — HubSpot portal 243496045. 3 deals flagged stale (14+ day inactivity).",
    full_content: "PIPELINE HEALTH REPORT — June 12, 2026\n\nSTALE DEALS (14+ days no activity):\n1. Wendell Brown / Wells Fargo — Last touch: May 29\n2. Todd Hawthorne / Presidio — Last touch: June 3\n3. Aisha Bowe / STEMBoard — Last touch: May 31\n\nACTIVE PIPELINE: 7 deals\nSPRINT 2 TRACKING: Begins this week.",
    decision_deadline: null,
    status: "Pending",
  },
];

// ── Approval Card ─────────────────────────────────────────────
function ApprovalCard({ item, onDecision, loadingId }) {
  const [open, setOpen]   = useState(false);
  const [notes, setNotes] = useState("");
  const risk = RISK_COLORS[item.dart_risk_level] || RISK_COLORS.Low;
  const dl   = deadlineStatus(item.decision_deadline);
  const busy = loadingId === item.id;

  return (
    <div className={`rounded-xl border ${risk.border} bg-zinc-900 overflow-hidden mb-4`}>
      {/* Header row */}
      <div className="px-5 py-4 flex items-start justify-between gap-4 cursor-pointer"
           onClick={() => setOpen(o => !o)}>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${TIER_BADGE[item.governance_tier]}`}>
              {item.governance_tier}
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${risk.badge}`}>
              {item.dart_risk_level}
            </span>
            {item.is_client_facing && (
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-700 text-white">EXTERNAL</span>
            )}
            {item.saf_sdvosb_flag && (
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-600 text-white animate-pulse">
                ⚠ SAF CERT FLAG
              </span>
            )}
            {!item.voice_gate_passed && (
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-700 text-white">
                VOICE-GATE FAILED
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-white font-semibold">{item.deliverable_type}</span>
            <span className="text-zinc-400 text-sm">·</span>
            <span className="text-zinc-300 text-sm">{item.entity}</span>
          </div>
          {item.engagement_name && (
            <p className="text-zinc-400 text-xs mt-0.5 truncate">{item.engagement_name}</p>
          )}
          <p className="text-zinc-300 text-sm mt-2 line-clamp-2">{item.action_summary}</p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-zinc-500 text-xs">{timeAgo(item.created_at)}</span>
          {dl && <span className={`text-xs ${dl.cls}`}>{dl.label}</span>}
          <span className="text-zinc-600 text-xs font-mono">{item.deliverable_ref}</span>
          <span className="text-zinc-500 text-xs mt-1">{open ? "▲" : "▼"}</span>
        </div>
      </div>

      {/* Expanded */}
      {open && (
        <div className="px-5 pb-5 border-t border-zinc-800">
          <p className="text-zinc-400 text-xs uppercase tracking-widest mt-4 mb-2 font-semibold">
            Deliverable Content
          </p>
          <pre className="bg-zinc-950 text-zinc-200 text-sm p-4 rounded-lg border border-zinc-700 whitespace-pre-wrap font-mono overflow-auto max-h-64">
            {item.full_content}
          </pre>

          {/* Gate status */}
          <div className="flex gap-3 my-4">
            {[
              { label: "Gate 1: Classification",  pass: item.gates_passed },
              { label: "Gate 2: Voice Integrity",  pass: item.voice_gate_passed },
              { label: "Gate 3: Trust/Liability",  pass: item.gates_passed && !item.saf_sdvosb_flag },
            ].map(g => (
              <div key={g.label}
                   className={`flex-1 rounded-lg px-3 py-2 text-center border ${
                     g.pass ? "bg-emerald-900/30 border-emerald-700" : "bg-red-900/30 border-red-700"
                   }`}>
                <p className="text-xs text-zinc-400">{g.label}</p>
                <p className={`text-sm font-bold ${g.pass ? "text-emerald-400" : "text-red-400"}`}>
                  {g.pass ? "✓ Pass" : "✗ Fail"}
                </p>
              </div>
            ))}
          </div>

          <textarea
            rows={2}
            placeholder="Decision notes (optional)..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-3 text-zinc-200 text-sm
                       placeholder-zinc-500 focus:outline-none focus:border-zinc-400 resize-none mb-4"
          />

          <div className="flex gap-3">
            {[
              { label: "✓ APPROVE",  decision: "Approved",           cls: "bg-emerald-700 hover:bg-emerald-600" },
              { label: "↩ REVISE",   decision: "Revision Requested", cls: "bg-yellow-700 hover:bg-yellow-600"  },
              { label: "✗ REJECT",   decision: "Rejected",           cls: "bg-red-800 hover:bg-red-700"        },
            ].map(btn => (
              <button
                key={btn.decision}
                disabled={busy}
                onClick={() => onDecision(item, btn.decision, notes)}
                className={`flex-1 ${btn.cls} disabled:opacity-50 text-white font-bold py-3 px-4
                            rounded-lg transition-colors text-sm`}
              >
                {busy ? "Processing..." : btn.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Activity Feed ─────────────────────────────────────────────
function ActivityFeed({ items }) {
  if (!items.length) return (
    <div className="text-center text-zinc-600 py-10 text-sm">No activity logged yet.</div>
  );
  return (
    <div className="space-y-2">
      {items.map(item => (
        <div key={item.id || item.record_id}
             className="flex items-start gap-3 py-2 border-b border-zinc-800 last:border-0">
          <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
            item.outcome === "Executed"    ? "bg-emerald-500" :
            item.outcome === "Escalated"  ? "bg-red-500"     :
            item.outcome === "Rolled Back"? "bg-orange-500"  : "bg-zinc-500"
          }`} />
          <div className="flex-1 min-w-0">
            <p className="text-zinc-300 text-sm truncate">
              {item.action_description || item.action_summary}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-zinc-500 text-xs">{item.entity}</span>
              <span className="text-zinc-700 text-xs">·</span>
              <span className={`text-xs font-medium ${
                item.governance_tier === "HITL"  ? "text-red-400"     :
                item.governance_tier === "HOTL"  ? "text-orange-400"  : "text-emerald-400"
              }`}>{item.governance_tier}</span>
              <span className="text-zinc-700 text-xs">·</span>
              <span className="text-zinc-500 text-xs">{timeAgo(item.created_at)}</span>
            </div>
          </div>
          <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded ${
            item.outcome === "Executed" ? "bg-emerald-900 text-emerald-300" :
            item.outcome === "Pending"  ? "bg-zinc-700 text-zinc-300"       :
            "bg-red-900 text-red-300"
          }`}>
            {item.outcome || "Pending"}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────
export default function SovereignApprovalDashboard() {
  const [pending,     setPending]     = useState([]);
  const [activity,    setActivity]    = useState([]);
  const [decided,     setDecided]     = useState([]);
  const [loadingId,   setLoadingId]   = useState(null);
  const [toast,       setToast]       = useState(null);
  const [tab,         setTab]         = useState("pending");
  const [anonKey,     setAnonKey]     = useState("");
  const [connected,   setConnected]   = useState(false);
  const [connecting,  setConnecting]  = useState(false);

  // Load demo data on mount
  useEffect(() => {
    const sorted = [...DEMO].sort((a, b) =>
      PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    );
    setPending(sorted);
  }, []);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  }

  // Connect to live Supabase
  async function connectLive() {
    if (!anonKey.trim()) return;
    setConnecting(true);
    try {
      const headers = { apikey: anonKey, Authorization: `Bearer ${anonKey}` };
      const [pRes, aRes] = await Promise.all([
        fetch(`${SUPABASE_URL}/rest/v1/approval_queue?status=eq.Pending&order=created_at.desc&limit=20`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/sovereign_execution_log?order=created_at.desc&limit=20`, { headers }),
      ]);
      if (pRes.ok && aRes.ok) {
        const [pData, aData] = await Promise.all([pRes.json(), aRes.json()]);
        setPending([...pData].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]));
        setActivity(aData);
        setConnected(true);
        showToast(`Live — ${pData.length} pending · ${aData.length} log entries`);
      } else {
        showToast("Connection failed — check your Supabase anon key", "error");
      }
    } catch (e) {
      showToast("Error: " + e.message, "error");
    }
    setConnecting(false);
  }

  // Handle decision
  async function handleDecision(item, decision, notes) {
    setLoadingId(item.id);
    try {
      if (connected && anonKey) {
        await fetch(`${SUPABASE_URL}/rest/v1/approval_queue?id=eq.${item.id}`, {
          method: "PATCH",
          headers: {
            apikey: anonKey,
            Authorization: `Bearer ${anonKey}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            status: decision,
            decided_by: "Kevin A. Smith",
            decided_at: new Date().toISOString(),
            decision_notes: notes || null,
          }),
        });
      }
      setPending(prev => prev.filter(p => p.id !== item.id));
      setDecided(prev => [{ ...item, status: decision, decision_notes: notes }, ...prev]);
      showToast(
        `${decision}: ${item.deliverable_type} — ${item.deliverable_ref}`,
        decision === "Approved" ? "success" : decision === "Rejected" ? "error" : "warning"
      );
    } catch (e) {
      showToast("Decision error: " + e.message, "error");
    }
    setLoadingId(null);
  }

  const stats = {
    pending:  pending.length,
    critical: pending.filter(p => p.dart_risk_level === "Critical").length,
    external: pending.filter(p => p.is_client_facing).length,
    safFlags: pending.filter(p => p.saf_sdvosb_flag).length,
  };

  const TABS = [
    { id: "pending",  label: `Pending (${pending.length})` },
    { id: "decided",  label: `Decided (${decided.length})` },
    { id: "activity", label: `SEL Log (${activity.length})` },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-xl text-sm font-medium max-w-sm ${
          toast.type === "success" ? "bg-emerald-800 text-emerald-100" :
          toast.type === "error"   ? "bg-red-800 text-red-100"         :
          "bg-yellow-800 text-yellow-100"
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="border-b border-zinc-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-zinc-400 uppercase tracking-widest font-semibold">
                Sovereign COO Agent
              </span>
            </div>
            <h1 className="text-xl font-bold">HOTL Approval Interface</h1>
            <p className="text-zinc-500 text-xs">D.A.R.T. Protocol v1.1 · M2M~Inc.</p>
          </div>
          <div className="text-right">
            <p className="text-zinc-300 text-sm font-medium">Kevin A. Smith</p>
            <p className="text-zinc-500 text-xs">Chief Opportunity Officer</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "Pending Review", value: stats.pending,  color: "text-white" },
            { label: "Critical Risk",  value: stats.critical, color: stats.critical > 0 ? "text-red-400" : "text-zinc-500" },
            { label: "Client Facing",  value: stats.external, color: stats.external > 0 ? "text-blue-400" : "text-zinc-500" },
            { label: "SAF Cert Flags", value: stats.safFlags, color: stats.safFlags > 0 ? "text-red-400 animate-pulse" : "text-zinc-500" },
          ].map(s => (
            <div key={s.label}
                 className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-zinc-500 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Live connection */}
        {!connected ? (
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 mb-6">
            <p className="text-zinc-400 text-sm mb-3">
              Connect to live data — or review the demo queue above.
            </p>
            <div className="flex gap-3">
              <input
                type="password"
                placeholder="Supabase anon key..."
                value={anonKey}
                onChange={e => setAnonKey(e.target.value)}
                onKeyDown={e => e.key === "Enter" && connectLive()}
                className="flex-1 bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2
                           text-zinc-200 text-sm placeholder-zinc-500
                           focus:outline-none focus:border-zinc-400"
              />
              <button
                onClick={connectLive}
                disabled={connecting}
                className="bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50
                           text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                {connecting ? "Connecting..." : "Connect Live"}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 mb-5 bg-emerald-900/20 border border-emerald-800
                          rounded-lg px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-emerald-300 text-sm">
              Live — Supabase jnmywpfdykuybrxkdcmc
            </span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-5 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-semibold transition-colors ${
                tab === t.id ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Pending */}
        {tab === "pending" && (
          <div>
            {pending.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-4xl mb-3">✓</p>
                <p className="text-zinc-500 font-semibold">All clear — no pending approvals.</p>
                <p className="text-zinc-600 text-sm mt-1">To the work.</p>
              </div>
            ) : (
              pending.map(item => (
                <ApprovalCard
                  key={item.id}
                  item={item}
                  onDecision={handleDecision}
                  loadingId={loadingId}
                />
              ))
            )}
          </div>
        )}

        {/* Decided */}
        {tab === "decided" && (
          <div>
            {decided.length === 0 ? (
              <div className="text-center py-16 text-zinc-600 text-sm">
                No decisions made this session.
              </div>
            ) : (
              decided.map(item => (
                <div key={item.id}
                     className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 mb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded mr-2 ${
                        item.status === "Approved"           ? "bg-emerald-700 text-white" :
                        item.status === "Rejected"           ? "bg-red-700 text-white"     :
                        "bg-yellow-700 text-white"
                      }`}>{item.status}</span>
                      <span className="text-zinc-200 text-sm font-medium">{item.deliverable_type}</span>
                      <span className="text-zinc-500 text-sm ml-2">— {item.entity}</span>
                    </div>
                    <span className="text-zinc-600 text-xs font-mono">{item.deliverable_ref}</span>
                  </div>
                  {item.decision_notes && (
                    <p className="text-zinc-400 text-sm mt-2 italic">"{item.decision_notes}"</p>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Activity */}
        {tab === "activity" && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4">
            <h3 className="text-zinc-300 font-semibold text-sm mb-4">
              Sovereign Execution Log — Recent Activity
            </h3>
            <ActivityFeed items={activity} />
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 pt-4 border-t border-zinc-800 text-center">
          <p className="text-zinc-700 text-xs">
            M2M~Inc. · Sovereign COO Agent · D.A.R.T. Protocol v1.1 · Human OS™ CGS v1.1
          </p>
          <p className="text-zinc-800 text-xs mt-1">To the work.</p>
        </div>

      </div>
    </div>
  );
}
