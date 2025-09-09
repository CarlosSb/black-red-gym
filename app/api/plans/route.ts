import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const plans = await prisma.plan.findMany({
      orderBy: { createdAt: 'asc' }
    })
    
    // If no plans exist, create default ones
    if (plans.length === 0) {
      const defaultPlans = [
        {
          name: "Básico",
          price: 89,
          description: "Ideal para iniciantes",
          features: ["Acesso à musculação", "Avaliação física inicial", "Horário comercial"],
          activeMembers: 156,
          monthlyRevenue: 13884,
          status: "ACTIVE" as const,
          popular: false,
        },
        {
          name: "Premium",
          price: 149,
          description: "Para quem quer mais resultados",
          features: ["Tudo do plano Básico", "Aulas em grupo", "Acesso 24h", "2 sessões de personal"],
          activeMembers: 243,
          monthlyRevenue: 36207,
          status: "ACTIVE" as const,
          popular: true,
        },
        {
          name: "VIP",
          price: 249,
          description: "Experiência completa",
          features: ["Tudo do plano Premium", "Personal trainer dedicado", "Plano nutricional", "Área VIP exclusiva"],
          activeMembers: 88,
          monthlyRevenue: 21912,
          status: "ACTIVE" as const,
          popular: false,
        },
      ]

      await prisma.plan.createMany({
        data: defaultPlans
      })

      // Fetch the created plans
      const createdPlans = await prisma.plan.findMany({
        orderBy: { createdAt: 'asc' }
      })

      return NextResponse.json({
        success: true,
        plans: createdPlans.map(plan => ({
          id: plan.id,
          name: plan.name,
          price: plan.price,
          description: plan.description,
          features: plan.features,
          activeMembers: plan.activeMembers,
          monthlyRevenue: plan.monthlyRevenue,
          status: plan.status.toLowerCase() as "active" | "inactive",
          popular: plan.popular,
          createdAt: plan.createdAt.toISOString(),
          updatedAt: plan.updatedAt.toISOString(),
        }))
      })
    }

    return NextResponse.json({
      success: true,
      plans: plans.map(plan => ({
        id: plan.id,
        name: plan.name,
        price: plan.price,
        description: plan.description,
        features: plan.features,
        activeMembers: plan.activeMembers,
        monthlyRevenue: plan.monthlyRevenue,
        status: plan.status.toLowerCase() as "active" | "inactive",
        popular: plan.popular,
        createdAt: plan.createdAt.toISOString(),
        updatedAt: plan.updatedAt.toISOString(),
      }))
    })
  } catch (error) {
    console.error('Error fetching plans:', error)
    return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const planData = await request.json()
    
    const newPlan = await prisma.plan.create({
      data: {
        name: planData.name,
        price: planData.price,
        description: planData.description,
        features: planData.features,
        activeMembers: planData.activeMembers,
        monthlyRevenue: planData.monthlyRevenue,
        status: planData.status.toUpperCase() as "ACTIVE" | "INACTIVE",
        popular: planData.popular || false,
      }
    })

    return NextResponse.json({
      id: newPlan.id,
      name: newPlan.name,
      price: newPlan.price,
      description: newPlan.description,
      features: newPlan.features,
      activeMembers: newPlan.activeMembers,
      monthlyRevenue: newPlan.monthlyRevenue,
      status: newPlan.status.toLowerCase() as "active" | "inactive",
      popular: newPlan.popular,
      createdAt: newPlan.createdAt.toISOString(),
      updatedAt: newPlan.updatedAt.toISOString(),
    })
  } catch (error) {
    console.error('Error creating plan:', error)
    return NextResponse.json({ error: 'Failed to create plan' }, { status: 500 })
  }
}
