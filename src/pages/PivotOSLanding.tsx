import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* ─────────────────────────────────────────────
   M2M~Inc. — PIVOT OS™ Landing Page
   Individual Career Reinvention
   Converted to React/TypeScript + Tailwind v4
───────────────────────────────────────────── */

const STEPS = [
  {
    num: "01",
    icon: "◎",
    title: "Reactivity Profile",
    body: "Complete the RPA™ — Reactivity Profile Assessment. Understand how you respond under pressure before you plan any next move.",
  },
  {
    num: "02",
    icon: "◈",
    title: "Composure Map",
    body: "Apply M2M Composure Architecture™ to identify your Proficiency Prison — the expertise that's caging your next level.",
  },
  {
    num: "03",
    icon: "⬡",
    title: "Pivot Blueprint",
    body: "Build your structured transition plan using the Three Spaces Framework™ — from where you are to where you're going.",
  },
  {
    num: "04",
    icon: "✦",
    title: "Activation",
    body: "Execute with the Sully Sequence™ — a proven launch protocol for professionals who are done waiting for permission.",
  },
];

const TOOLS = [
  {
    tm: "Assessment Tool",
    name: "RPA™",
    desc: "Reactivity Profile Assessment — maps your behavioral patterns under transition stress. The diagnostic that starts everything.",
  },
  {
    tm: "Framework",
    name: "C.A.L.M.™",
    desc: "Composure Architecture for Lasting Movement. The four-quadrant operating model that replaces reactive decision-making with sovereign execution.",
  },
  {
    tm: "Framework",
    name: "Three Spaces™",
    desc: "Professional Space → Transitional Space → Emerging Space. Know exactly where you are and what's required to move.",
  },
  {
    tm: "Launch Protocol",
    name: "Sully Sequence™",
    desc: "The structured activation protocol for career pivots. Named for the discipline of landing under pressure, not panic.",
  },
  {
    tm: "Navigation System",
    name: "PIVOT OS™",
    desc: "The full individual reinvention operating system — from first assessment to active career transition execution.",
  },
  {
    tm: "Shift Model",
    name: "Evangelist Shift™",
    desc: "Converts professional expertise into a platform of influence. For the practitioner ready to become the message.",
  },
];

const WHO_ITS_FOR = [
  "You're a veteran re-entering civilian workforce and the transition feels like translation",
  "You're a high-performer who has mastered your lane but knows it's no longer the right lane",
  "You've tried the standard career advice and it doesn't account for who you actually are",
  "You're between roles and the silence is louder than the noise",
  "You need a system — not a pep talk, not a resume refresh, not a LinkedIn audit",
];

export default function PivotOSLanding() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    console.log("PIVOT OS intake email:", email);
    setEmail("");
    navigate("/pivot-intake");
  }

  return (
    <>
      <Navbar />

      {/* ── HERO ── */}
      <section className="min-h-screen flex items-center pt-[120px] pb-20 px-[clamp(1.5rem,5vw,4rem)] bg-[linear-gradient(135deg,#0A1628_0%,#0B1E3A_60%,#0A1628_100%)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_75%_40%,rgba(74,144,217,0.08),transparent)] pointer-events-none" />
        <div className="max-w-[1280px] mx-auto w-full grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-20 items-center relative">
          {/* Left column */}
          <div>
            <div className="inline-flex items-center gap-2 bg-pivot-light border border-pivot-border px-3.5 py-1.5 rounded-full font-mono text-[0.65rem] tracking-[0.12em] text-pivot uppercase mb-5 animate-[fade-in-up_0.6s_0.1s_ease_forwards] opacity-0">
              <span className="w-1.5 h-1.5 rounded-full bg-pivot" />
              PIVOT OS™ · Individual Reinvention
            </div>
            <h1 className="font-display text-[clamp(2.75rem,5vw,4.75rem)] font-black leading-[1.05] tracking-tight text-white mb-6 animate-[fade-in-up_0.6s_0.25s_ease_forwards] opacity-0">
              You Didn't Come
              <br />
              This Far to
              <br />
              <span className="text-pivot">Stay Here.</span>
            </h1>
            <p className="text-[1.1rem] text-white-soft leading-[1.75] max-w-[500px] mb-10 animate-[fade-in-up_0.6s_0.4s_ease_forwards] opacity-0">
              PIVOT OS™ is M2M's structured reinvention system for veterans,
              transitioning professionals, and high-performers who've outgrown
              their current lane. This is not career coaching. This is a
              behavioral operating system built for the pivot.
            </p>
            <div className="flex gap-4 flex-wrap mb-10 animate-[fade-in-up_0.6s_0.4s_ease_forwards] opacity-0">
              <button
                onClick={() => navigate("/pivot-intake")}
                className="bg-pivot text-white text-[0.875rem] font-bold py-3.5 px-8 rounded-full border-none cursor-pointer tracking-[0.03em] hover:brightness-110 hover:scale-[1.02] transition-all"
              >
                Start Your Pivot
              </button>
              <a
                href="#process"
                className="bg-transparent text-pivot text-[0.875rem] font-semibold py-3.5 px-8 rounded-full border-[1.5px] border-pivot cursor-pointer tracking-[0.03em] no-underline inline-block hover:bg-pivot-light transition-colors"
              >
                See the Process
              </a>
            </div>
          </div>

          {/* Right column — Who It's For */}
          <div className="animate-[fade-in-up_0.6s_0.25s_ease_forwards] opacity-0">
            <p className="font-mono text-[0.65rem] tracking-[0.15em] text-pivot uppercase mb-4">
              PIVOT OS™ is built for you if —
            </p>
            <div className="flex flex-col gap-2.5">
              {WHO_ITS_FOR.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 bg-pivot/[0.06] border border-pivot/15 rounded-[10px] py-3.5 px-4"
                >
                  <span className="text-pivot text-[0.9rem] mt-px shrink-0">◆</span>
                  <span className="text-[0.875rem] text-white-soft leading-normal">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-[linear-gradient(to_right,transparent,rgba(74,144,217,0.2),transparent)]" />

      {/* ── PROCESS ── */}
      <section id="process" className="py-24 px-[clamp(1.5rem,5vw,4rem)] bg-navy">
        <div className="max-w-[1280px] mx-auto">
          <p className="font-mono text-[0.68rem] tracking-[0.18em] text-pivot uppercase mb-3.5 flex items-center gap-3 before:block before:w-[3px] before:h-9 before:bg-pivot before:rounded-sm">
            The Process
          </p>
          <h2 className="font-display text-[clamp(1.75rem,3vw,2.75rem)] font-bold text-white leading-[1.15] mb-4 tracking-tight">
            Four Phases. One System.
            <br />
            No Shortcuts.
          </h2>
          <p className="text-base text-white-soft max-w-[560px] leading-[1.7] mb-12">
            PIVOT OS™ runs on M2M Composure Architecture™ — a structured behavioral
            system built from real transition data, not motivational frameworks.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {STEPS.map((s) => (
              <div
                key={s.num}
                className="bg-[linear-gradient(145deg,#0D2045,#1A3560)] border border-white/[0.06] rounded-[14px] p-7 relative overflow-hidden hover:-translate-y-1 hover:border-pivot/30 transition-all duration-300"
              >
                <div className="font-display text-[3.5rem] font-black text-pivot/[0.12] absolute top-3 right-4 leading-none pointer-events-none">
                  {s.num}
                </div>
                <div className="text-2xl mb-4 w-11 h-11 flex items-center justify-center bg-pivot-light rounded-[10px]">
                  {s.icon}
                </div>
                <h3 className="font-display text-[1.2rem] font-bold text-white mb-2">{s.title}</h3>
                <p className="text-[0.85rem] text-white-soft leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-[linear-gradient(to_right,transparent,rgba(74,144,217,0.2),transparent)]" />

      {/* ── IP TOOLS ── */}
      <section className="py-24 px-[clamp(1.5rem,5vw,4rem)] bg-navy-deep">
        <div className="max-w-[1280px] mx-auto">
          <p className="font-mono text-[0.68rem] tracking-[0.18em] text-pivot uppercase mb-3.5 flex items-center gap-3 before:block before:w-[3px] before:h-9 before:bg-pivot before:rounded-sm">
            Proprietary IP
          </p>
          <h2 className="font-display text-[clamp(1.75rem,3vw,2.75rem)] font-bold text-white leading-[1.15] mb-4 tracking-tight">
            The Tools Inside
            <br />
            PIVOT OS™
          </h2>
          <p className="text-base text-white-soft max-w-[560px] leading-[1.7] mb-12">
            Every framework in PIVOT OS™ is a pending trademark — built, tested,
            and refined through real practitioner engagements.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TOOLS.map((t) => (
              <div
                key={t.name}
                className="bg-pivot/5 border border-pivot/15 rounded-xl p-6 hover:bg-pivot/10 hover:border-pivot/30 transition-all duration-300"
              >
                <p className="font-mono text-[0.65rem] tracking-[0.1em] text-pivot uppercase mb-2">
                  {t.tm}
                </p>
                <h3 className="font-display text-[1.25rem] font-bold text-white mb-2.5">
                  {t.name}
                </h3>
                <p className="text-[0.85rem] text-white-soft leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-[linear-gradient(to_right,transparent,rgba(74,144,217,0.2),transparent)]" />

      {/* ── TESTIMONIAL ── */}
      <section className="py-24 px-[clamp(1.5rem,5vw,4rem)] bg-navy">
        <div className="max-w-[860px] mx-auto">
          <p className="font-mono text-[0.68rem] tracking-[0.18em] text-pivot uppercase mb-3.5 flex items-center gap-3 before:block before:w-[3px] before:h-9 before:bg-pivot before:rounded-sm">
            From the Field
          </p>
          <div className="bg-[linear-gradient(145deg,#0D2045,#1A3560)] border border-pivot/20 rounded-2xl p-12 relative shadow-[0_0_40px_rgba(74,144,217,0.07)]">
            <span className="font-display text-[6rem] text-pivot opacity-15 leading-[0.5] mb-4 block">
              &ldquo;
            </span>
            <p className="font-display text-[clamp(1.2rem,2vw,1.6rem)] font-semibold text-white leading-[1.4] mb-6">
              PIVOT OS™ gave me language for something I'd been living but
              couldn't articulate. I knew my military career had given me more
              than a resume could hold. The Composure Architecture showed me
              exactly where I'd been caging myself — and how to stop.
            </p>
            <p className="text-[0.85rem] text-white-dim">
              — <strong className="text-pivot">PIVOT OS™ Client</strong> · Navy Veteran, 12 Years Service
              <br />
              <span>Now: Senior Operations Director, Financial Services</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA + EMAIL FORM ── */}
      <section className="py-28 px-[clamp(1.5rem,5vw,4rem)] text-center bg-[linear-gradient(135deg,#0B1E3A_0%,#0A1628_100%)] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse,rgba(74,144,217,0.07),transparent_70%)] pointer-events-none" />
        <div className="max-w-[680px] mx-auto relative">
          <p className="font-mono text-[0.68rem] tracking-[0.18em] text-pivot uppercase mb-4">
            Begin Here
          </p>
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-black text-white leading-[1.1] mb-5 tracking-tight">
            The Pivot Isn't
            <br />
            <span className="text-pivot">the Risk.</span>
            <br />
            Staying Is.
          </h2>
          <p className="text-base text-white-soft leading-[1.7] mb-10">
            Schedule a PIVOT OS™ intake consultation. Forty-five minutes.
            Structured. No pitch. Just clarity on where you are and what
            the system recommends next.
          </p>

          {/* Controlled email form */}
          <form
            onSubmit={handleSubmit}
            className="flex gap-3 justify-center flex-wrap mb-6 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 min-w-[200px] px-5 py-3.5 rounded-full bg-navy-light border border-pivot-border text-white text-sm font-body placeholder:text-white-dim focus:outline-none focus:border-pivot focus:ring-1 focus:ring-pivot transition-colors"
            />
            <button
              type="submit"
              className="bg-pivot text-white text-sm font-bold py-3.5 px-8 rounded-full border-none cursor-pointer tracking-[0.03em] hover:brightness-110 hover:scale-[1.02] transition-all"
            >
              Schedule Intake
            </button>
          </form>

          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate("/pivot-intake")}
              className="bg-pivot text-white text-[0.875rem] font-bold py-3.5 px-8 rounded-full border-none cursor-pointer tracking-[0.03em] hover:brightness-110 hover:scale-[1.02] transition-all"
            >
              Start Your Pivot
            </button>
            <a
              href="tel:9804749377"
              className="bg-transparent text-pivot text-[0.875rem] font-semibold py-3.5 px-8 rounded-full border-[1.5px] border-pivot cursor-pointer tracking-[0.03em] no-underline inline-block hover:bg-pivot-light transition-colors"
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
