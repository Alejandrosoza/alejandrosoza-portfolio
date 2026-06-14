# Architecture

## System Overview

The site is a Next.js 15 App Router project deployed on Vercel. Content
(films, videos, photos, site configuration) is stored in Supabase
(Postgres + Auth + Storage) and rendered through localized public pages.
A protected admin panel writes to the same database via Supabase Auth and
Next.js API routes / server actions.

```
Browser ──> Vercel Edge Middleware (next-intl locale routing)
        ──> Next.js App Router (Server Components)
              ├── Public pages  ──> Supabase (read)
              ├── Admin pages   ──> Supabase (read/write, authenticated)
              └── API routes    ──> Supabase / Resend
```

## i18n Strategy

- **Routing**: `next-intl` middleware (`src/middleware.ts`) detects the
  visitor's browser language and redirects `/` to `/en`, `/es`, or `/fr`.
  All public and admin routes are nested under `app/[locale]/`.
- **UI strings**: stored per-locale in `messages/en.json`, `messages/es.json`,
  `messages/fr.json` and consumed via `useTranslations()` /
  `getTranslations()` from `next-intl`.
- **Database content**: multilingual fields are stored as parallel columns
  (`title_en`, `title_es`, `title_fr`, etc.) rather than separate rows or a
  translations table, keeping queries simple. The `localized()` helper
  (`src/lib/utils.ts`) resolves the correct field for the active locale and
  **falls back to English** when a translation hasn't been written yet.
- **SEO**: each locale layout generates its own `<title>`, description,
  Open Graph/Twitter metadata, and `alternates.languages` (hreflang) entries
  for `en`, `es`, `fr`, and `x-default`.

## Database Schema

### `films`

| Column                                    | Type      | Notes                                  |
| ------------------------------------------- | ----------- | ----------------------------------------- |
| `id`                                        | uuid (PK) | |
| `slug`                                      | text      | unique, used for `/films/[slug]`        |
| `title_en` / `title_es` / `title_fr`        | text      | film title per locale                   |
| `synopsis_en` / `synopsis_es` / `synopsis_fr` | text    | short synopsis per locale               |
| `statement_en` / `statement_es` / `statement_fr` | text | director's statement per locale       |
| `role_en` / `role_es` / `role_fr`           | text      | Alejandro's role on the project         |
| `credits`                                   | text      | cast/crew credits (plain text/markdown) |
| `category`                                  | text      | `short_film` \| `documentary` \| `narrative` \| `experimental` |
| `year`                                      | int       | production year                         |
| `month`                                     | int, null | optional production month               |
| `runtime_minutes`                           | int, null | runtime in minutes                      |
| `youtube_id`                                | text      | YouTube video ID for embed              |
| `thumbnail_url`                             | text      | poster/thumbnail image URL              |
| `behind_the_scenes`                         | text[]    | array of behind-the-scenes image URLs   |
| `tags`                                      | text[]    | freeform tags                           |
| `featured`                                  | boolean   | shown on homepage                       |
| `order_index`                               | int       | manual sort order                       |
| `created_at` / `updated_at`                 | timestamp | |

### `videos`

| Column                              | Type      | Notes                                |
| ------------------------------------- | ----------- | --------------------------------------- |
| `id`                                  | uuid (PK) | |
| `title_en` / `title_es` / `title_fr`  | text      | video title per locale                |
| `category`                            | text      | `commercial` \| `music_video` \| `other` |
| `year`                                 | int       | |
| `youtube_id`                          | text      | YouTube video ID for embed            |
| `thumbnail_url`                       | text      | thumbnail image URL                   |
| `order_index`                         | int       | manual sort order                     |
| `created_at`                          | timestamp | |

### `photos`

| Column                                       | Type      | Notes                          |
| ----------------------------------------------- | ----------- | ---------------------------------- |
| `id`                                            | uuid (PK) | |
| `title_en` / `title_es` / `title_fr`           | text      | photo title per locale          |
| `url`                                           | text      | Supabase Storage public URL     |
| `caption_en` / `caption_es` / `caption_fr`     | text, null| optional caption per locale     |
| `project_id`                                   | uuid, null| optional link to a `films` row  |
| `order_index`                                  | int       | manual sort order                |
| `created_at`                                   | timestamp | |

### `site_config`

Singleton table (one row) holding global settings.

| Column                                          | Type      | Notes                              |
| --------------------------------------------------- | ----------- | -------------------------------------- |
| `id`                                                 | uuid (PK) | |
| `showreel_youtube_id`                                | text      | homepage reel video                |
| `bio_short_en` / `bio_short_es` / `bio_short_fr`     | text      | short bio for homepage/about       |
| `bio_long_en` / `bio_long_es` / `bio_long_fr`        | text      | full bio for about page            |
| `cv_url`                                             | text, null| link to downloadable CV/resume     |
| `contact_email`                                      | text      | public contact email               |
| `instagram_url` / `vimeo_url` / `youtube_channel_url` / `letterboxd_url` | text, null | social links |

## API Routes

| Method | Path                      | Description                          | Auth        |
| -------- | --------------------------- | --------------------------------------- | ------------- |
| GET    | `/api/films`              | List all films                       | Public      |
| POST   | `/api/films`              | Create a new film                    | Admin only  |
| GET    | `/api/films/[id]`         | Get a single film                    | Public      |
| PUT    | `/api/films/[id]`         | Update a film                        | Admin only  |
| DELETE | `/api/films/[id]`         | Delete a film                        | Admin only  |
| GET    | `/api/videos`             | List all videos                      | Public      |
| POST   | `/api/videos`             | Create a new video                   | Admin only  |
| GET    | `/api/videos/[id]`        | Get a single video                   | Public      |
| PUT    | `/api/videos/[id]`        | Update a video                       | Admin only  |
| DELETE | `/api/videos/[id]`        | Delete a video                       | Admin only  |
| GET    | `/api/photos`             | List all photos                      | Public      |
| POST   | `/api/photos`             | Create a new photo                   | Admin only  |
| GET    | `/api/photos/[id]`        | Get a single photo                   | Public      |
| PUT    | `/api/photos/[id]`        | Update a photo                       | Admin only  |
| DELETE | `/api/photos/[id]`        | Delete a photo                       | Admin only  |
| POST   | `/api/contact`            | Submit the contact form (sends email via Resend) | Public |

All routes are currently scaffolded stubs returning `501 Not Implemented`
(or an empty list for `GET`) pending Supabase schema setup.

## Auth Strategy

- **Supabase Auth** with email/password (or magic link) for the single
  admin user.
- `ADMIN_EMAIL` defines the authorized admin account.
- `/[locale]/admin/**` routes check for an authenticated Supabase session
  matching `ADMIN_EMAIL` (via `src/lib/supabase-server.ts`) and redirect to
  a login flow if absent.
- Write-access API routes (`POST`/`PUT`/`DELETE`) verify the same session
  server-side before mutating data.

## Media Strategy

- **Video**: all films and videos are hosted on YouTube and embedded via
  `youtube_id` — no video files are stored in the project or Supabase.
- **Photography**: images are uploaded to **Supabase Storage** and
  referenced by public URL in the `photos` table.
- **Thumbnails**: `thumbnail_url` fields point to images in Supabase Storage
  or YouTube's thumbnail CDN.

## SEO Strategy

- Per-locale `generateMetadata` in `app/[locale]/layout.tsx` sets title
  templates, descriptions, Open Graph, and Twitter card metadata.
- `alternates.languages` provides hreflang links for `en`, `es`, `fr`, and
  `x-default`.
- A `sitemap.xml` and `robots.txt` will be generated covering all locale
  variants of each route (planned).
- Structured data: `Person` JSON-LD for Alejandro Soza on the about page and
  `CreativeWork`/`VideoObject` JSON-LD for each film detail page (planned).

## Performance Targets

- Lighthouse scores of **95+** for Performance, Accessibility, Best
  Practices, and SEO across all locales.
- Images served via `next/image` with responsive sizing.
- Fonts loaded via `next/font/google` with `display: swap` to avoid
  layout shift.
- Static generation (`generateStaticParams`) for all locale variants of
  public pages.
