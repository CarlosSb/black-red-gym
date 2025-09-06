import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json()
    const updateData: any = { ...updates }
    
    if (updates.status) {
      updateData.status = updates.status.toUpperCase() as "READ" | "UNREAD"
    }
    if (updates.priority) {
      updateData.priority = updates.priority.toUpperCase() as "LOW" | "MEDIUM" | "HIGH"
    }
    if (updates.respondedAt) {
      updateData.respondedAt = new Date(updates.respondedAt)
    }

    const updatedMessage = await prisma.message.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json({
      id: updatedMessage.id,
      name: updatedMessage.name,
      email: updatedMessage.email,
      phone: updatedMessage.phone,
      subject: updatedMessage.subject,
      message: updatedMessage.message,
      date: updatedMessage.date.toISOString(),
      status: updatedMessage.status.toLowerCase() as "read" | "unread",
      priority: updatedMessage.priority.toLowerCase() as "low" | "medium" | "high",
      response: updatedMessage.response || undefined,
      respondedAt: updatedMessage.respondedAt?.toISOString() || undefined,
    })
  } catch (error) {
    console.error('Error updating message:', error)
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.message.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting message:', error)
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 })
  }
}
