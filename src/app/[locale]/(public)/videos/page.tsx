import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import VideosGrid from "@/components/sections/VideosGrid";
import type { Locale, Video } from "@/lib/types";

const descriptions: Record<Locale, string> = {
  en: "Commercials, music videos, and other directing work by Alejandro Soza.",
  es: "Comerciales, videoclips y otros trabajos de dirección de Alejandro Soza.",
  fr: "Publicités, clips musicaux et autres réalisations d'Alejandro Soza.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = (locale as Locale) in descriptions ? (locale as Locale) : "en";

  return {
    title: "Videos | Alejandro Soza",
    description: descriptions[loc],
  };
}

export default async function VideosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createServerSupabaseClient();
  const t = await getTranslations("video");

  const { data: videos } = await supabase
    .from("videos")
    .select("*")
    .order("order_index", { ascending: true });

  return (
    <div className="min-h-screen">
      <div className="container-film pb-16 pt-40">
        <p className="font-body text-type-label uppercase tracking-[0.5em] text-film-cream/30">
          Work
        </p>
        <h1 className="mt-4 font-heading text-[48px] font-light leading-tight text-film-cream md:text-[80px]">
          {t("title")}
        </h1>
        <p className="mt-3 font-body text-type-ui uppercase tracking-[0.2em] text-film-cream/30">
          {t("subtitle")}
        </p>
        <div className="mt-8 h-px w-full bg-film-gray" />
      </div>

      <VideosGrid videos={(videos as Video[]) ?? []} locale={locale as Locale} />
    </div>
  );
}
