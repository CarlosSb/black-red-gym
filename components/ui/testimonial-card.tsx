"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, Quote } from "lucide-react"
import { StandardCard } from "./standard-card"
import { Badge } from "@/components/ui/badge"

interface Testimonial {
  id: string
  name: string
  content: string
  rating?: number
  image?: string
  category?: string
  isActive: boolean
  createdAt: string
}

interface TestimonialCardProps {
  testimonial: Testimonial
  onClick?: () => void
  className?: string
  showQuoteIcon?: boolean
}

export function TestimonialCard({
  testimonial,
  onClick,
  className,
  showQuoteIcon = true
}: TestimonialCardProps) {
  const [imageError, setImageError] = useState(false)

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
  }

  const renderStars = (rating: number = 5) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <StandardCard
      variant="testimonial"
      size="md"
      interactive={false}
      onClick={onClick}
      className={className}
      aria-label={`Depoimento de ${testimonial.name}. Avaliação: ${testimonial.rating || 5} estrelas. ${testimonial.category ? `Categoria: ${testimonial.category}` : ''}`}
    >
      <div className="p-6">
        {/* Quote Icon */}
        {showQuoteIcon && (
          <div className="flex justify-center mb-4">
            <Quote className="h-8 w-8 text-green-500 opacity-20" />
          </div>
        )}

        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-green-50 to-green-100 rounded-full flex items-center justify-center overflow-hidden shadow-sm">
            {testimonial.image && !imageError ? (
              <Image
                src={testimonial.image}
                alt={`Foto de ${testimonial.name}`}
                width={64}
                height={64}
                className="object-cover rounded-full"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {getInitials(testimonial.name)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Name */}
        <h3 className="font-semibold text-gray-900 text-center mb-2">
          {testimonial.name}
        </h3>

        {/* Category Badge */}
        {testimonial.category && (
          <div className="flex justify-center mb-4">
            <Badge variant="outline" className="text-xs">
              {testimonial.category}
            </Badge>
          </div>
        )}

        {/* Rating */}
        <div className="flex justify-center gap-1 mb-4">
          {renderStars(testimonial.rating)}
        </div>

        {/* Content */}
        <blockquote className="text-muted-foreground italic text-center leading-relaxed">
          &ldquo;{testimonial.content}&rdquo;
        </blockquote>
      </div>
    </StandardCard>
  )
}