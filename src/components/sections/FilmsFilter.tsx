"use client";

import { useTranslations } from "next-intl";
import { FILM_CATEGORIES } from "@/lib/constants";
import type { FilmCategory, Locale } from "@/lib/types";

export type CategoryFilter = "all" | FilmCategory;

interface FilmsFilterProps {
  active: CategoryFilter;
  onChange: (category: CategoryFilter) => void;
  locale: Locale;
}

export default function FilmsFilter({ active, onChange, locale }: FilmsFilterProps) {
  const t = useTranslations("film");

  const options: { value: CategoryFilter; label: string }[] = [
    { value: "all", label: t("allFilms") },
    ...FILM_CATEGORIES.map((category) => ({
      value: category.value,
      label: category.label[locale],
    })),
  ];

  return (
    <div className="flex flex-wrap items-center gap-6">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`border-b pb-1 font-body text-[9px] uppercase tracking-[0.2em] transition-colors duration-300 ${
            active === option.value
              ? "border-film-gold text-film-cream/90"
              : "border-transparent text-film-cream/40 hover:text-film-cream/70"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
