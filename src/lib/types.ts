export type Locale = "en" | "es" | "fr";

export type FilmCategory =
  | "short_film"
  | "documentary"
  | "narrative"
  | "experimental";

export type VideoCategory = "commercial" | "music_video" | "other";

export interface Film {
  id: string;
  slug: string;
  title_en: string;
  title_es: string;
  title_fr: string;
  synopsis_en: string;
  synopsis_es: string;
  synopsis_fr: string;
  statement_en: string;
  statement_es: string;
  statement_fr: string;
  role_en: string;
  role_es: string;
  role_fr: string;
  credits: string;
  category: FilmCategory;
  year: number;
  month?: number;
  runtime_minutes?: number;
  youtube_id: string;
  thumbnail_url: string;
  behind_the_scenes: string[];
  tags: string[];
  featured: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Video {
  id: string;
  title_en: string;
  title_es: string;
  title_fr: string;
  category: VideoCategory;
  year: number;
  youtube_id: string;
  thumbnail_url: string;
  order_index: number;
  created_at: string;
}

export interface Photo {
  id: string;
  title_en: string;
  title_es: string;
  title_fr: string;
  url: string;
  caption_en?: string;
  caption_es?: string;
  caption_fr?: string;
  order_index: number;
  created_at: string;
}

export interface SiteConfig {
  id: string;
  showreel_youtube_id: string;
  bio_short_en: string;
  bio_short_es: string;
  bio_short_fr: string;
  bio_long_en: string;
  bio_long_es: string;
  bio_long_fr: string;
  theatre_en: string;
  theatre_es: string;
  theatre_fr: string;
  sports_en: string;
  sports_es: string;
  sports_fr: string;
  theatre_photos: string[];
  theatre_youtube_ids: string[];
  sports_photos: string[];
  sports_youtube_ids: string[];
  cv_url?: string;
  contact_email: string;
  instagram_url?: string;
  youtube_channel_url?: string;
  letterboxd_url?: string;
  imdb_url?: string;
}
