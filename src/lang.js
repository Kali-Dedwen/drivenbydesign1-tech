const STORAGE_KEY = "m2m-lang";

export const translations = {
  en: {
    eyebrow: "The Sovereign Architect Platform",
    headline_prefix: "Built for",
    headline_accent: "someone else to fix it.",
    headline_suffix: "done waiting for",
    subheadline:
      "M2M~Inc. is a veteran-owned firm that helps people and organizations get more from who they already have. The Human OS™ platform is how — a system built in the field, with results you can measure.",
    cta_primary: "Explore the Platform",
    cta_secondary: "Schedule a Consult",
    audience_1: "VETERANS",
    audience_2: "WORKFORCE",
    audience_3: "ENTERPRISE",
    audience_4: "LEADERS",
  },
  es: {
    eyebrow: "La Plataforma del Arquitecto Soberano",
    headline_prefix: "Creado para",
    headline_accent: "que otro lo arregle.",
    headline_suffix: "que ya no esperan",
    subheadline:
      "M2M~Inc. es una empresa propiedad de veteranos que ayuda a personas y organizaciones a sacar más de lo que ya tienen. La plataforma Human OS™ es cómo lo hacemos — un sistema probado en el terreno, con resultados que se pueden medir.",
    cta_primary: "Explorar la Plataforma",
    cta_secondary: "Agendar una Consulta",
    audience_1: "VETERANOS",
    audience_2: "FUERZA LABORAL",
    audience_3: "EMPRESAS",
    audience_4: "LÍDERES",
  },
  fr: {
    eyebrow: "La Plateforme de l'Architecte Souverain",
    headline_prefix: "Conçu pour",
    headline_accent: "que quelqu'un d'autre règle ça.",
    headline_suffix: "qui n'attendent plus",
    subheadline:
      "M2M~Inc. est une entreprise détenue par des vétérans qui aide les personnes et les organisations à tirer davantage de ce qu'elles ont déjà. La plateforme Human OS™, c'est notre façon de le faire — un système éprouvé sur le terrain, avec des résultats mesurables.",
    cta_primary: "Explorer la Plateforme",
    cta_secondary: "Planifier une Consultation",
    audience_1: "VÉTÉRANS",
    audience_2: "MAIN-D'ŒUVRE",
    audience_3: "ENTREPRISES",
    audience_4: "DIRIGEANTS",
  },
};

export function getCurrentLang() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "es" || stored === "fr") return stored;
  return "en";
}

export function setCurrentLang(lang) {
  localStorage.setItem(STORAGE_KEY, lang);
  window.location.reload();
}
