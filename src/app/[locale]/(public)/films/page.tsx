import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import FilmsGrid from "@/components/sections/FilmsGrid";
import type { Film, Locale } from "@/lib/types";

const pageTitles: Record<Locale, string> = {
  en: "Films",
  es: "Películas",
  fr: "Films",
};

const descriptions: Record<Locale, string> = {
  en: "A collection of short films, documentaries, and narrative work directed by Alejandro Soza.",
  es: "Una colección de cortometrajes, documentales y trabajo narrativo dirigido por Alejandro Soza.",
  fr: "Une collection de courts métrages, documentaires et œuvres narratives réalisés par Alejandro Soza.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = (locale as Locale) in pageTitles ? (locale as Locale) : "en";

  return {
    title: pageTitles[loc],
    description: descriptions[loc],
  };
}

export default async function FilmsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: films } = await supabase
    .from("films")
    .select("*")
    .order("order_index", { ascending: true });

  return (
    <div className="min-h-screen">
      <div className="container-film pb-20 pt-40">
        <p className="font-body text-[9px] uppercase tracking-[0.5em] text-film-cream/30">
          Portfolio
        </p>
        <h1 className="mt-4 font-heading text-[48px] font-light leading-tight text-film-cream md:text-[80px]">
          Films
        </h1>
      </div>

      <FilmsGrid films={(films as Film[]) ?? []} locale={locale as Locale} />
    </div>
  );
}
