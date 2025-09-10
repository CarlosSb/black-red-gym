"use client"

import { useState, useEffect } from "react"
import { X, ExternalLink } from "lucide-react"
import Image from "next/image"

interface Ad {
  id: string
  title: string
  image?: string
  link?: string
  validUntil: string
  isActive: boolean
  createdAt: string
}

export function AdsBanner() {
  const [ads, setAds] = useState<Ad[]>([])
  const [currentAdIndex, setCurrentAdIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [loading, setLoading] = useState(true)

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

  // Auto-rotate ads every 10 seconds
  useEffect(() => {
    if (ads.length <= 1) return

    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length)
    }, 10000)

    return () => clearInterval(interval)
  }, [ads.length])

  const handleAdClick = (link?: string) => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer')
    }
  }

  const dismissBanner = () => {
    setIsVisible(false)
  }

  if (loading || ads.length === 0 || !isVisible) {
    return null
  }

  const currentAd = ads[currentAdIndex]

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-xs">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden transform transition-all duration-300 hover:shadow-xl">
        {/* Header with dismiss button */}
        <div className="flex items-center justify-between p-2 bg-gray-50 border-b">
          <span className="text-xs text-gray-600 font-medium">Patrocinado</span>
          <button
            onClick={dismissBanner}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            aria-label="Fechar anúncio"
          >
            <X className="h-3 w-3" />
          </button>
        </div>

        {/* Ad Content */}
        <div
          className="cursor-pointer group"
          onClick={() => handleAdClick(currentAd.link)}
        >
          {/* Image */}
          <div className="relative h-20 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
            {currentAd.image ? (
              <Image
                src={currentAd.image}
                alt={currentAd.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-gray-400 text-xs">Anúncio</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-3">
            <h4 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {currentAd.title}
            </h4>

            {/* Link indicator */}
            {currentAd.link && (
              <div className="flex items-center gap-1 text-xs text-blue-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="h-3 w-3" />
                <span>Saiba mais</span>
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