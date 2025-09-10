"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, ExternalLink, Heart } from "lucide-react"
import Image from "next/image"

interface Partner {
  id: string
  name: string
  description: string
  logo?: string
  link?: string
  category: string
  isActive: boolean
  createdAt: string
}

export function PartnersSection() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch('/api/partners?limit=8')
        const data = await response.json()

        if (data.success) {
          setPartners(data.partners)
        }
      } catch (error) {
        console.error('Erro ao carregar parceiros:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPartners()
  }, [])

  const handlePartnerClick = (link?: string) => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer')
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Users className="h-4 w-4" />
              Carregando parceiros...
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nossos Parceiros
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (partners.length === 0) {
    return null // Não mostrar seção se não houver parceiros
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Heart className="h-4 w-4" />
            Parceiros de Confiança
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Nossos Parceiros
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trabalhamos com os melhores profissionais para oferecer serviços completos para sua saúde e bem-estar.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {partners.map((partner) => (
            <Card
              key={partner.id}
              className={`group hover:shadow-lg transition-all duration-300 cursor-pointer ${
                partner.link ? 'hover:border-blue-200' : ''
              }`}
              onClick={() => handlePartnerClick(partner.link)}
            >
              <CardContent className="p-6 text-center">
                {/* Logo */}
                <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                  {partner.logo ? (
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      width={64}
                      height={64}
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <Users className="h-8 w-8 text-blue-600" />
                  )}
                </div>

                {/* Name */}
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {partner.name}
                </h3>

                {/* Category Badge */}
                <Badge variant="secondary" className="text-xs mb-2">
                  {partner.category}
                </Badge>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {partner.description}
                </p>

                {/* Link Indicator */}
                {partner.link && (
                  <div className="mt-3 flex items-center justify-center gap-1 text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="h-3 w-3" />
                    <span>Visitar</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Interessado em se tornar nosso parceiro?
          </p>
          <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
            <Users className="h-4 w-4" />
            Fale Conosco
          </button>
        </div>
      </div>
    </section>
  )
}