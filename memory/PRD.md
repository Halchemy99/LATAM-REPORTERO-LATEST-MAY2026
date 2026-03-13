# LATAM Reportero - Product Requirements Document

## Project Overview
LATAM Reportero is a solutions-oriented journalism publishing platform for Latin America built with Next.js 14, Supabase (PostgreSQL), and Tailwind CSS + shadcn/ui.

## Tech Stack
- **Frontend:** Next.js 14 App Router, Tailwind CSS, shadcn/ui
- **Backend:** FastAPI (Python) + Supabase (Auth + PostgreSQL)
- **Database:** Supabase PostgreSQL with `users`, `articles`, `bookmarks`, `polls`, `poll_votes` tables

## User Personas
1. **Readers** - Consume journalism content, free and paid tiers
2. **Contributors** - Journalists submitting stories
3. **Editors** - Review and approve content
4. **Admins** - Manage users, content, and platform settings
5. **Donors** - Support independent journalism via subscriptions and crypto

## Core Requirements

### 1. Trust/Credibility System (Implemented)
- ❌ NO numerical trust scores or star ratings
- ✅ Reddit-like contributor reputation system:
  - Verified Contributor badge
  - Editorial Staff badge
  - Long-time Contributor (years) badge
  - Editorially Reviewed badge
  - Article count display
  - Upvote count display

### 2. Language System (Implemented)
- ✅ Active Languages: English, Spanish, Portuguese
- ✅ Indigenous Languages (Coming Soon):
  - Quechua (Runasimi) - ~10M speakers
  - Aymara (Aymar aru) - ~2.5M speakers
  - Guaraní (Avañe'ẽ) - ~6M speakers
  - Nahuatl (Nāhuatl) - ~1.7M speakers
  - Yucatec Maya - ~800K speakers
  - Mapudungun - ~250K speakers
  - K'iche' - ~1M speakers
  - Tzeltal - ~500K speakers
- ✅ "Coming Soon" dialog when indigenous language selected

### 3. CMS Editor (Implemented - Component Ready)
- ✅ ArticleEditor component created with blocks:
  - Paragraph, Heading (H2/H3/H4)
  - Quote blocks with attribution
  - Image with caption
  - Image Gallery
  - YouTube embed
  - TikTok embed
  - Investigation Timeline
  - Expandable sections
  - Lists (bulleted/numbered)
  - Custom embed code
- ✅ Preview mode
- ✅ Block reordering

### 4. Design Direction (Updated Dec 2025)
- ✅ Brand Guidelines Implementation:
  - **Primary Colors:** Light Purple (#8c52ff), Dark Purple (#6111ff)
  - **Secondary Colors:** Offset Beige (#E7DAC4), Brand White (#f9f6f6), Off-Black (#1a1919)
- ✅ Typography:
  - Headlines: Raleway (bold, sans-serif)
  - Subheadings: Marcellus (elegant serif)
  - Body: Source Serif 4 / Times New Roman Medium
  - Captions: Source Serif 4 Italic
- ✅ Purple gradient buttons and accents
- ✅ Beige category tags
- ✅ Editorial grid layout
- ✅ Podcast/Video section with purple gradient background
- ✅ Stats bar with gradient text
- ✅ Newsletter section with purple gradient

### 5. Crypto Donations (Implemented)
- ✅ MetaMask integration
- ✅ Supported: ETH, BTC, USDC, ADA
- ✅ Manual address copy for BTC/ADA
- ✅ Direct transaction for ETH/USDC
- ✅ Transaction confirmation flow

### 6. Community Reporting (Implemented)
- ✅ Community page with regional groups
- ✅ Signal group links per region
- ✅ WhatsApp group links per region
- ✅ Regions: Mexico, Brazil, Argentina, Colombia, Chile, Peru, Venezuela, Central America
- ✅ Security notice recommending Signal
- ✅ Community guidelines

### 7. Newsletter System (Implemented)
- ✅ Newsletter component with variants:
  - Default (card style)
  - Inline (for article pages)
  - Footer (compact)
  - Hero (full-width section)
- ✅ Placed on: Homepage, Footer

### 8. Stripe Payments (Structure Ready)
- ✅ Pricing page with USD/MXN currency toggle
- ✅ Plans: Free ($0), Monthly ($1), Annual ($10), Lifetime ($250)
- ⏳ Stripe integration pending API keys
- ✅ Checkout flow structure ready

## What's Been Implemented (March 2026)

### Session 1 (Initial)
- Header fixed to show display name instead of email
- ArticleVoiceBot AI assistant using Emergent LLM key
- Instagram link added to footer
- Admin dashboard real stats from Supabase
- Admin password change API endpoint

### Session 2 (Product Realignment)
- New editorial design system (globals.css)
- ContributorReputation component (replacing TrustScoreRating)
- LanguageSelector with indigenous languages
- Newsletter component (multiple variants)
- CryptoDonation with MetaMask
- ArticleEditor CMS component
- Community page with regional groups
- Updated Homepage (NYT-style)
- Updated Pricing page (USD/MXN, crypto)
- Updated Footer

### Session 3 (Brand Guidelines - Dec 2025)
- Applied brand guidelines from PDF document
- Updated color palette: Light Purple (#8c52ff), Dark Purple (#6111ff), Beige (#E7DAC4)
- Typography: Raleway (headlines), Marcellus (subheadings), Source Serif 4 (body)
- Purple gradient buttons and newsletter sections
- Beige accent tags for regions
- Updated Header with gradient logo and purple accents
- Updated Footer with beige background tint
- Updated Homepage with brand colors throughout
- Updated Article pages with brand styling
- Fixed article page localization errors (getLocalizedContent)
- Fixed Writers page localization errors
- Fixed TrustScoreRating null check
- Created /app/design_guidelines.md for brand reference

## Backlog / Future Tasks

### P0 (Critical)
- [ ] Integrate Stripe when keys available
- [ ] Connect ArticleEditor to article creation flow
- [ ] Add newsletter backend (email service integration)

### P1 (High Priority)
- [ ] Implement article upvoting system
- [ ] Add podcast/video content types
- [ ] Real-time community notifications

### P2 (Medium Priority)
- [ ] Indigenous language translations
- [ ] Contributor profile pages
- [ ] Article comments system
- [ ] Mobile app consideration

## URLs & Credentials
- **Preview URL:** https://investigative-news.preview.emergentagent.com
- **Admin Login:** oket.hoxha@gmail.com / emergent2026
- **Supabase:** https://yrvrpmoidlvrtukvrvnv.supabase.co
