import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"

// Função auxiliar para verificar se o usuário é admin
async function verifyAdmin() {
  try {
    const cookieStore = await cookies()
    const authCookie = cookieStore.get("blackred_auth")

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

// PATCH /api/users/[id] - Atualizar status do usuário (apenas admin)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar se o usuário é admin
    const adminUser = await verifyAdmin()
    if (!adminUser) {
      return NextResponse.json(
        { error: "Acesso negado. Apenas administradores podem modificar usuários." },
        { status: 403 }
      )
    }

    const userId = params.id
    const { status } = await request.json()

    // Validações
    if (!status || !["ACTIVE", "BANNED"].includes(status)) {
      return NextResponse.json(
        { error: "Status inválido. Use 'ACTIVE' ou 'BANNED'." },
        { status: 400 }
      )
    }

    // Verificar se o usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: "Usuário não encontrado." },
        { status: 404 }
      )
    }

    // Não permitir que um admin se banir a si mesmo
    if (adminUser.id === userId && status === "BANNED") {
      return NextResponse.json(
        { error: "Você não pode banir sua própria conta." },
        { status: 400 }
      )
    }

    // Atualizar usuário
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        updatedAt: true
      }
    })

    const action = status === "BANNED" ? "banido" : "reativado"

    return NextResponse.json({
      success: true,
      message: `Usuário ${action} com sucesso.`,
      user: updatedUser
    })

  } catch (error) {
    console.error("Erro ao atualizar usuário:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// DELETE /api/users/[id] - Excluir usuário (apenas admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar se o usuário é admin
    const adminUser = await verifyAdmin()
    if (!adminUser) {
      return NextResponse.json(
        { error: "Acesso negado. Apenas administradores podem excluir usuários." },
        { status: 403 }
      )
    }

    const userId = params.id

    // Verificar se o usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: "Usuário não encontrado." },
        { status: 404 }
      )
    }

    // Não permitir que um admin se exclua
    if (adminUser.id === userId) {
      return NextResponse.json(
        { error: "Você não pode excluir sua própria conta." },
        { status: 400 }
      )
    }

    // Excluir usuário
    await prisma.user.delete({
      where: { id: userId }
    })

    return NextResponse.json({
      success: true,
      message: "Usuário excluído com sucesso."
    })

  } catch (error) {
    console.error("Erro ao excluir usuário:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}