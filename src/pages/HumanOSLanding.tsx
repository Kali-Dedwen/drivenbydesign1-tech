import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* ─────────────────────────────────────────────
   M2M~Inc. — Human OS™ Landing Page
   Enterprise / Government Workforce Intelligence
   Converted to React/TypeScript + Tailwind v4
───────────────────────────────────────────── */

const CERTS = [
  { icon: "✦", label: "Certification", name: "SDVOSB — Service-Disabled Veteran-Owned Small Business" },
  { icon: "◆", label: "Certification", name: "VBE — Veteran Business Enterprise" },
  { icon: "⬟", label: "Framework", name: "SAFe 6 Agilist · CSM · CSPO" },
  { icon: "◈", label: "Academic", name: "Tuck Executive Education — Wells Fargo Cohort" },
  { icon: "⬡", label: "IP Portfolio", name: "USPTO — 9 Proprietary Marks Pending" },
];

const ENT_SERVICES = [
  { icon: "⬟", title: "Workforce Intelligence Audit", body: "A structured organizational assessment using M2M Composure Architecture™ to surface behavioral gaps, transition risk, and human performance leverage points across departments." },
  { icon: "◈", title: "Human OS™ Enterprise Deployment", body: "Full-scale rollout of the Human OS™ platform across enterprise teams — including practitioner certification, manager training, and change management infrastructure." },
  { icon: "✦", title: "Government Workforce Strategy", body: "Tailored workforce transition and re-entry programs for federal, state, and local government agencies. SDVOSB-certified, SAM.gov current, NAICS-aligned delivery." },
  { icon: "◆", title: "Executive Leadership Development", body: "Behavioral intelligence programming for C-suite and senior leadership teams navigating AI disruption, organizational change, and human capital strategy." },
];

const ARCH_COLS = [
  {
    label: "PIVOT OS™",
    labelColor: "#4A90D9",
    cards: [
      { title: "Individual Assessment", body: "RPA™ + C.A.L.M.™ at the employee level" },
      { title: "Career Reinvention", body: "Three Spaces Framework™ for individual contributors" },
    ],
  },
  {
    label: "Human OS™",
    labelColor: "#C9A84C",
    cards: [
      { title: "Composure Architecture™", body: "Organizational behavioral intelligence baseline" },
      { title: "Enterprise Deployment", body: "Full Human OS™ platform rollout + practitioner network" },
    ],
  },
  {
    label: "BRIDGE OS™",
    labelColor: "#48BB78",
    cards: [
      { title: "Team Transition", body: "Manager readiness + workforce change infrastructure" },
      { title: "Community Workforce", body: "Government + nonprofit re-entry systems" },
    ],
  },
];

const TIERS = [
  {
    name: "Associate Practitioner",
    title: "M2M-AP™",
    price: "$2,800",
    priceSub: "+ $200/mo platform access",
    featured: false,
    features: [
      "RPA™ Assessment Certification",
      "C.A.L.M.™ Framework Delivery",
      "PIVOT OS™ Client Facilitation",
      "M2M Digital Practitioner Portal",
      "Monthly Cohort Supervision",
    ],
  },
  {
    name: "Professional Practitioner",
    title: "M2M-PP™",
    price: "$4,800",
    priceSub: "+ $300/mo platform access",
    featured: true,
    features: [
      "Full PIVOT + BRIDGE OS™ Certification",
      "Three Spaces Framework™ License",
      "Sully Sequence™ Deployment Rights",
      "Client Assessment Dashboard",
      "Quarterly M2M Cohort Access",
      "Co-facilitation Opportunities",
    ],
  },
  {
    name: "Executive Practitioner",
    title: "M2M-EP™",
    price: "$9,500",
    priceSub: "+ $400/mo platform access",
    featured: false,
    features: [
      "Full Human OS™ Enterprise License",
      "All IP Frameworks — Full Rights",
      "White-Label Delivery Option",
      "Direct Access to Dr. Kevin A. Smith",
      "Enterprise Client Co-Delivery",
      "Annual M2M Summit Seat",
    ],
  },
];

const NAICS = [
  { code: "611430", desc: "Professional and Management Development Training" },
  { code: "541611", desc: "Administrative Management and General Management Consulting" },
  { code: "541512", desc: "Computer Systems Design Services" },
  { code: "611710", desc: "Educational Support Services" },
];

const openCalendly = () => {
  (window as any).Calendly.initPopupWidget({
    url: 'https://calendly.com/kevin-m2m'
  });
  return false;
};

export default function HumanOSLanding() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      {/* ── HERO ── */}
      <section className="min-h-screen flex items-center pt-[120px] pb-20 px-[clamp(1.5rem,5vw,4rem)] bg-[linear-gradient(135deg,#0A1628_0%,#0D2045_55%,#0A1628_100%)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_70%_50%,rgba(201,168,76,0.08),transparent)] pointer-events-none" />
        <div className="absolute -top-[150px] -right-[150px] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.05)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-[1280px] mx-auto w-full grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-20 items-center relative">
          {/* Left column */}
          <div>
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 px-3.5 py-1.5 rounded-full font-mono text-[0.65rem] tracking-[0.12em] text-gold uppercase mb-5 animate-[fade-in-up_0.6s_0.1s_ease_forwards] opacity-0">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              Human OS™ · Enterprise / Government
            </div>
            <h1 className="font-display text-[clamp(2.75rem,5vw,4.75rem)] font-black leading-[1.05] tracking-tight text-white mb-6 animate-[fade-in-up_0.6s_0.25s_ease_forwards] opacity-0">
              The Operating System
              <br />
              Your Organization
              <br />
              <span className="text-gold">Was Missing.</span>
            </h1>
            <p className="text-[1.1rem] text-white-soft leading-[1.75] max-w-[520px] mb-10 animate-[fade-in-up_0.6s_0.4s_ease_forwards] opacity-0">
              Human OS™ is M2M's enterprise and government workforce intelligence
              platform — the full M2M Composure Architecture™ deployed at scale
              across teams, agencies, and institutions navigating disruption and
              demanding measurable human performance outcomes.
            </p>
            <div className="flex gap-4 flex-wrap mb-10 animate-[fade-in-up_0.6s_0.4s_ease_forwards] opacity-0">
              <button
                onClick={openCalendly}
                className="bg-gold text-navy text-[0.875rem] font-bold py-3.5 px-8 rounded-full border-none cursor-pointer tracking-[0.03em] hover:brightness-110 hover:scale-[1.02] transition-all"
              >
                Schedule an Enterprise Briefing
              </button>
              <a
                href="#platform"
                className="bg-transparent text-gold text-[0.875rem] font-semibold py-3.5 px-8 rounded-full border-[1.5px] border-gold cursor-pointer tracking-[0.03em] no-underline inline-block hover:bg-gold/[0.08] transition-colors"
              >
                Explore the Architecture
              </a>
            </div>
          </div>

          {/* Trust / Credentials Panel */}
          <div className="animate-[fade-in-up_0.6s_0.25s_ease_forwards] opacity-0">
            <p className="font-mono text-[0.65rem] tracking-[0.15em] text-gold-muted uppercase mb-3">
              Certifications & Credentials
            </p>
            <div className="flex flex-col gap-3">
              {CERTS.map((c) => (
                <div
                  key={c.name}
                  className="bg-[linear-gradient(145deg,#0D2045,#1A3560)] border border-gold/20 rounded-xl px-5 py-4 flex items-center gap-3.5 hover:border-gold/40 transition-colors"
                >
                  <div className="text-[1.1rem] w-9 h-9 flex items-center justify-center bg-gold/10 rounded-lg shrink-0">
                    {c.icon}
                  </div>
                  <div>
                    <div className="font-mono text-[0.65rem] tracking-[0.08em] text-gold uppercase">
                      {c.label}
                    </div>
                    <div className="text-[0.875rem] text-white-soft mt-0.5">{c.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-[linear-gradient(to_right,transparent,rgba(201,168,76,0.2),transparent)]" />

      {/* ── PLATFORM ARCHITECTURE ── */}
      <section id="platform" className="py-24 px-[clamp(1.5rem,5vw,4rem)] bg-navy">
        <div className="max-w-[1280px] mx-auto">
          <p className="font-mono text-[0.68rem] tracking-[0.18em] text-gold uppercase mb-3.5 flex items-center gap-3 before:block before:w-[3px] before:h-9 before:bg-gold before:rounded-sm">
            The Architecture
          </p>
          <h2 className="font-display text-[clamp(1.75rem,3vw,2.75rem)] font-bold text-white leading-[1.15] mb-4 tracking-tight">
            Human OS™ Is the Roof.
            <br />
            PIVOT and BRIDGE Are the Floors.
          </h2>
          <p className="text-base text-white-soft max-w-[560px] leading-[1.7] mb-12">
            The Human OS™ platform integrates all three operating lanes into a single
            coherent workforce intelligence system. Enterprise clients access the
            full architecture — individual, team, and organizational levels simultaneously.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-[linear-gradient(to_right,transparent,rgba(201,168,76,0.3),transparent)]" />
            {ARCH_COLS.map((col) => (
              <div key={col.label} className="flex flex-col gap-4 items-center px-4">
                <div
                  className="font-mono text-[0.65rem] tracking-[0.12em] uppercase py-1 px-3 rounded-full"
                  style={{
                    background: `${col.labelColor}1A`,
                    color: col.labelColor,
                    border: `1px solid ${col.labelColor}40`,
                  }}
                >
                  {col.label}
                </div>
                <div className="w-0.5 h-6 bg-gold/25" />
                {col.cards.map((card, i) => (
                  <div key={card.title}>
                    <div className="w-full bg-[linear-gradient(145deg,#0D2045,#1A3560)] border border-white/[0.06] rounded-xl p-5">
                      <div className="font-display text-base font-bold text-white mb-1">
                        {card.title}
                      </div>
                      <div className="text-[0.78rem] text-white-dim leading-normal">
                        {card.body}
                      </div>
                    </div>
                    {i === 0 && <div className="w-0.5 h-6 bg-gold/25 mx-auto mt-4" />}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-[linear-gradient(to_right,transparent,rgba(201,168,76,0.2),transparent)]" />

      {/* ── ENTERPRISE SERVICES ── */}
      <section className="py-24 px-[clamp(1.5rem,5vw,4rem)] bg-[#060F1E]">
        <div className="max-w-[1280px] mx-auto">
          <p className="font-mono text-[0.68rem] tracking-[0.18em] text-gold uppercase mb-3.5 flex items-center gap-3 before:block before:w-[3px] before:h-9 before:bg-gold before:rounded-sm">
            Enterprise Services
          </p>
          <h2 className="font-display text-[clamp(1.75rem,3vw,2.75rem)] font-bold text-white leading-[1.15] mb-4 tracking-tight">
            What Human OS™
            <br />
            Delivers at Scale
          </h2>
          <p className="text-base text-white-soft max-w-[560px] leading-[1.7] mb-12">
            Four core enterprise engagements — each deployable independently
            or as part of a full Human OS™ organizational implementation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ENT_SERVICES.map((s) => (
              <div
                key={s.title}
                className="bg-[linear-gradient(145deg,#0D2045,#1A3560)] border border-gold/[0.12] border-l-[3px] border-l-gold rounded-[14px] p-8 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3),0_0_32px_rgba(201,168,76,0.08)] transition-all duration-300"
              >
                <div className="text-2xl mb-4">{s.icon}</div>
                <h3 className="font-display text-[1.25rem] font-bold text-white mb-2">
                  {s.title}
                </h3>
                <p className="text-[0.875rem] text-white-soft leading-[1.65]">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-[linear-gradient(to_right,transparent,rgba(201,168,76,0.2),transparent)]" />

      {/* ── PRACTITIONER CERTIFICATION ── */}
      <section className="py-24 px-[clamp(1.5rem,5vw,4rem)] bg-navy">
        <div className="max-w-[1280px] mx-auto">
          <p className="font-mono text-[0.68rem] tracking-[0.18em] text-gold uppercase mb-3.5 flex items-center gap-3 before:block before:w-[3px] before:h-9 before:bg-gold before:rounded-sm">
            Practitioner Certification
          </p>
          <h2 className="font-display text-[clamp(1.75rem,3vw,2.75rem)] font-bold text-white leading-[1.15] mb-4 tracking-tight">
            License the Platform.
            <br />
            Build a Practice.
          </h2>
          <p className="text-base text-white-soft max-w-[560px] leading-[1.7] mb-12">
            Three certification tiers for HR leaders, coaches, consultants, and
            workforce professionals ready to deploy Human OS™ methodology inside
            their organizations or with their own clients.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TIERS.map((t) => (
              <div
                key={t.title}
                className={`bg-[linear-gradient(145deg,#0D2045,#1A3560)] border rounded-[14px] p-8 text-center relative overflow-hidden hover:-translate-y-1.5 transition-all duration-300 ${
                  t.featured
                    ? "border-gold/40 shadow-[0_0_40px_rgba(201,168,76,0.1)]"
                    : "border-gold/[0.12] hover:border-gold/30"
                }`}
              >
                {t.featured && (
                  <div className="absolute top-4 right-4 font-mono text-[0.58rem] tracking-[0.1em] py-0.5 px-2 rounded-full bg-gold/15 text-gold border border-gold/30">
                    Most Popular
                  </div>
                )}
                <p className="font-mono text-[0.7rem] tracking-[0.12em] text-gold-muted uppercase mb-2">
                  {t.name}
                </p>
                <h3 className="font-display text-[1.4rem] font-bold text-white mb-3">
                  {t.title}
                </h3>
                <div className="font-display text-[2rem] font-black text-gold mb-1">
                  {t.price}
                </div>
                <div className="text-[0.75rem] text-white-dim mb-6">{t.priceSub}</div>
                <ul className="text-left flex flex-col gap-2 mb-6">
                  {t.features.map((f) => (
                    <li
                      key={f}
                      className="text-[0.82rem] text-white-soft flex items-start gap-2"
                    >
                      <span className="text-gold shrink-0 mt-px">✦</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate("/human-intake")}
                  className={`block w-full text-center text-[0.8rem] py-3 rounded-full cursor-pointer tracking-[0.03em] transition-all ${
                    t.featured
                      ? "bg-gold text-navy font-bold border-none hover:brightness-110 hover:scale-[1.02]"
                      : "bg-transparent text-gold font-semibold border-[1.5px] border-gold hover:bg-gold/[0.08]"
                  }`}
                >
                  Apply for Certification
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GOVCON STRIP ── */}
      <div className="bg-[#060F1E] py-12 px-[clamp(1.5rem,5vw,4rem)] border-y border-gold/10">
        <div className="max-w-[1280px] mx-auto flex justify-between items-center flex-wrap gap-8">
          <div>
            <h3 className="font-display text-2xl font-bold text-white mb-2">
              Government & Procurement
            </h3>
            <p className="text-[0.9rem] text-white-soft max-w-[480px] leading-relaxed">
              M2M~Inc. is SDVOSB and VBE certified. SAM.gov registration current.
              Available for federal, state, and local government contracting across
              four NAICS codes. Contact for capability statement and past performance package.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {NAICS.map((n) => (
              <div
                key={n.code}
                className="flex items-center gap-3 font-mono text-[0.65rem] tracking-[0.1em] text-gold-muted"
              >
                {n.code}{" "}
                <span className="text-[0.75rem] text-white-dim font-body">
                  — {n.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <section className="py-28 px-[clamp(1.5rem,5vw,4rem)] text-center bg-[linear-gradient(135deg,#0D2045_0%,#0A1628_100%)] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[radial-gradient(ellipse,rgba(201,168,76,0.07),transparent_70%)] pointer-events-none" />
        <div className="max-w-[720px] mx-auto relative">
          <p className="font-mono text-[0.68rem] tracking-[0.18em] text-gold uppercase mb-4">
            Enterprise Engagement
          </p>
          <h2 className="font-display text-[clamp(2rem,4vw,3.25rem)] font-black text-white leading-[1.1] mb-5 tracking-tight">
            Your Organization Has
            <br />
            <span className="text-gold">More Capacity Than It Knows.</span>
          </h2>
          <p className="text-base text-white-soft leading-[1.7] mb-10">
            Request an enterprise briefing. We'll assess your workforce transition
            readiness, identify the highest-leverage entry point in the Human OS™
            architecture, and build a scoped engagement proposal within 48 hours.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={openCalendly}
              className="bg-gold text-navy text-[0.875rem] font-bold py-3.5 px-8 rounded-full border-none cursor-pointer tracking-[0.03em] hover:brightness-110 hover:scale-[1.02] transition-all"
            >
              Schedule an Enterprise Briefing
            </button>
            <a
              href="tel:9804749377"
              className="bg-transparent text-gold text-[0.875rem] font-semibold py-3.5 px-8 rounded-full border-[1.5px] border-gold cursor-pointer tracking-[0.03em] no-underline inline-block hover:bg-gold/[0.08] transition-colors"
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
