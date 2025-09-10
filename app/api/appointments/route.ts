import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { emailService } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const { name, phone, email, classType, scheduledDate, scheduledTime, notes } = await request.json()

    // Validação básica
    if (!name || !phone || !email || !classType || !scheduledDate || !scheduledTime) {
      return NextResponse.json(
        { error: "Todos os campos obrigatórios devem ser preenchidos" },
        { status: 400 }
      )
    }

    // Validação de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "E-mail inválido" },
        { status: 400 }
      )
    }

    // Validação do formato do telefone
    const phoneRegex = /^\(?(\d{2})\)?\s?9?\d{4}-?\d{4}$/
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: "Formato de telefone inválido" },
        { status: 400 }
      )
    }

    // Validação da data (não pode ser no passado)
    const appointmentDate = new Date(`${scheduledDate}T${scheduledTime}`)
    const now = new Date()
    if (appointmentDate <= now) {
      return NextResponse.json(
        { error: "A data e horário devem ser no futuro" },
        { status: 400 }
      )
    }

    // Verificar se já existe agendamento no mesmo horário
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        scheduledDate: appointmentDate,
        scheduledTime: scheduledTime,
        status: {
          in: ["PENDING", "CONFIRMED"]
        }
      }
    })

    if (existingAppointment) {
      return NextResponse.json(
        { error: "Horário já ocupado. Escolha outro horário." },
        { status: 409 }
      )
    }

    // Criar agendamento
    const appointment = await prisma.appointment.create({
      data: {
        name: name.trim(),
        phone: phone.replace(/\D/g, ""),
        email: email.toLowerCase().trim(),
        classType,
        scheduledDate: appointmentDate,
        scheduledTime,
        notes: notes?.trim(),
        status: "PENDING"
      }
    })

    // Enviar e-mail de confirmação (não bloquear a resposta se falhar)
    try {
      await emailService.sendAppointmentConfirmation({
        name: appointment.name,
        email: appointment.email,
        classType: appointment.classType,
        scheduledDate: appointment.scheduledDate,
        scheduledTime: appointment.scheduledTime,
        phone: appointment.phone
      })
      console.log("E-mail de confirmação enviado para:", appointment.email)
    } catch (emailError) {
      console.error("Erro ao enviar e-mail de confirmação:", emailError)
      // Não falhar a requisição por causa do e-mail
    }

    return NextResponse.json({
      success: true,
      message: "Agendamento realizado com sucesso! Entraremos em contato para confirmar.",
      appointment: {
        id: appointment.id,
        name: appointment.name,
        classType: appointment.classType,
        scheduledDate: appointment.scheduledDate,
        scheduledTime: appointment.scheduledTime
      }
    })

  } catch (error) {
    console.error("Erro ao criar agendamento:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const limit = parseInt(searchParams.get("limit") || "50")

    const where: any = {}
    if (status) {
      where.status = status
    }

    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: {
        scheduledDate: "desc"
      },
      take: limit
    })

    return NextResponse.json({
      success: true,
      appointments,
      total: appointments.length
    })

  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}