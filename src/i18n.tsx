import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react";

export type Lang = "en" | "es" | "fr";

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const translations: Record<Lang, Record<string, string>> = {
  en: {
    "hero.eyebrow": "The Sovereign Architect Platform",
    "hero.headline.prefix": "Built for",
    "hero.headline.suffix": "Who Refuse to",
    "hero.headline.accent": "Stay Stuck.",
    "hero.sub":
      "M2M~Inc. is a veteran-owned workforce intelligence firm delivering the Human OS™ platform — a proven system that converts human potential into measurable organizational performance.",
    "hero.cta.primary": "Explore the Platform",
    "hero.cta.secondary": "Schedule a Consult",
    "audiences.veterans": "VETERANS",
    "audiences.workforce": "WORKFORCE",
    "audiences.enterprise": "ENTERPRISE",
    "audiences.leaders": "LEADERS",
    "audiences.builders": "BUILDERS",
  },
  es: {
    "hero.eyebrow": "La Plataforma del Arquitecto Soberano",
    "hero.headline.prefix": "Creado para",
    "hero.headline.suffix": "Que se Niegan a",
    "hero.headline.accent": "Quedarse Estancados.",
    "hero.sub":
      "M2M~Inc. es una empresa de inteligencia laboral propiedad de veteranos que ofrece la plataforma Human OS™ — un sistema probado que convierte el potencial humano en rendimiento organizacional medible.",
    "hero.cta.primary": "Explorar la Plataforma",
    "hero.cta.secondary": "Agendar una Consulta",
    "audiences.veterans": "VETERANOS",
    "audiences.workforce": "FUERZA LABORAL",
    "audiences.enterprise": "EMPRESAS",
    "audiences.leaders": "LÍDERES",
    "audiences.builders": "CONSTRUCTORES",
  },
  fr: {
    "hero.eyebrow": "La Plateforme de l'Architecte Souverain",
    "hero.headline.prefix": "Conçu pour",
    "hero.headline.suffix": "Qui Refusent de",
    "hero.headline.accent": "Rester Bloqués.",
    "hero.sub":
      "M2M~Inc. est une entreprise d'intelligence de la main-d'œuvre appartenant à des vétérans, offrant la plateforme Human OS™ — un système éprouvé qui convertit le potentiel humain en performance organisationnelle mesurable.",
    "hero.cta.primary": "Explorer la Plateforme",
    "hero.cta.secondary": "Planifier une Consultation",
    "audiences.veterans": "VÉTÉRANS",
    "audiences.workforce": "MAIN-D'ŒUVRE",
    "audiences.enterprise": "ENTREPRISES",
    "audiences.leaders": "DIRIGEANTS",
    "audiences.builders": "BÂTISSEURS",
  },
};

const STORAGE_KEY = "m2m-lang";

function getInitialLang(): Lang {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "es" || stored === "fr") return stored;
  return "en";
}

const I18nContext = createContext<I18nContextValue>({
  lang: "en",
  setLang: () => {},
  t: (key: string) => key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
    document.documentElement.lang = newLang;
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback(
    (key: string): string => {
      return translations[lang]?.[key] ?? translations.en[key] ?? key;
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
