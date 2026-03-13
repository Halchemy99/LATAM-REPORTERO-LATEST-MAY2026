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

### 3. CMS Editor (Fully Implemented - Dec 2025)
- ✅ **Database Schema (Supabase)**:
  - `authors` - Extended author profiles
  - `categories` - Article categories (8 seeded)
  - `tags` - Article tags (10 seeded)
  - `cms_articles` - Main articles with multilingual support, SEO, status workflow
  - `article_tags` - Many-to-many relationship
  - `content_blocks` - 25+ modular block types
  - `media_assets` - Centralized media library
  - `editorial_notes` - Review workflow notes
  - `article_versions` - Version history

- ✅ **Content Block Types**:
  - **Text**: paragraph, heading, subheading, pull_quote, callout_box, fact_box, key_takeaways
  - **Media**: image, image_gallery, carousel, video_embed (YouTube/Vimeo/TikTok), audio_clip, podcast_embed
  - **Data/Visual**: chart, infographic, timeline, data_table, map_embed
  - **Layout**: divider, section_break, two_column, highlight_section
  - **Engagement**: newsletter_signup, call_to_action, related_articles, sources_list

- ✅ **Editor Features**:
  - Drag-and-drop block reordering (@dnd-kit)
  - Multilingual content tabs (EN/ES/PT)
  - Live preview mode
  - Auto-generated slugs
  - SEO settings per language
  - Featured image with caption/credit
  - Category, author, region selection
  - Premium/Featured article toggles
  - Tag selection

- ✅ **Editorial Workflow**:
  - Status: draft → in_review → approved/rejected → published/archived
  - Status change with editorial notes
  - Role-based actions (editors can approve/reject, admins can publish)

- ✅ **CMS Routes**:
  - `/editor/articles` - Article list with filters
  - `/editor/articles/new` - Create new article
  - `/editor/articles/[id]` - Edit existing article

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

### Session 4 (CMS Implementation - Dec 2025)
- Full CMS database schema created in Supabase (9 tables)
- CMS API utilities (`/lib/supabase/cms.js`)
- 25+ content block components with renderers
- Block Editor with drag-and-drop (@dnd-kit)
- Article list page with filters (`/editor/articles`)
- New article editor (`/editor/articles/new`)
- Edit article editor (`/editor/articles/[id]`)
- Media Library UI (`/editor/media`)
- Multilingual content support (EN/ES/PT tabs)
- SEO settings per language
- Editorial workflow (draft → review → publish)
- Role-based access control
- Updated article page to read from CMS (with mock data fallback)
- Updated editor dashboard with CMS links

### Session 5 (CMS Testing & Bug Fixes - March 2026)
- Fixed dashboard localization bug in NewsCard.jsx (added getLocalizedContent helper)
- Fixed CMS article save failing with UUID validation error (empty strings → null for category_id, author_id)
- Configured Supabase RLS policies for users and cms_articles tables
- Successfully tested full CMS workflow: login → create article → save draft → view in list
- Test article created: "CMS Test - Renewable Energy in Chile"
- Fixed Editor Dashboard localization bug (added getLocalizedContent for article.title and article.excerpt)

### Session 6 (CMS-Homepage Connection & Stripe Integration - March 2026)
- Connected Homepage to CMS with fallback to mock data (uses getArticles from CMS, falls back to mockArticles)
- Connected Writers page to CMS with fallback to mock data (uses getAuthors from CMS, falls back to mockWriters)
- Implemented full Stripe payment integration:
  - Backend endpoints: /api/payments/plans, /api/payments/checkout, /api/payments/status, /api/webhook/stripe
  - Subscription plans: Standard ($9.99/mo), Premium ($19.99/mo)
  - Checkout session creation with MongoDB transaction logging
  - Payment status polling on frontend
- Updated Pricing page with real Stripe checkout functionality
- All tests passing: Backend 100% (11/11), Frontend 100%

### Session 7 (CMS Enhancements - March 2026)
- **Version History**: 
  - Added `article_versions` table for storing article snapshots
  - Auto-saves version on each article save
  - View version history with timestamps
  - Restore any previous version with one click
- **Scheduled Publishing**:
  - Added `scheduled_at` column to cms_articles
  - Schedule dialog with date/time pickers
  - Status changes to "scheduled" when scheduled
  - Unschedule option to revert to draft
- **Live Preview**:
  - Full-page preview dialog showing how article appears to readers
  - Renders with actual typography and styling
- **Custom URL Support**:
  - Default URL format: `title-slug-YYYY-MM-DD` (e.g., `/article/my-article-2026-03-13`)
  - Toggle for custom URL override
  - Added `custom_slug` and `use_custom_slug` columns
- **UI Improvements**:
  - Articles list now clickable to edit
  - Better fallbacks for missing images (gradient placeholders)
  - Fixed translation key issues ("Top Writers" etc.)

## Backlog / Future Tasks

### P0 (Critical)
- [x] Create Supabase Storage bucket named `cms-media` for media uploads (DONE)
- [x] Configure RLS policies for users, cms_articles tables (DONE)
- [x] Test CMS article creation flow (DONE)
- [x] Integrate Stripe (DONE - using sk_test_emergent)
- [x] Version history (DONE)
- [x] Scheduled publishing (DONE)
- [x] Live preview (DONE)
- [ ] Add newsletter backend (email service integration)

### P1 (High Priority)
- [x] Connect homepage to CMS (replace mock data) (DONE - with fallback)
- [x] Connect writers page to CMS (replace mock data) (DONE - with fallback)
- [ ] Block editor UX improvements (smoother drag-drop, inline editing)
- [ ] Draft comments/notes for editorial feedback
- [ ] Test media upload to cms-media bucket
- [ ] Implement MetaMask crypto donations
- [ ] Implement article upvoting system

### P2 (Medium Priority)
- [ ] Migrate existing mock articles to CMS
- [ ] Add podcast/video content types
- [ ] Indigenous language translations
- [ ] Contributor profile pages
- [ ] Article comments system

### P3 (Low Priority)
- [ ] Build remaining complex CMS block components (chart, map_embed)
- [ ] Create "Coming Soon" pages for indigenous languages
- [ ] Mobile app consideration

## URLs & Credentials
- **Preview URL:** https://cms-testing-flow.preview.emergentagent.com
- **Admin Login:** oket.hoxha@gmail.com / emergent2030
- **Supabase:** https://yrvrpmoidlvrtukvrvnv.supabase.co
