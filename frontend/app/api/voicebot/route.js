import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8001';

export async function POST(request) {
  try {
    const body = await request.json();
    const { message, article, history } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Call the backend API for chat completion
    const response = await fetch(`${BACKEND_URL}/api/voicebot/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        article,
        history
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Backend error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('VoiceBot API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
