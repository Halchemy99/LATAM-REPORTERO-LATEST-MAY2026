import { NextResponse } from 'next/server';

// Beehiiv newsletter subscription endpoint
// Set BEEHIIV_PUBLICATION_ID and BEEHIIV_API_KEY in .env.local
// Find these at: https://app.beehiiv.com/settings/api

export async function POST(request) {
  let email;
  try {
    const body = await request.json();
    email = body.email?.trim()?.toLowerCase();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
  }

  const PUBLICATION_ID = process.env.BEEHIIV_PUBLICATION_ID;
  const API_KEY = process.env.BEEHIIV_API_KEY;

  if (!PUBLICATION_ID || !API_KEY) {
    // Graceful degradation: log locally but return success to user
    // Replace with real credentials in .env.local to activate
    console.warn('[Newsletter] Beehiiv not configured. Set BEEHIIV_PUBLICATION_ID and BEEHIIV_API_KEY in .env.local');
    return NextResponse.json({ success: true, note: 'Beehiiv not yet configured' });
  }

  try {
    const resp = await fetch(
      `https://api.beehiiv.com/v2/publications/${PUBLICATION_ID}/subscriptions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          reactivate_existing: false,
          send_welcome_email: true,
          utm_source: 'latamreportero_site',
          utm_medium: 'web',
        }),
      }
    );

    if (!resp.ok) {
      // 400 from Beehiiv often means already subscribed — still show success to user
      const text = await resp.text();
      console.error('[Newsletter] Beehiiv error:', resp.status, text);
      if (resp.status === 400) {
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Newsletter] Network error:', err);
    return NextResponse.json({ error: 'Network error' }, { status: 500 });
  }
}
