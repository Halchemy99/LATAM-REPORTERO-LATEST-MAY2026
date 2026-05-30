import { NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity/client';

const ARTICLES_QUERY = `
*[_type == "article" && status == "published"] | order(publishedAt desc) [$from...$to] {
  _id,
  title,
  "slug": slug.current,
  language,
  standfirst,
  category,
  region,
  isAiGenerated,
  aiDisclosure,
  publishedAt,
  "featuredImage": featuredImage.asset->url,
  "author": author->{name, "avatar": image.asset->url, isVerified}
}
`;

const COUNT_QUERY = `count(*[_type == "article" && status == "published"])`;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
  const language = searchParams.get('language') || null;
  const category = searchParams.get('category') || null;
  const region = searchParams.get('region') || null;

  // Build dynamic query with optional filters
  let filter = `_type == "article" && status == "published"`;
  if (language) filter += ` && language == "${language}"`;
  if (category) filter += ` && category == "${category}"`;
  if (region) filter += ` && region == "${region}"`;

  const query = `
  {
    "articles": *[${filter}] | order(publishedAt desc) [${(page - 1) * limit}...${page * limit}] {
      _id,
      title,
      "slug": slug.current,
      language,
      standfirst,
      category,
      region,
      isAiGenerated,
      publishedAt,
      "featuredImage": featuredImage.asset->url,
      "author": author->{name, "avatar": image.asset->url, isVerified}
    },
    "total": count(*[${filter}])
  }
  `;

  try {
    const data = await sanityClient.fetch(query, {}, { next: { revalidate: 60 } });

    return NextResponse.json(
      {
        articles: data.articles || [],
        total: data.total || 0,
        page,
        limit,
        pages: Math.ceil((data.total || 0) / limit),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    console.error('Sanity articles fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles', articles: [], total: 0 },
      { status: 500 }
    );
  }
}
