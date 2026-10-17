export type YouTubePlayerInstance = {
  playVideo: () => void;
  pauseVideo: () => void;
  destroy: () => void;
};

type YouTubePlayerConstructor = new (
  element: HTMLElement | string,
  config: {
    width?: string | number;
    height?: string | number;
    videoId?: string;
    playerVars?: Record<string, string | number>;
    events?: {
      onReady?: (event: { target: YouTubePlayerInstance }) => void;
      onStateChange?: (event: { data: number; target: YouTubePlayerInstance }) => void;
    };
  }
) => YouTubePlayerInstance;

type YouTubeNamespace = {
  Player: YouTubePlayerConstructor;
  PlayerState: {
    PLAYING: number;
    PAUSED: number;
    ENDED: number;
    BUFFERING: number;
    CUED: number;
  };
};

declare global {
  interface Window {
    YT?: YouTubeNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<void> | null = null;

/** Load the YouTube IFrame API once (shared across players). */
export function loadYouTubeAPI(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();

  if (!apiPromise) {
    apiPromise = new Promise<void>((resolve) => {
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previous?.();
        resolve();
      };

      if (!document.getElementById("youtube-iframe-api")) {
        const script = document.createElement("script");
        script.id = "youtube-iframe-api";
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        document.head.appendChild(script);
      }
    });
  }

  return apiPromise;
}

export function getYouTubeNamespace(): YouTubeNamespace | null {
  return typeof window !== "undefined" && window.YT?.Player ? window.YT : null;
}
