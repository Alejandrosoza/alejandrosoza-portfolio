# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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
