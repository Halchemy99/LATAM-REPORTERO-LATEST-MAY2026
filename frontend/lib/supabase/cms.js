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
  
  // Clean up empty string values for UUID fields (convert to null)
  const cleanedArticle = { ...article };
  const uuidFields = ['category_id', 'author_id'];
  uuidFields.forEach(field => {
    if (cleanedArticle[field] === '' || cleanedArticle[field] === undefined) {
      cleanedArticle[field] = null;
    }
  });
  
  // Create article
  const { data: newArticle, error } = await supabase
    .from('cms_articles')
    .insert(cleanedArticle)
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
  
  // Clean up empty string values for UUID fields (convert to null)
  const cleanedArticle = { ...article };
  const uuidFields = ['category_id', 'author_id'];
  uuidFields.forEach(field => {
    if (cleanedArticle[field] === '' || cleanedArticle[field] === undefined) {
      cleanedArticle[field] = null;
    }
  });
  
  // Update article
  const { data: updatedArticle, error } = await supabase
    .from('cms_articles')
    .update(cleanedArticle)
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

// ============================================
// VERSION HISTORY
// ============================================

export async function saveArticleVersion(articleId, articleData, contentBlocks, userId, changeNote = '') {
  const supabase = createClient();
  
  const versionData = {
    article_id: articleId,
    version_data: {
      article: articleData,
      content_blocks: contentBlocks
    },
    created_by: userId,
    change_note: changeNote,
    created_at: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from('article_versions')
    .insert(versionData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getArticleVersions(articleId) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('article_versions')
    .select('*')
    .eq('article_id', articleId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function getArticleVersion(versionId) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('article_versions')
    .select('*')
    .eq('id', versionId)
    .single();
  
  if (error) throw error;
  return data;
}

export async function restoreArticleVersion(articleId, versionId) {
  const supabase = createClient();
  
  // Get the version data
  const version = await getArticleVersion(versionId);
  if (!version) throw new Error('Version not found');
  
  const { article, content_blocks } = version.version_data;
  
  // Update the article with version data (excluding id and timestamps)
  const { id, created_at, updated_at, ...articleFields } = article;
  
  await updateArticle(articleId, {
    ...articleFields,
    content_blocks
  });
  
  return true;
}

// ============================================
// SCHEDULED PUBLISHING
// ============================================

export async function scheduleArticle(articleId, scheduledAt) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('cms_articles')
    .update({ 
      status: 'scheduled',
      scheduled_at: scheduledAt
    })
    .eq('id', articleId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function unscheduleArticle(articleId) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('cms_articles')
    .update({ 
      status: 'draft',
      scheduled_at: null
    })
    .eq('id', articleId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getScheduledArticles() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('cms_articles')
    .select('*')
    .eq('status', 'scheduled')
    .not('scheduled_at', 'is', null)
    .lte('scheduled_at', new Date().toISOString());
  
  if (error) throw error;
  return data || [];
}

export async function publishScheduledArticles() {
  const supabase = createClient();
  
  // Get all articles that should be published
  const scheduledArticles = await getScheduledArticles();
  
  for (const article of scheduledArticles) {
    await supabase
      .from('cms_articles')
      .update({ 
        status: 'published',
        published_at: new Date().toISOString()
      })
      .eq('id', article.id);
  }
  
  return scheduledArticles.length;
}

// ============================================
// ARTICLE COMMENTS / EDITORIAL NOTES
// ============================================

export async function getArticleComments(articleId) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('article_comments')
    .select(`
      *,
      user:users(id, email, full_name, avatar_url)
    `)
    .eq('article_id', articleId)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export async function addArticleComment(articleId, userId, content, blockId = null) {
  const supabase = createClient();
  
  const commentData = {
    article_id: articleId,
    user_id: userId,
    content: content,
    block_id: blockId, // Optional: reference to a specific block
    is_resolved: false,
    created_at: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from('article_comments')
    .insert(commentData)
    .select(`
      *,
      user:users(id, email, full_name, avatar_url)
    `)
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateComment(commentId, updates) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('article_comments')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', commentId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function resolveComment(commentId, resolved = true) {
  return updateComment(commentId, { is_resolved: resolved });
}

export async function deleteComment(commentId) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('article_comments')
    .delete()
    .eq('id', commentId);
  
  if (error) throw error;
  return true;
}

export async function replyToComment(commentId, userId, content) {
  const supabase = createClient();
  
  // Get original comment to get article_id
  const { data: originalComment, error: fetchError } = await supabase
    .from('article_comments')
    .select('article_id, block_id')
    .eq('id', commentId)
    .single();
  
  if (fetchError) throw fetchError;
  
  const replyData = {
    article_id: originalComment.article_id,
    user_id: userId,
    content: content,
    block_id: originalComment.block_id,
    parent_id: commentId,
    is_resolved: false,
    created_at: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from('article_comments')
    .insert(replyData)
    .select(`
      *,
      user:users(id, email, full_name, avatar_url)
    `)
    .single();
  
  if (error) throw error;
  return data;
}


