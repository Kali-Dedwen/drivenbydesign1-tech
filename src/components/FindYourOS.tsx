import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

/* ─────────────────────────────────────────────
   M2M~Inc. — model2message.net
   "Find Your OS" interactive triage section
   Three Lanes · One System · Navy / Gold
   Built to Design MD v1.0
───────────────────────────────────────────── */

type LaneKey = "pivot" | "bridge" | "human";

interface Lane {
  name: string;
  tagline: string;
  accent: string;
  path: string;
  cta: string;
}

const LANES: Record<LaneKey, Lane> = {
  pivot: {
    name: "PIVOT OS™",
    tagline: "Your reinvention starts here",
    accent: "#378ADD",
    path: "/pivot-os",
    cta: "Enter PIVOT OS™",
  },
  bridge: {
    name: "BRIDGE OS™",
    tagline: "Your workforce transformation starts here",
    accent: "#1D9E75",
    path: "/bridge-os",
    cta: "Enter BRIDGE OS™",
  },
  human: {
    name: "Human OS™",
    tagline: "Your enterprise deployment starts here",
    accent: "#F0C040",
    path: "/human-os",
    cta: "Enter Human OS™",
  },
};

const LANE_KEYWORDS: Record<LaneKey, string[]> = {
  pivot: [
    "individual", "personal", "career", "careers", "myself", "my own",
    "reinvent", "reinvention", "transition", "transitioning", "solo",
    "self", "me", "i", "veteran", "start over",
  ],
  bridge: [
    "team", "teams", "employer", "employers", "workforce", "staff",
    "employee", "employees", "company", "business", "smb", "department",
    "manager", "managers", "retention", "crew", "small business",
    "hire", "hiring",
  ],
  human: [
    "enterprise", "government", "governmental", "scale", "agency",
    "agencies", "organization", "organizational", "institution",
    "institutional", "federal", "corporate", "nationwide", "deploy",
    "deployment", "division", "divisions",
  ],
};

/** Tally keyword hits across all answers; return the single clear winner,
 *  or null on no signal / tie (which falls back to the Begin Triage CTA). */
function classify(text: string): LaneKey | null {
  const haystack = text.toLowerCase();
  if (haystack.trim().length < 3) return null;

  const tally: Record<LaneKey, number> = { pivot: 0, bridge: 0, human: 0 };
  (Object.keys(LANE_KEYWORDS) as LaneKey[]).forEach((lane) => {
    LANE_KEYWORDS[lane].forEach((kw) => {
      const re = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
      if (re.test(haystack)) tally[lane] += 1;
    });
  });

  const entries = (Object.keys(tally) as LaneKey[]).sort((a, b) => tally[b] - tally[a]);
  const [first, second] = entries;
  if (tally[first] === 0) return null;
  if (tally[first] === tally[second]) return null;
  return first;
}

const FIELDS = [
  { id: "fyos-build", num: "01", label: "What would you build even if no one paid you?" },
  { id: "fyos-call", num: "02", label: "What do people keep calling you for?" },
  { id: "fyos-anger", num: "03", label: "What problem makes you angry nobody's solving?" },
  { id: "fyos-market", num: "04", label: "Where does your expertise meet market demand?" },
];

const styles = `
  @keyframes fyos-draw { to { stroke-dashoffset: 0; } }
  @keyframes fyos-spin { to { transform: rotate(360deg); } }
  @keyframes fyos-breathe {
    0%, 100% { opacity: 0.55; }
    50%      { opacity: 0.9; }
  }
  @keyframes fyos-corePulse {
    0%, 100% { opacity: 0.7; transform: scale(1); }
    50%      { opacity: 1;   transform: scale(1.18); }
  }

  .fyos-ring {
    fill: none;
    stroke-width: 2.5;
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
    transform-box: fill-box;
    transform-origin: center;
    animation:
      fyos-draw 1.6s ease forwards,
      fyos-breathe 6s ease-in-out infinite 1.6s;
  }
  .fyos-ring-1 { animation-delay: 0s,   1.6s; }
  .fyos-ring-2 { animation-delay: 0.3s, 1.9s; }
  .fyos-ring-3 { animation-delay: 0.6s, 2.2s; }

  .fyos-orbit {
    fill: none;
    transform-box: fill-box;
    transform-origin: center;
    animation: fyos-spin 60s linear infinite;
  }
  .fyos-core {
    transform-box: fill-box;
    transform-origin: center;
    animation: fyos-corePulse 4s ease-in-out infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .fyos-ring,
    .fyos-orbit,
    .fyos-core {
      animation: none;
      stroke-dashoffset: 0;
      opacity: 0.8;
    }
  }
`;

export default function FindYourOS() {
  const [answers, setAnswers] = useState<string[]>(["", "", "", ""]);

  const matchKey = useMemo(() => classify(answers.join(" ")), [answers]);
  const match = matchKey ? LANES[matchKey] : null;

  function update(index: number, value: string) {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  return (
    <section
      id="find-your-os"
      aria-labelledby="fyos-headline"
      className="scroll-mt-[72px] py-24 px-[clamp(1.5rem,5vw,4rem)] relative overflow-hidden bg-[linear-gradient(180deg,#0A1628_0%,#0B1A30_55%,#060F1E_100%)]"
    >
      <style>{styles}</style>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_75%_40%,rgba(201,168,76,0.07),transparent)] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto relative px-8 lg:px-12">
        {/* Header */}
        <div className="mb-12 max-w-[620px]">
          <p className="flex items-center gap-3 font-mono text-[0.68rem] tracking-[0.18em] text-gold uppercase mb-4">
            <span className="block w-[3px] h-9 bg-gold rounded-sm" aria-hidden="true" />
            Find Your OS
          </p>
          <h2
            id="fyos-headline"
            className="font-display text-[clamp(2rem,3.5vw,3rem)] font-bold text-white leading-[1.15] tracking-tight"
          >
            Which platform was built for you?
          </h2>
          <p className="mt-4 text-[1.05rem] text-white-soft leading-[1.7]">
            Answer in your own words. As your signal sharpens, M2M routes you to
            the lane built for where you are — PIVOT, BRIDGE, or Human OS™.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-start">
          {/* ── LEFT: form + result ── */}
          <div>
            <div className="flex flex-col gap-5">
              {FIELDS.map((field, i) => (
                <div key={field.id}>
                  <label
                    htmlFor={field.id}
                    className="flex items-baseline gap-2.5 mb-2 text-[0.95rem] font-medium text-white-soft leading-snug"
                  >
                    <span className="font-mono text-[0.7rem] text-gold tracking-[0.1em] shrink-0">
                      {field.num}
                    </span>
                    {field.label}
                  </label>
                  <textarea
                    id={field.id}
                    rows={2}
                    value={answers[i]}
                    onChange={(e) => update(i, e.target.value)}
                    placeholder="Type your answer…"
                    className="w-full resize-none bg-navy/50 text-white placeholder:text-white-dim/60 text-[0.95rem] leading-relaxed rounded-[12px] border border-white/[0.1] px-4 py-3 transition-colors hover:border-gold/30 focus:outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/30"
                  />
                </div>
              ))}
            </div>

            {/* Result */}
            <div className="mt-8" aria-live="polite">
              {match ? (
                <div
                  className="relative overflow-hidden bg-[linear-gradient(145deg,#0D2045,#1A3560)] border border-gold/25 rounded-[16px] p-7 animate-[fade-in-up_0.5s_ease_forwards]"
                >
                  <div
                    className="absolute inset-x-0 top-0 h-1"
                    style={{ background: `linear-gradient(to right, transparent, ${match.accent}, transparent)` }}
                    aria-hidden="true"
                  />
                  <p className="font-mono text-[0.65rem] tracking-[0.18em] uppercase text-gold mb-2">
                    Your Signal Reads
                  </p>
                  <h3 className="font-display text-[1.6rem] font-bold leading-tight mb-1" style={{ color: match.accent }}>
                    {match.name}
                  </h3>
                  <p className="text-[1rem] text-white-soft mb-6">{match.tagline}.</p>
                  <div className="flex flex-wrap items-center gap-4">
                    <Link
                      to={match.path}
                      className="bg-gold text-navy text-[0.85rem] font-bold py-3 px-7 rounded-full tracking-[0.03em] no-underline hover:brightness-110 hover:scale-[1.02] transition-all"
                    >
                      {match.cta} →
                    </Link>
                    <Link
                      to="/triage"
                      className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-white-dim hover:text-gold transition-colors no-underline"
                    >
                      Run full triage →
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="bg-[linear-gradient(145deg,#0D2045,#1A3560)] border border-gold/15 rounded-[16px] p-7">
                  <p className="font-mono text-[0.65rem] tracking-[0.18em] uppercase text-gold mb-2">
                    Not Sure Yet?
                  </p>
                  <h3 className="font-display text-[1.5rem] font-bold text-white leading-tight mb-1">
                    Begin Triage
                  </h3>
                  <p className="text-[0.95rem] text-white-soft leading-relaxed mb-6 max-w-[440px]">
                    Three questions is all it takes. We'll route you to the
                    operating system built for where you are right now.
                  </p>
                  <Link
                    to="/triage"
                    className="inline-block bg-gold text-navy text-[0.85rem] font-bold py-3 px-7 rounded-full tracking-[0.03em] no-underline hover:brightness-110 hover:scale-[1.02] transition-all"
                  >
                    Begin Triage →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: three interlocking rings ── */}
          <div className="flex flex-col items-center justify-center">
            <svg
              viewBox="0 0 320 320"
              className="w-full max-w-[360px] h-auto"
              role="img"
              aria-label="Three interlocking rings representing M2M's three platform lanes — PIVOT OS, BRIDGE OS, and Human OS — forming one system."
            >
              {/* decorative rotating orbit */}
              <circle
                className="fyos-orbit"
                cx="160" cy="160" r="150"
                stroke="#C9A84C" strokeOpacity="0.28"
                strokeWidth="1" strokeDasharray="2 9"
              />

              {/* three interlocking lane rings */}
              <circle
                className="fyos-ring fyos-ring-1"
                cx="160" cy="114" r="74"
                pathLength={100}
                stroke="#F0C040"
                style={{ filter: "drop-shadow(0 0 6px rgba(240,192,64,0.35))" }}
              />
              <circle
                className="fyos-ring fyos-ring-2"
                cx="120" cy="188" r="74"
                pathLength={100}
                stroke="#378ADD"
                style={{ filter: "drop-shadow(0 0 6px rgba(55,138,221,0.35))" }}
              />
              <circle
                className="fyos-ring fyos-ring-3"
                cx="200" cy="188" r="74"
                pathLength={100}
                stroke="#1D9E75"
                style={{ filter: "drop-shadow(0 0 6px rgba(29,158,117,0.35))" }}
              />

              {/* gold core node */}
              <circle className="fyos-core" cx="160" cy="164" r="6" fill="#C9A84C" />
              <circle cx="160" cy="164" r="13" fill="none" stroke="#C9A84C" strokeOpacity="0.4" strokeWidth="1" />
            </svg>

            {/* legend */}
            <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2">
              {[
                { name: "Human OS™", color: "#F0C040" },
                { name: "PIVOT OS™", color: "#378ADD" },
                { name: "BRIDGE OS™", color: "#1D9E75" },
              ].map((lane) => (
                <span key={lane.name} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: lane.color }} aria-hidden="true" />
                  <span className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-white-soft">
                    {lane.name}
                  </span>
                </span>
              ))}
            </div>
            <p className="mt-4 font-mono text-[0.62rem] tracking-[0.22em] uppercase text-gold-muted">
              Three Lanes · One System
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
