import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Accessibility() {
  return (
    <>
      <Navbar />
      <main>

      <section className="min-h-screen pt-[120px] pb-24 px-[clamp(1.5rem,5vw,4rem)] bg-navy">
        <div className="max-w-[720px] mx-auto">
          <p className="font-mono text-[0.68rem] tracking-[0.18em] text-gold uppercase mb-4 flex items-center gap-3 before:block before:w-[3px] before:h-9 before:bg-gold before:rounded-sm">
            Accessibility
          </p>
          <h1 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-black text-white leading-[1.1] mb-8 tracking-tight">
            Accessibility Statement
          </h1>

          <div className="space-y-6 text-white-soft leading-[1.8] text-base">
            <p>
              M2M~Inc. is committed to ensuring digital accessibility for people
              with disabilities. We are continually improving the user experience
              for everyone and applying the relevant accessibility standards.
            </p>

            <h2 className="font-display text-2xl font-bold text-white pt-4">
              Conformance Status
            </h2>
            <p>
              We aim to conform to the{" "}
              <strong className="text-white">
                Web Content Accessibility Guidelines (WCAG) 2.1 Level AA
              </strong>
              . These guidelines explain how to make web content more accessible
              to people with a wide range of disabilities, including visual,
              auditory, physical, speech, cognitive, language, learning, and
              neurological disabilities.
            </p>

            <h2 className="font-display text-2xl font-bold text-white pt-4">
              Measures Taken
            </h2>
            <p>M2M~Inc. takes the following measures to ensure accessibility:</p>
            <ul className="list-none space-y-2 ml-0">
              {[
                "Semantic HTML structure with proper heading hierarchy",
                "ARIA landmarks for navigation, main content, and footer regions",
                "Keyboard-navigable interactive elements",
                "Sufficient color contrast ratios for text and interactive elements",
                "Responsive design that supports browser zoom up to 200%",
                "Form labels and error messages associated with their controls",
                "Alt text for meaningful images",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-gold shrink-0 mt-1">✦</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h2 className="font-display text-2xl font-bold text-white pt-4">
              Known Limitations
            </h2>
            <p>
              While we strive for full WCAG 2.1 AA compliance, some legacy page
              components are in the process of being updated. We are actively
              working to address any remaining gaps.
            </p>

            <h2 className="font-display text-2xl font-bold text-white pt-4">
              Feedback & Accommodation Requests
            </h2>
            <p>
              We welcome your feedback on the accessibility of model2message.net.
              If you encounter any accessibility barriers or need accommodations,
              please contact us:
            </p>
            <div className="bg-gold/5 border border-gold/15 rounded-xl p-6 mt-2">
              <p className="font-mono text-[0.65rem] tracking-[0.1em] text-gold uppercase mb-2">
                Accessibility Contact
              </p>
              <p className="text-white font-medium">
                <a
                  href="mailto:info@model2message.net"
                  className="text-gold no-underline hover:underline"
                >
                  info@model2message.net
                </a>
              </p>
              <p className="text-white-dim text-sm mt-1">
                M2M~Inc. · Winston-Salem, NC
              </p>
            </div>
            <p>
              We aim to respond to accessibility feedback within 5 business days
              and to propose a solution within 10 business days.
            </p>

            <h2 className="font-display text-2xl font-bold text-white pt-4">
              Certification
            </h2>
            <p>
              M2M~Inc. is a Service-Disabled Veteran-Owned Small Business
              (SDVOSB) and Veteran Business Enterprise (VBE). We are committed to
              serving all members of the community, including those with
              disabilities, with the same dignity and respect that defines
              everything we build.
            </p>

            <p className="text-white-dim text-sm pt-6 border-t border-white/5 mt-8">
              This statement was last updated on March 31, 2026.
            </p>
          </div>

          <div className="mt-12">
            <Link
              to="/"
              className="text-gold no-underline hover:text-gold-light transition-colors font-mono text-[0.75rem] tracking-[0.08em] uppercase"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>

      </main>
      <Footer />
    </>
  );
}
