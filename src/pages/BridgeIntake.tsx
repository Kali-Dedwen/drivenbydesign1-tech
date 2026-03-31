import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* ─────────────────────────────────────────────
   M2M~Inc. — BRIDGE OS™ Intake Form
   Employer / SMB Workforce Transition Assessment
   React/TypeScript + Tailwind v4
───────────────────────────────────────────── */

const EMPLOYER_WEBHOOK =
  "https://hook.us2.make.com/6isxh840yu2ouw5qg6pxcca0gfzaruaq";

interface IntakeForm {
  firstName: string;
  lastName: string;
  title: string;
  orgName: string;
  email: string;
  phone: string;
  location: string;
  orgSize: string;
  industry: string;
  transitionType: string;
  affected: string;
  goal: string;
  timeline: string;
  budget: string;
  notes: string;
}

const INITIAL_FORM: IntakeForm = {
  firstName: "",
  lastName: "",
  title: "",
  orgName: "",
  email: "",
  phone: "",
  location: "",
  orgSize: "",
  industry: "",
  transitionType: "",
  affected: "",
  goal: "",
  timeline: "",
  budget: "",
  notes: "",
};

export default function BridgeIntake() {
  const [form, setForm] = useState<IntakeForm>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);

  function update(field: keyof IntakeForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      const params = new URLSearchParams();
      params.append("first_name", form.firstName);
      params.append("last_name", form.lastName);
      params.append("title", form.title);
      params.append("org_name", form.orgName);
      params.append("email", form.email);
      params.append("phone", form.phone);
      params.append("location", form.location);
      params.append("org_size", form.orgSize);
      params.append("industry", form.industry);
      params.append("transition_type", form.transitionType);
      params.append("affected", form.affected);
      params.append("goal", form.goal);
      params.append("timeline", form.timeline);
      params.append("budget", form.budget);
      params.append("notes", form.notes);

      await fetch(EMPLOYER_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
    } catch (err) {
      console.error("BRIDGE OS™ webhook error:", err);
    }

    setSubmitted(true);
  }

  const inputClasses =
    "w-full px-4 py-3 rounded-xl bg-navy-light border border-bridge-border text-white text-sm font-body placeholder:text-white-dim focus:outline-none focus:border-bridge focus:ring-1 focus:ring-bridge transition-colors";
  const labelClasses =
    "block text-[0.75rem] font-mono tracking-[0.1em] text-bridge uppercase mb-2";
  const selectClasses =
    "w-full px-4 py-3 rounded-xl bg-navy-light border border-bridge-border text-white text-sm font-body focus:outline-none focus:border-bridge focus:ring-1 focus:ring-bridge transition-colors appearance-none";

  if (submitted) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center px-6">
        <div className="max-w-lg text-center">
          <div className="w-16 h-16 rounded-full bg-bridge-light flex items-center justify-center mx-auto mb-6">
            <span className="text-bridge text-3xl">✓</span>
          </div>
          <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-black text-white mb-4">
            Assessment <span className="text-bridge">Requested.</span>
          </h2>
          <p className="text-white-soft leading-[1.7] mb-8">
            Your BRIDGE OS™ workforce transition assessment request has been
            submitted. Our team will review your organization's profile and
            reach out within 48 hours to schedule a briefing.
          </p>
          <Link
            to="/bridge-os"
            className="inline-block bg-bridge text-navy text-sm font-bold py-3.5 px-8 rounded-full no-underline hover:brightness-110 hover:scale-[1.02] transition-all"
          >
            Back to BRIDGE OS™
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
      <section className="min-h-screen pt-[120px] pb-20 px-[clamp(1.5rem,5vw,4rem)] bg-[linear-gradient(135deg,#0A1628_0%,#0C1F35_60%,#0A1628_100%)]">
        <div className="max-w-[680px] mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-bridge-light border border-bridge-border px-3.5 py-1.5 rounded-full font-mono text-[0.65rem] tracking-[0.12em] text-bridge uppercase mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-bridge" />
              BRIDGE OS™ Workforce Assessment
            </div>
            <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-black text-white leading-[1.1] mb-4">
              Request a <span className="text-bridge">BRIDGE Assessment.</span>
            </h1>
            <p className="text-white-soft leading-[1.7] max-w-md mx-auto">
              Tell us about your organization and workforce challenge. We'll
              respond within 48 hours with a no-cost gap assessment.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-[linear-gradient(145deg,#0D2045,#1A3560)] border border-bridge/20 rounded-2xl p-8 md:p-10 shadow-[0_0_40px_rgba(72,187,120,0.07)]"
          >
            {/* First Name + Last Name */}
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

            {/* Title + Organization */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className={labelClasses}>Title / Role *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VP of People Operations"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Organization *</label>
                <input
                  type="text"
                  required
                  placeholder="Company or agency name"
                  value={form.orgName}
                  onChange={(e) => update("orgName", e.target.value)}
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
                  placeholder="you@organization.com"
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
                  placeholder="e.g. Healthcare, Government, Finance"
                  value={form.industry}
                  onChange={(e) => update("industry", e.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Org Size + Affected */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className={labelClasses}>Organization Size</label>
                <select
                  value={form.orgSize}
                  onChange={(e) => update("orgSize", e.target.value)}
                  className={selectClasses}
                >
                  <option value="">Select...</option>
                  <option value="1-50">1–50 employees</option>
                  <option value="51-200">51–200 employees</option>
                  <option value="201-1000">201–1,000 employees</option>
                  <option value="1001-5000">1,001–5,000 employees</option>
                  <option value="5000+">5,000+ employees</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}>Employees Affected</label>
                <input
                  type="text"
                  placeholder="e.g. 50, 200, entire division"
                  value={form.affected}
                  onChange={(e) => update("affected", e.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Transition Type */}
            <div className="mb-5">
              <label className={labelClasses}>Transition Type *</label>
              <select
                required
                value={form.transitionType}
                onChange={(e) => update("transitionType", e.target.value)}
                className={selectClasses}
              >
                <option value="">Select one...</option>
                <option value="restructuring">Restructuring / downsizing</option>
                <option value="retention">Retention / turnover</option>
                <option value="veteran-integration">Veteran talent integration</option>
                <option value="manager-readiness">Manager readiness for change</option>
                <option value="reskilling">Reskilling / upskilling workforce</option>
                <option value="community-reentry">Community re-entry / workforce dev</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Goal + Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className={labelClasses}>Primary Goal</label>
                <select
                  value={form.goal}
                  onChange={(e) => update("goal", e.target.value)}
                  className={selectClasses}
                >
                  <option value="">Select...</option>
                  <option value="reduce-turnover">Reduce turnover</option>
                  <option value="transition-support">Workforce transition support</option>
                  <option value="manager-training">Manager readiness training</option>
                  <option value="veteran-onboarding">Veteran onboarding</option>
                  <option value="full-deployment">Full BRIDGE OS™ deployment</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}>Budget Range</label>
                <select
                  value={form.budget}
                  onChange={(e) => update("budget", e.target.value)}
                  className={selectClasses}
                >
                  <option value="">Select...</option>
                  <option value="under-10k">Under $10K</option>
                  <option value="10k-25k">$10K–$25K</option>
                  <option value="25k-50k">$25K–$50K</option>
                  <option value="50k-100k">$50K–$100K</option>
                  <option value="100k+">$100K+</option>
                  <option value="tbd">TBD / Budgeting</option>
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
                <option value="immediate">Immediate — change in progress</option>
                <option value="1-3-months">1–3 months</option>
                <option value="3-6-months">3–6 months</option>
                <option value="planning">Planning / budgeting phase</option>
              </select>
            </div>

            {/* Notes */}
            <div className="mb-8">
              <label className={labelClasses}>Additional Context</label>
              <textarea
                rows={4}
                placeholder="Anything relevant about your organization's workforce situation..."
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                className={`${inputClasses} resize-y`}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-bridge text-navy text-[0.875rem] font-bold py-4 rounded-full border-none cursor-pointer tracking-[0.03em] hover:brightness-110 hover:scale-[1.01] transition-all"
            >
              Request BRIDGE Assessment
            </button>

            <p className="text-center text-[0.72rem] text-white-dim mt-4 leading-normal">
              No-cost workforce transition gap assessment. We'll respond within
              48 hours with initial findings and a scoped engagement proposal.
            </p>
          </form>
        </div>
      </section>

      </main>
      <Footer />
    </>
  );
}
