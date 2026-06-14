export const SITE_NAME = "Alejandro Soza";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://alejandrosoza.ca";

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";

export const LOCALES = ["en", "es", "fr"] as const;

export const DEFAULT_LOCALE = "en" as const;

export const FILM_CATEGORIES = [
  {
    value: "short_film",
    label: { en: "Short Film", es: "Cortometraje", fr: "Court-métrage" },
  },
  {
    value: "documentary",
    label: { en: "Documentary", es: "Documental", fr: "Documentaire" },
  },
  {
    value: "narrative",
    label: { en: "Narrative", es: "Narrativo", fr: "Narratif" },
  },
  {
    value: "experimental",
    label: { en: "Experimental", es: "Experimental", fr: "Expérimental" },
  },
] as const;

export const VIDEO_CATEGORIES = [
  {
    value: "commercial",
    label: { en: "Commercial", es: "Comercial", fr: "Commercial" },
  },
  {
    value: "music_video",
    label: { en: "Music Video", es: "Videoclip", fr: "Clip musical" },
  },
  {
    value: "other",
    label: { en: "Other", es: "Otro", fr: "Autre" },
  },
] as const;

export const NAV_LINKS = [
  { href: "/films", label: { en: "Films", es: "Films", fr: "Films" } },
  { href: "/videos", label: { en: "Videos", es: "Videos", fr: "Vidéos" } },
  {
    href: "/photography",
    label: { en: "Photography", es: "Fotografía", fr: "Photographie" },
  },
  { href: "/about", label: { en: "About", es: "Acerca de", fr: "À propos" } },
  { href: "/contact", label: { en: "Contact", es: "Contacto", fr: "Contact" } },
] as const;
