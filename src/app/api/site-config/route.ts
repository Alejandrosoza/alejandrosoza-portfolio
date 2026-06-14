import {
  createPublicSupabaseClient,
  requireAuthenticatedSupabaseClient,
} from "@/lib/supabase-server";
import { buildSiteConfigPayload, normalizeTheatreProductions, sanitizeStringArray } from "@/lib/utils";
import { NextResponse } from "next/server";

function formatSiteConfig(data: Record<string, unknown>) {
  const theatreProductions = normalizeTheatreProductions(data as never);

  return {
    id: data.id,
    showreel_youtube_id: data.showreel_youtube_id,
    portrait_url: data.portrait_url ?? "",
    bio_short_en: data.bio_short_en,
    bio_short_es: data.bio_short_es,
    bio_short_fr: data.bio_short_fr,
    bio_long_en: data.bio_long_en,
    bio_long_es: data.bio_long_es,
    bio_long_fr: data.bio_long_fr,
    theatre_en: data.theatre_en,
    theatre_es: data.theatre_es,
    theatre_fr: data.theatre_fr,
    sports_en: data.sports_en,
    sports_es: data.sports_es,
    sports_fr: data.sports_fr,
    theatre_productions: theatreProductions,
    theatre_photos: sanitizeStringArray(data.theatre_photos),
    theatre_youtube_ids: sanitizeStringArray(data.theatre_youtube_ids),
    sports_photos: sanitizeStringArray(data.sports_photos),
    sports_youtube_ids: sanitizeStringArray(data.sports_youtube_ids),
    cv_url: data.cv_url,
    contact_email: data.contact_email,
    instagram_url: data.instagram_url,
    youtube_channel_url: data.youtube_channel_url,
    letterboxd_url: data.letterboxd_url,
    imdb_url: data.imdb_url,
  };
}

export async function GET() {
  try {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase.from("site_config").select("*").maybeSingle();
    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: "Site config not found" }, { status: 404 });
    }
    return NextResponse.json(formatSiteConfig(data));
  } catch {
    return NextResponse.json({ error: "Failed to fetch site config" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { supabase, user } = await requireAuthenticatedSupabaseClient();
    if (!supabase || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "Missing site config id" }, { status: 400 });
    }

    const payload = buildSiteConfigPayload(body);
    const { id, ...updates } = payload;

    const { data, error } = await supabase
      .from("site_config")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(formatSiteConfig(data));
  } catch {
    return NextResponse.json({ error: "Failed to update site config" }, { status: 500 });
  }
}
