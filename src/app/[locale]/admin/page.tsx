import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createServerSupabaseClient();

  const [{ count: filmsCount }, { count: videosCount }, { count: photosCount }] =
    await Promise.all([
      supabase.from("films").select("*", { count: "exact", head: true }),
      supabase.from("videos").select("*", { count: "exact", head: true }),
      supabase.from("photos").select("*", { count: "exact", head: true }),
    ]);

  const stats = [
    { label: "Films", value: String(filmsCount ?? 0) },
    { label: "Videos", value: String(videosCount ?? 0) },
    { label: "Photos", value: String(photosCount ?? 0) },
    { label: "Site Status", value: "Live" },
  ];

  const quickActions = [
    { label: "Add Film", href: `/${locale}/admin/films/new` },
    { label: "Add Video", href: `/${locale}/admin/videos` },
    { label: "Upload Photos", href: `/${locale}/admin/photos` },
    { label: "Edit Settings", href: `/${locale}/admin/settings` },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="border border-[#2a2a2a] p-6">
            <p className="font-body text-type-label uppercase tracking-[0.3em] text-film-cream/30">
              {stat.label}
            </p>
            <p
              className={`mt-2 font-heading text-[48px] font-light ${
                stat.label === "Site Status" ? "text-film-gold" : "text-film-cream"
              }`}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <p className="mb-4 font-body text-type-label uppercase tracking-[0.3em] text-film-cream/30">
          Quick Actions
        </p>
        <div className="flex flex-wrap gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="border border-[#2a2a2a] px-6 py-3 font-body text-type-ui tracking-wider text-film-cream/60 transition-colors duration-300 hover:border-film-gold hover:text-film-cream"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
