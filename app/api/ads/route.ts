import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

// Função auxiliar para verificar se o usuário é admin
async function verifyAdmin() {
  try {
    const cookieStore = await cookies()
    const authCookie = cookieStore.get("gymstarter_auth")

    if (!authCookie) {
      return null
    }

    let user
    try {
      user = JSON.parse(authCookie.value)
    } catch (parseError) {
      console.error("Erro ao fazer parse do cookie de autenticação:", parseError)
      return null
    }

    if (user.role !== "ADMIN") {
      return null
    }

    return user
  } catch (error) {
    console.error("💥 Erro ao verificar admin:", error)
    return null
  }
}

// GET /api/ads - Listar anúncios ativos (público)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const limit = parseInt(searchParams.get("limit") || "10")

    const where: any = {
      isActive: true
    }

    // Se especificar status, incluir inativos também (para admin)
    if (status === "all") {
      delete where.isActive
    }

    // Filtrar apenas anúncios não expirados
    where.validUntil = {
      gte: new Date()
    }

    const ads = await prisma.ad.findMany({
      where,
      orderBy: {
        createdAt: "desc"
      },
      take: limit
    })

    return NextResponse.json({
      success: true,
      ads,
      total: ads.length
    })

  } catch (error) {
    console.error("Erro ao buscar anúncios:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// POST /api/ads - Criar anúncio (admin)
export async function POST(request: NextRequest) {
  try {
    // Verificar se o usuário é admin
    const adminUser = await verifyAdmin()
    if (!adminUser) {
      return NextResponse.json(
        { error: "Acesso negado. Apenas administradores podem criar anúncios." },
        { status: 403 }
      )
    }

    const { title, image, link, validUntil } = await request.json()

    // Validação básica
    if (!title || !validUntil) {
      return NextResponse.json(
        { error: "Título e data de validade são obrigatórios" },
        { status: 400 }
      )
    }

    // Validar data
    const validUntilDate = new Date(validUntil)
    if (validUntilDate <= new Date()) {
      return NextResponse.json(
        { error: "A data de validade deve ser no futuro" },
        { status: 400 }
      )
    }

    const ad = await prisma.ad.create({
      data: {
        title: title.trim(),
        image: image?.trim(),
        link: link?.trim(),
        validUntil: validUntilDate,
        isActive: true
      }
    })

    return NextResponse.json({
      success: true,
      message: "Anúncio criado com sucesso",
      ad
    }, { status: 201 })

  } catch (error) {
    console.error("Erro ao criar anúncio:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}