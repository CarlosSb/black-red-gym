import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { date: 'desc' }
    })

    return NextResponse.json(messages.map(message => ({
      id: message.id,
      name: message.name,
      email: message.email,
      phone: message.phone,
      subject: message.subject,
      message: message.message,
      date: message.date.toISOString(),
      status: message.status.toLowerCase() as "read" | "unread",
      priority: message.priority.toLowerCase() as "low" | "medium" | "high",
      response: message.response || undefined,
      respondedAt: message.respondedAt?.toISOString() || undefined,
    })))
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const messageData = await request.json()
    
    const newMessage = await prisma.message.create({
      data: {
        name: messageData.name,
        email: messageData.email,
        phone: messageData.phone,
        subject: messageData.subject,
        message: messageData.message,
        status: messageData.status.toUpperCase() as "READ" | "UNREAD",
        priority: messageData.priority.toUpperCase() as "LOW" | "MEDIUM" | "HIGH",
        response: messageData.response,
        respondedAt: messageData.respondedAt ? new Date(messageData.respondedAt) : null,
      }
    })

    return NextResponse.json({
      id: newMessage.id,
      name: newMessage.name,
      email: newMessage.email,
      phone: newMessage.phone,
      subject: newMessage.subject,
      message: newMessage.message,
      date: newMessage.date.toISOString(),
      status: newMessage.status.toLowerCase() as "read" | "unread",
      priority: newMessage.priority.toLowerCase() as "low" | "medium" | "high",
      response: newMessage.response || undefined,
      respondedAt: newMessage.respondedAt?.toISOString() || undefined,
    })
  } catch (error) {
    console.error('Error creating message:', error)
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 })
  }
}
