"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserCheck, Calendar, Users, Trophy, Clock, Star, CheckCircle, AlertCircle } from "lucide-react"
import { ReferralModal } from "@/components/referral-modal"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"

interface CheckIn {
  id: string
  name: string
  phone: string
  checkInTime: Date
  status: string
  createdAt: Date
}

interface Appointment {
  id: string
  name: string
  phone: string
  email: string
  classType: string
  scheduledDate: Date
  scheduledTime: string
  status: string
  notes?: string
}

export default function StudentDashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [checkIns, setCheckIns] = useState<CheckIn[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  const loadStudentData = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      const [checkInsResponse, appointmentsResponse] = await Promise.all([
        fetch("/api/checkin"),
        fetch("/api/appointments")
      ])

      if (checkInsResponse.ok) {
        const checkInsData = await checkInsResponse.json()
        // Filtrar apenas os check-ins do usuário logado
        const userCheckIns = (checkInsData.checkIns || []).filter(
          (checkIn: CheckIn) => checkIn.name === user.name || checkIn.phone === user.email
        )
        setCheckIns(userCheckIns)
      }

      if (appointmentsResponse.ok) {
        const appointmentsData = await appointmentsResponse.json()
        // Filtrar apenas os agendamentos do usuário logado
        const userAppointments = (appointmentsData.appointments || []).filter(
          (appointment: Appointment) => appointment.email === user.email
        )
        setAppointments(userAppointments)
      }
    } catch (error) {
      console.error("Error loading student data:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus dados.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadStudentData()
  }, [loadStudentData])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" />Pendente</Badge>
      case "CONFIRMED":
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Confirmado</Badge>
      case "COMPLETED":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800"><CheckCircle className="w-3 h-3 mr-1" />Concluído</Badge>
      case "ACTIVE":
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Ativo</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const upcomingAppointments = appointments
    .filter(apt => new Date(apt.scheduledDate) >= new Date() && apt.status !== "CANCELLED")
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())

  const pastCheckIns = checkIns
    .filter(checkIn => checkIn.status === "ACTIVE")
    .sort((a, b) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime())

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p>Carregando seu painel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black-red text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Meu Painel</h1>
              <p className="text-white/70">Bem-vindo à Gym Starter!</p>
            </div>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black"
              onClick={() => router.push("/")}
            >
              Voltar ao Site
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Check-ins</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pastCheckIns.length}</div>
              <p className="text-xs text-muted-foreground">Histórico completo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximos Agendamentos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
              <p className="text-xs text-muted-foreground">Aulas marcadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pontos de Fidelidade</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pastCheckIns.length * 10}</div>
              <p className="text-xs text-muted-foreground">10 pontos por check-in</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status do Plano</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Ativo</div>
              <p className="text-xs text-muted-foreground">Plano Premium</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="checkins" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="checkins">Histórico de Check-ins</TabsTrigger>
            <TabsTrigger value="appointments">Meus Agendamentos</TabsTrigger>
            <TabsTrigger value="referrals">Indicações</TabsTrigger>
          </TabsList>

          <TabsContent value="checkins" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Check-ins</CardTitle>
                <CardDescription>Seus últimos check-ins na academia</CardDescription>
              </CardHeader>
              <CardContent>
                {pastCheckIns.length > 0 ? (
                  <div className="space-y-4">
                    {pastCheckIns.slice(0, 10).map((checkIn) => (
                      <div key={checkIn.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <UserCheck className="h-8 w-8 text-green-600" />
                        <div className="flex-1">
                          <p className="font-medium">{checkIn.name}</p>
                          <p className="text-sm text-muted-foreground">{checkIn.phone}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatDate(checkIn.checkInTime)}</p>
                          <p className="text-sm text-muted-foreground">{formatTime(checkIn.checkInTime)}</p>
                        </div>
                        {getStatusBadge(checkIn.status)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum check-in registrado ainda</p>
                    <p className="text-sm">Faça seu primeiro check-in na academia!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Meus Agendamentos</CardTitle>
                <CardDescription>Suas aulas experimentais e agendamentos futuros</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <Calendar className="h-8 w-8 text-blue-600" />
                        <div className="flex-1">
                          <p className="font-medium">{appointment.classType}</p>
                          <p className="text-sm text-muted-foreground">{appointment.notes || "Sem observações"}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatDate(appointment.scheduledDate)}</p>
                          <p className="text-sm text-muted-foreground">{appointment.scheduledTime}</p>
                        </div>
                        {getStatusBadge(appointment.status)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum agendamento futuro</p>
                    <p className="text-sm">Que tal agendar uma aula experimental?</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="referrals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Programa de Indicações</CardTitle>
                <CardDescription>Indique amigos e ganhe benefícios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Indique um Amigo</h3>
                  <p className="text-muted-foreground mb-6">
                    Cada amigo que você indicar e matricular ganha 1 mês gratuito para você!
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <h4 className="font-medium text-blue-900 mb-2">Benefícios da Indicação:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• 1 mês gratuito quando seu amigo se matricular</li>
                      <li>• Descontos em produtos da loja</li>
                      <li>• Prioridade em agendamentos</li>
                    </ul>
                  </div>
                  <ReferralModal>
                    <Button className="bg-red-600 hover:bg-red-700">
                      <Users className="mr-2 h-4 w-4" />
                      Indicar Amigo
                    </Button>
                  </ReferralModal>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}