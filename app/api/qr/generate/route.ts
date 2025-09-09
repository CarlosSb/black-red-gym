import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { randomBytes } from "crypto"

export async function GET(request: NextRequest) {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Verificar se já existe um código válido para hoje
    const existingCode = await prisma.checkinCode.findFirst({
      where: {
        validDate: {
          gte: today,
          lt: tomorrow
        }
      }
    })

    if (existingCode) {
      return NextResponse.json({
        success: true,
        code: existingCode.code,
        validDate: existingCode.validDate,
        qrUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkin/${existingCode.code}`
      })
    }

    // Gerar novo código único
    const code = `QR${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}${randomBytes(4).toString('hex').toUpperCase()}`

    // Criar novo código no banco
    const newCode = await prisma.checkinCode.create({
      data: {
        code,
        validDate: today
      }
    })

    return NextResponse.json({
      success: true,
      code: newCode.code,
      validDate: newCode.validDate,
      qrUrl: `${process.env.NEXT_PUBLIC_APP_URL}/checkin/${newCode.code}`
    })

  } catch (error) {
    console.error("Erro ao gerar código QR:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}