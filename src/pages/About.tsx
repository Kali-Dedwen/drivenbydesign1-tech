import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* ─────────────────────────────────────────────
   M2M~Inc. — About / Sovereign Architect
   Converted to React/TypeScript + Tailwind v4
───────────────────────────────────────────── */

const openCalendly = () => {
  (window as any).Calendly.initPopupWidget({
    url: "https://calendly.com/kevin-m2m",
  });
  return false;
};

const TIMELINE = [
  { year: "U.S. Navy", title: "Service & Discipline Foundation", body: "Military service instills the operational clarity, mission orientation, and composure under pressure that anchors every M2M framework.", dim: false },
  { year: "Post-Service", title: "Workforce Reinvention", body: "Navigated the civilian transition gap firsthand — the experience that became the blueprint for PIVOT OS™.", dim: false },
  { year: "2020–Present", title: "M2M~Inc. Founded", body: "Model 2 Message launched as a workforce intelligence firm. Nine proprietary marks now in the USPTO pipeline.", dim: false },
  { year: "2024", title: "Human OS™ Architecture Complete", body: "Full three-lane platform — PIVOT OS™, BRIDGE OS™, Human OS™ — built, tested, and deployed.", dim: false },
  { year: "2025–2026", title: "SDVOSB/VBE + Tuck Network", body: "Veteran certifications secured. Wells Fargo Tuck Executive Education cohort confirmed. Enterprise market entry active.", dim: false },
  { year: "Jun 2026", title: "Jupiter Return Window", body: "12-year expansion cycle begins. The platform is built. The sprint is now.", dim: true },
];

const CREDS = [
  { icon: "⚓", name: "U.S. Navy Veteran", sub: "Service · Discipline · Mission" },
  { icon: "🎓", name: "Hon. D.H.L.", sub: "Doctor of Humane Letters" },
  { icon: "◆", name: "SAFe 6 Agilist", sub: "CSM · CSPO" },
  { icon: "✦", name: "SDVOSB", sub: "Service-Disabled Veteran-Owned" },
  { icon: "⬟", name: "VBE Certified", sub: "Veteran Business Enterprise" },
  { icon: "◈", name: "Tuck Exec. Ed.", sub: "Wells Fargo Cohort · Apr 2026" },
  { icon: "⬡", name: "USPTO — 9 Marks", sub: "Pending Trademark Portfolio" },
  { icon: "✶", name: "Kamelot Global", sub: "Executive Director · KGM SSM" },
];

export default function About() {
  return (
    <>
      <Navbar />
      <main>

      {/* ── HERO ── */}
      <section className="min-h-[75vh] flex items-end pt-[120px] pb-20 px-[clamp(1.5rem,5vw,4rem)] bg-[linear-gradient(135deg,#0A1628_0%,#0D2045_60%,#0A1628_100%)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_80%_40%,rgba(201,168,76,0.07),transparent)] pointer-events-none" />
        <div className="max-w-[1280px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-20 items-end relative">
          <div>
            <p className="font-mono text-[0.68rem] tracking-[0.18em] text-gold uppercase mb-4 flex items-center gap-3 before:block before:w-8 before:h-[1.5px] before:bg-gold animate-[fade-in-up_0.6s_0.1s_ease_forwards] opacity-0">
              The Sovereign Architect
            </p>
            <h1 className="font-display text-[clamp(3rem,6vw,5.5rem)] font-black leading-none tracking-tight text-white mb-3 animate-[fade-in-up_0.6s_0.25s_ease_forwards] opacity-0">
              Dr. Kevin
              <br />
              A. Smith
            </h1>
            <p className="font-mono text-[0.75rem] tracking-[0.15em] text-gold-muted uppercase mb-6 animate-[fade-in-up_0.6s_0.4s_ease_forwards] opacity-0">
              Founder & Chief Opportunity Officer · M2M~Inc.
            </p>
            <p className="text-[1.05rem] text-white-soft leading-[1.75] max-w-[480px] animate-[fade-in-up_0.6s_0.4s_ease_forwards] opacity-0">
              Navy veteran. Behavioral systems architect. Workforce intelligence
              practitioner. Built the Human OS™ platform from lived experience —
              not theory.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 animate-[fade-in-up_0.6s_0.25s_ease_forwards] opacity-0">
            {[
              "SDVOSB Certified",
              "VBE Certified",
              "SAFe 6 Agilist · CSM · CSPO",
              "Hon. D.H.L.",
              "Tuck Executive Education · Wells Fargo Cohort",
              "USPTO — 9 Proprietary Marks Pending",
            ].map((c) => (
              <div
                key={c}
                className="flex items-center gap-3 py-2.5 px-4 bg-gold/[0.06] border border-gold/15 rounded-lg"
              >
                <span className="text-gold text-[0.6rem]">✦</span>
                <span className="font-mono text-[0.65rem] tracking-[0.08em] text-white-soft uppercase">
                  {c}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-[linear-gradient(to_right,transparent,rgba(201,168,76,0.2),transparent)]" />

      {/* ── BIO + TIMELINE ── */}
      <section className="py-24 px-[clamp(1.5rem,5vw,4rem)] bg-navy">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* Bio */}
          <div>
            <p className="font-mono text-[0.68rem] tracking-[0.18em] text-gold uppercase mb-3.5 flex items-center gap-3 before:block before:w-[3px] before:h-9 before:bg-gold before:rounded-sm">
              The Story
            </p>
            <h2 className="font-display text-[clamp(1.75rem,3vw,2.75rem)] font-bold text-white leading-[1.15] mb-4 tracking-tight">
              Built From the
              <br />
              Inside of the Problem
            </h2>
            <div className="text-base text-white-soft leading-[1.8] space-y-5">
              <p>
                Dr. Kevin A. Smith didn't design the Human OS™ platform from a
                conference room. He built it from the gap — the space between
                military service and civilian identity, between professional mastery
                and personal reinvention, between what an organization says it values
                and how it actually treats people in transition.
              </p>
              <p>
                A <strong className="text-white">U.S. Navy veteran</strong> with
                roots in South Boston, Virginia and an operational base in
                Winston-Salem, NC, Kev has spent the last decade at the intersection
                of behavioral science, workforce development, and organizational
                transformation. His platform sits on nine proprietary marks because
                the frameworks he built didn't exist anywhere else.
              </p>
              <p>
                As{" "}
                <strong className="text-white">
                  Founder and Chief Opportunity Officer of M2M~Inc.
                </strong>
                , he leads a three-lane workforce intelligence platform — PIVOT OS™
                for individuals, BRIDGE OS™ for employers, and Human OS™ for
                enterprise and government. He also serves as Part-Time COO of
                CenterMarq LLC and Executive Director of Kamelot Global Ministries.
              </p>
              <p>
                The throughline across every role:{" "}
                <strong className="text-white">
                  every person carries more capacity than they've been given credit
                  for.
                </strong>{" "}
                The system exists to prove it.
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <p className="font-mono text-[0.68rem] tracking-[0.18em] text-gold uppercase mb-3.5 flex items-center gap-3 before:block before:w-[3px] before:h-9 before:bg-gold before:rounded-sm">
              The Path
            </p>
            <h2 className="font-display text-[clamp(1.75rem,3vw,2.75rem)] font-bold text-white leading-[1.15] mb-8 tracking-tight">
              Timeline
            </h2>
            <div className="flex flex-col relative before:absolute before:left-[11px] before:top-1 before:bottom-1 before:w-[1.5px] before:bg-[linear-gradient(to_bottom,#C9A84C,rgba(201,168,76,0.1))]">
              {TIMELINE.map((t) => (
                <div key={t.title} className="flex gap-5 pb-8">
                  <div
                    className={`w-6 h-6 rounded-full border-[3px] shrink-0 mt-0.5 relative z-10 ${
                      t.dim
                        ? "bg-navy-light border-navy-light"
                        : "bg-gold border-navy"
                    }`}
                  />
                  <div>
                    <p className="font-mono text-[0.62rem] tracking-[0.1em] text-gold uppercase mb-0.5">
                      {t.year}
                    </p>
                    <p className="text-[0.95rem] font-semibold text-white mb-0.5">
                      {t.title}
                    </p>
                    <p className="text-[0.82rem] text-white-dim leading-[1.55]">
                      {t.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-[linear-gradient(to_right,transparent,rgba(201,168,76,0.2),transparent)]" />

      {/* ── CREDENTIALS ── */}
      <section className="py-24 px-[clamp(1.5rem,5vw,4rem)] bg-[#060F1E]">
        <div className="max-w-[1280px] mx-auto">
          <p className="font-mono text-[0.68rem] tracking-[0.18em] text-gold uppercase mb-3.5 flex items-center gap-3 before:block before:w-[3px] before:h-9 before:bg-gold before:rounded-sm">
            Credentials
          </p>
          <h2 className="font-display text-[clamp(1.75rem,3vw,2.75rem)] font-bold text-white leading-[1.15] mb-10 tracking-tight">
            The Full Portfolio
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CREDS.map((c) => (
              <div
                key={c.name}
                className="bg-[linear-gradient(145deg,#0D2045,#1A3560)] border border-gold/15 rounded-xl p-5 text-center"
              >
                <div className="text-[1.3rem] mb-2.5">{c.icon}</div>
                <div className="text-[0.82rem] font-semibold text-white mb-1">
                  {c.name}
                </div>
                <div className="text-[0.7rem] text-white-dim leading-[1.4]">
                  {c.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-[linear-gradient(to_right,transparent,rgba(201,168,76,0.2),transparent)]" />

      {/* ── QUOTE ── */}
      <section className="py-24 px-[clamp(1.5rem,5vw,4rem)] bg-navy">
        <div className="max-w-[860px] mx-auto">
          <div className="bg-[linear-gradient(145deg,#0D2045,#1A3560)] border border-gold/20 rounded-2xl p-14 shadow-[0_0_48px_rgba(201,168,76,0.06)]">
            <span className="font-display text-[7rem] text-gold opacity-[0.12] leading-[0.4] block mb-5">
              &ldquo;
            </span>
            <p className="font-display text-[clamp(1.3rem,2.2vw,1.9rem)] font-semibold text-white leading-[1.35] mb-7">
              The Sovereign Architect doesn't wait for permission to build. He
              assesses the terrain, designs the structure, and executes with the
              composure of someone who has already decided the outcome — because the
              system is sound.
            </p>
            <p className="text-[0.875rem] text-white-dim">
              — <strong className="text-gold">Dr. Kevin A. Smith</strong> · Founder,
              M2M~Inc.
              <br />
              <span>Navy Veteran · Hon. D.H.L. · Sovereign Architect</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-[clamp(1.5rem,5vw,4rem)] text-center bg-[linear-gradient(135deg,#0D2045_0%,#0A1628_100%)]">
        <div className="max-w-[640px] mx-auto">
          <p className="font-mono text-[0.68rem] tracking-[0.18em] text-gold uppercase mb-4">
            Work With Kev
          </p>
          <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-black text-white leading-[1.1] mb-4 tracking-tight">
            Ready to Build
            <br />
            <span className="text-gold">Something That Lasts?</span>
          </h2>
          <p className="text-base text-white-soft leading-[1.7] mb-9">
            Whether you're an individual ready to pivot, an organization navigating
            change, or a partner looking to license the platform — the conversation
            starts here.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={openCalendly}
              className="bg-gold text-navy text-[0.875rem] font-bold py-3.5 px-8 rounded-full border-none cursor-pointer tracking-[0.03em] hover:brightness-110 hover:scale-[1.02] transition-all"
            >
              Schedule a Consultation
            </button>
            <Link
              to="/speaking"
              className="bg-transparent text-gold text-[0.875rem] font-semibold py-3.5 px-8 rounded-full border-[1.5px] border-gold no-underline inline-block hover:bg-gold/[0.08] transition-colors"
            >
              Invite Kev to Speak
            </Link>
          </div>
        </div>
      </section>

      </main>
      <Footer />
    </>
  );
}
