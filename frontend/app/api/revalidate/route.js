import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

// Secret token — set REVALIDATE_SECRET in Railway env vars
// Configure Sanity webhook to send: POST /api/revalidate?secret=YOUR_SECRET
const SECRET = process.env.REVALIDATE_SECRET;

export async function POST(request) {
  // Validate secret
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (SECRET && secret !== SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const { _type, slug } = body;

  try {
    if (_type === 'article') {
      // Revalidate the specific article page
      if (slug?.current) {
        revalidateTag(`article-${slug.current}`);
        revalidatePath(`/article/${slug.current}`);
      }
      // Revalidate all article listings
      revalidatePath('/');
      revalidatePath('/investigations');
      revalidatePath('/api/sanity/articles');
    } else {
      // Fallback — revalidate everything
      revalidatePath('/', 'layout');
    }

    return NextResponse.json({
      revalidated: true,
      type: _type,
      slug: slug?.current || null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { error: 'Revalidation failed', detail: error.message },
      { status: 500 }
    );
  }
}

// Allow GET for quick health-check / manual revalidation
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const path = searchParams.get('path') || '/';

  if (SECRET && secret !== SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  revalidatePath(path, 'layout');
  return NextResponse.json({ revalidated: true, path });
}
