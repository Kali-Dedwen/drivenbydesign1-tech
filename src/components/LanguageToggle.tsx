import { useI18n, type Lang } from "../i18n";

const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  { code: "fr", label: "FR" },
];

export default function LanguageToggle() {
  const { lang, setLang } = useI18n();

  return (
    <div className="flex items-center gap-1 font-mono text-[0.65rem] tracking-[0.08em]">
      {LANGS.map((l, i) => (
        <span key={l.code} className="flex items-center gap-1">
          <button
            onClick={() => setLang(l.code)}
            className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer border-none bg-transparent ${
              lang === l.code
                ? "text-gold font-bold"
                : "text-white-dim hover:text-gold/70"
            }`}
          >
            {l.label}
          </button>
          {i < LANGS.length - 1 && (
            <span className="text-white-dim/30">·</span>
          )}
        </span>
      ))}
    </div>
  );
}
