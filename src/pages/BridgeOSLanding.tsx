import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* ─────────────────────────────────────────────
   M2M~Inc. — BRIDGE OS™ Landing Page
   Employer / SMB Workforce Transition
   Converted to React/TypeScript + Tailwind v4
───────────────────────────────────────────── */

const SERVICES = [
  {
    icon: "⬡",
    title: "Workforce Transition Planning",
    body: "Structured transition architecture for organizations managing downsizing, restructuring, reskilling, or post-merger workforce shifts. Built to protect retention and organizational culture simultaneously.",
  },
  {
    icon: "◈",
    title: "Manager Readiness Training",
    body: "BRIDGE OS™ equips frontline managers with the behavioral intelligence to lead teams through change without losing performance. The human side of workforce transformation, systematized.",
  },
  {
    icon: "✦",
    title: "Veteran Talent Integration",
    body: "Specialized onboarding infrastructure for employers hiring veterans. Translates military capability into civilian productivity from day one — reducing turnover, accelerating contribution.",
  },
  {
    icon: "◎",
    title: "SMB Workforce Intelligence",
    body: "For small and mid-sized businesses navigating AI disruption, market shifts, or rapid growth. Human OS™ Lite — the right-sized version of enterprise workforce strategy.",
  },
  {
    icon: "⬟",
    title: "Community Reintegration",
    body: "Workforce re-entry programs for municipalities and nonprofit partners working with returning citizens, justice-involved youth, and displaced workers. Proven with OJJDP-funded models.",
  },
  {
    icon: "◆",
    title: "BRIDGE OS™ Licensing",
    body: "License the BRIDGE OS™ platform for internal HR, L&D, or workforce development departments. Practitioner certification available at three tiers. Deploy M2M methodology at scale.",
  },
];

const PROBLEMS = [
  "Turnover spikes when workforce change isn't communicated with clarity",
  "Managers are promoted for performance but never trained for transition leadership",
  "Veterans are hired and then lost — because nobody built the bridge",
  "Reskilling programs fail because they address skills but not behavior",
  "HR teams manage the paperwork of transition but not the human cost",
];

const SOLUTIONS = [
  "BRIDGE OS™ installs a behavioral communication framework before change hits",
  "Manager Readiness Training converts high-performers into transition-ready leaders",
  "Veteran Integration Protocols reduce 90-day turnover by design, not accident",
  "M2M Composure Architecture™ addresses the behavioral layer reskilling misses",
  "Human OS™ gives HR teams a systematic model for measuring human-side ROI",
];

const CASES = [
  {
    name: "Project CHECK",
    title: "Youth Reintegration",
    body: "OJJDP Second Chance Act model in Forsyth County, NC. Workforce-ready transition infrastructure for justice-involved youth, ages 14–24.",
  },
  {
    name: "CRIB Network",
    title: "Cumberland County",
    body: "Community workforce re-entry platform for displaced workers and returning citizens. HubSpot-tracked $325K pipeline in active development.",
  },
  {
    name: "FUSE Network",
    title: "Robeson County",
    body: "Lumbee Tribe G2G Partnership model — workforce and economic sovereignty for underserved rural communities. Full asset library deployed.",
  },
];

const METRICS = [
  { num: "70%", desc: "of organizational change initiatives fail to meet objectives" },
  { num: "$1.5T", desc: "lost annually to disengaged employees in the U.S. alone" },
  { num: "2×", desc: "veteran turnover rate vs. non-veteran hires in first year" },
  { num: "60%", desc: "of reskilling programs fail to change on-the-job behavior" },
];

const openCalendly = () => {
  (window as any).Calendly.initPopupWidget({
    url: 'https://calendly.com/kevin-m2m'
  });
  return false;
};

export default function BridgeOSLanding() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      {/* ── HERO ── */}
      <section className="min-h-screen flex items-center pt-[120px] pb-20 px-[clamp(1.5rem,5vw,4rem)] bg-[linear-gradient(135deg,#0A1628_0%,#0C1F35_60%,#0A1628_100%)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_75%_40%,rgba(72,187,120,0.07),transparent)] pointer-events-none" />
        <div className="max-w-[1280px] mx-auto w-full grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-20 items-center relative">
          {/* Left column */}
          <div>
            <div className="inline-flex items-center gap-2 bg-bridge-light border border-bridge-border px-3.5 py-1.5 rounded-full font-mono text-[0.65rem] tracking-[0.12em] text-bridge uppercase mb-5 animate-[fade-in-up_0.6s_0.1s_ease_forwards] opacity-0">
              <span className="w-1.5 h-1.5 rounded-full bg-bridge" />
              BRIDGE OS™ · Employer / SMB Workforce
            </div>
            <h1 className="font-display text-[clamp(2.75rem,5vw,4.75rem)] font-black leading-[1.05] tracking-tight text-white mb-6 animate-[fade-in-up_0.6s_0.25s_ease_forwards] opacity-0">
              Your People Are
              <br />
              Ready to Move.
              <br />
              <span className="text-bridge">Is Your System?</span>
            </h1>
            <p className="text-[1.1rem] text-white-soft leading-[1.75] max-w-[500px] mb-10 animate-[fade-in-up_0.6s_0.4s_ease_forwards] opacity-0">
              BRIDGE OS™ is M2M's workforce transition infrastructure for
              employers, municipalities, and SMBs managing the human side of
              organizational change. Built for retention and performance —
              not paperwork and compliance.
            </p>
            <div className="flex gap-4 flex-wrap mb-10 animate-[fade-in-up_0.6s_0.4s_ease_forwards] opacity-0">
              <button
                onClick={() => navigate("/bridge-intake")}
                className="bg-bridge text-navy text-[0.875rem] font-bold py-3.5 px-8 rounded-full border-none cursor-pointer tracking-[0.03em] hover:brightness-110 hover:scale-[1.02] transition-all"
              >
                Request a BRIDGE Assessment
              </button>
              <a
                href="#services"
                className="bg-transparent text-bridge text-[0.875rem] font-semibold py-3.5 px-8 rounded-full border-[1.5px] border-bridge cursor-pointer tracking-[0.03em] no-underline inline-block hover:bg-bridge-light transition-colors"
              >
                See the Services
              </a>
            </div>
          </div>

          {/* Metrics Panel */}
          <div className="bg-[linear-gradient(145deg,#0D2045,#1A3560)] border border-bridge/20 rounded-2xl p-8 shadow-[0_0_40px_rgba(72,187,120,0.07)] animate-[fade-in-up_0.6s_0.25s_ease_forwards] opacity-0">
            <p className="font-mono text-[0.65rem] tracking-[0.15em] text-bridge uppercase mb-6">
              Why Workforce Transition Fails
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {METRICS.map((m) => (
                <div
                  key={m.num}
                  className="text-center p-4 bg-bridge/[0.06] border border-bridge/[0.12] rounded-[10px]"
                >
                  <div className="font-display text-[2rem] font-black text-bridge leading-none mb-1">
                    {m.num}
                  </div>
                  <div className="text-[0.72rem] text-white-dim tracking-[0.04em] leading-[1.4]">
                    {m.desc}
                  </div>
                </div>
              ))}
            </div>
            <div className="h-px bg-bridge/[0.12] my-4" />
            <p className="text-[0.75rem] text-white-dim leading-normal">
              BRIDGE OS™ addresses the behavioral layer that separates workforce
              transition from workforce transformation.
            </p>
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-[linear-gradient(to_right,transparent,rgba(72,187,120,0.2),transparent)]" />

      {/* ── PROBLEM / SOLUTION ── */}
      <section className="py-24 px-[clamp(1.5rem,5vw,4rem)] bg-[#060F1E]">
        <div className="max-w-[1280px] mx-auto">
          <p className="font-mono text-[0.68rem] tracking-[0.18em] text-bridge uppercase mb-3.5 flex items-center gap-3 before:block before:w-[3px] before:h-9 before:bg-bridge before:rounded-sm">
            The Gap
          </p>
          <h2 className="font-display text-[clamp(1.75rem,3vw,2.75rem)] font-bold text-white leading-[1.15] mb-12 tracking-tight">
            What's Failing and
            <br />
            What BRIDGE OS™ Fixes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Problems */}
            <div>
              <p className="font-mono text-[0.65rem] tracking-[0.15em] uppercase mb-4 text-[#FC8181]">
                The Problem
              </p>
              <div className="flex flex-col gap-2.5">
                {PROBLEMS.map((p) => (
                  <div
                    key={p}
                    className="flex items-start gap-3 py-3.5 px-4 rounded-[10px] text-[0.875rem] leading-normal bg-[rgba(252,129,129,0.06)] border border-[rgba(252,129,129,0.15)] text-white-soft"
                  >
                    <span className="shrink-0 mt-0.5 text-[#FC8181]">✕</span>
                    {p}
                  </div>
                ))}
              </div>
            </div>
            {/* Solutions */}
            <div>
              <p className="font-mono text-[0.65rem] tracking-[0.15em] uppercase mb-4 text-bridge">
                BRIDGE OS™ Response
              </p>
              <div className="flex flex-col gap-2.5">
                {SOLUTIONS.map((s) => (
                  <div
                    key={s}
                    className="flex items-start gap-3 py-3.5 px-4 rounded-[10px] text-[0.875rem] leading-normal bg-bridge-light border border-bridge-border text-white-soft"
                  >
                    <span className="shrink-0 mt-0.5 text-bridge">◆</span>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-[linear-gradient(to_right,transparent,rgba(72,187,120,0.2),transparent)]" />

      {/* ── SERVICES ── */}
      <section id="services" className="py-24 px-[clamp(1.5rem,5vw,4rem)] bg-navy">
        <div className="max-w-[1280px] mx-auto">
          <p className="font-mono text-[0.68rem] tracking-[0.18em] text-bridge uppercase mb-3.5 flex items-center gap-3 before:block before:w-[3px] before:h-9 before:bg-bridge before:rounded-sm">
            What We Deliver
          </p>
          <h2 className="font-display text-[clamp(1.75rem,3vw,2.75rem)] font-bold text-white leading-[1.15] mb-4 tracking-tight">
            Six BRIDGE OS™
            <br />
            Service Lanes
          </h2>
          <p className="text-base text-white-soft max-w-[560px] leading-[1.7] mb-12">
            From SMB workforce planning to large-scale community reintegration —
            BRIDGE OS™ is modular by design. Deploy the piece you need or
            activate the full architecture.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="bg-[linear-gradient(145deg,#0D2045,#1A3560)] border border-white/[0.06] border-t-[3px] border-t-bridge rounded-[14px] p-7 hover:-translate-y-1.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3),0_0_32px_rgba(72,187,120,0.08)] transition-all duration-300"
              >
                <div className="text-2xl mb-4 w-11 h-11 flex items-center justify-center bg-bridge-light rounded-[10px]">
                  {s.icon}
                </div>
                <h3 className="font-display text-[1.2rem] font-bold text-white mb-2">
                  {s.title}
                </h3>
                <p className="text-[0.85rem] text-white-soft leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-[linear-gradient(to_right,transparent,rgba(72,187,120,0.2),transparent)]" />

      {/* ── COMMUNITY USE CASES ── */}
      <section className="py-24 px-[clamp(1.5rem,5vw,4rem)] bg-[#060F1E]">
        <div className="max-w-[1280px] mx-auto">
          <p className="font-mono text-[0.68rem] tracking-[0.18em] text-bridge uppercase mb-3.5 flex items-center gap-3 before:block before:w-[3px] before:h-9 before:bg-bridge before:rounded-sm">
            In the Field
          </p>
          <h2 className="font-display text-[clamp(1.75rem,3vw,2.75rem)] font-bold text-white leading-[1.15] mb-4 tracking-tight">
            BRIDGE OS™ at Work
            <br />
            in North Carolina
          </h2>
          <p className="text-base text-white-soft max-w-[560px] leading-[1.7] mb-12">
            Three active community workforce initiatives — each applying BRIDGE OS™
            methodology to underserved populations and underfunded systems.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {CASES.map((c) => (
              <div
                key={c.name}
                className="bg-bridge-light border border-bridge-border rounded-xl p-6"
              >
                <p className="font-mono text-[0.65rem] tracking-[0.1em] text-bridge uppercase mb-2">
                  {c.name}
                </p>
                <h3 className="font-display text-[1.1rem] font-bold text-white mb-2">
                  {c.title}
                </h3>
                <p className="text-[0.825rem] text-white-soft leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 px-[clamp(1.5rem,5vw,4rem)] text-center bg-[linear-gradient(135deg,#0C1F35_0%,#0A1628_100%)] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse,rgba(72,187,120,0.06),transparent_70%)] pointer-events-none" />
        <div className="max-w-[700px] mx-auto relative">
          <p className="font-mono text-[0.68rem] tracking-[0.18em] text-bridge uppercase mb-4">
            Build the Bridge
          </p>
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-black text-white leading-[1.1] mb-5 tracking-tight">
            Your Workforce Is Going
            <br />
            <span className="text-bridge">Through Change Either Way.</span>
          </h2>
          <p className="text-base text-white-soft leading-[1.7] mb-10">
            The only question is whether it's managed or absorbed.
            Schedule a BRIDGE OS™ briefing and get a no-cost workforce
            transition gap assessment for your organization.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={openCalendly}
              className="bg-bridge text-navy text-[0.875rem] font-bold py-3.5 px-8 rounded-full border-none cursor-pointer tracking-[0.03em] hover:brightness-110 hover:scale-[1.02] transition-all"
            >
              Request a BRIDGE Assessment
            </button>
            <a
              href="tel:9804749377"
              className="bg-transparent text-bridge text-[0.875rem] font-semibold py-3.5 px-8 rounded-full border-[1.5px] border-bridge cursor-pointer tracking-[0.03em] no-underline inline-block hover:bg-bridge-light transition-colors"
            >
              Call 980.474.9377
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
