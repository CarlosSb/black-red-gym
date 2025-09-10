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

// GET /api/ads/[id] - Obter anúncio por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const ad = await prisma.ad.findUnique({
      where: { id }
    })

    if (!ad) {
      return NextResponse.json(
        { error: "Anúncio não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      ad
    })

  } catch (error) {
    console.error("Erro ao buscar anúncio:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// PATCH /api/ads/[id] - Atualizar anúncio (admin)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar se o usuário é admin
    const adminUser = await verifyAdmin()
    if (!adminUser) {
      return NextResponse.json(
        { error: "Acesso negado. Apenas administradores podem editar anúncios." },
        { status: 403 }
      )
    }

    const { id } = await params
    const { title, image, link, validUntil, isActive } = await request.json()

    // Verificar se o anúncio existe
    const existingAd = await prisma.ad.findUnique({
      where: { id }
    })

    if (!existingAd) {
      return NextResponse.json(
        { error: "Anúncio não encontrado" },
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

    // Atualizar anúncio
    const updatedAd = await prisma.ad.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(image !== undefined && { image: image?.trim() }),
        ...(link !== undefined && { link: link?.trim() }),
        ...(validUntilDate && { validUntil: validUntilDate }),
        ...(isActive !== undefined && { isActive })
      }
    })

    return NextResponse.json({
      success: true,
      message: "Anúncio atualizado com sucesso",
      ad: updatedAd
    })

  } catch (error) {
    console.error("Erro ao atualizar anúncio:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// DELETE /api/ads/[id] - Excluir anúncio (admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar se o usuário é admin
    const adminUser = await verifyAdmin()
    if (!adminUser) {
      return NextResponse.json(
        { error: "Acesso negado. Apenas administradores podem excluir anúncios." },
        { status: 403 }
      )
    }

    const { id } = await params

    // Verificar se o anúncio existe
    const existingAd = await prisma.ad.findUnique({
      where: { id }
    })

    if (!existingAd) {
      return NextResponse.json(
        { error: "Anúncio não encontrado" },
        { status: 404 }
      )
    }

    // Excluir anúncio
    await prisma.ad.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: "Anúncio excluído com sucesso"
    })

  } catch (error) {
    console.error("Erro ao excluir anúncio:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}