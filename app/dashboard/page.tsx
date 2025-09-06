"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, CreditCard, MessageSquare, TrendingUp, Calendar, Clock, Star, Activity } from "lucide-react"
import DataService, { type PlanData, type MessageData } from "@/lib/data-service"

export default function DashboardPage() {
  const [plans, setPlans] = useState<PlanData[]>([])
  const [messages, setMessages] = useState<MessageData[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const [loadedPlans, loadedMessages] = await Promise.all([
          DataService.getPlans(),
          DataService.getMessages()
        ])
        setPlans(loadedPlans)
        setMessages(loadedMessages)
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      }
    }
    loadData()
  }, [])

  // Calculate stats from real data
  const stats = {
    totalMembers: plans.reduce((sum, plan) => sum + plan.activeMembers, 0),
    activeMembers: plans.reduce((sum, plan) => (plan.status === "active" ? sum + plan.activeMembers : sum), 0),
    monthlyRevenue: plans.reduce((sum, plan) => sum + plan.monthlyRevenue, 0),
    newMembersThisMonth: Math.floor(Math.random() * 50) + 20, // Mock data
    pendingMessages: messages.filter((m) => m.status === "unread").length,
    averageRating: 4.8,
  }

  const recentActivities = [
    { id: 1, type: "new_member", message: "João Silva se matriculou no plano Premium", time: "2 horas atrás" },
    { id: 2, type: "payment", message: "Pagamento recebido de Maria Santos - R$ 149", time: "4 horas atrás" },
    { id: 3, type: "message", message: "Nova mensagem de contato de Pedro Costa", time: "6 horas atrás" },
    { id: 4, type: "renewal", message: "Ana Oliveira renovou o plano VIP", time: "1 dia atrás" },
  ]

  const upcomingTasks = [
    { id: 1, task: "Responder mensagens pendentes", priority: "high", due: "Hoje" },
    { id: 2, task: "Revisar novos cadastros", priority: "medium", due: "Amanhã" },
    { id: 3, task: "Atualizar preços dos planos", priority: "low", due: "Esta semana" },
  ]

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo ao painel administrativo da Black Red Academia</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Membros</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{stats.newMembersThisMonth}</span> este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membros Ativos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeMembers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalMembers > 0 ? ((stats.activeMembers / stats.totalMembers) * 100).toFixed(1) : 0}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {stats.monthlyRevenue.toLocaleString("pt-BR")}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating}</div>
            <p className="text-xs text-muted-foreground">Baseado em 156 avaliações</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Últimas atividades na academia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="flex-shrink-0 mt-1">
                    {activity.type === "new_member" && <Users className="h-4 w-4 text-green-600" />}
                    {activity.type === "payment" && <CreditCard className="h-4 w-4 text-blue-600" />}
                    {activity.type === "message" && <MessageSquare className="h-4 w-4 text-orange-600" />}
                    {activity.type === "renewal" && <TrendingUp className="h-4 w-4 text-purple-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Tasks */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-red-accent hover:bg-red-accent/90">
                <Users className="mr-2 h-4 w-4" />
                Novo Membro
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <MessageSquare className="mr-2 h-4 w-4" />
                Ver Mensagens
                {stats.pendingMessages > 0 && (
                  <Badge variant="destructive" className="ml-auto">
                    {stats.pendingMessages}
                  </Badge>
                )}
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <CreditCard className="mr-2 h-4 w-4" />
                Gerenciar Planos
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Tarefas Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-2 rounded border">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{task.task}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {task.due}
                      </p>
                    </div>
                    <Badge
                      variant={
                        task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {task.priority === "high" ? "Alta" : task.priority === "medium" ? "Média" : "Baixa"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
