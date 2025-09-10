"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Calendar, ArrowLeft, Share2, Copy, Check, MessageCircle, Facebook, Twitter, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SocialShareButtons } from "@/components/ui/social-share-buttons"
import Link from "next/link"
import { generatePromotionMessage, generateWhatsAppUrl, copyToClipboard } from "@/lib/utils"

interface Promotion {
  id: string
  title: string
  description: string
  image?: string
  validUntil: string
  isActive: boolean
  uniqueCode?: string
  shortCode?: string
  createdAt: string
}

interface PromotionDetailViewProps {
  promotion: Promotion
}

export function PromotionDetailView({ promotion }: PromotionDetailViewProps) {
  const [imageError, setImageError] = useState(false)
  const [copied, setCopied] = useState(false)
  const [baseUrl, setBaseUrl] = useState('http://localhost:3000')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin)
    }
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const isExpired = new Date(promotion.validUntil) < new Date()

  const getPromotionUrl = () => {
    const path = promotion.uniqueCode ? promotion.uniqueCode : promotion.id
    return `${baseUrl}/promotion/${path}`
  }

  const handleWhatsAppClick = () => {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5511999999999'
    const code = promotion.uniqueCode || promotion.id
    const shortUrl = promotion.shortCode ? `${baseUrl}/promo/${promotion.shortCode}` : getPromotionUrl()
    const message = `Olá! Gostaria de aderir ou saber mais sobre a promoção ${promotion.title}.\n\nCódigo da promoção: ${code}\n\nLink: ${shortUrl}`
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  const handleCopyLink = async () => {
    const url = `${baseUrl}/promotion/${promotion.id}?utm_source=copy&utm_medium=link&utm_campaign=promotion`
    const success = await copyToClipboard(url)

    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShareWhatsApp = () => {
    const shareUrl = getPromotionUrl()
    const whatsappShareMessage = `Confira esta promoção incrível: ${promotion.title}\n\n${promotion.description}\n\nLink: ${shareUrl}?utm_source=whatsapp&utm_medium=share&utm_campaign=promotion\n\nCódigo: ${promotion.uniqueCode || promotion.id}`
    const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(whatsappShareMessage)}`
    window.open(whatsappShareUrl, '_blank', 'noopener,noreferrer')
  }

  const shareUrl = getPromotionUrl()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Voltar ao início</span>
            </Link>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleCopyLink}
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                title="Copiar link"
              >
                {copied ? (
                  <Check className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>

              <Button
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl + '?utm_source=facebook&utm_medium=social&utm_campaign=promotion')}`, '_blank')}
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                title="Compartilhar no Facebook"
              >
                <Facebook className="h-3 w-3" />
              </Button>

              <Button
                onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl + '?utm_source=twitter&utm_medium=social&utm_campaign=promotion')}&text=${encodeURIComponent(promotion.title)}`, '_blank')}
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                title="Compartilhar no Twitter"
              >
                <Twitter className="h-3 w-3" />
              </Button>

              <Button
                onClick={async () => {
                  const success = await copyToClipboard(shareUrl + '?utm_source=instagram&utm_medium=social&utm_campaign=promotion')
                  if (success) {
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                  }
                }}
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                title="Copiar link para Instagram"
              >
                <Instagram className="h-3 w-3" />
              </Button>

              <Button
                onClick={handleShareWhatsApp}
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0"
                title="Compartilhar no WhatsApp"
              >
                <MessageCircle className="h-3 w-3" />
              </Button>

              <Button
                onClick={handleWhatsAppClick}
                size="sm"
                className="h-8 bg-red-600 hover:bg-red-700 text-white px-3"
                title="Aproveitar Oferta"
              >
                <MessageCircle className="h-3 w-3 mr-1" />
                <span className="text-xs">Aproveitar Oferta</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">

            {/* Image Section */}
            <div className="relative h-64 md:h-96 bg-gradient-to-br from-red-500 to-red-600">
              {promotion.image && !imageError ? (
                <Image
                  src={promotion.image}
                  alt={promotion.title}
                  fill
                  className="object-cover object-center"
                  onError={() => setImageError(true)}
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-white">
                    <Share2 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h2 className="text-2xl font-bold">{promotion.title}</h2>
                  </div>
                </div>
              )}

              {/* Status Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge className="bg-green-500 hover:bg-green-600">
                  Promoção Especial
                </Badge>
                {isExpired && (
                  <Badge variant="destructive">
                    Expirada
                  </Badge>
                )}
                {promotion.uniqueCode && (
                  <Link href={`/promo/${promotion.uniqueCode}`}>
                    <Badge variant="outline" className="bg-white/90 text-gray-800 cursor-pointer hover:bg-white transition-colors">
                      {promotion.uniqueCode}
                    </Badge>
                  </Link>
                )}
                {promotion.shortCode && (
                  <Link href={`/promo/${promotion.shortCode}`}>
                    <Badge variant="outline" className="bg-white/90 text-gray-800 cursor-pointer hover:bg-white transition-colors">
                      /promo/{promotion.shortCode}
                    </Badge>
                  </Link>
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 md:p-8">

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {promotion.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Válido até {formatDate(promotion.validUntil)}
                  </span>
                </div>

                {promotion.uniqueCode && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Código:</span>
                    <Badge variant="outline">{promotion.uniqueCode}</Badge>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span className="font-medium">Publicado em:</span>
                  <span>{formatDate(promotion.createdAt)}</span>
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-gray max-w-none mb-8">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {promotion.description}
                </p>
              </div>

              {/* CTA Section */}
              <div className="flex items-center justify-center gap-2">
                <Button
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl + '?utm_source=facebook&utm_medium=social&utm_campaign=promotion')}`, '_blank')}
                  variant="outline"
                  size="lg"
                  className="h-12 w-12 p-0"
                  title="Compartilhar no Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </Button>

                <Button
                  onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl + '?utm_source=twitter&utm_medium=social&utm_campaign=promotion')}&text=${encodeURIComponent(promotion.title)}`, '_blank')}
                  variant="outline"
                  size="lg"
                  className="h-12 w-12 p-0"
                  title="Compartilhar no Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </Button>

                <Button
                  onClick={async () => {
                    const success = await copyToClipboard(shareUrl + '?utm_source=instagram&utm_medium=social&utm_campaign=promotion')
                    if (success) {
                      setCopied(true)
                      setTimeout(() => setCopied(false), 2000)
                    }
                  }}
                  variant="outline"
                  size="lg"
                  className="h-12 w-12 p-0"
                  title="Copiar link para Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </Button>

                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  size="lg"
                  className="h-12 w-12 p-0"
                  title="Copiar link"
                >
                  {copied ? (
                    <Check className="h-5 w-5 text-green-600" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                </Button>

                <Button
                  onClick={handleShareWhatsApp}
                  variant="outline"
                  size="lg"
                  className="h-12 w-12 p-0"
                  title="Compartilhar no WhatsApp"
                >
                  <MessageCircle className="h-5 w-5" />
                </Button>

                <Button
                  onClick={handleWhatsAppClick}
                  size="lg"
                  className="h-12 bg-red-600 hover:bg-red-700 text-white px-6"
                  title="Aproveitar Oferta"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  <span>Aproveitar Oferta</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Schema.org Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Offer",
                "name": promotion.title,
                "description": promotion.description,
                "image": promotion.image ? [promotion.image] : [],
                "validThrough": promotion.validUntil,
                "seller": {
                  "@type": "Organization",
                  "name": "GymStarter"
                },
                "url": shareUrl
              })
            }}
          />
        </div>
      </div>
    </div>
  )
}