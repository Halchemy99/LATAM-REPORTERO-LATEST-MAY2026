// CMS API Functions for Supabase
import { createClient } from './client';

// ============================================
// ARTICLES
// ============================================

export async function getArticles({ 
  status = null, 
  category = null, 
  author = null,
  featured = null,
  limit = 20,
  offset = 0 
} = {}) {
  const supabase = createClient();
  
  let query = supabase
    .from('cms_articles')
    .select(`
      *,
      author:authors(*),
      category:categories(*)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  
  if (status) query = query.eq('status', status);
  if (category) query = query.eq('category_id', category);
  if (author) query = query.eq('author_id', author);
  if (featured !== null) query = query.eq('is_featured', featured);
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data;
}

export async function getArticleBySlug(slug, locale = 'en') {
  const supabase = createClient();
  
  const { data: article, error } = await supabase
    .from('cms_articles')
    .select(`
      *,
      author:authors(*),
      category:categories(*)
    `)
    .eq('slug', slug)
    .single();
  
  if (error) throw error;
  
  // Get content blocks
  const { data: blocks, error: blocksError } = await supabase
    .from('content_blocks')
    .select('*')
    .eq('article_id', article.id)
    .order('sort_order', { ascending: true });
  
  if (blocksError) throw blocksError;
  
  // Get tags
  const { data: tags, error: tagsError } = await supabase
    .from('article_tags')
    .select('tag:tags(*)')
    .eq('article_id', article.id);
  
  if (tagsError) throw tagsError;
  
  return {
    ...article,
    content_blocks: blocks || [],
    tags: tags?.map(t => t.tag) || []
  };
}

export async function getArticleById(id) {
  const supabase = createClient();
  
  const { data: article, error } = await supabase
    .from('cms_articles')
    .select(`
      *,
      author:authors(*),
      category:categories(*)
    `)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  
  // Get content blocks
  const { data: blocks } = await supabase
    .from('content_blocks')
    .select('*')
    .eq('article_id', id)
    .order('sort_order', { ascending: true });
  
  // Get tags
  const { data: tags } = await supabase
    .from('article_tags')
    .select('tag:tags(*)')
    .eq('article_id', id);
  
  return {
    ...article,
    content_blocks: blocks || [],
    tags: tags?.map(t => t.tag) || []
  };
}

export async function createArticle(articleData) {
  const supabase = createClient();
  
  const { content_blocks, tags, ...article } = articleData;
  
  // Create article
  const { data: newArticle, error } = await supabase
    .from('cms_articles')
    .insert(article)
    .select()
    .single();
  
  if (error) throw error;
  
  // Create content blocks
  if (content_blocks?.length > 0) {
    const blocksWithArticleId = content_blocks.map((block, index) => ({
      ...block,
      article_id: newArticle.id,
      sort_order: index
    }));
    
    const { error: blocksError } = await supabase
      .from('content_blocks')
      .insert(blocksWithArticleId);
    
    if (blocksError) throw blocksError;
  }
  
  // Add tags
  if (tags?.length > 0) {
    const articleTags = tags.map(tagId => ({
      article_id: newArticle.id,
      tag_id: tagId
    }));
    
    const { error: tagsError } = await supabase
      .from('article_tags')
      .insert(articleTags);
    
    if (tagsError) throw tagsError;
  }
  
  return newArticle;
}

export async function updateArticle(id, articleData) {
  const supabase = createClient();
  
  const { content_blocks, tags, ...article } = articleData;
  
  // Update article
  const { data: updatedArticle, error } = await supabase
    .from('cms_articles')
    .update(article)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  
  // Update content blocks - delete existing and recreate
  if (content_blocks !== undefined) {
    await supabase
      .from('content_blocks')
      .delete()
      .eq('article_id', id);
    
    if (content_blocks.length > 0) {
      const blocksWithArticleId = content_blocks.map((block, index) => ({
        ...block,
        article_id: id,
        sort_order: index,
        id: undefined // Remove id to create new
      }));
      
      const { error: blocksError } = await supabase
        .from('content_blocks')
        .insert(blocksWithArticleId);
      
      if (blocksError) throw blocksError;
    }
  }
  
  // Update tags
  if (tags !== undefined) {
    await supabase
      .from('article_tags')
      .delete()
      .eq('article_id', id);
    
    if (tags.length > 0) {
      const articleTags = tags.map(tagId => ({
        article_id: id,
        tag_id: tagId
      }));
      
      await supabase
        .from('article_tags')
        .insert(articleTags);
    }
  }
  
  return updatedArticle;
}

export async function deleteArticle(id) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('cms_articles')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
}

export async function updateArticleStatus(id, status, note = null, userId = null) {
  const supabase = createClient();
  
  // Get current status
  const { data: current } = await supabase
    .from('cms_articles')
    .select('status')
    .eq('id', id)
    .single();
  
  // Update status
  const updateData = { status };
  if (status === 'published') {
    updateData.published_at = new Date().toISOString();
  }
  
  const { data, error } = await supabase
    .from('cms_articles')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  
  // Add editorial note if provided
  if (note) {
    await supabase
      .from('editorial_notes')
      .insert({
        article_id: id,
        note_type: status === 'rejected' ? 'rejection' : status === 'approved' ? 'approval' : 'comment',
        content: note,
        author_id: userId,
        previous_status: current?.status,
        new_status: status
      });
  }
  
  return data;
}

// ============================================
// CONTENT BLOCKS
// ============================================

export async function getContentBlocks(articleId) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('content_blocks')
    .select('*')
    .eq('article_id', articleId)
    .order('sort_order', { ascending: true });
  
  if (error) throw error;
  return data;
}

export async function createContentBlock(block) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('content_blocks')
    .insert(block)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateContentBlock(id, block) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('content_blocks')
    .update(block)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteContentBlock(id) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('content_blocks')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
}

export async function reorderContentBlocks(articleId, blockIds) {
  const supabase = createClient();
  
  // Update each block's sort_order
  const updates = blockIds.map((id, index) => 
    supabase
      .from('content_blocks')
      .update({ sort_order: index })
      .eq('id', id)
  );
  
  await Promise.all(updates);
  return true;
}

// ============================================
// CATEGORIES
// ============================================

export async function getCategories() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  
  if (error) throw error;
  return data;
}

export async function getCategoryBySlug(slug) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) throw error;
  return data;
}

// ============================================
// TAGS
// ============================================

export async function getTags() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name_en', { ascending: true });
  
  if (error) throw error;
  return data;
}

export async function createTag(tag) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('tags')
    .insert(tag)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// ============================================
// AUTHORS
// ============================================

export async function getAuthors() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('authors')
    .select('*')
    .order('name', { ascending: true });
  
  if (error) throw error;
  return data;
}

export async function getAuthorBySlug(slug) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('authors')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) throw error;
  return data;
}

export async function getAuthorByUserId(userId) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('authors')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) return null;
  return data;
}

export async function createAuthor(author) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('authors')
    .insert(author)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// ============================================
// MEDIA ASSETS
// ============================================

export async function getMediaAssets({ type = null, folder = null, limit = 50, offset = 0 } = {}) {
  const supabase = createClient();
  
  let query = supabase
    .from('media_assets')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  
  if (type) query = query.eq('file_type', type);
  if (folder) query = query.eq('folder', folder);
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data;
}

export async function uploadMediaAsset(file, metadata = {}) {
  const supabase = createClient();
  
  // Upload to Supabase Storage
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `media/${metadata.folder || 'general'}/${fileName}`;
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('cms-media')
    .upload(filePath, file);
  
  if (uploadError) throw uploadError;
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from('cms-media')
    .getPublicUrl(filePath);
  
  // Determine file type
  let fileType = 'document';
  if (file.type.startsWith('image/')) fileType = 'image';
  else if (file.type.startsWith('video/')) fileType = 'video';
  else if (file.type.startsWith('audio/')) fileType = 'audio';
  
  // Create media asset record
  const { data: assetData, error: assetError } = await supabase
    .from('media_assets')
    .insert({
      filename: fileName,
      original_filename: file.name,
      file_type: fileType,
      mime_type: file.type,
      file_size: file.size,
      file_url: urlData.publicUrl,
      folder: metadata.folder || 'general',
      alt_text_en: metadata.alt_text_en,
      alt_text_es: metadata.alt_text_es,
      alt_text_pt: metadata.alt_text_pt,
      caption_en: metadata.caption_en,
      credit: metadata.credit,
      uploaded_by: metadata.uploaded_by
    })
    .select()
    .single();
  
  if (assetError) throw assetError;
  return assetData;
}

export async function deleteMediaAsset(id) {
  const supabase = createClient();
  
  // Get the asset first
  const { data: asset } = await supabase
    .from('media_assets')
    .select('file_url')
    .eq('id', id)
    .single();
  
  if (asset) {
    // Extract path from URL and delete from storage
    const url = new URL(asset.file_url);
    const path = url.pathname.split('/cms-media/')[1];
    if (path) {
      await supabase.storage.from('cms-media').remove([path]);
    }
  }
  
  // Delete record
  const { error } = await supabase
    .from('media_assets')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
}

// ============================================
// EDITORIAL NOTES
// ============================================

export async function getEditorialNotes(articleId) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('editorial_notes')
    .select('*')
    .eq('article_id', articleId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function addEditorialNote(note) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('editorial_notes')
    .insert(note)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function generateSlug(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function calculateReadTime(blocks, locale = 'en') {
  const contentKey = `content_${locale}`;
  let wordCount = 0;
  
  blocks.forEach(block => {
    const content = block[contentKey] || block.content_en || {};
    if (content.text) {
      wordCount += content.text.split(/\s+/).length;
    }
  });
  
  return Math.max(1, Math.ceil(wordCount / 200)); // 200 words per minute
}
