"use client";

import { useEffect } from "react";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-film-black px-6 text-center">
      <p className="font-body text-type-label uppercase tracking-[0.4em] text-film-cream/40">
        Something went wrong
      </p>
      <h1 className="mt-4 font-heading text-3xl font-light text-film-cream">
        Couldn’t load this page
      </h1>
      <button
        type="button"
        onClick={reset}
        className="mt-10 border border-film-cream/30 px-8 py-3 font-body text-type-ui uppercase tracking-[0.3em] text-film-cream transition-colors hover:border-film-gold hover:text-film-gold"
      >
        Try again
      </button>
    </div>
  );
}
