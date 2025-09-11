const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // 1. Criar usuários de exemplo
  console.log('👥 Criando usuários...')

  const hashedPassword = await bcrypt.hash('123456', 10)

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@gymstarter.com.br' },
    update: {},
    create: {
      email: 'admin@gymstarter.com.br',
      name: 'Administrador',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  const studentUser1 = await prisma.user.upsert({
    where: { email: 'joao.silva@email.com' },
    update: {},
    create: {
      email: 'joao.silva@email.com',
      name: 'João Silva',
      password: hashedPassword,
      role: 'USER',
    },
  })

  const studentUser2 = await prisma.user.upsert({
    where: { email: 'maria.santos@email.com' },
    update: {},
    create: {
      email: 'maria.santos@email.com',
      name: 'Maria Santos',
      password: hashedPassword,
      role: 'USER',
    },
  })

  const studentUser3 = await prisma.user.upsert({
    where: { email: 'pedro.costa@email.com' },
    update: {},
    create: {
      email: 'pedro.costa@email.com',
      name: 'Pedro Costa',
      password: hashedPassword,
      role: 'USER',
    },
  })

  // 2. Criar configurações da academia
  console.log('⚙️ Criando configurações da academia...')

  const settings = await prisma.academySettings.upsert({
    where: { id: 'main-settings' },
    update: {},
    create: {
      id: 'main-settings',
      name: 'Gym Starter',
      description: 'Academia completa especializada em musculação, crossfit, pilates e aulas funcionais. Com equipamentos de última geração, profissionais qualificados e ambiente motivador para alcançar seus objetivos fitness. Localizada no coração de Fortaleza, oferecemos horários estendidos e atendimento personalizado.',
      phone: '(85) 99999-9999',
      email: 'contato@gymstarter.com.br',
      address: 'Av. Santos Dumont, 1515 - Aldeota, Fortaleza - CE, 60150-161',
      whatsapp: '5585999999999',
      hours: {
        weekdays: { open: '05:30', close: '23:00' },
        saturday: { open: '07:00', close: '20:00' },
        sunday: { open: '08:00', close: '18:00' }
      },
      colors: {
        primary: '#DC2626',
        secondary: '#000000',
        accent: '#DC2626'
      },
      notifications: {
        newMessages: true,
        newMembers: true,
        payments: true,
        weeklyReports: true
      },
      about: 'Fundada em 2020, a BlackRed Fit nasceu com a missão de transformar vidas através do fitness. Somos uma academia completa que oferece musculação, crossfit, pilates e aulas funcionais. Nossa equipe de profissionais altamente qualificados está preparada para acompanhar você em toda sua jornada fitness, desde o primeiro treino até a conquista dos seus objetivos mais ambiciosos.\n\nCom mais de 850 alunos ativos e 15 personal trainers especializados, oferecemos um ambiente moderno e climatizado, equipamentos premium das melhores marcas do mercado e horários flexíveis que se adaptam à sua rotina. Venha fazer parte da nossa família e descubra o que é treinar com excelência!',
      heroTitle: 'TRANSFORME SUA VIDA ATRAVÉS DO FITNESS',
      heroSubtitle: 'Academia Completa em Fortaleza',
      features: {
        title: 'Por que escolher a BlackRed Fit?',
        description: 'Somos referência em fitness em Fortaleza, oferecendo uma experiência completa e diferenciada',
        items: [
          {
            title: 'Equipamentos Premium',
            description: 'Mais de 200 equipamentos das melhores marcas do mercado fitness',
            icon: 'Dumbbell'
          },
          {
            title: 'Profissionais Qualificados',
            description: 'Equipe de 15 personal trainers certificados e especializados',
            icon: 'Users'
          },
          {
            title: 'Horário Estendido',
            description: 'Funcionamento das 5:30h às 23:00h de segunda a sexta-feira',
            icon: 'Clock'
          },
          {
            title: 'Modalidades Completas',
            description: 'Musculação, CrossFit, Pilates, Funcional, Spinning e muito mais',
            icon: 'Trophy'
          }
        ]
      },
      metrics: {
        activeMembers: 850,
        personalTrainers: 15,
        operatingHours: '18h/dia',
        foundedYear: 2020
      },
      assistantEnabled: true,
      assistantDelay: 5000,
      assistantWelcomeMessage: 'Olá! Sou o assistente virtual da Gym Starter. Como posso ajudar você hoje?',
      allowScheduling: 'onIntent',
      schedulingMode: 'conservative',
      fallbackResponse: 'Se precisar de ajuda com agendamento, posso te orientar ou direcionar para nosso WhatsApp! 😉'
    },
  })

  // 3. Criar planos
  console.log('💳 Criando planos...')

  const plan1 = await prisma.plan.upsert({
    where: { id: 'plan-basic' },
    update: {},
    create: {
      id: 'plan-basic',
      name: 'Plano Basic',
      price: 89.90,
      description: 'Ideal para quem está começando sua jornada fitness',
      features: [
        'Acesso completo à musculação',
        'Aulas de funcional 2x/semana',
        'Avaliação física inicial',
        'Suporte de personal trainer',
        'Horário livre',
        'App de acompanhamento'
      ],
      activeMembers: 245,
      monthlyRevenue: 21960.50,
      status: 'ACTIVE',
      popular: false,
    },
  })

  const plan2 = await prisma.plan.upsert({
    where: { id: 'plan-premium' },
    update: {},
    create: {
      id: 'plan-premium',
      name: 'Plano Premium',
      price: 149.90,
      description: 'Para quem busca resultados mais rápidos e acompanhamento completo',
      features: [
        'Tudo do Plano Basic',
        'Aulas de crossfit ilimitadas',
        'Pilates 3x/semana',
        'Spinning 2x/semana',
        '1 sessão personal trainer/mês',
        'Suplementos com desconto',
        'Massagem relaxante mensal',
        'Prioridade em agendamentos'
      ],
      activeMembers: 387,
      monthlyRevenue: 58006.30,
      status: 'ACTIVE',
      popular: true,
    },
  })

  const plan3 = await prisma.plan.upsert({
    where: { id: 'plan-vip' },
    update: {},
    create: {
      id: 'plan-vip',
      name: 'Plano VIP',
      price: 249.90,
      description: 'Experiência premium com atendimento exclusivo',
      features: [
        'Tudo do Plano Premium',
        'Personal trainer dedicado',
        'Aulas particulares ilimitadas',
        'Nutricionista incluso',
        'Produtos premium com desconto',
        'Massagem semanal',
        'Acesso VIP aos eventos',
        'Consultoria fitness personalizada',
        'Suplementação premium'
      ],
      activeMembers: 98,
      monthlyRevenue: 24490.20,
      status: 'ACTIVE',
      popular: false,
    },
  })

  // 4. Criar códigos de check-in
  console.log('📱 Criando códigos de check-in...')

  const checkinCode1 = await prisma.checkinCode.upsert({
    where: { code: 'BRF001' },
    update: {},
    create: {
      code: 'BRF001',
      validDate: new Date('2025-12-31'),
    },
  })

  const checkinCode2 = await prisma.checkinCode.upsert({
    where: { code: 'BRF002' },
    update: {},
    create: {
      code: 'BRF002',
      validDate: new Date('2025-12-31'),
    },
  })

  // 5. Criar check-ins de exemplo
  console.log('✅ Criando check-ins...')

  await prisma.checkIn.createMany({
    data: [
      {
        name: 'João Silva',
        phone: '(85) 99999-9999',
        checkInTime: new Date('2025-01-08T07:30:00'),
        status: 'ACTIVE',
        codeId: checkinCode1.id,
      },
      {
        name: 'Maria Santos',
        phone: '(85) 98888-8888',
        checkInTime: new Date('2025-01-08T08:15:00'),
        status: 'ACTIVE',
        codeId: checkinCode1.id,
      },
      {
        name: 'Pedro Costa',
        phone: '(85) 97777-7777',
        checkInTime: new Date('2025-01-08T19:45:00'),
        status: 'ACTIVE',
        codeId: checkinCode2.id,
      },
      {
        name: 'Ana Oliveira',
        phone: '(85) 96666-6666',
        checkInTime: new Date('2025-01-07T06:30:00'),
        status: 'COMPLETED',
        codeId: checkinCode1.id,
      },
      {
        name: 'Carlos Mendes',
        phone: '(85) 95555-5555',
        checkInTime: new Date('2025-01-07T18:20:00'),
        status: 'COMPLETED',
        codeId: checkinCode2.id,
      },
    ],
    skipDuplicates: true,
  })

  // 6. Criar agendamentos
  console.log('📅 Criando agendamentos...')

  await prisma.appointment.createMany({
    data: [
      {
        name: 'João Silva',
        phone: '(85) 99999-9999',
        email: 'joao.silva@email.com',
        classType: 'Musculação',
        scheduledDate: new Date('2025-01-10T07:00:00'),
        scheduledTime: '07:00',
        status: 'CONFIRMED',
        notes: 'Foco em hipertrofia - treino de peito e tríceps',
      },
      {
        name: 'Maria Santos',
        phone: '(85) 98888-8888',
        email: 'maria.santos@email.com',
        classType: 'CrossFit',
        scheduledDate: new Date('2025-01-10T08:00:00'),
        scheduledTime: '08:00',
        status: 'PENDING',
        notes: 'Aula de crossfit intermediário',
      },
      {
        name: 'Pedro Costa',
        phone: '(85) 97777-7777',
        email: 'pedro.costa@email.com',
        classType: 'Pilates',
        scheduledDate: new Date('2025-01-11T09:30:00'),
        scheduledTime: '09:30',
        status: 'CONFIRMED',
        notes: 'Aula de pilates para iniciantes',
      },
      {
        name: 'Ana Oliveira',
        phone: '(85) 96666-6666',
        email: 'ana.oliveira@email.com',
        classType: 'Avaliação Física',
        scheduledDate: new Date('2025-01-12T14:00:00'),
        scheduledTime: '14:00',
        status: 'PENDING',
        notes: 'Avaliação física completa com nutricionista',
      },
    ],
    skipDuplicates: true,
  })

  // 7. Criar mensagens de contato
  console.log('💬 Criando mensagens de contato...')

  await prisma.message.createMany({
    data: [
      {
        name: 'Carlos Rodrigues',
        email: 'carlos.rodrigues@email.com',
        phone: '(85) 94444-4444',
        subject: 'Informações sobre planos',
        message: 'Olá, gostaria de saber mais sobre os planos disponíveis e os horários de funcionamento. Também quero saber se vocês oferecem aulas experimentais.',
        status: 'UNREAD',
        priority: 'MEDIUM',
      },
      {
        name: 'Fernanda Lima',
        email: 'fernanda.lima@email.com',
        phone: '(85) 93333-3333',
        subject: 'Personal Trainer',
        message: 'Estou interessada em contratar um personal trainer. Gostaria de saber os valores e disponibilidade de horários.',
        status: 'READ',
        priority: 'HIGH',
        response: 'Olá Fernanda! Temos excelentes profissionais disponíveis. Podemos agendar uma avaliação inicial gratuita para entender melhor seus objetivos. Entre em contato pelo WhatsApp (85) 99999-9999 para agendarmos.',
        respondedAt: new Date('2025-01-08T10:30:00'),
      },
      {
        name: 'Roberto Santos',
        email: 'roberto.santos@email.com',
        phone: '(85) 92222-2222',
        subject: 'Dúvida sobre musculação',
        message: 'Olá, sou iniciante na musculação e gostaria de saber se vocês oferecem acompanhamento para iniciantes.',
        status: 'READ',
        priority: 'MEDIUM',
        response: 'Olá Roberto! Claro que oferecemos! Temos programas específicos para iniciantes com acompanhamento de personal trainer. Recomendamos começar com o Plano Basic que inclui avaliação física e suporte personalizado.',
        respondedAt: new Date('2025-01-07T15:45:00'),
      },
    ],
    skipDuplicates: true,
  })

  // 8. Criar indicações
  console.log('🤝 Criando indicações...')

  await prisma.referral.createMany({
    data: [
      {
        referrerName: 'João Silva',
        referrerPhone: '(85) 99999-9999',
        referredName: 'Lucas Pereira',
        referredPhone: '(85) 91111-1111',
        referredEmail: 'lucas.pereira@email.com',
        status: 'PENDING',
        notes: 'Amigo de faculdade, interessado em musculação',
      },
      {
        referrerName: 'Maria Santos',
        referrerPhone: '(85) 98888-8888',
        referredName: 'Juliana Costa',
        referredPhone: '(85) 90000-0000',
        referredEmail: 'juliana.costa@email.com',
        status: 'CONTACTED',
        notes: 'Colega de trabalho, vai experimentar crossfit',
      },
      {
        referrerName: 'Pedro Costa',
        referrerPhone: '(85) 97777-7777',
        referredName: 'Marcos Oliveira',
        referredPhone: '(85) 98888-7777',
        status: 'CONVERTED',
        notes: 'Irmão, já matriculado no plano premium',
      },
    ],
    skipDuplicates: true,
  })

  // 9. Criar promoções
  console.log('🎁 Criando promoções...')

  await prisma.promotion.createMany({
    data: [
      {
        title: 'Mês de Janeiro com Desconto',
        description: 'Aproveite 30% de desconto na matrícula + primeira mensalidade grátis! Promoção válida apenas para janeiro. Venha transformar seu corpo com a BlackRed Fit.',
        image: '/placeholder.jpg',
        validUntil: new Date('2025-01-31'),
        isActive: true,
        uniqueCode: 'PROMO-2025-JAN',
      },
      {
        title: 'Plano Família',
        description: 'Traga sua família e economize! 20% de desconto para o segundo familiar e 30% para o terceiro. Ideal para manter todos da família ativos e saudáveis.',
        image: '/placeholder.jpg',
        validUntil: new Date('2025-03-31'),
        isActive: true,
        uniqueCode: 'PROMO-2025-FAM',
      },
      {
        title: 'Black Friday Fitness',
        description: 'Oferta imperdível! Plano anual com 50% de desconto + 3 meses de personal trainer grátis. Transforme 2025 no seu ano fitness!',
        image: '/placeholder.jpg',
        validUntil: new Date('2025-11-30'),
        isActive: true,
        uniqueCode: 'PROMO-2025-BF',
      },
      {
        title: 'Dia dos Namorados Fitness',
        description: 'Surpreenda seu amor com saúde! Pacote casal com 25% de desconto + avaliação física completa para os dois.',
        image: '/placeholder.jpg',
        validUntil: new Date('2025-06-12'),
        isActive: true,
        uniqueCode: 'PROMO-2025-LOVE',
      },
      {
        title: 'Verão em Forma',
        description: 'Prepare-se para o verão com 40% de desconto em planos trimestrais + consultoria nutricional incluída. Chegue pronto para a praia!',
        image: '/placeholder.jpg',
        validUntil: new Date('2025-12-20'),
        isActive: true,
        uniqueCode: 'PROMO-2025-SUMMER',
      },
      {
        title: 'Estudante BlackRed',
        description: 'Desconto especial para estudantes! Apresente carteirinha e ganhe 25% de desconto no plano semestral. Educação e saúde andam juntas.',
        image: '/placeholder.jpg',
        validUntil: new Date('2025-12-31'),
        isActive: true,
        uniqueCode: 'PROMO-2025-STUDENT',
      },
      {
        title: 'Carnaval Fitness',
        description: 'Prepare seu corpo para o Carnaval! 35% de desconto em planos mensais + aulas de dança gratuitas. Entre em forma para curtir a folia!',
        image: '/placeholder.jpg',
        validUntil: new Date('2025-02-15'),
        isActive: true,
        uniqueCode: 'PROMO-2025-CARNIVAL',
      },
      {
        title: 'Dia das Mães Fitness',
        description: 'Presenteie sua mãe com saúde! Pacote mãe-filha com 30% de desconto + sessão de massagem relaxante incluída.',
        image: '/placeholder.jpg',
        validUntil: new Date('2025-05-11'),
        isActive: true,
        uniqueCode: 'PROMO-2025-MOTHERS',
      },
      {
        title: 'Páscoa Saudável',
        description: 'Chocolate fitness saudável grátis! Compre qualquer plano e ganhe barras de proteína artesanais. Cuide da saúde sem abrir mão do prazer.',
        image: '/placeholder.jpg',
        validUntil: new Date('2025-04-20'),
        isActive: true,
        uniqueCode: 'PROMO-2025-EASTER',
      },
      {
        title: 'Tire suas Férias em Forma',
        description: 'Prepare-se para as férias! Plano trimestral com 25% de desconto + acompanhamento nutricional para manter a forma durante as viagens.',
        image: '/placeholder.jpg',
        validUntil: new Date('2025-12-31'),
        isActive: true,
        uniqueCode: 'PROMO-2025-VACATION',
      },
      {
        title: 'Indique e Ganhe',
        description: 'Indique um amigo e ganhe 1 mês grátis! Para cada indicação que se matricular, você ganha um mês de academia sem custo adicional.',
        image: '/placeholder.jpg',
        validUntil: new Date('2025-12-31'),
        isActive: true,
        uniqueCode: 'PROMO-2025-REFER',
      },
      {
        title: 'Aniversário BlackRed',
        description: 'Celebre conosco! 4 anos de BlackRed Fit com 40% de desconto na matrícula + brinde exclusivo para os primeiros 50 inscritos.',
        image: '/placeholder.jpg',
        validUntil: new Date('2025-03-15'),
        isActive: true,
        uniqueCode: 'PROMO-2025-BDAY',
      },
    ],
    skipDuplicates: true,
  })

  // 10. Criar parceiros
  console.log('🤝 Criando parceiros...')

  await prisma.partner.createMany({
    data: [
      {
        name: 'NutriVida',
        description: 'Consultoria nutricional especializada em atletas e pessoas ativas. Acompanhamento personalizado com foco em performance e saúde.',
        logo: '/placeholder.svg',
        link: 'https://nutrivida.com.br',
        category: 'Nutricionista',
        isActive: true,
        featured: true,
        priority: 10,
        displayOrder: 1,
      },
      {
        name: 'FisioSport',
        description: 'Fisioterapia esportiva especializada em lesões musculares, articulares e recuperação pós-treino. Atendimento de excelência.',
        logo: '/placeholder.svg',
        link: 'https://fisiosport.com.br',
        category: 'Fisioterapeuta',
        isActive: true,
        featured: true,
        priority: 9,
        displayOrder: 2,
      },
      {
        name: 'Personal Pro',
        description: 'Equipe de personal trainers certificados com mais de 10 anos de experiência. Treinos personalizados para todos os níveis.',
        logo: '/placeholder.svg',
        link: 'https://personalpro.com.br',
        category: 'Personal Trainer',
        isActive: true,
        featured: true,
        priority: 8,
        displayOrder: 3,
      },
      {
        name: 'Massagem & Relax',
        description: 'Massagens terapêuticas e relaxantes. Recuperação muscular, redução de tensão e bem-estar geral.',
        logo: '/placeholder.svg',
        link: 'https://massagemerelax.com.br',
        category: 'Massagista',
        isActive: true,
      },
      {
        name: 'Suplementos Fit',
        description: 'Loja especializada em suplementos alimentares para atletas. Produtos de alta qualidade com preços competitivos.',
        logo: '/placeholder.svg',
        link: 'https://suplementosfit.com.br',
        category: 'Suplementos',
        isActive: true,
      },
      {
        name: 'PsicoFitness',
        description: 'Psicologia esportiva para atletas e praticantes de atividade física. Suporte mental para alcançar seus objetivos.',
        logo: '/placeholder.svg',
        link: 'https://psicofitness.com.br',
        category: 'Psicólogo',
        isActive: true,
      },
      {
        name: 'Clínica Ortopédica',
        description: 'Avaliação e tratamento ortopédico especializado. Prevenção e tratamento de lesões relacionadas à prática esportiva.',
        logo: '/placeholder.svg',
        link: 'https://clinicaortopedica.com.br',
        category: 'Ortopedista',
        isActive: true,
      },
      {
        name: 'Pilates Center',
        description: 'Estúdio especializado em Pilates terapêutico e funcional. Fortalecimento do core e correção postural.',
        logo: '/placeholder.svg',
        link: 'https://pilatescenter.com.br',
        category: 'Pilates',
        isActive: true,
      },
      {
        name: 'Dermatologia Estética',
        description: 'Tratamentos dermatológicos especializados para atletas. Cuidados com a pele, hidratação e recuperação pós-treino.',
        logo: '/placeholder.svg',
        link: 'https://dermatologiaestetica.com.br',
        category: 'Dermatologista',
        isActive: true,
      },
      {
        name: 'Laboratório BioFitness',
        description: 'Exames laboratoriais especializados para atletas. Avaliação hormonal, vitaminas e minerais essenciais para performance.',
        logo: '/placeholder.svg',
        link: 'https://biofitnesslab.com.br',
        category: 'Laboratório',
        isActive: true,
      },
      {
        name: 'Farmacia do Atleta',
        description: 'Farmácia especializada em produtos para atletas. Medicamentos, curativos e produtos para recuperação muscular.',
        logo: '/placeholder.svg',
        link: 'https://farmaciadoatleta.com.br',
        category: 'Farmácia',
        isActive: true,
      },
      {
        name: 'Academia Kids',
        description: 'Programa de atividades físicas para crianças e adolescentes. Desenvolvimento motor e hábitos saudáveis desde cedo.',
        logo: '/placeholder.svg',
        link: 'https://academiakids.com.br',
        category: 'Atividades Infantis',
        isActive: true,
      },
      {
        name: 'Yoga & Meditação',
        description: 'Aulas de yoga e meditação para equilíbrio mental e físico. Técnicas de relaxamento e mindfulness para atletas.',
        logo: '/placeholder.svg',
        link: 'https://yogameditacao.com.br',
        category: 'Yoga',
        isActive: true,
      },
      {
        name: 'Loja Esportiva Premium',
        description: 'Equipamentos esportivos de alta performance. Roupas técnicas, tênis e acessórios para todos os tipos de atividade física.',
        logo: '/placeholder.svg',
        link: 'https://lojaesportivapremium.com.br',
        category: 'Equipamentos',
        isActive: true,
      },
      {
        name: 'Clínica do Sono',
        description: 'Especialistas em medicina do sono para atletas. Otimização do descanso para melhor performance e recuperação.',
        logo: '/placeholder.svg',
        link: 'https://clinicadosono.com.br',
        category: 'Medicina do Sono',
        isActive: true,
      },
      {
        name: 'Barraquinha Saudável',
        description: 'Alimentação saudável e balanceada. Refeições preparadas por nutricionistas com foco em performance esportiva.',
        logo: '/placeholder.svg',
        link: 'https://barraquinhasaudavel.com.br',
        category: 'Alimentação',
        isActive: true,
      },
    ],
    skipDuplicates: true,
  })

  // 11. Criar anúncios
  console.log('📢 Criando anúncios...')

  await prisma.ad.createMany({
    data: [
      {
        title: 'Ganhe 1 Mês Grátis!',
        image: '/placeholder.jpg',
        link: 'https://gymstarter.com.br/matricula?promo=mesgratis',
        validUntil: new Date('2025-02-28'),
        isActive: true,
        featured: true,
        priority: 10,
        displayOrder: 1,
      },
      {
        title: 'Avaliação Física Gratuita',
        image: '/placeholder.jpg',
        link: 'https://gymstarter.com.br/avaliacao',
        validUntil: new Date('2025-03-31'),
        isActive: true,
        featured: false,
        priority: 7,
        displayOrder: 2,
      },
      {
        title: 'Personal Trainer Especialista',
        image: '/placeholder.jpg',
        link: 'https://gymstarter.com.br/personal',
        validUntil: new Date('2025-04-30'),
        isActive: true,
        featured: true,
        priority: 9,
        displayOrder: 3,
      },
      {
        title: 'Suplementos com 30% OFF',
        image: '/placeholder.jpg',
        link: 'https://gymstarter.com.br/suplementos',
        validUntil: new Date('2025-05-15'),
        isActive: true,
      },
      {
        title: 'Aulas de CrossFit Experimentais',
        image: '/placeholder.jpg',
        link: 'https://gymstarter.com.br/crossfit',
        validUntil: new Date('2025-06-30'),
        isActive: true,
      },
      {
        title: 'Massagem Descontínua',
        image: '/placeholder.jpg',
        link: 'https://gymstarter.com.br/massagem',
        validUntil: new Date('2025-07-31'),
        isActive: true,
      },
      {
        title: 'Consultoria Nutricional',
        image: '/placeholder.jpg',
        link: 'https://gymstarter.com.br/nutricionista',
        validUntil: new Date('2025-08-31'),
        isActive: true,
      },
      {
        title: 'Equipamentos Fitness',
        image: '/placeholder.jpg',
        link: 'https://gymstarter.com.br/equipamentos',
        validUntil: new Date('2025-09-30'),
        isActive: true,
      },
      {
        title: 'Plano Anual com Desconto',
        image: '/placeholder.jpg',
        link: 'https://gymstarter.com.br/planos',
        validUntil: new Date('2025-10-31'),
        isActive: true,
      },
      {
        title: 'Aulas de Pilates Grátis',
        image: '/placeholder.jpg',
        link: 'https://gymstarter.com.br/pilates',
        validUntil: new Date('2025-11-30'),
        isActive: true,
      },
    ],
    skipDuplicates: true,
  })

  // 12. Criar base de conhecimento para o chatbot
  console.log('🧠 Criando base de conhecimento...')
  console.log('📊 Iniciando criação de knowledge base...')

  try {
    await prisma.knowledgeBase.createMany({
      data: [
        {
          question: "Quais são os horários de funcionamento da academia?",
          answer: "A Gym Starter funciona de segunda a sexta-feira das 5:30h às 23:00h, aos sábados das 7:00h às 20:00h e domingos das 8:00h às 18:00h. Temos horário estendido para atender todos os perfis de alunos!",
          category: "horarios"
        },
      {
        question: "Como faço para me matricular?",
        answer: "Para se matricular na Gym Starter, você pode vir pessoalmente à academia ou fazer seu cadastro online através do nosso site. Oferecemos aulas experimentais gratuitas para você conhecer nossas instalações e modalidades antes de decidir.",
        category: "matricula"
      },
      {
        question: "Quais modalidades vocês oferecem?",
        answer: "Oferecemos musculação completa, CrossFit, Pilates, aulas funcionais, spinning, dança, yoga e muito mais. Temos programas para todos os níveis, desde iniciantes até atletas avançados.",
        category: "modalidades"
      },
      {
        question: "Vocês têm personal trainer?",
        answer: "Sim! Temos uma equipe de 15 personal trainers certificados e especializados. Oferecemos treinos personalizados, avaliação física completa e acompanhamento individual para alcançar seus objetivos.",
        category: "personal"
      },
      {
        question: "Qual o valor dos planos?",
        answer: "Temos três planos principais: Basic (R$ 89,90), Premium (R$ 149,90) e VIP (R$ 249,90). Cada plano oferece benefícios diferentes, incluindo musculação, aulas especiais e acompanhamento personalizado. Consulte nossas promoções atuais!",
        category: "planos"
      },
      {
        question: "Como funciona o check-in?",
        answer: "Para fazer check-in, use o QR Code disponível no aplicativo ou gere um novo código na recepção. Basta escanear o código na entrada e você terá acesso liberado automaticamente.",
        category: "checkin"
      },
      {
        question: "Vocês oferecem avaliação física?",
        answer: "Sim! Todas as matrículas incluem avaliação física completa realizada por nossos profissionais especializados. Avaliamos composição corporal, condicionamento físico e elaboramos um plano personalizado.",
        category: "avaliacao"
      },
      {
        question: "Como funciona o sistema de indicações?",
        answer: "Nosso programa de indicações é simples: indique um amigo e ambos ganham benefícios! O indicado recebe desconto na matrícula e você ganha um mês grátis quando a indicação se concretiza.",
        category: "indicacoes"
      },
      {
        question: "Vocês têm estacionamento?",
        answer: "Sim, oferecemos estacionamento gratuito e seguro para todos os alunos. Temos vagas cobertas e monitoramento 24 horas para sua tranquilidade.",
        category: "instalacoes"
      },
      {
        question: "Como funciona o cancelamento de matrícula?",
        answer: "Para cancelar sua matrícula, é necessário comunicar com antecedência mínima de 30 dias. Entre em contato conosco pelo telefone (85) 99999-9999 ou visite nossa unidade para orientações sobre o processo.",
        category: "cancelamento"
      },
      {
        question: "Vocês têm vestiários e chuveiros?",
        answer: "Sim! Temos vestiários completos com armários individuais, chuveiros quentes, secadores de cabelo, produtos de higiene e todas as comodidades para você se sentir à vontade antes e depois dos treinos.",
        category: "instalacoes"
      },
      {
        question: "Como funciona o agendamento de aulas?",
        answer: "Você pode agendar aulas através do nosso aplicativo, site ou diretamente na recepção. Temos aulas coletivas e particulares disponíveis. Recomendamos agendar com antecedência para garantir sua vaga.",
        category: "agendamento"
      },
      {
        question: "Vocês oferecem desconto para estudantes?",
        answer: "Sim! Oferecemos desconto especial para estudantes com carteirinha válida. O desconto é de 25% no plano semestral. Entre em contato conosco para verificar a documentação necessária.",
        category: "descontos"
      },
      {
        question: "Como funciona o plano família?",
        answer: "No plano família, o primeiro familiar paga o valor integral e os demais recebem desconto progressivo: 20% para o segundo e 30% para o terceiro familiar. Ideal para manter toda a família ativa!",
        category: "planos"
      },
      {
        question: "Vocês têm aulas para idosos?",
        answer: "Sim! Temos programas especiais para terceira idade com aulas de alongamento, pilates suave, hidroginástica e musculação adaptada. Todas as aulas são supervisionadas por profissionais especializados.",
        category: "modalidades"
      },
      {
        question: "Como funciona o acompanhamento nutricional?",
        answer: "Oferecemos consultoria nutricional através dos nossos parceiros especializados. No plano VIP, a nutricionista está incluída. Avaliamos seus hábitos alimentares e elaboramos um plano personalizado.",
        category: "nutricao"
      },
      {
        question: "Vocês têm aulas experimentais?",
        answer: "Sim! Oferecemos aulas experimentais gratuitas em todas as modalidades. É uma ótima oportunidade para conhecer nossos professores, equipamentos e ambiente antes de se matricular.",
        category: "modalidades"
      },
      {
        question: "Como funciona o sistema de lockers?",
        answer: "Temos lockers individuais disponíveis gratuitamente para todos os alunos. Você pode guardar seus pertences com segurança durante os treinos. Basta solicitar na recepção.",
        category: "instalacoes"
      },
      {
        question: "Vocês têm área de recuperação muscular?",
        answer: "Sim! Temos sala de recuperação com equipamentos de massagem, alongamento e crioterapia. Também oferecemos massagens terapêuticas através dos nossos parceiros especializados.",
        category: "instalacoes"
      },
      {
        question: "Como funciona o programa de fidelidade?",
        answer: "Quanto mais você treina, mais benefícios ganha! A cada 10 check-ins, você ganha uma aula experimental grátis. Clientes fiéis também têm prioridade em agendamentos e eventos especiais.",
        category: "beneficios"
      },
      {
        question: "Vocês têm aulas de dança?",
        answer: "Sim! Oferecemos aulas de dança como zumba, dança do ventre, salsa e muito mais. São aulas divertidas e excelentes para queima calórica e coordenação motora.",
        category: "modalidades"
      },
      {
        question: "Como funciona o acompanhamento de progresso?",
        answer: "Acompanhamos seu progresso através de avaliações periódicas, medição de composição corporal, testes de condicionamento e fotos comparativas. Você recebe relatórios detalhados do seu desenvolvimento.",
        category: "acompanhamento"
      },
      {
        question: "Vocês têm equipamentos para pessoas com deficiência?",
        answer: "Sim! Temos equipamentos adaptados e oferecemos aulas especiais para pessoas com deficiência. Nossos profissionais são capacitados para atender diferentes necessidades especiais.",
        category: "acessibilidade"
      },
      {
        question: "Como funciona o sistema de reservas de equipamentos?",
        answer: "Equipamentos específicos como esteiras e bikes podem ser reservados através do aplicativo ou na recepção. A reserva tem duração máxima de 30 minutos para garantir que todos tenham acesso.",
        category: "equipamentos"
      },
      {
        question: "Vocês oferecem suplementação?",
        answer: "Temos parceria com lojas especializadas em suplementos. Oferecemos desconto exclusivo para alunos e orientação profissional sobre suplementação adequada aos seus objetivos.",
        category: "suplementos"
      },
      {
        question: "Como funciona o horário de pico?",
        answer: "Durante horários de pico (7h-9h e 17h-19h), alguns equipamentos podem ter maior demanda. Recomendamos agendar seus treinos fora desses horários para melhor experiência.",
        category: "horarios"
      },
      {
        question: "Vocês têm programa para emagrecimento?",
        answer: "Sim! Temos programas completos de emagrecimento que incluem treinos específicos, acompanhamento nutricional e orientação profissional. Resultados comprovados com metodologia científica.",
        category: "programas"
      },
      {
        question: "Como funciona o sistema de avaliação de aulas?",
        answer: "Após cada aula, você pode avaliar o professor e a experiência através do aplicativo. Seu feedback nos ajuda a manter a qualidade e melhorar continuamente nossos serviços.",
        category: "feedback"
      }
    ],
    skipDuplicates: true,
  })

    console.log('✅ Knowledge base criada com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao criar knowledge base:', error)
    throw error
  }

  console.log('🎉 Seed concluído com sucesso!')
  console.log('📊 Dados criados:')
  console.log(`   👥 ${4} usuários`)
  console.log(`   ⚙️ 1 configuração da academia`)
  console.log(`   💳 ${3} planos`)
  console.log(`   📱 ${2} códigos de check-in`)
  console.log(`   ✅ ${5} check-ins`)
  console.log(`   📅 ${4} agendamentos`)
  console.log(`   💬 ${3} mensagens`)
  console.log(`   🤝 ${3} indicações`)
  console.log(`   🎁 ${12} promoções`)
  console.log(`   🤝 ${16} parceiros`)
  console.log(`   📢 ${10} anúncios`)
  console.log(`   🧠 ${25} entradas de knowledge base`)
  console.log('')
  console.log('🔐 Credenciais de acesso:')
  console.log('   Admin: admin@gymstarter.com.br / 123456')
  console.log('   Aluno: joao.silva@email.com / 123456')
  console.log('   Aluno: maria.santos@email.com / 123456')
  console.log('   Aluno: pedro.costa@email.com / 123456')
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })