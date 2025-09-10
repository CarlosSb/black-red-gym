"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TestimonialCard } from "@/components/ui/testimonial-card"

interface Testimonial {
  id: string
  name: string
  content: string
  rating: number
  category: string
  isActive: boolean
  createdAt: string
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[]
  autoPlay?: boolean
  autoPlayInterval?: number
}

export function TestimonialsCarousel({
  testimonials,
  autoPlay = true,
  autoPlayInterval = 5000
}: TestimonialsCarouselProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [startPos, setStartPos] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay)

  const carouselRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  // Duplicate testimonials for seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials]

  const scrollToNext = useCallback(() => {
    if (carouselRef.current) {
      // Calculate card width dynamically based on screen size
      const cardWidth = window.innerWidth < 640 ? 224 : window.innerWidth < 768 ? 240 : 256
      const gap = window.innerWidth < 640 ? 12 : window.innerWidth < 768 ? 16 : 24
      carouselRef.current.scrollBy({ left: cardWidth + gap, behavior: 'smooth' })
    }
  }, [])

  const scrollToPrev = useCallback(() => {
    if (carouselRef.current) {
      // Calculate card width dynamically based on screen size
      const cardWidth = window.innerWidth < 640 ? 224 : window.innerWidth < 768 ? 240 : 256
      const gap = window.innerWidth < 640 ? 12 : window.innerWidth < 768 ? 16 : 24
      carouselRef.current.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' })
    }
  }, [])

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && autoPlay) {
      autoPlayRef.current = setInterval(() => {
        scrollToNext()
      }, autoPlayInterval)
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [isAutoPlaying, autoPlay, autoPlayInterval, scrollToNext])

  // Pause auto-play on hover/drag
  const pauseAutoPlay = useCallback(() => {
    setIsAutoPlaying(false)
  }, [])

  const resumeAutoPlay = useCallback(() => {
    if (autoPlay) {
      setIsAutoPlaying(true)
    }
  }, [autoPlay])

  // Mouse/Touch event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    console.log('=== CARROSSEL MOUSE DOWN ===')
    console.log('Target:', e.target)
    console.log('Current target:', e.currentTarget)
    console.log('Target tagName:', (e.target as HTMLElement).tagName)
    console.log('Target className:', (e.target as HTMLElement).className)
    console.log('Target id:', (e.target as HTMLElement).id)
    console.log('Target textContent:', (e.target as HTMLElement).textContent)

    // Verificar se o clique foi em um botão ou elemento interativo
    const target = e.target as HTMLElement
    const isButton = target.tagName === 'BUTTON' || target.closest('button')
    const isLink = target.tagName === 'A' || target.closest('a')
    console.log('isButton:', isButton)
    console.log('isLink:', isLink)
    console.log('Closest button element:', target.closest('button'))
    console.log('Closest link element:', target.closest('a'))

    if (isButton || isLink) {
      console.log('Clique em elemento interativo - não iniciar drag')
      return
    }

    if (!carouselRef.current) return

    setIsDragging(true)
    setStartPos(e.pageX - carouselRef.current.offsetLeft)
    setScrollLeft(carouselRef.current.scrollLeft)
    pauseAutoPlay()
    console.log('=== DRAG INICIADO ===')
  }, [pauseAutoPlay])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return

    e.preventDefault()
    const x = e.pageX - carouselRef.current.offsetLeft
    const walk = (x - startPos) * 2
    carouselRef.current.scrollLeft = scrollLeft - walk
  }, [isDragging, startPos, scrollLeft])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setTimeout(resumeAutoPlay, 1000) // Resume after 1 second
  }, [resumeAutoPlay])

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false)
    setTimeout(resumeAutoPlay, 1000)
  }, [resumeAutoPlay])

  // Touch event handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!carouselRef.current) return

    setIsDragging(true)
    setStartPos(e.touches[0].pageX - carouselRef.current.offsetLeft)
    setScrollLeft(carouselRef.current.scrollLeft)
    pauseAutoPlay()
  }, [pauseAutoPlay])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || !carouselRef.current) return

    const x = e.touches[0].pageX - carouselRef.current.offsetLeft
    const walk = (x - startPos) * 2
    carouselRef.current.scrollLeft = scrollLeft - walk
  }, [isDragging, startPos, scrollLeft])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
    setTimeout(resumeAutoPlay, 1000)
  }, [resumeAutoPlay])

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      scrollToPrev()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      scrollToNext()
    }
  }, [scrollToPrev, scrollToNext])

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Nenhum depoimento disponível no momento.</p>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[340px]">
      {/* Navigation Buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-2 sm:left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 shadow-lg border-2 hover:scale-110 transition-all duration-200 w-8 h-8 sm:w-10 sm:h-10"
        onClick={scrollToPrev}
        aria-label="Depoimento anterior"
      >
        <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 sm:right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 shadow-lg border-2 hover:scale-110 transition-all duration-200 w-8 h-8 sm:w-10 sm:h-10"
        onClick={scrollToNext}
        aria-label="Próximo depoimento"
      >
        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
      </Button>

      {/* Carousel Container */}
      <div
        ref={carouselRef}
        className={`overflow-x-auto rounded-lg cursor-grab active:cursor-grabbing select-none scrollbar-hide h-[320px] ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="region"
        aria-label="Carrossel de depoimentos"
        onMouseEnter={pauseAutoPlay}
      >
        <div className="flex gap-3 sm:gap-4 md:gap-6 pb-4 h-full items-stretch" style={{ width: 'max-content' }}>
          {duplicatedTestimonials.map((testimonial, index) => (
            <div
              key={`${testimonial.id}-${index}`}
              className="flex-shrink-0 w-56 sm:w-60 md:w-64 h-full"
            >
              <TestimonialCard
                testimonial={testimonial}
                className="h-full"
                maxHeight={280}
                showReadMore={true}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, index) => (
          <div
            key={index}
            className="w-3 h-3 rounded-full bg-muted-foreground/30"
            aria-label={`Grupo de depoimentos ${index + 1}`}
          />
        ))}
      </div>

      {/* Auto-play indicator */}
      {isAutoPlaying && (
        <div className="flex justify-center mt-4">
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-red-accent rounded-full animate-pulse" />
            <div className="w-1 h-1 bg-red-accent rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-1 h-1 bg-red-accent rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      )}
    </div>
  )
}