"use client"

import { useState, useEffect } from "react"

interface Plan {
  id: string
  name: string
  price: number
  description: string
  features: string[]
  status: "active" | "inactive"
  popular: boolean
  activeMembers: number
  monthlyRevenue: number
  createdAt: string
  updatedAt: string
}

export function usePlans() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPlans()
  }, [])

  const loadPlans = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/plans")

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.plans) {
          setPlans(data.plans)
        } else {
          setError("Erro ao carregar planos")
        }
      } else {
        setError("Erro na resposta da API")
      }
    } catch (err) {
      setError("Erro de conexão")
      console.error("Erro ao carregar planos:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    plans,
    isLoading,
    error,
    refetch: loadPlans
  }
}