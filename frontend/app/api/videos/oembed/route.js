import { NextResponse } from 'next/server';

// Server-side proxy for oEmbed requests — bypasses CORS restrictions
// Supports TikTok and Instagram
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'url parameter required' }, { status: 400 });
  }

  let oembedUrl;
  if (url.includes('tiktok.com')) {
    oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
  } else if (url.includes('instagram.com')) {
    oembedUrl = `https://graph.facebook.com/v19.0/instagram_oembed?url=${encodeURIComponent(url)}&maxwidth=400`;
  } else {
    return NextResponse.json({ error: 'Unsupported platform' }, { status: 400 });
  }

  try {
    const res = await fetch(oembedUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 86400 }, // cache thumbnail for 24h
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'oEmbed fetch failed' }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json(
      {
        title: data.title,
        thumbnail: data.thumbnail_url,
        authorName: data.author_name,
        html: data.html,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
        },
      }
    );
  } catch {
    return NextResponse.json({ error: 'Failed to fetch oEmbed data' }, { status: 500 });
  }
}
