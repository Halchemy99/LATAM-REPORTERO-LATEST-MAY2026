import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Predefined trust tags
export const TRUST_TAGS = [
  'Primary source',
  'On-the-record',
  'Document-backed',
  'Independent reporting',
  'Multiple sources',
  'Analysis',
  'Opinion',
  'Developing story',
  'Community-supplied',
  'AI-assisted, editor-reviewed'
];

// GET - Fetch drafts (AI Draft Inbox)
export async function GET(request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    
    const status = searchParams.get('status') || 'needs_review';
    const author_type = searchParams.get('author_type') || 'ai';
    const origin = searchParams.get('origin'); // optional filter
    
    let query = supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Filter by status
    if (status !== 'all') {
      query = query.eq('status', status);
    }
    
    // Filter by author_type
    if (author_type !== 'all') {
      query = query.eq('author_type', author_type);
    }
    
    // Filter by origin if specified
    if (origin) {
      query = query.eq('origin', origin);
    }
    
    const { data: drafts, error } = await query;

    if (error) {
      console.error('Error fetching drafts:', error);
      return NextResponse.json({ error: 'Failed to fetch drafts' }, { status: 500 });
    }

    return NextResponse.json({ 
      drafts: drafts || [],
      trust_tags: TRUST_TAGS 
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new draft (for automation or manual input)
export async function POST(request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    // Generate slug from title
    const slug = body.slug || body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now();
    
    const articleData = {
      title: body.title,
      slug: slug,
      excerpt: body.excerpt || body.summary,
      body: body.body,
      problem_section: body.problem_section,
      solutions_section: body.solutions_section,
      impact_section: body.impact_section,
      main_image: body.main_image,
      category: body.category,
      region: body.region,
      language: body.language || 'en',
      tags: body.tags || [],
      
      // AI Draft Inbox fields
      status: 'needs_review', // Always starts as needs_review
      author_type: body.author_type || 'ai',
      origin: body.origin || 'manual',
      
      // Source tracking
      source_name: body.source_name,
      source_url: body.source_url,
      source_published_at: body.source_published_at,
      
      // Trust tags
      trust_tags: body.trust_tags || [],
      
      // Optional author
      author_id: body.author_id,
      author_name: body.author_name,
      
      read_time: body.read_time || 5
    };

    const { data: draft, error } = await supabase
      .from('articles')
      .insert(articleData)
      .select()
      .single();

    if (error) {
      console.error('Error creating draft:', error);
      return NextResponse.json({ error: 'Failed to create draft: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({ draft, message: 'Draft created successfully' }, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - Update draft (approve, reject, edit)
export async function PATCH(request) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { id, ...updates } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
    }
    
    // If publishing, set published_at timestamp
    if (updates.status === 'published' && !updates.published_at) {
      updates.published_at = new Date().toISOString();
    }

    const { data: article, error } = await supabase
      .from('articles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating draft:', error);
      return NextResponse.json({ error: 'Failed to update draft: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({ article, message: 'Draft updated successfully' });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete draft
export async function DELETE(request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting draft:', error);
      return NextResponse.json({ error: 'Failed to delete draft' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Draft deleted successfully' });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
