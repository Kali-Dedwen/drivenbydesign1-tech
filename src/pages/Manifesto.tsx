import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* ─────────────────────────────────────────────
   M2M~Inc. — The Manifesto
   "The Ground Is Moving."
   Converted to React/TypeScript + Tailwind v4
───────────────────────────────────────────── */

const openCalendly = () => {
  (window as any).Calendly.initPopupWidget({
    url: "https://calendly.com/kevin-m2m",
  });
  return false;
};

const CHAPTERS = [
  { id: "chapter-1", label: "I. Problem" },
  { id: "chapter-2", label: "II. Sovereign" },
  { id: "chapter-3", label: "III. Model" },
  { id: "chapter-4", label: "IV. Systems" },
  { id: "chapter-5", label: "V. Principles" },
  { id: "chapter-6", label: "VI. The Call" },
];

const PRINCIPLES = [
  { num: "01", title: "Dignity is non-negotiable.", body: "Every person who passes through a workforce transition deserves to arrive on the other side with their dignity intact. We will not participate in processes that treat people as liabilities." },
  { num: "02", title: "Identity before strategy.", body: "No strategy works without a stable identity beneath it. We build the internal architecture before we deploy the external approach. Always." },
  { num: "03", title: "The ground is always moving.", body: "Stability is not the goal. Sovereign agility is. We do not help people find solid ground — we help them learn to operate with authority on shifting terrain." },
  { num: "04", title: "Expertise is not obsolete — it is untranslated.", body: "We believe in the model. The decades of experience, wisdom, and capability that displaced professionals carry are not irrelevant. They are waiting for the right language." },
  { num: "05", title: "Institutions are people at scale.", body: "Every organizational problem is a human problem expressed at volume. We never lose sight of the individual inside the institution." },
  { num: "06", title: "Speed without clarity is just faster chaos.", body: "We move with deliberate speed. Not slow. Not reckless. We establish the architecture first and then execute with velocity." },
  { num: "07", title: "Veteran discipline. Entrepreneurial urgency.", body: "We bring military-grade operational discipline to every engagement — and the urgency of an entrepreneur who knows time is a resource, not a given." },
  { num: "08", title: "Customer dignity before code.", body: "Our automation philosophy: technology serves the human, not the other way around. Every system we build is designed to protect and amplify human dignity, not replace it." },
  { num: "09", title: "Representation is a strategic asset.", body: "As a veteran-owned firm, we understand what it means to build institutional authority from the outside in — to earn trust in rooms that weren't expecting you, and to lead with competence where others lead with credentials. That understanding is not incidental to our work. It is the foundation of it." },
  { num: "10", title: "To the work.", body: "We close every engagement, every email, every session, every chapter with the same commitment: not to the outcome, not to the process, but to the work itself. The work is sovereign. The work is enough." },
];

const OS_CARDS = [
  {
    lane: "Lane 01",
    label: "Individual · Career Reinvention",
    name: "PIVOT OS™",
    body: "Built for the workforce-displaced professional who needs more than a job search. PIVOT OS™ is a five-module identity and strategy framework — Purpose, Identity, Vision, Orientation, Traction — that rebuilds the internal architecture before deploying the external strategy. It is the operating system for the sovereign individual.",
  },
  {
    lane: "Lane 02",
    label: "Employer / SMB · Workforce Transition",
    name: "BRIDGE OS™",
    body: "Built for the employer or SMB managing workforce change — reductions, restructuring, upskilling, or merger integration. BRIDGE OS™ is a three-phase architecture — Assess, Align, Advance — that executes workforce transition with dignity, precision, and institutional confidence. It protects your people, your culture, and your organization's reputation simultaneously.",
  },
  {
    lane: "Lane 03",
    label: "Enterprise / Government · Institutional Scale",
    name: "Human OS™",
    body: "Built for the enterprise or government institution managing workforce transformation at scale — across divisions, agencies, geographies, and generations. Human OS™ is a three-phase sovereign protocol — Architect, Deploy, Sustain — that treats the workforce as a designed system rather than a managed cost. It is the operating system for permanent institutional authority.",
  },
];

function PullQuote({ children }: { children: string }) {
  return (
    <blockquote className="font-display text-[1.75rem] italic leading-[1.3] text-navy border-l-[3px] border-gold pl-6 my-10">
      {children}
    </blockquote>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-body text-[1.125rem] leading-[1.85] text-ink-muted mb-6 max-w-[68ch]">
      {children}
    </p>
  );
}

export default function Manifesto() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setProgress((window.scrollY / docHeight) * 100);
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Reading progress bar */}
      <div
        className="fixed top-0 left-0 h-0.5 bg-gold z-[100] transition-[width] duration-100 ease-linear"
        style={{ width: `${progress}%` }}
      />

      <Navbar />
      <main>

      {/* ── MANIFESTO COVER ── */}
      <section className="bg-navy bg-[radial-gradient(circle,rgba(10,22,40,0.055)_1px,transparent_1px)] bg-[length:28px_28px] min-h-[70vh] flex flex-col justify-end px-8 pb-20 pt-32">
        <div className="max-w-[1280px] mx-auto w-full">
          <div className="max-w-4xl">
            <p className="font-mono text-[10px] text-gold/50 tracking-[0.3em] uppercase mb-8 animate-[fade-in-up_0.7s_ease_forwards]">
              M2M~Inc. · Official Doctrine · Est. 2024
            </p>
            <h1 className="font-display text-6xl md:text-8xl lg:text-[9rem] text-white leading-[0.95] tracking-tight mb-10 animate-[fade-in-up_0.7s_ease_forwards]">
              The Ground
              <br />
              <span className="italic text-gold">Is Moving.</span>
            </h1>
            <p className="font-body text-xl text-white/50 max-w-2xl leading-relaxed mb-12 animate-[fade-in-up_0.7s_ease_forwards]">
              A sovereign framework for workforce transformation. Written for the
              individual who has been displaced, the employer who must lead through
              disruption, and the institution that must outlast them both.
            </p>
            <div className="flex items-center gap-6 animate-[fade-in-up_0.7s_ease_forwards]">
              <span className="h-px w-10 bg-gold block" />
              <p className="font-mono text-[10px] text-gold/60 tracking-[0.1em] uppercase">
                Dr. Kevin A. Smith, Hon. D.H.L. · Founder, M2M~Inc.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── MANIFESTO BODY ── */}
      <article className="max-w-[1280px] mx-auto px-8 py-24 bg-cream">
        <div className="max-w-2xl mx-auto lg:mx-0 lg:ml-48">

          {/* ─── CHAPTER I ─── */}
          <div id="chapter-1" className="mb-24 scroll-mt-24">
            <div className="mb-10">
              <p className="font-mono text-[0.625rem] tracking-[0.3em] uppercase text-gold mb-3">Chapter I</p>
              <h2 className="font-display text-4xl md:text-5xl text-navy leading-tight">
                The Problem
                <br />
                with Transition.
              </h2>
              <div className="w-10 h-px bg-gold mt-6" />
            </div>

            <Prose>
              Most frameworks for workforce transition are built around{" "}
              <strong className="text-ink font-bold">speed, not dignity.</strong> They
              are designed to move people out of organizations as quickly and as cheaply
              as possible — as if the human being on the other end of the process is a
              line item to be resolved rather than a sovereign individual whose
              trajectory deserves institutional respect.
            </Prose>
            <Prose>
              The outplacement industry offers résumé services. HR departments offer
              severance packages and legal compliance checklists. Career coaches offer
              affirmations and LinkedIn tips. None of it addresses the actual problem.
            </Prose>
            <PullQuote>
              "The problem is not unemployment. The problem is the collapse of identity
              that unemployment triggers."
            </PullQuote>
            <Prose>
              When a person loses their role — whether through layoff, restructuring, or
              the slow erosion of relevance — they do not simply lose income. They lose
              the story they told about themselves. They lose the structure that gave
              their days meaning. They lose the professional identity that took decades
              to build. And most transition frameworks treat that loss as a logistics
              problem when it is, in fact, an architectural one.
            </Prose>
            <Prose>
              The same is true at the organizational level. Employers who manage
              workforce transitions poorly do not simply lose good people — they lose
              institutional trust. They damage the loyalty of the employees who remain.
              They undermine the culture they spent years constructing. And they do all
              of this while trying to maintain operational velocity, meet compliance
              requirements, and preserve shareholder confidence simultaneously.
            </Prose>
            <Prose>
              The system is broken not because people don't care. It is broken because{" "}
              <strong className="text-ink font-bold">
                the wrong tools are being applied to the wrong problem.
              </strong>{" "}
              What looks like a talent problem is actually an identity problem. What
              looks like an HR problem is actually an architecture problem. What looks
              like a cost problem is actually a dignity problem in disguise.
            </Prose>
            <Prose>M2M~Inc. was founded to build the right tools.</Prose>
          </div>

          {/* ─── CHAPTER II ─── */}
          <div id="chapter-2" className="mb-24 scroll-mt-24">
            <div className="mb-10">
              <p className="font-mono text-[0.625rem] tracking-[0.3em] uppercase text-gold mb-3">Chapter II</p>
              <h2 className="font-display text-4xl md:text-5xl text-navy leading-tight">
                The Sovereign
                <br />
                Professional.
              </h2>
              <div className="w-10 h-px bg-gold mt-6" />
            </div>

            <Prose>
              There is a word we use at M2M~Inc. that makes some people uncomfortable:{" "}
              <strong className="text-ink font-bold">sovereign.</strong>
            </Prose>
            <Prose>
              We use it deliberately. Sovereignty means self-governance. It means
              operating from a position of internal authority rather than external
              validation. It means making decisions from a place of clarity rather than
              desperation. And in the context of workforce transition — where the ground
              beneath you is shifting in real time — sovereignty is not a luxury. It is
              a survival architecture.
            </Prose>
            <PullQuote>
              "The sovereign professional does not wait for the institution to define
              them. They arrive already defined."
            </PullQuote>
            <Prose>
              The sovereign professional is not arrogant. They are not unaffected by
              disruption. They feel the weight of transition as acutely as anyone. But
              they have built an internal operating system — a framework of identity,
              values, and strategic clarity — that remains stable even when the external
              structure collapses.
            </Prose>
            <Prose>
              This is what we are building when we build PIVOT OS™. Not a job search
              strategy. Not a personal brand. Not a résumé. We are building the internal
              architecture that makes all of those things possible — and meaningful.
            </Prose>
            <Prose>
              Purpose. Identity. Vision. Orientation. Traction. These are not
              motivational concepts. They are{" "}
              <strong className="text-ink font-bold">structural components.</strong>{" "}
              When all five are in alignment, a person does not simply find a new job.
              They architect a new trajectory. They move with deliberate speed rather
              than reactive panic. They show up to every opportunity from a position of
              sovereign authority rather than unemployed desperation.
            </Prose>
            <Prose>That is the difference between a transition and a PIVOT.</Prose>
          </div>

          {/* ─── CHAPTER III ─── */}
          <div id="chapter-3" className="mb-24 scroll-mt-24">
            <div className="mb-10">
              <p className="font-mono text-[0.625rem] tracking-[0.3em] uppercase text-gold mb-3">Chapter III</p>
              <h2 className="font-display text-4xl md:text-5xl text-navy leading-tight">
                Model to Message.
                <br />
                <span className="italic">The Core Doctrine.</span>
              </h2>
              <div className="w-10 h-px bg-gold mt-6" />
            </div>

            <Prose>The name M2M~Inc. is not a brand. It is a doctrine.</Prose>
            <Prose>
              <strong className="text-ink font-bold">Model to Message</strong> describes
              the fundamental transformation we facilitate. Every person who comes to us
              carries a model — a body of expertise, experience, wisdom, and capability
              built over years or decades of professional life. That model has enormous
              value. But value that cannot be communicated is value that cannot be
              deployed.
            </Prose>
            <PullQuote>
              "You are not starting over. You are translating."
            </PullQuote>
            <Prose>
              The workforce displacement crisis is, at its core, a translation crisis.
              Experienced professionals who were displaced by automation, restructuring,
              or shifting industry dynamics often carry more relevant capability than the
              market currently recognizes — because they have not yet learned to speak
              the language of the new landscape.
            </Prose>
            <Prose>
              Model to Message is the translation protocol. It is the process of taking
              what you know — your model — and expressing it in the language, format, and
              channels that the current market can receive. It is not reinvention. It is{" "}
              <strong className="text-ink font-bold">articulation.</strong>
            </Prose>
            <Prose>
              This is why we work differently than traditional career services. We do not
              ask you to become someone else. We ask you to become more fluent in who you
              already are. We build the communication architecture — the message — that
              allows your model to be seen, valued, and deployed in the context that is
              calling for it right now.
            </Prose>
            <Prose>
              At the organizational level, Model to Message means something different but
              equally precise: it means aligning what an institution does with what it
              communicates to the workforce it is trying to retain, transition, or
              recruit. The gap between an organization's actual values and its
              communicated practices is where talent hemorrhages. Closing that gap is
              what BRIDGE OS™ is built to do.
            </Prose>
          </div>

          {/* ─── CHAPTER IV ─── */}
          <div id="chapter-4" className="mb-24 scroll-mt-24">
            <div className="mb-10">
              <p className="font-mono text-[0.625rem] tracking-[0.3em] uppercase text-gold mb-3">Chapter IV</p>
              <h2 className="font-display text-4xl md:text-5xl text-navy leading-tight">
                The Three
                <br />
                Operating Systems.
              </h2>
              <div className="w-10 h-px bg-gold mt-6" />
            </div>

            <Prose>
              M2M~Inc. operates through three sovereign platforms. They are not separate
              products. They are three expressions of the same doctrine — applied at
              different scales of complexity.
            </Prose>

            <div className="space-y-6 my-12">
              {OS_CARDS.map((os) => (
                <div
                  key={os.name}
                  className="border border-[#C5C6CD]/30 bg-cream p-8"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-mono text-[10px] text-gold tracking-[0.1em] uppercase mb-1">
                        {os.label}
                      </p>
                      <h3 className="font-display text-3xl text-navy">{os.name}</h3>
                    </div>
                    <span className="font-mono text-[10px] text-ink-muted/20 tracking-[0.1em] uppercase">
                      {os.lane}
                    </span>
                  </div>
                  <p className="font-body text-sm text-ink-muted leading-relaxed">
                    {os.body}
                  </p>
                </div>
              ))}
            </div>

            <Prose>
              Three platforms. One doctrine. The individual, the employer, and the
              institution are not separate problems — they are three nodes in the same
              system. When all three are operating with sovereign clarity, the workforce
              ecosystem heals itself.
            </Prose>
          </div>

          {/* ─── CHAPTER V ─── */}
          <div id="chapter-5" className="mb-24 scroll-mt-24">
            <div className="mb-10">
              <p className="font-mono text-[0.625rem] tracking-[0.3em] uppercase text-gold mb-3">Chapter V</p>
              <h2 className="font-display text-4xl md:text-5xl text-navy leading-tight">
                What We Believe.
                <br />
                <span className="italic">Ten Principles.</span>
              </h2>
              <div className="w-10 h-px bg-gold mt-6" />
            </div>

            <Prose>
              These are not values statements. They are operational commitments. Every
              engagement, every platform, every conversation at M2M~Inc. is governed by
              these ten principles.
            </Prose>

            <div className="space-y-5 mt-10">
              {PRINCIPLES.map((p) => (
                <div
                  key={p.num}
                  className="border-l-2 border-gold/30 hover:border-gold p-6 pl-8 bg-cream transition-all"
                >
                  <p className="font-mono text-[10px] text-gold tracking-[0.1em] uppercase mb-2">
                    Principle {p.num}
                  </p>
                  <h4 className="font-display text-xl text-navy mb-2">{p.title}</h4>
                  <p className="font-body text-sm text-ink-muted leading-relaxed">
                    {p.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ─── CHAPTER VI ─── */}
          <div id="chapter-6" className="mb-24 scroll-mt-24">
            <div className="mb-10">
              <p className="font-mono text-[0.625rem] tracking-[0.3em] uppercase text-gold mb-3">Chapter VI</p>
              <h2 className="font-display text-4xl md:text-5xl text-navy leading-tight">
                The Call.
              </h2>
              <div className="w-10 h-px bg-gold mt-6" />
            </div>

            <Prose>
              If you have read this far, something in this document has spoken to
              something in you.
            </Prose>
            <Prose>
              Maybe you are the professional who has been displaced — who felt the ground
              shift beneath your career and is still trying to find your footing. We see
              you. The model you carry is not obsolete. It is waiting for the right
              architecture.
            </Prose>
            <Prose>
              Maybe you are the employer — the HR director or the operations leader or
              the CEO who knows that the transition you are managing deserves to be done
              better than industry standard. That instinct is correct. Your people
              deserve the BRIDGE OS™ framework.
            </Prose>
            <Prose>
              Maybe you are the institution — the agency director or the CHRO or the
              transformation officer who is staring at the scale of change ahead and
              knows that the tools you have are not adequate to the task. Human OS™ was
              built for exactly this moment.
            </Prose>
            <PullQuote>
              "The ground is moving. That is not a threat. It is an invitation."
            </PullQuote>
            <Prose>
              The institutions and individuals who will define the next decade of
              American workforce history are not the ones who find stable ground. They
              are the ones who learn to architect sovereign systems that operate with
              authority on unstable terrain.
            </Prose>
            <Prose>That is what we build at M2M~Inc.</Prose>
            <Prose>
              The question is not whether the ground is moving. It is. The question is
              whether you will be moved by it — or whether you will move with it.
            </Prose>
            <p className="font-display text-2xl italic text-navy mt-12">
              To the work.
            </p>
            <p className="font-mono text-[10px] text-ink-muted tracking-[0.1em] uppercase mt-2">
              — Dr. Kevin A. Smith, Founder · M2M~Inc.
            </p>
          </div>
        </div>
      </article>

      {/* ── CLOSING CTA ── */}
      <section className="bg-navy py-24 px-8 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="font-mono text-[10px] text-gold/50 tracking-[0.3em] uppercase mb-6">
            Begin Your Engagement
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-white mb-6 leading-tight">
            The Ground Is Moving.
            <br />
            <span className="italic text-gold">Let's Move With It.</span>
          </h2>
          <p className="font-body text-white/50 mb-12 leading-relaxed">
            Tell us where you are and we will tell you exactly which operating
            system fits your situation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/pivot-intake"
              className="bg-gold text-navy px-10 py-4 font-body font-bold text-sm tracking-[0.1em] uppercase no-underline hover:bg-gold-dim transition-colors"
            >
              Start Your PIVOT →
            </Link>
            <button
              onClick={openCalendly}
              className="border border-white/20 text-white px-10 py-4 font-body font-bold text-sm tracking-[0.1em] uppercase hover:bg-white/5 transition-colors cursor-pointer bg-transparent"
            >
              Book a Discovery Call
            </button>
          </div>
        </div>
      </section>

      </main>
      <Footer />
    </>
  );
}
