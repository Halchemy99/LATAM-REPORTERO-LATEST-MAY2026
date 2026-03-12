// Mock data for LATAM Reportero
import { v4 as uuidv4 } from 'uuid';

export const demoUsers = {
  'admin@latamreportero.com': { password: 'admin123', role: 'admin', name: 'Admin User' },
  'editor@latamreportero.com': { password: 'editor123', role: 'editor', name: 'Maria García' },
  'contributor@latamreportero.com': { password: 'contrib123', role: 'contributor', name: 'Carlos Mendez' },
  'demo@latamreportero.com': { password: 'demo123', role: 'paid', name: 'Demo User' },
  'free@latamreportero.com': { password: 'free123', role: 'free', name: 'Free User' }
};

// Writers with reputation-based credibility (no trust scores)
export const mockWriters = [
  {
    id: 'w1',
    name: 'María García',
    email: 'editor@latamreportero.com',
    role: 'editor',
    isEditor: true,
    verified: true,
    isEditoriallyReviewed: true,
    articleCount: 156,
    yearsContributing: 8,
    upvotes: 12450,
    specialty: 'Politics & Governance',
    bio: 'Award-winning investigative journalist with 15 years covering Latin American politics. Former editor at El Universal.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    region: 'Mexico'
  },
  {
    id: 'w2',
    name: 'Carlos Mendez',
    email: 'contributor@latamreportero.com',
    role: 'contributor',
    isEditor: false,
    verified: true,
    isEditoriallyReviewed: true,
    articleCount: 89,
    yearsContributing: 5,
    upvotes: 7820,
    specialty: 'Environment & Climate',
    bio: 'Environmental correspondent focusing on Amazon rainforest and climate change. Pulitzer Center grantee.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    region: 'Brazil'
  },
  {
    id: 'w3',
    name: 'Ana Rodríguez',
    email: 'ana@latamreportero.com',
    role: 'contributor',
    isEditor: false,
    verified: true,
    isEditoriallyReviewed: false,
    articleCount: 72,
    yearsContributing: 3,
    upvotes: 5340,
    specialty: 'Economy & Development',
    bio: 'Economic analyst covering trade, development, and fintech across the region.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    region: 'Argentina'
  },
  {
    id: 'w4',
    name: 'Luis Fernández',
    email: 'luis@latamreportero.com',
    role: 'contributor',
    isEditor: false,
    verified: false,
    isEditoriallyReviewed: false,
    articleCount: 45,
    yearsContributing: 1,
    upvotes: 2100,
    specialty: 'Health & Education',
    bio: 'Health journalist covering public health crises and education reform.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    region: 'Colombia'
  },
  {
    id: 'w5',
    name: 'Valentina Soto',
    email: 'valentina@latamreportero.com',
    role: 'contributor',
    isEditor: false,
    verified: true,
    isEditoriallyReviewed: true,
    articleCount: 112,
    yearsContributing: 6,
    upvotes: 9870,
    specialty: 'Human Rights',
    bio: 'Human rights correspondent documenting migration, indigenous rights, and social movements.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    region: 'Chile'
  }
];

export const mockArticles = [
  {
    id: 'a1',
    title: 'Mexico City\'s Revolutionary Water Recycling Program Shows Promising Results',
    slug: 'mexico-city-water-recycling-program',
    excerpt: 'A groundbreaking initiative to address the water crisis in one of the world\'s largest metropolitan areas.',
    category: 'environment',
    region: 'mexico',
    author: mockWriters[0],
    authorId: 'w1',
    isAiGenerated: false,
    isEditoriallyReviewed: true,
    featured: true,
    status: 'published',
    mainImage: 'https://images.unsplash.com/photo-1568632234180-0e6c08735d01?w=800&h=450&fit=crop',
    readTime: 8,
    publishedAt: '2025-06-10T14:30:00Z',
    upvotes: 2340,
    problem: `<p>Mexico City, home to over 21 million people, faces one of the most severe water crises in the Western Hemisphere. The city sinks up to 50 centimeters per year due to over-extraction of groundwater, while climate change intensifies droughts and reduces the reliability of external water sources.</p>
<p>Currently, 40% of water is lost through leaky infrastructure, and millions of residents rely on expensive water deliveries from trucks. The most vulnerable communities pay up to 10 times more for water than wealthy neighborhoods with piped access.</p>`,
    solutions: `<p><strong>Decentralized Water Recycling:</strong> The city has implemented 200 community-scale water recycling facilities that treat greywater for non-potable uses, reducing demand on the main supply by 15%.</p>
<p><strong>Smart Infrastructure:</strong> AI-powered sensors now monitor 60% of the pipe network, detecting leaks in real-time and reducing water loss by 12% in pilot areas.</p>
<p><strong>Rainwater Harvesting:</strong> A new law requires all new buildings to install rainwater collection systems, with subsidies for retrofitting existing structures.</p>`,
    impact: `<p>After 18 months, the program has achieved remarkable results:</p>
<ul>
<li>Water consumption reduced by 18% in participating districts</li>
<li>3.2 million residents now have improved water access</li>
<li>Infrastructure repair costs down 25% through predictive maintenance</li>
<li>Model being studied for adoption in São Paulo and Lima</li>
</ul>`,
    sources: [
      { name: 'CONAGUA Report 2025', url: '#' },
      { name: 'World Bank Water Initiative', url: '#' },
      { name: 'UNAM Research Paper', url: '#' }
    ]
  },
  {
    id: 'a2',
    title: 'Brazil\'s Amazon Reforestation Initiative: Indigenous-Led Conservation Success',
    slug: 'brazil-amazon-reforestation-indigenous',
    excerpt: 'How indigenous communities are leading the fight against deforestation with innovative techniques.',
    category: 'environment',
    region: 'brazil',
    author: mockWriters[1],
    authorId: 'w2',
    isAiGenerated: false,
    isEditoriallyReviewed: true,
    featured: false,
    status: 'published',
    mainImage: 'https://images.unsplash.com/photo-1759366033145-572be989e3a1?w=800&h=450&fit=crop',
    readTime: 12,
    publishedAt: '2025-06-09T10:00:00Z',
    upvotes: 1890,
    problem: `<p>The Amazon rainforest has lost over 17% of its original cover, with deforestation rates spiking dramatically in recent years. This destruction not only threatens biodiversity but also releases massive amounts of stored carbon.</p>
<p>Indigenous territories, which protect 80% of the world's remaining biodiversity, face increasing pressure from illegal logging, mining, and agricultural expansion.</p>`,
    solutions: `<p><strong>Indigenous Guardians Program:</strong> Over 500 indigenous communities now use satellite technology to monitor and report illegal activities in real-time.</p>
<p><strong>Sustainable Forest Economy:</strong> Communities have developed markets for sustainably harvested products, generating $45 million in annual revenue.</p>
<p><strong>Legal Recognition:</strong> New legislation has strengthened territorial rights and increased penalties for invaders.</p>`,
    impact: `<p>The initiative has transformed conservation outcomes:</p>
<ul>
<li>Deforestation reduced by 68% in indigenous-managed territories</li>
<li>12,000 hectares reforested using traditional techniques</li>
<li>40% increase in wildlife populations in protected areas</li>
</ul>`,
    sources: [
      { name: 'INPE Satellite Data', url: '#' },
      { name: 'Indigenous Council Report', url: '#' }
    ]
  },
  {
    id: 'a3',
    title: 'Argentina\'s Fintech Revolution: Banking the Unbanked',
    slug: 'argentina-fintech-revolution',
    excerpt: 'Digital payment platforms are transforming financial access for millions of Argentines.',
    category: 'economy',
    region: 'argentina',
    author: mockWriters[2],
    authorId: 'w3',
    isAiGenerated: false,
    isEditoriallyReviewed: false,
    featured: false,
    status: 'published',
    mainImage: 'https://images.unsplash.com/photo-1641135698530-8d919344c0e5?w=800&h=450&fit=crop',
    readTime: 6,
    publishedAt: '2025-06-08T16:45:00Z',
    upvotes: 1456,
    problem: `<p>Argentina's chronic inflation and currency instability have historically excluded millions from traditional banking. Nearly 50% of the population remains "unbanked," relying entirely on cash.</p>
<p>High fees, inaccessible branch locations, and documentation requirements create barriers that disproportionately affect low-income and rural populations.</p>`,
    solutions: `<p><strong>Mobile-First Banking:</strong> New fintech platforms allow account opening with just a phone number and national ID, no credit history required.</p>
<p><strong>QR Payment Networks:</strong> Small businesses can now accept digital payments with zero fees, creating a parallel financial ecosystem.</p>
<p><strong>Crypto Integration:</strong> Stablecoin savings products protect against peso devaluation while maintaining liquidity.</p>`,
    impact: `<p>The transformation is measurable:</p>
<ul>
<li>8 million new digital bank accounts opened in 2024</li>
<li>Small business revenues up 23% with digital payment acceptance</li>
<li>Remittance costs reduced by 60% through blockchain rails</li>
</ul>`,
    sources: [
      { name: 'BCRA Financial Inclusion Report', url: '#' },
      { name: 'World Bank Global Findex', url: '#' }
    ]
  },
  {
    id: 'a4',
    title: 'Healthcare Access Improvements Across Latin America',
    slug: 'healthcare-latin-america',
    excerpt: 'Data analysis shows significant progress in telemedicine adoption post-pandemic.',
    category: 'health',
    region: 'all',
    author: mockWriters[3],
    authorId: 'w4',
    isAiGenerated: false,
    isEditoriallyReviewed: false,
    featured: false,
    status: 'published',
    mainImage: 'https://images.unsplash.com/photo-1623039405147-547794f92e9e?w=800&h=450&fit=crop',
    readTime: 5,
    publishedAt: '2025-06-07T09:00:00Z',
    upvotes: 987,
    problem: `<p>Rural healthcare access remains a critical challenge across Latin America. An estimated 150 million people live more than two hours from the nearest hospital.</p>
<p>Doctor shortages in non-urban areas create a two-tier health system where quality of care depends heavily on geography.</p>`,
    solutions: `<p><strong>Telemedicine Networks:</strong> National telemedicine programs now connect rural clinics with urban specialists via video consultation.</p>
<p><strong>AI Diagnostic Support:</strong> Machine learning tools help community health workers identify conditions that require specialist referral.</p>
<p><strong>Mobile Health Units:</strong> Equipped vehicles bring preventive care and basic treatments to remote communities on regular schedules.</p>`,
    impact: `<p>Data from health ministries shows:</p>
<ul>
<li>Telemedicine consultations up 340% since 2020</li>
<li>Average time to specialist consultation reduced from 3 months to 2 weeks</li>
<li>Maternal mortality in pilot areas down 28%</li>
</ul>`,
    sources: [
      { name: 'PAHO Health Data', url: '#' },
      { name: 'WHO Regional Report', url: '#' }
    ]
  },
  {
    id: 'a5',
    title: 'Colombia\'s Education Reform: Digital Classrooms Reach Remote Communities',
    slug: 'colombia-education-digital-classrooms',
    excerpt: 'Satellite internet and solar-powered devices are connecting rural students to quality education.',
    category: 'education',
    region: 'colombia',
    author: mockWriters[3],
    authorId: 'w4',
    isAiGenerated: false,
    isEditoriallyReviewed: false,
    featured: false,
    status: 'published',
    mainImage: 'https://images.unsplash.com/photo-1488942446680-85dd7de440ef?w=800&h=450&fit=crop',
    readTime: 7,
    publishedAt: '2025-06-06T11:30:00Z',
    upvotes: 1123,
    problem: `<p>Colombia's geography—mountains, jungles, and vast rural areas—has historically created severe educational inequality. Rural students score 40% lower on standardized tests than urban peers.</p>
<p>Teacher shortages in remote areas mean many students never complete secondary education.</p>`,
    solutions: `<p><strong>Satellite Connectivity:</strong> 2,500 schools now have reliable internet through a public-private satellite partnership.</p>
<p><strong>Bilingual Digital Content:</strong> Curriculum available in Spanish and six indigenous languages ensures accessibility.</p>
<p><strong>Teacher Training Hubs:</strong> Regional centers provide ongoing professional development without requiring long travel.</p>`,
    impact: `<p>Early results are encouraging:</p>
<ul>
<li>Secondary school completion rates up 34% in connected communities</li>
<li>65,000 students accessing university prep courses remotely</li>
<li>Indigenous language content engagement exceeds expectations</li>
</ul>`,
    sources: [
      { name: 'Ministry of Education Data', url: '#' },
      { name: 'UNESCO Education Report', url: '#' }
    ]
  },
  {
    id: 'a6',
    title: 'Chile\'s Renewable Energy Transition Ahead of Schedule',
    slug: 'chile-renewable-energy',
    excerpt: 'Chile on track for 100% renewable electricity by 2030.',
    category: 'environment',
    region: 'chile',
    author: mockWriters[4],
    authorId: 'w5',
    isAiGenerated: false,
    isEditoriallyReviewed: true,
    featured: false,
    status: 'published',
    mainImage: 'https://images.unsplash.com/photo-1769694609721-98f8bab9735a?w=800&h=450&fit=crop',
    readTime: 4,
    publishedAt: '2025-06-05T14:00:00Z',
    upvotes: 2045,
    problem: `<p>Chile's Atacama Desert receives among the highest solar radiation on Earth, yet the country historically relied heavily on imported fossil fuels for electricity generation.</p>
<p>Energy costs were among the highest in South America, creating competitiveness challenges for industry.</p>`,
    solutions: `<p><strong>Solar Mega-Projects:</strong> Large-scale solar installations now cover 40,000 hectares of desert land.</p>
<p><strong>Green Hydrogen:</strong> Excess solar power is used to produce hydrogen for export and industrial use.</p>
<p><strong>Grid Modernization:</strong> Smart grid technology balances variable renewable generation across the national network.</p>`,
    impact: `<p>Verified energy data shows:</p>
<ul>
<li>Renewable share of electricity now at 72%, up from 45% in 2020</li>
<li>Industrial electricity costs down 35%</li>
<li>Carbon emissions from power sector reduced by 48%</li>
</ul>`,
    sources: [
      { name: 'CNE Energy Statistics', url: '#' },
      { name: 'IEA Country Report', url: '#' }
    ]
  }
];

export const mockPolls = [
  {
    id: 'poll1',
    title: 'Most Pressing Regional Issue',
    titleEs: 'Problema Regional Más Urgente',
    description: 'What do you think is the most important challenge facing Latin America today?',
    descriptionEs: '¿Cuál crees que es el desafío más importante que enfrenta América Latina hoy?',
    category: 'general',
    region: 'all',
    isActive: true,
    options: [
      { id: 'opt1', text: 'Climate Change', textEs: 'Cambio Climático', votes: 342 },
      { id: 'opt2', text: 'Economic Inequality', textEs: 'Desigualdad Económica', votes: 528 },
      { id: 'opt3', text: 'Political Corruption', textEs: 'Corrupción Política', votes: 456 },
      { id: 'opt4', text: 'Healthcare Access', textEs: 'Acceso a la Salud', votes: 289 }
    ],
    createdAt: '2025-06-01T00:00:00Z'
  }
];

export const mockTrendingTopics = [
  { id: 't1', topic: 'Water Crisis Solutions', region: 'mexico', category: 'environment', mentionCount: 1234 },
  { id: 't2', topic: 'Amazon Reforestation', region: 'brazil', category: 'environment', mentionCount: 987 },
  { id: 't3', topic: 'Fintech Adoption', region: 'argentina', category: 'economy', mentionCount: 856 },
  { id: 't4', topic: 'Telemedicine Growth', region: 'all', category: 'health', mentionCount: 743 },
  { id: 't5', topic: 'Renewable Energy', region: 'chile', category: 'environment', mentionCount: 692 }
];

export const mockCommunities = [
  { id: 'c1', name: 'Mexico', members: 15420, activeDiscussions: 234, region: 'mexico' },
  { id: 'c2', name: 'Brazil', members: 23100, activeDiscussions: 456, region: 'brazil' },
  { id: 'c3', name: 'Argentina', members: 8750, activeDiscussions: 189, region: 'argentina' },
  { id: 'c4', name: 'Chile', members: 6200, activeDiscussions: 145, region: 'chile' },
  { id: 'c5', name: 'Colombia', members: 9800, activeDiscussions: 201, region: 'colombia' },
  { id: 'c6', name: 'Peru', members: 5400, activeDiscussions: 98, region: 'peru' }
];
