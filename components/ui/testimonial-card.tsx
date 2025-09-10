"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, Quote, ChevronDown, ChevronUp } from "lucide-react"
import { StandardCard } from "./standard-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

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
  maxHeight?: number
  showReadMore?: boolean
}

export function TestimonialCard({
  testimonial,
  onClick,
  className,
  showQuoteIcon = true,
  maxHeight = 300,
  showReadMore = true
}: TestimonialCardProps) {
  const [imageError, setImageError] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showPopover, setShowPopover] = useState(false)

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
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ))
  }

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  }

  const shouldShowReadMore = testimonial.content.length > 140 && showReadMore

  const TestimonialContent = ({ isModal = false }: { isModal?: boolean }) => (
    <div className={`${isModal ? 'p-2 sm:p-3' : 'p-3 sm:p-4'} ${!isModal && maxHeight ? `max-h-[${maxHeight}px]` : ''} overflow-hidden flex flex-col h-full min-h-0`}>
      {/* Header Section */}
      <div className="flex-shrink-0">
        {/* Quote Icon */}
        {showQuoteIcon && (
          <div className="flex justify-center mb-0.5 sm:mb-1">
            <Quote className={`h-3 w-3 sm:h-4 sm:w-4 ${isModal ? 'sm:h-5 sm:w-5' : 'sm:h-4 sm:w-4'} text-green-500 opacity-20`} />
          </div>
        )}

        {/* Avatar */}
        <div className="flex justify-center mb-0.5 sm:mb-1">
          <div className={`bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-full flex items-center justify-center overflow-hidden shadow-sm ${
            isModal ? 'w-10 h-10 sm:w-12 sm:h-12' : 'w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12'
          }`}>
            {testimonial.image && !imageError ? (
              <Image
                src={testimonial.image}
                alt={`Foto de ${testimonial.name}`}
                width={64}
                height={64}
                className="object-cover rounded-full w-full h-full"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <span className={`text-white font-bold ${
                  isModal ? 'text-sm sm:text-base' : 'text-xs sm:text-sm md:text-base'
                }`}>
                  {getInitials(testimonial.name)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Name */}
        <h3 className={`font-semibold text-gray-900 dark:text-gray-100 text-center mb-0.5 text-xs sm:text-sm ${
          isModal ? 'sm:text-base' : ''
        }`}>
          {testimonial.name}
        </h3>

        {/* Category Badge */}
        {testimonial.category && (
          <div className="flex justify-center mb-0.5 sm:mb-1">
            <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300 px-1.5 py-0.5 text-xs">
              {testimonial.category}
            </Badge>
          </div>
        )}

        {/* Rating */}
        <div className="flex justify-center gap-0.5 mb-0.5 sm:mb-1">
          {renderStars(testimonial.rating)}
        </div>
      </div>

      {/* Content Section - Flexible */}
      <div className="flex-1 flex flex-col justify-between min-h-0">
        {/* Content */}
        <blockquote className={`text-muted-foreground dark:text-gray-400 italic text-center leading-relaxed flex-1 min-h-0 ${
          isModal ? 'text-sm sm:text-base' : 'text-sm sm:text-base'
        } ${!isModal ? 'line-clamp-3 sm:line-clamp-4' : 'line-clamp-none'}`}>
          &ldquo;{(() => {
            const content = isModal ? testimonial.content : truncateText(testimonial.content);
            console.log('Renderizando conteúdo:', { isModal, contentLength: content.length, originalLength: testimonial.content.length, timestamp: Date.now() });
            return content;
          })()}&rdquo;
        </blockquote>

        {/* Action Buttons */}
        {shouldShowReadMore && !isModal && (
          <div className="flex justify-center items-center gap-1 mt-0.5 opacity-70 hover:opacity-100 transition-opacity duration-300">
            <Popover open={showPopover} onOpenChange={setShowPopover}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    console.log('=== BOTÃO LER MAIS CLICADO - INÍCIO ===')
                    console.log('Timestamp:', Date.now())
                    console.log('Evento original:', e)
                    console.log('Target:', e.target)
                    console.log('Current target:', e.currentTarget)
                    console.log('Target tagName:', (e.target as HTMLElement).tagName)

                    e.preventDefault()
                    e.stopPropagation()

                    console.log('Abrindo popover')
                    setShowPopover(true)
                    console.log('=== FIM DO CLIQUE ===')
                  }}
                  className="text-red-accent hover:text-red-accent/90 hover:bg-red-accent/5 px-1.5 py-0.5 h-auto text-xs font-medium rounded-full transition-all duration-300 hover:scale-105"
                  aria-label="Ler depoimento completo"
                >
                  <ChevronDown className="h-2.5 w-2.5 mr-0.5 transition-transform duration-200" />
                  <span className="transition-all duration-200">Ler mais</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 shadow-lg border border-gray-200 dark:border-gray-700" side="top" align="center">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <TestimonialContent isModal={true} />
                  <div className="flex justify-end mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPopover(false)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      Fechar
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Dialog open={showModal} onOpenChange={setShowModal}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-red-accent hover:bg-red-accent/5 p-0.5 h-auto rounded-full transition-all duration-300 hover:scale-105"
                  aria-label="Abrir depoimento completo em modal"
                >
                  <span className="text-xs">📖</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden p-3 sm:p-4">
                <DialogHeader className="pb-2">
                  <DialogTitle className="text-center text-base sm:text-lg">Depoimento Completo</DialogTitle>
                </DialogHeader>
                <div className="max-h-[75vh] overflow-y-auto">
                  <TestimonialContent isModal={true} />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <StandardCard
      variant="testimonial"
      size="md"
      interactive={false}
      onClick={onClick}
      className={className}
      maxHeight={maxHeight}
      aria-label={`Depoimento de ${testimonial.name}. Avaliação: ${testimonial.rating || 5} estrelas. ${testimonial.category ? `Categoria: ${testimonial.category}` : ''}`}
    >
      <TestimonialContent />
    </StandardCard>
  )
}