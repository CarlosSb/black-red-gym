import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const updates = await request.json()
    const updateData: any = { ...updates }

    if (updates.status) {
      updateData.status = updates.status.toUpperCase() as "ACTIVE" | "INACTIVE"
    }

    const updatedPlan = await prisma.plan.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({
      id: updatedPlan.id,
      name: updatedPlan.name,
      price: updatedPlan.price,
      description: updatedPlan.description,
      features: updatedPlan.features,
      activeMembers: updatedPlan.activeMembers,
      monthlyRevenue: updatedPlan.monthlyRevenue,
      status: updatedPlan.status.toLowerCase() as "active" | "inactive",
      popular: updatedPlan.popular,
      createdAt: updatedPlan.createdAt.toISOString(),
      updatedAt: updatedPlan.updatedAt.toISOString(),
    })
  } catch (error) {
    console.error('Error updating plan:', error)
    return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.plan.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting plan:', error)
    return NextResponse.json({ error: 'Failed to delete plan' }, { status: 500 })
  }
}
