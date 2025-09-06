"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, X, Loader2 } from "lucide-react"
import DataService, { type PlanData } from "@/lib/data-service"

interface PlanModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (plan: PlanData) => void
  plan?: PlanData | null
}

export function PlanModal({ isOpen, onClose, onSave, plan }: PlanModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    description: "",
    features: [""],
    status: "active" as "active" | "inactive",
    popular: false,
    activeMembers: 0,
    monthlyRevenue: 0,
  })

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name,
        price: plan.price,
        description: plan.description,
        features: plan.features.length > 0 ? plan.features : [""],
        status: plan.status,
        popular: plan.popular || false,
        activeMembers: plan.activeMembers,
        monthlyRevenue: plan.monthlyRevenue,
      })
    } else {
      setFormData({
        name: "",
        price: 0,
        description: "",
        features: [""],
        status: "active",
        popular: false,
        activeMembers: 0,
        monthlyRevenue: 0,
      })
    }
  }, [plan, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const planData = {
        ...formData,
        features: formData.features.filter((f) => f.trim() !== ""),
      }

      let savedPlan: PlanData

      if (plan) {
        // Update existing plan
        const updatedPlan = await DataService.updatePlan(plan.id, planData)
        if (!updatedPlan) throw new Error("Failed to update plan")
        savedPlan = updatedPlan
      } else {
        // Create new plan
        savedPlan = await DataService.createPlan(planData)
      }

      onSave(savedPlan)
      onClose()
    } catch (error) {
      console.error("Error saving plan:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }))
  }

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }))
  }

  const updateFeature = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((f, i) => (i === index ? value : f)),
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{plan ? "Editar Plano" : "Novo Plano"}</DialogTitle>
          <DialogDescription>
            {plan ? "Edite as informações do plano" : "Crie um novo plano de assinatura"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Plano</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Premium"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData((prev) => ({ ...prev, price: Number(e.target.value) }))}
                placeholder="149"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Para quem quer mais resultados"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Recursos Inclusos</Label>
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    placeholder="Ex: Acesso à musculação"
                  />
                  {formData.features.length > 1 && (
                    <Button type="button" variant="outline" size="sm" onClick={() => removeFeature(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addFeature} className="w-full bg-transparent">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Recurso
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="activeMembers">Membros Ativos</Label>
              <Input
                id="activeMembers"
                type="number"
                value={formData.activeMembers}
                onChange={(e) => setFormData((prev) => ({ ...prev, activeMembers: Number(e.target.value) }))}
                placeholder="0"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyRevenue">Receita Mensal (R$)</Label>
              <Input
                id="monthlyRevenue"
                type="number"
                value={formData.monthlyRevenue}
                onChange={(e) => setFormData((prev) => ({ ...prev, monthlyRevenue: Number(e.target.value) }))}
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="status"
                checked={formData.status === "active"}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, status: checked ? "active" : "inactive" }))
                }
              />
              <Label htmlFor="status">Plano Ativo</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="popular"
                checked={formData.popular}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, popular: checked }))}
              />
              <Label htmlFor="popular">Plano Popular</Label>
              {formData.popular && <Badge className="bg-red-accent">Mais Popular</Badge>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-red-accent hover:bg-red-accent/90" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : plan ? (
                "Salvar Alterações"
              ) : (
                "Criar Plano"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
