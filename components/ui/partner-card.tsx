"use client"

import { useState } from "react"
import Image from "next/image"
import { Users, ExternalLink } from "lucide-react"
import { StandardCard } from "./standard-card"
import { Badge } from "@/components/ui/badge"

interface Partner {
  id: string
  name: string
  description: string
  logo?: string
  link?: string
  category: string
  isActive: boolean
  featured?: boolean
  priority?: number
  displayOrder?: number
  createdAt: string
}

interface PartnerCardProps {
  partner: Partner
  onClick?: () => void
  className?: string
}

export function PartnerCard({ partner, onClick, className }: PartnerCardProps) {
  const [imageError, setImageError] = useState(false)

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
  }

  const handleClick = () => {
    if (partner.link) {
      window.open(partner.link, '_blank', 'noopener,noreferrer')
    }
    onClick?.()
  }

  return (
    <StandardCard
      variant="partner"
      size="sm"
      featured={partner.featured}
      interactive={!!partner.link}
      onClick={handleClick}
      className={`${className}`}
      aria-label={`Parceiro: ${partner.name}. Categoria: ${partner.category}. ${partner.link ? 'Link disponível' : 'Sem link'}`}
    >
      <div className="p-6 text-center">
        {/* Logo/Avatar */}
        <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden shadow-sm">
          {partner.logo && !imageError ? (
            <Image
              src={partner.logo}
              alt={`Logo ${partner.name}`}
              width={64}
              height={64}
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {getInitials(partner.name)}
              </span>
            </div>
          )}
        </div>

        {/* Name */}
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
          {partner.name}
        </h3>

        {/* Category Badge */}
        <Badge variant="secondary" className="text-xs mb-3">
          {partner.category}
        </Badge>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
          {partner.description}
        </p>

        {/* Link Indicator */}
        {partner.link && (
          <div className="flex items-center justify-center gap-1 text-xs text-blue-600 ">
            <ExternalLink className="h-3 w-3" />
            <span className="font-medium">Visitar site</span>
          </div>
        )}

      </div>
    </StandardCard>
  )
}