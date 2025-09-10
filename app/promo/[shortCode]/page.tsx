import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

interface PageProps {
  params: Promise<{
    shortCode: string
  }>
}

export default async function PromoRedirectPage({ params }: PageProps) {
  const { shortCode } = await params

  try {
    // Try to find by shortCode first
    let promotion = await prisma.promotion.findUnique({
      where: { shortCode }
    })

    // If not found by shortCode, try by uniqueCode
    if (!promotion) {
      promotion = await prisma.promotion.findUnique({
        where: { uniqueCode: shortCode }
      })
    }

    if (!promotion || !promotion.isActive) {
      // Redirect to home if promotion not found or inactive
      redirect('/')
    }

    // Check if promotion is expired
    if (new Date(promotion.validUntil) < new Date()) {
      redirect('/')
    }

    // Increment access count
    await prisma.promotion.update({
      where: { id: promotion.id },
      data: { accessCount: { increment: 1 } }
    })

    // Redirect to full promotion URL
    const fullUrl = `/promotion/${promotion.uniqueCode || promotion.id}`
    redirect(fullUrl)

  } catch (error) {
    console.error('Error redirecting promo:', error)
    redirect('/')
  }
}