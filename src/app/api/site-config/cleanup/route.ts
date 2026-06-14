import { requireAuthenticatedSupabaseClient } from "@/lib/supabase-server";
import {
  filterReachablePhotoUrls,
  legacyTheatreGalleryFromProductions,
  normalizeTheatreProductions,
  sanitizeStringArray,
  sanitizeTheatreProductions,
} from "@/lib/utils";
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

/** Removes duplicate and unreachable gallery photo URLs from site_config. */
export async function POST() {
  try {
    const { supabase, user } = await requireAuthenticatedSupabaseClient();
    if (!supabase || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase.from("site_config").select("*").maybeSingle();
    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: "Site config not found" }, { status: 404 });
    }

    const theatreBefore = sanitizeStringArray(data.theatre_photos);
    const sportsBefore = sanitizeStringArray(data.sports_photos);
    const productionsBefore = normalizeTheatreProductions(data as never);

    const theatreAfter = await filterReachablePhotoUrls(theatreBefore);
    const sportsAfter = await filterReachablePhotoUrls(sportsBefore);

    const productionsAfter = await Promise.all(
      productionsBefore.map(async (production) => ({
        ...production,
        photos: await filterReachablePhotoUrls(sanitizeStringArray(production.photos)),
      }))
    );

    const removed = {
      theatre: theatreBefore.filter((url) => !theatreAfter.includes(url)),
      sports: sportsBefore.filter((url) => !sportsAfter.includes(url)),
      theatre_productions: productionsBefore.flatMap((production) =>
        production.photos.filter(
          (url) =>
            !productionsAfter
              .find((item) => item.id === production.id)
              ?.photos.includes(url)
        )
      ),
    };

    const legacyTheatre = legacyTheatreGalleryFromProductions(productionsAfter);
    const changed =
      theatreBefore.length !== theatreAfter.length ||
      sportsBefore.length !== sportsAfter.length ||
      JSON.stringify(productionsBefore) !== JSON.stringify(productionsAfter);

    if (!changed) {
      return NextResponse.json({ config: formatSiteConfig(data), removed, changed: false });
    }

    const { data: updated, error: updateError } = await supabase
      .from("site_config")
      .update({
        theatre_productions: sanitizeTheatreProductions(productionsAfter),
        theatre_photos: legacyTheatre.theatre_photos,
        sports_photos: sportsAfter,
        theatre_youtube_ids: sanitizeStringArray(data.theatre_youtube_ids),
        sports_youtube_ids: sanitizeStringArray(data.sports_youtube_ids),
      })
      .eq("id", data.id)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({
      config: formatSiteConfig(updated),
      removed,
      changed: true,
    });
  } catch {
    return NextResponse.json({ error: "Failed to clean gallery" }, { status: 500 });
  }
}
