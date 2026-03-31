import { getCurrentLang, setCurrentLang } from "../lang";

const LANGS = ["en", "es", "fr"];
const LABELS = { en: "EN", es: "ES", fr: "FR" };

export default function LanguageToggle() {
  const lang = getCurrentLang();

  return (
    <div className="flex items-center gap-1 font-mono text-[0.65rem] tracking-[0.08em]">
      {LANGS.map((code, i) => (
        <span key={code} className="flex items-center gap-1">
          <button
            onClick={() => setCurrentLang(code)}
            className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer border-none bg-transparent ${
              lang === code
                ? "text-gold font-bold"
                : "text-white-dim hover:text-gold/70"
            }`}
          >
            {LABELS[code]}
          </button>
          {i < LANGS.length - 1 && (
            <span className="text-white-dim/30">·</span>
          )}
        </span>
      ))}
    </div>
  );
}
