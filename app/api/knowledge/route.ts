import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

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

// GET /api/knowledge - Listar todas as entradas de knowledge
export async function GET() {
  try {
    // Verificar se o usuário é admin
    const adminUser = await verifyAdmin()
    if (!adminUser) {
      return NextResponse.json(
        { error: "Acesso negado. Apenas administradores podem acessar esta funcionalidade." },
        { status: 403 }
      )
    }

    const knowledge = await prisma.knowledgeBase.findMany({
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json({
      success: true,
      knowledge,
      total: knowledge.length
    })

  } catch (error) {
    console.error("Erro ao buscar knowledge:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// POST /api/knowledge - Criar nova entrada de knowledge
export async function POST(request: NextRequest) {
  try {
    // Verificar se o usuário é admin
    const adminUser = await verifyAdmin()
    if (!adminUser) {
      return NextResponse.json(
        { error: "Acesso negado. Apenas administradores podem criar entradas de knowledge." },
        { status: 403 }
      )
    }

    const { question, answer, category } = await request.json()

    // Validações
    if (!question || !answer || !category) {
      return NextResponse.json(
        { error: "Question, answer e category são obrigatórios" },
        { status: 400 }
      )
    }

    const newKnowledge = await prisma.knowledgeBase.create({
      data: {
        question: question.trim(),
        answer: answer.trim(),
        category: category.trim()
      }
    })

    return NextResponse.json({
      success: true,
      message: "Entrada de knowledge criada com sucesso",
      knowledge: newKnowledge
    }, { status: 201 })

  } catch (error) {
    console.error("Erro ao criar entrada de knowledge:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// PUT /api/knowledge/[id] - Atualizar entrada de knowledge
// Mas como é route.ts, para PUT precisamos usar dynamic route, mas para simplicidade, assumir id no body para update
export async function PUT(request: NextRequest) {
  try {
    const adminUser = await verifyAdmin()
    if (!adminUser) {
      return NextResponse.json(
        { error: "Acesso negado. Apenas administradores podem editar entradas de knowledge." },
        { status: 403 }
      )
    }

    const { id, question, answer, category } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: "ID é obrigatório para atualização" },
        { status: 400 }
      )
    }

    if (!question || !answer || !category) {
      return NextResponse.json(
        { error: "Question, answer e category são obrigatórios" },
        { status: 400 }
      )
    }

    const updatedKnowledge = await prisma.knowledgeBase.update({
      where: { id },
      data: {
        question: question.trim(),
        answer: answer.trim(),
        category: category.trim()
      }
    })

    return NextResponse.json({
      success: true,
      message: "Entrada de knowledge atualizada com sucesso",
      knowledge: updatedKnowledge
    })

  } catch (error) {
    console.error("Erro ao atualizar entrada de knowledge:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// DELETE /api/knowledge/[id] - Deletar entrada de knowledge
export async function DELETE(request: NextRequest) {
  try {
    const adminUser = await verifyAdmin()
    if (!adminUser) {
      return NextResponse.json(
        { error: "Acesso negado. Apenas administradores podem deletar entradas de knowledge." },
        { status: 403 }
      )
    }

    const { id } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: "ID é obrigatório para deleção" },
        { status: 400 }
      )
    }

    await prisma.knowledgeBase.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: "Entrada de knowledge deletada com sucesso"
    })

  } catch (error) {
    console.error("Erro ao deletar entrada de knowledge:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}