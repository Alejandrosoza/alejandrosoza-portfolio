import type { Metadata } from "next";
import { createPublicSupabaseClient } from "@/lib/supabase-server";
import AboutContent from "@/components/sections/AboutContent";
import type { Locale, SiteConfig } from "@/lib/types";
import { normalizeTheatreProductions, sanitizeStringArray } from "@/lib/utils";

export const dynamic = "force-dynamic";

const descriptions: Record<Locale, string> = {
  en: "Learn about Alejandro Soza — a film director based in Whitehorse, Yukon, Canada, with a background in theatre and competitive table tennis.",
  es: "Conoce a Alejandro Soza — un director de cine radicado en Whitehorse, Yukón, Canadá, con experiencia en teatro y tenis de mesa competitivo.",
  fr: "Découvrez Alejandro Soza — un réalisateur basé à Whitehorse, au Yukon, Canada, avec une expérience en théâtre et en tennis de table de compétition.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = (locale as Locale) in descriptions ? (locale as Locale) : "en";

  return {
    title: "About | Alejandro Soza — Film Director",
    description: descriptions[loc],
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = createPublicSupabaseClient();

  const { data: config } = await supabase.from("site_config").select("*").maybeSingle();

  const siteConfig: SiteConfig | null = config
    ? {
        ...(config as SiteConfig),
        theatre_productions: normalizeTheatreProductions(config as SiteConfig),
        theatre_photos: sanitizeStringArray(config.theatre_photos),
        theatre_youtube_ids: sanitizeStringArray(config.theatre_youtube_ids),
        sports_photos: sanitizeStringArray(config.sports_photos),
        sports_youtube_ids: sanitizeStringArray(config.sports_youtube_ids),
      }
    : null;

  return <AboutContent config={siteConfig} locale={locale as Locale} />;
}
