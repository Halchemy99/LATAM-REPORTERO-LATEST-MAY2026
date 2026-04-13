// Mock data for LATAM Reportero with multilingual support
// Note: Demo credentials for testing purposes only. In production, use environment variables.

export const demoUsers = {
  'admin@latamreportero.com': { password: process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD || 'admin123', role: 'admin', name: 'Admin User' },
  'editor@latamreportero.com': { password: process.env.NEXT_PUBLIC_DEMO_EDITOR_PASSWORD || 'editor123', role: 'editor', name: 'Maria García' },
  'contributor@latamreportero.com': { password: process.env.NEXT_PUBLIC_DEMO_CONTRIB_PASSWORD || 'contrib123', role: 'contributor', name: 'Carlos Mendez' },
  'demo@latamreportero.com': { password: process.env.NEXT_PUBLIC_DEMO_USER_PASSWORD || 'demo123', role: 'paid', name: 'Demo User' },
  'free@latamreportero.com': { password: process.env.NEXT_PUBLIC_DEMO_FREE_PASSWORD || 'free123', role: 'free', name: 'Free User' }
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
    specialty: { en: 'Politics & Governance', es: 'Política y Gobernanza', pt: 'Política e Governança' },
    bio: {
      en: 'Award-winning investigative journalist with 15 years covering Latin American politics. Former editor at El Universal.',
      es: 'Periodista de investigación galardonada con 15 años cubriendo la política latinoamericana. Ex editora de El Universal.',
      pt: 'Jornalista investigativa premiada com 15 anos cobrindo política latino-americana. Ex-editora do El Universal.'
    },
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
    specialty: { en: 'Environment & Climate', es: 'Medio Ambiente y Clima', pt: 'Meio Ambiente e Clima' },
    bio: {
      en: 'Environmental correspondent focusing on Amazon rainforest and climate change. Pulitzer Center grantee.',
      es: 'Corresponsal ambiental enfocado en la selva amazónica y el cambio climático. Beneficiario del Centro Pulitzer.',
      pt: 'Correspondente ambiental focado na floresta amazônica e mudanças climáticas. Bolsista do Pulitzer Center.'
    },
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
    specialty: { en: 'Economy & Development', es: 'Economía y Desarrollo', pt: 'Economia e Desenvolvimento' },
    bio: {
      en: 'Economic analyst covering trade, development, and fintech across the region.',
      es: 'Analista económica cubriendo comercio, desarrollo y fintech en toda la región.',
      pt: 'Analista econômica cobrindo comércio, desenvolvimento e fintech em toda a região.'
    },
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
    specialty: { en: 'Health & Education', es: 'Salud y Educación', pt: 'Saúde e Educação' },
    bio: {
      en: 'Health journalist covering public health crises and education reform.',
      es: 'Periodista de salud cubriendo crisis de salud pública y reforma educativa.',
      pt: 'Jornalista de saúde cobrindo crises de saúde pública e reforma educacional.'
    },
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
    specialty: { en: 'Human Rights', es: 'Derechos Humanos', pt: 'Direitos Humanos' },
    bio: {
      en: 'Human rights correspondent documenting migration, indigenous rights, and social movements.',
      es: 'Corresponsal de derechos humanos documentando migración, derechos indígenas y movimientos sociales.',
      pt: 'Correspondente de direitos humanos documentando migração, direitos indígenas e movimentos sociais.'
    },
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    region: 'Chile'
  }
];

// Helper function to get localized content
export function getLocalizedContent(content, locale = 'en') {
  if (typeof content === 'string') return content;
  if (typeof content === 'object' && content !== null) {
    return content[locale] || content.en || content;
  }
  return content;
}

export const mockArticles = [
  {
    id: 'a1',
    title: {
      en: "Mexico City's Revolutionary Water Recycling Program Shows Promising Results",
      es: "El Programa Revolucionario de Reciclaje de Agua de Ciudad de México Muestra Resultados Prometedores",
      pt: "Programa Revolucionário de Reciclagem de Água da Cidade do México Mostra Resultados Promissores"
    },
    slug: 'mexico-city-water-recycling-program',
    excerpt: {
      en: 'A groundbreaking initiative to address the water crisis in one of the world\'s largest metropolitan areas.',
      es: 'Una iniciativa innovadora para abordar la crisis del agua en una de las áreas metropolitanas más grandes del mundo.',
      pt: 'Uma iniciativa inovadora para enfrentar a crise hídrica em uma das maiores áreas metropolitanas do mundo.'
    },
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
    problem: {
      en: '<p>Mexico City, home to over 21 million people, faces one of the most severe water crises in the Western Hemisphere. The city sinks up to 50 centimeters per year due to over-extraction of groundwater, while climate change intensifies droughts and reduces the reliability of external water sources.</p><p>Currently, 40% of water is lost through leaky infrastructure, and millions of residents rely on expensive water deliveries from trucks. The most vulnerable communities pay up to 10 times more for water than wealthy neighborhoods with piped access.</p>',
      es: '<p>Ciudad de México, hogar de más de 21 millones de personas, enfrenta una de las crisis de agua más severas del hemisferio occidental. La ciudad se hunde hasta 50 centímetros por año debido a la sobreextracción de agua subterránea, mientras que el cambio climático intensifica las sequías.</p><p>Actualmente, el 40% del agua se pierde por infraestructura con fugas, y millones de residentes dependen de costosas entregas de agua en camiones. Las comunidades más vulnerables pagan hasta 10 veces más por el agua.</p>',
      pt: '<p>A Cidade do México, lar de mais de 21 milhões de pessoas, enfrenta uma das crises hídricas mais severas do hemisfério ocidental. A cidade afunda até 50 centímetros por ano devido à superextração de água subterrânea, enquanto as mudanças climáticas intensificam as secas.</p><p>Atualmente, 40% da água é perdida por infraestrutura com vazamentos, e milhões de residentes dependem de entregas caras de água por caminhões. As comunidades mais vulneráveis pagam até 10 vezes mais pela água.</p>'
    },
    solutions: {
      en: '<p><strong>Decentralized Water Recycling:</strong> The city has implemented 200 community-scale water recycling facilities that treat greywater for non-potable uses, reducing demand on the main supply by 15%.</p><p><strong>Smart Infrastructure:</strong> AI-powered sensors now monitor 60% of the pipe network, detecting leaks in real-time and reducing water loss by 12% in pilot areas.</p><p><strong>Rainwater Harvesting:</strong> A new law requires all new buildings to install rainwater collection systems, with subsidies for retrofitting existing structures.</p>',
      es: '<p><strong>Reciclaje de Agua Descentralizado:</strong> La ciudad ha implementado 200 instalaciones de reciclaje de agua a escala comunitaria que tratan aguas grises para usos no potables, reduciendo la demanda del suministro principal en un 15%.</p><p><strong>Infraestructura Inteligente:</strong> Sensores con IA ahora monitorean el 60% de la red de tuberías, detectando fugas en tiempo real y reduciendo la pérdida de agua en un 12%.</p><p><strong>Captación de Agua de Lluvia:</strong> Una nueva ley requiere que todos los edificios nuevos instalen sistemas de recolección de agua de lluvia.</p>',
      pt: '<p><strong>Reciclagem de Água Descentralizada:</strong> A cidade implementou 200 instalações de reciclagem de água em escala comunitária que tratam águas cinzas para usos não potáveis, reduzindo a demanda do abastecimento principal em 15%.</p><p><strong>Infraestrutura Inteligente:</strong> Sensores com IA agora monitoram 60% da rede de tubulações, detectando vazamentos em tempo real e reduzindo a perda de água em 12%.</p><p><strong>Captação de Água da Chuva:</strong> Uma nova lei exige que todos os novos edifícios instalem sistemas de coleta de água da chuva.</p>'
    },
    impact: {
      en: '<p>After 18 months, the program has achieved remarkable results:</p><ul><li>Water consumption reduced by 18% in participating districts</li><li>3.2 million residents now have improved water access</li><li>Infrastructure repair costs down 25% through predictive maintenance</li><li>Model being studied for adoption in São Paulo and Lima</li></ul>',
      es: '<p>Después de 18 meses, el programa ha logrado resultados notables:</p><ul><li>Consumo de agua reducido en un 18% en los distritos participantes</li><li>3.2 millones de residentes ahora tienen mejor acceso al agua</li><li>Costos de reparación de infraestructura reducidos en un 25%</li><li>Modelo siendo estudiado para adopción en São Paulo y Lima</li></ul>',
      pt: '<p>Após 18 meses, o programa alcançou resultados notáveis:</p><ul><li>Consumo de água reduzido em 18% nos distritos participantes</li><li>3,2 milhões de residentes agora têm melhor acesso à água</li><li>Custos de reparo de infraestrutura reduzidos em 25%</li><li>Modelo sendo estudado para adoção em São Paulo e Lima</li></ul>'
    },
    sources: [
      { name: 'CONAGUA Report 2025', url: '#' },
      { name: 'World Bank Water Initiative', url: '#' },
      { name: 'UNAM Research Paper', url: '#' }
    ]
  }
];

export const mockPolls = [
  {
    id: 'poll1',
    title: {
      en: 'Most Pressing Regional Issue',
      es: 'Problema Regional Más Urgente',
      pt: 'Questão Regional Mais Urgente'
    },
    description: {
      en: 'What do you think is the most important challenge facing Latin America today?',
      es: '¿Cuál crees que es el desafío más importante que enfrenta América Latina hoy?',
      pt: 'Qual você acha que é o desafio mais importante que a América Latina enfrenta hoje?'
    },
    category: 'general',
    region: 'all',
    isActive: true,
    options: [
      { id: 'opt1', text: { en: 'Climate Change', es: 'Cambio Climático', pt: 'Mudanças Climáticas' }, votes: 342 },
      { id: 'opt2', text: { en: 'Economic Inequality', es: 'Desigualdad Económica', pt: 'Desigualdade Econômica' }, votes: 528 },
      { id: 'opt3', text: { en: 'Political Corruption', es: 'Corrupción Política', pt: 'Corrupção Política' }, votes: 456 },
      { id: 'opt4', text: { en: 'Healthcare Access', es: 'Acceso a la Salud', pt: 'Acesso à Saúde' }, votes: 289 }
    ],
    createdAt: '2025-06-01T00:00:00Z'
  }
];

export const mockTrendingTopics = [
  { id: 't1', topic: { en: 'Water Crisis Solutions', es: 'Soluciones a la Crisis del Agua', pt: 'Soluções para a Crise Hídrica' }, region: 'mexico', category: 'environment', mentionCount: 1234 },
  { id: 't2', topic: { en: 'Amazon Reforestation', es: 'Reforestación del Amazonas', pt: 'Reflorestamento da Amazônia' }, region: 'brazil', category: 'environment', mentionCount: 987 },
  { id: 't3', topic: { en: 'Fintech Adoption', es: 'Adopción de Fintech', pt: 'Adoção de Fintech' }, region: 'argentina', category: 'economy', mentionCount: 856 },
  { id: 't4', topic: { en: 'Telemedicine Growth', es: 'Crecimiento de Telemedicina', pt: 'Crescimento da Telemedicina' }, region: 'all', category: 'health', mentionCount: 743 },
  { id: 't5', topic: { en: 'Renewable Energy', es: 'Energía Renovable', pt: 'Energia Renovável' }, region: 'chile', category: 'environment', mentionCount: 692 }
];

export const mockCommunities = [
  { id: 'c1', name: 'Mexico', members: 15420, activeDiscussions: 234, region: 'mexico' },
  { id: 'c2', name: 'Brazil', members: 23100, activeDiscussions: 456, region: 'brazil' },
  { id: 'c3', name: 'Argentina', members: 8750, activeDiscussions: 189, region: 'argentina' },
  { id: 'c4', name: 'Chile', members: 6200, activeDiscussions: 145, region: 'chile' },
  { id: 'c5', name: 'Colombia', members: 9800, activeDiscussions: 201, region: 'colombia' },
  { id: 'c6', name: 'Peru', members: 5400, activeDiscussions: 98, region: 'peru' }
];
