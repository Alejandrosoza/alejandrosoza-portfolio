import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import PhotoGallery from "@/components/sections/PhotoGallery";
import type { Locale, Photo } from "@/lib/types";

const descriptions: Record<Locale, string> = {
  en: "A photography collection by Alejandro Soza — moments from sets, locations, and life behind the camera.",
  es: "Una colección fotográfica de Alejandro Soza — momentos de rodajes, locaciones y la vida detrás de la cámara.",
  fr: "Une collection de photographies d'Alejandro Soza — instants de plateaux, de lieux et de vie derrière la caméra.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = (locale as Locale) in descriptions ? (locale as Locale) : "en";

  return {
    title: "Photography | Alejandro Soza",
    description: descriptions[loc],
  };
}

export default async function PhotographyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createServerSupabaseClient();
  const t = await getTranslations("photography");

  const { data: photos } = await supabase
    .from("photos")
    .select("*")
    .order("order_index", { ascending: true });

  return (
    <div className="min-h-screen">
      <div className="container-film pb-16 pt-40">
        <p className="font-body text-type-label uppercase tracking-[0.5em] text-film-cream/30">
          {t("visualWork")}
        </p>
        <h1 className="mt-4 font-heading text-[48px] font-light leading-tight text-film-cream md:text-[80px]">
          {t("title")}
        </h1>
        <div className="mt-8 h-px w-full bg-film-gray" />
      </div>

      <PhotoGallery photos={(photos as Photo[]) ?? []} locale={locale as Locale} />
    </div>
  );
}
