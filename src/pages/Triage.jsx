
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* ─────────────────────────────────────────────────────────────────────────────
   M2M~Inc. — Triage.jsx v2.0 — Autonomous Loop Integration
   Route: /triage
   Flow:  3 questions → contact info → POST to m2m-loop-webhook →
          Claude OS classification → real-time result + Supabase write
   Fallback: local scoring if webhook times out (≥8s)
   Brand: Navy #0A1628 / Gold #C9A84C
───────────────────────────────────────────────────────────────────────────── */

const WEBHOOK_URL =
  "https://jnmywpfdykuybrxkdcmc.supabase.co/functions/v1/m2m-loop-webhook?source=triage";

const QUESTIONS = [
  {
    key: "audience",
    label: "Question 01",
    prompt: "Who is this decision for?",
    helper:
      "Tell us who the work is built around — the answer changes the operating system.",
    options: [
      {
        os: "pivot",
        label: "Me",
        body: "My own career, transition, or reinvention.",
      },
      {
        os: "bridge",
        label: "My team",
        body: "I lead or own an SMB, department, or workforce in motion.",
      },
      {
        os: "human",
        label: "My organization",
        body: "I represent an enterprise or government agency.",
      },
    ],
  },
  {
    key: "scale",
    label: "Question 02",
    prompt: "What's the scale of the change?",
    helper:
      "Scope sets the architecture. One person, one team, one org — different systems.",
    options: [
      {
        os: "pivot",
        label: "One person",
        body: "A single career navigating reinvention.",
      },
      {
        os: "bridge",
        label: "10 – 500 people",
        body: "A workforce or team moving through transition together.",
      },
      {
        os: "human",
        label: "500+ across the org",
        body: "Departments, divisions, or jurisdictions at enterprise scale.",
      },
    ],
  },
  {
    key: "outcome",
    label: "Question 03",
    prompt: "What outcome are you after?",
    helper:
      "The outcome determines which M2M system carries the load.",
    options: [
      {
        os: "pivot",
        label: "A structured pivot I can execute",
        body: "Diagnostic, blueprint, activation — for the individual reinventing.",
      },
      {
        os: "bridge",
        label: "Manager readiness and retention through change",
        body: "Workforce transition planning for the leaders holding the line.",
      },
      {
        os: "human",
        label: "Workforce intelligence at scale",
        body: "Behavioral architecture and enterprise human-systems strategy.",
      },
    ],
  },
];

const RESULTS = {
  pivot: {
    name: "PIVOT OS™",
    tagline: "Individual Reinvention",
    accent: "#378ADD",
    path: "/pivot-os",
    cta: "Enter PIVOT OS™",
    body: "Your signal reads individual. PIVOT OS™ is the structured reinvention system for veterans, transitioning professionals, and high-performers ready to leave their current lane on purpose.",
    next: "Start with the Reactivity Profile Assessment — the diagnostic that opens every pivot.",
  },
  bridge: {
    name: "BRIDGE OS™",
    tagline: "Employer & SMB Workforce Transition",
    accent: "#1D9E75",
    path: "/bridge-os",
    cta: "Enter BRIDGE OS™",
    body: "Your signal reads team. BRIDGE OS™ is the workforce-transition operating system for SMBs and employers — manager readiness, retention architecture, and human-led change built to deploy now.",
    next: "Move to the BRIDGE OS™ intake to map your team's transition surface.",
  },
  human: {
    name: "Human OS™",
    tagline: "Enterprise & Government Workforce Intelligence",
    accent: "#F0C040",
    path: "/human-os",
    cta: "Enter Human OS™",
    body: "Your signal reads enterprise. Human OS™ is M2M's organizational intelligence layer — workforce audits, executive behavioral architecture, and SDVOSB-certified delivery for agencies and large organizations.",
    next: "Engage Human OS™ for enterprise scoping and strategic deployment.",
  },
};

// ─── Local fallback scoring ───────────────────────────────────────────────────
function decideLocally(answers) {
  const tally = { pivot: 0, bridge: 0, human: 0 };
  for (const os of answers) {
    if (os && tally[os] !== undefined) tally[os] += 1;
  }
  const max = Math.max(tally.pivot, tally.bridge, tally.human);
  const winners = Object.keys(tally).filter((k) => tally[k] === max);
  if (winners.length === 1) return { os: winners[0], mixed: false };
  return { os: answers[0] || "pivot", mixed: true };
}

// ─── OS label normalizer (Claude returns varied formats) ──────────────────────
function normalizeOsLane(lane) {
  if (!lane) return null;
  const l = lane.toLowerCase();
  if (l.includes("pivot")) return "pivot";
  if (l.includes("bridge")) return "bridge";
  if (l.includes("human")) return "human";
  return null;
}

// ─── Spinner component ────────────────────────────────────────────────────────
function Spinner({ accent }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", padding: "3rem 0" }}>
      <div style={{
        width: 48, height: 48, borderRadius: "50%",
        border: `3px solid rgba(255,255,255,0.08)`,
        borderTopColor: accent || "#C9A84C",
        animation: "m2m-spin 0.8s linear infinite",
      }} />
      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
        Routing through OS classification loop
      </p>
    </div>
  );
}

// ─── Contact form step ────────────────────────────────────────────────────────
function ContactStep({ onSubmit, loading }) {
  const [form, setForm] = useState({ name: "", email: "", company: "" });
  const [err, setErr] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setErr("Name and email are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErr("Please enter a valid email address.");
      return;
    }
    setErr("");
    onSubmit(form);
  }

  const inputStyle = {
    width: "100%", background: "rgba(10,22,40,0.6)",
    border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 10,
    padding: "0.875rem 1.125rem", color: "#fff",
    fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem",
    outline: "none", transition: "border-color 0.2s",
  };

  return (
    <section style={{
      background: "linear-gradient(145deg, #0D2045, #1A3560)",
      border: "1px solid rgba(201,168,76,0.2)",
      borderRadius: 18, padding: "2.5rem",
      animation: "fadeInUp 0.45s ease forwards",
    }}>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)",
        padding: "0.3rem 0.9rem", borderRadius: 999,
        fontFamily: "'DM Mono', monospace", fontSize: "0.65rem",
        letterSpacing: "0.12em", color: "#C9A84C", textTransform: "uppercase",
        marginBottom: "1.5rem",
      }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C9A84C" }} />
        One more thing
      </div>

      <h2 style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: "clamp(1.6rem, 3vw, 2.25rem)", fontWeight: 800,
        color: "#fff", lineHeight: 1.1, marginBottom: "0.75rem",
      }}>
        Where should we send your match?
      </h2>
      <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: "2rem", maxWidth: 520 }}>
        Your OS classification is being run through the M2M autonomous router.
        We'll route you instantly and send a branded summary to your inbox.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>
              Full Name *
            </label>
            <input
              type="text" placeholder="Your name"
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "rgba(201,168,76,0.5)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>
          <div>
            <label style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>
              Email Address *
            </label>
            <input
              type="email" placeholder="you@domain.com"
              value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = "rgba(201,168,76,0.5)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>
        </div>
        <div>
          <label style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>
            Company / Organization (optional)
          </label>
          <input
            type="text" placeholder="Organization name"
            value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "rgba(201,168,76,0.5)"}
            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
          />
        </div>

        {err && (
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#ef4444", letterSpacing: "0.05em" }}>
            {err}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            background: loading ? "rgba(201,168,76,0.4)" : "#C9A84C",
            color: "#0A1628", fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.9rem", fontWeight: 700,
            padding: "0.95rem 2.5rem", borderRadius: 999,
            border: "none", cursor: loading ? "not-allowed" : "pointer",
            letterSpacing: "0.03em", transition: "filter 0.2s, transform 0.2s",
            alignSelf: "flex-start", marginTop: "0.5rem",
          }}
        >
          {loading ? "Routing..." : "Find My OS →"}
        </button>
      </form>
    </section>
  );
}

// ─── Result card ──────────────────────────────────────────────────────────────
function ResultCard({ match, result, rationale, source, onReset }) {
  const navigate = useNavigate();
  return (
    <section style={{
      background: "linear-gradient(145deg, #0D2045, #1A3560)",
      border: "1px solid rgba(201,168,76,0.25)",
      borderRadius: 18, padding: "2.5rem",
      position: "relative", overflow: "hidden",
      animation: "fadeInUp 0.5s ease forwards",
    }}>
      {/* Accent top line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(to right, transparent, ${match.accent}, transparent)`,
      }} />

      {/* Source badge */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: source === "claude" ? "rgba(124,58,237,0.12)" : "rgba(201,168,76,0.1)",
        border: `1px solid ${source === "claude" ? "rgba(124,58,237,0.3)" : "rgba(201,168,76,0.25)"}`,
        padding: "0.3rem 0.9rem", borderRadius: 999,
        fontFamily: "'DM Mono', monospace", fontSize: "0.62rem",
        letterSpacing: "0.12em", textTransform: "uppercase",
        color: source === "claude" ? "#9f7aea" : "#C9A84C",
        marginBottom: "1.5rem",
      }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: source === "claude" ? "#9f7aea" : "#C9A84C" }} />
        {source === "claude" ? "Claude AI · Autonomous Classification" : "System Match"}
      </div>

      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.18em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "0.75rem" }}>
        Your Match
      </p>
      <h2 style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontSize: "clamp(1.75rem,3vw,3rem)", fontWeight: 900,
        lineHeight: 1.1, marginBottom: "0.5rem", letterSpacing: "-0.01em",
      }}>
        <span style={{ color: match.accent }}>{match.name}</span>
      </h2>
      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "1.75rem" }}>
        {match.tagline}
      </p>

      <p style={{ fontSize: "1.05rem", color: "rgba(232,237,245,0.85)", lineHeight: 1.7, marginBottom: "1.25rem", maxWidth: 640 }}>
        {match.body}
      </p>

      {/* Claude rationale block */}
      {rationale && source === "claude" && (
        <div style={{
          background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.2)",
          borderRadius: 12, padding: "1rem 1.25rem", marginBottom: "1.5rem", maxWidth: 640,
        }}>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9f7aea", marginBottom: "0.5rem" }}>
            AI Rationale
          </p>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.65 }}>
            {rationale}
          </p>
        </div>
      )}

      {result?.mixed && (
        <div style={{
          background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.25)",
          borderRadius: 10, padding: "1rem 1.25rem", marginBottom: "1.5rem", maxWidth: 640,
        }}>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "0.5rem" }}>
            Mixed Signal
          </p>
          <p style={{ fontSize: "0.875rem", color: "rgba(232,237,245,0.6)", lineHeight: 1.6 }}>
            Your answers split across systems. We routed you to {match.name} based on the primary signal,
            but the other two systems likely belong in the conversation. Explore all three below.
          </p>
        </div>
      )}

      <p style={{ fontSize: "0.95rem", color: "rgba(232,237,245,0.55)", lineHeight: 1.7, marginBottom: "2rem", maxWidth: 640, fontStyle: "italic" }}>
        {match.next}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center", marginBottom: "2.5rem" }}>
        <button
          onClick={() => navigate(match.path)}
          style={{
            background: "#C9A84C", color: "#0A1628",
            fontSize: "0.875rem", fontWeight: 700,
            padding: "0.875rem 2rem", borderRadius: 999,
            border: "none", cursor: "pointer", letterSpacing: "0.03em",
            transition: "filter 0.2s, transform 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.1)"; e.currentTarget.style.transform = "scale(1.02)"; }}
          onMouseLeave={e => { e.currentTarget.style.filter = ""; e.currentTarget.style.transform = ""; }}
        >
          {match.cta} →
        </button>
        <button
          onClick={onReset}
          style={{
            background: "transparent", color: "#C9A84C",
            fontSize: "0.875rem", fontWeight: 600,
            padding: "0.875rem 2rem", borderRadius: 999,
            border: "1.5px solid rgba(201,168,76,0.5)", cursor: "pointer",
            letterSpacing: "0.03em", transition: "background 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(201,168,76,0.1)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          Start Over
        </button>
      </div>

      {/* Cross-lane links */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "2rem" }}>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "1rem" }}>
          Explore All Three
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: "0.75rem" }}>
          {Object.entries(RESULTS).map(([key, r]) => (
            <Link
              key={key}
              to={r.path}
              style={{
                background: "rgba(10,22,40,0.45)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 10, padding: "1rem", textDecoration: "none",
                transition: "border-color 0.2s, background 0.2s",
                display: "block",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.background = "rgba(10,22,40,0.7)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(10,22,40,0.45)"; }}
            >
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: r.accent, marginBottom: "0.35rem" }}>
                {r.tagline}
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1rem", fontWeight: 700, color: "#fff" }}>
                {r.name} →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function Triage() {
  const [step, setStep] = useState(0);       // 0-2: questions, 3: contact, 4: result
  const [answers, setAnswers] = useState([null, null, null]);
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);  // { os, mixed, rationale, source }

  const isDone = step >= QUESTIONS.length;
  const showContact = isDone && !result;
  const showResult = !!result;

  const currentResult = result ? RESULTS[result.os] : null;

  function choose(os) {
    const next = [...answers];
    next[step] = os;
    setAnswers(next);
    setStep(step + 1);
  }

  async function handleContactSubmit(formData) {
    setContact(formData);
    setLoading(true);

    const payload = {
      name: formData.name,
      email: formData.email,
      company: formData.company || "",
      triage_q1_audience: answers[0],
      triage_q2_scale: answers[1],
      triage_q3_outcome: answers[2],
      source: "triage_form",
      site: "model2message.net",
    };

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 9000);

      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        // Try to extract Claude's classification from the webhook response
        const osLaneRaw =
          data?.gate_checkpoint_1?.verdict ||
          data?.os_lane ||
          data?.os_classification ||
          null;
        const os = normalizeOsLane(osLaneRaw);
        const rationale = data?.os_rationale || data?.rationale || null;

        if (os) {
          setResult({ os, mixed: false, rationale, source: "claude" });
        } else {
          // Webhook responded but no lane extracted — fall back to local
          const local = decideLocally(answers);
          setResult({ ...local, rationale: null, source: "local" });
        }
      } else {
        // Non-200 — fall back to local scoring
        const local = decideLocally(answers);
        setResult({ ...local, rationale: null, source: "local" });
      }
    } catch {
      // Timeout or network error — fall back gracefully
      const local = decideLocally(answers);
      setResult({ ...local, rationale: null, source: "local" });
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStep(0);
    setAnswers([null, null, null]);
    setContact(null);
    setResult(null);
    setLoading(false);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700;800;900&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes m2m-spin {
          to { transform: rotate(360deg); }
        }

        .triage-option-btn:hover {
          background: rgba(201,168,76,0.08) !important;
          border-color: rgba(201,168,76,0.4) !important;
          transform: translateY(-2px);
        }
        .triage-option-btn:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(201,168,76,0.4);
        }
      `}</style>

      <Navbar />

      <main style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0A1628 0%, #0B1E3A 60%, #0A1628 100%)",
        paddingTop: "clamp(100px, 12vh, 140px)",
        paddingBottom: "5rem",
        paddingLeft: "clamp(1.5rem, 5vw, 4rem)",
        paddingRight: "clamp(1.5rem, 5vw, 4rem)",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'DM Sans', system-ui, sans-serif",
        color: "#fff",
      }}>
        {/* Background radial glow */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 55% 60% at 30% 30%, rgba(201,168,76,0.07), transparent)",
        }} />

        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>

          {/* ── Header ── */}
          <div style={{ marginBottom: "3rem" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)",
              padding: "0.35rem 1rem", borderRadius: 999,
              fontFamily: "'DM Mono', monospace", fontSize: "0.65rem",
              letterSpacing: "0.12em", color: "#C9A84C", textTransform: "uppercase",
              marginBottom: "1.5rem",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C9A84C" }} />
              M2M Triage · Three Questions
            </div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(2.25rem, 5vw, 4rem)", fontWeight: 900,
              lineHeight: 1.05, letterSpacing: "-0.02em",
              color: "#fff", marginBottom: "1.25rem",
            }}>
              Find Your <span style={{ color: "#C9A84C" }}>Operating System</span>.
            </h1>
            <p style={{ fontSize: "1.05rem", color: "rgba(232,237,245,0.7)", lineHeight: 1.7, maxWidth: 600 }}>
              M2M~Inc. runs three sovereign systems — PIVOT OS™ for individual reinvention,
              BRIDGE OS™ for workforce transition, and Human OS™ for enterprise intelligence.
              Answer three questions and we'll route you to the right one.
            </p>
          </div>

          {/* ── Progress dots ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2.5rem" }}>
            {QUESTIONS.map((_, i) => {
              const state = i < step ? "done" : i === step ? "active" : "idle";
              return (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{
                    display: "block",
                    width: state === "active" ? 12 : 10,
                    height: state === "active" ? 12 : 10,
                    borderRadius: "50%",
                    background: state === "idle" ? "rgba(255,255,255,0.15)" : "#C9A84C",
                    boxShadow: state === "active" ? "0 0 0 4px rgba(201,168,76,0.2)" : "none",
                    transition: "all 0.2s",
                  }} />
                  {i < QUESTIONS.length - 1 && (
                    <span style={{ display: "block", width: 36, height: 1, background: i < step ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.1)" }} />
                  )}
                </span>
              );
            })}
            <span style={{ marginLeft: "0.5rem", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
              {showResult ? "Match found" : showContact ? "Almost done" : `${step + 1} of ${QUESTIONS.length}`}
            </span>
          </div>

          {/* ── Question card ── */}
          {!isDone && (
            <section
              key={step}
              style={{
                background: "linear-gradient(145deg, #0D2045, #1A3560)",
                border: "1px solid rgba(201,168,76,0.15)",
                borderRadius: 18, padding: "2.5rem",
                animation: "fadeInUp 0.45s ease forwards",
              }}
            >
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.18em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                {QUESTIONS[step].label}
              </p>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(1.5rem, 2.8vw, 2.35rem)", fontWeight: 800,
                color: "#fff", lineHeight: 1.2, marginBottom: "0.75rem",
              }}>
                {QUESTIONS[step].prompt}
              </h2>
              <p style={{ fontSize: "0.95rem", color: "rgba(232,237,245,0.6)", lineHeight: 1.7, marginBottom: "2rem", maxWidth: 580 }}>
                {QUESTIONS[step].helper}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {QUESTIONS[step].options.map((opt) => (
                  <button
                    key={opt.label}
                    className="triage-option-btn"
                    onClick={() => choose(opt.os)}
                    style={{
                      textAlign: "left",
                      background: "rgba(10,22,40,0.45)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 12, padding: "1.25rem 1.5rem",
                      cursor: "pointer", transition: "all 0.2s",
                      color: "#fff",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                      <span style={{ color: "#C9A84C", fontSize: "1.1rem", marginTop: 2, flexShrink: 0 }}>◆</span>
                      <div>
                        <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.15rem", fontWeight: 700, color: "#fff", marginBottom: "0.25rem" }}>
                          {opt.label}
                        </div>
                        <div style={{ fontSize: "0.875rem", color: "rgba(232,237,245,0.55)", lineHeight: 1.55 }}>
                          {opt.body}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {step > 0 && (
                <button
                  onClick={() => setStep(step - 1)}
                  style={{
                    marginTop: "1.5rem", background: "none", border: "none", cursor: "pointer",
                    fontFamily: "'DM Mono', monospace", fontSize: "0.7rem",
                    letterSpacing: "0.15em", textTransform: "uppercase",
                    color: "rgba(255,255,255,0.35)", transition: "color 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = "#C9A84C"}
                  onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}
                >
                  ← Back
                </button>
              )}
            </section>
          )}

          {/* ── Contact step ── */}
          {showContact && !loading && (
            <ContactStep onSubmit={handleContactSubmit} loading={loading} />
          )}

          {/* ── Loading spinner ── */}
          {loading && <Spinner accent="#C9A84C" />}

          {/* ── Result card ── */}
          {showResult && currentResult && (
            <ResultCard
              match={currentResult}
              result={result}
              rationale={result.rationale}
              source={result.source}
              onReset={reset}
            />
          )}

          {/* ── Footer note ── */}
          <p style={{ marginTop: "3rem", textAlign: "center", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>
            M2M~Inc. · SDVOSB · VBE · model2message.net
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
