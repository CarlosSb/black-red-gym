import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { name, phone, code } = await request.json()

    // Validação básica
    if (!name || !phone) {
      return NextResponse.json(
        { error: "Nome e telefone são obrigatórios" },
        { status: 400 }
      )
    }

    // Validação do formato do telefone (Brasil)
    const phoneRegex = /^\(?(\d{2})\)?\s?9?\d{4}-?\d{4}$/
    if (!phoneRegex.test(phone.replace(/\D/g, ""))) {
      return NextResponse.json(
        { error: "Formato de telefone inválido" },
        { status: 400 }
      )
    }

    let codeId = null

    // Se código QR foi fornecido, validar
    if (code) {
      const checkinCode = await prisma.checkinCode.findUnique({
        where: { code }
      })

      if (!checkinCode) {
        return NextResponse.json(
          { error: "Código QR inválido" },
          { status: 400 }
        )
      }

      // Verificar se o código ainda é válido (hoje)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      if (checkinCode.validDate < today || checkinCode.validDate >= tomorrow) {
        return NextResponse.json(
          { error: "Código QR expirado" },
          { status: 400 }
        )
      }

      codeId = checkinCode.id
    }

    // Criar check-in
    const checkIn = await prisma.checkIn.create({
      data: {
        name: name.trim(),
        phone: phone.replace(/\D/g, ""), // Remove formatação
        checkInTime: new Date(),
        status: "ACTIVE",
        ...(codeId && { codeId })
      }
    })

    return NextResponse.json({
      success: true,
      message: "Check-in realizado com sucesso!",
      checkIn: {
        id: checkIn.id,
        name: checkIn.name,
        checkInTime: checkIn.checkInTime
      }
    })

  } catch (error) {
    console.error("Erro ao fazer check-in:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Buscar check-ins do dia atual
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const checkIns = await prisma.checkIn.findMany({
      where: {
        checkInTime: {
          gte: today,
          lt: tomorrow
        },
        status: "ACTIVE"
      },
      orderBy: {
        checkInTime: "desc"
      }
    })

    return NextResponse.json({
      success: true,
      checkIns,
      total: checkIns.length
    })

  } catch (error) {
    console.error("Erro ao buscar check-ins:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}