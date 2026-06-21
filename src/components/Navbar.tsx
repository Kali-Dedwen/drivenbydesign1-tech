import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* ── MAIN NAV BAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center justify-between px-[clamp(1rem,5vw,4rem)] bg-navy/[0.92] backdrop-blur-[12px] border-b border-gold/[0.12]">

        {/* Logo */}
        <Link to="/" className="font-display text-2xl font-bold text-white no-underline shrink-0">
          M2M<span className="text-gold">~</span>Inc.
        </Link>

        {/* Desktop nav links */}
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

        {/* Desktop CTAs */}
        <div className="hidden lg:flex items-center gap-3">
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
            className="bg-transparent text-gold text-[0.8rem] font-semibold px-5 py-2 rounded-full tracking-[0.03em] border-[1.5px] border-gold/60 hover:bg-gold/10 transition-colors cursor-pointer whitespace-nowrap"
          >
            Book a Call
          </button>
        </div>

        {/* Mobile right side: Book a Call + hamburger */}
        <div className="flex lg:hidden items-center gap-3">
          <button
            onClick={openCalendly}
            className="bg-gold text-navy text-[0.75rem] font-bold px-4 py-1.5 rounded-full tracking-[0.03em] border-none cursor-pointer whitespace-nowrap"
          >
            Book a Call
          </button>

          {/* Hamburger / X toggle */}
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex flex-col justify-center items-center w-10 h-10 gap-[5px] bg-transparent border-none cursor-pointer p-1 rounded"
          >
            <span
              className={`block w-6 h-[2px] bg-gold rounded-sm transition-all duration-300 origin-center ${
                open ? "rotate-45 translate-y-[7px]" : ""
              }`}
            />
            <span
              className={`block w-6 h-[2px] bg-gold rounded-sm transition-all duration-300 ${
                open ? "opacity-0 scale-x-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-[2px] bg-gold rounded-sm transition-all duration-300 origin-center ${
                open ? "-rotate-45 -translate-y-[7px]" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ── */}
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`lg:hidden fixed inset-0 z-40 bg-navy/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer panel */}
      <div
        className={`lg:hidden fixed top-[72px] left-0 right-0 z-40 bg-[#0A1628] border-b border-gold/[0.15] transition-all duration-300 overflow-hidden ${
          open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 py-6 flex flex-col gap-1">

          {/* Nav links */}
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-[0.95rem] font-medium py-3 px-4 rounded-lg no-underline transition-colors border-b border-white/[0.05] last:border-0 ${
                location.pathname === link.to
                  ? "text-gold bg-gold/[0.07]"
                  : "text-white-soft hover:text-gold hover:bg-gold/[0.05]"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Divider */}
          <div className="h-px bg-gold/[0.12] my-3" />

          {/* Mobile CTAs */}
          <div className="flex flex-col gap-3">
            <Link
              to="/portal"
              className="bg-gold text-navy text-[0.85rem] font-bold py-3 px-6 rounded-full tracking-[0.03em] no-underline text-center hover:brightness-110 transition-all"
            >
              Client Portal →
            </Link>
            <a
              href="/#find-your-os"
              onClick={() => setOpen(false)}
              className="bg-gold/[0.1] text-gold text-[0.85rem] font-bold py-3 px-6 rounded-full tracking-[0.03em] no-underline text-center border border-gold/30 hover:bg-gold/[0.15] transition-all"
            >
              Find Your OS →
            </a>
          </div>

          {/* Language toggle */}
          <div className="flex justify-center mt-4 pb-2">
            <LanguageToggle />
          </div>
        </div>
      </div>
    </>
  );
}
