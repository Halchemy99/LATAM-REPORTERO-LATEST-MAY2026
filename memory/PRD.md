# LATAM Reportero — Product Requirements Document

## Original Problem Statement
A solutions-oriented journalism platform for Latin America. Automated pipeline: RSS feeds from reputable outlets -> AI rewriting (GPT-5.2) -> DeepL translation -> Sanity.io CMS -> Next.js frontend. Design follows investigative journalism aesthetic (Bellingcat/Financial Times style).

## Architecture
- **Frontend**: Next.js 15 (App Router)
- **Backend**: FastAPI (Python)
- **CMS**: Sanity.io (headless, project ID: s5taeh5v)
- **Database**: MongoDB (users, comments)
- **Auth**: JWT + bcrypt (MongoDB-backed)
- **Integrations**: OpenAI GPT-5.2 (Emergent LLM Key), DeepL, MetaMask/ethers.js, Stripe

## What's Been Implemented

### P0 — Sanity.io CMS Integration (2026-03-27)
- Backend proxy endpoints: `/api/sanity/articles`, `/api/sanity/articles/all`, `/api/sanity/article/{slug}`
- Homepage fetches live articles from Sanity (by language)
- Article detail page renders Portable Text body content
- 31 articles published (11 EN, 10 ES, 10 PT)

### P0 — Comments System — Paid Users Only (2026-03-27)
- `POST /api/comments` — creates comment (paid/subscriber/contributor/editor/admin roles only)
- `GET /api/comments/{article_slug}` — fetches comments for an article
- Free/guest users see gated message instead of comment form

### P0 — MongoDB+JWT Auth System (2026-03-27)
- `POST /api/auth/signup` — register new user (bcrypt hashing, JWT token)
- `POST /api/auth/login` — login with email/password
- `GET /api/auth/me` — get current user from JWT
- Clean login/signup pages matching editorial design
- Replaced deprecated Supabase auth dependency

### P0 — Header, Footer, Search Redesign (2026-03-27)
- Header: Deep plum nav bar, integrated AI search bar (accessible via icon on ALL pages), regions dropdown, content mode toggle
- Footer: Editorial deep plum design with Journalism/Community/Transparency/Stay Informed sections
- Search bar is now sticky across all pages (built into Header)

### P1 — Production RSS Scheduler (2026-03-27)
- Replaced broken crontab with asyncio background task in FastAPI
- Runs every 3 hours automatically

### Earlier Work (Previous Sessions)
- AI-powered search bar (GPT-5.2)
- Human/AI content toggle with paywall logic
- MetaMask Web3 crypto donations
- Transparency and Community pages
- Bellingcat-style dense grid layout
- RSS ingestion pipeline (rss_ingestion.py)

## Prioritized Backlog

### P1 — Content Gating & Paywall Enhancement
- Human-written articles gated behind subscriber paywall (partially done)
- Community WhatsApp links locked for non-subscribers

### P2 — Full Dynamic Sanity Components
- Charts, Maps, Inline annotations in article renderer

### P2 — Daily Digest Newsletter
- AI-powered email newsletter summarizing top stories
- Drive subscriber retention and re-engagement

### P2 — SEO / GEO / AEO Optimization
- Metadata exports, structured data, Open Graph tags

### P2 — Legacy Cleanup
- Remove obsolete Supabase CMS code (lib/supabase/*)

### P3 — OpenAI Whisper & YouTube Embeds
- Audio playback and Whisper transcription UI
- Dynamic YouTube embeds in articles

## Key API Endpoints
- `POST /api/auth/signup` — Register new user
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Current user (requires Bearer token)
- `GET /api/sanity/articles?language=en` — Fetch articles by language
- `GET /api/sanity/article/{slug}` — Fetch single article
- `POST /api/comments` — Create comment (paid roles only)
- `GET /api/comments/{slug}` — Get comments for article
- `POST /api/ai-search` — AI-powered article search
- `GET /api/rss/fetch-feeds` — Trigger RSS ingestion

## Credentials
- Admin: oket.hoxha@gmail.com / emergent2030 (role: admin)
- Sanity Studio: sanity.io/manage (project s5taeh5v)
