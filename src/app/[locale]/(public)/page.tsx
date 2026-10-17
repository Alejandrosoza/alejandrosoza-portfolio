import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import HeroSection from "@/components/sections/HeroSection";
import StatementSection from "@/components/sections/StatementSection";
import FeaturedFilms from "@/components/sections/FeaturedFilms";
import type { Film, Locale } from "@/lib/types";

const descriptions: Record<Locale, string> = {
  en: "Alejandro Soza is an emerging film director based in Whitehorse, Yukon, Canada — short films, documentaries, and visual storytelling.",
  es: "Alejandro Soza es un director de cine emergente radicado en Whitehorse, Yukón, Canadá — cortometrajes, documentales y narrativa visual.",
  fr: "Alejandro Soza est un réalisateur émergent basé à Whitehorse, au Yukon, Canada — courts métrages, documentaires et récits visuels.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const description = descriptions[locale as Locale] ?? descriptions.en;

  return {
    title: { absolute: "Alejandro Soza — Film Director" },
    description,
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: films } = await supabase
    .from("films")
    .select("*")
    .eq("featured", true)
    .order("order_index", { ascending: true })
    .limit(6);

  const { data: config } = await supabase
    .from("site_config")
    .select("showreel_youtube_id")
    .single();

  return (
    <>
      <HeroSection showreelId={config?.showreel_youtube_id || ""} locale={locale} />
      <StatementSection />
      <FeaturedFilms films={(films as Film[]) ?? []} locale={locale as Locale} />
    </>
  );
}
