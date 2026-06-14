import type { Locale, SiteConfig } from "./types";

/**
 * Normalizes gallery array fields: trim, drop empty, dedupe (preserve order).
 */
export function sanitizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of value) {
    const trimmed = String(item).trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    result.push(trimmed);
  }
  return result;
}

/** Returns only photo URLs that respond with HTTP 2xx. */
export async function filterReachablePhotoUrls(urls: string[]): Promise<string[]> {
  const checks = await Promise.all(
    urls.map(async (url) => {
      try {
        const response = await fetch(url, {
          method: "GET",
          signal: AbortSignal.timeout(8000),
        });
        return response.ok ? url : null;
      } catch {
        return null;
      }
    })
  );
  return checks.filter((url): url is string => url !== null);
}

/**
 * Builds an explicit site_config update payload with sanitized gallery arrays.
 */
export function buildSiteConfigPayload(config: SiteConfig) {
  return {
    id: config.id,
    showreel_youtube_id: config.showreel_youtube_id ?? "",
    bio_short_en: config.bio_short_en ?? "",
    bio_short_es: config.bio_short_es ?? "",
    bio_short_fr: config.bio_short_fr ?? "",
    bio_long_en: config.bio_long_en ?? "",
    bio_long_es: config.bio_long_es ?? "",
    bio_long_fr: config.bio_long_fr ?? "",
    theatre_en: config.theatre_en ?? "",
    theatre_es: config.theatre_es ?? "",
    theatre_fr: config.theatre_fr ?? "",
    sports_en: config.sports_en ?? "",
    sports_es: config.sports_es ?? "",
    sports_fr: config.sports_fr ?? "",
    theatre_photos: sanitizeStringArray(config.theatre_photos),
    theatre_youtube_ids: sanitizeStringArray(config.theatre_youtube_ids),
    sports_photos: sanitizeStringArray(config.sports_photos),
    sports_youtube_ids: sanitizeStringArray(config.sports_youtube_ids),
    cv_url: config.cv_url ?? "",
    contact_email: config.contact_email ?? "",
    instagram_url: config.instagram_url ?? "",
    youtube_channel_url: config.youtube_channel_url ?? "",
    letterboxd_url: config.letterboxd_url ?? "",
    imdb_url: config.imdb_url ?? "",
  };
}

/**
 * Returns a localized field value (e.g. `title_en`/`title_es`/`title_fr`)
 * from a record, falling back to English if the requested locale is missing.
 */
export function localized<T extends object>(
  obj: T,
  field: string,
  locale: Locale
): string {
  const record = obj as Record<string, unknown>;
  return (
    (record[`${field}_${locale}`] as string) ||
    (record[`${field}_en`] as string) ||
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
 * Replace the locale segment of a pathname (e.g. `/en/films` -> `/es/films`).
 * Falls back to prefixing the target locale if no locale segment is present.
 */
export function switchLocalePath(
  pathname: string,
  targetLocale: string,
  locales: readonly string[]
): string {
  const pattern = new RegExp(`^/(${locales.join("|")})(?=/|$)`);
  return pattern.test(pathname)
    ? pathname.replace(pattern, `/${targetLocale}`)
    : `/${targetLocale}${pathname}`;
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
