"use client";

import { motion } from "framer-motion";
import YouTubePlayer from "@/components/ui/YouTubePlayer";

interface YouTubeEmbedProps {
  youtubeId: string;
  title: string;
}

export default function YouTubeEmbed({ youtubeId, title }: YouTubeEmbedProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full"
    >
      <YouTubePlayer youtubeId={youtubeId} title={title} />
    </motion.div>
  );
}
