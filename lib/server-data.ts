import { prisma } from './prisma'
import type { PlanData, AcademySettingsData } from './data-service'

export async function getServerSettings(): Promise<AcademySettingsData> {
  try {
    let settings = await prisma.academySettings.findFirst({
      orderBy: { createdAt: 'desc' }
    })

    // If no settings exist, create default ones
    if (!settings) {
      const defaultSettings = {
        name: "Black Red Academia",
        description: "Academia moderna com equipamentos de última geração, personal trainers qualificados e ambiente motivador.",
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
        }
      }

      settings = await prisma.academySettings.create({
        data: defaultSettings
      })
    }

    return {
      name: settings.name,
      description: settings.description,
      phone: settings.phone,
      email: settings.email,
      address: settings.address,
      whatsapp: settings.whatsapp || undefined,
      hours: settings.hours as any,
      colors: settings.colors as any,
      notifications: settings.notifications as any,
      logo: settings.logo || undefined,
      about: settings.about || undefined,
      heroTitle: settings.heroTitle || undefined,
      heroSubtitle: settings.heroSubtitle || undefined,
      heroImage: settings.heroImage || undefined,
      features: settings.features as any,
      metrics: settings.metrics as any,
    }
  } catch (error) {
    console.error('Error fetching settings:', error)
    // Return default settings if database fails
    return {
      name: "Black Red Academia",
      description: "Academia moderna com equipamentos de última geração, personal trainers qualificados e ambiente motivador.",
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
}

export async function getServerPlans(): Promise<PlanData[]> {
  try {
    const plans = await prisma.plan.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { price: 'asc' }
    })

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
    console.error('Error fetching plans:', error)
    return []
  }
}
