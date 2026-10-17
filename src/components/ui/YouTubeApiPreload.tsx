"use client";

import { useEffect } from "react";
import { loadYouTubeAPI } from "@/lib/youtube-api";

/** Warm the YouTube IFrame API so the first play tap can call playVideo(). */
export default function YouTubeApiPreload() {
  useEffect(() => {
    void loadYouTubeAPI();
  }, []);

  return null;
}
