-- LATAM Reportero Database Schema for Supabase
-- Run this in Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT,
    role TEXT NOT NULL DEFAULT 'free' CHECK (role IN ('free', 'paid', 'contributor', 'editor', 'admin')),
    subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'canceled', 'trial', 'inactive')),
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    subscription_tier TEXT,
    is_suspended BOOLEAN DEFAULT false,
    subscription_started_at TIMESTAMPTZ,
    subscription_ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Articles table
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    problem_section TEXT,
    solutions_section TEXT,
    impact_section TEXT,
    category TEXT NOT NULL,
    region TEXT NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('published', 'pending_review', 'draft', 'rejected')),
    main_image_url TEXT,
    author_id UUID REFERENCES public.users(id),
    featured BOOLEAN DEFAULT false,
    source_type TEXT DEFAULT 'human' CHECK (source_type IN ('human', 'ai')),
    rejection_reason TEXT,
    sources JSONB DEFAULT '[]',
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookmarks table
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
    article_slug TEXT NOT NULL,
    article_title TEXT NOT NULL,
    article_image TEXT,
    article_excerpt TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, article_slug)
);

-- Polls table
CREATE TABLE IF NOT EXISTS public.polls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    title_es TEXT,
    description TEXT,
    description_es TEXT,
    category TEXT,
    region TEXT,
    options JSONB NOT NULL DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    starts_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Poll votes table
CREATE TABLE IF NOT EXISTS public.poll_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    option_id TEXT NOT NULL,
    voted_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(poll_id, user_id)
);

-- Trending topics table
CREATE TABLE IF NOT EXISTS public.trending_topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic TEXT NOT NULL,
    region TEXT NOT NULL,
    category TEXT,
    mention_count INTEGER DEFAULT 1,
    relevance_score NUMERIC,
    first_seen_at TIMESTAMPTZ DEFAULT NOW(),
    last_mentioned_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RSS feeds table
CREATE TABLE IF NOT EXISTS public.rss_feeds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    category TEXT,
    region TEXT,
    is_active BOOLEAN DEFAULT true,
    last_fetched_at TIMESTAMPTZ,
    fetch_interval_hours INTEGER DEFAULT 6,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RSS articles table
CREATE TABLE IF NOT EXISTS public.rss_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feed_id UUID REFERENCES public.rss_feeds(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    problem_statement TEXT,
    solutions TEXT,
    impact TEXT,
    source_name TEXT NOT NULL,
    source_url TEXT NOT NULL,
    category TEXT,
    region TEXT,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Role change audit table
CREATE TABLE IF NOT EXISTS public.role_change_audit (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_user_id UUID NOT NULL,
    target_user_email TEXT NOT NULL,
    changed_by_user_id UUID NOT NULL,
    changed_by_email TEXT NOT NULL,
    old_role TEXT NOT NULL,
    new_role TEXT NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments table
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trust score ratings table
CREATE TABLE IF NOT EXISTS public.trust_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rater_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    writer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    score NUMERIC NOT NULL CHECK (score >= 0 AND score <= 5),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(rater_id, writer_id)
);

-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trending_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rss_feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rss_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_change_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trust_ratings ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all users" ON public.users FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update all users" ON public.users FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Articles policies
CREATE POLICY "Anyone can view published articles" ON public.articles FOR SELECT USING (status = 'published');
CREATE POLICY "Authors can view own articles" ON public.articles FOR SELECT USING (author_id = auth.uid());
CREATE POLICY "Contributors can insert articles" ON public.articles FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('contributor', 'editor', 'admin'))
);
CREATE POLICY "Authors can update own articles" ON public.articles FOR UPDATE USING (author_id = auth.uid());
CREATE POLICY "Editors can update all articles" ON public.articles FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('editor', 'admin'))
);

-- Bookmarks policies
CREATE POLICY "Users can manage own bookmarks" ON public.bookmarks FOR ALL USING (user_id = auth.uid());

-- Polls policies
CREATE POLICY "Anyone can view active polls" ON public.polls FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage polls" ON public.polls FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('editor', 'admin'))
);

-- Poll votes policies
CREATE POLICY "Authenticated users can vote" ON public.poll_votes FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can view own votes" ON public.poll_votes FOR SELECT USING (user_id = auth.uid());

-- Trending topics policies
CREATE POLICY "Anyone can view trending topics" ON public.trending_topics FOR SELECT USING (true);

-- RSS feeds policies
CREATE POLICY "Anyone can view active feeds" ON public.rss_feeds FOR SELECT USING (is_active = true);

-- RSS articles policies
CREATE POLICY "Anyone can view published RSS articles" ON public.rss_articles FOR SELECT USING (is_published = true);

-- Role change audit policies
CREATE POLICY "Admins can view audit log" ON public.role_change_audit FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Comments policies
CREATE POLICY "Anyone can view comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can add comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own comments" ON public.comments FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own comments" ON public.comments FOR DELETE USING (user_id = auth.uid());

-- Trust ratings policies
CREATE POLICY "Users can view ratings" ON public.trust_ratings FOR SELECT USING (true);
CREATE POLICY "Paid users can rate" ON public.trust_ratings FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('paid', 'contributor', 'editor', 'admin'))
);

-- ============================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        'free'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON public.articles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_polls_updated_at BEFORE UPDATE ON public.polls
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- SEED DATA (Optional - for testing)
-- ============================================================

-- Insert sample articles (uncomment to seed)
/*
INSERT INTO public.articles (title, slug, excerpt, problem_section, solutions_section, impact_section, category, region, status, source_type, main_image_url, featured, published_at)
VALUES 
('Mexico City''s Revolutionary Water Recycling Program Shows Promising Results',
 'mexico-city-water-recycling-program',
 'A groundbreaking initiative to address the water crisis in one of the world''s largest metropolitan areas.',
 '<p>Mexico City, home to over 21 million people, faces one of the most severe water crises in the Western Hemisphere.</p>',
 '<p><strong>Decentralized Water Recycling:</strong> The city has implemented 200 community-scale water recycling facilities.</p>',
 '<p>After 18 months, the program has achieved remarkable results: Water consumption reduced by 18%.</p>',
 'environment',
 'mexico',
 'published',
 'human',
 'https://images.unsplash.com/photo-1568632234180-0e6c08735d01?w=800&h=450&fit=crop',
 true,
 NOW());
*/
