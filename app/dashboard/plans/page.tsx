"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Users, DollarSign, Star, TrendingUp } from "lucide-react"
import { PlanModal } from "@/components/plan-modal"
import DataService, { type PlanData } from "@/lib/data-service"

export default function PlansPage() {
  const [plans, setPlans] = useState<PlanData[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<PlanData | null>(null)

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const loadedPlans = await DataService.getPlans()
        setPlans(loadedPlans)
      } catch (error) {
        console.error("Error loading plans:", error)
      }
    }
    loadPlans()
  }, [])

  const handleCreatePlan = () => {
    setSelectedPlan(null)
    setIsModalOpen(true)
  }

  const handleEditPlan = (plan: PlanData) => {
    setSelectedPlan(plan)
    setIsModalOpen(true)
  }

  const handleDeletePlan = async (planId: string) => {
    if (confirm("Tem certeza que deseja excluir este plano?")) {
      try {
        const success = await DataService.deletePlan(planId)
        if (success) {
          const updatedPlans = await DataService.getPlans()
          setPlans(updatedPlans)
        }
      } catch (error) {
        console.error("Error deleting plan:", error)
      }
    }
  }

  const handleSavePlan = async (savedPlan: PlanData) => {
    try {
      const updatedPlans = await DataService.getPlans()
      setPlans(updatedPlans)
    } catch (error) {
      console.error("Error loading plans:", error)
    }
  }

  const totalRevenue = plans.reduce((sum, plan) => sum + plan.monthlyRevenue, 0)
  const totalMembers = plans.reduce((sum, plan) => sum + plan.activeMembers, 0)

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gerenciar Planos</h1>
          <p className="text-muted-foreground">Configure e monitore os planos de assinatura da academia</p>
        </div>
        <Button onClick={handleCreatePlan} className="bg-red-accent hover:bg-red-accent/90 mt-4 sm:mt-0">
          <Plus className="mr-2 h-4 w-4" />
          Novo Plano
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Membros</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
            <p className="text-xs text-muted-foreground">Distribuídos em {plans.length} planos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalRevenue.toLocaleString("pt-BR")}</div>
            <p className="text-xs text-muted-foreground">Receita mensal dos planos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plano Mais Popular</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plans.find((p) => p.popular)?.name || "Nenhum"}</div>
            <p className="text-xs text-muted-foreground">
              {plans.find((p) => p.popular)?.activeMembers || 0} membros ativos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className={`relative ${plan.popular ? "border-red-accent" : ""}`}>
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-accent text-white">Mais Popular</Badge>
            )}

            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <Badge variant={plan.status === "active" ? "default" : "secondary"}>
                  {plan.status === "active" ? "Ativo" : "Inativo"}
                </Badge>
              </div>
              <CardDescription>{plan.description}</CardDescription>
              <div className="text-3xl font-bold text-red-accent">
                R$ {plan.price}
                <span className="text-lg text-muted-foreground">/mês</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Features */}
              <div>
                <h4 className="font-medium mb-2">Recursos inclusos:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Star className="h-3 w-3 text-red-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-3 w-3" />
                    Membros
                  </div>
                  <div className="font-bold">{plan.activeMembers}</div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <TrendingUp className="h-3 w-3" />
                    Receita
                  </div>
                  <div className="font-bold">R$ {plan.monthlyRevenue.toLocaleString("pt-BR")}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => handleEditPlan(plan)}
                >
                  <Edit className="mr-2 h-3 w-3" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive bg-transparent"
                  onClick={() => handleDeletePlan(plan.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <PlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePlan}
        plan={selectedPlan}
      />
    </div>
  )
}
