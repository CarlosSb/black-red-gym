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

    const user = JSON.parse(authCookie.value)
    if (user.role !== "ADMIN") {
      return null
    }

    return user
  } catch (error) {
    return null
  }
}

// GET /api/testimonials - Listar todos os depoimentos (público)
export async function GET(request: NextRequest) {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json({
      success: true,
      testimonials,
      total: testimonials.length
    })

  } catch (error) {
    console.error("Erro ao buscar depoimentos:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// POST /api/testimonials - Criar novo depoimento (apenas admin)
export async function POST(request: NextRequest) {
  try {
    // Verificar se o usuário é admin
    const adminUser = await verifyAdmin()
    if (!adminUser) {
      return NextResponse.json(
        { error: "Acesso negado. Apenas administradores podem criar depoimentos." },
        { status: 403 }
      )
    }

    const { name, content, rating, image } = await request.json()

    // Validações
    if (!name || !content) {
      return NextResponse.json(
        { error: "Nome e conteúdo são obrigatórios" },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Avaliação deve ser entre 1 e 5 estrelas" },
        { status: 400 }
      )
    }

    // Criar depoimento
    const newTestimonial = await prisma.testimonial.create({
      data: {
        name: name.trim(),
        content: content.trim(),
        rating,
        image: image?.trim() || null,
        isActive: true
      }
    })

    return NextResponse.json({
      success: true,
      message: "Depoimento criado com sucesso",
      testimonial: newTestimonial
    }, { status: 201 })

  } catch (error) {
    console.error("Erro ao criar depoimento:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}