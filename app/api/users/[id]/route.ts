import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"

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

// PATCH /api/users/[id] - Atualizar usuário (apenas admin)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params
    const userId = id
    const body = await request.json()
    const { status, name, email, password, role } = body

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

    // Preparar dados para atualização
    const updateData: any = {}

    // Validações e dados para atualização
    if (status !== undefined) {
      if (!["ACTIVE", "BANNED"].includes(status)) {
        return NextResponse.json(
          { error: "Status inválido. Use 'ACTIVE' ou 'BANNED'." },
          { status: 400 }
        )
      }
      updateData.status = status

      // Não permitir que um admin se banir a si mesmo
      if (adminUser.id === userId && status === "BANNED") {
        return NextResponse.json(
          { error: "Você não pode banir sua própria conta." },
          { status: 400 }
        )
      }
    }

    if (name !== undefined) {
      if (!name || name.trim().length < 2) {
        return NextResponse.json(
          { error: "Nome deve ter pelo menos 2 caracteres." },
          { status: 400 }
        )
      }
      updateData.name = name.trim()
    }

    if (email !== undefined) {
      if (!email || !email.includes("@")) {
        return NextResponse.json(
          { error: "Email inválido." },
          { status: 400 }
        )
      }

      // Verificar se o email já existe em outro usuário
      const emailExists = await prisma.user.findFirst({
        where: {
          email: email.toLowerCase().trim(),
          id: { not: userId }
        }
      })

      if (emailExists) {
        return NextResponse.json(
          { error: "Este email já está cadastrado por outro usuário." },
          { status: 409 }
        )
      }

      updateData.email = email.toLowerCase().trim()
    }

    if (password !== undefined) {
      if (!password || password.length < 6) {
        return NextResponse.json(
          { error: "Senha deve ter pelo menos 6 caracteres." },
          { status: 400 }
        )
      }
      updateData.password = await bcrypt.hash(password, 12)
    }

    if (role !== undefined) {
      if (!["USER", "ADMIN"].includes(role)) {
        return NextResponse.json(
          { error: "Tipo de usuário inválido." },
          { status: 400 }
        )
      }
      updateData.role = role
    }

    // Verificar se há dados para atualizar
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "Nenhum campo para atualizar." },
        { status: 400 }
      )
    }

    // Atualizar usuário
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        updatedAt: true
      }
    })

    let message = "Usuário atualizado com sucesso."
    if (status) {
      const action = status === "BANNED" ? "banido" : "reativado"
      message = `Usuário ${action} com sucesso.`
    }
    if (password) {
      message = "Senha alterada com sucesso."
    }

    return NextResponse.json({
      success: true,
      message,
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

// PUT /api/users/[id] - Atualizar usuário (apenas admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar se o usuário é admin
    const adminUser = await verifyAdmin()
    if (!adminUser) {
      return NextResponse.json(
        { error: "Acesso negado. Apenas administradores podem editar usuários." },
        { status: 403 }
      )
    }

    const { id } = await params
    const userId = id
    const { name, email, role, currentPassword, newPassword } = await request.json()

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

    // Validações
    if (name && name.trim().length < 2) {
      return NextResponse.json(
        { error: "Nome deve ter pelo menos 2 caracteres." },
        { status: 400 }
      )
    }

    if (email && !email.includes("@")) {
      return NextResponse.json(
        { error: "Email inválido." },
        { status: 400 }
      )
    }

    if (role && !["USER", "ADMIN"].includes(role)) {
      return NextResponse.json(
        { error: "Tipo de usuário inválido." },
        { status: 400 }
      )
    }

    // Verificar se o email já existe (se foi alterado)
    if (email && email.toLowerCase() !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      })

      if (emailExists) {
        return NextResponse.json(
          { error: "Este email já está cadastrado." },
          { status: 409 }
        )
      }
    }

    // Preparar dados para atualização
    const updateData: any = {}

    if (name) updateData.name = name.trim()
    if (email) updateData.email = email.toLowerCase().trim()
    if (role) updateData.role = role

    // Se uma nova senha foi fornecida
    if (newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "A nova senha deve ter pelo menos 6 caracteres." },
          { status: 400 }
        )
      }

      // Verificar senha atual se fornecida
      if (currentPassword) {
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, existingUser.password)
        if (!isCurrentPasswordValid) {
          return NextResponse.json(
            { error: "Senha atual incorreta." },
            { status: 400 }
          )
        }
      }

      updateData.password = await bcrypt.hash(newPassword, 12)
    }

    // Atualizar usuário
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      success: true,
      message: "Usuário atualizado com sucesso.",
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
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params
    const userId = id

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