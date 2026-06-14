"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { LOCALES, NAV_LINKS } from "@/lib/constants";
import { switchLocalePath } from "@/lib/utils";
import type { Locale } from "@/lib/types";

export default function Navbar() {
  const pathname = usePathname();
  const params = useParams();
  const locale = (params?.locale as Locale) || "en";

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href: string) => {
    const target = `/${locale}${href}`;
    return pathname === target || pathname.startsWith(`${target}/`);
  };

  const LanguageSwitcher = ({ className = "" }: { className?: string }) => (
    <div className={`flex items-center gap-2 font-body text-type-body tracking-[0.15em] ${className}`}>
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
  );

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ease-in-out border-b ${
          scrolled
            ? "bg-film-black border-film-gray"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="container-film flex h-16 items-center justify-between md:h-[72px]">
          <Link href={`/${locale}`} className="flex flex-col leading-none">
            <span className="font-heading text-[15px] font-semibold tracking-widest text-film-cream">
              ALEJANDRO SOZA
            </span>
            <span className="mt-1 font-body text-type-label tracking-[0.3em] uppercase text-film-gold">
              Film Director
            </span>
          </Link>

          <nav className="hidden items-center gap-10 md:flex">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={`/${locale}${link.href}`}
                  className={`border-b pb-1 font-body text-type-body tracking-[0.15em] uppercase transition-colors duration-300 ${
                    active
                      ? "border-film-gold text-film-cream"
                      : "border-transparent text-film-cream/70 hover:border-film-gold hover:text-film-cream"
                  }`}
                >
                  {link.label[locale]}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-6">
            <LanguageSwitcher className="hidden md:flex" />

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="text-film-cream transition-colors duration-300 hover:text-film-gold md:hidden"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-film-black md:hidden"
          >
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={`/${locale}${link.href}`}
                  className={`font-body text-type-copy tracking-[0.25em] uppercase transition-colors duration-300 ${
                    active ? "text-film-cream" : "text-film-cream/70 hover:text-film-cream"
                  }`}
                >
                  {link.label[locale]}
                </Link>
              );
            })}

            <LanguageSwitcher className="mt-8 text-type-nav" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
