"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import type { CloudinaryUploadWidgetResults } from "next-cloudinary";
import CloudinaryUploadWidget from "@/components/admin/CloudinaryUploadWidget";
import { extractYouTubeId, getYouTubeThumbnail } from "@/lib/utils";
import type { SiteConfig } from "@/lib/types";

type Tab = "en" | "es" | "fr";
type LocalizedField = "bio_short" | "bio_long" | "theatre" | "sports";

function localizedKey(field: LocalizedField, tab: Tab): `${LocalizedField}_${Tab}` {
  return `${field}_${tab}`;
}

const inputClass =
  "w-full border-b border-[#2a2a2a] bg-transparent py-2 font-body text-[13px] text-film-cream placeholder:text-film-cream/20 transition-colors duration-300 focus:border-film-gold focus:outline-none";
const labelClass = "font-body text-[9px] uppercase tracking-[0.3em] text-film-cream/30";
const sectionLabelClass = "mb-4 font-body text-[9px] uppercase tracking-[0.3em] text-film-cream/30";
const sectionClass = "border border-[#2a2a2a] p-6";

export default function AdminSettingsPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("en");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/site-config")
      .then((response) => response.json())
      .then((data) => {
        setConfig(data);
        setLoading(false);
      });
  }, []);

  const updateField = <K extends keyof SiteConfig>(field: K, value: SiteConfig[K]) => {
    setConfig((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleShowreelBlur = () => {
    if (!config) return;
    const id = extractYouTubeId(config.showreel_youtube_id);
    updateField("showreel_youtube_id", id);
  };

  const handleCvUpload = (results: CloudinaryUploadWidgetResults) => {
    if (results.info && typeof results.info !== "string") {
      updateField("cv_url", results.info.secure_url);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!config) return;
    setSaving(true);
    setSaved(false);

    const response = await fetch("/api/site-config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });

    setSaving(false);
    if (response.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  if (loading || !config) {
    return <p className="font-body text-xs text-film-cream/30">Loading...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className={sectionClass}>
        <p className={sectionLabelClass}>Showreel</p>
        <div className="flex flex-col gap-2 md:max-w-[480px]">
          <label className={labelClass}>YouTube ID or URL</label>
          <input
            value={config.showreel_youtube_id}
            onChange={(event) => updateField("showreel_youtube_id", event.target.value)}
            onBlur={handleShowreelBlur}
            className={inputClass}
          />
          {config.showreel_youtube_id && (
            <Image
              src={getYouTubeThumbnail(config.showreel_youtube_id, "hq")}
              alt="Showreel preview"
              width={160}
              height={90}
              className="mt-2 h-[90px] w-40 object-cover"
            />
          )}
        </div>
      </div>

      <div className={sectionClass}>
        <div className="mb-6 flex items-center justify-between">
          <p className="font-body text-[9px] uppercase tracking-[0.3em] text-film-cream/30">
            Bio / Theatre / Sports
          </p>
          <div className="flex gap-6 border-b border-[#2a2a2a]">
            {(["en", "es", "fr"] as Tab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`pb-2 font-body text-[10px] uppercase tracking-[0.3em] transition-colors duration-300 ${
                  activeTab === tab
                    ? "border-b-2 border-film-gold text-film-cream"
                    : "text-film-cream/30 hover:text-film-cream/60"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className={labelClass}>Short Bio — shown as quote on About page</label>
            <textarea
              rows={3}
              value={config[localizedKey("bio_short", activeTab)]}
              onChange={(event) =>
                updateField(localizedKey("bio_short", activeTab), event.target.value)
              }
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Long Bio — main bio text</label>
            <textarea
              rows={6}
              value={config[localizedKey("bio_long", activeTab)]}
              onChange={(event) =>
                updateField(localizedKey("bio_long", activeTab), event.target.value)
              }
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Theatre Experience</label>
            <textarea
              rows={4}
              value={config[localizedKey("theatre", activeTab)]}
              onChange={(event) =>
                updateField(localizedKey("theatre", activeTab), event.target.value)
              }
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className={labelClass}>Sports Achievement</label>
            <textarea
              rows={4}
              value={config[localizedKey("sports", activeTab)]}
              onChange={(event) =>
                updateField(localizedKey("sports", activeTab), event.target.value)
              }
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <p className={sectionLabelClass}>CV</p>
        <div className="flex flex-col gap-2 md:max-w-[480px]">
          <label className={labelClass}>CV URL (Cloudinary PDF URL)</label>
          <input
            value={config.cv_url ?? ""}
            onChange={(event) => updateField("cv_url", event.target.value)}
            className={inputClass}
          />
          <CloudinaryUploadWidget
            uploadPreset="alejandrosoza_portfolio"
            options={{ folder: "alejandrosoza/documents" }}
            onSuccess={handleCvUpload}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="mt-2 self-start border border-[#2a2a2a] px-4 py-2 font-body text-[10px] uppercase tracking-[0.3em] text-film-cream/60 transition-colors duration-300 hover:border-film-gold hover:text-film-gold"
              >
                Upload CV
              </button>
            )}
          </CloudinaryUploadWidget>
        </div>
      </div>

      <div className={sectionClass}>
        <p className={sectionLabelClass}>Social Links</p>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className={labelClass}>Instagram URL</label>
            <input
              value={config.instagram_url ?? ""}
              onChange={(event) => updateField("instagram_url", event.target.value)}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className={labelClass}>YouTube Channel URL</label>
            <input
              value={config.youtube_channel_url ?? ""}
              onChange={(event) => updateField("youtube_channel_url", event.target.value)}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className={labelClass}>Letterboxd URL</label>
            <input
              value={config.letterboxd_url ?? ""}
              onChange={(event) => updateField("letterboxd_url", event.target.value)}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className={labelClass}>IMDb URL</label>
            <input
              value={config.imdb_url ?? ""}
              onChange={(event) => updateField("imdb_url", event.target.value)}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className={labelClass}>Contact Email</label>
            <input
              value={config.contact_email ?? ""}
              onChange={(event) => updateField("contact_email", event.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="self-start bg-film-gold px-8 py-3 font-body text-[10px] font-medium uppercase tracking-[0.3em] text-film-black transition-colors duration-300 hover:bg-film-sepia disabled:opacity-50"
      >
        {saving ? "SAVING..." : saved ? "SAVED ✓" : "SAVE SETTINGS"}
      </button>
    </form>
  );
}
