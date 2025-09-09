"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CheckCircle, Star, Users, Clock, Trophy, Dumbbell } from "lucide-react"
import { toast } from "@/hooks/use-toast"

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
  const router = useRouter()

  const handlePlanSelection = () => {
    // Salvar plano selecionado no localStorage para uso posterior
    localStorage.setItem("selectedPlan", JSON.stringify({
      id: plan.id,
      name: plan.name,
      price: plan.price
    }))

    toast({
      title: "Plano selecionado!",
      description: `Você selecionou o plano ${plan.name}. Vamos prosseguir com o cadastro.`,
    })

    setIsOpen(false)

    // Redirecionar para cadastro após um pequeno delay
    setTimeout(() => {
      router.push("/register")
    }, 1500)
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            {getPlanIcon(plan.name)}
          </div>
          <DialogTitle className="text-center text-2xl">
            {plan.name}
            {plan.popular && (
              <Badge className="ml-2 bg-yellow-500 text-black">
                Mais Popular
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription className="text-center">
            {plan.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Preço */}
          <div className="text-center">
            <div className="text-4xl font-bold text-red-accent">
              R$ {plan.price}
              <span className="text-lg text-muted-foreground">/mês</span>
            </div>
          </div>

          {/* Benefícios */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              O que está incluído:
            </h4>
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Benefícios adicionais */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <h5 className="font-semibold mb-2">Benefícios Exclusivos:</h5>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Acesso 24/7 à academia</li>
                <li>• Avaliação física gratuita</li>
                <li>• Suporte personalizado</li>
                <li>• Cancelamento flexível</li>
              </ul>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsOpen(false)}
            >
              Ver outros planos
            </Button>
            <Button
              className="flex-1 bg-red-accent hover:bg-red-accent/90"
              onClick={handlePlanSelection}
            >
              Escolher este plano
            </Button>
          </div>

          {/* Nota */}
          <p className="text-xs text-muted-foreground text-center">
            Ao escolher este plano, você será redirecionado para o cadastro.
            Não se preocupe, você pode alterar seu plano posteriormente.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}