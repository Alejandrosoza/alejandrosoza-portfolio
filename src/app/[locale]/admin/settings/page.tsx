"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import type { CloudinaryUploadWidgetResults } from "next-cloudinary";
import CloudinaryUploadWidget from "@/components/admin/CloudinaryUploadWidget";
import { buildSiteConfigPayload, extractYouTubeId, getYouTubeThumbnail, sanitizeStringArray } from "@/lib/utils";
import type { SiteConfig } from "@/lib/types";

type Tab = "en" | "es" | "fr";
type LocalizedField = "bio_short" | "bio_long" | "theatre" | "sports";

function localizedKey(field: LocalizedField, tab: Tab): `${LocalizedField}_${Tab}` {
  return `${field}_${tab}`;
}

const inputClass = "film-input";
const labelClass = "film-label";
const sectionLabelClass = "film-section-label";
const sectionClass = "border border-[#2a2a2a] p-6";
const uploadButtonClass = "film-btn-ui";
const removeButtonClass =
  "font-body text-lg text-film-cream/30 transition-colors duration-300 hover:text-red-400";

function PhotoThumbnail({ url }: { url: string }) {
  const [broken, setBroken] = useState(false);

  if (broken) {
    return (
      <div className="flex h-16 w-16 shrink-0 items-center justify-center border border-red-400/30 bg-film-gray px-1 text-center font-body text-[10px] text-film-cream/40">
        Unavailable
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt=""
      onError={() => setBroken(true)}
      className="h-16 w-16 shrink-0 object-cover"
    />
  );
}

function PhotoListField({
  label,
  photos,
  folder,
  onChange,
  onAppendMany,
}: {
  label: string;
  photos: string[];
  folder: string;
  onChange: (photos: string[]) => void;
  onAppendMany: (urls: string[]) => void;
}) {
  const pendingBatchRef = useRef<string[]>([]);
  const flushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const extractUploadUrl = (results: CloudinaryUploadWidgetResults): string | null => {
    if (results.info && typeof results.info === "object" && "secure_url" in results.info) {
      return (results.info as { secure_url: string }).secure_url;
    }
    return null;
  };

  const flushPendingBatch = () => {
    if (pendingBatchRef.current.length === 0) return;
    const batch = [...pendingBatchRef.current];
    pendingBatchRef.current = [];
    onAppendMany(batch);
  };

  const queueUploadUrl = (url: string) => {
    pendingBatchRef.current.push(url);
    if (flushTimerRef.current) clearTimeout(flushTimerRef.current);
    flushTimerRef.current = setTimeout(flushPendingBatch, 400);
  };

  useEffect(() => {
    return () => {
      if (flushTimerRef.current) clearTimeout(flushTimerRef.current);
    };
  }, []);

  const uploaded = sanitizeStringArray(photos);
  const draftSlots = photos.map((url, index) => ({ url, index })).filter((slot) => !slot.url.trim());

  const updateAt = (index: number, value: string) => {
    onChange(photos.map((url, i) => (i === index ? value : url)));
  };

  const removeUploaded = (url: string) => {
    onChange(photos.filter((item) => item !== url));
  };

  const removeDraftAt = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  const handleBulkUploadSuccess = (results: CloudinaryUploadWidgetResults) => {
    const url = extractUploadUrl(results);
    if (url) queueUploadUrl(url);
  };

  const handleBulkQueuesEnd = () => {
    if (flushTimerRef.current) {
      clearTimeout(flushTimerRef.current);
      flushTimerRef.current = null;
    }
    flushPendingBatch();
  };

  const handleSlotUploadSuccess = (index: number, results: CloudinaryUploadWidgetResults) => {
    const url = extractUploadUrl(results);
    if (!url) return;
    onAppendMany([url]);
    removeDraftAt(index);
  };

  return (
    <div className="flex flex-col gap-3">
      <label className={labelClass}>{label}</label>

      {uploaded.map((url) => (
        <div key={url} className="flex items-center gap-3">
          <PhotoThumbnail url={url} />
          <input value={url} readOnly className={`${inputClass} flex-1 text-film-cream/60`} />
          <span className="shrink-0 font-body text-type-ui text-film-gold">Uploaded ✓</span>
          <button
            type="button"
            onClick={() => removeUploaded(url)}
            className="shrink-0 font-body text-type-ui uppercase tracking-[0.2em] text-film-cream/50 transition-colors duration-300 hover:text-red-400"
          >
            × Remove
          </button>
        </div>
      ))}

      {draftSlots.map(({ url, index }) => (
        <div key={`draft-${index}`} className="flex items-center gap-3">
          <input
            value={url}
            onChange={(event) => updateAt(index, event.target.value)}
            onBlur={() => {
              const trimmed = url.trim();
              if (trimmed) {
                onAppendMany([trimmed]);
                removeDraftAt(index);
              }
            }}
            placeholder="https://res.cloudinary.com/..."
            className={`${inputClass} flex-1`}
          />
          <CloudinaryUploadWidget
            uploadPreset="alejandrosoza_portfolio"
            options={{ folder }}
            onSuccess={(results) => handleSlotUploadSuccess(index, results)}
          >
            {({ open }) => (
              <button type="button" onClick={() => open()} className={uploadButtonClass}>
                Upload
              </button>
            )}
          </CloudinaryUploadWidget>
          <button type="button" onClick={() => removeDraftAt(index)} className={removeButtonClass}>
            ×
          </button>
        </div>
      ))}

      <div className="flex flex-wrap gap-3">
        <CloudinaryUploadWidget
          uploadPreset="alejandrosoza_portfolio"
          options={{ folder, multiple: true }}
          onSuccess={handleBulkUploadSuccess}
          onQueuesEnd={handleBulkQueuesEnd}
        >
          {({ open }) => (
            <button type="button" onClick={() => open()} className={uploadButtonClass}>
              Upload Photos
            </button>
          )}
        </CloudinaryUploadWidget>
        <button
          type="button"
          onClick={() => onChange([...photos, ""])}
          className={uploadButtonClass}
        >
          Add Photo
        </button>
      </div>
    </div>
  );
}

function YoutubeListField({
  label,
  ids,
  onChange,
}: {
  label: string;
  ids: string[];
  onChange: (ids: string[]) => void;
}) {
  const updateAt = (index: number, value: string) => {
    onChange(ids.map((id, i) => (i === index ? value : id)));
  };
  const removeAt = (index: number) => {
    onChange(ids.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-3">
      <label className={labelClass}>{label}</label>
      {ids.map((id, index) => (
        <div key={index} className="flex items-center gap-3">
          <input
            value={id}
            onChange={(event) => updateAt(index, event.target.value)}
            onBlur={() => updateAt(index, extractYouTubeId(id))}
            placeholder="YouTube ID or URL"
            className={`${inputClass} flex-1`}
          />
          {id && (
            <Image
              src={getYouTubeThumbnail(id, "hq")}
              alt="Video thumbnail preview"
              width={80}
              height={45}
              className="h-[45px] w-20 object-cover"
            />
          )}
          <button type="button" onClick={() => removeAt(index)} className={removeButtonClass}>
            ×
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...ids, ""])} className={`self-start ${uploadButtonClass}`}>
        Add Video
      </button>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("en");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadConfig() {
      try {
        const cleanupResponse = await fetch("/api/site-config/cleanup", { method: "POST" });
        const cleanupData = await cleanupResponse.json();

        if (cleanupResponse.ok && cleanupData.config?.id) {
          if (cleanupData.changed) {
            console.log("Gallery cleanup removed broken URLs:", cleanupData.removed);
          }
          setConfig({
            ...cleanupData.config,
            theatre_photos: sanitizeStringArray(cleanupData.config.theatre_photos),
            theatre_youtube_ids: sanitizeStringArray(cleanupData.config.theatre_youtube_ids),
            sports_photos: sanitizeStringArray(cleanupData.config.sports_photos),
            sports_youtube_ids: sanitizeStringArray(cleanupData.config.sports_youtube_ids),
          });
          return;
        }

        const response = await fetch("/api/site-config");
        const data = await response.json();
        if (!response.ok || !data.id) {
          throw new Error(data.error || "Failed to load settings");
        }
        setConfig({
          ...data,
          theatre_photos: sanitizeStringArray(data.theatre_photos),
          theatre_youtube_ids: sanitizeStringArray(data.theatre_youtube_ids),
          sports_photos: sanitizeStringArray(data.sports_photos),
          sports_youtube_ids: sanitizeStringArray(data.sports_youtube_ids),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load settings");
      } finally {
        setLoading(false);
      }
    }

    loadConfig();
  }, []);

  const updateField = <K extends keyof SiteConfig>(field: K, value: SiteConfig[K]) => {
    setConfig((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const appendGalleryPhotos = (
    field: "theatre_photos" | "sports_photos",
    urls: string[]
  ) => {
    if (urls.length === 0) return;
    setConfig((prev) => {
      if (!prev) return prev;
      const current = prev[field] ?? [];
      const existing = sanitizeStringArray(current);
      const drafts = current.filter((item) => !item.trim());
      const merged = [...existing, ...urls.filter((url) => !existing.includes(url))];
      return { ...prev, [field]: [...merged, ...drafts] };
    });
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
    setError(null);

    const payload = buildSiteConfigPayload(config);
    console.log("SAVE SETTINGS payload:", payload);
    console.log("theatre_photos:", payload.theatre_photos);
    console.log("sports_photos:", payload.sports_photos);

    const response = await fetch("/api/site-config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    setSaving(false);

    if (response.ok) {
      setConfig({
        ...data,
        theatre_photos: sanitizeStringArray(data.theatre_photos),
        theatre_youtube_ids: sanitizeStringArray(data.theatre_youtube_ids),
        sports_photos: sanitizeStringArray(data.sports_photos),
        sports_youtube_ids: sanitizeStringArray(data.sports_youtube_ids),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else {
      setError(data.error || "Failed to save settings");
    }
  };

  if (loading) {
    return <p className="font-body text-type-nav text-film-cream/30">Loading...</p>;
  }

  if (error && !config) {
    return <p className="font-body text-type-nav text-red-400">{error}</p>;
  }

  if (!config) {
    return <p className="font-body text-type-nav text-film-cream/30">No settings found.</p>;
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
          <p className="font-body text-type-label uppercase tracking-[0.3em] text-film-cream/30">
            Bio / Theatre / Sports
          </p>
          <div className="flex gap-6 border-b border-[#2a2a2a]">
            {(["en", "es", "fr"] as Tab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`pb-2 font-body text-type-ui uppercase tracking-[0.3em] transition-colors duration-300 ${
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
        <p className={sectionLabelClass}>Theatre Gallery</p>
        <div className="flex flex-col gap-8">
          <PhotoListField
            label="Theatre Photos"
            photos={config.theatre_photos ?? []}
            folder="alejandrosoza/theatre"
            onChange={(photos) => updateField("theatre_photos", photos)}
            onAppendMany={(urls) => appendGalleryPhotos("theatre_photos", urls)}
          />
          <YoutubeListField
            label="Theatre YouTube Videos"
            ids={config.theatre_youtube_ids ?? []}
            onChange={(ids) => updateField("theatre_youtube_ids", ids)}
          />
        </div>
      </div>

      <div className={sectionClass}>
        <p className={sectionLabelClass}>Sports Gallery</p>
        <div className="flex flex-col gap-8">
          <PhotoListField
            label="Sports Photos"
            photos={config.sports_photos ?? []}
            folder="alejandrosoza/sports"
            onChange={(photos) => updateField("sports_photos", photos)}
            onAppendMany={(urls) => appendGalleryPhotos("sports_photos", urls)}
          />
          <YoutubeListField
            label="Sports YouTube Videos"
            ids={config.sports_youtube_ids ?? []}
            onChange={(ids) => updateField("sports_youtube_ids", ids)}
          />
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
                className="mt-2 self-start border border-[#2a2a2a] px-4 py-2 font-body text-type-ui uppercase tracking-[0.3em] text-film-cream/60 transition-colors duration-300 hover:border-film-gold hover:text-film-gold"
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
        className="self-start bg-film-gold px-8 py-3 font-body text-type-ui font-medium uppercase tracking-[0.3em] text-film-black transition-colors duration-300 hover:bg-film-sepia disabled:opacity-50"
      >
        {saving ? "SAVING..." : saved ? "SAVED ✓" : "SAVE SETTINGS"}
      </button>
      {error && config && (
        <p className="font-body text-type-nav text-red-400">{error}</p>
      )}
    </form>
  );
}
