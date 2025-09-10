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

// GET /api/partners/[id] - Obter parceiro por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const partner = await prisma.partner.findUnique({
      where: { id }
    })

    if (!partner) {
      return NextResponse.json(
        { error: "Parceiro não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      partner
    })

  } catch (error) {
    console.error("Erro ao buscar parceiro:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// PATCH /api/partners/[id] - Atualizar parceiro (admin)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar se o usuário é admin
    const adminUser = await verifyAdmin()
    if (!adminUser) {
      return NextResponse.json(
        { error: "Acesso negado. Apenas administradores podem editar parceiros." },
        { status: 403 }
      )
    }

    const { id } = await params
    const { name, description, logo, link, category, isActive } = await request.json()

    // Verificar se o parceiro existe
    const existingPartner = await prisma.partner.findUnique({
      where: { id }
    })

    if (!existingPartner) {
      return NextResponse.json(
        { error: "Parceiro não encontrado" },
        { status: 404 }
      )
    }

    // Atualizar parceiro
    const updatedPartner = await prisma.partner.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(description && { description: description.trim() }),
        ...(logo !== undefined && { logo: logo?.trim() }),
        ...(link !== undefined && { link: link?.trim() }),
        ...(category && { category: category.trim() }),
        ...(isActive !== undefined && { isActive })
      }
    })

    return NextResponse.json({
      success: true,
      message: "Parceiro atualizado com sucesso",
      partner: updatedPartner
    })

  } catch (error) {
    console.error("Erro ao atualizar parceiro:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// DELETE /api/partners/[id] - Excluir parceiro (admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar se o usuário é admin
    const adminUser = await verifyAdmin()
    if (!adminUser) {
      return NextResponse.json(
        { error: "Acesso negado. Apenas administradores podem excluir parceiros." },
        { status: 403 }
      )
    }

    const { id } = await params

    // Verificar se o parceiro existe
    const existingPartner = await prisma.partner.findUnique({
      where: { id }
    })

    if (!existingPartner) {
      return NextResponse.json(
        { error: "Parceiro não encontrado" },
        { status: 404 }
      )
    }

    // Excluir parceiro
    await prisma.partner.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: "Parceiro excluído com sucesso"
    })

  } catch (error) {
    console.error("Erro ao excluir parceiro:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}