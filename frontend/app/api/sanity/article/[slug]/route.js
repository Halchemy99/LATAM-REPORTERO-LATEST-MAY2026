import { NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity/client';

const ARTICLE_QUERY = `
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
  _createdAt,
  "featuredImage": featuredImage.asset->url,
  "author": author->{
    _id,
    name,
    "avatar": image.asset->url,
    isVerified,
    verificationLevel,
    bio,
    expertise
  }
}
`;

// Related articles — same category or region, excluding current
const RELATED_QUERY = `
*[
  _type == "article" &&
  status == "published" &&
  slug.current != $slug &&
  (category == $category || region == $region)
] | order(publishedAt desc) [0...4] {
  _id,
  title,
  "slug": slug.current,
  standfirst,
  category,
  region,
  publishedAt,
  "featuredImage": featuredImage.asset->url
}
`;

export async function GET(request, { params }) {
  const slug = params.slug;

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
  }

  try {
    const article = await sanityClient.fetch(
      ARTICLE_QUERY,
      { slug },
      { next: { revalidate: 60, tags: [`article-${slug}`] } }
    );

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Fetch related articles in parallel
    const related = await sanityClient.fetch(
      RELATED_QUERY,
      { slug, category: article.category || '', region: article.region || '' },
      { next: { revalidate: 300 } }
    );

    return NextResponse.json(
      { article, related: related || [] },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    console.error('Sanity article fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}
