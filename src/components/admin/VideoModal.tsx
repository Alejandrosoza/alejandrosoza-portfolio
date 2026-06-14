"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { VIDEO_CATEGORIES } from "@/lib/constants";
import { extractYouTubeId, getYouTubeThumbnail } from "@/lib/utils";
import type { Video, VideoCategory } from "@/lib/types";

interface VideoModalProps {
  video: Video | null;
  onClose: () => void;
  onSaved: (video: Video) => void;
}

interface FormState {
  title_en: string;
  title_es: string;
  title_fr: string;
  category: VideoCategory;
  year: number;
  youtube_id: string;
  thumbnail_url: string;
  order_index: number;
}

function buildInitialState(video: Video | null): FormState {
  return {
    title_en: video?.title_en ?? "",
    title_es: video?.title_es ?? "",
    title_fr: video?.title_fr ?? "",
    category: video?.category ?? "commercial",
    year: video?.year ?? new Date().getFullYear(),
    youtube_id: video?.youtube_id ?? "",
    thumbnail_url: video?.thumbnail_url ?? "",
    order_index: video?.order_index ?? 0,
  };
}

const inputClass =
  "w-full border-b border-[#2a2a2a] bg-transparent py-2 font-body text-[13px] text-film-cream placeholder:text-film-cream/20 transition-colors duration-300 focus:border-film-gold focus:outline-none";
const labelClass = "font-body text-[9px] uppercase tracking-[0.3em] text-film-cream/30";

export default function VideoModal({ video, onClose, onSaved }: VideoModalProps) {
  const [form, setForm] = useState<FormState>(() => buildInitialState(video));
  const [saving, setSaving] = useState(false);

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleYoutubeBlur = () => {
    const id = extractYouTubeId(form.youtube_id);
    setForm((prev) => ({
      ...prev,
      youtube_id: id,
      thumbnail_url: id ? getYouTubeThumbnail(id, "hq") : prev.thumbnail_url,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);

    const response = video
      ? await fetch(`/api/videos/${video.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
      : await fetch("/api/videos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

    if (response.ok) {
      const saved = await response.json();
      onSaved(saved as Video);
    } else {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-[480px] border border-[#2a2a2a] bg-film-dark p-8">
        <p className="mb-6 font-body text-xs text-film-cream/60">
          {video ? "Edit Video" : "Add Video"}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className={labelClass}>Title (EN)</label>
            <input
              value={form.title_en}
              onChange={(event) => updateField("title_en", event.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Title (ES)</label>
            <input
              value={form.title_es}
              onChange={(event) => updateField("title_es", event.target.value)}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Title (FR)</label>
            <input
              value={form.title_fr}
              onChange={(event) => updateField("title_fr", event.target.value)}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label className={labelClass}>Category</label>
              <select
                value={form.category}
                onChange={(event) => updateField("category", event.target.value as VideoCategory)}
                className={inputClass}
              >
                {VIDEO_CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label.en}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className={labelClass}>Year</label>
              <input
                type="number"
                min={2000}
                max={2030}
                value={form.year}
                onChange={(event) => updateField("year", Number(event.target.value))}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>YouTube ID or URL</label>
            <input
              value={form.youtube_id}
              onChange={(event) => updateField("youtube_id", event.target.value)}
              onBlur={handleYoutubeBlur}
              required
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
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Display Order</label>
            <input
              type="number"
              value={form.order_index}
              onChange={(event) => updateField("order_index", Number(event.target.value))}
              className={inputClass}
            />
          </div>

          <div className="mt-2 flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-film-gold px-8 py-3 font-body text-[10px] font-medium uppercase tracking-[0.3em] text-film-black transition-colors duration-300 hover:bg-film-sepia disabled:opacity-50"
            >
              {saving ? "SAVING..." : "SAVE VIDEO"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="font-body text-[10px] uppercase tracking-[0.3em] text-film-cream/30 transition-colors duration-300 hover:text-film-cream"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
