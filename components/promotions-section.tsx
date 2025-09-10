"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Gift, Sparkles } from "lucide-react"
import Image from "next/image"

interface Promotion {
  id: string
  title: string
  description: string
  image?: string
  validUntil: string
  isActive: boolean
  createdAt: string
}

export function PromotionsSection() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await fetch('/api/promotions?limit=6')
        const data = await response.json()

        if (data.success) {
          setPromotions(data.promotions)
        }
      } catch (error) {
        console.error('Erro ao carregar promoções:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPromotions()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-red-accent/10 text-red-accent px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              Carregando promoções...
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ofertas Especiais
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (promotions.length === 0) {
    return null // Não mostrar seção se não houver promoções
  }

  return (
    <section className="py-20 bg-gradient-to-br from-red-50 to-orange-50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Gift className="h-4 w-4" />
            Promoções Ativas
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ofertas Especiais
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Aproveite nossas promoções exclusivas e transforme seu corpo com desconto!
          </p>
        </div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {promotions.map((promotion) => (
            <Card
              key={promotion.id}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-48 bg-gradient-to-br from-red-accent to-red-600 overflow-hidden">
                {promotion.image ? (
                  <Image
                    src={promotion.image}
                    alt={promotion.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Gift className="h-16 w-16 text-white/80" />
                  </div>
                )}

                {/* Badge */}
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/90 text-red-accent hover:bg-white">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Promoção
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Title */}
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-red-accent transition-colors">
                  {promotion.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {promotion.description}
                </p>

                {/* Valid Until */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Válido até {formatDate(promotion.validUntil)}</span>
                </div>

                {/* CTA Button */}
                <button className="w-full mt-4 bg-red-accent hover:bg-red-accent/90 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200">
                  Aproveitar Oferta
                </button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Não encontrou a promoção que procura?
          </p>
          <button className="inline-flex items-center gap-2 bg-black hover:bg-black/90 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
            <Gift className="h-4 w-4" />
            Ver Todas as Promoções
          </button>
        </div>
      </div>
    </section>
  )
}