"use client"

import { useState } from "react"
import Image from "next/image"
import { Calendar, ExternalLink, Megaphone } from "lucide-react"
import { StandardCard } from "./standard-card"
import { Badge } from "@/components/ui/badge"

interface Ad {
  id: string
  title: string
  image?: string
  link?: string
  validUntil: string
  isActive: boolean
  featured?: boolean
  priority?: number
  displayOrder?: number
  createdAt: string
}

interface AdCardProps {
  ad: Ad
  onClick?: () => void
  className?: string
}

export function AdCard({ ad, onClick, className }: AdCardProps) {
  const [imageError, setImageError] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const isExpired = new Date(ad.validUntil) < new Date()

  const handleClick = () => {
    if (ad.link) {
      window.open(ad.link, '_blank', 'noopener,noreferrer')
    }
    onClick?.()
  }

  return (
    <StandardCard
      variant="ad"
      size="sm"
      featured={ad.featured}
      interactive={!!ad.link}
      onClick={handleClick}
      className={className}
      aria-label={`Anúncio: ${ad.title}. ${ad.isActive ? 'Ativo' : 'Inativo'}. ${isExpired ? 'Expirado' : `Válido até ${formatDate(ad.validUntil)}`}`}
    >
      {/* Image Section - Compact */}
      <div className="relative h-32 bg-gradient-to-br from-purple-500 to-purple-600 overflow-hidden">
        {ad.image && !imageError ? (
          <Image
            src={ad.image}
            alt={ad.title}
            fill
            className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Megaphone className="h-16 w-16 text-white/80" />
          </div>
        )}

        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge
            variant={ad.isActive ? "default" : "secondary"}
            className={ad.isActive ? "bg-green-500 hover:bg-green-600" : ""}
          >
            {ad.isActive ? 'Ativo' : 'Inativo'}
          </Badge>
          {isExpired && (
            <Badge variant="destructive">
              Expirado
            </Badge>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
          {ad.title}
        </h3>

        {/* Valid Until */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Calendar className="h-4 w-4 text-purple-500" />
          <span>
            Válido até {formatDate(ad.validUntil)}
          </span>
        </div>

        {/* Link Indicator */}
        {ad.link && (
          <div className="flex items-center justify-center gap-1 text-xs text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
            <ExternalLink className="h-3 w-3" />
            <span className="font-medium">Saiba mais</span>
          </div>
        )}

        {/* Priority Indicator (for admin/debug) */}
        {ad.priority && ad.priority > 0 && (
          <div className="mt-3 text-xs text-muted-foreground text-center">
            Prioridade: {ad.priority}
          </div>
        )}
      </div>
    </StandardCard>
  )
}