const STORAGE_KEY = "m2m-lang";

export const translations = {
  en: {
    eyebrow: "The Sovereign Architect Platform",
    headline_prefix: "Built for",
    headline_accent: "Stay Stuck.",
    headline_suffix: "Who Refuse to",
    subheadline:
      "M2M~Inc. is a veteran-owned workforce intelligence firm delivering the Human OS™ platform — a proven system that converts human potential into measurable organizational performance.",
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
    headline_accent: "Quedarse Estancados.",
    headline_suffix: "Que se Niegan a",
    subheadline:
      "M2M~Inc. es una empresa de inteligencia laboral propiedad de veteranos que ofrece la plataforma Human OS™ — un sistema probado que convierte el potencial humano en rendimiento organizacional medible.",
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
    headline_accent: "Rester Bloqués.",
    headline_suffix: "Qui Refusent de",
    subheadline:
      "M2M~Inc. est une entreprise d'intelligence de la main-d'œuvre appartenant à des vétérans, offrant la plateforme Human OS™ — un système éprouvé qui convertit le potentiel humain en performance organisationnelle mesurable.",
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
