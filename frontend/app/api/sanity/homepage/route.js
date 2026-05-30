import { NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity/client';

const HOMEPAGE_QUERY = `
{
  "hero": *[_type == "article" && status == "published" && language == $language] | order(publishedAt desc) [0] {
    _id,
    title,
    "slug": slug.current,
    standfirst,
    category,
    contentType,
    region,
    isAiGenerated,
    publishedAt,
    "featuredImage": featuredImage.asset->url,
    "author": author->{name, isVerified}
  },
  "morningBriefs": *[_type == "article" && status == "published" && language == $language && contentType == "morning-brief"] | order(publishedAt desc) [0...5] {
    _id,
    title,
    "slug": slug.current,
    standfirst,
    category,
    region,
    publishedAt,
    "featuredImage": featuredImage.asset->url
  },
  "pressReviews": *[_type == "article" && status == "published" && language == $language && contentType == "press-review"] | order(publishedAt desc) [0...5] {
    _id,
    title,
    "slug": slug.current,
    standfirst,
    category,
    region,
    publishedAt,
    "featuredImage": featuredImage.asset->url
  },
  "deepDives": *[_type == "article" && status == "published" && language == $language && contentType == "investigation"] | order(publishedAt desc) [0...4] {
    _id,
    title,
    "slug": slug.current,
    standfirst,
    category,
    region,
    publishedAt,
    "featuredImage": featuredImage.asset->url
  },
  "latest": *[_type == "article" && status == "published" && language == $language] | order(publishedAt desc) [0...12] {
    _id,
    title,
    "slug": slug.current,
    standfirst,
    category,
    contentType,
    region,
    isAiGenerated,
    publishedAt,
    "featuredImage": featuredImage.asset->url,
    "author": author->{name, isVerified}
  }
}
`;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const language = searchParams.get('language') || 'en';

  try {
    const data = await sanityClient.fetch(
      HOMEPAGE_QUERY,
      { language },
      { next: { revalidate: 60 } }
    );

    return NextResponse.json(
      {
        hero: data.hero || null,
        morningBriefs: data.morningBriefs || [],
        pressReviews: data.pressReviews || [],
        deepDives: data.deepDives || [],
        latest: data.latest || [],
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    console.error('Homepage fetch error:', error);
    return NextResponse.json(
      { hero: null, morningBriefs: [], pressReviews: [], deepDives: [], latest: [] },
      { status: 500 }
    );
  }
}
