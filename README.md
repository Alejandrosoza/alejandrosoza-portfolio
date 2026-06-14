# Alejandro Soza — Film Director Portfolio

Trilingual (EN/ES/FR) portfolio site for Alejandro Soza, an emerging film
director based in Whitehorse, Yukon, Canada. Built for a Cinema & Media Arts
university application portfolio.

**Live site:** https://alejandrosoza.ca

## Tech Stack

| Layer          | Technology                                  |
| -------------- | -------------------------------------------- |
| Framework      | Next.js 15 (App Router, TypeScript)         |
| Styling        | Tailwind CSS                                |
| Animation      | Framer Motion                               |
| Icons          | Lucide React                                |
| i18n           | next-intl (en / es / fr)                    |
| Database/Auth  | Supabase (Postgres, Auth, Storage)          |
| Email          | Resend                                      |
| Video          | YouTube embeds                              |
| Hosting        | Vercel                                      |

## Features

- Trilingual UI (English, Spanish, French) with locale-prefixed routing
- Public site: home, films, film detail, videos, photography, about, contact
- Admin panel for managing films, videos, photos, and site settings
- Contact form with email notifications via Resend
- YouTube-embedded showreel and film pages
- Photography gallery backed by Supabase Storage
- SEO: per-locale metadata, hreflang alternates, Open Graph, Twitter cards

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment template and fill in your values:

   ```bash
   cp .env.example .env.local
   ```

3. Run the dev server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) — you'll be redirected
   to `/en` (default locale).

## Folder Structure

```
src/
  app/
    [locale]/
      (public)/
        page.tsx                 # Homepage
        films/page.tsx           # Films grid
        films/[slug]/page.tsx    # Single film detail page
        videos/page.tsx          # Commercials / music videos grid
        photography/page.tsx     # Photo gallery
        about/page.tsx           # Director bio
        contact/page.tsx         # Contact form
        layout.tsx               # Public layout (navbar + footer)
      admin/
        page.tsx                 # Admin dashboard
        films/page.tsx           # Manage films
        films/new/page.tsx       # Add film
        films/[id]/edit/page.tsx # Edit film
        videos/page.tsx          # Manage videos
        photos/page.tsx          # Manage photos
        settings/page.tsx        # Showreel, bio, socials
        layout.tsx               # Admin layout (protected)
      layout.tsx                 # Locale root layout (fonts, metadata, i18n)
    api/
      films/route.ts             # GET all / POST
      films/[id]/route.ts        # GET / PUT / DELETE
      videos/route.ts
      videos/[id]/route.ts
      photos/route.ts
      photos/[id]/route.ts
      contact/route.ts           # POST contact form submissions
    globals.css
  components/
    layout/                      # Navbar, footer, shared layout pieces
    ui/                          # Reusable UI primitives
    sections/                    # Page sections (hero, grids, etc.)
    admin/                       # Admin-only components
  lib/
    supabase.ts                  # Supabase browser client
    supabase-server.ts           # Supabase server client (SSR)
    types.ts                     # Shared TypeScript types
    utils.ts                     # Helpers (e.g. localized field lookup)
    constants.ts                 # Site-wide constants
  hooks/                          # Custom React hooks
  i18n/
    routing.ts                   # next-intl locale routing config
    request.ts                   # next-intl request config (messages)
  middleware.ts                  # Locale detection & routing middleware
messages/
  en.json                        # English UI strings
  es.json                        # Spanish UI strings
  fr.json                        # French UI strings
```

## Environment Variables

| Variable                        | Description                                              |
| -------------------------------- | --------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`        | Supabase project URL                                     |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`   | Supabase anonymous/public API key                        |
| `SUPABASE_SERVICE_ROLE_KEY`       | Supabase service role key (server-only, bypasses RLS)    |
| `NEXT_PUBLIC_SITE_URL`            | Canonical site URL, used for metadata/SEO                |
| `ADMIN_EMAIL`                     | Email address granted access to `/admin`                 |
| `RESEND_API_KEY`                  | API key for sending contact form notification emails     |

## Trilingual Content Model

There are two layers of translation in this project:

1. **UI strings** (navigation, buttons, labels) live in `messages/en.json`,
   `messages/es.json`, and `messages/fr.json` and are managed by `next-intl`.
2. **Database content** (films, videos, photos) stores each translatable
   field three times — e.g. `title_en`, `title_es`, `title_fr`. The
   `localized()` helper in `src/lib/utils.ts` reads the field for the
   current locale and **falls back to English** if a translation is missing,
   so content can be added in English first and translated later without
   breaking the site.

## Admin Panel

The admin panel lives under `/[locale]/admin` (e.g. `/en/admin`) and is
restricted to the email address set in `ADMIN_EMAIL` via Supabase Auth.
From the dashboard you can:

- Add, edit, and reorder **films** (including synopsis, statement, role,
  credits, and behind-the-scenes images in all three languages)
- Manage **videos** (commercials, music videos)
- Manage the **photography** gallery
- Update **site settings**: showreel, bio, CV, and social links

## Deployment (Vercel)

1. Push the repository to GitHub.
2. Import the project into [Vercel](https://vercel.com/new).
3. Add all variables from `.env.example` to the Vercel project's
   Environment Variables settings.
4. Deploy — Vercel will build with `next build` automatically.
5. Point `alejandrosoza.ca` at the Vercel deployment via custom domain
   settings.

## Git Branch Strategy

- `main` — always deployable; production deploys from this branch.
- `feature/<short-description>` — new features and pages.
- `fix/<short-description>` — bug fixes.

Open a pull request into `main` for review before merging.
