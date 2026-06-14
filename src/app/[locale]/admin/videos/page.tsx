"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { GripVertical } from "lucide-react";
import { VIDEO_CATEGORIES } from "@/lib/constants";
import { getYouTubeThumbnail } from "@/lib/utils";
import VideoModal from "@/components/admin/VideoModal";
import type { Video } from "@/lib/types";

function categoryLabel(category: string): string {
  return VIDEO_CATEGORIES.find((c) => c.value === category)?.label.en ?? category;
}

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

  useEffect(() => {
    fetch("/api/videos")
      .then((response) => response.json())
      .then((data) => {
        setVideos(data);
        setLoading(false);
      });
  }, []);

  const handleAdd = () => {
    setEditingVideo(null);
    setModalOpen(true);
  };

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setModalOpen(true);
  };

  const handleSaved = (video: Video) => {
    setVideos((prev) => {
      const exists = prev.some((v) => v.id === video.id);
      const next = exists ? prev.map((v) => (v.id === video.id ? video : v)) : [...prev, video];
      return next.sort((a, b) => a.order_index - b.order_index);
    });
    setModalOpen(false);
  };

  const handleDelete = async (video: Video) => {
    if (!window.confirm(`Delete "${video.title_en}"? This cannot be undone.`)) return;
    await fetch(`/api/videos/${video.id}`, { method: "DELETE" });
    setVideos((prev) => prev.filter((v) => v.id !== video.id));
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-body text-xs text-film-cream/60">Videos</p>
        <button
          type="button"
          onClick={handleAdd}
          className="border border-[#2a2a2a] px-4 py-2 font-body text-[10px] uppercase tracking-[0.3em] text-film-cream/60 transition-colors duration-300 hover:border-film-gold hover:text-film-gold"
        >
          ADD VIDEO →
        </button>
      </div>

      <div className="mt-6 border border-[#2a2a2a]">
        {loading ? (
          <p className="p-6 font-body text-xs text-film-cream/30">Loading...</p>
        ) : videos.length === 0 ? (
          <p className="p-6 font-body text-xs text-film-cream/30">
            No videos yet. Add your first video.
          </p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#2a2a2a]">
                <th className="px-4 py-3 text-left font-body text-[9px] uppercase tracking-[0.2em] text-film-cream/30">
                  Order
                </th>
                <th className="px-4 py-3 text-left font-body text-[9px] uppercase tracking-[0.2em] text-film-cream/30">
                  Thumbnail
                </th>
                <th className="px-4 py-3 text-left font-body text-[9px] uppercase tracking-[0.2em] text-film-cream/30">
                  Title (EN)
                </th>
                <th className="px-4 py-3 text-left font-body text-[9px] uppercase tracking-[0.2em] text-film-cream/30">
                  Category
                </th>
                <th className="px-4 py-3 text-left font-body text-[9px] uppercase tracking-[0.2em] text-film-cream/30">
                  Year
                </th>
                <th className="px-4 py-3 text-left font-body text-[9px] uppercase tracking-[0.2em] text-film-cream/30">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video) => (
                <tr
                  key={video.id}
                  className="border-b border-[#1a1a1a] transition-colors duration-150 hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 font-body text-[11px] text-film-cream/30">
                      <GripVertical size={14} />
                      {video.order_index}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {video.youtube_id && (
                      <Image
                        src={getYouTubeThumbnail(video.youtube_id, "default")}
                        alt={video.title_en}
                        width={80}
                        height={45}
                        className="h-[45px] w-20 object-cover"
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 font-body text-[12px] text-film-cream">
                    {video.title_en}
                  </td>
                  <td className="px-4 py-3 font-body text-[10px] text-film-gold">
                    {categoryLabel(video.category)}
                  </td>
                  <td className="px-4 py-3 font-body text-[10px] text-film-cream/50">
                    {video.year}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-4 font-body text-[10px] uppercase tracking-[0.2em]">
                      <button
                        type="button"
                        onClick={() => handleEdit(video)}
                        className="text-film-cream/50 transition-colors duration-300 hover:text-film-gold"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(video)}
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

      {modalOpen && (
        <VideoModal
          video={editingVideo}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
