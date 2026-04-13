'use client';

import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param {string} dirty - Untrusted HTML content
 * @returns {string} - Sanitized HTML content
 */
export function sanitizeHtml(dirty) {
  if (typeof window === 'undefined') {
    // Server-side: strip all HTML tags
    return dirty ? dirty.replace(/<[^>]*>/g, '') : '';
  }
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'b', 'i', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'code', 'span', 'div', 'img', 'figure', 'figcaption', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'class', 'style', 'title', 'width', 'height'],
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Sanitize HTML for embed content (more permissive for iframes)
 * @param {string} dirty - Untrusted embed HTML
 * @returns {string} - Sanitized embed HTML
 */
export function sanitizeEmbed(dirty) {
  if (typeof window === 'undefined') {
    return '';
  }
  return DOMPurify.sanitize(dirty, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
  });
}
