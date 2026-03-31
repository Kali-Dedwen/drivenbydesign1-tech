import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* ─────────────────────────────────────────────
   M2M~Inc. — PIVOT OS™ Intake Form
   Individual Career Reinvention — Consultation Request
   Converted to React/TypeScript + Tailwind v4
───────────────────────────────────────────── */

const WEBHOOK_URL =
  "https://hook.us2.make.com/8cb4ybsfueyte66krghpes9j8v71b3mx";

interface IntakeForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  situation: string;
  industry: string;
  experience: string;
  goal: string;
  timeline: string;
  notes: string;
}

const INITIAL_FORM: IntakeForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  location: "",
  situation: "",
  industry: "",
  experience: "",
  goal: "",
  timeline: "",
  notes: "",
};

export default function PivotIntake() {
  const [form, setForm] = useState<IntakeForm>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);

  function update(field: keyof IntakeForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          phone: form.phone,
          location: form.location,
          situation: form.situation,
          industry: form.industry,
          experience: form.experience,
          goal: form.goal,
          timeline: form.timeline,
          notes: form.notes,
        }),
      });
    } catch (err) {
      console.error("PIVOT OS™ webhook error:", err);
    }

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
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-black text-white mb-4">
            Intake <span className="text-pivot">Received.</span>
          </h2>
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
      <Navbar />
      <main>

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

            {/* Location + Industry */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className={labelClasses}>Location</label>
                <input
                  type="text"
                  placeholder="City, State"
                  value={form.location}
                  onChange={(e) => update("location", e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Industry</label>
                <input
                  type="text"
                  placeholder="e.g. Financial Services, Defense"
                  value={form.industry}
                  onChange={(e) => update("industry", e.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Situation */}
            <div className="mb-5">
              <label className={labelClasses}>Current Situation *</label>
              <select
                required
                value={form.situation}
                onChange={(e) => update("situation", e.target.value)}
                className={selectClasses}
              >
                <option value="">Select one...</option>
                <option value="employed-seeking-change">Employed — seeking change</option>
                <option value="between-roles">Between roles</option>
                <option value="military-transition">Military to civilian transition</option>
                <option value="recently-separated">Recently separated / laid off</option>
                <option value="entrepreneurship">Launching a business or practice</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Experience + Goal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className={labelClasses}>Years of Experience</label>
                <select
                  value={form.experience}
                  onChange={(e) => update("experience", e.target.value)}
                  className={selectClasses}
                >
                  <option value="">Select...</option>
                  <option value="0-5">0–5 years</option>
                  <option value="5-10">5–10 years</option>
                  <option value="10-15">10–15 years</option>
                  <option value="15-20">15–20 years</option>
                  <option value="20+">20+ years</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}>Transition Goal</label>
                <select
                  value={form.goal}
                  onChange={(e) => update("goal", e.target.value)}
                  className={selectClasses}
                >
                  <option value="">Select...</option>
                  <option value="career-pivot">Career pivot to a new industry</option>
                  <option value="role-elevation">Role elevation within current field</option>
                  <option value="executive-repositioning">Executive repositioning</option>
                  <option value="entrepreneurship">Launching a business or practice</option>
                  <option value="unsure">Not sure yet — need clarity</option>
                </select>
              </div>
            </div>

            {/* Timeline */}
            <div className="mb-5">
              <label className={labelClasses}>Timeline</label>
              <select
                value={form.timeline}
                onChange={(e) => update("timeline", e.target.value)}
                className={selectClasses}
              >
                <option value="">Select...</option>
                <option value="immediate">Immediate — actively transitioning</option>
                <option value="1-3-months">1–3 months</option>
                <option value="3-6-months">3–6 months</option>
                <option value="6-12-months">6–12 months</option>
                <option value="exploring">Just exploring</option>
              </select>
            </div>

            {/* Notes */}
            <div className="mb-8">
              <label className={labelClasses}>
                Additional Notes
              </label>
              <textarea
                rows={4}
                placeholder="Anything relevant about your situation, goals, or what's not working..."
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
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

      </main>
      <Footer />
    </>
  );
}
