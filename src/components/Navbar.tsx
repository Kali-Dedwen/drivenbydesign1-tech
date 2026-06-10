import { Link } from "react-router-dom";
import LanguageToggle from "./LanguageToggle.jsx";

const openCalendly = () => {
  (window as any).Calendly.initPopupWidget({
    url: "https://calendly.com/kevin-m2m",
  });
  return false;
};

const NAV_LINKS = [
  { to: "/pivot-os", label: "PIVOT OS™" },
  { to: "/bridge-os", label: "BRIDGE OS™" },
  { to: "/human-os", label: "Human OS™" },
  { to: "/about", label: "About" },
  { to: "/manifesto", label: "Manifesto" },
];

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center justify-between px-[clamp(1.5rem,5vw,4rem)] bg-navy/[0.92] backdrop-blur-[12px] border-b border-gold/[0.12]">
      <Link to="/" className="font-display text-2xl font-bold text-white no-underline">
        M2M<span className="text-gold">~</span>Inc.
      </Link>
      <div className="hidden lg:flex items-center gap-7">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="text-[0.85rem] font-medium text-white-soft no-underline hover:text-gold transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-3 sm:gap-4">
        <Link
          to="/portal"
          className="bg-gold text-navy text-[0.8rem] font-bold px-5 py-2 rounded-full tracking-[0.03em] hover:brightness-110 hover:scale-[1.02] transition-all no-underline whitespace-nowrap"
        >
          Client Portal →
        </Link>
        <a
          href="/#find-your-os"
          className="bg-gold text-navy text-[0.8rem] font-bold px-5 py-2 rounded-full tracking-[0.03em] hover:brightness-110 hover:scale-[1.02] transition-all no-underline whitespace-nowrap"
        >
          Find Your OS →
        </a>
        <LanguageToggle />
        <button
          onClick={openCalendly}
          className="bg-transparent text-gold text-[0.8rem] font-semibold px-5 py-2 rounded-full tracking-[0.03em] border-[1.5px] border-gold/60 hover:bg-gold/10 transition-colors cursor-pointer"
        >
          Book a Call
        </button>
      </div>
    </nav>
  );
}
