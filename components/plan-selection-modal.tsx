"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CheckCircle, Star, Users, Clock, Trophy, Dumbbell, MessageCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import DataService, { type AcademySettingsData } from "@/lib/data-service"

interface Plan {
  id: string
  name: string
  price: number
  description: string
  features: string[]
  popular?: boolean
}

interface PlanSelectionModalProps {
  plan: Plan
  children: React.ReactNode
}

export function PlanSelectionModal({ plan, children }: PlanSelectionModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<AcademySettingsData | null>(null)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const academySettings = await DataService.getSettings()
        setSettings(academySettings)
      } catch (error) {
        console.error("Error loading settings:", error)
      }
    }
    loadSettings()
  }, [])

  const handlePlanSelection = () => {
    if (!settings?.whatsapp) {
      toast({
        title: "Erro",
        description: "Número do WhatsApp não configurado. Entre em contato conosco.",
        variant: "destructive"
      })
      return
    }

    // Criar mensagem personalizada para WhatsApp
    const message = encodeURIComponent(
      `Olá! Gostaria de me matricular no plano *${plan.name}* da Black Red Academia.\n\n` +
      `📋 *Detalhes do Plano:*\n` +
      `• Nome: ${plan.name}\n` +
      `• Valor: R$ ${plan.price}/mês\n` +
      `• Descrição: ${plan.description}\n\n` +
      `✅ *Benefícios incluídos:*\n` +
      plan.features.map(feature => `• ${feature}`).join('\n') + '\n\n' +
      `Estou interessado em começar minha jornada fitness! Aguardo seu contato para prosseguir com a matrícula.`
    )

    // Criar URL do WhatsApp
    const whatsappUrl = `https://wa.me/${settings.whatsapp}?text=${message}`

    toast({
      title: "Redirecionando para WhatsApp",
      description: `Abrindo conversa com a Black Red Academia sobre o plano ${plan.name}.`,
    })

    setIsOpen(false)

    // Abrir WhatsApp após um pequeno delay
    setTimeout(() => {
      window.open(whatsappUrl, '_blank')
    }, 1000)
  }

  const getPlanIcon = (planName: string) => {
    if (planName.toLowerCase().includes("premium") || planName.toLowerCase().includes("vip")) {
      return <Trophy className="h-8 w-8 text-yellow-500" />
    }
    if (planName.toLowerCase().includes("musculação")) {
      return <Dumbbell className="h-8 w-8 text-red-600" />
    }
    return <Users className="h-8 w-8 text-blue-600" />
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            {getPlanIcon(plan.name)}
          </div>
          <DialogTitle className="text-center text-xl sm:text-2xl">
            {plan.name}
            {plan.popular && (
              <Badge className="ml-2 bg-yellow-500 text-black text-xs">
                Mais Popular
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription className="text-center text-sm">
            {plan.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Preço */}
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-red-accent">
              R$ {plan.price}
              <span className="text-base sm:text-lg text-muted-foreground">/mês</span>
            </div>
          </div>

          {/* Benefícios */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              O que está incluído:
            </h4>
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Benefícios adicionais */}
          <Card className="bg-muted/30">
            <CardContent className="p-3 sm:p-4">
              <h5 className="font-semibold mb-2 text-sm sm:text-base">Benefícios Exclusivos:</h5>
              <ul className="text-xs sm:text-sm space-y-1 text-muted-foreground">
                <li>• Acesso 24/7 à academia</li>
                <li>• Avaliação física gratuita</li>
                <li>• Suporte personalizado</li>
                <li>• Cancelamento flexível</li>
              </ul>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsOpen(false)}
            >
              Ver outros planos
            </Button>
            <Button
              className="flex-1 bg-red-accent hover:bg-red-accent/90 flex items-center gap-2"
              onClick={handlePlanSelection}
            >
              <MessageCircle className="h-4 w-4" />
              Escolher este plano
            </Button>
          </div>

          {/* Nota */}
          <p className="text-xs text-muted-foreground text-center">
            Ao escolher este plano, você será direcionado para o WhatsApp
            para finalizar sua matrícula com nossa equipe.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}