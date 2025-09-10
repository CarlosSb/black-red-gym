import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
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

// GET /api/users - Listar todos os usuários (apenas admin)
export async function GET(request: NextRequest) {
  try {
    // Verificar se o usuário é admin
    const adminUser = await verifyAdmin()
    if (!adminUser) {
      return NextResponse.json(
        { error: "Acesso negado. Apenas administradores podem acessar esta funcionalidade." },
        { status: 403 }
      )
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    // Verificar se há usuários no banco
    if (users.length === 0) {
      // Verificar se a tabela existe e tem dados
      const allUsers = await prisma.user.findMany()
      if (allUsers.length === 0) {
        return NextResponse.json({
          success: true,
          users: [],
          total: 0,
          message: "Nenhum usuário encontrado. Execute o seed para criar usuários de teste."
        })
      }
    }

    return NextResponse.json({
      success: true,
      users,
      total: users.length
    })

  } catch (error) {
    console.error("Erro ao buscar usuários:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// POST /api/users - Criar novo usuário (apenas admin)
export async function POST(request: NextRequest) {
  try {
    // Verificar se o usuário é admin
    const adminUser = await verifyAdmin()
    if (!adminUser) {
      return NextResponse.json(
        { error: "Acesso negado. Apenas administradores podem criar usuários." },
        { status: 403 }
      )
    }

    const { name, email, password, role } = await request.json()

    // Validações
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nome, email e senha são obrigatórios" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "A senha deve ter pelo menos 6 caracteres" },
        { status: 400 }
      )
    }

    if (!["USER", "ADMIN"].includes(role)) {
      return NextResponse.json(
        { error: "Tipo de usuário inválido" },
        { status: 400 }
      )
    }

    // Verificar se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Este email já está cadastrado" },
        { status: 409 }
      )
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12)

    // Criar usuário
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role,
        status: "ACTIVE"
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      success: true,
      message: "Usuário criado com sucesso",
      user: newUser
    }, { status: 201 })

  } catch (error) {
    console.error("Erro ao criar usuário:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}