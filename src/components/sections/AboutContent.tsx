"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Download } from "lucide-react";
import PhotoLightbox from "@/components/ui/PhotoLightbox";
import YouTubeEmbed from "@/components/ui/YouTubeEmbed";
import { getOptimizedImageUrl } from "@/lib/cloudinary-url";
import { localized } from "@/lib/utils";
import type { Locale, Photo, SiteConfig } from "@/lib/types";

const PLACEHOLDERS: Record<"bioLong" | "bioShort" | "theatre" | "sports", Record<Locale, string>> = {
  bioLong: {
    en: "Alejandro Soza is an emerging film director based in Whitehorse, Yukon, Canada. With a passion for visual storytelling and a deep appreciation for the craft of cinema, he brings a unique northern perspective to every project.",
    es: "Alejandro Soza es un director de cine emergente radicado en Whitehorse, Yukón, Canadá. Con una pasión por la narrativa visual y un profundo aprecio por el oficio del cine, aporta una perspectiva nórdica única a cada proyecto.",
    fr: "Alejandro Soza est un réalisateur émergent basé à Whitehorse, au Yukon, Canada. Animé par une passion pour le récit visuel et un profond respect pour l'art du cinéma, il apporte une perspective nordique unique à chaque projet.",
  },
  bioShort: {
    en: "I believe cinema has the power to make the invisible visible — to give voice to stories that exist in the margins, in the silence between words.",
    es: "Creo que el cine tiene el poder de hacer visible lo invisible — de dar voz a historias que existen en los márgenes, en el silencio entre las palabras.",
    fr: "Je crois que le cinéma a le pouvoir de rendre visible l'invisible — de donner une voix aux histoires qui existent dans les marges, dans le silence entre les mots.",
  },
  theatre: {
    en: "Alejandro has performed in multiple Shakespearean theatre productions as an actor, deepening his understanding of dramatic structure, character motivation, and the intimate relationship between performer and audience. This experience informs every directorial decision he makes — understanding the actor's perspective from the inside.",
    es: "Alejandro ha actuado en múltiples producciones teatrales shakespearianas, profundizando su comprensión de la estructura dramática, la motivación de los personajes y la relación íntima entre el actor y el público. Esta experiencia informa cada decisión que toma como director — entender la perspectiva del actor desde dentro.",
    fr: "Alejandro a joué dans plusieurs productions théâtrales shakespeariennes, approfondissant sa compréhension de la structure dramatique, de la motivation des personnages et de la relation intime entre l'acteur et le public. Cette expérience nourrit chacune de ses décisions de mise en scène — comprendre le point de vue de l'acteur de l'intérieur.",
  },
  sports: {
    en: "Territorial champion in table tennis at the Yukon Territory level, Alejandro brings the same discipline, precision, and competitive focus to his filmmaking practice. The mental clarity required to compete at a championship level translates directly into the patience and decisiveness demanded behind the camera.",
    es: "Campeón territorial de tenis de mesa a nivel del Territorio de Yukón, Alejandro aporta la misma disciplina, precisión y enfoque competitivo a su práctica cinematográfica. La claridad mental necesaria para competir a nivel de campeonato se traduce directamente en la paciencia y decisión que exige estar detrás de la cámara.",
    fr: "Champion territorial de tennis de table au niveau du Territoire du Yukon, Alejandro apporte la même discipline, précision et concentration compétitive à sa pratique cinématographique. La clarté mentale nécessaire pour concourir à un niveau de championnat se traduit directement par la patience et la détermination exigées derrière la caméra.",
  },
};

interface MediaGalleryProps {
  photos: string[];
  youtubeIds: string[];
  videoLabel: string;
  idPrefix: string;
  locale: Locale;
}

function MediaGallery({ photos, youtubeIds, videoLabel, idPrefix, locale }: MediaGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (photos.length === 0 && youtubeIds.length === 0) return null;

  const lightboxPhotos: Photo[] = photos.map((url, index) => ({
    id: `${idPrefix}-${index}`,
    title_en: "",
    title_es: "",
    title_fr: "",
    url,
    order_index: index,
    created_at: "",
  }));

  return (
    <div className="mt-12">
      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-[2px] md:grid-cols-3">
          {photos.map((url, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group relative aspect-[4/3] overflow-hidden"
            >
              <Image
                src={getOptimizedImageUrl(url, { width: 600 })}
                alt=""
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/30" />
            </button>
          ))}
        </div>
      )}

      {youtubeIds.length > 0 && (
        <div className={`grid grid-cols-1 gap-1 md:grid-cols-2 ${photos.length > 0 ? "mt-4" : ""}`}>
          {youtubeIds.map((id) => (
            <div key={id}>
              <YouTubeEmbed youtubeId={id} title={videoLabel} />
              <p className="mt-2 font-body text-type-label text-film-cream/30">{videoLabel}</p>
            </div>
          ))}
        </div>
      )}

      <PhotoLightbox
        photos={lightboxPhotos}
        initialIndex={activeIndex ?? 0}
        isOpen={activeIndex !== null}
        onClose={() => setActiveIndex(null)}
        locale={locale}
      />
    </div>
  );
}

interface AboutContentProps {
  config: SiteConfig | null;
  locale: Locale;
}

export default function AboutContent({ config, locale }: AboutContentProps) {
  const t = useTranslations("about");

  const bioLong = (config && localized(config, "bio_long", locale)) || PLACEHOLDERS.bioLong[locale];
  const bioShort = (config && localized(config, "bio_short", locale)) || PLACEHOLDERS.bioShort[locale];
  const theatre = (config && localized(config, "theatre", locale)) || PLACEHOLDERS.theatre[locale];
  const sports = (config && localized(config, "sports", locale)) || PLACEHOLDERS.sports[locale];
  const theatrePhoto = config?.theatre_photos?.[0];
  const sportsPhoto = config?.sports_photos?.[0];

  return (
    <div>
      {/* Section A — Hero */}
      <section className="container-film pb-0 pt-40">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:w-[55%]"
          >
            <p className="font-body text-type-label uppercase tracking-[0.5em] text-film-cream/30">
              {t("director")}
            </p>
            <h1 className="mt-4 font-heading text-[48px] font-light leading-[0.95] text-film-cream md:text-[80px]">
              Alejandro Soza
            </h1>
            <p className="mt-4 font-body text-type-ui uppercase tracking-[0.4em] text-film-gold">
              Film Director
            </p>
            <p className="mt-8 max-w-[520px] font-body text-type-copy leading-[1.9] text-film-cream/60">
              {bioLong}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:w-[45%]"
          >
            <div className="relative flex aspect-[3/4] items-center justify-center border border-[#2a2a2a] bg-film-gray">
              <span className="font-body text-type-label uppercase tracking-widest text-film-cream/20">
                {t("portrait")}
              </span>
            </div>
            <p className="mt-3 font-body text-type-label tracking-wider text-film-cream/30">
              Whitehorse, Yukon, Canada
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section B — Director's Vision */}
      <section className="border-y border-[#2a2a2a] bg-film-dark py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container-film mx-auto max-w-[680px] py-16 text-center"
        >
          <p className="font-body text-type-label uppercase tracking-[0.5em] text-film-cream/30">
            {t("artisticVision")}
          </p>
          <p className="mt-6 font-heading text-[22px] font-light italic leading-[1.5] text-film-cream/80 md:text-[32px]">
            {bioShort}
          </p>
          <p className="mt-6 font-body text-type-ui uppercase tracking-[0.3em] text-film-gold">
            — Alejandro Soza
          </p>
        </motion.div>
      </section>

      {/* Section C — On Stage */}
      <section className="container-film py-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center">
          <div className="lg:w-[40%]">
            <p className="font-body text-type-label uppercase tracking-[0.5em] text-film-cream/30">
              {t("onStage")}
            </p>
            <h2 className="mt-4 font-heading text-[48px] font-light text-film-cream">
              {t("theatre")}
            </h2>
            <div className="my-6 h-px w-[60px] bg-film-gold" />
            <p className="font-body text-type-copy leading-[1.8] text-film-cream/60">{theatre}</p>
          </div>

          <div className="lg:w-[60%]">
            {theatrePhoto ? (
              <div className="relative aspect-video overflow-hidden border border-[#2a2a2a]">
                <Image
                  src={getOptimizedImageUrl(theatrePhoto, { width: 1200 })}
                  alt={t("theatrePhoto")}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="relative flex aspect-video items-center justify-center border border-[#2a2a2a] bg-film-gray">
                <span className="font-body text-type-label uppercase tracking-widest text-film-cream/20">
                  {t("theatrePhoto")}
                </span>
              </div>
            )}
          </div>
        </div>

        <MediaGallery
          photos={theatrePhoto ? (config?.theatre_photos ?? []).slice(1) : (config?.theatre_photos ?? [])}
          youtubeIds={config?.theatre_youtube_ids ?? []}
          videoLabel={t("theatreVideo")}
          idPrefix="theatre"
          locale={locale}
        />
      </section>

      {/* Section D — Beyond the Frame */}
      <section className="border-t border-[#2a2a2a] bg-film-dark py-20">
        <div className="container-film flex flex-col gap-12 lg:flex-row lg:items-center">
          <div className="lg:w-[60%]">
            {sportsPhoto ? (
              <div className="relative aspect-[4/3] overflow-hidden border border-[#2a2a2a]">
                <Image
                  src={getOptimizedImageUrl(sportsPhoto, { width: 1200 })}
                  alt={t("sportsPhoto")}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="relative flex aspect-[4/3] items-center justify-center border border-[#2a2a2a] bg-film-gray">
                <span className="font-body text-type-label uppercase tracking-widest text-film-cream/20">
                  {t("sportsPhoto")}
                </span>
              </div>
            )}
          </div>

          <div className="lg:w-[40%]">
            <p className="font-body text-type-label uppercase tracking-[0.5em] text-film-cream/30">
              {t("beyondFrame")}
            </p>
            <h2 className="mt-4 font-heading text-[48px] font-light text-film-cream">
              {t("champion")}
            </h2>
            <div className="my-6 h-px w-[60px] bg-film-gold" />
            <p className="font-body text-type-copy leading-[1.8] text-film-cream/60">{sports}</p>
          </div>
        </div>

        <div className="container-film">
          <MediaGallery
            photos={sportsPhoto ? (config?.sports_photos ?? []).slice(1) : (config?.sports_photos ?? [])}
            youtubeIds={config?.sports_youtube_ids ?? []}
            videoLabel={t("sportsVideo")}
            idPrefix="sports"
            locale={locale}
          />
        </div>
      </section>

      {/* Section E — CV + Contact CTA */}
      <section className="container-film border-t border-[#2a2a2a] py-20 text-center">
        <p className="mb-8 font-heading text-[40px] font-light italic text-film-cream/60">
          {t("readyCollaborate")}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {config?.cv_url && (
            <a
              href={config.cv_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-film-cream/30 px-8 py-3 font-body text-type-ui uppercase tracking-[0.3em] text-film-cream transition-colors duration-300 hover:border-film-gold hover:text-film-gold"
            >
              <Download size={14} />
              {t("downloadCV")}
            </a>
          )}
          <Link
            href={`/${locale}/contact`}
            className="bg-film-gold px-8 py-3 font-body text-type-ui font-medium uppercase tracking-[0.3em] text-film-black transition-colors duration-300 hover:bg-film-sepia"
          >
            {t("getInTouch")} →
          </Link>
        </div>
      </section>
    </div>
  );
}
