"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Gift, Sparkles, Users, ExternalLink, Megaphone } from "lucide-react"
import Image from "next/image"
import { PromotionCard } from "./ui/promotion-card"
import { PartnerCard } from "./ui/partner-card"
import { AdCard } from "./ui/ad-card"

interface Promotion {
  id: string
  title: string
  description: string
  image?: string
  validUntil: string
  isActive: boolean
  createdAt: string
}

interface Partner {
   id: string
   name: string
   description: string
   logo?: string
   link?: string
   category: string
   isActive: boolean
   featured: boolean
   priority: number
   displayOrder: number
   createdAt: string
}

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

export function UnifiedContentSection() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [partners, setPartners] = useState<Partner[]>([])
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [promotionsRes, partnersRes, adsRes] = await Promise.all([
          fetch('/api/promotions?limit=6'),
          fetch('/api/partners?limit=8'),
          fetch('/api/ads?limit=3')
        ])

        const [promotionsData, partnersData, adsData] = await Promise.all([
          promotionsRes.json(),
          partnersRes.json(),
          adsRes.json()
        ])

        if (promotionsData.success) setPromotions(promotionsData.promotions)
        if (partnersData.success) {
          // Ordenar parceiros: featured primeiro, depois por prioridade, depois por ordem de exibição
          const sortedPartners = partnersData.partners.sort((a: Partner, b: Partner) => {
            // Featured tem prioridade máxima
            if (a.featured && !b.featured) return -1
            if (!a.featured && b.featured) return 1

            // Entre featured ou não-featured, ordenar por prioridade
            if (a.priority !== b.priority) return b.priority - a.priority

            // Se prioridade igual, ordenar por displayOrder
            return a.displayOrder - b.displayOrder
          })
          setPartners(sortedPartners)
        }
        if (adsData.success) {
          // Ordenar anúncios: featured primeiro, depois por prioridade, depois por ordem de exibição
          const sortedAds = adsData.ads.sort((a: Ad, b: Ad) => {
            // Featured tem prioridade máxima
            if (a.featured && !b.featured) return -1
            if (!a.featured && b.featured) return 1

            // Entre featured ou não-featured, ordenar por prioridade
            if (a.priority !== b.priority) return b.priority - a.priority

            // Se prioridade igual, ordenar por displayOrder
            return a.displayOrder - b.displayOrder
          })
          setAds(sortedAds)
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
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
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4 animate-pulse" />
              Carregando conteúdo...
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
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

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Conteúdo Especial
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Descubra Nossas Ofertas
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Promoções exclusivas, parceiros confiáveis e anúncios especiais para você
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="promotions" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="promotions" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Promoções
            </TabsTrigger>
            <TabsTrigger value="partners" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Parceiros
            </TabsTrigger>
            <TabsTrigger value="ads" className="flex items-center gap-2">
              <Megaphone className="h-4 w-4" />
              Anúncios
            </TabsTrigger>
          </TabsList>

          {/* Promotions Tab */}
          <TabsContent value="promotions">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {promotions.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhuma promoção disponível no momento</p>
                </div>
              ) : (
                promotions.map((promotion) => (
                  <PromotionCard
                    key={promotion.id}
                    promotion={promotion}
                    onClick={() => {
                      // Handle promotion click
                      console.log('Promotion clicked:', promotion.id)
                    }}
                  />
                ))
              )}
            </div>
          </TabsContent>

          {/* Partners Tab */}
          <TabsContent value="partners">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {partners.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhum parceiro disponível no momento</p>
                </div>
              ) : (
                partners.map((partner) => (
                  <PartnerCard
                    key={partner.id}
                    partner={partner}
                    onClick={() => {
                      // Handle partner click
                      console.log('Partner clicked:', partner.id)
                    }}
                  />
                ))
              )}
            </div>
          </TabsContent>

          {/* Ads Tab */}
          <TabsContent value="ads">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {ads.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhum anúncio disponível no momento</p>
                </div>
              ) : (
                ads.map((ad) => (
                  <AdCard
                    key={ad.id}
                    ad={ad}
                    onClick={() => {
                      // Handle ad click
                      console.log('Ad clicked:', ad.id)
                    }}
                  />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}