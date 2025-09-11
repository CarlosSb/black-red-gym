import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Interface para armazenar contexto da conversa
interface ConversationContext {
  userInfo?: {
    name?: string
    phone?: string
    email?: string
  }
  appointmentIntent?: {
    classType?: string
    date?: string
    time?: string
    confidence: number
  }
  lastTopic?: string
  awaitingResponse?: boolean
}

// Função para extrair informações do usuário da mensagem
function extractUserInfo(message: string): { name?: string; phone?: string; email?: string } {
  const lowerMessage = message.toLowerCase()
  let name: string | undefined
  let phone: string | undefined
  let email: string | undefined

  // Extrair nome
  const namePatterns = [
    /(?:meu nome é|eu sou|chamo|nome) ([A-Za-zÀ-ÿ\s]+)/i,
    /(?:pra|para) ([A-Za-zÀ-ÿ\s]+)(?:\s|$)/i,
    /(?:sou) ([A-Za-zÀ-ÿ\s]+)(?:\s|$)/i
  ]

  for (const pattern of namePatterns) {
    const match = message.match(pattern)
    if (match) {
      name = match[1].trim()
      break
    }
  }

  // Extrair telefone
  const phonePatterns = [
    /(?:telefone|celular|fone|whatsapp)[\s:]*(\(?\d{2}\)?\s?\d{4,5}-?\d{4})/i,
    /(\(?\d{2}\)?\s?\d{4,5}-?\d{4})/
  ]

  for (const pattern of phonePatterns) {
    const match = message.match(pattern)
    if (match) {
      phone = match[1].replace(/\D/g, '')
      break
    }
  }

  // Extrair email
  const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i
  const emailMatch = message.match(emailPattern)
  if (emailMatch) {
    email = emailMatch[1].toLowerCase()
  }

  return { name, phone, email }
}

// Função para atualizar contexto da conversa
function updateConversationContext(context: ConversationContext, message: string): ConversationContext {
  const userInfo = extractUserInfo(message)

  // Atualizar informações do usuário se encontradas
  if (userInfo.name && !context.userInfo?.name) {
    context.userInfo = { ...context.userInfo, name: userInfo.name }
  }
  if (userInfo.phone && !context.userInfo?.phone) {
    context.userInfo = { ...context.userInfo, phone: userInfo.phone }
  }
  if (userInfo.email && !context.userInfo?.email) {
    context.userInfo = { ...context.userInfo, email: userInfo.email }
  }

  return context
}

// Função melhorada para interpretar frases de agendamento
function parseAppointmentRequest(message: string, context?: ConversationContext): {
  hasAppointmentIntent: boolean
  name?: string
  date?: string
  time?: string
  classType?: string
  confidence: number
  missingInfo: string[]
} {
  const lowerMessage = message.toLowerCase()

  // Palavras-chave expandidas de intenção de agendamento
  const appointmentKeywords = [
    'agendar', 'marcar', 'agendamento', 'aula', 'experimental', 'teste',
    'avaliação', 'quero', 'gostaria', 'preciso', 'vou', 'vamos',
    'reservar', 'agende', 'marque', 'experimentar', 'conhecer',
    'começar', 'iniciar', 'treinar', 'academia', 'musculação'
  ]

  const hasIntent = appointmentKeywords.some(keyword => lowerMessage.includes(keyword))

  if (!hasIntent) {
    return { hasAppointmentIntent: false, confidence: 0, missingInfo: [] }
  }

  let name: string | undefined = context?.userInfo?.name
  let date: string | undefined
  let time: string | undefined
  let classType: string | undefined = 'Musculação' // padrão
  let confidence = 0.4 // Começar com confiança menor
  const missingInfo: string[] = []

  // Extrair nome (procurar padrões comuns)
  if (!name) {
    const namePatterns = [
      /(?:meu nome é|eu sou|chamo|nome) ([A-Za-zÀ-ÿ\s]+)/i,
      /(?:pra|para) ([A-Za-zÀ-ÿ\s]+)(?:\s|$)/i,
      /(?:sou) ([A-Za-zÀ-ÿ\s]+)(?:\s|$)/i
    ]

    for (const pattern of namePatterns) {
      const match = message.match(pattern)
      if (match) {
        name = match[1].trim()
        confidence += 0.2
        break
      }
    }
  }

  // Extrair data com padrões mais abrangentes
  const datePatterns = {
    'amanhã': () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      return tomorrow.toISOString().split('T')[0]
    },
    'hoje': () => new Date().toISOString().split('T')[0],
    'segunda': 'monday',
    'terça': 'tuesday',
    'quarta': 'wednesday',
    'quinta': 'thursday',
    'sexta': 'friday',
    'sábado': 'saturday',
    'domingo': 'sunday',
    'próxima segunda': 'monday',
    'próxima terça': 'tuesday',
    'próxima quarta': 'wednesday',
    'próxima quinta': 'thursday',
    'próxima sexta': 'friday',
    'próximo sábado': 'saturday',
    'próximo domingo': 'sunday'
  }

  for (const [key, value] of Object.entries(datePatterns)) {
    if (lowerMessage.includes(key)) {
      if (typeof value === 'function') {
        date = value()
      } else {
        // Calcular próxima data para o dia da semana
        const today = new Date()
        const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
        const targetDayIndex = daysOfWeek.indexOf(value)
        const currentDayIndex = today.getDay()

        let daysToAdd = targetDayIndex - currentDayIndex
        if (daysToAdd <= 0) {
          daysToAdd += 7
        }

        // Se for "próxima", adicionar mais 7 dias
        if (key.includes('próxima') || key.includes('próximo')) {
          daysToAdd += 7
        }

        const targetDate = new Date(today)
        targetDate.setDate(today.getDate() + daysToAdd)
        date = targetDate.toISOString().split('T')[0]
      }
      confidence += 0.3
      break
    }
  }

  // Extrair horário com padrões mais abrangentes
  const timePatterns = [
    /(\d{1,2})[h:](\d{2})?/,
    /(\d{1,2})\s*h(?:oras?)?/,
    /(\d{1,2})\s*horas?/,
    /manhã|manha|tarde|noite|cedo|tardinha/,
    /(\d{1,2})\s*da\s*(?:manhã|tarde|noite)/
  ]

  for (const pattern of timePatterns) {
    const match = lowerMessage.match(pattern)
    if (match) {
      if (match[1]) {
        const hour = parseInt(match[1])
        let adjustedHour = hour

        // Ajustar horário baseado no período do dia
        if (lowerMessage.includes('tarde') && hour < 12) {
          adjustedHour = hour + 12
        } else if (lowerMessage.includes('noite') && hour < 12) {
          adjustedHour = hour + 12
        } else if (lowerMessage.includes('manhã') && hour > 12) {
          adjustedHour = hour - 12
        }

        time = `${adjustedHour.toString().padStart(2, '0')}:00`
      } else if (lowerMessage.includes('manhã') || lowerMessage.includes('manha')) {
        time = '09:00'
      } else if (lowerMessage.includes('tarde')) {
        time = '14:00'
      } else if (lowerMessage.includes('noite')) {
        time = '19:00'
      } else if (lowerMessage.includes('cedo')) {
        time = '06:00'
      }
      confidence += 0.2
      break
    }
  }

  // Se não encontrou horário, usar padrão baseado na disponibilidade
  if (!time) {
    time = '09:00' // Padrão manhã
  }

  // Extrair tipo de aula com mais opções
  const classTypes = [
    'musculação', 'crossfit', 'spinning', 'pilates', 'yoga',
    'funcional', 'dança', 'jump', 'zumba', 'alongamento',
    'avaliação física', 'personal', 'treino funcional'
  ]

  for (const type of classTypes) {
    if (lowerMessage.includes(type)) {
      classType = type.charAt(0).toUpperCase() + type.slice(1)
      confidence += 0.2
      break
    }
  }

  // Verificar informações faltantes
  if (!name) missingInfo.push('nome')
  if (!date) missingInfo.push('data')
  if (!time) missingInfo.push('horário')

  return {
    hasAppointmentIntent: true,
    name,
    date,
    time,
    classType,
    confidence,
    missingInfo
  }
}

// Função para verificar disponibilidade de horário
async function checkAvailability(date: string, time: string): Promise<boolean> {
  try {
    const appointmentDate = new Date(`${date}T${time}`)
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        scheduledDate: appointmentDate,
        scheduledTime: time,
        status: {
          in: ["PENDING", "CONFIRMED"]
        }
      }
    })
    return !existingAppointment
  } catch (error) {
    console.error('Erro ao verificar disponibilidade:', error)
    return false
  }
}

// Função para criar agendamento via API
async function createAppointment(data: {
  name: string
  phone: string
  email: string
  classType: string
  scheduledDate: string
  scheduledTime: string
  notes?: string
}): Promise<{ success: boolean; appointment?: any; error?: string }> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    const result = await response.json()

    if (response.ok) {
      return { success: true, appointment: result.appointment }
    } else {
      return { success: false, error: result.error || 'Erro ao criar agendamento' }
    }
  } catch (error) {
    console.error('Erro na API de agendamentos:', error)
    return { success: false, error: 'Erro de conexão com API' }
  }
}

// POST /api/chat - Receber mensagem do usuário e retornar resposta da IA
export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Mensagens são obrigatórias" },
        { status: 400 }
      )
    }

    const userMessage = messages[messages.length - 1].content
    if (!userMessage) {
      return NextResponse.json(
        { error: "Mensagem do usuário é obrigatória" },
        { status: 400 }
      )
    }

    // Carregar settings da academia
    const settingsResponse = await prisma.academySettings.findFirst()
    console.log('Settings carregadas:', {
      name: settingsResponse?.name,
      whatsapp: settingsResponse?.whatsapp,
      phone: settingsResponse?.phone,
      email: settingsResponse?.email,
      allowScheduling: settingsResponse?.allowScheduling,
      schedulingMode: settingsResponse?.schedulingMode
    })

    const academyName = settingsResponse?.name || 'Gym Starter'
    const whatsappNumber = settingsResponse?.whatsapp || '5585999999999'
    const academyAddress = settingsResponse?.address || 'Av. Santos Dumont, 1515 - Aldeota, Fortaleza - CE'
    const academyPhone = settingsResponse?.phone || '(85) 99999-9999'
    const academyEmail = settingsResponse?.email || 'contato@gymstarter.com.br'

    // Configurações do assistente
    const allowScheduling = settingsResponse?.allowScheduling || 'onIntent'
    const schedulingMode = settingsResponse?.schedulingMode || 'conservative'
    const fallbackResponse = settingsResponse?.fallbackResponse || 'Se precisar de ajuda com agendamento, posso te orientar ou direcionar para nosso WhatsApp! 😉'

    console.log('Configurações do assistente:', { allowScheduling, schedulingMode, fallbackResponse })

    // Carregar knowledge relevante
    const knowledge = await prisma.knowledgeBase.findMany()

    // Carregar planos ativos
    const plans = await prisma.plan.findMany({
      where: { status: 'ACTIVE' }
    })

    // Carregar promoções ativas
    const promotions = await prisma.promotion.findMany({
      where: {
        isActive: true,
        validUntil: {
          gte: new Date()
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Carregar parceiros ativos
    const partners = await prisma.partner.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Carregar anúncios ativos
    const ads = await prisma.ad.findMany({
      where: {
        isActive: true,
        validUntil: {
          gte: new Date()
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Inicializar contexto da conversa (simples por enquanto - pode ser expandido para usar Redis/session)
    let conversationContext: ConversationContext = {}

    // Atualizar contexto com informações da mensagem atual
    conversationContext = updateConversationContext(conversationContext, userMessage)

    // Verificar se é uma solicitação de agendamento (mais conservadora)
    const appointmentRequest = parseAppointmentRequest(userMessage, conversationContext)

    // Construir informações da academia
    const academyInfo = `
ACADEMIA: ${academyName}
ENDEREÇO: ${academyAddress}
TELEFONE: ${academyPhone}
EMAIL: ${academyEmail}
WHATSAPP: ${whatsappNumber}
HORÁRIOS: Segunda a sexta: 5:30h às 23:00h, Sábados: 7:00h às 20:00h, Domingos: 8:00h às 18:00h
MODALIDADES: Musculação, CrossFit, Pilates, Funcional, Spinning, Yoga, Dança
`

    // Construir prompt em PT-BR simulando atendente humano
    let knowledgeText = knowledge.map(k => `Pergunta: ${k.question}\nResposta: ${k.answer}`).join('\n\n')
    let plansText = plans.map(p => `Plano: ${p.name} - Preço: R$ ${p.price} - Descrição: ${p.description} - Benefícios: ${p.features.join(', ')}`).join('\n')

    // Informações sobre promoções ativas
    let promotionsText = ''
    if (promotions.length > 0) {
      promotionsText = '\n\nPROMOÇÕES ATIVAS:\n' +
        promotions.map(p => `• ${p.title}: ${p.description} (Válido até ${new Date(p.validUntil).toLocaleDateString('pt-BR')})`).join('\n')
    }

    // Informações sobre parceiros
    let partnersText = ''
    if (partners.length > 0) {
      partnersText = '\n\nPARCEIROS DISPONÍVEIS:\n' +
        partners.map(p => `• ${p.name} (${p.category}): ${p.description}${p.link ? ` - Contato: ${p.link}` : ''}`).join('\n')
    }

    // Informações sobre anúncios (discretas)
    let adsText = ''
    if (ads.length > 0) {
      adsText = '\n\nSERVIÇOS ADICIONAIS:\n' +
        ads.map(ad => `• ${ad.title}${ad.link ? ` - Mais informações disponíveis` : ''}`).join('\n')
    }

    const whatsappUrl = `https://wa.me/${whatsappNumber}`

    // Lógica de controle de agendamento baseada nas configurações
    let shouldOfferScheduling = false

    if (appointmentRequest.hasAppointmentIntent) {
      switch (allowScheduling) {
        case 'onIntent':
          // Só oferece agendamento se detectar intenção explícita E confiança alta
          shouldOfferScheduling = appointmentRequest.confidence > 0.8
          break
        case 'always':
          // Sempre oferece agendamento quando detecta intenção (mesmo com baixa confiança)
          shouldOfferScheduling = true
          break
        case 'off':
          // Nunca oferece agendamento automaticamente
          shouldOfferScheduling = false
          break
        default:
          // Padrão conservador
          shouldOfferScheduling = appointmentRequest.confidence > 0.8
      }
    }

    console.log('Controle de agendamento:', {
      allowScheduling,
      schedulingMode,
      hasAppointmentIntent: appointmentRequest.hasAppointmentIntent,
      confidence: appointmentRequest.confidence,
      shouldOfferScheduling
    })

    // Se agendamento estiver OFF mas usuário demonstrou intenção, direcione para WhatsApp
    if (allowScheduling === 'off' && appointmentRequest.hasAppointmentIntent && appointmentRequest.confidence > 0.6) {
      return NextResponse.json({
        success: true,
        response: `${fallbackResponse}\n\n📱 Fale diretamente no WhatsApp: ${whatsappUrl}\n\nLá você terá atendimento personalizado para agendar sua aula! 😉`
      })
    }

    // Lógica de agendamento baseada na configuração
    if (shouldOfferScheduling) {
      console.log('Processando agendamento solicitado:', appointmentRequest)

      // Verificar se temos dados mínimos para prosseguir
      if (!appointmentRequest.name && !conversationContext.userInfo?.name) {
        return NextResponse.json({
          success: true,
          response: "Oi! Que legal que você quer agendar uma aula! 😊 Para começar, qual é o seu nome completo?"
        })
      }

      // Usar nome do contexto ou da requisição
      const userName = conversationContext.userInfo?.name || appointmentRequest.name || 'amigo'

      if (!appointmentRequest.date) {
        return NextResponse.json({
          success: true,
          response: `Oi ${userName}! Que dia você prefere para a aula? Por exemplo: "amanhã", "próximo sábado", ou "segunda-feira".`
        })
      }

      if (!appointmentRequest.time) {
        return NextResponse.json({
          success: true,
          response: `${userName}, qual horário você prefere? Por exemplo: "9h da manhã", "14h", "tarde" ou "noite".`
        })
      }

      // Só prossegue se temos TODAS as informações necessárias
      if (appointmentRequest.name && appointmentRequest.date && appointmentRequest.time) {
        // Verificar disponibilidade
        const isAvailable = await checkAvailability(appointmentRequest.date, appointmentRequest.time)
        if (!isAvailable) {
          return NextResponse.json({
            success: true,
            response: `Ops! O horário ${appointmentRequest.time} no dia ${appointmentRequest.date} já está ocupado. Que tal outro horário? Por exemplo: "14h" ou "manhã".`
          })
        }

        // Coletar informações de contato se necessário
        let phone = conversationContext.userInfo?.phone
        let email = conversationContext.userInfo?.email

        if (!phone) {
          return NextResponse.json({
            success: true,
            response: `${appointmentRequest.name}, para confirmar o agendamento, qual é o seu telefone? (Ex: (85) 99999-9999)`
          })
        }

        if (!email) {
          return NextResponse.json({
            success: true,
            response: `${appointmentRequest.name}, qual é o seu email para enviarmos a confirmação?`
          })
        }

        // Criar agendamento com dados completos e validação
        const appointmentData = {
          name: appointmentRequest.name!,
          phone: phone!,
          email: email!,
          classType: appointmentRequest.classType || 'Musculação',
          scheduledDate: appointmentRequest.date!,
          scheduledTime: appointmentRequest.time!,
          notes: `Agendamento via chat inteligente - ${appointmentRequest.name}`
        }

        // Validação adicional antes de enviar
        if (!appointmentData.scheduledDate || !appointmentData.scheduledTime) {
          console.error('Erro: Data ou horário undefined:', { date: appointmentRequest.date, time: appointmentRequest.time })
          return NextResponse.json({
            success: true,
            response: `Ops! Parece que houve um problema com os dados. Vamos tentar novamente? Qual dia e horário você prefere?`
          })
        }

        const result = await createAppointment(appointmentData)

        if (result.success) {
          const formattedDate = new Date(appointmentRequest.date).toLocaleDateString('pt-BR')
          return NextResponse.json({
            success: true,
            response: `🎉 Perfeito, ${appointmentRequest.name}! Agendei sua aula de ${appointmentRequest.classType} para o dia ${formattedDate} às ${appointmentRequest.time}.\n\n📱 Um de nossos atendentes entrará em contato pelo WhatsApp (${whatsappNumber}) para confirmar todos os detalhes.\n\nQualquer dúvida, é só falar comigo! 😉`
          })
        } else {
          console.error('Erro no agendamento:', result.error)
          return NextResponse.json({
            success: true,
            response: `Ops! ${result.error}. Vamos tentar novamente? Ou prefere falar diretamente no WhatsApp (${whatsappUrl}) para agendar?`
          })
        }
      }
    }

    const systemPrompt = `
Você é um assistente inteligente da ${academyName}, conversando de forma natural e descontraída em português brasileiro. Seja proativo, simpático e use gírias quando apropriado, mantendo o profissionalismo. Foque em resolver problemas do usuário de forma eficiente.

INFORMAÇÕES DA ACADEMIA:
${academyInfo}

ORIENTAÇÕES GERAIS:
- Responda diretamente dúvidas básicas sobre horários, equipamentos, aulas usando a knowledge base
- Seja empático e mostre que se importa com os objetivos do usuário
- Use linguagem natural: "Oi!", "Beleza!", "Pode deixar que eu te ajudo", "Sem problema!"
- Evite ser "vendedor" - foque em ajudar e informar
- Mantenha respostas concisas mas informativas
- Sempre que mencionar contato, use as informações oficiais da academia

CONTROLE DE AGENDAMENTO (${allowScheduling.toUpperCase()}):
- Modo atual: ${allowScheduling}
- ${allowScheduling === 'onIntent' ? 'SÓ oferece agendamento quando detectar intenção EXPLÍCITA e confiança ALTA (>0.8)' : ''}
- ${allowScheduling === 'always' ? 'SEMPRE oferece agendamento quando detectar QUALQUER intenção' : ''}
- ${allowScheduling === 'off' ? 'NUNCA oferece agendamento automaticamente' : ''}

DIRETRIZES DE AGENDAMENTO:
- Respeite sempre a configuração atual de agendamento
- Se agendamento estiver OFF: direcione para WhatsApp ou atendimento humano
- Se agendamento estiver ON_INTENT: só inicie quando houver intenção clara e confiança alta
- Se agendamento estiver ALWAYS: seja mais proativo mas não force
- Use a resposta padrão quando não puder agendar: "${fallbackResponse}"

EXEMPLOS DE COMPORTAMENTO:
- Usuário: "Quero conhecer a academia" → Responda normalmente, não ofereça agendamento
- Usuário: "Como funciona?" → Explique sem agendamento
- Usuário: "Quero agendar musculação" → ${allowScheduling === 'off' ? 'Direcione para WhatsApp' : 'Inicie processo de agendamento'}
- Usuário: "Sou novo aqui" → Dê boas-vindas e informações gerais

FLUXO CONVERSACIONAL NATURAL:
- Mantenha conversa fluida e natural
- Responda dúvidas sobre academia normalmente
- Só mude para modo agendamento quando usuário confirmar interesse
- Use informações do contexto para personalizar respostas
- Antecipe necessidades baseado no histórico da conversa

QUANDO RESPONDER DIRETAMENTE (sempre que possível):
- Horários de funcionamento
- Equipamentos disponíveis
- Tipos de aulas oferecidas
- Informações gerais sobre planos
- Dicas básicas de treino
- Localização e contato oficial
- Informações sobre promoções quando perguntado
- Sugestões de parceiros quando relevante

COLETA DE DADOS DO USUÁRIO (apenas quando necessário):
- Para agendamento: colete nome, data, horário de forma natural
- Use dados coletados para personalizar respostas
- Memorize informações fornecidas para evitar perguntas repetidas
- Seja eficiente: não peça dados desnecessários

WHATSAPP APENAS QUANDO NECESSÁRIO:
- Use WhatsApp para matrículas, cancelamentos, dúvidas complexas
- Sempre forneça o link correto: ${whatsappUrl}
- Direcionamento amigável: "Para agendar é melhor falar direto no WhatsApp!"

CONHECIMENTO BASE (use quando relevante):
${knowledgeText}

PLANOS DISPONÍVEIS:
${plansText}

${promotionsText}

${partnersText}

${adsText}

INSTRUÇÕES PARA RESPONDER CONSULTAS:

PROMOÇÕES:
- Quando perguntar sobre "promoções", "ofertas", "descontos": Liste todas ativas
- Destaque datas de validade e benefícios
- Incentive a aproveitar mas não force

PARCEIROS:
- Quando mencionarem profissões específicas: Sugira parceiros relevantes
- Forneça informações de contato oficiais
- Mantenha tom profissional

ANÚNCIOS:
- Mencione serviços adicionais apenas quando relevante ao contexto
- Seja informativo e útil, não "vendedor"
- Use tom casual: "Ah, e temos também..."

Seja proativo, resolva problemas eficientemente e mantenha conversas naturais e agradáveis.
    `

    // Chamar OpenAI GPT-3.5-turbo com histórico completo
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      max_tokens: 500,
      temperature: 0.7
    })

    const aiResponse = completion.choices[0]?.message?.content || "Desculpe, não consegui processar sua mensagem. Tente novamente ou fale no WhatsApp."

    // Log da interação para análise e melhoria
    console.log('Chat Interaction:', {
      userMessage,
      aiResponse: aiResponse.substring(0, 100) + '...',
      hasAppointmentIntent: appointmentRequest.hasAppointmentIntent,
      appointmentConfidence: appointmentRequest.confidence,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      response: aiResponse
    })

   } catch (error) {
    console.error("Erro no chat:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}