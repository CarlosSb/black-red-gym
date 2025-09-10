"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Share2, MessageCircle, Facebook, Twitter, Instagram, Copy, Check } from "lucide-react"
import { StandardCard } from "./standard-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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

interface PromotionCardProps {
  promotion: Promotion
  onClick?: () => void
  className?: string
}

export function PromotionCard({ promotion, onClick, className }: PromotionCardProps) {
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

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5511999999999'
    const code = promotion.uniqueCode || promotion.id
    const shortUrl = promotion.shortCode ? `${baseUrl}/promo/${promotion.shortCode}` : getPromotionUrl()
    const message = `Olá! Gostaria de aderir ou saber mais sobre a promoção ${promotion.title}.\n\nCódigo da promoção: ${code}\n\nLink: ${shortUrl}`
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const url = `${baseUrl}/promotion/${promotion.id}?utm_source=copy&utm_medium=link&utm_campaign=promotion`
    const success = await copyToClipboard(url)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getPromotionUrl = () => {
    const path = promotion.uniqueCode ? promotion.uniqueCode : promotion.id
    return `${baseUrl}/promotion/${path}`
  }

  const handleSocialShare = (platform: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const baseUrl = getPromotionUrl()
    const urlWithUtm = `${baseUrl}?utm_source=${platform}&utm_medium=social&utm_campaign=promotion`
    const text = encodeURIComponent(promotion.title)

    switch (platform) {
      case 'facebook':
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlWithUtm)}`
        window.open(facebookUrl, '_blank', 'noopener,noreferrer')
        break
      case 'twitter':
        const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(urlWithUtm)}&text=${text}`
        window.open(twitterUrl, '_blank', 'noopener,noreferrer')
        break
      case 'instagram':
        // Instagram doesn't have a direct share URL, so copy to clipboard
        copyToClipboard(urlWithUtm).then(success => {
          if (success) {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          }
        })
        break
      case 'whatsapp':
        const whatsappShareMessage = `Confira esta promoção incrível: ${promotion.title}\n\n${promotion.description}\n\nLink: ${urlWithUtm}\n\nCódigo: ${promotion.uniqueCode || promotion.id}`
        const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(whatsappShareMessage)}`
        window.open(whatsappShareUrl, '_blank', 'noopener,noreferrer')
        break
    }
  }


  return (
    <StandardCard
      variant="promotion"
      size="sm"
      interactive={true}
      className={`max-w-sm ${className || ''} cursor-auto`}
      aria-label={`Promoção: ${promotion.title}. ${promotion.isActive ? 'Ativa' : 'Inativa'}. ${isExpired ? 'Expirada' : `Válida até ${formatDate(promotion.validUntil)}`}`}
    >
      {/* Image Section - Full width, prominent height */}
      <div className="relative h-48 bg-gradient-to-br from-red-500 to-red-600 overflow-hidden">
        {promotion.image && !imageError ? (
          <Image
            src={promotion.image}
            alt={promotion.title}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Share2 className="h-12 w-12 text-white/80" />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <Badge className="bg-white/90 text-red-600 hover:bg-white text-xs">
            Promoção
          </Badge>
        </div>

        {/* Unique Code and Short URL Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {promotion.uniqueCode && (
            <Link href={`/promo/${promotion.uniqueCode}`}>
              <Badge variant="outline" className="bg-white/90 text-gray-800 text-xs cursor-pointer hover:bg-white transition-colors">
                {promotion.uniqueCode}
              </Badge>
            </Link>
          )}
          {promotion.shortCode && (
            <Link href={`/promo/${promotion.shortCode}`}>
              <Badge variant="outline" className="bg-white/90 text-gray-800 text-xs cursor-pointer hover:bg-white transition-colors">
                /promo/{promotion.shortCode}
              </Badge>
            </Link>
          )}
        </div>
      </div>

      {/* Content - More compact */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
          {promotion.title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
          {promotion.description}
        </p>

        {/* Meta Information */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <Calendar className="h-3 w-3" />
          <span>Até {formatDate(promotion.validUntil)}</span>
        </div>

        {/* Share Buttons */}
        <div className="flex items-center justify-center gap-1 mb-3">
          <Button
            size="sm"
            variant="outline"
            className="h-7 w-7 p-0"
            onClick={(e) => handleSocialShare('facebook', e)}
            title="Compartilhar no Facebook"
          >
            <Facebook className="h-3 w-3" />
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="h-7 w-7 p-0"
            onClick={(e) => handleSocialShare('twitter', e)}
            title="Compartilhar no Twitter"
          >
            <Twitter className="h-3 w-3" />
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="h-7 w-7 p-0"
            onClick={(e) => handleSocialShare('instagram', e)}
            title="Compartilhar no Instagram"
          >
            <Instagram className="h-3 w-3" />
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="h-7 w-7 p-0"
            onClick={handleCopyLink}
            title="Copiar link"
          >
            {copied ? (
              <Check className="h-3 w-3 text-green-600" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="h-7 w-7 p-0"
            onClick={(e) => handleSocialShare('whatsapp', e)}
            title="Compartilhar no WhatsApp"
          >
            <MessageCircle className="h-3 w-3" />
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <Link href={getPromotionUrl()}>
            <Button
              size="sm"
              variant="outline"
              className="w-full h-8"
              title="Saiba mais sobre esta promoção"
            >
              <span className="text-sm">Saiba mais</span>
            </Button>
          </Link>

          <Button
            size="sm"
            className="w-full h-8 bg-red-600 hover:bg-red-700 text-white"
            onClick={handleWhatsAppClick}
            title="Aproveitar Oferta"
          >
            <MessageCircle className="h-3 w-3 mr-2" />
            <span className="text-sm">Aproveitar Oferta</span>
          </Button>
        </div>

      </div>
    </StandardCard>
  )
}
