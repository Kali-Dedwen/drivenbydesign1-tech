import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* ─────────────────────────────────────────────
   M2M~Inc. — Triage Platform
   3-question diagnostic routing visitors to
   PIVOT OS™ / BRIDGE OS™ / Human OS™
   Navy + Gold brand chrome. No pricing.
───────────────────────────────────────────── */

const QUESTIONS = [
  {
    key: "audience",
    label: "Question 01",
    prompt: "Who is this decision for?",
    helper: "Tell us who the work is built around — the answer changes the operating system.",
    options: [
      { os: "pivot", label: "Me", body: "My own career, transition, or reinvention." },
      { os: "bridge", label: "My team", body: "I lead or own an SMB, department, or workforce in motion." },
      { os: "human", label: "My organization", body: "I represent an enterprise or government agency." },
    ],
  },
  {
    key: "scale",
    label: "Question 02",
    prompt: "What's the scale of the change?",
    helper: "Scope sets the architecture. One person, one team, one org — different systems.",
    options: [
      { os: "pivot", label: "One person", body: "A single career navigating reinvention." },
      { os: "bridge", label: "10 – 500 people", body: "A workforce or team moving through transition together." },
      { os: "human", label: "500+ across the org", body: "Departments, divisions, or jurisdictions at enterprise scale." },
    ],
  },
  {
    key: "outcome",
    label: "Question 03",
    prompt: "What outcome are you after?",
    helper: "The outcome determines which M2M system carries the load.",
    options: [
      { os: "pivot", label: "A structured pivot I can execute", body: "Diagnostic, blueprint, activation — for the individual reinventing." },
      { os: "bridge", label: "Manager readiness and retention through change", body: "Workforce transition planning for the leaders holding the line." },
      { os: "human", label: "Workforce intelligence at scale", body: "Behavioral architecture and enterprise human-systems strategy." },
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

function decide(answers) {
  const tally = { pivot: 0, bridge: 0, human: 0 };
  for (const os of answers) {
    if (os && tally[os] !== undefined) tally[os] += 1;
  }
  const max = Math.max(tally.pivot, tally.bridge, tally.human);
  const winners = Object.keys(tally).filter((k) => tally[k] === max);
  if (winners.length === 1) return { os: winners[0], mixed: false };
  return { os: answers[0] || "pivot", mixed: true };
}

export default function Triage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([null, null, null]);

  const isDone = step >= QUESTIONS.length;
  const result = isDone ? decide(answers) : null;
  const match = result ? RESULTS[result.os] : null;

  function choose(os) {
    const next = [...answers];
    next[step] = os;
    setAnswers(next);
    setStep(step + 1);
  }

  function reset() {
    setStep(0);
    setAnswers([null, null, null]);
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[linear-gradient(135deg,#0A1628_0%,#0B1E3A_60%,#0A1628_100%)] pt-[120px] pb-24 px-[clamp(1.5rem,5vw,4rem)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_30%_30%,rgba(201,168,76,0.08),transparent)] pointer-events-none" />

        <div className="max-w-[920px] mx-auto relative">

          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/25 px-3.5 py-1.5 rounded-full font-mono text-[0.65rem] tracking-[0.12em] text-gold uppercase mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              M2M Triage · Three Questions
            </div>
            <h1 className="font-display text-[clamp(2.25rem,4vw,3.75rem)] font-black leading-[1.05] tracking-tight text-white mb-5">
              Find Your <span className="text-gold">Operating System</span>.
            </h1>
            <p className="text-[1.05rem] text-white-soft leading-[1.7] max-w-[640px]">
              M2M~Inc. runs three sovereign systems — PIVOT OS™ for individual reinvention,
              BRIDGE OS™ for workforce transition, and Human OS™ for enterprise intelligence.
              Answer three questions and we'll route you to the right one.
            </p>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-3 mb-10">
            {QUESTIONS.map((_, i) => {
              const state = i < step ? "done" : i === step ? "active" : "idle";
              return (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className={
                      state === "done"
                        ? "w-2.5 h-2.5 rounded-full bg-gold"
                        : state === "active"
                        ? "w-2.5 h-2.5 rounded-full bg-gold ring-4 ring-gold/20"
                        : "w-2.5 h-2.5 rounded-full bg-white/15"
                    }
                  />
                  {i < QUESTIONS.length - 1 && (
                    <div className={i < step ? "w-10 h-px bg-gold/50" : "w-10 h-px bg-white/10"} />
                  )}
                </div>
              );
            })}
            <span className="ml-2 font-mono text-[0.7rem] tracking-[0.15em] uppercase text-white-dim">
              {isDone ? "Result" : `${step + 1} of ${QUESTIONS.length}`}
            </span>
          </div>

          {/* Question card */}
          {!isDone && (
            <section
              key={step}
              className="bg-[linear-gradient(145deg,#0D2045,#1A3560)] border border-gold/15 rounded-[18px] p-8 sm:p-10 animate-[fade-in-up_0.5s_ease_forwards]"
            >
              <p className="font-mono text-[0.68rem] tracking-[0.18em] text-gold uppercase mb-3">
                {QUESTIONS[step].label}
              </p>
              <h2 className="font-display text-[clamp(1.5rem,2.5vw,2.25rem)] font-bold text-white leading-[1.2] mb-3 tracking-tight">
                {QUESTIONS[step].prompt}
              </h2>
              <p className="text-[0.95rem] text-white-soft leading-relaxed mb-8 max-w-[640px]">
                {QUESTIONS[step].helper}
              </p>

              <div className="flex flex-col gap-3">
                {QUESTIONS[step].options.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => choose(opt.os)}
                    className="group text-left bg-navy/40 hover:bg-gold/[0.08] border border-white/[0.08] hover:border-gold/40 rounded-[12px] p-5 transition-all duration-200 hover:-translate-y-px focus:outline-none focus:ring-2 focus:ring-gold/40"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-gold text-[1.1rem] mt-0.5 shrink-0 transition-transform group-hover:translate-x-0.5">◆</span>
                      <div>
                        <div className="font-display text-[1.15rem] font-bold text-white mb-1">{opt.label}</div>
                        <div className="text-[0.875rem] text-white-soft leading-snug">{opt.body}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {step > 0 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="mt-8 font-mono text-[0.7rem] tracking-[0.15em] uppercase text-white-dim hover:text-gold transition-colors"
                >
                  ← Back
                </button>
              )}
            </section>
          )}

          {/* Result card */}
          {isDone && match && (
            <section className="bg-[linear-gradient(145deg,#0D2045,#1A3560)] border border-gold/25 rounded-[18px] p-8 sm:p-10 animate-[fade-in-up_0.5s_ease_forwards] relative overflow-hidden">
              <div
                className="absolute inset-x-0 top-0 h-1"
                style={{ background: `linear-gradient(to right, transparent, ${match.accent}, transparent)` }}
              />
              <p className="font-mono text-[0.68rem] tracking-[0.18em] text-gold uppercase mb-3">
                Your Match
              </p>
              <h2 className="font-display text-[clamp(1.75rem,3vw,3rem)] font-black text-white leading-[1.1] mb-2 tracking-tight">
                <span style={{ color: match.accent }}>{match.name}</span>
              </h2>
              <p className="font-mono text-[0.75rem] tracking-[0.12em] uppercase text-white-dim mb-6">
                {match.tagline}
              </p>

              <p className="text-[1.05rem] text-white-soft leading-[1.7] mb-5 max-w-[640px]">
                {match.body}
              </p>

              {result.mixed && (
                <div className="bg-gold/[0.08] border border-gold/25 rounded-[10px] p-4 mb-6 max-w-[640px]">
                  <p className="font-mono text-[0.68rem] tracking-[0.15em] uppercase text-gold mb-2">
                    Mixed Signal
                  </p>
                  <p className="text-[0.875rem] text-white-soft leading-snug">
                    Your answers split across systems. We routed you to {match.name} based on the audience question,
                    but the other two systems likely belong in the conversation. Explore all three below.
                  </p>
                </div>
              )}

              <p className="text-[0.95rem] text-white-soft leading-relaxed mb-8 max-w-[640px] italic">
                {match.next}
              </p>

              <div className="flex flex-wrap gap-4 items-center">
                <button
                  onClick={() => navigate(match.path)}
                  className="bg-gold text-navy text-[0.875rem] font-bold py-3.5 px-8 rounded-full border-none cursor-pointer tracking-[0.03em] hover:brightness-110 hover:scale-[1.02] transition-all"
                >
                  {match.cta} →
                </button>
                <button
                  onClick={reset}
                  className="bg-transparent text-gold text-[0.875rem] font-semibold py-3.5 px-8 rounded-full border-[1.5px] border-gold/50 cursor-pointer tracking-[0.03em] hover:bg-gold/10 transition-colors"
                >
                  Start Over
                </button>
              </div>

              {/* Cross-links */}
              <div className="mt-10 pt-8 border-t border-white/[0.08]">
                <p className="font-mono text-[0.68rem] tracking-[0.15em] uppercase text-white-dim mb-4">
                  Explore All Three
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {Object.entries(RESULTS).map(([key, r]) => (
                    <Link
                      key={key}
                      to={r.path}
                      className="bg-navy/40 hover:bg-navy/70 border border-white/[0.08] hover:border-white/20 rounded-[10px] p-4 transition-all no-underline"
                    >
                      <div
                        className="font-mono text-[0.65rem] tracking-[0.15em] uppercase mb-1"
                        style={{ color: r.accent }}
                      >
                        {r.tagline}
                      </div>
                      <div className="font-display text-[1rem] font-bold text-white">{r.name} →</div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Footer note */}
          <p className="mt-10 text-center font-mono text-[0.7rem] tracking-[0.12em] uppercase text-white-dim">
            M2M~Inc. · SDVOSB · VBE · model2message.net
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
