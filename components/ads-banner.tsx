"use client"

import { useState, useEffect } from "react"
import { X, ExternalLink, Megaphone } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

interface Ad {
   id: string
   title: string
   image?: string
   link?: string
   validUntil: string
   isActive: boolean
   featured: boolean
   priority: number
   displayOrder: number
   createdAt: string
}

export function AdsBanner() {
  const [ads, setAds] = useState<Ad[]>([])
  const [currentAdIndex, setCurrentAdIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isMinimized, setIsMinimized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch('/api/ads?limit=3')
        const data = await response.json()

        if (data.success && data.ads.length > 0) {
          setAds(data.ads)
        }
      } catch (error) {
        console.error('Erro ao carregar anúncios:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAds()
  }, [])

  // Auto-rotate ads every 10 seconds, prioritizing featured ads
  useEffect(() => {
    if (ads.length <= 1) return

    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => {
        // Prioritize featured ads and higher priority ads
        const featuredAds = ads.filter(ad => ad.featured)
        const regularAds = ads.filter(ad => !ad.featured)

        // If we have featured ads and current ad is not featured, switch to featured
        if (featuredAds.length > 0 && !ads[prev].featured) {
          // Find the featured ad with highest priority
          const highestPriorityFeatured = featuredAds.reduce((prev, current) =>
            current.priority > prev.priority ? current : prev
          )
          return ads.findIndex(ad => ad.id === highestPriorityFeatured.id)
        }

        // If current ad is featured, rotate through other featured ads first
        if (ads[prev].featured) {
          const featuredAds = ads.filter(ad => ad.featured)
          const currentFeaturedIndex = featuredAds.findIndex(ad => ad.id === ads[prev].id)
          const nextFeaturedIndex = (currentFeaturedIndex + 1) % featuredAds.length
          return ads.findIndex(ad => ad.id === featuredAds[nextFeaturedIndex].id)
        }

        // Regular rotation for non-featured ads
        return (prev + 1) % ads.length
      })
    }, 10000)

    return () => clearInterval(interval)
  }, [ads])

  const handleAdClick = (link?: string) => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer')
    }
  }

  const dismissBanner = () => {
    setIsMinimized(true)
  }

  const restoreBanner = () => {
    setIsMinimized(false)
  }

  const handleImageError = (imageUrl: string) => {
    setImageErrors(prev => new Set(prev).add(imageUrl))
  }

  const getImageSource = (imageUrl?: string) => {
    if (!imageUrl || imageErrors.has(imageUrl)) {
      return null // Não mostrar imagem se não existir ou der erro
    }
    return imageUrl
  }

  // Ocultar completamente apenas se não houver anúncios ou estiver carregando
  if (loading || ads.length === 0) {
    return null
  }

  // Verificar se estamos em uma tela muito pequena
  const isVerySmallScreen = typeof window !== 'undefined' && window.innerWidth < 360
  if (isVerySmallScreen) {
    return null // Não mostrar banner em telas muito pequenas
  }

  const currentAd = ads[currentAdIndex]

  return (
    <>
      {/* Minimized Banner */}
      {isMinimized ? (
        <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40">
          <button
            onClick={restoreBanner}
            className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 animate-pulse hover:animate-none hover:scale-110 relative"
            aria-label="Restaurar anúncio"
          >
            <Megaphone className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            {/* Soft glow effect */}
            <div className="absolute inset-0 rounded-full bg-blue-400 dark:bg-blue-500 opacity-20 animate-ping" />
          </button>
        </div>
      ) : (
        <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 w-80 sm:w-96 max-w-[calc(100vw-2rem)]">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transform transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-1 animate-in slide-in-from-left-4 duration-300 relative group">
        {/* Dismiss button in top-right corner */}
        <button
          onClick={dismissBanner}
          className="absolute top-2 right-2 z-10 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 opacity-70 hover:opacity-100"
          aria-label="Minimizar anúncio"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Ad Content */}
        <div
          className="cursor-pointer group flex flex-col"
          onClick={() => handleAdClick(currentAd.link)}
          role="button"
          tabIndex={0}
          aria-label={`Anúncio: ${currentAd.title}. ${currentAd.link ? 'Clique para visitar' : 'Anúncio informativo'}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleAdClick(currentAd.link)
            }
          }}
        >
          {/* Image */}
          <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden flex-shrink-0">
            {getImageSource(currentAd.image) ? (
              <Image
                src={currentAd.image!}
                alt={currentAd.title}
                fill
                loading="lazy"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => handleImageError(currentAd.image!)}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Megaphone className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
            )}
            {/* Featured badge overlay */}
            {currentAd.featured && (
              <div className="absolute top-2 left-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 opacity-90 shadow-sm">
                  ⭐ Destaque
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 flex-1 flex flex-col justify-between relative">
            <Badge variant="secondary" className="mb-2 w-fit">
              {currentAd.title}
            </Badge>

            {/* Link button in bottom-right corner */}
            {currentAd.link && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleAdClick(currentAd.link)
                }}
                className="absolute bottom-2 right-2 opacity-70 hover:opacity-100 transition-opacity p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
                aria-label="Saiba mais"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Ad indicators */}
        {ads.length > 1 && (
          <div className="flex justify-center gap-1 p-2 bg-gray-50 dark:bg-gray-700">
            {ads.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentAdIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentAdIndex
                    ? 'bg-blue-600 dark:bg-blue-500'
                    : 'bg-gray-300 dark:bg-gray-500 hover:bg-gray-400 dark:hover:bg-gray-400'
                }`}
                aria-label={`Ver anúncio ${index + 1}`}
              />
            ))}
          </div>
        )}
          </div>

          {/* Accessibility: Screen reader only content */}
          <div className="sr-only">
            {isMinimized ? (
              `Anúncio minimizado disponível. Clique para restaurar: ${currentAd.title}`
            ) : (
              `Anúncio patrocinado: ${currentAd.title}${currentAd.link ? ' - Link disponível' : ''}`
            )}
          </div>
        </div>
      )}
    </>
  )
}