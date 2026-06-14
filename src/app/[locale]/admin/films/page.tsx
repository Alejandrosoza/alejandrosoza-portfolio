"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { GripVertical } from "lucide-react";
import { FILM_CATEGORIES } from "@/lib/constants";
import { getYouTubeThumbnail } from "@/lib/utils";
import type { Film } from "@/lib/types";

function categoryLabel(category: string): string {
  return FILM_CATEGORIES.find((c) => c.value === category)?.label.en ?? category;
}

export default function AdminFilmsPage() {
  const params = useParams();
  const locale = params.locale as string;
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFilms = async () => {
    const response = await fetch("/api/films");
    const data = await response.json();
    setFilms(data);
    setLoading(false);
  };

  useEffect(() => {
    loadFilms();
  }, []);

  const handleToggleFeatured = async (film: Film) => {
    setFilms((prev) =>
      prev.map((f) => (f.id === film.id ? { ...f, featured: !f.featured } : f))
    );
    await fetch(`/api/films/${film.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !film.featured }),
    });
  };

  const handleDelete = async (film: Film) => {
    if (!window.confirm(`Delete "${film.title_en}"? This cannot be undone.`)) return;
    await fetch(`/api/films/${film.id}`, { method: "DELETE" });
    setFilms((prev) => prev.filter((f) => f.id !== film.id));
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-body text-type-nav text-film-cream/60">Films</p>
        <Link
          href={`/${locale}/admin/films/new`}
          className="border border-[#2a2a2a] px-4 py-2 font-body text-type-ui uppercase tracking-[0.3em] text-film-cream/60 transition-colors duration-300 hover:border-film-gold hover:text-film-gold"
        >
          ADD FILM →
        </Link>
      </div>

      <div className="mt-6 border border-[#2a2a2a]">
        {loading ? (
          <p className="p-6 font-body text-type-nav text-film-cream/30">Loading...</p>
        ) : films.length === 0 ? (
          <p className="p-6 font-body text-type-nav text-film-cream/30">
            No films yet. Add your first film.
          </p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#2a2a2a]">
                <th className="px-4 py-3 text-left font-body text-type-label uppercase tracking-[0.2em] text-film-cream/30">
                  Order
                </th>
                <th className="px-4 py-3 text-left font-body text-type-label uppercase tracking-[0.2em] text-film-cream/30">
                  Thumbnail
                </th>
                <th className="px-4 py-3 text-left font-body text-type-label uppercase tracking-[0.2em] text-film-cream/30">
                  Title (EN)
                </th>
                <th className="px-4 py-3 text-left font-body text-type-label uppercase tracking-[0.2em] text-film-cream/30">
                  Category
                </th>
                <th className="px-4 py-3 text-left font-body text-type-label uppercase tracking-[0.2em] text-film-cream/30">
                  Year
                </th>
                <th className="px-4 py-3 text-left font-body text-type-label uppercase tracking-[0.2em] text-film-cream/30">
                  Featured
                </th>
                <th className="px-4 py-3 text-left font-body text-type-label uppercase tracking-[0.2em] text-film-cream/30">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {films.map((film) => (
                <tr
                  key={film.id}
                  className="border-b border-[#1a1a1a] transition-colors duration-150 hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 font-body text-type-nav text-film-cream/30">
                      <GripVertical size={14} />
                      {film.order_index}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {film.youtube_id && (
                      <Image
                        src={getYouTubeThumbnail(film.youtube_id, "default")}
                        alt={film.title_en}
                        width={80}
                        height={45}
                        className="h-[45px] w-20 object-cover"
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 font-body text-type-body-sm text-film-cream">
                    {film.title_en}
                  </td>
                  <td className="px-4 py-3 font-body text-type-ui text-film-gold">
                    {categoryLabel(film.category)}
                  </td>
                  <td className="px-4 py-3 font-body text-type-ui text-film-cream/50">
                    {film.year}
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={film.featured}
                      onChange={() => handleToggleFeatured(film)}
                      className="h-4 w-4 accent-film-gold"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-4 font-body text-type-ui uppercase tracking-[0.2em]">
                      <Link
                        href={`/${locale}/admin/films/${film.id}/edit`}
                        className="text-film-cream/50 transition-colors duration-300 hover:text-film-gold"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(film)}
                        className="text-film-cream/50 transition-colors duration-300 hover:text-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
