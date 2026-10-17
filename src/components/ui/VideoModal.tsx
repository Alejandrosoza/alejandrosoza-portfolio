"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import YouTubePlayer from "@/components/ui/YouTubePlayer";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  youtubeId: string;
  title: string;
}

export default function VideoModal({ isOpen, onClose, youtubeId, title }: VideoModalProps) {
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

  return (
    <AnimatePresence>
      {isOpen && youtubeId && (
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
            {/*
              Keep the warm API player under the facade. The poster click that
              opened this modal is a separate gesture; one tap on the facade
              calls playVideo() and should start audio on mobile.
            */}
            <YouTubePlayer youtubeId={youtubeId} title={title} />
            <p className="mt-4 text-center font-heading text-lg text-film-cream/70">{title}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
