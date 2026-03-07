import { NextResponse } from 'next/server';

export async function middleware(request) {
  // Simply pass through all requests - auth will be handled client-side
  // This avoids session issues with Supabase SSR
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Only match API routes if needed
    '/api/:path*',
  ],
};
