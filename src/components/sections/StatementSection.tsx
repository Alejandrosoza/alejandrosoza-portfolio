"use client";

import { motion } from "framer-motion";

export default function StatementSection() {
  return (
    <section className="relative bg-film-black">
      <div className="h-px w-full bg-film-gray/30" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="container-film flex flex-col items-center py-20 text-center md:py-[120px]"
      >
        <p className="max-w-[700px] font-heading text-[24px] font-light italic leading-relaxed text-film-cream/80 md:text-[36px]">
          —Every frame is a decision. Every cut is a statement. Cinema is the
          language I am learning to speak.—
        </p>
        <p className="mt-6 font-body text-[10px] uppercase tracking-[0.3em] text-film-gold">
          — Alejandro Soza
        </p>
      </motion.div>

      <div className="h-px w-full bg-film-gray/30" />
    </section>
  );
}
