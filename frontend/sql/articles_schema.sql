-- LATAM Reportero - Articles Table Schema
-- Run this in Supabase SQL Editor

-- Create articles table with AI Draft Inbox and Trust Tags support
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic content fields
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  body TEXT,
  
  -- Problem/Solutions/Impact structure (solutions-oriented journalism)
  problem_section TEXT,
  solutions_section TEXT,
  impact_section TEXT,
  
  -- Media
  main_image TEXT,
  
  -- Categorization
  category TEXT,
  region TEXT,
  language TEXT DEFAULT 'en',
  tags TEXT[],
  
  -- Author information
  author_id UUID REFERENCES public.users(id),
  author_name TEXT,
  
  -- AI Draft Inbox fields (NEW)
  status TEXT NOT NULL DEFAULT 'needs_review' CHECK (status IN ('needs_review', 'published', 'rejected', 'draft')),
  author_type TEXT NOT NULL DEFAULT 'human' CHECK (author_type IN ('ai', 'human')),
  origin TEXT DEFAULT 'manual' CHECK (origin IN ('rss', 'manual')),
  
  -- Source tracking (for AI/RSS content)
  source_name TEXT,
  source_url TEXT,
  source_published_at TIMESTAMPTZ,
  
  -- Trust Tags (NOT numeric scores)
  trust_tags TEXT[] DEFAULT '{}',
  
  -- Metrics
  read_time INTEGER DEFAULT 5,
  view_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Create index for AI Draft Inbox queries
CREATE INDEX IF NOT EXISTS idx_articles_ai_inbox 
ON public.articles (author_type, status) 
WHERE author_type = 'ai' AND status = 'needs_review';

-- Create index for public articles (only published)
CREATE INDEX IF NOT EXISTS idx_articles_published 
ON public.articles (status, published_at DESC) 
WHERE status = 'published';

-- Create index for slug lookups
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles (slug);

-- Enable Row Level Security
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published articles
CREATE POLICY "Anyone can read published articles" ON public.articles
  FOR SELECT USING (status = 'published');

-- Policy: Authenticated users can read all articles (for admin/editor)
CREATE POLICY "Authenticated users can read all articles" ON public.articles
  FOR SELECT TO authenticated USING (true);

-- Policy: Authenticated users can insert articles
CREATE POLICY "Authenticated users can insert articles" ON public.articles
  FOR INSERT TO authenticated WITH CHECK (true);

-- Policy: Authenticated users can update articles
CREATE POLICY "Authenticated users can update articles" ON public.articles
  FOR UPDATE TO authenticated USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_articles_updated_at ON public.articles;
CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Predefined Trust Tags reference (for UI)
-- These are the suggested trust tags:
-- - 'Primary source'
-- - 'On-the-record'
-- - 'Document-backed'
-- - 'Independent reporting'
-- - 'Multiple sources'
-- - 'Analysis'
-- - 'Opinion'
-- - 'Developing story'
-- - 'Community-supplied'
-- - 'AI-assisted, editor-reviewed'

COMMENT ON TABLE public.articles IS 'Articles table with AI Draft Inbox and Trust Tags support';
COMMENT ON COLUMN public.articles.status IS 'needs_review = AI draft awaiting review, published = live on site, rejected = declined, draft = human draft';
COMMENT ON COLUMN public.articles.author_type IS 'ai = AI-generated content, human = human-written';
COMMENT ON COLUMN public.articles.origin IS 'rss = from RSS automation, manual = manually created';
COMMENT ON COLUMN public.articles.trust_tags IS 'Array of trust tag strings (descriptive metadata, not scores)';
