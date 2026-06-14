import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ExternalLink } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import ContactForm from "@/components/sections/ContactForm";
import type { SiteConfig } from "@/lib/types";

export const metadata: Metadata = {
  title: "Contact | Alejandro Soza",
};

export default async function ContactPage() {
  const supabase = await createServerSupabaseClient();
  const t = await getTranslations("contact");

  const { data: config } = await supabase.from("site_config").select("*").single();
  const siteConfig = config as SiteConfig | null;

  const email = siteConfig?.contact_email || "hello@alejandrosoza.ca";

  const socials = [
    { label: "Instagram", url: siteConfig?.instagram_url },
    { label: "YouTube", url: siteConfig?.youtube_channel_url },
    { label: "Letterboxd", url: siteConfig?.letterboxd_url },
    { label: "IMDb", url: siteConfig?.imdb_url },
  ].filter((social): social is { label: string; url: string } => Boolean(social.url));

  return (
    <div className="min-h-screen">
      <div className="container-film pb-16 pt-40">
        <p className="font-body text-[9px] uppercase tracking-[0.5em] text-film-cream/30">
          {t("getInTouch")}
        </p>
        <h1 className="mt-4 font-heading text-[48px] font-light leading-tight text-film-cream md:text-[80px]">
          {t("title")}
        </h1>
        <div className="mt-8 h-px w-full bg-film-gray" />
      </div>

      <div className="container-film flex flex-col gap-16 py-20 lg:flex-row">
        <div className="lg:w-[40%]">
          <p className="mb-8 font-heading text-[32px] font-light italic text-film-cream/60">
            {t("letsTalk")}
          </p>

          <div className="flex flex-col gap-6">
            <div>
              <p className="font-body text-[9px] uppercase tracking-[0.3em] text-film-cream/30">
                {t("email")}
              </p>
              <p className="mt-1 font-body text-sm text-film-cream/70">{email}</p>
            </div>
            <div>
              <p className="font-body text-[9px] uppercase tracking-[0.3em] text-film-cream/30">
                {t("location")}
              </p>
              <p className="mt-1 font-body text-sm text-film-cream/70">
                Whitehorse, Yukon, Canada
              </p>
            </div>
          </div>

          {socials.length > 0 && (
            <div className="mt-10">
              <p className="font-body text-[9px] uppercase tracking-[0.4em] text-film-cream/30">
                {t("findMeOn")}
              </p>
              <div className="mt-4 flex flex-col gap-3">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 font-body text-[11px] tracking-wider text-film-cream/50 transition-colors duration-300 hover:text-film-gold"
                  >
                    {social.label}
                    <ExternalLink size={10} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:w-[60%]">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
