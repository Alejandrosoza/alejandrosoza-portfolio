"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { FILM_CATEGORIES } from "@/lib/constants";
import { extractYouTubeId, getYouTubeThumbnail, slugify } from "@/lib/utils";
import type { Film, FilmCategory } from "@/lib/types";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type Tab = "en" | "es" | "fr";
type LocalizedField = "title" | "role" | "synopsis" | "statement";

function localizedKey(field: LocalizedField, tab: Tab): `${LocalizedField}_${Tab}` {
  return `${field}_${tab}`;
}

interface FormState {
  slug: string;
  title_en: string;
  title_es: string;
  title_fr: string;
  synopsis_en: string;
  synopsis_es: string;
  synopsis_fr: string;
  statement_en: string;
  statement_es: string;
  statement_fr: string;
  role_en: string;
  role_es: string;
  role_fr: string;
  credits: string;
  category: FilmCategory;
  year: number;
  month: number | "";
  runtime_minutes: number | "";
  youtube_id: string;
  thumbnail_url: string;
  behind_the_scenes: string[];
  featured: boolean;
  order_index: number;
}

function buildInitialState(initialData?: Film): FormState {
  return {
    slug: initialData?.slug ?? "",
    title_en: initialData?.title_en ?? "",
    title_es: initialData?.title_es ?? "",
    title_fr: initialData?.title_fr ?? "",
    synopsis_en: initialData?.synopsis_en ?? "",
    synopsis_es: initialData?.synopsis_es ?? "",
    synopsis_fr: initialData?.synopsis_fr ?? "",
    statement_en: initialData?.statement_en ?? "",
    statement_es: initialData?.statement_es ?? "",
    statement_fr: initialData?.statement_fr ?? "",
    role_en: initialData?.role_en ?? "",
    role_es: initialData?.role_es ?? "",
    role_fr: initialData?.role_fr ?? "",
    credits: initialData?.credits ?? "",
    category: initialData?.category ?? "short_film",
    year: initialData?.year ?? new Date().getFullYear(),
    month: initialData?.month ?? "",
    runtime_minutes: initialData?.runtime_minutes ?? "",
    youtube_id: initialData?.youtube_id ?? "",
    thumbnail_url: initialData?.thumbnail_url ?? "",
    behind_the_scenes: initialData?.behind_the_scenes ?? [],
    featured: initialData?.featured ?? false,
    order_index: initialData?.order_index ?? 0,
  };
}

const inputClass = "film-input";
const labelClass = "film-label";
const sectionLabelClass = "film-section-label";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

interface FilmFormProps {
  initialData?: Film;
  filmId?: string;
}

export default function FilmForm({ initialData, filmId }: FilmFormProps) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [activeTab, setActiveTab] = useState<Tab>("en");
  const [form, setForm] = useState<FormState>(() => buildInitialState(initialData));
  const [slugEdited, setSlugEdited] = useState(Boolean(initialData?.slug));
  const [saving, setSaving] = useState(false);

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTitleEnChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      title_en: value,
      slug: slugEdited ? prev.slug : slugify(value),
    }));
  };

  const handleSlugChange = (value: string) => {
    setSlugEdited(true);
    updateField("slug", value);
  };

  const handleYoutubeBlur = () => {
    const id = extractYouTubeId(form.youtube_id);
    setForm((prev) => ({
      ...prev,
      youtube_id: id,
      thumbnail_url: id ? getYouTubeThumbnail(id, "hq") : prev.thumbnail_url,
    }));
  };

  const handleBtsChange = (index: number, value: string) => {
    setForm((prev) => ({
      ...prev,
      behind_the_scenes: prev.behind_the_scenes.map((url, i) => (i === index ? value : url)),
    }));
  };

  const addBtsField = () => {
    setForm((prev) => ({ ...prev, behind_the_scenes: [...prev.behind_the_scenes, ""] }));
  };

  const removeBtsField = (index: number) => {
    setForm((prev) => ({
      ...prev,
      behind_the_scenes: prev.behind_the_scenes.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      month: form.month === "" ? null : form.month,
      runtime_minutes: form.runtime_minutes === "" ? null : form.runtime_minutes,
      behind_the_scenes: form.behind_the_scenes.filter((url) => url.trim() !== ""),
    };

    const response = filmId
      ? await fetch(`/api/films/${filmId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch("/api/films", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

    if (response.ok) {
      router.push(`/${locale}/admin/films`);
    } else {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      <div className="flex gap-6 border-b border-[#2a2a2a]">
        {(["en", "es", "fr"] as Tab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`pb-3 font-body text-type-ui uppercase tracking-[0.3em] transition-colors duration-300 ${
              activeTab === tab
                ? "border-b-2 border-film-gold text-film-cream"
                : "text-film-cream/30 hover:text-film-cream/60"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div>
        <p className={sectionLabelClass}>Basic Info</p>
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Slug">
            <input
              value={form.slug}
              onChange={(event) => handleSlugChange(event.target.value)}
              placeholder="URL slug (e.g. my-short-film)"
              className={inputClass}
            />
          </Field>

          <Field label="YouTube ID or URL">
            <input
              value={form.youtube_id}
              onChange={(event) => updateField("youtube_id", event.target.value)}
              onBlur={handleYoutubeBlur}
              placeholder="YouTube Video ID or URL"
              className={inputClass}
            />
            {form.thumbnail_url && (
              <Image
                src={form.thumbnail_url}
                alt="Thumbnail preview"
                width={160}
                height={90}
                className="mt-2 h-[90px] w-40 object-cover"
              />
            )}
          </Field>

          <Field label="Category">
            <select
              value={form.category}
              onChange={(event) => updateField("category", event.target.value as FilmCategory)}
              className={inputClass}
            >
              {FILM_CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label.en}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Year">
            <input
              type="number"
              min={2000}
              max={2030}
              value={form.year}
              onChange={(event) => updateField("year", Number(event.target.value))}
              className={inputClass}
            />
          </Field>

          <Field label="Month (optional)">
            <select
              value={form.month}
              onChange={(event) =>
                updateField("month", event.target.value === "" ? "" : Number(event.target.value))
              }
              className={inputClass}
            >
              <option value="">—</option>
              {MONTHS.map((month, index) => (
                <option key={month} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Runtime (minutes, optional)">
            <input
              type="number"
              min={0}
              value={form.runtime_minutes}
              onChange={(event) =>
                updateField(
                  "runtime_minutes",
                  event.target.value === "" ? "" : Number(event.target.value)
                )
              }
              className={inputClass}
            />
          </Field>

          <Field label="Display Order">
            <input
              type="number"
              value={form.order_index}
              onChange={(event) => updateField("order_index", Number(event.target.value))}
              className={inputClass}
            />
          </Field>

          <div className="flex items-center gap-2 pt-6">
            <input
              id="featured"
              type="checkbox"
              checked={form.featured}
              onChange={(event) => updateField("featured", event.target.checked)}
              className="h-4 w-4 accent-film-gold"
            />
            <label htmlFor="featured" className="font-body text-type-nav text-film-cream/60">
              Show on homepage
            </label>
          </div>
        </div>
      </div>

      <div>
        <p className={sectionLabelClass}>Content ({activeTab.toUpperCase()})</p>
        <div className="flex flex-col gap-6">
          <Field label={`Title (${activeTab.toUpperCase()})${activeTab === "en" ? " *" : ""}`}>
            <input
              value={form[localizedKey("title", activeTab)]}
              onChange={(event) =>
                activeTab === "en"
                  ? handleTitleEnChange(event.target.value)
                  : updateField(localizedKey("title", activeTab), event.target.value)
              }
              required={activeTab === "en"}
              className={inputClass}
            />
          </Field>

          <Field label="Role">
            <input
              value={form[localizedKey("role", activeTab)]}
              onChange={(event) => updateField(localizedKey("role", activeTab), event.target.value)}
              placeholder="Your role (e.g. Director & Editor)"
              className={inputClass}
            />
          </Field>

          <Field label="Synopsis">
            <textarea
              rows={4}
              value={form[localizedKey("synopsis", activeTab)]}
              onChange={(event) =>
                updateField(localizedKey("synopsis", activeTab), event.target.value)
              }
              className={inputClass}
            />
          </Field>

          <Field label="Director's Statement (your artistic vision for this film)">
            <textarea
              rows={6}
              value={form[localizedKey("statement", activeTab)]}
              onChange={(event) =>
                updateField(localizedKey("statement", activeTab), event.target.value)
              }
              className={inputClass}
            />
          </Field>

          {activeTab === "en" && (
            <Field label="Credits">
              <textarea
                rows={4}
                value={form.credits}
                onChange={(event) => updateField("credits", event.target.value)}
                className={inputClass}
              />
            </Field>
          )}
        </div>
      </div>

      <div>
        <p className={sectionLabelClass}>Behind the Scenes Photos (Cloudinary URLs)</p>
        <div className="flex flex-col gap-3">
          {form.behind_the_scenes.map((url, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                value={url}
                onChange={(event) => handleBtsChange(index, event.target.value)}
                placeholder="https://res.cloudinary.com/..."
                className={`${inputClass} flex-1`}
              />
              {url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt="" className="h-20 w-20 object-cover" />
              )}
              <button
                type="button"
                onClick={() => removeBtsField(index)}
                className="font-body text-lg text-film-cream/30 transition-colors duration-300 hover:text-red-400"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addBtsField}
            className="self-start border border-[#2a2a2a] px-4 py-2 font-body text-type-ui uppercase tracking-[0.3em] text-film-cream/60 transition-colors duration-300 hover:border-film-gold hover:text-film-gold"
          >
            Add Photo
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="self-start bg-film-gold px-8 py-3 font-body text-type-ui font-medium uppercase tracking-[0.3em] text-film-black transition-colors duration-300 hover:bg-film-sepia disabled:opacity-50"
      >
        {saving ? "SAVING..." : "SAVE FILM"}
      </button>
    </form>
  );
}
