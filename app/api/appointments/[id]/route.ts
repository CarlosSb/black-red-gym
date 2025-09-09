import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { status } = await request.json()

    // Validação do status
    const validStatuses = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Status inválido" },
        { status: 400 }
      )
    }

    // Atualizar agendamento
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: "Status do agendamento atualizado com sucesso",
      appointment: updatedAppointment
    })

  } catch (error) {
    console.error("Erro ao atualizar agendamento:", error)

    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return NextResponse.json(
        { error: "Agendamento não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Deletar agendamento
    await prisma.appointment.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: "Agendamento removido com sucesso"
    })

  } catch (error) {
    console.error("Erro ao deletar agendamento:", error)

    if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
      return NextResponse.json(
        { error: "Agendamento não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}