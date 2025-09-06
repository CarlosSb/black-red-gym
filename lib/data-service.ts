import { prisma } from './prisma'
import { Plan, Message, AcademySettings, PlanStatus, MessageStatus, Priority } from '@prisma/client'

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
}

class DataService {
  // Plans CRUD
  static async getPlans(): Promise<PlanData[]> {
    try {
      const plans = await prisma.plan.findMany({
        orderBy: { createdAt: 'asc' }
      })
      
      // If no plans exist, create default ones
      if (plans.length === 0) {
        await this.initializeDefaultPlans()
        return await this.getPlans()
      }

      return plans.map(plan => ({
        id: plan.id,
        name: plan.name,
        price: plan.price,
        description: plan.description,
        features: plan.features,
        activeMembers: plan.activeMembers,
        monthlyRevenue: plan.monthlyRevenue,
        status: plan.status.toLowerCase() as "active" | "inactive",
        popular: plan.popular,
        createdAt: plan.createdAt.toISOString(),
        updatedAt: plan.updatedAt.toISOString(),
      }))
    } catch (error) {
      console.error("Error reading plans:", error)
      return []
    }
  }

  private static async initializeDefaultPlans(): Promise<void> {
    const defaultPlans = [
      {
        name: "Básico",
        price: 89,
        description: "Ideal para iniciantes",
        features: ["Acesso à musculação", "Avaliação física inicial", "Horário comercial"],
        activeMembers: 156,
        monthlyRevenue: 13884,
        status: "ACTIVE" as PlanStatus,
        popular: false,
      },
      {
        name: "Premium",
        price: 149,
        description: "Para quem quer mais resultados",
        features: ["Tudo do plano Básico", "Aulas em grupo", "Acesso 24h", "2 sessões de personal"],
        activeMembers: 243,
        monthlyRevenue: 36207,
        status: "ACTIVE" as PlanStatus,
        popular: true,
      },
      {
        name: "VIP",
        price: 249,
        description: "Experiência completa",
        features: ["Tudo do plano Premium", "Personal trainer dedicado", "Plano nutricional", "Área VIP exclusiva"],
        activeMembers: 88,
        monthlyRevenue: 21912,
        status: "ACTIVE" as PlanStatus,
        popular: false,
      },
    ]

    await prisma.plan.createMany({
      data: defaultPlans
    })
  }

  static async createPlan(planData: Omit<PlanData, "id" | "createdAt" | "updatedAt">): Promise<PlanData> {
    try {
      const newPlan = await prisma.plan.create({
        data: {
          name: planData.name,
          price: planData.price,
          description: planData.description,
          features: planData.features,
          activeMembers: planData.activeMembers,
          monthlyRevenue: planData.monthlyRevenue,
          status: planData.status.toUpperCase() as PlanStatus,
          popular: planData.popular || false,
        }
      })

      return {
        id: newPlan.id,
        name: newPlan.name,
        price: newPlan.price,
        description: newPlan.description,
        features: newPlan.features,
        activeMembers: newPlan.activeMembers,
        monthlyRevenue: newPlan.monthlyRevenue,
        status: newPlan.status.toLowerCase() as "active" | "inactive",
        popular: newPlan.popular,
        createdAt: newPlan.createdAt.toISOString(),
        updatedAt: newPlan.updatedAt.toISOString(),
      }
    } catch (error) {
      console.error("Error creating plan:", error)
      throw error
    }
  }

  static async updatePlan(id: string, updates: Partial<PlanData>): Promise<PlanData | null> {
    try {
      const updateData: any = { ...updates }
      if (updates.status) {
        updateData.status = updates.status.toUpperCase() as PlanStatus
      }

      const updatedPlan = await prisma.plan.update({
        where: { id },
        data: updateData
      })

      return {
        id: updatedPlan.id,
        name: updatedPlan.name,
        price: updatedPlan.price,
        description: updatedPlan.description,
        features: updatedPlan.features,
        activeMembers: updatedPlan.activeMembers,
        monthlyRevenue: updatedPlan.monthlyRevenue,
        status: updatedPlan.status.toLowerCase() as "active" | "inactive",
        popular: updatedPlan.popular,
        createdAt: updatedPlan.createdAt.toISOString(),
        updatedAt: updatedPlan.updatedAt.toISOString(),
      }
    } catch (error) {
      console.error("Error updating plan:", error)
      return null
    }
  }

  static async deletePlan(id: string): Promise<boolean> {
    try {
      await prisma.plan.delete({
        where: { id }
      })
      return true
    } catch (error) {
      console.error("Error deleting plan:", error)
      return false
    }
  }

  // Messages CRUD
  static async getMessages(): Promise<MessageData[]> {
    try {
      const messages = await prisma.message.findMany({
        orderBy: { date: 'desc' }
      })

      return messages.map(message => ({
        id: message.id,
        name: message.name,
        email: message.email,
        phone: message.phone,
        subject: message.subject,
        message: message.message,
        date: message.date.toISOString(),
        status: message.status.toLowerCase() as "read" | "unread",
        priority: message.priority.toLowerCase() as "low" | "medium" | "high",
        response: message.response || undefined,
        respondedAt: message.respondedAt?.toISOString() || undefined,
      }))
    } catch (error) {
      console.error("Error reading messages:", error)
      return []
    }
  }

  static async createMessage(messageData: Omit<MessageData, "id" | "date">): Promise<MessageData> {
    try {
      const newMessage = await prisma.message.create({
        data: {
          name: messageData.name,
          email: messageData.email,
          phone: messageData.phone,
          subject: messageData.subject,
          message: messageData.message,
          status: messageData.status.toUpperCase() as MessageStatus,
          priority: messageData.priority.toUpperCase() as Priority,
          response: messageData.response,
          respondedAt: messageData.respondedAt ? new Date(messageData.respondedAt) : null,
        }
      })

      return {
        id: newMessage.id,
        name: newMessage.name,
        email: newMessage.email,
        phone: newMessage.phone,
        subject: newMessage.subject,
        message: newMessage.message,
        date: newMessage.date.toISOString(),
        status: newMessage.status.toLowerCase() as "read" | "unread",
        priority: newMessage.priority.toLowerCase() as "low" | "medium" | "high",
        response: newMessage.response || undefined,
        respondedAt: newMessage.respondedAt?.toISOString() || undefined,
      }
    } catch (error) {
      console.error("Error creating message:", error)
      throw error
    }
  }

  static async updateMessage(id: string, updates: Partial<MessageData>): Promise<MessageData | null> {
    try {
      const updateData: any = { ...updates }
      if (updates.status) {
        updateData.status = updates.status.toUpperCase() as MessageStatus
      }
      if (updates.priority) {
        updateData.priority = updates.priority.toUpperCase() as Priority
      }
      if (updates.respondedAt) {
        updateData.respondedAt = new Date(updates.respondedAt)
      }

      const updatedMessage = await prisma.message.update({
        where: { id },
        data: updateData
      })

      return {
        id: updatedMessage.id,
        name: updatedMessage.name,
        email: updatedMessage.email,
        phone: updatedMessage.phone,
        subject: updatedMessage.subject,
        message: updatedMessage.message,
        date: updatedMessage.date.toISOString(),
        status: updatedMessage.status.toLowerCase() as "read" | "unread",
        priority: updatedMessage.priority.toLowerCase() as "low" | "medium" | "high",
        response: updatedMessage.response || undefined,
        respondedAt: updatedMessage.respondedAt?.toISOString() || undefined,
      }
    } catch (error) {
      console.error("Error updating message:", error)
      return null
    }
  }

  static async deleteMessage(id: string): Promise<boolean> {
    try {
      await prisma.message.delete({
        where: { id }
      })
      return true
    } catch (error) {
      console.error("Error deleting message:", error)
      return false
    }
  }

  // Settings CRUD
  static async getSettings(): Promise<AcademySettingsData> {
    try {
      let settings = await prisma.academySettings.findFirst({
        orderBy: { createdAt: 'desc' }
      })

      // If no settings exist, create default ones
      if (!settings) {
        settings = await this.initializeDefaultSettings()
      }

      return {
        name: settings.name,
        description: settings.description,
        phone: settings.phone,
        email: settings.email,
        address: settings.address,
        hours: settings.hours as any,
        colors: settings.colors as any,
        notifications: settings.notifications as any,
      }
    } catch (error) {
      console.error("Error reading settings:", error)
      return this.getDefaultSettings()
    }
  }

  private static async initializeDefaultSettings(): Promise<AcademySettings> {
    const defaultSettings = this.getDefaultSettings()
    
    const settings = await prisma.academySettings.create({
      data: {
        name: defaultSettings.name,
        description: defaultSettings.description,
        phone: defaultSettings.phone,
        email: defaultSettings.email,
        address: defaultSettings.address,
        hours: defaultSettings.hours,
        colors: defaultSettings.colors,
        notifications: defaultSettings.notifications,
      }
    })

    return settings
  }

  private static getDefaultSettings(): AcademySettingsData {
    return {
      name: "Black Red Academia",
      description:
        "Academia moderna com equipamentos de última geração, personal trainers qualificados e ambiente motivador.",
      phone: "(11) 99999-9999",
      email: "contato@blackred.com.br",
      address: "Rua das Academias, 123 - Centro",
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
    }
  }

  static async updateSettings(updates: Partial<AcademySettingsData>): Promise<AcademySettingsData> {
    try {
      let settings = await prisma.academySettings.findFirst({
        orderBy: { createdAt: 'desc' }
      })

      if (!settings) {
        settings = await this.initializeDefaultSettings()
      }

      const updatedSettings = await prisma.academySettings.update({
        where: { id: settings.id },
        data: {
          name: updates.name,
          description: updates.description,
          phone: updates.phone,
          email: updates.email,
          address: updates.address,
          hours: updates.hours,
          colors: updates.colors,
          notifications: updates.notifications,
        }
      })

      return {
        name: updatedSettings.name,
        description: updatedSettings.description,
        phone: updatedSettings.phone,
        email: updatedSettings.email,
        address: updatedSettings.address,
        hours: updatedSettings.hours as any,
        colors: updatedSettings.colors as any,
        notifications: updatedSettings.notifications as any,
      }
    } catch (error) {
      console.error("Error updating settings:", error)
      throw error
    }
  }
}

export default DataService
