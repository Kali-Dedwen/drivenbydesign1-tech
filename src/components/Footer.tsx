import { Link } from "react-router-dom";

const FOOTER_LINKS = [
  { to: "/pivot-os", label: "PIVOT OS™" },
  { to: "/bridge-os", label: "BRIDGE OS™" },
  { to: "/human-os", label: "Human OS™" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/manifesto", label: "Manifesto" },
];

export default function Footer() {
  return (
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
      <div className="max-w-[1280px] mx-auto mt-6 pt-5 border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center flex-wrap gap-4">
        <p className="text-[0.72rem] text-white-dim">
          © 2025 M2M~Inc. All rights reserved. SDVOSB · VBE Certified.
        </p>
        <div className="flex gap-6 flex-wrap">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="font-mono text-[0.65rem] text-white-dim/50 hover:text-gold tracking-[0.08em] uppercase transition-colors no-underline"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
