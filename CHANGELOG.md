# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.0.0] — Production Release

### Added

- `robots.txt` with sitemap reference.
- Dynamic `sitemap.xml` (static pages + all film slugs, trilingual).
- JSON-LD schema: Person (global) + Movie (per film).
- Open Graph image (edge runtime, cinematic dark design).
- Resend email integration for contact form.
- Security headers via `vercel.json`.
- Next.js performance: avif/webp images, compression, cache headers.
- Production deployment to Vercel.

## [0.2.0] - 2026-06-13

### Added

- Supabase browser and server clients configured.
- Database schema: `films`, `videos`, `photos`, `site_config` tables with RLS.
- Cloudinary SDK integrated with folder structure and URL helper.
- API routes: GET/POST/PUT/DELETE for films, videos, photos.
- Utility functions: `localized()`, `extractYouTubeId()`,
  `getYouTubeThumbnail()`, `formatFilmDate()`, `slugify()`.
- Constants: site config, categories, nav links.

## [0.1.0] - 2026-06-13

### Added

- Initial scaffold: Next.js 15 (App Router, TypeScript, Tailwind CSS).
- Trilingual i18n with `next-intl` (English, Spanish, French) and locale
  routing middleware.
- Project folder structure for public site, admin panel, and API routes.
- Shared TypeScript type system (`Film`, `Video`, `Photo`, `SiteConfig`,
  `Locale`) and the `localized()` fallback helper.
- Supabase browser and server client setup (`@supabase/ssr`).
- Tailwind theme extension with custom film-themed color palette,
  typography, and animations.
- Global styles: dark theme, custom scrollbar, film grain overlay.
- Project documentation: README, ARCHITECTURE, CONTRIBUTING.
