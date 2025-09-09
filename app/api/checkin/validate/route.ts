import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")

    if (!code) {
      return NextResponse.json(
        { error: "Código QR é obrigatório", valid: false },
        { status: 400 }
      )
    }

    // Buscar código no banco
    const checkinCode = await prisma.checkinCode.findUnique({
      where: { code }
    })

    if (!checkinCode) {
      return NextResponse.json(
        { error: "Código QR não encontrado", valid: false },
        { status: 404 }
      )
    }

    // Verificar se o código ainda é válido (hoje)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (checkinCode.validDate < today || checkinCode.validDate >= tomorrow) {
      return NextResponse.json(
        { error: "Código QR expirado", valid: false },
        { status: 400 }
      )
    }

    return NextResponse.json({
      valid: true,
      code: checkinCode.code,
      validDate: checkinCode.validDate
    })

  } catch (error) {
    console.error("Erro ao validar código QR:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor", valid: false },
      { status: 500 }
    )
  }
}