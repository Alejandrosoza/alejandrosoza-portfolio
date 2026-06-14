import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { getCloudinaryUrl } from "@/lib/cloudinary-url";
import { localized } from "@/lib/utils";
import { FILM_CATEGORIES } from "@/lib/constants";
import YouTubeEmbed from "@/components/ui/YouTubeEmbed";
import JsonLd from "@/components/ui/JsonLd";
import { filmSchema } from "@/lib/schema";
import type { Film, Locale } from "@/lib/types";

interface FilmDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  try {
    const supabase = createClient();
    const { data } = await supabase.from("films").select("slug");
    return (data ?? []).map((film) => ({ slug: film.slug as string }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: FilmDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: film } = await supabase
    .from("films")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!film) return {};

  const loc = locale as Locale;
  const title = localized(film, "title", loc);
  const synopsis = localized(film, "synopsis", loc);

  return {
    title,
    description: synopsis || undefined,
  };
}

export default async function FilmDetailPage({ params }: FilmDetailPageProps) {
  const { locale, slug } = await params;
  const loc = locale as Locale;
  const supabase = await createServerSupabaseClient();

  const { data: film } = await supabase
    .from("films")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!film) {
    notFound();
  }

  const typedFilm = film as Film;

  const { data: nextFilm } = await supabase
    .from("films")
    .select("slug, title_en, title_es, title_fr")
    .gt("order_index", typedFilm.order_index)
    .order("order_index", { ascending: true })
    .limit(1)
    .maybeSingle();

  const t = await getTranslations("film");

  const title = localized(typedFilm, "title", loc);
  const role = localized(typedFilm, "role", loc);
  const synopsis = localized(typedFilm, "synopsis", loc);
  const statement = localized(typedFilm, "statement", loc);
  const category = FILM_CATEGORIES.find((c) => c.value === typedFilm.category)?.label[loc];
  const monthName = typedFilm.month
    ? new Date(2000, typedFilm.month - 1).toLocaleDateString(loc, { month: "long" })
    : null;

  return (
    <div className="min-h-screen">
      <JsonLd data={filmSchema(typedFilm)} />

      {/* Section A — Video hero */}
      <YouTubeEmbed youtubeId={typedFilm.youtube_id} title={title} />

      {/* Section B — Title block */}
      <div className="container-film border-b border-film-gray pb-8 pt-12">
        <Link
          href={`/${locale}/films`}
          className="font-body text-type-label uppercase tracking-[0.3em] text-film-cream/40 transition-colors duration-300 hover:text-film-cream"
        >
          {t("backToFilms")}
        </Link>

        <p className="mt-6 font-body text-type-label uppercase tracking-[0.4em] text-film-gold">
          {category}
        </p>

        <h1 className="mt-2 font-heading text-[36px] font-light leading-tight text-film-cream md:text-[64px]">
          {title}
        </h1>

        <div className="mt-4 flex flex-wrap gap-6">
          <MetaItem label={t("year")} value={String(typedFilm.year)} />
          {role && <MetaItem label={t("role")} value={role} />}
          {typedFilm.runtime_minutes && (
            <MetaItem label={t("runtime")} value={`${typedFilm.runtime_minutes} MIN`} />
          )}
          {category && <MetaItem label={t("category")} value={category} />}
        </div>
      </div>

      {/* Section C — Main content */}
      <div className="container-film flex flex-col gap-12 pb-12 lg:flex-row lg:gap-16">
        {/* Left column */}
        <div className="lg:w-[60%]">
          {/* Synopsis */}
          <div className="pt-12">
            <div className="flex items-center gap-4">
              <span className="font-body text-type-label uppercase tracking-[0.4em] text-film-cream/30">
                {t("synopsis")}
              </span>
              <span className="h-px w-10 bg-film-gold" />
            </div>
            {synopsis && (
              <p className="mt-4 max-w-[560px] font-body text-type-copy leading-[1.8] text-film-cream/70">
                {synopsis}
              </p>
            )}
          </div>

          {/* Director's statement */}
          {statement && (
            <div className="pt-10">
              <div className="flex items-center gap-4">
                <span className="font-body text-type-label uppercase tracking-[0.4em] text-film-cream/30">
                  {t("directorStatement")}
                </span>
                <span className="h-px w-10 bg-film-gold" />
              </div>
              <p className="mt-4 font-heading text-xl italic leading-[1.7] text-film-cream/80">
                {statement}
              </p>
            </div>
          )}

          {/* Credits */}
          {typedFilm.credits && (
            <div className="pb-12 pt-10">
              <div className="flex items-center gap-4">
                <span className="font-body text-type-label uppercase tracking-[0.4em] text-film-cream/30">
                  {t("credits")}
                </span>
                <span className="h-px w-10 bg-film-gold" />
              </div>
              <p className="mt-4 whitespace-pre-line font-body text-type-nav leading-[2] text-film-cream/50">
                {typedFilm.credits}
              </p>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="pt-12 lg:w-[40%]">
          {typedFilm.tags.length > 0 && (
            <div className="mb-8 flex flex-wrap gap-2">
              {typedFilm.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-film-gray px-3 py-1 font-body text-type-label uppercase tracking-[0.2em] text-film-cream/40"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="border border-film-gray p-6">
            <p className="mb-4 font-body text-type-label uppercase tracking-[0.4em] text-film-cream/20">
              {t("filmDetails")}
            </p>
            <div className="flex flex-col gap-3">
              <DetailRow label={t("year")} value={String(typedFilm.year)} />
              {monthName && <DetailRow label={t("month")} value={monthName} />}
              {category && <DetailRow label={t("category")} value={category} />}
              {typedFilm.runtime_minutes && (
                <DetailRow label={t("runtime")} value={`${typedFilm.runtime_minutes} MIN`} />
              )}
              {role && <DetailRow label={t("role")} value={role} />}
            </div>
          </div>
        </div>
      </div>

      {/* Section D — Behind the scenes */}
      {typedFilm.behind_the_scenes.length > 0 && (
        <section className="bg-film-dark py-20">
          <div className="container-film">
            <div className="flex items-center gap-4">
              <span className="font-body text-type-label uppercase tracking-[0.4em] text-film-cream/30">
                {t("behindScenes")}
              </span>
              <span className="h-px w-10 bg-film-gold" />
            </div>
            <p className="mt-2 font-heading text-[32px] italic text-film-cream/60">
              {t("fromTheSet")}
            </p>

            <div className="mt-10 grid grid-cols-1 gap-0.5 sm:grid-cols-2 lg:grid-cols-3">
              {typedFilm.behind_the_scenes.map((publicId, index) => (
                <div key={publicId + index} className="group relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={getCloudinaryUrl(publicId, { width: 800 })}
                    alt={`${title} — behind the scenes ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-[400ms] group-hover:scale-[1.02]"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section E — Next film */}
      {nextFilm && (
        <Link
          href={`/${locale}/films/${nextFilm.slug}`}
          className="group block border-t border-film-gray py-16 transition-colors duration-[400ms] hover:bg-film-dark"
        >
          <div className="container-film flex items-center justify-between gap-6">
            <span className="font-body text-type-label uppercase tracking-[0.4em] text-film-cream/30">
              {t("nextFilm")}
            </span>
            <h3 className="font-heading text-[40px] font-light text-film-cream">
              {localized(nextFilm, "title", loc)}
            </h3>
            <span className="font-heading text-2xl text-film-gold">→</span>
          </div>
        </Link>
      )}
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-body text-[8px] uppercase tracking-widest text-film-cream/30">
        {label}
      </span>
      <span className="font-body text-type-nav text-film-cream/70">{value}</span>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="font-body text-[8px] uppercase tracking-widest text-film-cream/30">
        {label}
      </span>
      <span className="font-body text-type-nav text-film-cream/70">{value}</span>
    </div>
  );
}
