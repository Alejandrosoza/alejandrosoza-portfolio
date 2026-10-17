"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Play } from "lucide-react";
import {
  getYouTubeNamespace,
  loadYouTubeAPI,
  type YouTubePlayerInstance,
} from "@/lib/youtube-api";
import { getYouTubeThumbnail, mountYouTubeEmbed } from "@/lib/utils";

export type YouTubePlayerHandle = {
  play: () => void;
};

interface YouTubePlayerProps {
  youtubeId: string;
  title: string;
  className?: string;
  /** Try to start playback as soon as the API player is ready (may fail on iOS). */
  autoPlay?: boolean;
}

/**
 * Warm YouTube IFrame API player under a facade. play() from a user tap calls
 * playVideo() so mobile browsers allow unmuted playback without a second tap
 * on YouTube's red button. Falls back to a gesture-mounted iframe if the API
 * is still loading.
 */
const YouTubePlayer = forwardRef<YouTubePlayerHandle, YouTubePlayerProps>(
  function YouTubePlayer(
    { youtubeId, title, className = "", autoPlay = false },
    ref
  ) {
    const hostRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<YouTubePlayerInstance | null>(null);
    const [playing, setPlaying] = useState(false);
    const autoPlayRef = useRef(autoPlay);
    autoPlayRef.current = autoPlay;

    useEffect(() => {
      let cancelled = false;
      const host = hostRef.current;
      if (!host || !youtubeId) return;

      host.replaceChildren();
      const placeholder = document.createElement("div");
      placeholder.className = "h-full w-full";
      host.appendChild(placeholder);

      loadYouTubeAPI().then(() => {
        if (cancelled) return;
        const YT = getYouTubeNamespace();
        if (!YT) return;

        playerRef.current = new YT.Player(placeholder, {
          width: "100%",
          height: "100%",
          videoId: youtubeId,
          playerVars: {
            autoplay: 0,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            color: "white",
            origin: window.location.origin,
          },
          events: {
            onReady: (event) => {
              if (cancelled) return;
              if (autoPlayRef.current) {
                try {
                  event.target.playVideo();
                  setPlaying(true);
                } catch {
                  // Autoplay blocked — facade stays until user taps.
                }
              }
            },
            onStateChange: (event) => {
              if (event.data === YT.PlayerState.PLAYING) {
                setPlaying(true);
              }
            },
          },
        });
      });

      return () => {
        cancelled = true;
        try {
          playerRef.current?.destroy();
        } catch {
          // ignore
        }
        playerRef.current = null;
        host.replaceChildren();
      };
    }, [youtubeId]);

    const play = useCallback(() => {
      if (!youtubeId) return;

      const player = playerRef.current;
      if (player?.playVideo) {
        player.playVideo();
        setPlaying(true);
        return;
      }

      // API still loading — mount autoplay iframe inside this click gesture.
      const host = hostRef.current;
      if (!host) return;
      mountYouTubeEmbed(host, youtubeId, title);
      setPlaying(true);
    }, [youtubeId, title]);

    useImperativeHandle(ref, () => ({ play }), [play]);

    return (
      <div className={`relative aspect-video w-full overflow-hidden bg-film-dark ${className}`}>
        <div
          ref={hostRef}
          className="absolute inset-0 [&>iframe]:absolute [&>iframe]:inset-0 [&>iframe]:h-full [&>iframe]:w-full [&>div]:h-full [&>div]:w-full"
        />

        {!playing && (
          <button
            type="button"
            onClick={play}
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
);

export default YouTubePlayer;
