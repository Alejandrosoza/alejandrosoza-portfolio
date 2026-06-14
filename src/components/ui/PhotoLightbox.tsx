"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { getOptimizedImageUrl } from "@/lib/cloudinary-url";
import { localized } from "@/lib/utils";
import type { Locale, Photo } from "@/lib/types";

interface PhotoLightboxProps {
  photos: Photo[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
}

const SWIPE_THRESHOLD = 50;

export default function PhotoLightbox({
  photos,
  initialIndex,
  isOpen,
  onClose,
  locale,
}: PhotoLightboxProps) {
  const t = useTranslations("photography");
  const [index, setIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) setIndex(initialIndex);
  }, [isOpen, initialIndex]);

  const goTo = (next: number) => {
    setDirection(next > index ? 1 : -1);
    setIndex(((next % photos.length) + photos.length) % photos.length);
  };

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") goTo(index + 1);
      if (event.key === "ArrowLeft") goTo(index - 1);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, index, onClose]);

  if (photos.length === 0) return null;

  const photo = photos[index];
  const title = localized(photo, "title", locale);
  const caption = localized(photo, "caption", locale);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/[0.98] p-6"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-6 top-6 text-film-cream/60 transition-colors duration-300 hover:text-film-cream"
          >
            <X size={28} />
          </button>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  goTo(index - 1);
                }}
                aria-label="Previous photo"
                className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-film-gray bg-black/60 text-film-cream/60 transition-colors duration-300 hover:border-film-gold hover:text-film-cream md:left-8"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  goTo(index + 1);
                }}
                aria-label="Next photo"
                className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-film-gray bg-black/60 text-film-cream/60 transition-colors duration-300 hover:border-film-gold hover:text-film-cream md:right-8"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          <div
            className="relative flex h-[85vh] w-[90vw] items-center justify-center overflow-hidden"
            onClick={(event) => event.stopPropagation()}
            onTouchStart={(event) => {
              touchStartX.current = event.touches[0].clientX;
            }}
            onTouchEnd={(event) => {
              if (touchStartX.current === null) return;
              const delta = event.changedTouches[0].clientX - touchStartX.current;
              if (delta > SWIPE_THRESHOLD) goTo(index - 1);
              else if (delta < -SWIPE_THRESHOLD) goTo(index + 1);
              touchStartX.current = null;
            }}
          >
            <AnimatePresence initial={false} mode="wait" custom={direction}>
              <motion.div
                key={photo.id}
                custom={direction}
                initial={{ opacity: 0, x: direction >= 0 ? 80 : -80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction >= 0 ? -80 : 80 }}
                transition={{ duration: 0.3 }}
                className="relative h-full w-full"
              >
                <Image
                  src={getOptimizedImageUrl(photo.url, { width: 1600 })}
                  alt={title || "Photo"}
                  fill
                  className="object-contain"
                  sizes="90vw"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {(title || caption) && (
            <div className="mt-4 max-w-2xl text-center font-body text-type-nav text-film-cream/60">
              {title && (
                <p className="font-body text-type-label uppercase tracking-wider text-film-gold">
                  {title}
                </p>
              )}
              {caption && <p className="mt-1">{caption}</p>}
            </div>
          )}

          <p
            className="absolute bottom-6 left-1/2 -translate-x-1/2 font-body text-type-label text-film-cream/30"
            aria-label={`${t("photoCounter")} ${index + 1} / ${photos.length}`}
          >
            {index + 1} / {photos.length}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
