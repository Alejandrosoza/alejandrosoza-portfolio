"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useTranslations } from "next-intl";
import VideoModal from "@/components/ui/VideoModal";
import { VIDEO_CATEGORIES } from "@/lib/constants";
import { getYouTubeThumbnail, localized } from "@/lib/utils";
import type { Locale, Video } from "@/lib/types";

interface VideosGridProps {
  videos: Video[];
  locale: Locale;
}

export default function VideosGrid({ videos, locale }: VideosGridProps) {
  const t = useTranslations("video");
  const [active, setActive] = useState<Video | null>(null);

  if (videos.length === 0) {
    return (
      <div className="container-film py-12">
        <p className="py-24 text-center font-heading text-2xl italic text-film-cream/30">
          {t("noVideos")}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="container-film py-12">
        <div className="grid grid-cols-1 gap-px bg-film-gray sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video, index) => (
            <VideoCard key={video.id} video={video} locale={locale} index={index} onPlay={() => setActive(video)} />
          ))}
        </div>
      </div>

      <VideoModal
        isOpen={active !== null}
        onClose={() => setActive(null)}
        youtubeId={active?.youtube_id ?? ""}
        title={active ? localized(active, "title", locale) : ""}
      />
    </>
  );
}

function VideoCard({
  video,
  locale,
  index,
  onPlay,
}: {
  video: Video;
  locale: Locale;
  index: number;
  onPlay: () => void;
}) {
  const title = localized(video, "title", locale);
  const category = VIDEO_CATEGORIES.find((c) => c.value === video.category)?.label[locale];
  const thumbnail = getYouTubeThumbnail(video.youtube_id, "hq");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: "easeOut" }}
    >
      <button type="button" onClick={onPlay} className="group block w-full text-left">
        <div
          className="relative aspect-video overflow-hidden bg-film-gray bg-cover bg-center"
          style={{ backgroundImage: `url(${thumbnail})` }}
        >
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/60">
            <div className="flex h-14 w-14 scale-90 items-center justify-center rounded-full border-[1.5px] border-film-cream/60 bg-black/40 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
              <Play size={20} className="text-film-cream" fill="currentColor" />
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 translate-y-full bg-black/60 px-4 py-3 transition-transform duration-300 group-hover:translate-y-0">
            <p className="font-heading text-base text-film-cream">{title}</p>
          </div>
        </div>

        <div className="bg-film-black py-3">
          <p className="font-body text-[8px] uppercase tracking-[0.3em] text-film-gold">
            {category}
          </p>
          <h3 className="mt-1 line-clamp-2 font-heading text-[22px] font-normal text-film-cream">
            {title}
          </h3>
          <p className="mt-1 font-body text-[9px] text-film-cream/30">{video.year}</p>
        </div>
      </button>
    </motion.div>
  );
}
