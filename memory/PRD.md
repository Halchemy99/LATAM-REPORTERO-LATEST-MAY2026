# LATAM Reportero - Product Requirements Document

## Original Problem Statement
A solutions-oriented journalism platform for Latin America with:
- Credibility system for contributors  
- Multilingual support (EN, ES, PT)
- Sanity CMS for content management
- Crypto donations (ETH + BTC with MetaMask)
- Stripe subscriptions
- AI-powered content generation from RSS feeds
- Bellingcat-style investigative journalism aesthetic

## Current Session Updates (March 2026)

### Completed ✅
1. **Twitter/X Removed** - Removed from Footer and all social links
2. **New Header Structure**:
   - Logo → Regions (dropdown) → Community → Transparency → Funding
   - AI/Human toggle → Language → Login/Join
3. **Regions Dropdown** - Full LATAM coverage:
   - South America: Argentina, Bolivia, Brazil, Chile, Colombia, Ecuador, Guyana, Paraguay, Peru, Suriname, Uruguay, Venezuela
   - Central America: Belize, Costa Rica, El Salvador, Guatemala, Honduras, Nicaragua, Panama
   - Mexico
   - Caribbean: Cuba, Dominican Republic, Haiti, Jamaica, Puerto Rico, Trinidad & Tobago
   - Topics: Investigations, Analysis, Good News, On the Ground
4. **Thin Global Search Bar** - Claude-like design under header with voice capability (Whisper)
5. **Transparency Page** - Full editorial standards with content tagging explanation:
   - Human / AI-Assisted / AI tagging system
   - Funding transparency
   - Editorial process
6. **Community Page** - Gated WhatsApp/Signal groups:
   - 8 regional groups (Mexico, Brazil, Argentina, Colombia, Chile, Peru, Central America, Caribbean)
   - Locked for non-subscribers with sell/upgrade CTA
   - Platform toggle (WhatsApp/Signal)
7. **Article Tagging** - Human/AI-Assisted/AI badges defined
8. **MetaMask Integration** - ETH wallet connection for donations
9. **Mature Editorial Design** - Deep plum + cream + terracotta

### In Progress 🔄
1. **Homepage Layout Redesign** - Moving from tabloid hero style to Bellingcat-style:
   - Dense story grid (more stories visible)
   - Equal-sized cards
   - 20% video embeds from YouTube
   - Less big headlines, more content density

### Remaining Tasks 📋
1. **Homepage Grid Refactor** - Implement dense story grid layout
2. **Video Embed Integration** - 20% of articles show YouTube previews
3. **AI/Human Badges on Articles** - Add visual indicators to all article cards
4. **SEO/GEO/AEO Optimization** - Structured data, meta tags, semantic HTML
5. **Connect Frontend to Sanity** - Replace Supabase article display with Sanity
6. **Community Group Links** - Configure actual WhatsApp/Signal invite URLs

## User Access & Gating

| Feature | Guest | Free | Subscriber | Editor | Admin |
|---------|-------|------|------------|--------|-------|
| AI Articles | ✅ | ✅ | ✅ | ✅ | ✅ |
| Human Articles | ❌ | ❌ | ✅ | ✅ | ✅ |
| Community Groups | ❌ | ❌ | ✅ | ✅ | ✅ |
| Voice Search | ✅ | ✅ | ✅ | ✅ | ✅ |
| AI Search | ✅ | ✅ | ✅ | ✅ | ✅ |
| Editorial Dashboard | ❌ | ❌ | ❌ | ✅ | ✅ |

## Content Tagging System
- **Human** (Green badge) - Written entirely by human journalists. Subscriber-only.
- **AI-Assisted** (Amber badge) - Human-written with AI research/translation. Subscriber-only.  
- **AI** (Purple badge) - AI-generated from RSS sources. Free to all.

## Transparency Statement
> LATAM Reportero is independently funded. No wire copy. No press releases. 
> Every story tagged Human, AI-Assisted or AI so you know exactly what you're reading.

## Files Updated This Session
- `/app/frontend/components/Header.jsx` - New nav structure with Regions dropdown
- `/app/frontend/components/GlobalSearchBar.jsx` - NEW: Thin search bar with voice
- `/app/frontend/components/Footer.jsx` - Twitter removed
- `/app/frontend/app/transparency/page.js` - Full transparency page
- `/app/frontend/app/community/page.js` - Gated community groups
- `/app/frontend/app/page.js` - Added GlobalSearchBar import
- `/app/backend/server.py` - Added /api/transcribe endpoint for Whisper

## Tech Stack
- Frontend: Next.js 15, React, Tailwind CSS, shadcn/ui
- Backend: FastAPI
- Database & Auth: Supabase
- CMS: Sanity.io (Project: s5taeh5v)
- AI: GPT-5.2 (content), Whisper (voice)
- Translation: DeepL
- Payments: Stripe, MetaMask (ETH)

## Crypto Wallets
- **ETH**: `0xb5CDD659a06a6c89a69a8427e1A962A1AbDfF5ca`
- **BTC**: `bc1qaw8j4t8593hmtt5y9uzs4fkl2fmuh5lue40m8v`

## Preview URL
https://reportero-cms.preview.emergentagent.com

## Admin Credentials
- Email: `oket.hoxha@gmail.com`
- Password: `emergent2030`
