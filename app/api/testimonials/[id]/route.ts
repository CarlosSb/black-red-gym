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

// PATCH /api/testimonials/[id] - Atualizar depoimento (apenas admin)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar se o usuário é admin
    const adminUser = await verifyAdmin()
    if (!adminUser) {
      return NextResponse.json(
        { error: "Acesso negado. Apenas administradores podem modificar depoimentos." },
        { status: 403 }
      )
    }

    const { id } = await params
    const testimonialId = id
    const { isActive } = await request.json()

    // Validações
    if (typeof isActive !== "boolean") {
      return NextResponse.json(
        { error: "Status deve ser um valor booleano" },
        { status: 400 }
      )
    }

    // Verificar se o depoimento existe
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id: testimonialId }
    })

    if (!existingTestimonial) {
      return NextResponse.json(
        { error: "Depoimento não encontrado." },
        { status: 404 }
      )
    }

    // Atualizar depoimento
    const updatedTestimonial = await prisma.testimonial.update({
      where: { id: testimonialId },
      data: { isActive }
    })

    const action = isActive ? "ativado" : "desativado"

    return NextResponse.json({
      success: true,
      message: `Depoimento ${action} com sucesso.`,
      testimonial: updatedTestimonial
    })

  } catch (error) {
    console.error("Erro ao atualizar depoimento:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// DELETE /api/testimonials/[id] - Excluir depoimento (apenas admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar se o usuário é admin
    const adminUser = await verifyAdmin()
    if (!adminUser) {
      return NextResponse.json(
        { error: "Acesso negado. Apenas administradores podem excluir depoimentos." },
        { status: 403 }
      )
    }

    const { id } = await params
    const testimonialId = id

    // Verificar se o depoimento existe
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id: testimonialId }
    })

    if (!existingTestimonial) {
      return NextResponse.json(
        { error: "Depoimento não encontrado." },
        { status: 404 }
      )
    }

    // Excluir depoimento
    await prisma.testimonial.delete({
      where: { id: testimonialId }
    })

    return NextResponse.json({
      success: true,
      message: "Depoimento excluído com sucesso."
    })

  } catch (error) {
    console.error("Erro ao excluir depoimento:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}