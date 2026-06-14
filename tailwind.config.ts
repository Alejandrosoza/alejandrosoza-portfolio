import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "film-black": "#0a0a0a",
        "film-dark": "#111111",
        "film-gray": "#2a2a2a",
        "film-muted": "#6b6b6b",
        "film-cream": "#f0ece4",
        "film-sepia": "#e8d5b7",
        "film-gold": "#c9a96e",
        "film-white": "#fafaf9",
      },
      fontFamily: {
        heading: ["var(--font-cormorant)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      fontSize: {
        "type-label": ["0.6875rem", { lineHeight: "1.4" }], // 11px — section labels, captions
        "type-ui": ["0.75rem", { lineHeight: "1.4" }], // 12px — buttons, tabs, metadata
        "type-nav": ["0.8125rem", { lineHeight: "1.5" }], // 13px — nav, table cells
        "type-body-sm": ["0.875rem", { lineHeight: "1.5" }], // 14px — small body
        "type-body": ["0.9375rem", { lineHeight: "1.6" }], // 15px — inputs, links
        "type-copy": ["1rem", { lineHeight: "1.7" }], // 16px — reading text
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s ease-out",
        "fade-in": "fade-in 1s ease",
      },
    },
  },
  plugins: [],
};

export default config;
