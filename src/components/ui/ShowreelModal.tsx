"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { mountYouTubeEmbed } from "@/lib/utils";

const PLACEHOLDER_YOUTUBE_ID = "dQw4w9WgXcQ";

interface ShowreelModalProps {
  isOpen: boolean;
  onClose: () => void;
  youtubeId: string;
}

export default function ShowreelModal({ isOpen, onClose, youtubeId }: ShowreelModalProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const videoId = youtubeId || PLACEHOLDER_YOUTUBE_ID;

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    const node = mountRef.current;
    if (!node) return;
    mountYouTubeEmbed(node, videoId, "Showreel");
    return () => {
      node.replaceChildren();
    };
  }, [isOpen, videoId]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-6 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-[900px]"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute -top-10 right-0 text-film-cream/60 transition-colors duration-300 hover:text-film-cream"
            >
              <X size={28} />
            </button>
            <div className="relative aspect-video w-full overflow-hidden bg-black">
              <div ref={mountRef} className="absolute inset-0" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
