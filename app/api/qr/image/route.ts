import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import QRCode from "qrcode"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")

    if (!code) {
      return NextResponse.json(
        { error: "Código QR é obrigatório" },
        { status: 400 }
      )
    }

    // Verificar se o código existe e é válido
    const checkinCode = await prisma.checkinCode.findUnique({
      where: { code }
    })

    if (!checkinCode) {
      return NextResponse.json(
        { error: "Código QR inválido" },
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
        { error: "Código QR expirado" },
        { status: 400 }
      )
    }

    // Gerar QR Code como imagem
    const qrUrl = `${process.env.NEXT_PUBLIC_APP_URL}/checkin/${code}`
    const qrImage = await QRCode.toBuffer(qrUrl, {
      type: 'png',
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })

    return new NextResponse(new Uint8Array(qrImage), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600' // Cache por 1 hora
      }
    })

  } catch (error) {
    console.error("Erro ao gerar imagem QR:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}