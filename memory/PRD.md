# LATAM Reportero - Product Requirements Document

## Original Problem Statement
A solutions-oriented journalism platform for Latin America with:
- Credibility system for contributors
- Multilingual support (EN, ES, PT)
- Flexible CMS for modular content
- Crypto donations (ETH + BTC)
- Stripe subscriptions
- AI-powered content generation from RSS feeds

## Tech Stack
- **Frontend**: Next.js 15, React, Tailwind CSS, shadcn/ui
- **Backend**: FastAPI
- **Database & Auth**: Supabase (PostgreSQL, Storage, Auth)
- **CMS**: Sanity.io (NEW - replacing custom Supabase CMS)
- **AI**: GPT-5.2 (via Emergent LLM Key) for content processing
- **Translation**: DeepL API
- **Payments**: Stripe (implemented), MetaMask (pending)

## What's Been Implemented

### Core Features (DONE)
- [x] Full design overhaul with brand identity
- [x] New logo integrated
- [x] Supabase authentication (login/signup)
- [x] Human/AI content toggle with paywall
- [x] AI Search (GPT-5.2 powered natural language search)
- [x] Stripe integration for subscriptions
- [x] Crypto donation component (ETH + BTC wallets)

### RSS → Sanity Pipeline (DONE)
- [x] 22 RSS feeds configured (Reuters, AP, NYT, Guardian, BBC, LATAM outlets)
- [x] RSS feed fetching service
- [x] AI processing with GPT-5.2 (solutions journalism format)
- [x] DeepL translation to EN/ES/PT
- [x] Sanity CMS integration for draft creation
- [x] Articles tagged as "AI Generated"
- [x] Categories created in Sanity

### API Endpoints
- `GET /api/rss/feeds` - List all configured RSS feeds
- `GET /api/rss/test-feed/{key}` - Test single feed
- `POST /api/rss/ingest` - Trigger full ingestion pipeline
- `GET /api/rss/ingestion-logs` - View ingestion history
- `POST /api/ai-search` - AI-powered article search
- `POST /api/create-checkout-session` - Stripe checkout

### Crypto Wallets Configured
- **ETH**: `0xb5CDD659a06a6c89a69a8427e1A962A1AbDfF5ca`
- **BTC**: `bc1qaw8j4t8593hmtt5y9uzs4fkl2fmuh5lue40m8v`

## Sanity CMS Configuration
- **Project ID**: `s5taeh5v`
- **Dataset**: `production`
- **Categories**: Environment, Economy, Health, Education, Politics, Technology, Human Rights, Infrastructure, Agriculture, Energy
- **Article Schema**: title, slug, language, standfirst, body, category, region, isAiGenerated, status, sourceUrl, sourceFeed

## User Roles & Permissions
| Role | AI Content | Human Content | Submit Stories | Edit Stories | Admin |
|------|-----------|---------------|----------------|--------------|-------|
| Guest | ✅ | ❌ | ❌ | ❌ | ❌ |
| Free | ✅ | ❌ | ❌ | ❌ | ❌ |
| Subscriber | ✅ | ✅ | ❌ | ❌ | ❌ |
| Contributor | ✅ | ✅ | ✅ | ❌ | ❌ |
| Editor | ✅ | ✅ | ✅ | ✅ | ❌ |
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ |

## Admin Credentials
- Email: `oket.hoxha@gmail.com`
- Password: `emergent2030`

## Prioritized Backlog

### P0 - Complete ✅
1. Sanity CMS setup
2. RSS ingestion pipeline
3. AI content processing
4. DeepL translation
5. Human/AI toggle with paywall

### P1 - Next Steps
1. **Connect Frontend to Sanity** - Replace Supabase CMS with Sanity for article display
2. **Sanity Studio UI** - Set up hosted studio for editors
3. **MetaMask Integration** - Web3 wallet connection for donations

### P2 - Medium Priority
1. Scheduled ingestion (production cron job)
2. Editorial workflow dashboard
3. Article approval/rejection flow

### P3 - Future
1. Real-time collaboration in Sanity
2. Advanced analytics dashboard
3. Push notifications for new articles

## Files of Reference
- `/app/backend/rss_config.py` - RSS feed configuration
- `/app/backend/rss_ingestion.py` - Main ingestion pipeline
- `/app/backend/setup_sanity.py` - Sanity schema setup
- `/app/backend/run_scheduled_ingestion.py` - Cron job script
- `/app/frontend/components/ContentModeToggle.jsx` - Human/AI toggle
- `/app/frontend/components/CryptoDonationButton.jsx` - Crypto donations
- `/app/frontend/components/AISearchBar.jsx` - AI search

## Environment Variables
```
# Backend
SANITY_PROJECT_ID=s5taeh5v
SANITY_DATASET=production
SANITY_API_TOKEN=sk3uAraMF...
DEEPL_API_KEY=09d2abac-51e7-479c-8fa7-6964fd6117a3:fx
EMERGENT_LLM_KEY=sk-emergent-...
SUPABASE_URL=https://yrvrpmoidlvrtukvrvnv.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
STRIPE_API_KEY=sk_test_...
```

## Preview URL
https://reportero-cms.preview.emergentagent.com

## Sanity Dashboard
https://www.sanity.io/manage/project/s5taeh5v
