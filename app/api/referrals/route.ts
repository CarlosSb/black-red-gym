import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { referredName, referredPhone, referredEmail } = await request.json()

    // Validação básica
    if (!referredName || !referredPhone) {
      return NextResponse.json(
        { error: "Nome e telefone do indicado são obrigatórios" },
        { status: 400 }
      )
    }

    // Validação do formato do telefone (Brasil)
    const phoneRegex = /^\(?(\d{2})\)?\s?9?\d{4}-?\d{4}$/
    if (!phoneRegex.test(referredPhone.replace(/\D/g, ""))) {
      return NextResponse.json(
        { error: "Formato de telefone inválido" },
        { status: 400 }
      )
    }

    // Em um cenário real, você pegaria o ID do usuário logado
    // Por enquanto, vamos usar dados mock para o referrer
    const referrerName = "João Silva" // Mock - seria do usuário logado
    const referrerPhone = "(11) 99999-9999" // Mock - seria do usuário logado

    // Criar indicação
    const referral = await prisma.referral.create({
      data: {
        referrerName,
        referrerPhone,
        referredName: referredName.trim(),
        referredPhone: referredPhone.replace(/\D/g, ""),
        referredEmail: referredEmail?.toLowerCase().trim(),
        status: "PENDING"
      }
    })

    return NextResponse.json({
      success: true,
      message: "Indicação realizada com sucesso!",
      referral: {
        id: referral.id,
        referredName: referral.referredName,
        status: referral.status
      }
    })

  } catch (error) {
    console.error("Erro ao criar indicação:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Em um cenário real, filtraria por usuário logado
    const referrals = await prisma.referral.findMany({
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json({
      success: true,
      referrals,
      total: referrals.length
    })

  } catch (error) {
    console.error("Erro ao buscar indicações:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}