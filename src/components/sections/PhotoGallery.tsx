"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import PhotoLightbox from "@/components/ui/PhotoLightbox";
import { getOptimizedImageUrl } from "@/lib/cloudinary-url";
import { localized } from "@/lib/utils";
import type { Locale, Photo } from "@/lib/types";

interface PhotoGalleryProps {
  photos: Photo[];
  locale: Locale;
}

export default function PhotoGallery({ photos, locale }: PhotoGalleryProps) {
  const t = useTranslations("photography");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (photos.length === 0) {
    return (
      <div className="container-film py-12">
        <p className="py-24 text-center font-heading text-2xl italic text-film-cream/30">
          {t("noPhotos")}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="container-film py-12">
        <div className="columns-1 [column-gap:2px] sm:columns-2 lg:columns-3">
          {photos.map((photo, index) => (
            <PhotoItem
              key={photo.id}
              photo={photo}
              locale={locale}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>

      <PhotoLightbox
        photos={photos}
        initialIndex={activeIndex ?? 0}
        isOpen={activeIndex !== null}
        onClose={() => setActiveIndex(null)}
        locale={locale}
      />
    </>
  );
}

function PhotoItem({
  photo,
  locale,
  onClick,
}: {
  photo: Photo;
  locale: Locale;
  onClick: () => void;
}) {
  const title = localized(photo, "title", locale);
  const caption = localized(photo, "caption", locale);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative mb-0.5 block w-full overflow-hidden text-left"
    >
      <Image
        src={getOptimizedImageUrl(photo.url, { width: 800 })}
        alt={title || "Photo"}
        width={800}
        height={1000}
        className="aspect-auto w-full object-cover"
      />
      <div className="absolute inset-0 flex flex-col justify-end bg-black/0 transition-colors duration-300 group-hover:bg-black/50">
        {(title || caption) && (
          <div className="translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
            {title && (
              <p className="font-body text-type-label uppercase tracking-wider text-film-gold">
                {title}
              </p>
            )}
            {caption && (
              <p className="mt-1 font-body text-type-nav italic text-film-cream/80">{caption}</p>
            )}
          </div>
        )}
      </div>
    </button>
  );
}
