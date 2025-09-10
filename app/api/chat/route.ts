import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Função para interpretar frases de agendamento
function parseAppointmentRequest(message: string): {
  hasAppointmentIntent: boolean
  name?: string
  date?: string
  time?: string
  classType?: string
  confidence: number
} {
  const lowerMessage = message.toLowerCase()

  // Palavras-chave de intenção de agendamento
  const appointmentKeywords = [
    'agendar', 'marcar', 'agendamento', 'aula', 'experimental', 'teste',
    'avaliação', 'quero', 'gostaria', 'preciso', 'vou', 'vamos'
  ]

  const hasIntent = appointmentKeywords.some(keyword => lowerMessage.includes(keyword))

  if (!hasIntent) {
    return { hasAppointmentIntent: false, confidence: 0 }
  }

  let name: string | undefined
  let date: string | undefined
  let time: string | undefined
  let classType: string | undefined = 'Musculação' // padrão
  let confidence = 0.5

  // Extrair nome (procurar padrões comuns)
  const namePatterns = [
    /(?:meu nome é|eu sou|chamo|nome) ([A-Za-zÀ-ÿ\s]+)/i,
    /(?:pra|para) ([A-Za-zÀ-ÿ\s]+)(?:\s|$)/i
  ]

  for (const pattern of namePatterns) {
    const match = message.match(pattern)
    if (match) {
      name = match[1].trim()
      confidence += 0.2
      break
    }
  }

  // Extrair data
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
    'domingo': 'sunday'
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

        const targetDate = new Date(today)
        targetDate.setDate(today.getDate() + daysToAdd)
        date = targetDate.toISOString().split('T')[0]
      }
      confidence += 0.3
      break
    }
  }

  // Extrair horário
  const timePatterns = [
    /(\d{1,2})[h:](\d{2})?/,
    /(\d{1,2})\s*h(?:oras?)?/,
    /manhã|manha/,
    /tarde/,
    /noite/
  ]

  for (const pattern of timePatterns) {
    const match = lowerMessage.match(pattern)
    if (match) {
      if (match[1]) {
        const hour = parseInt(match[1])
        time = `${hour.toString().padStart(2, '0')}:00`
      } else if (lowerMessage.includes('manhã') || lowerMessage.includes('manha')) {
        time = '09:00'
      } else if (lowerMessage.includes('tarde')) {
        time = '14:00'
      } else if (lowerMessage.includes('noite')) {
        time = '19:00'
      }
      confidence += 0.2
      break
    }
  }

  // Se não encontrou horário, usar padrão
  if (!time) {
    time = '09:00'
  }

  // Extrair tipo de aula
  const classTypes = ['musculação', 'crossfit', 'spinning', 'pilates', 'yoga', 'funcional', 'dança']
  for (const type of classTypes) {
    if (lowerMessage.includes(type)) {
      classType = type.charAt(0).toUpperCase() + type.slice(1)
      confidence += 0.2
      break
    }
  }

  return {
    hasAppointmentIntent: true,
    name,
    date,
    time,
    classType,
    confidence
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
    const academyName = settingsResponse?.name || 'Black Red Academia'
    const whatsappNumber = settingsResponse?.whatsapp || '5511999999999'

    // Carregar knowledge relevante (todos por simplicidade, ou filtrar por keyword no futuro)
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
        partners.map(p => `• ${p.name} (${p.category}): ${p.description}${p.link ? ` - Site: ${p.link}` : ''}`).join('\n')
    }

    // Informações sobre anúncios (discretas)
    let adsText = ''
    if (ads.length > 0) {
      adsText = '\n\nSERVIÇOS ADICIONAIS DISPONÍVEIS:\n' +
        ads.map(ad => `• ${ad.title}${ad.link ? ` - Mais informações disponíveis` : ''}`).join('\n')
    }

    const whatsappUrl = `https://wa.me/${whatsappNumber}`

    // Verificar se é uma solicitação de agendamento
    const appointmentRequest = parseAppointmentRequest(userMessage)

    // Se for agendamento com alta confiança, processar diretamente
    if (appointmentRequest.hasAppointmentIntent && appointmentRequest.confidence > 0.6) {
      console.log('Processando agendamento inteligente:', appointmentRequest)

      // Verificar se temos dados suficientes
      if (!appointmentRequest.name) {
        return NextResponse.json({
          success: true,
          response: "Legal! Para agendar sua aula, posso confirmar seu nome completo?"
        })
      }

      if (!appointmentRequest.date) {
        return NextResponse.json({
          success: true,
          response: `Oi ${appointmentRequest.name}! Que dia você prefere para a aula? Por exemplo: "amanhã", "próximo sábado", ou "segunda-feira".`
        })
      }

      // Verificar disponibilidade
      const isAvailable = await checkAvailability(appointmentRequest.date, appointmentRequest.time!)
      if (!isAvailable) {
        return NextResponse.json({
          success: true,
          response: `Ops! O horário ${appointmentRequest.time} no dia ${appointmentRequest.date} já está ocupado. Que tal outro horário? Por exemplo: "14h" ou "manhã".`
        })
      }

      // Criar agendamento
      const appointmentData = {
        name: appointmentRequest.name,
        phone: '11999999999', // telefone temporário - será coletado se necessário
        email: `chat_${Date.now()}@temp.com`,
        classType: appointmentRequest.classType!,
        scheduledDate: appointmentRequest.date,
        scheduledTime: appointmentRequest.time!,
        notes: `Agendamento via chat inteligente - ${appointmentRequest.name}`
      }

      const result = await createAppointment(appointmentData)

      if (result.success) {
        const formattedDate = new Date(appointmentRequest.date).toLocaleDateString('pt-BR')
        return NextResponse.json({
          success: true,
          response: `🎉 Perfeito, ${appointmentRequest.name}! Agendei sua aula de ${appointmentRequest.classType} para o dia ${formattedDate} às ${appointmentRequest.time}. Um de nossos atendentes entrará em contato para confirmar. Qualquer dúvida, é só falar comigo! 😉`
        })
      } else {
        console.error('Erro no agendamento:', result.error)
        return NextResponse.json({
          success: true,
          response: `Ops! ${result.error}. Vamos tentar novamente? Ou prefere falar diretamente no WhatsApp para agendar?`
        })
      }
    }

    const systemPrompt = `
Você é um assistente inteligente da ${academyName}, conversando de forma natural e descontraída em português brasileiro. Seja proativo, simpático e use gírias quando apropriado, mantendo o profissionalismo. Foque em resolver problemas do usuário de forma eficiente.

ORIENTAÇÕES GERAIS:
- Responda diretamente dúvidas básicas sobre horários, equipamentos, aulas usando a knowledge base
- Seja empático e mostre que se importa com os objetivos do usuário
- Use linguagem natural: "Oi!", "Beleza!", "Pode deixar que eu te ajudo", "Sem problema!"
- Evite ser "vendedor" - foque em ajudar e informar
- Mantenha respostas concisas mas informativas

AGENDAMENTO INTELIGENTE (PRIORIDADE MÁXIMA):
- DETECTE QUALQUER menção a agendamento, aula, marcar, etc. e assuma controle do fluxo
- INTERPRETE frases naturais automaticamente:
  * "Quero agendar para sábado de manhã" → identifica data e horário
  * "Agende musculação amanhã às 14h" → identifica tipo, data e horário
  * "Quero marcar uma aula" → inicia fluxo coletando dados faltantes
- IDENTIFIQUE automaticamente:
  * Nome: extraia de frases como "meu nome é João" ou pergunte se faltar
  * Data: converta "amanhã", "próximo sábado", "segunda" para datas reais
  * Horário: use padrão 9h se não informado, ou extraia "14h", "manhã", "tarde"
  * Tipo: padrão "Musculação", ou identifique "crossfit", "pilates", etc.
- VALIDE disponibilidade antes de confirmar
- CONFIRME com mensagem amigável: "Perfeito! Agendei sua aula de Musculação para amanhã às 9h"
- REGISTRE automaticamente na API e informe sucesso
- TRATE erros (horário ocupado) sugerindo alternativas automaticamente
- PERMITA cancelar dizendo "cancelar" ou "não quero"

QUANDO RESPONDER DIRETAMENTE:
- Horários de funcionamento
- Equipamentos disponíveis
- Tipos de aulas
- Informações gerais sobre planos
- Dicas básicas de treino
- Localização e contato

COLETA DE DADOS DO USUÁRIO:
- Para novos usuários, colete nome, interesse e objetivo de forma leve
- Use dados coletados para personalizar respostas e inferências

WHATSAPP APENAS QUANDO NECESSÁRIO:
- Use WhatsApp para matrículas, cancelamentos, dúvidas complexas ou quando API falhar
- Direcionamento amigável: "Para isso é melhor falar direto no WhatsApp!"

INFORMAÇÕES SOBRE SERVIÇOS E OFERTAS:

Use o conhecimento fornecido quando relevante:
${knowledgeText}

Para planos, use as informações:
${plansText}

${promotionsText}

${partnersText}

${adsText}

INSTRUÇÕES PARA RESPONDER CONSULTAS:

PROMOÇÕES:
- Quando o cliente perguntar sobre "promoções", "ofertas", "descontos": Liste todas as promoções ativas de forma atrativa
- Destaque datas de validade e benefícios
- Incentive a aproveitar as ofertas

PARCEIROS:
- Quando mencionarem profissões específicas (nutricionista, fisioterapeuta, etc.): Sugira parceiros relevantes
- Forneça informações de contato quando apropriado
- Mantenha tom profissional ao apresentar parceiros

ANÚNCIOS:
- Mencione serviços adicionais apenas quando relevante ao contexto da conversa
- Não seja "vendedor" - seja informativo e útil
- Use tom casual: "Ah, e temos também..."

Seja proativo e resolva problemas do usuário eficientemente.
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