import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    const adminExists = await prisma.user.findFirst({
      where: { role: "ADMIN" }
    })

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 12)
      await prisma.user.create({
        data: {
          name: "Administrador",
          email: "admin@gymstarter.com.br",
          password: hashedPassword,
          role: "ADMIN"
        }
      })
      console.log("Default admin user created: admin@gymstarter.com.br / admin123")
    }

    return NextResponse.json({ success: true, message: 'Admin user initialized' })
  } catch (error) {
    console.error('Error initializing admin:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to initialize admin user' },
      { status: 500 }
    )
  }
}
