"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { getYouTubeThumbnail, mountYouTubeEmbed } from "@/lib/utils";

interface YouTubeEmbedProps {
  youtubeId: string;
  title: string;
}

export default function YouTubeEmbed({ youtubeId, title }: YouTubeEmbedProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    if (!youtubeId || !mountRef.current || playing) return;
    // Mount the iframe inside the click handler so autoplay is allowed.
    mountYouTubeEmbed(mountRef.current, youtubeId, title);
    setPlaying(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative aspect-video w-full bg-film-dark"
    >
      <div ref={mountRef} className="absolute inset-0" />

      {!playing && (
        <button
          type="button"
          onClick={handlePlay}
          aria-label={`Play ${title}`}
          className="group absolute inset-0 z-10 block h-full w-full"
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
