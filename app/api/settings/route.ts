import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
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

      settings = await prisma.academySettings.create({
        data: defaultSettings
      })
    }

    return NextResponse.json({
      success: true,
      settings: {
        name: settings.name,
        description: settings.description,
        phone: settings.phone,
        email: settings.email,
        address: settings.address,
        whatsapp: settings.whatsapp,
        hours: settings.hours,
        colors: settings.colors,
        notifications: settings.notifications,
        logo: settings.logo || "/placeholder-logo.png",
        about: settings.about,
        heroTitle: settings.heroTitle,
        heroSubtitle: settings.heroSubtitle,
        heroImage: settings.heroImage,
        features: settings.features,
        metrics: settings.metrics,
      }
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updates = await request.json()
    
    let settings = await prisma.academySettings.findFirst({
      orderBy: { createdAt: 'desc' }
    })

    if (!settings) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 })
    }

    const updatedSettings = await prisma.academySettings.update({
      where: { id: settings.id },
      data: {
        name: updates.name,
        description: updates.description,
        phone: updates.phone,
        email: updates.email,
        address: updates.address,
        whatsapp: updates.whatsapp,
        hours: updates.hours,
        colors: updates.colors,
        notifications: updates.notifications,
        logo: updates.logo,
        about: updates.about,
        heroTitle: updates.heroTitle,
        heroSubtitle: updates.heroSubtitle,
        heroImage: updates.heroImage,
        features: updates.features,
        metrics: updates.metrics,
      }
    })

    return NextResponse.json({
      success: true,
      settings: {
        name: updatedSettings.name,
        description: updatedSettings.description,
        phone: updatedSettings.phone,
        email: updatedSettings.email,
        address: updatedSettings.address,
        whatsapp: updatedSettings.whatsapp,
        hours: updatedSettings.hours,
        colors: updatedSettings.colors,
        notifications: updatedSettings.notifications,
        logo: updatedSettings.logo || "/placeholder-logo.png",
        about: updatedSettings.about,
        heroTitle: updatedSettings.heroTitle,
        heroSubtitle: updatedSettings.heroSubtitle,
        heroImage: updatedSettings.heroImage,
        features: updatedSettings.features,
        metrics: updatedSettings.metrics,
      }
    })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 })
  }
}
