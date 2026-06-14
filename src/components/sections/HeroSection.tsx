"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import ShowreelModal from "@/components/ui/ShowreelModal";

interface HeroSectionProps {
  showreelId: string;
  locale: string;
}

export default function HeroSection({ showreelId, locale }: HeroSectionProps) {
  const [showreelOpen, setShowreelOpen] = useState(false);
  const t = useTranslations("home");

  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 30% 50%, #1a1410 0%, #0a0a0a 70%)",
      }}
    >
      {/* Decorative film frame lines */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-[20%] right-[20%] top-20 h-px bg-film-gray opacity-60" />
        <div className="absolute bottom-20 left-[20%] right-[20%] h-px bg-film-gray opacity-60" />
        <div className="absolute left-[60px] top-[30%] h-[40%] w-px bg-film-gray opacity-60" />
        <div className="absolute right-[60px] top-[30%] h-[40%] w-px bg-film-gray opacity-60" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-body text-[9px] uppercase tracking-[0.4em] text-film-cream/40"
        >
          Whitehorse, Yukon — Canada
        </motion.p>

        <div className="mt-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="font-heading text-[52px] font-light italic leading-[0.9] text-film-cream md:text-[96px]"
          >
            Alejandro
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            style={{
              textShadow:
                "-1px -1px 0 #c9a96e, 1px -1px 0 #c9a96e, -1px 1px 0 #c9a96e, 1px 1px 0 #c9a96e",
            }}
            className="font-heading text-[52px] font-semibold leading-[0.9] text-film-cream md:text-[96px]"
          >
            Soza
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="my-6 h-px w-[120px] bg-film-gold"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.95 }}
          className="font-body text-[11px] uppercase tracking-[0.5em] text-film-gold"
        >
          Film Director
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.2 }}
          className="mt-12 flex flex-col items-center gap-6 sm:flex-row"
        >
          <Link
            href={`/${locale}/films`}
            className="border border-film-cream/30 px-8 py-3 font-body text-[10px] uppercase tracking-[0.3em] text-film-cream transition-colors duration-[400ms] hover:border-film-gold hover:text-film-gold"
          >
            {t("viewWork")}
          </Link>

          <button
            type="button"
            onClick={() => setShowreelOpen(true)}
            className="flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.2em] text-film-cream/40 transition-colors duration-[400ms] hover:text-film-cream/70"
          >
            <Play size={12} fill="currentColor" />
            {t("watchReel")}
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 right-10 hidden flex-col items-center gap-3 md:flex">
        <span
          className="font-body text-[9px] tracking-[0.3em] text-film-cream/20"
          style={{ writingMode: "vertical-rl" }}
        >
          SCROLL
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="text-film-cream/20"
        >
          <ArrowDown size={14} />
        </motion.div>
      </div>

      <ShowreelModal
        isOpen={showreelOpen}
        onClose={() => setShowreelOpen(false)}
        youtubeId={showreelId}
      />
    </section>
  );
}
