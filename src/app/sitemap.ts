import { MetadataRoute } from "next";
import { createAdminSupabaseClient } from "@/lib/supabase-server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://alejandrosoza.ca";
  const locales = ["en", "es", "fr"];
  const staticPages = ["", "/films", "/videos", "/photography", "/about", "/contact"];

  const staticRoutes = staticPages.flatMap((page) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: page === "" ? 1.0 : 0.8,
    }))
  );

  try {
    const supabase = await createAdminSupabaseClient();
    const { data: films } = await supabase
      .from("films")
      .select("slug, updated_at")
      .order("order_index");

    const filmRoutes = (films || []).flatMap((film) =>
      locales.map((locale) => ({
        url: `${baseUrl}/${locale}/films/${film.slug}`,
        lastModified: new Date(film.updated_at),
        changeFrequency: "monthly" as const,
        priority: 0.9,
      }))
    );
    return [...staticRoutes, ...filmRoutes];
  } catch {
    return staticRoutes;
  }
}
