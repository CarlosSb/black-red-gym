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

// GET /api/promotions - Listar promoções ativas (público)
export async function GET(request: NextRequest) {
  try {
    console.log('🚀 API /api/promotions chamada')
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const limit = parseInt(searchParams.get("limit") || "50")

    console.log('📝 Parâmetros:', { status, limit })

    const where: any = {
      isActive: true
    }

    // Se especificar status, incluir inativos também (para admin)
    if (status === "all") {
      delete where.isActive
      console.log('👑 Modo admin: incluindo promoções inativas')
    }

    // Filtrar apenas promoções não expiradas (exceto para admin que quer ver todas)
    if (status !== "all") {
      where.validUntil = {
        gte: new Date()
      }
      console.log('⏰ Filtrando apenas promoções válidas')
    }

    console.log('🔍 Filtros aplicados:', where)

    const promotions = await prisma.promotion.findMany({
      where,
      orderBy: {
        createdAt: "desc"
      },
      take: limit
    })

    console.log('📊 Promoções encontradas:', promotions.length)
    console.log('📋 Promoções:', promotions.map(p => ({ id: p.id, title: p.title, isActive: p.isActive })))

    return NextResponse.json({
      success: true,
      promotions,
      total: promotions.length
    })

  } catch (error) {
    console.error("💥 Erro ao buscar promoções:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// POST /api/promotions - Criar promoção (admin)
export async function POST(request: NextRequest) {
  try {
    // Verificar se o usuário é admin
    const adminUser = await verifyAdmin()
    if (!adminUser) {
      return NextResponse.json(
        { error: "Acesso negado. Apenas administradores podem criar promoções." },
        { status: 403 }
      )
    }

    const { title, description, image, validUntil } = await request.json()

    // Validação básica
    if (!title || !description || !validUntil) {
      return NextResponse.json(
        { error: "Título, descrição e data de validade são obrigatórios" },
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

    const promotion = await prisma.promotion.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        image: image?.trim(),
        validUntil: validUntilDate,
        isActive: true
      }
    })

    return NextResponse.json({
      success: true,
      message: "Promoção criada com sucesso",
      promotion
    }, { status: 201 })

  } catch (error) {
    console.error("Erro ao criar promoção:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}