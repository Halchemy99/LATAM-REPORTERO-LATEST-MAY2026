import { NextResponse } from 'next/server';

// Mock articles data for API
const mockArticles = [
  {
    id: 'a1',
    title: 'Mexico City\'s Revolutionary Water Recycling Program Shows Promising Results',
    slug: 'mexico-city-water-recycling-program',
    excerpt: 'A groundbreaking initiative to address the water crisis in one of the world\'s largest metropolitan areas.',
    category: 'environment',
    region: 'mexico',
    author: { name: 'Maria García', trustScore: 4.8 },
    authorId: 'w1',
    trustScore: 4.8,
    isAiGenerated: false,
    featured: true,
    mainImage: 'https://images.unsplash.com/photo-1568632234180-0e6c08735d01?w=800&h=450&fit=crop',
    readTime: 8,
    publishedAt: '2025-06-10T14:30:00Z',
  },
  {
    id: 'a2',
    title: 'Brazil\'s Amazon Reforestation Initiative: Indigenous-Led Conservation Success',
    slug: 'brazil-amazon-reforestation-indigenous',
    excerpt: 'How indigenous communities are leading the fight against deforestation with innovative techniques.',
    category: 'environment',
    region: 'brazil',
    author: { name: 'Carlos Mendez', trustScore: 4.5 },
    authorId: 'w2',
    trustScore: 4.5,
    isAiGenerated: false,
    featured: false,
    mainImage: 'https://images.unsplash.com/photo-1759366033145-572be989e3a1?w=800&h=450&fit=crop',
    readTime: 12,
    publishedAt: '2025-06-09T10:00:00Z',
  },
  {
    id: 'a3',
    title: 'Argentina\'s Fintech Revolution: Banking the Unbanked',
    slug: 'argentina-fintech-revolution',
    excerpt: 'Digital payment platforms are transforming financial access for millions of Argentines.',
    category: 'economy',
    region: 'argentina',
    author: { name: 'Ana Rodriguez', trustScore: 4.6 },
    authorId: 'w3',
    trustScore: 4.6,
    isAiGenerated: false,
    featured: false,
    mainImage: 'https://images.unsplash.com/photo-1641135698530-8d919344c0e5?w=800&h=450&fit=crop',
    readTime: 6,
    publishedAt: '2025-06-08T16:45:00Z',
  },
  {
    id: 'a4',
    title: 'AI Analysis: Healthcare Access Improvements Across Latin America',
    slug: 'ai-healthcare-latin-america',
    excerpt: 'AI-verified data shows significant progress in telemedicine adoption post-pandemic.',
    category: 'health',
    region: 'all',
    author: { name: 'AI Analysis', trustScore: 4.2 },
    authorId: 'ai',
    trustScore: 4.2,
    isAiGenerated: true,
    featured: false,
    mainImage: 'https://images.unsplash.com/photo-1623039405147-547794f92e9e?w=800&h=450&fit=crop',
    readTime: 5,
    publishedAt: '2025-06-07T09:00:00Z',
  },
  {
    id: 'a5',
    title: 'Colombia\'s Education Reform: Digital Classrooms Reach Remote Communities',
    slug: 'colombia-education-digital-classrooms',
    excerpt: 'Satellite internet and solar-powered devices are connecting rural students to quality education.',
    category: 'education',
    region: 'colombia',
    author: { name: 'Luis Fernandez', trustScore: 4.3 },
    authorId: 'w4',
    trustScore: 4.3,
    isAiGenerated: false,
    featured: false,
    mainImage: 'https://images.unsplash.com/photo-1488942446680-85dd7de440ef?w=800&h=450&fit=crop',
    readTime: 7,
    publishedAt: '2025-06-06T11:30:00Z',
  },
  {
    id: 'a6',
    title: 'AI Verified: Chile\'s Renewable Energy Transition Ahead of Schedule',
    slug: 'ai-chile-renewable-energy',
    excerpt: 'Automated analysis confirms Chile on track for 100% renewable electricity by 2030.',
    category: 'environment',
    region: 'chile',
    author: { name: 'AI Analysis', trustScore: 4.2 },
    authorId: 'ai',
    trustScore: 4.2,
    isAiGenerated: true,
    featured: false,
    mainImage: 'https://images.unsplash.com/photo-1769694609721-98f8bab9735a?w=800&h=450&fit=crop',
    readTime: 4,
    publishedAt: '2025-06-05T14:00:00Z',
  }
];

function handleArticles(request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10');
  const category = searchParams.get('category');
  const region = searchParams.get('region');
  const type = searchParams.get('type'); // 'ai' or 'human'

  let filtered = [...mockArticles];

  if (category) {
    filtered = filtered.filter(a => a.category === category);
  }

  if (region && region !== 'all') {
    filtered = filtered.filter(a => a.region === region || a.region === 'all');
  }

  if (type === 'ai') {
    filtered = filtered.filter(a => a.isAiGenerated);
  } else if (type === 'human') {
    filtered = filtered.filter(a => !a.isAiGenerated);
  }

  return NextResponse.json(filtered.slice(0, limit));
}

function handleChat(request) {
  // Mock chat response - in production this would use Vercel AI SDK
  return NextResponse.json({
    message: 'Chat API is available. In production, this would use Vercel AI SDK with OpenAI.',
    note: 'Demo mode - AI responses are mocked'
  });
}

export async function GET(request, { params }) {
  const path = params?.path?.join('/') || '';

  // Skip catch-all for specific API routes (let their own handlers process)
  if (path.startsWith('admin/') || path.startsWith('voicebot')) {
    return NextResponse.json({ error: 'Route not found in catch-all' }, { status: 404 });
  }

  // Route handling
  switch (path) {
    case '':
      return NextResponse.json({ message: 'LATAM Reportero API', version: '1.0.0' });
    case 'articles':
      return handleArticles(request);
    case 'health':
      return NextResponse.json({ status: 'healthy', timestamp: new Date().toISOString() });
    default:
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}

export async function POST(request, { params }) {
  const path = params?.path?.join('/') || '';

  // Skip catch-all for specific API routes (let their own handlers process)
  if (path.startsWith('admin/') || path.startsWith('voicebot')) {
    return NextResponse.json({ error: 'Route not found in catch-all' }, { status: 404 });
  }

  switch (path) {
    case 'auth/logout':
      return NextResponse.json({ success: true, message: 'Logged out' });
    case 'chat':
      return handleChat(request);
    case 'checkout':
      // Mock Stripe checkout
      return NextResponse.json({
        url: '/pricing?demo=checkout',
        message: 'Demo mode - Stripe checkout simulated'
      });
    case 'portal':
      // Mock Stripe portal
      return NextResponse.json({
        url: '/dashboard?demo=portal',
        message: 'Demo mode - Stripe portal simulated'
      });
    default:
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
