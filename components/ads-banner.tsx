"use client"

import { useState, useEffect } from "react"
import { X, ExternalLink, Megaphone } from "lucide-react"
import Image from "next/image"

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
    setIsVisible(false)
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

  // Ocultar em telas muito pequenas para evitar problemas de usabilidade
  if (loading || ads.length === 0 || !isVisible) {
    return null
  }

  // Verificar se estamos em uma tela muito pequena
  const isVerySmallScreen = typeof window !== 'undefined' && window.innerWidth < 480
  if (isVerySmallScreen) {
    return null // Não mostrar banner em telas muito pequenas
  }

  const currentAd = ads[currentAdIndex]

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 w-80">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden transform transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-1 animate-in slide-in-from-left-4 duration-300 min-h-[200px] max-h-[200px]">
        {/* Header with dismiss button */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 font-semibold">Patrocinado</span>
            {currentAd.featured && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                ⭐ Destaque
              </span>
            )}
          </div>
          <button
            onClick={dismissBanner}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
            aria-label="Fechar anúncio"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Ad Content */}
        <div
          className="cursor-pointer group h-[160px] flex flex-col"
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
          <div className="relative h-24 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden flex-shrink-0">
            {getImageSource(currentAd.image) ? (
              <Image
                src={currentAd.image!}
                alt={currentAd.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => handleImageError(currentAd.image!)}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Megaphone className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 flex-1 flex flex-col justify-between">
            <h4 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {currentAd.title}
            </h4>

            {/* Link indicator */}
            {currentAd.link && (
              <div className="flex items-center gap-1 text-xs text-blue-600 mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="h-3 w-3" />
                <span className="font-medium">Saiba mais</span>
              </div>
            )}
          </div>
        </div>

        {/* Ad indicators */}
        {ads.length > 1 && (
          <div className="flex justify-center gap-1 p-2 bg-gray-50">
            {ads.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentAdIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentAdIndex
                    ? 'bg-blue-600'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Ver anúncio ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Accessibility: Screen reader only content */}
      <div className="sr-only">
        Anúncio patrocinado: {currentAd.title}
        {currentAd.link && " - Link disponível"}
      </div>
    </div>
  )
}