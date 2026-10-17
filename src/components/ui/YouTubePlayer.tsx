"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { getYouTubeEmbedUrl, getYouTubeThumbnail, YOUTUBE_IFRAME_ALLOW } from "@/lib/utils";

interface YouTubePlayerProps {
  youtubeId: string;
  title: string;
  className?: string;
}

function useCoarsePointer(): boolean {
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none), (pointer: coarse)");
    const sync = () => setCoarse(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return coarse;
}

/**
 * Mobile: show the native YouTube iframe immediately (one tap on YouTube play).
 * Desktop: custom facade; click injects an autoplay iframe in the same gesture.
 *
 * Avoids the YouTube IFrame API, which was causing client-side crashes for some users.
 */
export default function YouTubePlayer({
  youtubeId,
  title,
  className = "",
}: YouTubePlayerProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const coarsePointer = useCoarsePointer();

  if (!youtubeId) {
    return (
      <div
        className={`relative aspect-video w-full bg-film-dark ${className}`}
        aria-label={title}
      />
    );
  }

  // Phones/tablets: native embed — no custom play layer that fails to autoplay.
  if (coarsePointer) {
    return (
      <div className={`relative aspect-video w-full overflow-hidden bg-film-dark ${className}`}>
        <iframe
          src={getYouTubeEmbedUrl(youtubeId, { autoplay: false })}
          title={title}
          allow={YOUTUBE_IFRAME_ALLOW}
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    );
  }

  const handlePlay = () => {
    const host = hostRef.current;
    if (!host || playing) return;

    host.replaceChildren();
    const iframe = document.createElement("iframe");
    iframe.src = getYouTubeEmbedUrl(youtubeId, { autoplay: true });
    iframe.title = title;
    iframe.allow = YOUTUBE_IFRAME_ALLOW;
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.className = "absolute inset-0 h-full w-full border-0";
    host.appendChild(iframe);
    setPlaying(true);
  };

  return (
    <div className={`relative aspect-video w-full overflow-hidden bg-film-dark ${className}`}>
      <div ref={hostRef} className="absolute inset-0" />

      {!playing && (
        <button
          type="button"
          onClick={handlePlay}
          aria-label={`Play ${title}`}
          className="group absolute inset-0 z-10 block h-full w-full"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${getYouTubeThumbnail(youtubeId, "maxres")})`,
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-2 border-film-cream/60 bg-black/40 backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:border-film-gold">
              <Play size={28} className="text-film-cream" fill="currentColor" />
            </div>
          </div>
        </button>
      )}
    </div>
  );
}
