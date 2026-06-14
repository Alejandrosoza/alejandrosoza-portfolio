"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { LOCALES, NAV_LINKS } from "@/lib/constants";
import { switchLocalePath } from "@/lib/utils";
import type { Locale } from "@/lib/types";

const SOCIAL_LINKS = [
  { label: "Instagram", href: "#" },
  { label: "YouTube", href: "#" },
  { label: "Letterboxd", href: "#" },
  { label: "IMDb", href: "#" },
];

export default function Footer() {
  const pathname = usePathname();
  const params = useParams();
  const locale = (params?.locale as Locale) || "en";

  return (
    <footer className="border-t border-film-gray bg-film-black">
      <div className="container-film pt-12 pb-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Left */}
          <div className="flex flex-col">
            <span className="font-heading text-[13px] font-semibold tracking-widest text-film-cream">
              ALEJANDRO SOZA
            </span>
            <span className="mt-1 font-body text-[9px] tracking-[0.3em] uppercase text-film-gold">
              Film Director
            </span>
            <span className="mt-2 font-body text-[10px] text-film-cream/40">
              Whitehorse, Yukon, Canada
            </span>
          </div>

          {/* Center */}
          <div className="flex flex-col items-center gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                className="font-body text-[10px] tracking-[0.15em] uppercase text-film-cream/50 transition-colors duration-300 hover:text-film-cream"
              >
                {link.label[locale]}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="flex flex-col items-center gap-4 md:items-end">
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="font-body text-[10px] tracking-wider text-film-cream/50 transition-colors duration-300 hover:text-film-gold"
                >
                  {label}
                </a>
              ))}
            </div>
            <span className="font-body text-[9px] text-film-cream/30">
              © 2024 Alejandro Soza. All rights reserved.
            </span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center gap-4 border-t border-[#1a1a1a] pt-4 md:flex-row md:items-center md:justify-between">
          <span className="font-body text-[9px] text-film-cream/20">
            Built with purpose.
          </span>

          <div className="flex items-center gap-2 font-body text-[10px] tracking-widest">
            {LOCALES.map((loc, i) => (
              <span key={loc} className="flex items-center gap-2">
                <Link
                  href={switchLocalePath(pathname, loc, LOCALES)}
                  className={`transition-colors duration-300 ${
                    loc === locale
                      ? "text-film-gold"
                      : "text-film-cream/40 hover:text-film-cream"
                  }`}
                >
                  {loc.toUpperCase()}
                </Link>
                {i < LOCALES.length - 1 && <span className="text-film-cream/20">|</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
