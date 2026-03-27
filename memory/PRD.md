# LATAM Reportero — Product Requirements Document

## Original Problem Statement
A solutions-oriented journalism platform for Latin America. The platform uses an automated pipeline: RSS feeds from reputable outlets → AI rewriting (GPT-5.2) → DeepL translation → published to Sanity.io CMS → rendered on Next.js frontend. The design follows a serious, investigative journalism aesthetic (Bellingcat/Financial Times style).

## Architecture
- **Frontend**: Next.js 15 (App Router)
- **Backend**: FastAPI (Python)
- **CMS**: Sanity.io (headless, project ID: s5taeh5v)
- **Database**: MongoDB (comments, user accounts)
- **Integrations**: OpenAI GPT-5.2 (via Emergent LLM Key), DeepL, MetaMask/ethers.js, Stripe

## What's Been Implemented

### P0 — Sanity.io CMS Integration ✅ (2026-03-27)
- Backend proxy endpoints: `/api/sanity/articles`, `/api/sanity/articles/all`, `/api/sanity/article/{slug}`
- Homepage fetches live articles from Sanity (by language)
- Article detail page renders Portable Text body content
- 31 articles published (11 EN, 10 ES, 10 PT)

### P0 — Comments System (Paid Users Only) ✅ (2026-03-27)
- `POST /api/comments` — creates comment (paid/subscriber/contributor/editor/admin roles only)
- `GET /api/comments/{article_slug}` — fetches comments for an article
- Free/guest users see gated message instead of comment form
- Frontend comment UI with auth gating

### P1 — Production RSS Scheduler ✅ (2026-03-27)
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

### P1 — Content Gating & Paywall (In Progress)
- Human-written articles gated behind subscriber paywall
- Community WhatsApp links locked for non-subscribers

### P2 — SEO / GEO / AEO Optimization
- Metadata exports in layout.js and page.js
- Structured data, Open Graph tags
- AI-engine visibility

### P2 — Legacy Cleanup
- Remove obsolete Supabase CMS code (lib/supabase/*)
- Remove old editor routes

### P2 — OpenAI Whisper & YouTube Embeds
- Audio playback and Whisper transcription UI
- Dynamic YouTube embeds in articles
- Update Sanity schema for media types

### P3 — Full Dynamic Sanity Components
- Charts, Maps, Inline annotations in article renderer

## Credentials
- Admin: oket.hoxha@gmail.com / emergent2030
- Sanity Studio: sanity.io/manage (project s5taeh5v)
