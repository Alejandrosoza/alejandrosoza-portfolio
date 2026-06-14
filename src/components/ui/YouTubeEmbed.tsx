"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { getYouTubeThumbnail } from "@/lib/utils";

interface YouTubeEmbedProps {
  youtubeId: string;
  title: string;
}

export default function YouTubeEmbed({ youtubeId, title }: YouTubeEmbedProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative aspect-video w-full bg-film-dark"
    >
      {playing ? (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&color=white`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play ${title}`}
          className="group relative block h-full w-full"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${getYouTubeThumbnail(youtubeId, "maxres")})` }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-2 border-film-cream/60 bg-black/40 backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:border-film-gold">
              <Play size={28} className="text-film-cream" fill="currentColor" />
            </div>
          </div>
        </button>
      )}
    </motion.div>
  );
}
