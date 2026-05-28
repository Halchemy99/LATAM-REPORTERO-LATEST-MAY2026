/**
 * Sanity Client Configuration
 * 
 * This client is used to fetch content from Sanity CMS
 */

import { createClient } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = '2025-03-01';

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Use CDN for faster reads
});

// For authenticated writes (admin/editor operations)
export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

/**
 * GROQ Queries
 */

// Get all published articles
export const getAllArticlesQuery = `
*[_type == "article" && status == "published"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  language,
  standfirst,
  body,
  category,
  region,
  sourceUrl,
  sourceFeed,
  isAiGenerated,
  publishedAt,
  createdAt,
  "featuredImage": featuredImage.asset->url
}
`;

// Get articles by language
export const getArticlesByLanguageQuery = `
*[_type == "article" && status == "published" && language == $language] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  language,
  standfirst,
  category,
  region,
  isAiGenerated,
  publishedAt,
  "featuredImage": featuredImage.asset->url
}
`;

// Get featured/latest articles for homepage
export const getHomepageArticlesQuery = `
{
  "featured": *[_type == "article" && status == "published" && language == $language] | order(publishedAt desc) [0] {
    _id,
    title,
    "slug": slug.current,
    standfirst,
    category,
    region,
    isAiGenerated,
    publishedAt,
    "featuredImage": featuredImage.asset->url
  },
  "latest": *[_type == "article" && status == "published" && language == $language] | order(publishedAt desc) [1...7] {
    _id,
    title,
    "slug": slug.current,
    standfirst,
    category,
    region,
    isAiGenerated,
    publishedAt,
    "featuredImage": featuredImage.asset->url
  }
}
`;

// Get single article by slug
export const getArticleBySlugQuery = `
*[_type == "article" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  language,
  standfirst,
  body,
  category,
  region,
  sourceUrl,
  sourceFeed,
  isAiGenerated,
  aiDisclosure,
  status,
  publishedAt,
  createdAt,
  "featuredImage": featuredImage.asset->url,
  "authorName": author->name,
  "authorVerified": author->isVerified,
  "authorVerificationLevel": author->verificationLevel
}
`;

// Get all drafts (for editors)
export const getDraftArticlesQuery = `
*[_type == "article" && status == "draft"] | order(createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  language,
  standfirst,
  category,
  region,
  isAiGenerated,
  createdAt,
  sourceFeed
}
`;

// Get all categories
export const getAllCategoriesQuery = `
*[_type == "category"] | order(title asc) {
  _id,
  title,
  "slug": slug.current,
  color
}
`;

/**
 * Fetch Functions
 */

export async function getAllArticles() {
  return sanityClient.fetch(getAllArticlesQuery);
}

export async function getArticlesByLanguage(language = 'en') {
  return sanityClient.fetch(getArticlesByLanguageQuery, { language });
}

export async function getHomepageArticles(language = 'en') {
  return sanityClient.fetch(getHomepageArticlesQuery, { language });
}

export async function getArticleBySlug(slug) {
  return sanityClient.fetch(getArticleBySlugQuery, { slug });
}

export async function getDraftArticles() {
  return sanityClient.fetch(getDraftArticlesQuery);
}

export async function getAllCategories() {
  return sanityClient.fetch(getAllCategoriesQuery);
}

/**
 * Portable Text Helpers
 */

export function portableTextToPlainText(blocks = []) {
  return blocks
    .map(block => {
      if (block._type !== 'block' || !block.children) {
        return '';
      }
      return block.children.map(child => child.text).join('');
    })
    .join('\n\n');
}
