# LATAM Reportero - Product Requirements Document

## Original Problem Statement
A solutions-oriented journalism platform for Latin America with:
- Credibility system for contributors
- Multilingual support (EN, ES, PT)
- Flexible CMS for modular content
- Crypto donations (MetaMask)
- Stripe subscriptions

## Tech Stack
- **Frontend**: Next.js 15, React, Tailwind CSS, shadcn/ui
- **Backend**: FastAPI
- **Database & Auth**: Supabase (PostgreSQL, Storage, Auth)
- **CMS**: Custom Supabase-native block editor with drag-and-drop (@dnd-kit/core)
- **Payments**: Stripe (implemented), MetaMask (pending)

## What's Been Implemented

### Core Features (DONE)
- [x] Full design overhaul with brand identity
- [x] Supabase authentication (login/signup)
- [x] Custom CMS with 11-table schema
- [x] Block editor with drag-and-drop
- [x] Version history with rollbacks
- [x] Scheduled publishing
- [x] Live preview
- [x] Editorial notes/comments system
- [x] Inline editing for text blocks
- [x] Stripe integration for subscriptions
- [x] Homepage connected to CMS
- [x] Article pages rendering CMS content
- [x] Media Library with file upload (TESTED ✅)
- [x] Mock data migrated to CMS database (6 articles, 7 categories)

### Pages Implemented
- `/` - Homepage (CMS-connected)
- `/auth/login`, `/auth/signup` - Authentication
- `/dashboard` - User dashboard
- `/editor/articles` - Article list
- `/editor/articles/new` - Create article
- `/editor/articles/[id]` - Edit article (with versions, scheduling, comments)
- `/editor/media` - Media library
- `/article/[slug]` - Article view page
- `/writers` - Writers listing
- `/pricing` - Subscription plans
- `/solutions` - Solutions page

### Database Schema
- `cms_articles` - Core article data
- `content_blocks` - Modular content blocks
- `article_versions` - Version history
- `article_comments` - Editorial notes
- `categories` - Article categories
- `authors` - Writer profiles
- `tags`, `article_tags` - Tagging system
- `media_assets` - Media library
- `editorial_notes` - Workflow notes
- `users` - User profiles

## Admin Credentials
- Email: `oket.hoxha@gmail.com`
- Password: `emergent2030`

## Current State (Dec 2025)
- Application is FULLY FUNCTIONAL
- CMS has real content (6 migrated articles)
- Media upload tested and working
- All CMS enhancement features (Option A) complete

## Prioritized Backlog

### P1 - High Priority
1. **MetaMask Crypto Donations** - Web3 integration pending
   - Location: `/app/frontend/components/CryptoDonationButton.jsx`
   - Needs: Web3 library (wagmi/ethers.js)

### P2 - Medium Priority
2. **DeepL Auto-Translation** - Requires user API key
3. **Deprecate Mock Data Fallback** - Remove fallback logic after confirming CMS stability

### P3 - Future
4. **"Coming Soon" Pages** - For indigenous language links
5. **Complex Block Components** - chart, map_embed, etc.
6. **Author Avatar Migration** - Fix authors table schema for avatar_url

## Technical Notes
- Valid content block types: `paragraph`, `heading`, `image`, `divider`
- RLS policies are critical - any new data access patterns need policy review
- Multilingual data pattern: `{field}_en`, `{field}_es`, `{field}_pt`

## Files of Reference
- `/app/frontend/lib/supabase/cms.js` - CMS API functions
- `/app/frontend/app/editor/articles/[id]/page.jsx` - Article editor
- `/app/frontend/components/BlockEditor.jsx` - DND block editor
- `/app/frontend/scripts/migrate-mock-data.js` - Migration script
- `/app/backend/server.py` - Stripe endpoint

## Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - For migrations/admin ops
- `STRIPE_SECRET_KEY` - Stripe payments

## Preview URL
https://reportero-cms.preview.emergentagent.com
