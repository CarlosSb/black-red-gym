// Client-side data service using API routes

// Type definitions for the application
export type PlanData = {
  id: string
  name: string
  price: number
  description: string
  features: string[]
  activeMembers: number
  monthlyRevenue: number
  status: "active" | "inactive"
  popular?: boolean
  createdAt: string
  updatedAt: string
}

export type MessageData = {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  date: string
  status: "read" | "unread"
  priority: "low" | "medium" | "high"
  response?: string
  respondedAt?: string
}

export type AcademySettingsData = {
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
  features?: {
    title: string
    description: string
    items: Array<{
      icon: string
      title: string
      description: string
    }>
  }
  metrics?: {
    activeMembers: number
    personalTrainers: number
    operatingHours: string
    foundedYear: number
  }
}

class DataService {
  // Plans CRUD
  static async getPlans(): Promise<PlanData[]> {
    try {
      const response = await fetch('/api/plans')
      if (!response.ok) {
        throw new Error('Failed to fetch plans')
      }
      const data = await response.json()
      return data.plans || []
    } catch (error) {
      console.error("Error reading plans:", error)
      return []
    }
  }

  static async createPlan(planData: Omit<PlanData, "id" | "createdAt" | "updatedAt">): Promise<PlanData> {
    try {
      const response = await fetch('/api/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(planData),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create plan')
      }
      
      return await response.json()
    } catch (error) {
      console.error("Error creating plan:", error)
      throw error
    }
  }

  static async updatePlan(id: string, updates: Partial<PlanData>): Promise<PlanData | null> {
    try {
      const response = await fetch(`/api/plans/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update plan')
      }
      
      return await response.json()
    } catch (error) {
      console.error("Error updating plan:", error)
      return null
    }
  }

  static async deletePlan(id: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/plans/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete plan')
      }
      
      return true
    } catch (error) {
      console.error("Error deleting plan:", error)
      return false
    }
  }

  // Messages CRUD
  static async getMessages(): Promise<MessageData[]> {
    try {
      const response = await fetch('/api/messages')
      if (!response.ok) {
        throw new Error('Failed to fetch messages')
      }
      return await response.json()
    } catch (error) {
      console.error("Error reading messages:", error)
      return []
    }
  }

  static async createMessage(messageData: Omit<MessageData, "id" | "date">): Promise<MessageData> {
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create message')
      }
      
      return await response.json()
    } catch (error) {
      console.error("Error creating message:", error)
      throw error
    }
  }

  static async updateMessage(id: string, updates: Partial<MessageData>): Promise<MessageData | null> {
    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update message')
      }
      
      return await response.json()
    } catch (error) {
      console.error("Error updating message:", error)
      return null
    }
  }

  static async deleteMessage(id: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete message')
      }
      
      return true
    } catch (error) {
      console.error("Error deleting message:", error)
      return false
    }
  }

  // Settings CRUD
  static async getSettings(): Promise<AcademySettingsData> {
    try {
      const response = await fetch('/api/settings')
      if (!response.ok) {
        throw new Error('Failed to fetch settings')
      }
      const data = await response.json()
      return data.settings
    } catch (error) {
      console.error("Error reading settings:", error)
      return this.getDefaultSettings()
    }
  }

  private static getDefaultSettings(): AcademySettingsData {
    return {
      name: "Black Red Academia",
      description:
        "Academia moderna com equipamentos de última geração, personal trainers qualificados e ambiente motivador.",
      phone: "(11) 99999-9999",
      email: "contato@blackred.com.br",
      address: "Rua das Academias, 123 - Centro",
      whatsapp: "5511999999999",
      hours: {
        weekdays: { open: "05:00", close: "23:00" },
        saturday: { open: "06:00", close: "20:00" },
        sunday: { open: "08:00", close: "18:00" },
      },
      colors: {
        primary: "#DC2626",
        secondary: "#000000",
      },
      notifications: {
        newMessages: true,
        newMembers: true,
        payments: true,
        weeklyReports: false,
      },
      logo: "/placeholder-logo.png",
      about: "Fundada em 2024, a Black Red nasceu com o propósito de revolucionar o conceito de academia. Combinamos tecnologia de ponta com metodologias comprovadas para oferecer uma experiência única de treino. Nossa equipe de profissionais qualificados está sempre pronta para te ajudar a alcançar seus objetivos, seja ganho de massa muscular, perda de peso ou melhoria do condicionamento físico.",
      heroTitle: "TRANSFORME SEU CORPO",
      heroSubtitle: "Nova Academia",
      heroImage: "/modern-gym-interior-with-red-and-black-equipment.jpg",
      features: {
        title: "Por que escolher a Black Red?",
        description: "Oferecemos tudo que você precisa para alcançar seus objetivos fitness",
        items: [
          {
            icon: "Dumbbell",
            title: "Equipamentos Modernos",
            description: "Equipamentos de última geração para todos os tipos de treino"
          },
          {
            icon: "Users",
            title: "Personal Trainers",
            description: "Profissionais qualificados para te orientar em cada exercício"
          },
          {
            icon: "Clock",
            title: "Horário Flexível",
            description: "Aberto das 05:00 às 23:00 para se adequar à sua rotina"
          },
          {
            icon: "Trophy",
            title: "Resultados Garantidos",
            description: "Metodologia comprovada para alcançar seus objetivos"
          }
        ]
      },
      metrics: {
        activeMembers: 500,
        personalTrainers: 15,
        operatingHours: "24/7",
        foundedYear: 2024
      }
    }
  }

  static async updateSettings(updates: Partial<AcademySettingsData>): Promise<AcademySettingsData> {
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Failed to update settings')
      }

      const data = await response.json()
      return data.settings
    } catch (error) {
      console.error("Error updating settings:", error)
      throw error
    }
  }
}

export default DataService
