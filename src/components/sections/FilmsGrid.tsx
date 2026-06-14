"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import FilmsFilter, { type CategoryFilter } from "./FilmsFilter";
import { FILM_CATEGORIES } from "@/lib/constants";
import { getYouTubeThumbnail, localized } from "@/lib/utils";
import type { Film, Locale } from "@/lib/types";

interface FilmsGridProps {
  films: Film[];
  locale: Locale;
}

export default function FilmsGrid({ films, locale }: FilmsGridProps) {
  const t = useTranslations("film");
  const [active, setActive] = useState<CategoryFilter>("all");

  const filtered = useMemo(
    () => (active === "all" ? films : films.filter((film) => film.category === active)),
    [films, active]
  );

  return (
    <>
      <div className="container-film mt-8 flex justify-end border-t border-film-gray pt-6">
        <FilmsFilter active={active} onChange={setActive} locale={locale} />
      </div>

      <div className="container-film py-12">
        {filtered.length === 0 ? (
          <p className="py-24 text-center font-heading text-2xl italic text-film-cream/30">
            {t("noFilms")}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-px bg-film-gray sm:grid-cols-2">
            {filtered.map((film, index) => (
              <FilmCard key={film.id} film={film} locale={locale} index={index} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function FilmCard({
  film,
  locale,
  index,
}: {
  film: Film;
  locale: Locale;
  index: number;
}) {
  const title = localized(film, "title", locale);
  const role = localized(film, "role", locale);
  const category = FILM_CATEGORIES.find((c) => c.value === film.category)?.label[locale];
  const thumbnail = getYouTubeThumbnail(film.youtube_id, "maxres");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
    >
      <Link href={`/${locale}/films/${film.slug}`} className="group block">
        <div
          className="relative aspect-video overflow-hidden bg-film-gray bg-cover bg-center"
          style={{ backgroundImage: `url(${thumbnail})` }}
        >
          <div className="absolute inset-0 bg-black/0 transition-colors duration-[400ms] group-hover:bg-black/50" />
        </div>

        <div className="bg-film-black py-4">
          <p className="font-body text-type-label uppercase tracking-[0.3em] text-film-gold">
            {category}
          </p>
          <h3 className="mt-1 font-heading text-[28px] font-normal text-film-cream transition-colors duration-300 group-hover:text-film-sepia">
            {title}
          </h3>
          {role && (
            <p className="mt-1 font-body text-type-ui text-film-cream/50">{role}</p>
          )}
          <p className="mt-2 font-body text-type-label uppercase tracking-wider text-film-cream/30">
            {film.year}
            {film.runtime_minutes ? ` · ${film.runtime_minutes} MIN` : ""}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
