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

// GET /api/promotions/[id] - Obter promoção por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const promotion = await prisma.promotion.findUnique({
      where: { id }
    })

    if (!promotion) {
      return NextResponse.json(
        { error: "Promoção não encontrada" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      promotion
    })

  } catch (error) {
    console.error("Erro ao buscar promoção:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// PATCH /api/promotions/[id] - Atualizar promoção (admin)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar se o usuário é admin
    const adminUser = await verifyAdmin()
    if (!adminUser) {
      return NextResponse.json(
        { error: "Acesso negado. Apenas administradores podem editar promoções." },
        { status: 403 }
      )
    }

    const { id } = await params
    const { title, description, image, validUntil, isActive } = await request.json()

    // Verificar se a promoção existe
    const existingPromotion = await prisma.promotion.findUnique({
      where: { id }
    })

    if (!existingPromotion) {
      return NextResponse.json(
        { error: "Promoção não encontrada" },
        { status: 404 }
      )
    }

    // Validar data se fornecida
    let validUntilDate
    if (validUntil) {
      validUntilDate = new Date(validUntil)
      if (validUntilDate <= new Date()) {
        return NextResponse.json(
          { error: "A data de validade deve ser no futuro" },
          { status: 400 }
        )
      }
    }

    // Atualizar promoção
    const updatedPromotion = await prisma.promotion.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(description && { description: description.trim() }),
        ...(image !== undefined && { image: image?.trim() }),
        ...(validUntilDate && { validUntil: validUntilDate }),
        ...(isActive !== undefined && { isActive })
      }
    })

    return NextResponse.json({
      success: true,
      message: "Promoção atualizada com sucesso",
      promotion: updatedPromotion
    })

  } catch (error) {
    console.error("Erro ao atualizar promoção:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// DELETE /api/promotions/[id] - Excluir promoção (admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar se o usuário é admin
    const adminUser = await verifyAdmin()
    if (!adminUser) {
      return NextResponse.json(
        { error: "Acesso negado. Apenas administradores podem excluir promoções." },
        { status: 403 }
      )
    }

    const { id } = await params

    // Verificar se a promoção existe
    const existingPromotion = await prisma.promotion.findUnique({
      where: { id }
    })

    if (!existingPromotion) {
      return NextResponse.json(
        { error: "Promoção não encontrada" },
        { status: 404 }
      )
    }

    // Excluir promoção
    await prisma.promotion.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: "Promoção excluída com sucesso"
    })

  } catch (error) {
    console.error("Erro ao excluir promoção:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}