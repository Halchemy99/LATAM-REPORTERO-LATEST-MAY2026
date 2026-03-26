# LATAM Reportero - Product Requirements Document

## Original Problem Statement
A solutions-oriented journalism platform for Latin America with:
- Credibility system for contributors
- Multilingual support (EN, ES, PT)
- Sanity CMS for content management
- Crypto donations (ETH + BTC with MetaMask)
- Stripe subscriptions
- AI-powered content generation from RSS feeds

## Tech Stack
- **Frontend**: Next.js 15, React, Tailwind CSS, shadcn/ui
- **Backend**: FastAPI
- **Database & Auth**: Supabase (PostgreSQL, Storage, Auth)
- **CMS**: Sanity.io (Project ID: s5taeh5v)
- **AI**: GPT-5.2 (via Emergent LLM Key) for content processing
- **Translation**: DeepL API
- **Payments**: Stripe
- **Crypto**: MetaMask (ethers.js) for ETH donations

## Design System (Editorial Theme)
- **Primary**: Deep Plum (#23103A) - authoritative, professional
- **Background**: Newspaper Cream (#F7F5F2)
- **Accent**: Terracotta (#D35A3D) - LATAM warmth
- **AI Indicator**: Purple (#6B38D6)
- **Headlines**: Cormorant Garamond (serif)
- **Body**: Inter (sans-serif)
- **Metadata**: IBM Plex Mono (monospace)
- **Borders**: Sharp corners (0 radius) - editorial style

## What's Been Implemented

### Core Features ✅
- [x] Mature editorial design (newspaper aesthetic)
- [x] New logo integrated
- [x] Human/AI content toggle with paywall
- [x] AI Search (GPT-5.2 powered)
- [x] Stripe integration for subscriptions
- [x] MetaMask crypto donations (ETH)
- [x] BTC donation address copy

### Sanity CMS ✅
- [x] Project connected: s5taeh5v
- [x] 10 categories created
- [x] Article schema configured
- [x] Sanity client library created

### RSS → AI → Sanity Pipeline ✅
- [x] 22 RSS feeds configured
- [x] GPT-5.2 content processing
- [x] DeepL translation (EN/ES/PT)
- [x] Drafts created in Sanity (AI-tagged)

### Crypto Wallets
- **ETH**: `0xb5CDD659a06a6c89a69a8427e1A962A1AbDfF5ca`
- **BTC**: `bc1qaw8j4t8593hmtt5y9uzs4fkl2fmuh5lue40m8v`

## User Roles & Content Access
| Role | AI Content | Human Content | Features |
|------|-----------|---------------|----------|
| Guest | ✅ Free | ❌ Locked | Basic browsing |
| Free | ✅ Free | ❌ Locked | Account features |
| Subscriber | ✅ Free | ✅ Unlocked | Full access |
| Editor | ✅ Free | ✅ Unlocked | CMS access |
| Admin | ✅ Free | ✅ Unlocked | Full admin |

## API Endpoints
- `GET /api/rss/feeds` - List RSS feeds
- `POST /api/rss/ingest` - Trigger ingestion
- `POST /api/ai-search` - AI-powered search
- `POST /api/create-checkout-session` - Stripe

## Files of Reference
- `/app/frontend/app/globals.css` - Editorial design system
- `/app/frontend/components/Header.jsx` - Main navigation
- `/app/frontend/components/ContentModeToggle.jsx` - Human/AI toggle
- `/app/frontend/components/CryptoDonationButton.jsx` - MetaMask integration
- `/app/frontend/lib/sanity/client.js` - Sanity queries
- `/app/backend/rss_config.py` - RSS feed configuration
- `/app/backend/rss_ingestion.py` - Content pipeline

## Prioritized Backlog

### P0 - Complete ✅
1. Mature editorial design
2. Human/AI toggle with paywall
3. MetaMask crypto donations
4. Sanity CMS setup
5. RSS ingestion pipeline

### P1 - Next Steps
1. **Connect Frontend to Sanity** - Display Sanity articles
2. **Sanity Studio UI** - Set up hosted editor dashboard
3. **3-hour cron job** - Production scheduler

### P2 - Medium Priority
1. Rich content blocks (audio, video, embeds)
2. Editorial workflow dashboard
3. Article approval/rejection flow

## Admin Credentials
- Email: `oket.hoxha@gmail.com`
- Password: `emergent2030`

## Preview URL
https://reportero-cms.preview.emergentagent.com

## Sanity Dashboard
https://www.sanity.io/manage/project/s5taeh5v
