# LATAM Reportero — Session State
_Update this file at the end of every working session. This is the ground truth that survives context compaction._

---

## Architecture

| Layer | Platform | URL | Notes |
|---|---|---|---|
| Frontend (Next.js 14) | Netlify | `https://latamreportero.mx` | App Router, deployed from `frontend/` |
| Backend (FastAPI Python) | Railway | `https://latam-reportero-latest-may2026-production.up.railway.app` | Has its own `/api/sanity/*` routes in Python |
| CMS | Sanity | project `s5taeh5v`, dataset `production` | Studio deployed on Netlify separately |
| Database | Supabase | `mokeclqpedfeexavyxtl.supabase.co` | Used for writers/journalists data |

`NEXT_PUBLIC_BASE_URL` in `.env.local` points to **Railway** (the FastAPI backend), not the Next.js frontend.

---

## Deployment

**Root `netlify.toml`** (at `/netlify.toml`, not in `frontend/`):
```toml
[build]
  base = "frontend"
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

**Key**: `output: 'standalone'` was removed from `next.config.js` on 2026-05-30 — it was incompatible with Netlify's serverless runtime and was causing all `/api/*` routes to return 404.

---

## Environment Variables

### `.env.local` (frontend — never commit)
```
NEXT_PUBLIC_BASE_URL=https://latam-reportero-latest-may2026-production.up.railway.app
NEXT_PUBLIC_SUPABASE_URL=https://mokeclqpedfeexavyxtl.supabase.co
NEXT_PUBLIC_SANITY_PROJECT_ID=s5taeh5v
NEXT_PUBLIC_SANITY_DATASET=production
BEEHIIV_PUBLICATION_ID=a0db2d22-cf30-442f-8b4c-bcf22d0eb8e3
YOUTUBE_CHANNEL_ID=UC2bJenhiA52EeD22LzbqvJg
# Also present but redacted here: NEXT_PUBLIC_SUPABASE_ANON_KEY, SANITY_API_TOKEN,
# DEEPL_API_KEY, YOUTUBE_API_KEY, REVALIDATE_SECRET
```

### Netlify env vars (must be set in Netlify dashboard)
These need to match `.env.local` for production to work:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SANITY_PROJECT_ID` = `s5taeh5v`
- `NEXT_PUBLIC_SANITY_DATASET` = `production`
- `SANITY_API_TOKEN`
- `YOUTUBE_API_KEY`
- `YOUTUBE_CHANNEL_ID` = `UC2bJenhiA52EeD22LzbqvJg`
- `REVALIDATE_SECRET` = `latamreportero-revalidate-2026`
- `DEEPL_API_KEY`
- `BEEHIIV_PUBLICATION_ID`

---

## API Routes (Next.js frontend — `frontend/app/api/`)

| Route | File | Purpose |
|---|---|---|
| `GET /api/sanity/homepage` | `sanity/homepage/route.js` | Hero + morningBriefs + pressReviews + deepDives + latest |
| `GET /api/sanity/articles` | `sanity/articles/route.js` | Paginated list with filters (language/category/region) |
| `GET /api/sanity/article/[slug]` | `sanity/article/[slug]/route.js` | Single article + related |
| `POST /api/revalidate` | `revalidate/route.js` | Sanity webhook target — purges Next.js cache |
| `GET /api/revalidate` | `revalidate/route.js` | Manual cache purge (`?secret=X&path=/`) |
| `GET /api/videos/youtube` | `videos/youtube/route.js` | Fetches from @latamreportero YouTube channel |
| `GET /api/videos/oembed` | `videos/oembed/route.js` | Server-side proxy for TikTok/Instagram oEmbed |
| Also: `admin/`, `auth/`, `newsletter/`, `translate/`, `voicebot/` | various | Pre-existing routes |

---

## Sanity CMS

- **Project ID**: `s5taeh5v`
- **Dataset**: `production`
- **Studio**: Deployed on Netlify (separate site)
- **Schema files**: `studio/schemas/article.js`, `author.js`, `index.js`

### `article.js` fields (key ones)
- `contentType` — drives homepage section routing:
  - `morning-brief` → morningBriefs section
  - `press-review` → pressReviews section
  - `deep-dive` → deepDives/investigations section
  - `video-post`, `breaking`, `feature` (default)
- `status` — must be `"published"` to appear in frontend queries
- `language` — `"es"` / `"en"` / `"pt"`

### ⚠️ Known issue
Articles in Studio don't have `contentType` set. Homepage hero returns null until articles are published with a contentType. FastAPI backend hero filter: `contentType in ["morning-brief", "press-review"]`.

---

## Sanity Webhook

**Must be configured in Sanity → API → Webhooks:**
- URL: `https://latamreportero.mx/api/revalidate?secret=latamreportero-revalidate-2026`
- Method: POST
- Trigger: on publish/unpublish
- ⚠️ May currently be pointing to Railway URL (wrong) — needs updating

---

## Components Added/Modified

| File | What it does |
|---|---|
| `components/VideoModal.jsx` | Fullscreen YouTube iframe modal, Escape to close, scroll lock |
| `components/SocialVideo.jsx` | Homepage video section — fetches YouTube, click-to-play via VideoModal |
| `components/Footer.jsx` | Added Journalists link to Newsroom column |
| `app/watch/page.js` | Full Watch page — real YouTube videos + filter tabs (All/YT/TikTok/IG) |
| `app/writers/page.js` | Journalists page — dark hero, region filters, editorial card grid |
| `app/layout.js` | Favicon + Open Graph + Twitter Card meta tags |
| `app/icon.png` | Copied from `public/brand/logo-square.png` — serves as favicon |

---

## Open Graph / Social Sharing

Fixed 2026-05-30. OG image URLs use absolute `https://latamreportero.mx/brand/logo-square.png`.
`og:url` = `https://latamreportero.mx`.
Twitter card = `summary` (square image, no large image card).

---

## YouTube

- **Channel ID**: `UC2bJenhiA52EeD22LzbqvJg` (@latamreportero)
- **API route**: `GET /api/videos/youtube?maxResults=12`
- **Cache**: 1h server-side (`next: { revalidate: 3600 }`)
- Videos are 2-3min (not Shorts) — no duration filter applied
- Env vars: `YOUTUBE_API_KEY` + `YOUTUBE_CHANNEL_ID`

---

## Pending / To-Do

- [ ] **Verify Netlify redeploy worked** — after 2026-05-30 push, test `curl https://latamreportero.mx/api/revalidate?secret=latamreportero-revalidate-2026&path=/` — should return `{"revalidated":true}` not 404
- [ ] **Set Netlify env vars** — `REVALIDATE_SECRET`, `YOUTUBE_API_KEY`, `YOUTUBE_CHANNEL_ID` (Sanity + Supabase vars may already be set)
- [ ] **Update Sanity webhook URL** — change from Railway URL to `https://latamreportero.mx/api/revalidate?secret=latamreportero-revalidate-2026`
- [ ] **Set contentType on Sanity articles** — open each draft in Studio, set Content Type field, publish
- [ ] **TikTok/Instagram videos** — oEmbed proxy is built (`/api/videos/oembed`); need admin UI or config array to add URLs manually
- [ ] **Make.com automation** — social post + Beehiiv newsletter on article publish (not started)
- [ ] **Article pages** — `app/article/[slug]/page.js` may need building out (check if it exists and renders correctly)

---

## Git Remote

`https://github.com/Halchemy99/LATAM-REPORTERO-LATEST-MAY2026.git` — branch `main`

---
_Last updated: 2026-05-30_
