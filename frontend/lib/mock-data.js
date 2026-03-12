// Mock data for LATAM Reportero with multilingual support

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
      en: `<p>Mexico City, home to over 21 million people, faces one of the most severe water crises in the Western Hemisphere. The city sinks up to 50 centimeters per year due to over-extraction of groundwater, while climate change intensifies droughts and reduces the reliability of external water sources.</p>
<p>Currently, 40% of water is lost through leaky infrastructure, and millions of residents rely on expensive water deliveries from trucks. The most vulnerable communities pay up to 10 times more for water than wealthy neighborhoods with piped access.</p>`,
      es: `<p>Ciudad de México, hogar de más de 21 millones de personas, enfrenta una de las crisis de agua más severas del hemisferio occidental. La ciudad se hunde hasta 50 centímetros por año debido a la sobreextracción de agua subterránea, mientras que el cambio climático intensifica las sequías.</p>
<p>Actualmente, el 40% del agua se pierde por infraestructura con fugas, y millones de residentes dependen de costosas entregas de agua en camiones. Las comunidades más vulnerables pagan hasta 10 veces más por el agua.</p>`,
      pt: `<p>A Cidade do México, lar de mais de 21 milhões de pessoas, enfrenta uma das crises hídricas mais severas do hemisfério ocidental. A cidade afunda até 50 centímetros por ano devido à superextração de água subterrânea, enquanto as mudanças climáticas intensificam as secas.</p>
<p>Atualmente, 40% da água é perdida por infraestrutura com vazamentos, e milhões de residentes dependem de entregas caras de água por caminhões. As comunidades mais vulneráveis pagam até 10 vezes mais pela água.</p>`
    },
    solutions: {
      en: `<p><strong>Decentralized Water Recycling:</strong> The city has implemented 200 community-scale water recycling facilities that treat greywater for non-potable uses, reducing demand on the main supply by 15%.</p>
<p><strong>Smart Infrastructure:</strong> AI-powered sensors now monitor 60% of the pipe network, detecting leaks in real-time and reducing water loss by 12% in pilot areas.</p>
<p><strong>Rainwater Harvesting:</strong> A new law requires all new buildings to install rainwater collection systems, with subsidies for retrofitting existing structures.</p>`,
      es: `<p><strong>Reciclaje de Agua Descentralizado:</strong> La ciudad ha implementado 200 instalaciones de reciclaje de agua a escala comunitaria que tratan aguas grises para usos no potables, reduciendo la demanda del suministro principal en un 15%.</p>
<p><strong>Infraestructura Inteligente:</strong> Sensores con IA ahora monitorean el 60% de la red de tuberías, detectando fugas en tiempo real y reduciendo la pérdida de agua en un 12%.</p>
<p><strong>Captación de Agua de Lluvia:</strong> Una nueva ley requiere que todos los edificios nuevos instalen sistemas de recolección de agua de lluvia.</p>`,
      pt: `<p><strong>Reciclagem de Água Descentralizada:</strong> A cidade implementou 200 instalações de reciclagem de água em escala comunitária que tratam águas cinzas para usos não potáveis, reduzindo a demanda do abastecimento principal em 15%.</p>
<p><strong>Infraestrutura Inteligente:</strong> Sensores com IA agora monitoram 60% da rede de tubulações, detectando vazamentos em tempo real e reduzindo a perda de água em 12%.</p>
<p><strong>Captação de Água da Chuva:</strong> Uma nova lei exige que todos os novos edifícios instalem sistemas de coleta de água da chuva.</p>`
    },
    impact: {
      en: `<p>After 18 months, the program has achieved remarkable results:</p>
<ul>
<li>Water consumption reduced by 18% in participating districts</li>
<li>3.2 million residents now have improved water access</li>
<li>Infrastructure repair costs down 25% through predictive maintenance</li>
<li>Model being studied for adoption in São Paulo and Lima</li>
</ul>`,
      es: `<p>Después de 18 meses, el programa ha logrado resultados notables:</p>
<ul>
<li>Consumo de agua reducido en un 18% en los distritos participantes</li>
<li>3.2 millones de residentes ahora tienen mejor acceso al agua</li>
<li>Costos de reparación de infraestructura reducidos en un 25%</li>
<li>Modelo siendo estudiado para adopción en São Paulo y Lima</li>
</ul>`,
      pt: `<p>Após 18 meses, o programa alcançou resultados notáveis:</p>
<ul>
<li>Consumo de água reduzido em 18% nos distritos participantes</li>
<li>3,2 milhões de residentes agora têm melhor acesso à água</li>
<li>Custos de reparo de infraestrutura reduzidos em 25%</li>
<li>Modelo sendo estudado para adoção em São Paulo e Lima</li>
</ul>`
    },
    sources: [
      { name: 'CONAGUA Report 2025', url: '#' },
      { name: 'World Bank Water Initiative', url: '#' },
      { name: 'UNAM Research Paper', url: '#' }
    ]
  },
  {
    id: 'a2',
    title: {
      en: "Brazil's Amazon Reforestation Initiative: Indigenous-Led Conservation Success",
      es: "Iniciativa de Reforestación del Amazonas de Brasil: Éxito de Conservación Liderado por Indígenas",
      pt: "Iniciativa de Reflorestamento da Amazônia do Brasil: Sucesso de Conservação Liderada por Indígenas"
    },
    slug: 'brazil-amazon-reforestation-indigenous',
    excerpt: {
      en: 'How indigenous communities are leading the fight against deforestation with innovative techniques.',
      es: 'Cómo las comunidades indígenas están liderando la lucha contra la deforestación con técnicas innovadoras.',
      pt: 'Como as comunidades indígenas estão liderando a luta contra o desmatamento com técnicas inovadoras.'
    },
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
    problem: {
      en: `<p>The Amazon rainforest has lost over 17% of its original cover, with deforestation rates spiking dramatically in recent years. This destruction not only threatens biodiversity but also releases massive amounts of stored carbon.</p>
<p>Indigenous territories, which protect 80% of the world's remaining biodiversity, face increasing pressure from illegal logging, mining, and agricultural expansion.</p>`,
      es: `<p>La selva amazónica ha perdido más del 17% de su cobertura original, con tasas de deforestación aumentando dramáticamente en los últimos años. Esta destrucción no solo amenaza la biodiversidad sino que también libera cantidades masivas de carbono almacenado.</p>
<p>Los territorios indígenas, que protegen el 80% de la biodiversidad restante del mundo, enfrentan una presión creciente de la tala ilegal, la minería y la expansión agrícola.</p>`,
      pt: `<p>A floresta amazônica perdeu mais de 17% de sua cobertura original, com taxas de desmatamento aumentando dramaticamente nos últimos anos. Essa destruição não apenas ameaça a biodiversidade, mas também libera quantidades massivas de carbono armazenado.</p>
<p>Os territórios indígenas, que protegem 80% da biodiversidade remanescente do mundo, enfrentam pressão crescente da extração ilegal de madeira, mineração e expansão agrícola.</p>`
    },
    solutions: {
      en: `<p><strong>Indigenous Guardians Program:</strong> Over 500 indigenous communities now use satellite technology to monitor and report illegal activities in real-time.</p>
<p><strong>Sustainable Forest Economy:</strong> Communities have developed markets for sustainably harvested products, generating $45 million in annual revenue.</p>
<p><strong>Legal Recognition:</strong> New legislation has strengthened territorial rights and increased penalties for invaders.</p>`,
      es: `<p><strong>Programa de Guardianes Indígenas:</strong> Más de 500 comunidades indígenas ahora usan tecnología satelital para monitorear y reportar actividades ilegales en tiempo real.</p>
<p><strong>Economía Forestal Sostenible:</strong> Las comunidades han desarrollado mercados para productos cosechados de manera sostenible, generando $45 millones en ingresos anuales.</p>
<p><strong>Reconocimiento Legal:</strong> Nueva legislación ha fortalecido los derechos territoriales y aumentado las penalidades para invasores.</p>`,
      pt: `<p><strong>Programa de Guardiões Indígenas:</strong> Mais de 500 comunidades indígenas agora usam tecnologia de satélite para monitorar e relatar atividades ilegais em tempo real.</p>
<p><strong>Economia Florestal Sustentável:</strong> As comunidades desenvolveram mercados para produtos colhidos de forma sustentável, gerando US$ 45 milhões em receita anual.</p>
<p><strong>Reconhecimento Legal:</strong> Nova legislação fortaleceu os direitos territoriais e aumentou as penalidades para invasores.</p>`
    },
    impact: {
      en: `<p>The initiative has transformed conservation outcomes:</p>
<ul>
<li>Deforestation reduced by 68% in indigenous-managed territories</li>
<li>12,000 hectares reforested using traditional techniques</li>
<li>40% increase in wildlife populations in protected areas</li>
</ul>`,
      es: `<p>La iniciativa ha transformado los resultados de conservación:</p>
<ul>
<li>Deforestación reducida en un 68% en territorios gestionados por indígenas</li>
<li>12,000 hectáreas reforestadas usando técnicas tradicionales</li>
<li>40% de aumento en poblaciones de vida silvestre en áreas protegidas</li>
</ul>`,
      pt: `<p>A iniciativa transformou os resultados de conservação:</p>
<ul>
<li>Desmatamento reduzido em 68% em territórios geridos por indígenas</li>
<li>12.000 hectares reflorestados usando técnicas tradicionais</li>
<li>40% de aumento nas populações de vida selvagem em áreas protegidas</li>
</ul>`
    },
    sources: [
      { name: 'INPE Satellite Data', url: '#' },
      { name: 'Indigenous Council Report', url: '#' }
    ]
  },
  {
    id: 'a3',
    title: {
      en: "Argentina's Fintech Revolution: Banking the Unbanked",
      es: "La Revolución Fintech de Argentina: Bancarizando a los No Bancarizados",
      pt: "A Revolução Fintech da Argentina: Bancarizando os Desbancarizados"
    },
    slug: 'argentina-fintech-revolution',
    excerpt: {
      en: 'Digital payment platforms are transforming financial access for millions of Argentines.',
      es: 'Las plataformas de pago digital están transformando el acceso financiero para millones de argentinos.',
      pt: 'Plataformas de pagamento digital estão transformando o acesso financeiro para milhões de argentinos.'
    },
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
    problem: {
      en: `<p>Argentina's chronic inflation and currency instability have historically excluded millions from traditional banking. Nearly 50% of the population remains "unbanked," relying entirely on cash.</p>
<p>High fees, inaccessible branch locations, and documentation requirements create barriers that disproportionately affect low-income and rural populations.</p>`,
      es: `<p>La inflación crónica y la inestabilidad monetaria de Argentina han excluido históricamente a millones de la banca tradicional. Casi el 50% de la población permanece "no bancarizada", dependiendo enteramente del efectivo.</p>
<p>Altas comisiones, ubicaciones de sucursales inaccesibles y requisitos de documentación crean barreras que afectan desproporcionadamente a las poblaciones de bajos ingresos y rurales.</p>`,
      pt: `<p>A inflação crônica e a instabilidade monetária da Argentina historicamente excluíram milhões do sistema bancário tradicional. Quase 50% da população permanece "desbancarizada", dependendo inteiramente de dinheiro.</p>
<p>Taxas altas, localizações de agências inacessíveis e requisitos de documentação criam barreiras que afetam desproporcionalmente populações de baixa renda e rurais.</p>`
    },
    solutions: {
      en: `<p><strong>Mobile-First Banking:</strong> New fintech platforms allow account opening with just a phone number and national ID, no credit history required.</p>
<p><strong>QR Payment Networks:</strong> Small businesses can now accept digital payments with zero fees, creating a parallel financial ecosystem.</p>
<p><strong>Crypto Integration:</strong> Stablecoin savings products protect against peso devaluation while maintaining liquidity.</p>`,
      es: `<p><strong>Banca Mobile-First:</strong> Nuevas plataformas fintech permiten abrir cuentas solo con un número de teléfono e identificación nacional, sin historial crediticio requerido.</p>
<p><strong>Redes de Pago QR:</strong> Las pequeñas empresas ahora pueden aceptar pagos digitales sin comisiones, creando un ecosistema financiero paralelo.</p>
<p><strong>Integración Cripto:</strong> Los productos de ahorro en stablecoins protegen contra la devaluación del peso mientras mantienen la liquidez.</p>`,
      pt: `<p><strong>Banco Mobile-First:</strong> Novas plataformas fintech permitem abertura de conta apenas com número de telefone e identidade nacional, sem histórico de crédito necessário.</p>
<p><strong>Redes de Pagamento QR:</strong> Pequenas empresas agora podem aceitar pagamentos digitais sem taxas, criando um ecossistema financeiro paralelo.</p>
<p><strong>Integração Cripto:</strong> Produtos de poupança em stablecoins protegem contra a desvalorização do peso mantendo a liquidez.</p>`
    },
    impact: {
      en: `<p>The transformation is measurable:</p>
<ul>
<li>8 million new digital bank accounts opened in 2024</li>
<li>Small business revenues up 23% with digital payment acceptance</li>
<li>Remittance costs reduced by 60% through blockchain rails</li>
</ul>`,
      es: `<p>La transformación es medible:</p>
<ul>
<li>8 millones de nuevas cuentas bancarias digitales abiertas en 2024</li>
<li>Ingresos de pequeñas empresas aumentaron 23% con aceptación de pagos digitales</li>
<li>Costos de remesas reducidos en 60% a través de blockchain</li>
</ul>`,
      pt: `<p>A transformação é mensurável:</p>
<ul>
<li>8 milhões de novas contas bancárias digitais abertas em 2024</li>
<li>Receitas de pequenas empresas aumentaram 23% com aceitação de pagamentos digitais</li>
<li>Custos de remessas reduzidos em 60% através de blockchain</li>
</ul>`
    },
    sources: [
      { name: 'BCRA Financial Inclusion Report', url: '#' },
      { name: 'World Bank Global Findex', url: '#' }
    ]
  },
  {
    id: 'a4',
    title: {
      en: 'Healthcare Access Improvements Across Latin America',
      es: 'Mejoras en el Acceso a la Salud en América Latina',
      pt: 'Melhorias no Acesso à Saúde na América Latina'
    },
    slug: 'healthcare-latin-america',
    excerpt: {
      en: 'Data analysis shows significant progress in telemedicine adoption post-pandemic.',
      es: 'El análisis de datos muestra un progreso significativo en la adopción de telemedicina después de la pandemia.',
      pt: 'Análise de dados mostra progresso significativo na adoção de telemedicina pós-pandemia.'
    },
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
    problem: {
      en: `<p>Rural healthcare access remains a critical challenge across Latin America. An estimated 150 million people live more than two hours from the nearest hospital.</p>
<p>Doctor shortages in non-urban areas create a two-tier health system where quality of care depends heavily on geography.</p>`,
      es: `<p>El acceso a la salud rural sigue siendo un desafío crítico en América Latina. Se estima que 150 millones de personas viven a más de dos horas del hospital más cercano.</p>
<p>La escasez de médicos en áreas no urbanas crea un sistema de salud de dos niveles donde la calidad de la atención depende en gran medida de la geografía.</p>`,
      pt: `<p>O acesso à saúde rural continua sendo um desafio crítico na América Latina. Estima-se que 150 milhões de pessoas vivem a mais de duas horas do hospital mais próximo.</p>
<p>A escassez de médicos em áreas não urbanas cria um sistema de saúde de dois níveis onde a qualidade do atendimento depende muito da geografia.</p>`
    },
    solutions: {
      en: `<p><strong>Telemedicine Networks:</strong> National telemedicine programs now connect rural clinics with urban specialists via video consultation.</p>
<p><strong>AI Diagnostic Support:</strong> Machine learning tools help community health workers identify conditions that require specialist referral.</p>
<p><strong>Mobile Health Units:</strong> Equipped vehicles bring preventive care and basic treatments to remote communities on regular schedules.</p>`,
      es: `<p><strong>Redes de Telemedicina:</strong> Los programas nacionales de telemedicina ahora conectan clínicas rurales con especialistas urbanos a través de videoconsulta.</p>
<p><strong>Soporte de Diagnóstico IA:</strong> Las herramientas de aprendizaje automático ayudan a los trabajadores de salud comunitarios a identificar condiciones que requieren derivación a especialistas.</p>
<p><strong>Unidades Móviles de Salud:</strong> Vehículos equipados llevan atención preventiva y tratamientos básicos a comunidades remotas en horarios regulares.</p>`,
      pt: `<p><strong>Redes de Telemedicina:</strong> Programas nacionais de telemedicina agora conectam clínicas rurais com especialistas urbanos via videoconsulta.</p>
<p><strong>Suporte de Diagnóstico IA:</strong> Ferramentas de aprendizado de máquina ajudam trabalhadores de saúde comunitários a identificar condições que requerem encaminhamento a especialistas.</p>
<p><strong>Unidades Móveis de Saúde:</strong> Veículos equipados levam cuidados preventivos e tratamentos básicos a comunidades remotas em horários regulares.</p>`
    },
    impact: {
      en: `<p>Data from health ministries shows:</p>
<ul>
<li>Telemedicine consultations up 340% since 2020</li>
<li>Average time to specialist consultation reduced from 3 months to 2 weeks</li>
<li>Maternal mortality in pilot areas down 28%</li>
</ul>`,
      es: `<p>Datos de los ministerios de salud muestran:</p>
<ul>
<li>Consultas de telemedicina aumentaron 340% desde 2020</li>
<li>Tiempo promedio para consulta con especialista reducido de 3 meses a 2 semanas</li>
<li>Mortalidad materna en áreas piloto reducida en 28%</li>
</ul>`,
      pt: `<p>Dados dos ministérios da saúde mostram:</p>
<ul>
<li>Consultas de telemedicina aumentaram 340% desde 2020</li>
<li>Tempo médio para consulta com especialista reduzido de 3 meses para 2 semanas</li>
<li>Mortalidade materna em áreas piloto reduzida em 28%</li>
</ul>`
    },
    sources: [
      { name: 'PAHO Health Data', url: '#' },
      { name: 'WHO Regional Report', url: '#' }
    ]
  },
  {
    id: 'a5',
    title: {
      en: "Colombia's Education Reform: Digital Classrooms Reach Remote Communities",
      es: "Reforma Educativa de Colombia: Aulas Digitales Llegan a Comunidades Remotas",
      pt: "Reforma Educacional da Colômbia: Salas de Aula Digitais Alcançam Comunidades Remotas"
    },
    slug: 'colombia-education-digital-classrooms',
    excerpt: {
      en: 'Satellite internet and solar-powered devices are connecting rural students to quality education.',
      es: 'Internet satelital y dispositivos solares están conectando estudiantes rurales a educación de calidad.',
      pt: 'Internet via satélite e dispositivos movidos a energia solar estão conectando estudantes rurais à educação de qualidade.'
    },
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
    problem: {
      en: `<p>Colombia's geography—mountains, jungles, and vast rural areas—has historically created severe educational inequality. Rural students score 40% lower on standardized tests than urban peers.</p>
<p>Teacher shortages in remote areas mean many students never complete secondary education.</p>`,
      es: `<p>La geografía de Colombia—montañas, selvas y vastas áreas rurales—ha creado históricamente una severa desigualdad educativa. Los estudiantes rurales obtienen 40% menos en pruebas estandarizadas que sus pares urbanos.</p>
<p>La escasez de profesores en áreas remotas significa que muchos estudiantes nunca completan la educación secundaria.</p>`,
      pt: `<p>A geografia da Colômbia—montanhas, selvas e vastas áreas rurais—criou historicamente uma severa desigualdade educacional. Estudantes rurais obtêm 40% menos em testes padronizados que seus pares urbanos.</p>
<p>A escassez de professores em áreas remotas significa que muitos estudantes nunca completam o ensino médio.</p>`
    },
    solutions: {
      en: `<p><strong>Satellite Connectivity:</strong> 2,500 schools now have reliable internet through a public-private satellite partnership.</p>
<p><strong>Bilingual Digital Content:</strong> Curriculum available in Spanish and six indigenous languages ensures accessibility.</p>
<p><strong>Teacher Training Hubs:</strong> Regional centers provide ongoing professional development without requiring long travel.</p>`,
      es: `<p><strong>Conectividad Satelital:</strong> 2,500 escuelas ahora tienen internet confiable a través de una asociación público-privada de satélite.</p>
<p><strong>Contenido Digital Bilingüe:</strong> El currículo disponible en español y seis idiomas indígenas asegura la accesibilidad.</p>
<p><strong>Centros de Capacitación Docente:</strong> Centros regionales proporcionan desarrollo profesional continuo sin requerir viajes largos.</p>`,
      pt: `<p><strong>Conectividade via Satélite:</strong> 2.500 escolas agora têm internet confiável através de uma parceria público-privada de satélite.</p>
<p><strong>Conteúdo Digital Bilíngue:</strong> Currículo disponível em espanhol e seis idiomas indígenas garante acessibilidade.</p>
<p><strong>Centros de Capacitação de Professores:</strong> Centros regionais fornecem desenvolvimento profissional contínuo sem exigir longas viagens.</p>`
    },
    impact: {
      en: `<p>Early results are encouraging:</p>
<ul>
<li>Secondary school completion rates up 34% in connected communities</li>
<li>65,000 students accessing university prep courses remotely</li>
<li>Indigenous language content engagement exceeds expectations</li>
</ul>`,
      es: `<p>Los resultados iniciales son alentadores:</p>
<ul>
<li>Tasas de finalización de secundaria aumentaron 34% en comunidades conectadas</li>
<li>65,000 estudiantes accediendo a cursos de preparación universitaria de forma remota</li>
<li>El compromiso con contenido en idiomas indígenas supera las expectativas</li>
</ul>`,
      pt: `<p>Os resultados iniciais são encorajadores:</p>
<ul>
<li>Taxas de conclusão do ensino médio aumentaram 34% em comunidades conectadas</li>
<li>65.000 estudantes acessando cursos preparatórios universitários remotamente</li>
<li>O engajamento com conteúdo em idiomas indígenas supera as expectativas</li>
</ul>`
    },
    sources: [
      { name: 'Ministry of Education Data', url: '#' },
      { name: 'UNESCO Education Report', url: '#' }
    ]
  },
  {
    id: 'a6',
    title: {
      en: "Chile's Renewable Energy Transition Ahead of Schedule",
      es: "La Transición de Energía Renovable de Chile Adelantada al Cronograma",
      pt: "Transição de Energia Renovável do Chile Adiantada ao Cronograma"
    },
    slug: 'chile-renewable-energy',
    excerpt: {
      en: 'Chile on track for 100% renewable electricity by 2030.',
      es: 'Chile en camino hacia 100% de electricidad renovable para 2030.',
      pt: 'Chile a caminho de 100% de eletricidade renovável até 2030.'
    },
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
    problem: {
      en: `<p>Chile's Atacama Desert receives among the highest solar radiation on Earth, yet the country historically relied heavily on imported fossil fuels for electricity generation.</p>
<p>Energy costs were among the highest in South America, creating competitiveness challenges for industry.</p>`,
      es: `<p>El Desierto de Atacama de Chile recibe entre la radiación solar más alta de la Tierra, sin embargo el país históricamente dependía fuertemente de combustibles fósiles importados para la generación de electricidad.</p>
<p>Los costos de energía estaban entre los más altos de Sudamérica, creando desafíos de competitividad para la industria.</p>`,
      pt: `<p>O Deserto do Atacama do Chile recebe entre a radiação solar mais alta da Terra, mas o país historicamente dependia fortemente de combustíveis fósseis importados para geração de eletricidade.</p>
<p>Os custos de energia estavam entre os mais altos da América do Sul, criando desafios de competitividade para a indústria.</p>`
    },
    solutions: {
      en: `<p><strong>Solar Mega-Projects:</strong> Large-scale solar installations now cover 40,000 hectares of desert land.</p>
<p><strong>Green Hydrogen:</strong> Excess solar power is used to produce hydrogen for export and industrial use.</p>
<p><strong>Grid Modernization:</strong> Smart grid technology balances variable renewable generation across the national network.</p>`,
      es: `<p><strong>Mega-Proyectos Solares:</strong> Instalaciones solares a gran escala ahora cubren 40,000 hectáreas de tierra desértica.</p>
<p><strong>Hidrógeno Verde:</strong> El exceso de energía solar se usa para producir hidrógeno para exportación y uso industrial.</p>
<p><strong>Modernización de la Red:</strong> La tecnología de red inteligente equilibra la generación renovable variable en toda la red nacional.</p>`,
      pt: `<p><strong>Mega-Projetos Solares:</strong> Instalações solares em grande escala agora cobrem 40.000 hectares de terra desértica.</p>
<p><strong>Hidrogênio Verde:</strong> O excesso de energia solar é usado para produzir hidrogênio para exportação e uso industrial.</p>
<p><strong>Modernização da Rede:</strong> A tecnologia de rede inteligente equilibra a geração renovável variável em toda a rede nacional.</p>`
    },
    impact: {
      en: `<p>Verified energy data shows:</p>
<ul>
<li>Renewable share of electricity now at 72%, up from 45% in 2020</li>
<li>Industrial electricity costs down 35%</li>
<li>Carbon emissions from power sector reduced by 48%</li>
</ul>`,
      es: `<p>Los datos de energía verificados muestran:</p>
<ul>
<li>Participación renovable de electricidad ahora en 72%, aumentando desde 45% en 2020</li>
<li>Costos de electricidad industrial reducidos en 35%</li>
<li>Emisiones de carbono del sector eléctrico reducidas en 48%</li>
</ul>`,
      pt: `<p>Dados de energia verificados mostram:</p>
<ul>
<li>Participação renovável de eletricidade agora em 72%, aumentando de 45% em 2020</li>
<li>Custos de eletricidade industrial reduzidos em 35%</li>
<li>Emissões de carbono do setor elétrico reduzidas em 48%</li>
</ul>`
    },
    sources: [
      { name: 'CNE Energy Statistics', url: '#' },
      { name: 'IEA Country Report', url: '#' }
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
