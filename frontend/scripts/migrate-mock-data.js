#!/usr/bin/env node
/**
 * Migration Script: Mock Data to CMS
 * 
 * This script migrates the mock articles and writers from mock-data.js
 * into the Supabase CMS database.
 * 
 * Run with: node scripts/migrate-mock-data.js
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration from environment
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yrvrpmoidlvrtukvrvnv.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlydnJwbW9pZGx2cnR1a3Zydm52Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjQ5MDQ0MCwiZXhwIjoyMDg4MDY2NDQwfQ.g8nCuqGXJCoGFVZSvQO7G75jqA5c5VRU9arLs73ha1c';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Mock Writers Data
const mockWriters = [
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

// Categories mapping
const categories = [
  { slug: 'environment', name_en: 'Environment', name_es: 'Medio Ambiente', name_pt: 'Meio Ambiente', color: '#22c55e' },
  { slug: 'economy', name_en: 'Economy', name_es: 'Economía', name_pt: 'Economia', color: '#3b82f6' },
  { slug: 'health', name_en: 'Health', name_es: 'Salud', name_pt: 'Saúde', color: '#ef4444' },
  { slug: 'education', name_en: 'Education', name_es: 'Educación', name_pt: 'Educação', color: '#f59e0b' },
  { slug: 'politics', name_en: 'Politics', name_es: 'Política', name_pt: 'Política', color: '#8b5cf6' },
  { slug: 'technology', name_en: 'Technology', name_es: 'Tecnología', name_pt: 'Tecnologia', color: '#06b6d4' },
  { slug: 'human-rights', name_en: 'Human Rights', name_es: 'Derechos Humanos', name_pt: 'Direitos Humanos', color: '#ec4899' }
];

// Mock Articles (simplified for migration)
const mockArticles = [
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
    authorId: 'w1',
    featured: true,
    mainImage: 'https://images.unsplash.com/photo-1568632234180-0e6c08735d01?w=800&h=450&fit=crop',
    readTime: 8,
    publishedAt: '2025-06-10T14:30:00Z',
    problem: {
      en: `Mexico City, home to over 21 million people, faces one of the most severe water crises in the Western Hemisphere. The city sinks up to 50 centimeters per year due to over-extraction of groundwater, while climate change intensifies droughts and reduces the reliability of external water sources.\n\nCurrently, 40% of water is lost through leaky infrastructure, and millions of residents rely on expensive water deliveries from trucks. The most vulnerable communities pay up to 10 times more for water than wealthy neighborhoods with piped access.`,
      es: `Ciudad de México, hogar de más de 21 millones de personas, enfrenta una de las crisis de agua más severas del hemisferio occidental. La ciudad se hunde hasta 50 centímetros por año debido a la sobreextracción de agua subterránea, mientras que el cambio climático intensifica las sequías.\n\nActualmente, el 40% del agua se pierde por infraestructura con fugas, y millones de residentes dependen de costosas entregas de agua en camiones. Las comunidades más vulnerables pagan hasta 10 veces más por el agua.`,
      pt: `A Cidade do México, lar de mais de 21 milhões de pessoas, enfrenta uma das crises hídricas mais severas do hemisfério ocidental. A cidade afunda até 50 centímetros por ano devido à superextração de água subterrânea, enquanto as mudanças climáticas intensificam as secas.\n\nAtualmente, 40% da água é perdida por infraestrutura com vazamentos, e milhões de residentes dependem de entregas caras de água por caminhões. As comunidades mais vulneráveis pagam até 10 vezes mais pela água.`
    },
    solutions: {
      en: `**Decentralized Water Recycling:** The city has implemented 200 community-scale water recycling facilities that treat greywater for non-potable uses, reducing demand on the main supply by 15%.\n\n**Smart Infrastructure:** AI-powered sensors now monitor 60% of the pipe network, detecting leaks in real-time and reducing water loss by 12% in pilot areas.\n\n**Rainwater Harvesting:** A new law requires all new buildings to install rainwater collection systems, with subsidies for retrofitting existing structures.`,
      es: `**Reciclaje de Agua Descentralizado:** La ciudad ha implementado 200 instalaciones de reciclaje de agua a escala comunitaria que tratan aguas grises para usos no potables, reduciendo la demanda del suministro principal en un 15%.\n\n**Infraestructura Inteligente:** Sensores con IA ahora monitorean el 60% de la red de tuberías, detectando fugas en tiempo real y reduciendo la pérdida de agua en un 12%.\n\n**Captación de Agua de Lluvia:** Una nueva ley requiere que todos los edificios nuevos instalen sistemas de recolección de agua de lluvia.`,
      pt: `**Reciclagem de Água Descentralizada:** A cidade implementou 200 instalações de reciclagem de água em escala comunitária que tratam águas cinzas para usos não potáveis, reduzindo a demanda do abastecimento principal em 15%.\n\n**Infraestrutura Inteligente:** Sensores com IA agora monitoram 60% da rede de tubulações, detectando vazamentos em tempo real e reduzindo a perda de água em 12%.\n\n**Captação de Água da Chuva:** Uma nova lei exige que todos os novos edifícios instalem sistemas de coleta de água da chuva.`
    },
    impact: {
      en: `After 18 months, the program has achieved remarkable results:\n\n• Water consumption reduced by 18% in participating districts\n• 3.2 million residents now have improved water access\n• Infrastructure repair costs down 25% through predictive maintenance\n• Model being studied for adoption in São Paulo and Lima`,
      es: `Después de 18 meses, el programa ha logrado resultados notables:\n\n• Consumo de agua reducido en un 18% en los distritos participantes\n• 3.2 millones de residentes ahora tienen mejor acceso al agua\n• Costos de reparación de infraestructura reducidos en un 25%\n• Modelo siendo estudiado para adopción en São Paulo y Lima`,
      pt: `Após 18 meses, o programa alcançou resultados notáveis:\n\n• Consumo de água reduzido em 18% nos distritos participantes\n• 3,2 milhões de residentes agora têm melhor acesso à água\n• Custos de reparo de infraestrutura reduzidos em 25%\n• Modelo sendo estudado para adoção em São Paulo e Lima`
    }
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
    authorId: 'w2',
    featured: false,
    mainImage: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&h=450&fit=crop',
    readTime: 12,
    publishedAt: '2025-06-09T10:00:00Z',
    problem: {
      en: `The Amazon rainforest has lost over 17% of its original cover, with deforestation rates spiking dramatically in recent years. This destruction not only threatens biodiversity but also releases massive amounts of stored carbon.\n\nIndigenous territories, which protect 80% of the world's remaining biodiversity, face increasing pressure from illegal logging, mining, and agricultural expansion.`,
      es: `La selva amazónica ha perdido más del 17% de su cobertura original, con tasas de deforestación aumentando dramáticamente en los últimos años. Esta destrucción no solo amenaza la biodiversidad sino que también libera cantidades masivas de carbono almacenado.\n\nLos territorios indígenas, que protegen el 80% de la biodiversidad restante del mundo, enfrentan una presión creciente de la tala ilegal, la minería y la expansión agrícola.`,
      pt: `A floresta amazônica perdeu mais de 17% de sua cobertura original, com taxas de desmatamento aumentando dramaticamente nos últimos anos. Essa destruição não apenas ameaça a biodiversidade, mas também libera quantidades massivas de carbono armazenado.\n\nOs territórios indígenas, que protegem 80% da biodiversidade remanescente do mundo, enfrentam pressão crescente da extração ilegal de madeira, mineração e expansão agrícola.`
    },
    solutions: {
      en: `**Indigenous Guardians Program:** Over 500 indigenous communities now use satellite technology to monitor and report illegal activities in real-time.\n\n**Sustainable Forest Economy:** Communities have developed markets for sustainably harvested products, generating $45 million in annual revenue.\n\n**Legal Recognition:** New legislation has strengthened territorial rights and increased penalties for invaders.`,
      es: `**Programa de Guardianes Indígenas:** Más de 500 comunidades indígenas ahora usan tecnología satelital para monitorear y reportar actividades ilegales en tiempo real.\n\n**Economía Forestal Sostenible:** Las comunidades han desarrollado mercados para productos cosechados de manera sostenible, generando $45 millones en ingresos anuales.\n\n**Reconocimiento Legal:** Nueva legislación ha fortalecido los derechos territoriales y aumentado las penalidades para invasores.`,
      pt: `**Programa de Guardiões Indígenas:** Mais de 500 comunidades indígenas agora usam tecnologia de satélite para monitorar e relatar atividades ilegais em tempo real.\n\n**Economia Florestal Sustentável:** As comunidades desenvolveram mercados para produtos colhidos de forma sustentável, gerando US$ 45 milhões em receita anual.\n\n**Reconhecimento Legal:** Nova legislação fortaleceu os direitos territoriais e aumentou as penalidades para invasores.`
    },
    impact: {
      en: `The initiative has transformed conservation outcomes:\n\n• Deforestation reduced by 68% in indigenous-managed territories\n• 12,000 hectares reforested using traditional techniques\n• 40% increase in wildlife populations in protected areas`,
      es: `La iniciativa ha transformado los resultados de conservación:\n\n• Deforestación reducida en un 68% en territorios gestionados por indígenas\n• 12,000 hectáreas reforestadas usando técnicas tradicionales\n• 40% de aumento en poblaciones de vida silvestre en áreas protegidas`,
      pt: `A iniciativa transformou os resultados de conservação:\n\n• Desmatamento reduzido em 68% em territórios geridos por indígenas\n• 12.000 hectares reflorestados usando técnicas tradicionais\n• 40% de aumento nas populações de vida selvagem em áreas protegidas`
    }
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
    authorId: 'w3',
    featured: false,
    mainImage: 'https://images.unsplash.com/photo-1641135698530-8d919344c0e5?w=800&h=450&fit=crop',
    readTime: 6,
    publishedAt: '2025-06-08T16:45:00Z',
    problem: {
      en: `Argentina's chronic inflation and currency instability have historically excluded millions from traditional banking. Nearly 50% of the population remains "unbanked," relying entirely on cash.\n\nHigh fees, inaccessible branch locations, and documentation requirements create barriers that disproportionately affect low-income and rural populations.`,
      es: `La inflación crónica y la inestabilidad monetaria de Argentina han excluido históricamente a millones de la banca tradicional. Casi el 50% de la población permanece "no bancarizada", dependiendo enteramente del efectivo.\n\nAltas comisiones, ubicaciones de sucursales inaccesibles y requisitos de documentación crean barreras que afectan desproporcionadamente a las poblaciones de bajos ingresos y rurales.`,
      pt: `A inflação crônica e a instabilidade monetária da Argentina historicamente excluíram milhões do sistema bancário tradicional. Quase 50% da população permanece "desbancarizada", dependendo inteiramente de dinheiro.\n\nTaxas altas, localizações de agências inacessíveis e requisitos de documentação criam barreiras que afetam desproporcionalmente populações de baixa renda e rurais.`
    },
    solutions: {
      en: `**Mobile-First Banking:** New fintech platforms allow account opening with just a phone number and national ID, no credit history required.\n\n**QR Payment Networks:** Small businesses can now accept digital payments with zero fees, creating a parallel financial ecosystem.\n\n**Crypto Integration:** Stablecoin savings products protect against peso devaluation while maintaining liquidity.`,
      es: `**Banca Mobile-First:** Nuevas plataformas fintech permiten abrir cuentas solo con un número de teléfono e identificación nacional, sin historial crediticio requerido.\n\n**Redes de Pago QR:** Las pequeñas empresas ahora pueden aceptar pagos digitales sin comisiones, creando un ecosistema financiero paralelo.\n\n**Integración Cripto:** Los productos de ahorro en stablecoins protegen contra la devaluación del peso mientras mantienen la liquidez.`,
      pt: `**Banco Mobile-First:** Novas plataformas fintech permitem abertura de conta apenas com número de telefone e identidade nacional, sem histórico de crédito necessário.\n\n**Redes de Pagamento QR:** Pequenas empresas agora podem aceitar pagamentos digitais sem taxas, criando um ecossistema financeiro paralelo.\n\n**Integração Cripto:** Produtos de poupança em stablecoins protegem contra a desvalorização do peso mantendo a liquidez.`
    },
    impact: {
      en: `The transformation is measurable:\n\n• 8 million new digital bank accounts opened in 2024\n• Small business revenues up 23% with digital payment acceptance\n• Remittance costs reduced by 60% through blockchain rails`,
      es: `La transformación es medible:\n\n• 8 millones de nuevas cuentas bancarias digitales abiertas en 2024\n• Ingresos de pequeñas empresas aumentaron 23% con aceptación de pagos digitales\n• Costos de remesas reducidos en 60% a través de blockchain`,
      pt: `A transformação é mensurável:\n\n• 8 milhões de novas contas bancárias digitais abertas em 2024\n• Receitas de pequenas empresas aumentaram 23% com aceitação de pagamentos digitais\n• Custos de remessas reduzidos em 60% através de blockchain`
    }
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
    authorId: 'w4',
    featured: false,
    mainImage: 'https://images.unsplash.com/photo-1623039405147-547794f92e9e?w=800&h=450&fit=crop',
    readTime: 5,
    publishedAt: '2025-06-07T09:00:00Z',
    problem: {
      en: `Rural healthcare access remains a critical challenge across Latin America. An estimated 150 million people live more than two hours from the nearest hospital.\n\nDoctor shortages in non-urban areas create a two-tier health system where quality of care depends heavily on geography.`,
      es: `El acceso a la salud rural sigue siendo un desafío crítico en América Latina. Se estima que 150 millones de personas viven a más de dos horas del hospital más cercano.\n\nLa escasez de médicos en áreas no urbanas crea un sistema de salud de dos niveles donde la calidad de la atención depende en gran medida de la geografía.`,
      pt: `O acesso à saúde rural continua sendo um desafio crítico na América Latina. Estima-se que 150 milhões de pessoas vivem a mais de duas horas do hospital mais próximo.\n\nA escassez de médicos em áreas não urbanas cria um sistema de saúde de dois níveis onde a qualidade do atendimento depende muito da geografia.`
    },
    solutions: {
      en: `**Telemedicine Networks:** National telemedicine programs now connect rural clinics with urban specialists via video consultation.\n\n**AI Diagnostic Support:** Machine learning tools help community health workers identify conditions that require specialist referral.\n\n**Mobile Health Units:** Equipped vehicles bring preventive care and basic treatments to remote communities on regular schedules.`,
      es: `**Redes de Telemedicina:** Los programas nacionales de telemedicina ahora conectan clínicas rurales con especialistas urbanos a través de videoconsulta.\n\n**Soporte de Diagnóstico IA:** Las herramientas de aprendizaje automático ayudan a los trabajadores de salud comunitarios a identificar condiciones que requieren derivación a especialistas.\n\n**Unidades Móviles de Salud:** Vehículos equipados llevan atención preventiva y tratamientos básicos a comunidades remotas en horarios regulares.`,
      pt: `**Redes de Telemedicina:** Programas nacionais de telemedicina agora conectam clínicas rurais com especialistas urbanos via videoconsulta.\n\n**Suporte de Diagnóstico IA:** Ferramentas de aprendizado de máquina ajudam trabalhadores de saúde comunitários a identificar condições que requerem encaminhamento a especialistas.\n\n**Unidades Móveis de Saúde:** Veículos equipados levam cuidados preventivos e tratamentos básicos a comunidades remotas em horários regulares.`
    },
    impact: {
      en: `Data from health ministries shows:\n\n• Telemedicine consultations up 340% since 2020\n• Average time to specialist consultation reduced from 3 months to 2 weeks\n• Maternal mortality in pilot areas down 28%`,
      es: `Datos de los ministerios de salud muestran:\n\n• Consultas de telemedicina aumentaron 340% desde 2020\n• Tiempo promedio para consulta con especialista reducido de 3 meses a 2 semanas\n• Mortalidad materna en áreas piloto reducida en 28%`,
      pt: `Dados dos ministérios da saúde mostram:\n\n• Consultas de telemedicina aumentaram 340% desde 2020\n• Tempo médio para consulta com especialista reduzido de 3 meses para 2 semanas\n• Mortalidade materna em áreas piloto reduzida em 28%`
    }
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
    authorId: 'w4',
    featured: false,
    mainImage: 'https://images.unsplash.com/photo-1488942446680-85dd7de440ef?w=800&h=450&fit=crop',
    readTime: 7,
    publishedAt: '2025-06-06T11:30:00Z',
    problem: {
      en: `Colombia's geography—mountains, jungles, and vast rural areas—has historically created severe educational inequality. Rural students score 40% lower on standardized tests than urban peers.\n\nTeacher shortages in remote areas mean many students never complete secondary education.`,
      es: `La geografía de Colombia—montañas, selvas y vastas áreas rurales—ha creado históricamente una severa desigualdad educativa. Los estudiantes rurales obtienen 40% menos en pruebas estandarizadas que sus pares urbanos.\n\nLa escasez de profesores en áreas remotas significa que muchos estudiantes nunca completan la educación secundaria.`,
      pt: `A geografia da Colômbia—montanhas, selvas e vastas áreas rurais—criou historicamente uma severa desigualdade educacional. Estudantes rurais obtêm 40% menos em testes padronizados que seus pares urbanos.\n\nA escassez de professores em áreas remotas significa que muitos estudantes nunca completam o ensino médio.`
    },
    solutions: {
      en: `**Satellite Connectivity:** 2,500 schools now have reliable internet through a public-private satellite partnership.\n\n**Bilingual Digital Content:** Curriculum available in Spanish and six indigenous languages ensures accessibility.\n\n**Teacher Training Hubs:** Regional centers provide ongoing professional development without requiring long travel.`,
      es: `**Conectividad Satelital:** 2,500 escuelas ahora tienen internet confiable a través de una asociación público-privada de satélite.\n\n**Contenido Digital Bilingüe:** El currículo disponible en español y seis idiomas indígenas asegura la accesibilidad.\n\n**Centros de Capacitación Docente:** Centros regionales proporcionan desarrollo profesional continuo sin requerir viajes largos.`,
      pt: `**Conectividade via Satélite:** 2.500 escolas agora têm internet confiável através de uma parceria público-privada de satélite.\n\n**Conteúdo Digital Bilíngue:** Currículo disponível em espanhol e seis idiomas indígenas garante acessibilidade.\n\n**Centros de Capacitação de Professores:** Centros regionais fornecem desenvolvimento profissional contínuo sem exigir longas viagens.`
    },
    impact: {
      en: `Early results are encouraging:\n\n• Secondary school completion rates up 34% in connected communities\n• 65,000 students accessing university prep courses remotely\n• Indigenous language content engagement exceeds expectations`,
      es: `Los resultados iniciales son alentadores:\n\n• Tasas de finalización de secundaria aumentaron 34% en comunidades conectadas\n• 65,000 estudiantes accediendo a cursos de preparación universitaria de forma remota\n• El compromiso con contenido en idiomas indígenas supera las expectativas`,
      pt: `Os resultados iniciais são encorajadores:\n\n• Taxas de conclusão do ensino médio aumentaram 34% em comunidades conectadas\n• 65.000 estudantes acessando cursos preparatórios universitários remotamente\n• O engajamento com conteúdo em idiomas indígenas supera as expectativas`
    }
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
    authorId: 'w5',
    featured: false,
    mainImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=450&fit=crop',
    readTime: 4,
    publishedAt: '2025-06-05T14:00:00Z',
    problem: {
      en: `Chile's Atacama Desert receives among the highest solar radiation on Earth, yet the country historically relied heavily on imported fossil fuels for electricity generation.\n\nEnergy costs were among the highest in South America, creating competitiveness challenges for industry.`,
      es: `El Desierto de Atacama de Chile recibe entre la radiación solar más alta de la Tierra, sin embargo el país históricamente dependía fuertemente de combustibles fósiles importados para la generación de electricidad.\n\nLos costos de energía estaban entre los más altos de Sudamérica, creando desafíos de competitividad para la industria.`,
      pt: `O Deserto do Atacama do Chile recebe entre a radiação solar mais alta da Terra, mas o país historicamente dependia fortemente de combustíveis fósseis importados para geração de eletricidade.\n\nOs custos de energia estavam entre os mais altos da América do Sul, criando desafios de competitividade para a indústria.`
    },
    solutions: {
      en: `**Solar Mega-Projects:** Large-scale solar installations now cover 40,000 hectares of desert land.\n\n**Green Hydrogen:** Excess solar power is used to produce hydrogen for export and industrial use.\n\n**Grid Modernization:** Smart grid technology balances variable renewable generation across the national network.`,
      es: `**Mega-Proyectos Solares:** Instalaciones solares a gran escala ahora cubren 40,000 hectáreas de tierra desértica.\n\n**Hidrógeno Verde:** El exceso de energía solar se usa para producir hidrógeno para exportación y uso industrial.\n\n**Modernización de la Red:** La tecnología de red inteligente equilibra la generación renovable variable en toda la red nacional.`,
      pt: `**Mega-Projetos Solares:** Instalações solares em grande escala agora cobrem 40.000 hectares de terra desértica.\n\n**Hidrogênio Verde:** O excesso de energia solar é usado para produzir hidrogênio para exportação e uso industrial.\n\n**Modernização da Rede:** A tecnologia de rede inteligente equilibra a geração renovável variável em toda a rede nacional.`
    },
    impact: {
      en: `Verified energy data shows:\n\n• Renewable share of electricity now at 72%, up from 45% in 2020\n• Industrial electricity costs down 35%\n• Carbon emissions from power sector reduced by 48%`,
      es: `Los datos de energía verificados muestran:\n\n• Participación renovable de electricidad ahora en 72%, aumentando desde 45% en 2020\n• Costos de electricidad industrial reducidos en 35%\n• Emisiones de carbono del sector eléctrico reducidas en 48%`,
      pt: `Dados de energia verificados mostram:\n\n• Participação renovável de eletricidade agora em 72%, aumentando de 45% em 2020\n• Custos de eletricidade industrial reduzidos em 35%\n• Emissões de carbono do setor elétrico reduzidas em 48%`
    }
  }
];

// Helper function to generate slug
function generateSlug(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function migrateCategories() {
  console.log('\n📁 Migrating categories...');
  const categoryMap = {};
  
  for (const cat of categories) {
    // Check if category exists
    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', cat.slug)
      .single();
    
    if (existing) {
      console.log(`  ✓ Category "${cat.name_en}" already exists`);
      categoryMap[cat.slug] = existing.id;
    } else {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          slug: cat.slug,
          name_en: cat.name_en,
          name_es: cat.name_es,
          name_pt: cat.name_pt,
          color: cat.color,
          is_active: true,
          sort_order: categories.indexOf(cat)
        })
        .select()
        .single();
      
      if (error) {
        console.log(`  ✗ Error creating category "${cat.name_en}":`, error.message);
      } else {
        console.log(`  ✓ Created category "${cat.name_en}"`);
        categoryMap[cat.slug] = data.id;
      }
    }
  }
  
  return categoryMap;
}

async function migrateAuthors() {
  console.log('\n👥 Migrating authors...');
  const authorMap = {};
  
  for (const writer of mockWriters) {
    const slug = generateSlug(writer.name);
    
    // Check if author exists
    const { data: existing } = await supabase
      .from('authors')
      .select('id')
      .eq('slug', slug)
      .single();
    
    if (existing) {
      console.log(`  ✓ Author "${writer.name}" already exists`);
      authorMap[writer.id] = existing.id;
    } else {
      const { data, error } = await supabase
        .from('authors')
        .insert({
          name: writer.name,
          slug: slug,
          email: writer.email,
          avatar_url: writer.avatar,
          title: writer.specialty.en,
          bio_en: writer.bio.en,
          bio_es: writer.bio.es,
          bio_pt: writer.bio.pt,
          expertise_en: writer.specialty.en,
          expertise_es: writer.specialty.es,
          expertise_pt: writer.specialty.pt,
          region: writer.region.toLowerCase(),
          is_verified: writer.verified,
          article_count: writer.articleCount,
          trust_score: 85 + Math.floor(Math.random() * 10)
        })
        .select()
        .single();
      
      if (error) {
        console.log(`  ✗ Error creating author "${writer.name}":`, error.message);
      } else {
        console.log(`  ✓ Created author "${writer.name}"`);
        authorMap[writer.id] = data.id;
      }
    }
  }
  
  return authorMap;
}

async function migrateArticles(categoryMap, authorMap) {
  console.log('\n📰 Migrating articles...');
  
  for (const article of mockArticles) {
    // Check if article exists
    const { data: existing } = await supabase
      .from('cms_articles')
      .select('id')
      .eq('slug', article.slug)
      .single();
    
    if (existing) {
      console.log(`  ✓ Article "${article.title.en.substring(0, 50)}..." already exists`);
      continue;
    }
    
    const categoryId = categoryMap[article.category] || null;
    const authorId = authorMap[article.authorId] || null;
    
    // Create article
    const { data: newArticle, error: articleError } = await supabase
      .from('cms_articles')
      .insert({
        title_en: article.title.en,
        title_es: article.title.es,
        title_pt: article.title.pt,
        slug: article.slug,
        standfirst_en: article.excerpt.en,
        standfirst_es: article.excerpt.es,
        standfirst_pt: article.excerpt.pt,
        featured_image: article.mainImage,
        category_id: categoryId,
        author_id: authorId,
        region: article.region,
        status: 'published',
        is_featured: article.featured,
        read_time: article.readTime,
        published_at: article.publishedAt
      })
      .select()
      .single();
    
    if (articleError) {
      console.log(`  ✗ Error creating article "${article.title.en.substring(0, 50)}...":`, articleError.message);
      continue;
    }
    
    console.log(`  ✓ Created article "${article.title.en.substring(0, 50)}..."`);
    
    // Create content blocks
    const blocks = [
      // Problem section
      {
        article_id: newArticle.id,
        block_type: 'heading',
        content_en: { text: 'The Problem', level: 2 },
        content_es: { text: 'El Problema', level: 2 },
        content_pt: { text: 'O Problema', level: 2 },
        sort_order: 0
      },
      {
        article_id: newArticle.id,
        block_type: 'text',
        content_en: { text: article.problem.en },
        content_es: { text: article.problem.es },
        content_pt: { text: article.problem.pt },
        sort_order: 1
      },
      // Solutions section
      {
        article_id: newArticle.id,
        block_type: 'heading',
        content_en: { text: 'Solutions', level: 2 },
        content_es: { text: 'Soluciones', level: 2 },
        content_pt: { text: 'Soluções', level: 2 },
        sort_order: 2
      },
      {
        article_id: newArticle.id,
        block_type: 'text',
        content_en: { text: article.solutions.en },
        content_es: { text: article.solutions.es },
        content_pt: { text: article.solutions.pt },
        sort_order: 3
      },
      // Impact section
      {
        article_id: newArticle.id,
        block_type: 'heading',
        content_en: { text: 'Impact', level: 2 },
        content_es: { text: 'Impacto', level: 2 },
        content_pt: { text: 'Impacto', level: 2 },
        sort_order: 4
      },
      {
        article_id: newArticle.id,
        block_type: 'text',
        content_en: { text: article.impact.en },
        content_es: { text: article.impact.es },
        content_pt: { text: article.impact.pt },
        sort_order: 5
      }
    ];
    
    const { error: blocksError } = await supabase
      .from('content_blocks')
      .insert(blocks);
    
    if (blocksError) {
      console.log(`    ✗ Error creating content blocks:`, blocksError.message);
    } else {
      console.log(`    ✓ Created ${blocks.length} content blocks`);
    }
  }
}

async function main() {
  console.log('🚀 Starting LATAM Reportero Data Migration');
  console.log('=========================================\n');
  
  try {
    // Step 1: Migrate categories
    const categoryMap = await migrateCategories();
    
    // Step 2: Migrate authors
    const authorMap = await migrateAuthors();
    
    // Step 3: Migrate articles with content blocks
    await migrateArticles(categoryMap, authorMap);
    
    console.log('\n=========================================');
    console.log('✅ Migration completed successfully!');
    console.log('\nThe homepage will now display CMS content instead of mock data.');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

main();
