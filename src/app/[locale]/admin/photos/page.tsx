"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from "next-cloudinary";
import type { Photo } from "@/lib/types";

export const dynamic = "force-dynamic";

const inputClass =
  "w-full border-b border-[#2a2a2a] bg-transparent py-2 font-body text-[13px] text-film-cream placeholder:text-film-cream/20 transition-colors duration-300 focus:border-film-gold focus:outline-none";
const labelClass = "font-body text-[9px] uppercase tracking-[0.3em] text-film-cream/30";

interface UploadForm {
  title_en: string;
  title_es: string;
  title_fr: string;
  caption_en: string;
  caption_es: string;
  caption_fr: string;
}

const emptyUploadForm: UploadForm = {
  title_en: "",
  title_es: "",
  title_fr: "",
  caption_en: "",
  caption_es: "",
  caption_fr: "",
};

export default function AdminPhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [uploadForm, setUploadForm] = useState<UploadForm>(emptyUploadForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/photos")
      .then((response) => response.json())
      .then((data) => {
        setPhotos(data);
        setLoading(false);
      });
  }, []);

  const handleUploadSuccess = (results: CloudinaryUploadWidgetResults) => {
    if (results.info && typeof results.info !== "string") {
      setPendingUrl(results.info.secure_url);
      setUploadForm(emptyUploadForm);
    }
  };

  const updateUploadField = (field: keyof UploadForm, value: string) => {
    setUploadForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSavePhoto = async (event: FormEvent) => {
    event.preventDefault();
    if (!pendingUrl) return;
    setSaving(true);

    const nextOrder = photos.reduce((max, photo) => Math.max(max, photo.order_index), -1) + 1;

    const response = await fetch("/api/photos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...uploadForm, url: pendingUrl, order_index: nextOrder }),
    });

    if (response.ok) {
      const photo = await response.json();
      setPhotos((prev) => [...prev, photo]);
      setPendingUrl(null);
      setUploadForm(emptyUploadForm);
    }
    setSaving(false);
  };

  const handleDelete = async (photo: Photo) => {
    if (!window.confirm("Delete this photo? This cannot be undone.")) return;
    await fetch(`/api/photos/${photo.id}`, { method: "DELETE" });
    setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
  };

  const handleOrderChange = async (photo: Photo, value: number) => {
    setPhotos((prev) => prev.map((p) => (p.id === photo.id ? { ...p, order_index: value } : p)));
    await fetch(`/api/photos/${photo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_index: value }),
    });
  };

  return (
    <div>
      <p className="font-body text-xs text-film-cream/60">Photos</p>

      <div className="mt-6 border border-[#2a2a2a] p-6">
        <p className={`${labelClass} mb-4`}>Upload Photo</p>
        <CldUploadWidget
          uploadPreset="alejandrosoza_portfolio"
          options={{ folder: "alejandrosoza/photos" }}
          onSuccess={handleUploadSuccess}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="border border-[#2a2a2a] px-4 py-2 font-body text-[10px] uppercase tracking-[0.3em] text-film-cream/60 transition-colors duration-300 hover:border-film-gold hover:text-film-gold"
            >
              Select Image
            </button>
          )}
        </CldUploadWidget>

        {pendingUrl && (
          <form onSubmit={handleSavePhoto} className="mt-6 flex flex-col gap-5">
            <Image
              src={pendingUrl}
              alt="Uploaded preview"
              width={160}
              height={160}
              className="h-40 w-40 object-cover"
            />

            <div className="grid gap-5 md:grid-cols-3">
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Title (EN)</label>
                <input
                  value={uploadForm.title_en}
                  onChange={(event) => updateUploadField("title_en", event.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Title (ES)</label>
                <input
                  value={uploadForm.title_es}
                  onChange={(event) => updateUploadField("title_es", event.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Title (FR)</label>
                <input
                  value={uploadForm.title_fr}
                  onChange={(event) => updateUploadField("title_fr", event.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Caption (EN)</label>
                <input
                  value={uploadForm.caption_en}
                  onChange={(event) => updateUploadField("caption_en", event.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Caption (ES)</label>
                <input
                  value={uploadForm.caption_es}
                  onChange={(event) => updateUploadField("caption_es", event.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Caption (FR)</label>
                <input
                  value={uploadForm.caption_fr}
                  onChange={(event) => updateUploadField("caption_fr", event.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-film-gold px-8 py-3 font-body text-[10px] font-medium uppercase tracking-[0.3em] text-film-black transition-colors duration-300 hover:bg-film-sepia disabled:opacity-50"
              >
                {saving ? "SAVING..." : "SAVE PHOTO"}
              </button>
              <button
                type="button"
                onClick={() => setPendingUrl(null)}
                className="font-body text-[10px] uppercase tracking-[0.3em] text-film-cream/30 transition-colors duration-300 hover:text-film-cream"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="mt-8">
        {loading ? (
          <p className="font-body text-xs text-film-cream/30">Loading...</p>
        ) : photos.length === 0 ? (
          <p className="font-body text-xs text-film-cream/30">No photos yet. Upload your first photo.</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="border border-[#2a2a2a] p-3">
                <Image
                  src={photo.url}
                  alt={photo.title_en}
                  width={240}
                  height={160}
                  className="h-40 w-full object-cover"
                />
                <p className="mt-2 truncate font-body text-[11px] text-film-cream">
                  {photo.title_en || "Untitled"}
                </p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <label className={labelClass}>Order</label>
                    <input
                      type="number"
                      value={photo.order_index}
                      onChange={(event) => handleOrderChange(photo, Number(event.target.value))}
                      className="w-16 border-b border-[#2a2a2a] bg-transparent py-1 font-body text-[12px] text-film-cream focus:border-film-gold focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(photo)}
                    className="font-body text-[10px] uppercase tracking-[0.2em] text-film-cream/50 transition-colors duration-300 hover:text-red-400"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
