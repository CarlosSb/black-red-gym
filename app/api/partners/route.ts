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

// GET /api/partners - Listar parceiros ativos (público)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const status = searchParams.get("status")
    const limit = parseInt(searchParams.get("limit") || "50")

    const where: any = {
      isActive: true
    }

    // Filtrar por categoria se especificada
    if (category) {
      where.category = category
    }

    // Se especificar status, incluir inativos também (para admin)
    if (status === "all") {
      delete where.isActive
    }

    const partners = await prisma.partner.findMany({
      where,
      orderBy: {
        createdAt: "desc"
      },
      take: limit
    })

    return NextResponse.json({
      success: true,
      partners,
      total: partners.length
    })

  } catch (error) {
    console.error("Erro ao buscar parceiros:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// POST /api/partners - Criar parceiro (admin)
export async function POST(request: NextRequest) {
  try {
    // Verificar se o usuário é admin
    const adminUser = await verifyAdmin()
    if (!adminUser) {
      return NextResponse.json(
        { error: "Acesso negado. Apenas administradores podem criar parceiros." },
        { status: 403 }
      )
    }

    const { name, description, logo, link, category } = await request.json()

    // Validação básica
    if (!name || !description || !category) {
      return NextResponse.json(
        { error: "Nome, descrição e categoria são obrigatórios" },
        { status: 400 }
      )
    }

    const partner = await prisma.partner.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        logo: logo?.trim(),
        link: link?.trim(),
        category: category.trim(),
        isActive: true
      }
    })

    return NextResponse.json({
      success: true,
      message: "Parceiro criado com sucesso",
      partner
    }, { status: 201 })

  } catch (error) {
    console.error("Erro ao criar parceiro:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}