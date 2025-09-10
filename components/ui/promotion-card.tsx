"use client"

import { useState } from "react"
import Image from "next/image"
import { Calendar, Gift, ExternalLink } from "lucide-react"
import { StandardCard } from "./standard-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Promotion {
  id: string
  title: string
  description: string
  image?: string
  validUntil: string
  isActive: boolean
  featured?: boolean
  createdAt: string
}

interface PromotionCardProps {
  promotion: Promotion
  onClick?: () => void
  className?: string
}

export function PromotionCard({ promotion, onClick, className }: PromotionCardProps) {
  const [imageError, setImageError] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const isExpired = new Date(promotion.validUntil) < new Date()

  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  return (
    <StandardCard
      variant="promotion"
      size="sm"
      featured={promotion.featured}
      interactive={true}
      onClick={handleClick}
      className={className}
      aria-label={`Promoção: ${promotion.title}. ${promotion.isActive ? 'Ativa' : 'Inativa'}. ${isExpired ? 'Expirada' : `Válida até ${formatDate(promotion.validUntil)}`}`}
    >
      {/* Image Section - Compact */}
      <div className="relative h-32 bg-gradient-to-br from-red-500 to-red-600 overflow-hidden">
        {promotion.image && !imageError ? (
          <Image
            src={promotion.image}
            alt={promotion.title}
            fill
            className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Gift className="h-16 w-16 text-white/80" />
          </div>
        )}

        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge
            variant={promotion.isActive ? "default" : "secondary"}
            className={promotion.isActive ? "bg-green-500 hover:bg-green-600" : ""}
          >
            {promotion.isActive ? 'Ativa' : 'Inativa'}
          </Badge>
          {isExpired && (
            <Badge variant="destructive">
              Expirada
            </Badge>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
          {promotion.title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground mb-4 line-clamp-3 text-sm leading-relaxed">
          {promotion.description}
        </p>

        {/* Valid Until */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Calendar className="h-4 w-4 text-red-500" />
          <span>
            Válido até {formatDate(promotion.validUntil)}
          </span>
        </div>

        {/* CTA Button */}
        <Button
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium transition-colors duration-200"
          onClick={(e) => {
            e.stopPropagation()
            handleClick()
          }}
        >
          Aproveitar Oferta
          <ExternalLink className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </StandardCard>
  )
}