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

      settings = await prisma.academySettings.create({
        data: defaultSettings
      })
    }

    return NextResponse.json({
      name: settings.name,
      description: settings.description,
      phone: settings.phone,
      email: settings.email,
      address: settings.address,
      hours: settings.hours,
      colors: settings.colors,
      notifications: settings.notifications,
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
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
        hours: updates.hours,
        colors: updates.colors,
        notifications: updates.notifications,
      }
    })

    return NextResponse.json({
      name: updatedSettings.name,
      description: updatedSettings.description,
      phone: updatedSettings.phone,
      email: updatedSettings.email,
      address: updatedSettings.address,
      hours: updatedSettings.hours,
      colors: updatedSettings.colors,
      notifications: updatedSettings.notifications,
    })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
