import type { Locale } from "./types";

/**
 * Returns a localized field value (e.g. `title_en`/`title_es`/`title_fr`)
 * from a record, falling back to English if the requested locale is missing.
 */
export function localized<T extends Record<string, unknown>>(
  obj: T,
  field: string,
  locale: Locale
): string {
  return (
    (obj[`${field}_${locale}`] as string) ||
    (obj[`${field}_en`] as string) ||
    ""
  );
}

/**
 * Convert a YouTube URL (watch, share, or embed form) to its video ID.
 * If the input doesn't match a known URL pattern, it's returned as-is.
 */
export function extractYouTubeId(input: string): string {
  if (!input) return "";
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) return match[1];
  }
  return input.trim();
}

/**
 * Build a YouTube thumbnail URL for a given video ID and quality.
 */
export function getYouTubeThumbnail(
  youtubeId: string,
  quality: "default" | "hq" | "maxres" = "maxres"
): string {
  if (!youtubeId) return "";
  return `https://img.youtube.com/vi/${youtubeId}/${quality}default.jpg`;
}

/**
 * Format a film's year and optional month for display.
 */
export function formatFilmDate(year: number, month?: number): string {
  if (!month) return String(year);
  const date = new Date(year, month - 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

/**
 * Generate a URL-friendly slug from a title.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
