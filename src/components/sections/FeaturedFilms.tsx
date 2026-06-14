"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FILM_CATEGORIES } from "@/lib/constants";
import { getYouTubeThumbnail, localized } from "@/lib/utils";
import type { Film, Locale } from "@/lib/types";

interface FeaturedFilmsProps {
  films: Film[];
  locale: Locale;
}

export default function FeaturedFilms({ films, locale }: FeaturedFilmsProps) {
  return (
    <section className="bg-film-black py-20 md:py-32">
      <div className="container-film">
        <div className="mb-4 flex items-center gap-4">
          <span className="h-px w-10 bg-film-gold" />
          <span className="font-heading text-type-nav uppercase tracking-[0.5em] text-film-cream/40">
            Selected Work
          </span>
        </div>

        <h2 className="mb-12 font-heading text-[56px] font-light leading-tight text-film-cream">
          Films
        </h2>

        <div className="grid grid-cols-1 gap-px bg-film-gray sm:grid-cols-2 lg:grid-cols-3">
          {films.length > 0
            ? films.map((film, index) => (
                <FilmCard key={film.id} film={film} locale={locale} index={index} />
              ))
            : Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="aspect-video animate-pulse bg-film-gray" />
              ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href={`/${locale}/films`}
            className="font-body text-type-ui uppercase tracking-[0.3em] text-film-cream/50 transition-colors duration-300 hover:text-film-gold"
          >
            View All Films →
          </Link>
        </div>
      </div>
    </section>
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
  const category = FILM_CATEGORIES.find((c) => c.value === film.category)?.label[locale];
  const thumbnail = getYouTubeThumbnail(film.youtube_id, "maxres");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
    >
      <Link
        href={`/${locale}/films/${film.slug}`}
        className="group relative block aspect-video overflow-hidden bg-film-dark"
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[400ms] ease-out group-hover:scale-105"
          style={{ backgroundImage: `url(${thumbnail})` }}
        />
        <div className="absolute inset-0 bg-black/0 transition-colors duration-[400ms] group-hover:bg-black/60" />
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <h3 className="translate-y-4 font-heading text-2xl text-film-cream opacity-0 transition-all duration-[400ms] group-hover:translate-y-0 group-hover:opacity-100">
            {title}
          </h3>
          <p className="mt-1 font-body text-type-ui uppercase tracking-wider text-film-gold opacity-0 transition-opacity duration-[400ms] group-hover:opacity-100">
            {film.year} · {category}
          </p>
          <p className="mt-3 font-body text-type-label uppercase tracking-widest text-film-cream/70 opacity-0 transition-opacity duration-[400ms] group-hover:opacity-100">
            View Project →
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
