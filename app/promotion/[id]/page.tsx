import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PromotionDetailView } from '@/components/promotion-detail-view'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

async function getPromotion(id: string) {
  try {
    const promotion = await prisma.promotion.findUnique({
      where: { id }
    })

    if (!promotion || !promotion.isActive) {
      return null
    }

    // Verificar se não está expirado
    if (new Date(promotion.validUntil) < new Date()) {
      return null
    }

    return promotion
  } catch (error) {
    console.error('Erro ao buscar promoção:', error)
    return null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const promotion = await getPromotion(id)

  if (!promotion) {
    return {
      title: 'Promoção não encontrada | GymStarter'
    }
  }

  const title = `${promotion.title} | GymStarter`
  const description = promotion.description
  const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/promotion/${promotion.id}`

  return {
    title,
    description,
    keywords: ['gym', 'academia', 'fitness', 'promoção', 'desconto', promotion.title.toLowerCase()],
    authors: [{ name: 'GymStarter' }],
    creator: 'GymStarter',
    publisher: 'GymStarter',
    openGraph: {
      title,
      description,
      url,
      siteName: 'GymStarter',
      images: promotion.image ? [
        {
          url: promotion.image,
          width: 1200,
          height: 630,
          alt: promotion.title,
        }
      ] : [],
      locale: 'pt_BR',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: promotion.image ? [promotion.image] : [],
      creator: '@gymstarter',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: url,
    },
  }
}

export default async function PromocaoPage({ params }: PageProps) {
  const { id } = await params
  const promotion = await getPromotion(id)

  if (!promotion) {
    notFound()
  }

  // Convert null to undefined for compatibility
  const normalizedPromotion = {
    ...promotion,
    image: promotion.image || undefined,
    uniqueCode: promotion.uniqueCode || undefined,
    shortCode: promotion.shortCode || undefined,
    validUntil: promotion.validUntil.toISOString(),
    createdAt: promotion.createdAt.toISOString(),
    updatedAt: promotion.updatedAt.toISOString(),
  }

  return <PromotionDetailView promotion={normalizedPromotion} />
}