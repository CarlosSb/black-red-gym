"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Phone, RefreshCw, AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import DataService from "@/lib/data-service"
import { useAcademySettings } from "@/hooks/use-academy-settings"

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

export function ChatFlutuante() {
  const { isAuthenticated, user } = useAuth()
  const { settings } = useAcademySettings()
  const [isVisible, setIsVisible] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [assistantSettings, setAssistantSettings] = useState({
    enabled: true,
    delay: 5000,
    welcomeMessage: ""
  })
  const [showWhatsappButton, setShowWhatsappButton] = useState(false)
  const [whatsappContext, setWhatsappContext] = useState("")
  const [isScheduling, setIsScheduling] = useState(false)
  const [schedulingStep, setSchedulingStep] = useState<'smart' | 'name' | 'phone' | 'datetime' | 'confirm' | null>(null)
  const [schedulingData, setSchedulingData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    classType: 'Musculação'
  })
  const [userProfile, setUserProfile] = useState({
    name: '',
    interest: '',
    goal: ''
  })
  const [isCollectingData, setIsCollectingData] = useState(false)
  const [dataCollectionStep, setDataCollectionStep] = useState<'name' | 'interest' | 'goal' | null>(null)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isReloading, setIsReloading] = useState(false)
  const [networkError, setNetworkError] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Buscar configurações do assistente
    const loadAssistantSettings = async () => {
      try {
        const settings = await DataService.getSettings()
        setAssistantSettings({
          enabled: settings.assistantEnabled ?? true,
          delay: settings.assistantDelay ?? 5000,
          welcomeMessage: settings.assistantWelcomeMessage || ""
        })
      } catch (error) {
        console.error("Erro ao carregar configurações do assistente:", error)
      }
    }

    loadAssistantSettings()
  }, [])

  useEffect(() => {
    // Mostrar o chat baseado nas configurações
    if (!assistantSettings.enabled) return

    const timer = setTimeout(() => {
      setIsVisible(true)
    }, assistantSettings.delay)

    return () => clearTimeout(timer)
  }, [assistantSettings])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Reset error state when user starts typing
  useEffect(() => {
    if (inputMessage && hasError) {
      setHasError(false)
      setErrorMessage("")
    }
  }, [inputMessage, hasError])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Função para detectar erros de rede
  const handleNetworkError = useCallback((error: any) => {
    console.error('Erro de rede detectado:', error)
    setNetworkError(true)
    setErrorMessage("Problema de conexão detectado. Verifique sua internet.")
    setHasError(true)
  }, [])

  // Função para reload do chat
  const reloadChat = useCallback(() => {
    setIsReloading(true)
    setHasError(false)
    setNetworkError(false)
    setErrorMessage("")
    setMessages([])
    setInputMessage("")
    setIsScheduling(false)
    setSchedulingStep(null)
    setIsCollectingData(false)
    setDataCollectionStep(null)
    setShowWhatsappButton(false)

    // Simular reload
    setTimeout(() => {
      setIsReloading(false)
      const reloadMessage: Message = {
        id: Date.now().toString(),
        text: "Chat reiniciado! Como posso ajudar você hoje? 😊",
        isUser: false,
        timestamp: new Date()
      }
      setMessages([reloadMessage])
    }, 1000)
  }, [])

  // Função para fechar modal (apenas minimizar)
  const closeModal = useCallback(() => {
    setIsMinimized(true)
  }, [])

  // Função para abrir modal
  const openModal = useCallback(() => {
    setIsMinimized(false)
    setHasError(false)
    setNetworkError(false)
  }, [])

  // Timeout para detectar travamentos
  const startTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      if (isLoading) {
        setHasError(true)
        setErrorMessage("O assistente parece estar demorando para responder. Tente recarregar.")
        setIsLoading(false)
      }
    }, 30000) // 30 segundos timeout
  }, [isLoading])

  const clearTimeoutRef = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const detectSchedulingIntent = (message: string): boolean => {
    const schedulingKeywords = [
      'agendar', 'marcar', 'aula', 'experimental', 'teste', 'avaliação',
      'quero', 'gostaria', 'preciso', 'vou', 'vamos', 'manhã', 'tarde',
      'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado', 'domingo',
      'amanhã', 'hoje', 'musculação', 'crossfit', 'spinning', 'pilates'
    ]
    return schedulingKeywords.some(keyword =>
      message.toLowerCase().includes(keyword)
    )
  }

  const startScheduling = () => {
    setIsScheduling(true)
    setSchedulingStep('smart')
    setShowWhatsappButton(false)

    const welcomeMessage: Message = {
      id: (Date.now() + 2).toString(),
      text: "Beleza! Vamos agendar sua aula? 😊\n\nVocê pode falar naturalmente, por exemplo:\n• 'Quero agendar musculação para amanhã às 14h'\n• 'Agende uma aula para sábado de manhã'\n• 'Quero marcar crossfit na próxima segunda'\n\nO que você prefere?",
      isUser: false,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, welcomeMessage])
  }

  const startDataCollection = () => {
    setIsCollectingData(true)
    setDataCollectionStep('name')
    setShowWhatsappButton(false)

    const welcomeMessage: Message = {
      id: (Date.now() + 13).toString(),
      text: "Oi! Que bom ter você aqui! 😊\n\nAntes de começarmos, me conta qual seu nome?",
      isUser: false,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, welcomeMessage])
  }

  const handleDataCollectionResponse = async (userMessage: string) => {
    const message = userMessage.toLowerCase().trim()

    // Verificar se usuário quer pular
    if (message.includes('pular') || message.includes('depois') || message.includes('não quero')) {
      setIsCollectingData(false)
      setDataCollectionStep(null)
      setUserProfile({ name: '', interest: '', goal: '' })

      const skipMessage: Message = {
        id: (Date.now() + 14).toString(),
        text: "Sem problema! Podemos conversar assim mesmo. 😉\n\nEm que posso te ajudar hoje?",
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, skipMessage])
      return
    }

    switch (dataCollectionStep) {
      case 'name':
        setUserProfile(prev => ({ ...prev, name: userMessage }))
        setDataCollectionStep('interest')

        const interestMessage: Message = {
          id: (Date.now() + 15).toString(),
          text: `Prazer em te conhecer, ${userMessage}! 👋\n\nMe conta uma coisa: você já pratica algum tipo de atividade física ou está começando agora?`,
          isUser: false,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, interestMessage])
        break

      case 'interest':
        setUserProfile(prev => ({ ...prev, interest: userMessage }))
        setDataCollectionStep('goal')

        const goalMessage: Message = {
          id: (Date.now() + 16).toString(),
          text: "Que legal! 🎯\n\nE qual seu objetivo principal? Por exemplo:\n• Emagrecimento\n• Ganho de massa muscular\n• Condicionamento físico\n• Melhora da saúde\n• Ou outro objetivo específico?",
          isUser: false,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, goalMessage])
        break

      case 'goal':
        setUserProfile(prev => ({ ...prev, goal: userMessage }))

        // Finalizar coleta de dados
        setIsCollectingData(false)
        setDataCollectionStep(null)

        const finalMessage: Message = {
          id: (Date.now() + 17).toString(),
          text: `Perfeito! Anotei aqui: ${userProfile.name} quer ${userProfile.goal}. 📝\n\nAgora posso te ajudar melhor com informações personalizadas! O que você gostaria de saber sobre nossos serviços?`,
          isUser: false,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, finalMessage])
        break
    }
  }

  const handleSchedulingResponse = async (userMessage: string) => {
    const message = userMessage.toLowerCase().trim()

    // Verificar se usuário quer cancelar
    if (message.includes('cancelar') || message.includes('não quero') || message.includes('depois')) {
      setIsScheduling(false)
      setSchedulingStep(null)
      setSchedulingData({ name: '', phone: '', date: '', time: '', classType: 'Musculação' })

      const cancelMessage: Message = {
        id: (Date.now() + 3).toString(),
        text: "Sem problema! Se mudar de ideia, é só falar comigo novamente. 😉",
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, cancelMessage])
      return
    }

    switch (schedulingStep) {
      case 'smart':
        // Deixe o backend processar a mensagem inteligente
        return

      case 'name':
        setSchedulingData(prev => ({ ...prev, name: userMessage }))
        setSchedulingStep('phone')

        const phoneMessage: Message = {
          id: (Date.now() + 4).toString(),
          text: `Prazer em te conhecer, ${userMessage}! 📱\n\nAgora me passa seu WhatsApp (com DDD, ex: 11999999999):`,
          isUser: false,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, phoneMessage])
        break

      case 'phone':
        // Validar telefone
        const cleanPhone = userMessage.replace(/\D/g, '')
        if (cleanPhone.length < 10 || cleanPhone.length > 11) {
          const errorMessage: Message = {
            id: (Date.now() + 5).toString(),
            text: "Hmm, esse telefone não parece válido. Pode me passar novamente? (ex: 11999999999)",
            isUser: false,
            timestamp: new Date()
          }
          setMessages(prev => [...prev, errorMessage])
          return
        }

        setSchedulingData(prev => ({ ...prev, phone: cleanPhone }))
        setSchedulingStep('datetime')

        const datetimeMessage: Message = {
          id: (Date.now() + 6).toString(),
          text: "Perfeito! 📅 Agora me diz qual dia e horário você prefere para a aula experimental:\n\n• Segunda a Sexta: 6h às 22h\n• Sábado: 7h às 19h\n• Domingo: 9h às 17h\n\nExemplo: 'Segunda às 19h' ou 'Sábado de manhã'",
          isUser: false,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, datetimeMessage])
        break

      case 'datetime':
        // Tentar extrair data e hora da mensagem
        const extractedDateTime = extractDateTime(userMessage)
        if (!extractedDateTime) {
          const retryMessage: Message = {
            id: (Date.now() + 7).toString(),
            text: "Não consegui entender direito o dia e horário. Pode me falar de novo? Por exemplo: 'Segunda às 19h' ou 'Sábado de manhã'",
            isUser: false,
            timestamp: new Date()
          }
          setMessages(prev => [...prev, retryMessage])
          return
        }

        setSchedulingData(prev => ({
          ...prev,
          date: extractedDateTime.date,
          time: extractedDateTime.time
        }))
        setSchedulingStep('confirm')

        const confirmMessage: Message = {
          id: (Date.now() + 8).toString(),
          text: `Show! Então fica assim:\n\n👤 ${schedulingData.name}\n📱 ${schedulingData.phone}\n📅 ${extractedDateTime.date}\n🕐 ${extractedDateTime.time}\n🏋️ Aula Experimental de ${schedulingData.classType}\n\nTudo certo? Responda 'sim' para confirmar ou 'não' para alterar.`,
          isUser: false,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, confirmMessage])
        break

      case 'confirm':
        if (message.includes('sim') || message.includes('confirmar') || message.includes('certo')) {
          await finalizeScheduling()
        } else {
          setSchedulingStep('name')
          const restartMessage: Message = {
            id: (Date.now() + 9).toString(),
            text: "Beleza, vamos refazer! Qual seu nome completo?",
            isUser: false,
            timestamp: new Date()
          }
          setMessages(prev => [...prev, restartMessage])
        }
        break
    }
  }

  const extractDateTime = (message: string): { date: string, time: string } | null => {
    const lowerMessage = message.toLowerCase()

    // Dias da semana
    const days = {
      'segunda': 'Segunda-feira',
      'terça': 'Terça-feira',
      'quarta': 'Quarta-feira',
      'quinta': 'Quinta-feira',
      'sexta': 'Sexta-feira',
      'sábado': 'Sábado',
      'domingo': 'Domingo'
    }

    let selectedDay = ''
    let selectedTime = ''

    // Procurar dia da semana
    for (const [key, value] of Object.entries(days)) {
      if (lowerMessage.includes(key)) {
        selectedDay = value
        break
      }
    }

    if (!selectedDay) return null

    // Procurar horário
    const timeMatch = message.match(/(\d{1,2})[h:](\d{2})?|(\d{1,2})h/)
    if (timeMatch) {
      const hour = timeMatch[1] || timeMatch[3]
      selectedTime = `${hour}:00`
    } else if (lowerMessage.includes('manhã') || lowerMessage.includes('manha')) {
      selectedTime = '09:00'
    } else if (lowerMessage.includes('tarde')) {
      selectedTime = '14:00'
    } else if (lowerMessage.includes('noite')) {
      selectedTime = '19:00'
    } else {
      return null
    }

    return { date: selectedDay, time: selectedTime }
  }

  const finalizeScheduling = async () => {
    try {
      // Formatar data corretamente para a API
      const dateMap: { [key: string]: string } = {
        'Segunda-feira': 'monday',
        'Terça-feira': 'tuesday',
        'Quarta-feira': 'wednesday',
        'Quinta-feira': 'thursday',
        'Sexta-feira': 'friday',
        'Sábado': 'saturday',
        'Domingo': 'sunday'
      }

      // Calcular próxima data para o dia da semana selecionado
      const today = new Date()
      const targetDay = dateMap[schedulingData.date] || 'monday'
      const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      const targetDayIndex = daysOfWeek.indexOf(targetDay)
      const currentDayIndex = today.getDay()

      let daysToAdd = targetDayIndex - currentDayIndex
      if (daysToAdd <= 0) {
        daysToAdd += 7 // Próxima semana
      }

      const appointmentDate = new Date(today)
      appointmentDate.setDate(today.getDate() + daysToAdd)

      // Formatar data como YYYY-MM-DD
      const formattedDate = appointmentDate.toISOString().split('T')[0]

      const appointmentData = {
        name: schedulingData.name,
        phone: schedulingData.phone,
        email: `experimental_${Date.now()}@temp.com`, // Email temporário para aulas experimentais
        classType: schedulingData.classType,
        scheduledDate: formattedDate,
        scheduledTime: schedulingData.time,
        notes: `Aula experimental agendada via chat - ${schedulingData.name} - ${schedulingData.phone}`
      }

      console.log('Enviando dados de agendamento:', appointmentData)

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData)
      })

      const responseData = await response.json()
      console.log('Resposta da API:', responseData)

      if (response.ok) {
        const successMessage: Message = {
          id: (Date.now() + 10).toString(),
          text: `🎉 Pronto! Sua aula experimental foi agendada com sucesso!\n\n📅 ${schedulingData.date} às ${schedulingData.time}\n🏋️ Aula Experimental de ${schedulingData.classType}\n\nVocê receberá uma confirmação por WhatsApp em breve. Qualquer dúvida, é só falar comigo! 😉`,
          isUser: false,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, successMessage])

        // Reset scheduling state
        setIsScheduling(false)
        setSchedulingStep(null)
        setSchedulingData({ name: '', phone: '', date: '', time: '', classType: 'Musculação' })
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 11).toString(),
          text: `Ops! ${responseData.error || 'Houve um problema ao agendar'}. Vamos tentar novamente? Ou prefere falar diretamente no WhatsApp?`,
          isUser: false,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorMessage])
        setShowWhatsappButton(true)
        setWhatsappContext("Problema ao agendar aula experimental")
      }
    } catch (error) {
      console.error('Erro no agendamento:', error)
      const errorMessage: Message = {
        id: (Date.now() + 11).toString(),
        text: "Ops! Houve um problema ao agendar. Vamos tentar novamente? Ou prefere falar diretamente no WhatsApp?",
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
      setShowWhatsappButton(true)
      setWhatsappContext("Problema ao agendar aula experimental")
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const newInputMessage = inputMessage
    setInputMessage("")
    setIsLoading(true)
    setShowWhatsappButton(false) // Ocultar botão do WhatsApp ao enviar nova mensagem
    setHasError(false)
    setNetworkError(false)
    startTimeout() // Iniciar timeout para detectar travamentos

    // Verificar se é intenção de agendamento e não estamos já agendando
    if (!isScheduling && detectSchedulingIntent(newInputMessage)) {
      setIsLoading(false)
      startScheduling()
      return
    }

    // Se estamos em modo de agendamento, processar resposta do agendamento
    if (isScheduling) {
      setIsLoading(false)
      await handleSchedulingResponse(newInputMessage)
      return
    }

    // Se estamos coletando dados do usuário, processar resposta da coleta
    if (isCollectingData) {
      setIsLoading(false)
      await handleDataCollectionResponse(newInputMessage)
      return
    }

    // Se é a primeira mensagem e não temos dados do usuário, iniciar coleta
    if (messages.length === 0 && !isAuthenticated && !userProfile.name) {
      setIsLoading(false)
      startDataCollection()
      return
    }

    try {
      // Converter histórico local para formato OpenAI + nova mensagem
      const openaiMessages = messages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text
      })).concat({ role: 'user', content: newInputMessage })

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: openaiMessages })
      })

      if (response.ok) {
        const data = await response.json()
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          isUser: false,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiMessage])

        // Verificar se a resposta sugere WhatsApp ou se houve erro na API
        const responseText = data.response.toLowerCase()
        const whatsappKeywords = [
          'whatsapp', 'falar direto', 'conversar melhor', 'contato', 'te passo o contato',
          'erro', 'problema', 'não consegui', 'não foi possível', 'tente novamente',
          'ligue', 'telefone', 'chame', 'contate', 'suporte', 'ajuda especializada'
        ]
        const shouldShowWhatsapp = whatsappKeywords.some(keyword => responseText.includes(keyword))

        // Mostrar WhatsApp também se for sobre tópicos complexos ou específicos
        const complexTopics = [
          'matricular', 'matrícula', 'cancelar', 'cancelamento', 'problema', 'reclamação',
          'queixa', 'reembolso', 'pagamento', 'financeiro', 'contrato', 'documento',
          'certificado', 'diploma', 'transferência', 'mudança', 'personal trainer',
          'treinador', 'nutricionista', 'fisioterapeuta', 'médico', 'exame', 'lesão'
        ]
        const isComplexTopic = complexTopics.some(topic => responseText.includes(topic))

        // Análise contextual mais inteligente
        const conversationHistory = messages.map(msg => msg.text).join(' ').toLowerCase()
        const hasRepeatedErrors = (conversationHistory.match(/erro|problema|não consegui/g) || []).length > 2
        const hasComplexRequest = conversationHistory.includes('quero') && (
          conversationHistory.includes('matricular') ||
          conversationHistory.includes('cancelar') ||
          conversationHistory.includes('problema')
        )

        // Personalizar mensagem do WhatsApp baseada no contexto
        let whatsappMessage = `Olá! Gostaria de mais informações sobre a ${settings?.name || 'Gym Starter'}`

        if (conversationHistory.includes('agendar') || conversationHistory.includes('marcar')) {
          whatsappMessage = "Olá! Gostaria de agendar uma aula experimental"
        } else if (conversationHistory.includes('matricular') || conversationHistory.includes('plano')) {
          whatsappMessage = "Olá! Gostaria de saber mais sobre os planos e matrícula"
        } else if (conversationHistory.includes('personal') || conversationHistory.includes('treinador')) {
          whatsappMessage = "Olá! Gostaria de falar com um personal trainer"
        } else if (conversationHistory.includes('horário') || conversationHistory.includes('funcionamento')) {
          whatsappMessage = "Olá! Gostaria de saber sobre horários de funcionamento"
        } else if (conversationHistory.includes('problema') || conversationHistory.includes('erro')) {
          whatsappMessage = "Olá! Preciso de ajuda com um problema técnico"
        }

        // Adicionar nome se disponível
        if (isAuthenticated && user?.name) {
          whatsappMessage += ` - Sou ${user.name}`
        }

        setWhatsappContext(whatsappMessage)

        if (shouldShowWhatsapp || isComplexTopic || hasRepeatedErrors || hasComplexRequest) {
          // Extrair contexto inteligente da conversa
          const conversationHistory = messages.map(msg => msg.text).join(' ').toLowerCase()
          let context = "Olá, tenho uma dúvida sobre a academia"

          // Analisar intenção baseada no histórico da conversa
          if (conversationHistory.includes('matricular') || conversationHistory.includes('plano') || conversationHistory.includes('preço')) {
            context = "Olá, gostaria de saber mais sobre os planos e preços da academia"
          } else if (conversationHistory.includes('personal') || conversationHistory.includes('treinador') || conversationHistory.includes('profissional')) {
            context = "Olá, gostaria de falar com um personal trainer"
          } else if (conversationHistory.includes('experimental') || conversationHistory.includes('teste') || conversationHistory.includes('avaliação')) {
            context = "Olá, gostaria de agendar uma aula experimental"
          } else if (conversationHistory.includes('horário') || conversationHistory.includes('funcionamento')) {
            context = "Olá, tenho dúvidas sobre horários de funcionamento"
          } else if (conversationHistory.includes('cancelar') || conversationHistory.includes('cancelamento')) {
            context = "Olá, preciso de ajuda com cancelamento"
          } else if (conversationHistory.includes('musculação') || conversationHistory.includes('emagrecimento') || conversationHistory.includes('condicionamento')) {
            const lastUserMessage = messages[messages.length - 1]?.text || ""
            if (lastUserMessage.includes('musculação')) {
              context = "Olá, tenho interesse em musculação e gostaria de mais informações"
            } else if (lastUserMessage.includes('emagrecimento') || lastUserMessage.includes('emagrecer')) {
              context = "Olá, tenho interesse em emagrecimento e gostaria de mais informações"
            } else if (lastUserMessage.includes('condicionamento')) {
              context = "Olá, tenho interesse em condicionamento físico e gostaria de mais informações"
            }
          }

          // Adicionar nome se disponível
          if (isAuthenticated && user?.name) {
            context += ` - Sou ${user.name}`
          }

          setWhatsappContext(context)
          setShowWhatsappButton(true)
        } else {
          setShowWhatsappButton(false)
        }
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "Desculpe, não consegui responder agora. Tente novamente ou fale no WhatsApp.",
          isUser: false,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorMessage])
        setHasError(true)
        setErrorMessage("Erro na resposta do assistente.")
      }
    } catch (error) {
      console.error('Erro na comunicação com API:', error)
      handleNetworkError(error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Erro de conexão. Verifique sua internet ou fale no WhatsApp.",
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    }

    setIsLoading(false)
    clearTimeoutRef() // Limpar timeout quando terminar
  }

  // Componente SVG do ícone oficial do WhatsApp
  const WhatsAppIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
    </svg>
  )

  const handleWhatsAppClick = () => {
    // Buscar número do WhatsApp das configurações
    const whatsappNumber = '5511999999999' // fallback
    const encodedMessage = encodeURIComponent(`Olá, ${whatsappContext || 'gostaria de mais informações'}.`)
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`

    try {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer")
    } catch (error) {
      console.error('Erro ao abrir WhatsApp:', error)
      // Fallback: tentar abrir sem parâmetros de janela
      window.open(whatsappUrl, "_blank")
    }

    setShowWhatsappButton(false) // Ocultar botão após clicar
  }

  const toggleMinimize = () => {
    if (isMinimized) {
      openModal()
    } else {
      setIsMinimized(true)
    }
  }

  // Função para fechar (apenas minimizar, nunca remover completamente)
  const handleClose = () => {
    setIsMinimized(true)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      {isMinimized ? (
        <Button
          onClick={toggleMinimize}
          className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-red-accent hover:bg-red-accent/90 shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-accent/50"
          aria-label="Abrir chat do assistente"
        >
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </Button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl border max-w-[calc(100vw-2rem)] w-full sm:max-w-sm max-h-[70vh] sm:max-h-96 flex flex-col animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-accent rounded-full flex items-center justify-center">
                <MessageCircle className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-sm">Assistente AI</p>
                <p className="text-xs text-muted-foreground">
                  {hasError ? "Erro detectado" : networkError ? "Offline" : "Online"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {hasError && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={reloadChat}
                  disabled={isReloading}
                  className="h-6 w-6 p-0 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                  aria-label="Recarregar chat"
                >
                  <RefreshCw className={`h-4 w-4 ${isReloading ? 'animate-spin' : ''}`} />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-6 w-6 p-0 hover:bg-gray-100"
                aria-label="Minimizar chat"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Error Banner */}
          {hasError && (
            <div className="px-4 py-2 bg-red-50 border-b border-red-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <p className="text-sm text-red-800 font-medium">{errorMessage}</p>
                <Button
                  onClick={reloadChat}
                  disabled={isReloading}
                  size="sm"
                  variant="outline"
                  className="ml-auto text-xs h-6"
                >
                  {isReloading ? (
                    <>
                      <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                      Recarregando...
                    </>
                  ) : (
                    'Recarregar'
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 p-3 sm:p-4 overflow-y-auto max-h-48 sm:max-h-64 space-y-2">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-4">
                <p className="text-sm">
                  {assistantSettings.welcomeMessage ||
                    (isAuthenticated
                      ? `Olá ${user?.name || 'usuário'}! Como posso ajudar você hoje?`
                      : "Olá! Como posso ajudar com sua dúvida sobre a academia?"
                    )
                  }
                </p>
                <p className="text-xs mt-1">
                  {isAuthenticated
                    ? "Pergunte sobre planos, horários ou dicas personalizadas!"
                    : "Pergunte sobre planos, horários ou dicas de treino!"
                  }
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs px-3 py-2 rounded-lg ${msg.isUser ? 'bg-red-accent text-white' : 'bg-muted'}`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.isUser ? 'text-red-accent/80' : 'text-muted-foreground'}`}>
                      {msg.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted px-3 py-2 rounded-lg animate-pulse">
                  <p className="text-sm">Pensando...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Data Collection Indicator */}
          {isCollectingData && (
            <div className="px-4 py-2 border-t bg-purple-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-purple-700 font-medium">Conhecendo você melhor</span>
                </div>
                <Button
                  onClick={() => {
                    setIsCollectingData(false)
                    setDataCollectionStep(null)
                    setUserProfile({ name: '', interest: '', goal: '' })
                    const skipMessage: Message = {
                      id: (Date.now() + 18).toString(),
                      text: "Tudo bem! Podemos conversar assim mesmo. 😉\n\nEm que posso te ajudar?",
                      isUser: false,
                      timestamp: new Date()
                    }
                    setMessages(prev => [...prev, skipMessage])
                  }}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Pular
                </Button>
              </div>
            </div>
          )}

          {/* Scheduling Indicator */}
          {isScheduling && (
            <div className="px-4 py-2 border-t bg-blue-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-blue-700 font-medium">Agendando aula experimental</span>
                </div>
                <Button
                  onClick={() => {
                    setIsScheduling(false)
                    setSchedulingStep(null)
                    setSchedulingData({ name: '', phone: '', date: '', time: '', classType: 'Musculação' })
                    const cancelMessage: Message = {
                      id: (Date.now() + 12).toString(),
                      text: "Agendamento cancelado! Se quiser tentar novamente, é só falar comigo. 😉",
                      isUser: false,
                      timestamp: new Date()
                    }
                    setMessages(prev => [...prev, cancelMessage])
                  }}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {/* WhatsApp Button */}
          {showWhatsappButton && !isScheduling && (
            <div className="px-4 py-3 border-t bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="text-center mb-2">
                <p className="text-sm text-green-800 font-medium">
                  💬 Precisa de ajuda personalizada?
                </p>
                <p className="text-xs text-green-700">
                  Fale diretamente com nossa equipe!
                </p>
              </div>
              <Button
                onClick={handleWhatsAppClick}
                className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform hover:scale-[1.02] shadow-md"
                size="sm"
                aria-label="Abrir conversa no WhatsApp"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Conversar no WhatsApp
                <span className="text-xs opacity-90">• Online agora</span>
              </Button>
            </div>
          )}

          {/* Input */}
          <div className="p-3 sm:p-4 border-t flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
              placeholder={hasError ? "Chat com erro - tente recarregar" : "Digite sua mensagem..."}
              className="flex-1 focus:ring-2 focus:ring-red-accent/50"
              disabled={isLoading || hasError}
              aria-label="Digite sua mensagem para o assistente"
            />
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading || hasError}
              size="sm"
              className="h-10 w-10 p-0 bg-red-accent hover:bg-red-accent/90 focus:outline-none focus:ring-2 focus:ring-red-accent/50"
              aria-label="Enviar mensagem"
            >
              <Send className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleWhatsAppClick}
              variant="outline"
              size="sm"
              className="h-10 w-10 p-0 border-green-200 hover:bg-green-50 hover:border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
              aria-label="Abrir WhatsApp"
            >
              <WhatsAppIcon className="h-4 w-4 text-green-600" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
