import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

/* ─────────────────────────────────────────────
   M2M~Inc. — PIVOT OS™ Intake Form
   Individual Career Reinvention — Consultation Request
   Converted to React/TypeScript + Tailwind v4
───────────────────────────────────────────── */

// TODO: Replace with Make.com Workflow 1 webhook URL
// Format will be: https://hook.us1.make.com/[your-hook-id]
// Wire this after Workflow 1 Gmail fix is complete
const WEBHOOK_URL = "";

interface IntakeForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currentRole: string;
  transitionGoal: string;
  militaryVeteran: string;
  urgency: string;
  message: string;
}

const INITIAL_FORM: IntakeForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  currentRole: "",
  transitionGoal: "",
  militaryVeteran: "",
  urgency: "",
  message: "",
};

export default function PivotIntake() {
  const [form, setForm] = useState<IntakeForm>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);

  function update(field: keyof IntakeForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // TODO: Replace console.log with POST to Make.com webhook
    // once Workflow 1 Gmail fix is complete
    console.log("PIVOT OS™ Intake Submission:", form);
    console.log("Webhook URL (not wired yet):", WEBHOOK_URL);

    setSubmitted(true);
  }

  const inputClasses =
    "w-full px-4 py-3 rounded-xl bg-navy-light border border-pivot-border text-white text-sm font-body placeholder:text-white-dim focus:outline-none focus:border-pivot focus:ring-1 focus:ring-pivot transition-colors";
  const labelClasses = "block text-[0.75rem] font-mono tracking-[0.1em] text-pivot uppercase mb-2";
  const selectClasses =
    "w-full px-4 py-3 rounded-xl bg-navy-light border border-pivot-border text-white text-sm font-body focus:outline-none focus:border-pivot focus:ring-1 focus:ring-pivot transition-colors appearance-none";

  if (submitted) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center px-6">
        <div className="max-w-lg text-center">
          <div className="w-16 h-16 rounded-full bg-pivot-light flex items-center justify-center mx-auto mb-6">
            <span className="text-pivot text-3xl">✓</span>
          </div>
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-black text-white mb-4">
            Intake <span className="text-pivot">Received.</span>
          </h1>
          <p className="text-white-soft leading-[1.7] mb-8">
            Your PIVOT OS™ intake consultation has been submitted. We'll review
            your information and reach out within 48 hours to schedule your
            45-minute structured session.
          </p>
          <Link
            to="/pivot-os-landing"
            className="inline-block bg-pivot text-white text-sm font-bold py-3.5 px-8 rounded-full no-underline hover:brightness-110 hover:scale-[1.02] transition-all"
          >
            Back to PIVOT OS™
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center justify-between px-[clamp(1.5rem,5vw,4rem)] bg-navy/[0.92] backdrop-blur-[12px] border-b border-pivot-border">
        <Link to="/" className="font-display text-2xl font-bold text-white no-underline">
          M2M<span className="text-gold">~</span>Inc.
        </Link>
        <Link
          to="/pivot-os-landing"
          className="text-[0.8rem] text-white-dim no-underline flex items-center gap-1.5 font-mono tracking-[0.05em] hover:text-pivot transition-colors"
        >
          ← Back to PIVOT OS™
        </Link>
      </nav>

      {/* ── FORM SECTION ── */}
      <section className="min-h-screen pt-[120px] pb-20 px-[clamp(1.5rem,5vw,4rem)] bg-[linear-gradient(135deg,#0A1628_0%,#0B1E3A_60%,#0A1628_100%)]">
        <div className="max-w-[680px] mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-pivot-light border border-pivot-border px-3.5 py-1.5 rounded-full font-mono text-[0.65rem] tracking-[0.12em] text-pivot uppercase mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-pivot" />
              PIVOT OS™ Intake Consultation
            </div>
            <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-black text-white leading-[1.1] mb-4">
              Start Your <span className="text-pivot">Pivot.</span>
            </h1>
            <p className="text-white-soft leading-[1.7] max-w-md mx-auto">
              Complete this intake form to schedule your 45-minute structured
              consultation. No pitch. Just clarity.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-[linear-gradient(145deg,#0D2045,#1A3560)] border border-pivot/20 rounded-2xl p-8 md:p-10 shadow-[0_0_40px_rgba(74,144,217,0.07)]"
          >
            {/* Name row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className={labelClasses}>First Name *</label>
                <input
                  type="text"
                  required
                  placeholder="First name"
                  value={form.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Last Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className={labelClasses}>Email *</label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Phone</label>
                <input
                  type="tel"
                  placeholder="(555) 000-0000"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Current Role */}
            <div className="mb-5">
              <label className={labelClasses}>Current Role / Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Operations Manager"
                value={form.currentRole}
                onChange={(e) => update("currentRole", e.target.value)}
                className={inputClasses}
              />
            </div>

            {/* Transition Goal */}
            <div className="mb-5">
              <label className={labelClasses}>Transition Goal</label>
              <select
                value={form.transitionGoal}
                onChange={(e) => update("transitionGoal", e.target.value)}
                className={selectClasses}
              >
                <option value="">Select one...</option>
                <option value="career-pivot">Career pivot to a new industry</option>
                <option value="role-elevation">Role elevation within current field</option>
                <option value="military-transition">Military to civilian transition</option>
                <option value="entrepreneurship">Launching a business or practice</option>
                <option value="executive-repositioning">Executive repositioning</option>
                <option value="unsure">Not sure yet — need clarity</option>
              </select>
            </div>

            {/* Veteran + Urgency row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className={labelClasses}>Military Veteran?</label>
                <select
                  value={form.militaryVeteran}
                  onChange={(e) => update("militaryVeteran", e.target.value)}
                  className={selectClasses}
                >
                  <option value="">Select...</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="active-duty">Active Duty</option>
                  <option value="reserve">Reserve / Guard</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}>Urgency</label>
                <select
                  value={form.urgency}
                  onChange={(e) => update("urgency", e.target.value)}
                  className={selectClasses}
                >
                  <option value="">Select...</option>
                  <option value="immediate">Immediate — actively transitioning</option>
                  <option value="1-3-months">1–3 months</option>
                  <option value="3-6-months">3–6 months</option>
                  <option value="exploring">Just exploring</option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div className="mb-8">
              <label className={labelClasses}>
                What should we know before your session?
              </label>
              <textarea
                rows={4}
                placeholder="Anything relevant about your situation, goals, or what's not working..."
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                className={`${inputClasses} resize-y`}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-pivot text-white text-[0.875rem] font-bold py-4 rounded-full border-none cursor-pointer tracking-[0.03em] hover:brightness-110 hover:scale-[1.01] transition-all"
            >
              Submit Intake & Schedule Consultation
            </button>

            <p className="text-center text-[0.72rem] text-white-dim mt-4 leading-normal">
              By submitting, you're requesting a 45-minute structured intake
              consultation. No cost. No pitch. Just clarity on your next move.
            </p>
          </form>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#060F1E] py-10 px-[clamp(1.5rem,5vw,4rem)] border-t border-gold/10">
        <div className="max-w-[1280px] mx-auto flex justify-between items-center flex-wrap gap-4">
          <div className="font-display text-[1.1rem] font-bold text-white">
            M2M<span className="text-gold">~</span>Inc. ·{" "}
            <span className="text-pivot text-[0.9em]">PIVOT OS™</span>
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
            © 2026 M2M~Inc. PIVOT OS™ is a pending trademark of M2M~Inc.
          </span>
          <Link to="/" className="text-gold no-underline hover:text-gold-light transition-colors">
            model2message.net
          </Link>
        </div>
      </footer>
    </>
  );
}
