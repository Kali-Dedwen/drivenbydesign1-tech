import { useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";

/* ─────────────────────────────────────────────
   M2M~Inc. — Contact / Intake Page
   Converted to React/TypeScript + Tailwind v4
───────────────────────────────────────────── */

const openCalendly = () => {
  (window as any).Calendly.initPopupWidget({
    url: "https://calendly.com/kevin-m2m",
  });
  return false;
};

const LANES = [
  { id: "pivot", label: "PIVOT OS™", sub: "Individual reinvention", color: "#4A90D9", rgb: "74,144,217" },
  { id: "bridge", label: "BRIDGE OS™", sub: "Employer / workforce", color: "#48BB78", rgb: "72,187,120" },
  { id: "human", label: "Human OS™", sub: "Enterprise / government", color: "#C9A84C", rgb: "201,168,76" },
] as const;

type LaneId = (typeof LANES)[number]["id"];

interface ContactForm {
  name: string;
  org: string;
  email: string;
  phone: string;
  type: string;
  message: string;
}

const DIRECT = [
  { icon: "📧", label: "Email", value: "info@model2message.net", href: "mailto:info@model2message.net" },
  { icon: "📞", label: "Phone", value: "980.474.9377", href: "tel:9804749377" },
  { icon: "📍", label: "Location", value: "Winston-Salem, NC", extra: "Available Nationally" },
];

export default function Contact() {
  const [lane, setLane] = useState<LaneId>("human");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<ContactForm>({
    name: "",
    org: "",
    email: "",
    phone: "",
    type: "",
    message: "",
  });

  const activeLane = LANES.find((l) => l.id === lane)!;

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    if (!form.name || !form.email) return;

    const EMPLOYER_WEBHOOK =
      "https://hook.us2.make.com/6isxh840yu2ouw5qg6pxcca0gfzaruaq";

    const nameParts = form.name.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    try {
      const params = new URLSearchParams();
      params.append("first_name", firstName);
      params.append("last_name", lastName);
      params.append("platform", activeLane.label);
      params.append("email", form.email);
      params.append("message", form.message);

      await fetch(EMPLOYER_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
    } catch (err) {
      console.error("Contact webhook error:", err);
    }

    setSubmitted(true);
  }

  const inputClasses =
    "w-full bg-white/[0.04] border-[1.5px] border-white/10 rounded-lg px-4 py-3 font-body text-[0.9rem] text-white outline-none focus:border-gold/50 focus:shadow-[0_0_0_3px_rgba(201,168,76,0.07)] transition-all placeholder:text-white-dim";
  const labelClasses = "font-mono text-[0.62rem] tracking-[0.12em] text-gold-muted uppercase";

  return (
    <>
      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center justify-between px-[clamp(1.5rem,5vw,4rem)] bg-navy/[0.92] backdrop-blur-[12px] border-b border-gold/[0.12]">
        <Link to="/" className="font-display text-2xl font-bold text-white no-underline">
          M2M<span className="text-gold">~</span>Inc.
        </Link>
        <ul className="flex items-center gap-8 list-none">
          <li className="hidden md:block"><Link to="/about" className="text-[0.875rem] font-medium text-white-soft no-underline hover:text-gold transition-colors">About</Link></li>
          <li className="hidden md:block"><Link to="/pivot-os" className="text-[0.875rem] font-medium text-white-soft no-underline hover:text-gold transition-colors">PIVOT OS™</Link></li>
          <li className="hidden md:block"><Link to="/bridge-os" className="text-[0.875rem] font-medium text-white-soft no-underline hover:text-gold transition-colors">BRIDGE OS™</Link></li>
          <li className="hidden md:block"><Link to="/human-os" className="text-[0.875rem] font-medium text-white-soft no-underline hover:text-gold transition-colors">Human OS™</Link></li>
          <li className="hidden md:block"><Link to="/speaking" className="text-[0.875rem] font-medium text-white-soft no-underline hover:text-gold transition-colors">Speaking</Link></li>
        </ul>
      </nav>

      {/* ── HERO ── */}
      <section className="pt-[140px] pb-16 px-[clamp(1.5rem,5vw,4rem)] bg-[linear-gradient(135deg,#0A1628_0%,#0D2045_60%,#0A1628_100%)] text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_60%,rgba(201,168,76,0.06),transparent)] pointer-events-none" />
        <div className="max-w-[720px] mx-auto relative">
          <p className="font-mono text-[0.68rem] tracking-[0.18em] text-gold uppercase mb-4 flex items-center justify-center gap-3 before:block before:flex-1 before:max-w-12 before:h-[1.5px] before:bg-gold after:block after:flex-1 after:max-w-12 after:h-[1.5px] after:bg-gold">
            Start Here
          </p>
          <h1 className="font-display text-[clamp(2.5rem,5vw,4.25rem)] font-black leading-[1.05] tracking-tight text-white mb-5">
            The Conversation
            <br />
            <span className="text-gold">Starts Here.</span>
          </h1>
          <p className="text-[1.05rem] text-white-soft leading-[1.75] mb-8">
            Select the platform lane that fits where you are. Every intake routes
            to Dr. Smith directly — no intake coordinators, no holding queues.
          </p>
        </div>
      </section>

      <div className="w-full h-px bg-[linear-gradient(to_right,transparent,rgba(201,168,76,0.2),transparent)]" />

      {/* ── FORM SECTION ── */}
      <section className="py-20 px-[clamp(1.5rem,5vw,4rem)] bg-navy">
        <div className="max-w-[1280px] mx-auto">
          {/* Lane Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-[860px] mx-auto mb-12">
            {LANES.map((l) => (
              <button
                key={l.id}
                onClick={() => setLane(l.id)}
                className={`text-left p-5 rounded-xl border-[1.5px] cursor-pointer transition-all ${
                  lane === l.id
                    ? "bg-white/[0.04] shadow-[0_0_24px_rgba(var(--active-rgb),0.08)]"
                    : "bg-white/[0.03] border-white/[0.08]"
                }`}
                style={
                  lane === l.id
                    ? { borderColor: l.color, background: `rgba(${l.rgb},0.08)` }
                    : {}
                }
              >
                <div
                  className="w-2 h-2 rounded-full mb-3"
                  style={{ background: l.color }}
                />
                <div className="text-[0.875rem] font-semibold text-white mb-1">
                  {l.label}
                </div>
                <div className="text-[0.75rem] text-white-dim">{l.sub}</div>
              </button>
            ))}
          </div>

          {/* Form */}
          {!submitted ? (
            <div className="max-w-[680px] mx-auto">
              <div
                className="rounded-2xl p-10"
                style={{
                  background: "linear-gradient(145deg,#0D2045,#1A3560)",
                  border: `1px solid ${activeLane.color}30`,
                  boxShadow: `0 0 40px ${activeLane.color}0D`,
                }}
              >
                <p
                  className="font-mono text-[0.65rem] tracking-[0.15em] uppercase mb-6"
                  style={{ color: activeLane.color }}
                >
                  {activeLane.label} Intake · model2message.net
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClasses}>Full Name *</label>
                    <input
                      className={inputClasses}
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Dr. Jane Smith"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClasses}>Organization</label>
                    <input
                      className={inputClasses}
                      name="org"
                      value={form.org}
                      onChange={handleChange}
                      placeholder="Company / Agency / Church"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClasses}>Email Address *</label>
                    <input
                      className={inputClasses}
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@organization.com"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClasses}>Phone (Optional)</label>
                    <input
                      className={inputClasses}
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="555.000.0000"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className={labelClasses}>Inquiry Type</label>
                    <select
                      className={`${inputClasses} appearance-none cursor-pointer`}
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                    >
                      <option value="" className="bg-navy-mid">Select inquiry type...</option>
                      <option value="consultation" className="bg-navy-mid">Individual Consultation</option>
                      <option value="workforce" className="bg-navy-mid">Workforce Engagement</option>
                      <option value="enterprise" className="bg-navy-mid">Enterprise / Government</option>
                      <option value="speaking" className="bg-navy-mid">Speaking Engagement</option>
                      <option value="certification" className="bg-navy-mid">Practitioner Certification</option>
                      <option value="partnership" className="bg-navy-mid">Partnership / Licensing</option>
                      <option value="media" className="bg-navy-mid">Media / Press</option>
                      <option value="other" className="bg-navy-mid">Other</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className={labelClasses}>Tell Us Where You Are</label>
                    <textarea
                      className={`${inputClasses} resize-y min-h-[120px]`}
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Describe your situation, challenge, or what you're looking to accomplish. The more specific, the better the first conversation."
                    />
                  </div>
                </div>
                <button
                  onClick={handleSubmit}
                  className="w-full mt-4 text-navy text-[0.95rem] font-bold py-4 rounded-full border-none cursor-pointer tracking-[0.03em] hover:brightness-110 hover:scale-[1.01] transition-all"
                  style={{ background: activeLane.color }}
                >
                  Submit Intake — {activeLane.label}
                </button>
                <p className="text-[0.75rem] text-white-dim text-center mt-3">
                  Responses within 24–48 business hours. Direct to Dr. Smith.
                </p>
              </div>
            </div>
          ) : (
            <div className="max-w-[680px] mx-auto text-center py-16 px-8">
              <div className="text-5xl mb-4">✦</div>
              <h2 className="font-display text-[2rem] font-bold text-white mb-3">
                Intake Received.
              </h2>
              <p className="text-base text-white-soft leading-[1.7] max-w-[480px] mx-auto mb-8">
                Your message has been routed to Dr. Smith. Expect a direct response
                within 24–48 business hours. In the meantime, explore the platform.
              </p>
              <Link
                to="/"
                className="inline-block bg-gold text-navy py-3 px-7 rounded-full font-bold text-[0.875rem] no-underline hover:brightness-110 transition-all"
              >
                Back to Home
              </Link>
            </div>
          )}

          {/* Direct Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-12 max-w-[860px] mx-auto">
            {DIRECT.map((d) => (
              <div
                key={d.label}
                className="bg-gold/5 border border-gold/15 rounded-xl p-6 text-center"
              >
                <div className="text-2xl mb-2.5">{d.icon}</div>
                <div className="font-mono text-[0.62rem] tracking-[0.12em] text-gold-muted uppercase mb-1.5">
                  {d.label}
                </div>
                <div className="text-[0.9rem] text-white font-medium">
                  {d.href ? (
                    <a
                      href={d.href}
                      className="text-gold no-underline hover:underline"
                    >
                      {d.value}
                    </a>
                  ) : (
                    <>
                      {d.value}
                      {d.extra && (
                        <div className="text-[0.8rem] text-white-dim mt-0.5">
                          {d.extra}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#060F1E] py-10 px-[clamp(1.5rem,5vw,4rem)] border-t border-gold/10">
        <div className="max-w-[1280px] mx-auto flex justify-between items-center flex-wrap gap-4">
          <div className="font-display text-[1.1rem] font-bold text-white">
            M2M<span className="text-gold">~</span>Inc.
          </div>
          <div className="flex items-center gap-3 flex-wrap font-mono text-[0.6rem] tracking-[0.12em] text-gold-muted uppercase">
            {["SDVOSB", "·", "VBE", "·", "SAFe 6", "·", "USPTO", "·", "Tuck"].map(
              (t, i) => (
                <span key={i}>{t}</span>
              )
            )}
          </div>
        </div>
        <div className="max-w-[1280px] mx-auto mt-6 pt-5 border-t border-white/5 text-[0.72rem] text-white-dim flex justify-between flex-wrap gap-2">
          <span>
            © 2026 M2M~Inc. PIVOT OS™ · BRIDGE OS™ · Human OS™ are pending
            trademarks.
          </span>
          <Link to="/" className="text-gold no-underline hover:text-gold-light transition-colors">
            model2message.net
          </Link>
        </div>
      </footer>
    </>
  );
}
