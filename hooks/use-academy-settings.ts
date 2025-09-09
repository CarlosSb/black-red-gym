"use client"

import { useState, useEffect } from "react"

interface AcademySettings {
  id: string
  name: string
  description: string
  phone: string
  email: string
  address: string
  whatsapp?: string
  hours: {
    weekdays: { open: string; close: string }
    saturday: { open: string; close: string }
    sunday: { open: string; close: string }
  }
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  notifications: {
    newMessages: boolean
    newMembers: boolean
    payments: boolean
    weeklyReports: boolean
  }
  logo?: string
  about?: string
  heroTitle?: string
  heroSubtitle?: string
  heroImage?: string
  features: {
    title: string
    description: string
    items: Array<{
      title: string
      description: string
      icon: string
    }>
  }
  metrics: {
    activeMembers: number
    personalTrainers: number
    operatingHours: string
    foundedYear: number
  }
}

export function useAcademySettings() {
  const [settings, setSettings] = useState<AcademySettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/settings")

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.settings) {
          setSettings(data.settings)
        } else {
          setError("Erro ao carregar configurações")
        }
      } else {
        setError("Erro na resposta da API")
      }
    } catch (err) {
      setError("Erro de conexão")
      console.error("Erro ao carregar configurações:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Valores padrão caso as configurações não estejam carregadas
  const defaultSettings: AcademySettings = {
    id: "default",
    name: "BlackRed Fix",
    description: "Academia completa com musculação, crossfit, pilates e aulas funcionais. Equipamentos de última geração, profissionais qualificados e ambiente motivador para alcançar seus objetivos fitness.",
    phone: "(85) 99999-9999",
    email: "contato@blackredfix.com.br",
    address: "Av. Santos Dumont, 1515 - Aldeota, Fortaleza - CE, 60150-161",
    whatsapp: "5585999999999",
    hours: {
      weekdays: { open: "05:30", close: "23:00" },
      saturday: { open: "07:00", close: "20:00" },
      sunday: { open: "08:00", close: "18:00" }
    },
    colors: {
      primary: "#DC2626",
      secondary: "#000000",
      accent: "#DC2626"
    },
    notifications: {
      newMessages: true,
      newMembers: true,
      payments: true,
      weeklyReports: true
    },
    logo: undefined,
    about: "Fundada em 2020, a BlackRed Fix nasceu com a missão de transformar vidas através do fitness. Somos uma academia completa que oferece musculação, crossfit, pilates, aulas funcionais e muito mais. Nossa equipe de profissionais altamente qualificados está preparada para acompanhar você em toda sua jornada fitness, desde o primeiro treino até a conquista dos seus objetivos mais ambiciosos. Venha fazer parte da nossa família e descubra o que é treinar com excelência!",
    heroTitle: "TRANSFORME SUA VIDA ATRAVÉS DO FITNESS",
    heroSubtitle: "Academia Completa em Fortaleza",
    heroImage: undefined,
    features: {
      title: "Por que escolher a BlackRed Fix?",
      description: "Somos referência em fitness em Fortaleza, oferecendo uma experiência completa e diferenciada",
      items: [
        {
          title: "Equipamentos Premium",
          description: "Mais de 200 equipamentos das melhores marcas do mercado fitness",
          icon: "Dumbbell"
        },
        {
          title: "Profissionais Qualificados",
          description: "Equipe de 15 personal trainers certificados e especializados",
          icon: "Users"
        },
        {
          title: "Horário Estendido",
          description: "Funcionamento das 5:30h às 23:00h de segunda a sexta-feira",
          icon: "Clock"
        },
        {
          title: "Modalidades Completas",
          description: "Musculação, CrossFit, Pilates, Funcional, Spinning e muito mais",
          icon: "Trophy"
        }
      ]
    },
    metrics: {
      activeMembers: 850,
      personalTrainers: 15,
      operatingHours: "18h/dia",
      foundedYear: 2020
    }
  }

  return {
    settings: settings || defaultSettings,
    isLoading,
    error,
    refetch: loadSettings
  }
}