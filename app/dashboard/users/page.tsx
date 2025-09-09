"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, UserPlus, Ban, CheckCircle, XCircle, Search, MoreHorizontal, Shield, User, Activity, Calendar, Clock } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface User {
  id: string
  name: string
  email: string
  role: "ADMIN" | "USER"
  status: "ACTIVE" | "BANNED" | "PENDING"
  createdAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER" as "USER" | "ADMIN"
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const response = await fetch("/api/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error("Erro ao carregar usuários:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de usuários.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newUser)
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Usuário criado com sucesso!",
        })
        setIsCreateDialogOpen(false)
        setNewUser({ name: "", email: "", password: "", role: "USER" })
        loadUsers()
      } else {
        const error = await response.json()
        toast({
          title: "Erro",
          description: error.error || "Erro ao criar usuário.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Erro ao criar usuário:", error)
      toast({
        title: "Erro",
        description: "Erro interno do servidor.",
        variant: "destructive"
      })
    }
  }

  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "BANNED" ? "ACTIVE" : "BANNED"
    const action = newStatus === "BANNED" ? "banir" : "reativar"

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: `Usuário ${action}do com sucesso!`,
        })
        loadUsers()
      } else {
        const error = await response.json()
        toast({
          title: "Erro",
          description: error.error || `Erro ao ${action} usuário.`,
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error(`Erro ao ${action} usuário:`, error)
      toast({
        title: "Erro",
        description: "Erro interno do servidor.",
        variant: "destructive"
      })
    }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>
      case "BANNED":
        return <Badge variant="destructive">Banido</Badge>
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getRoleIcon = (role: string) => {
    return role === "ADMIN" ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-accent mx-auto mb-4"></div>
          <p>Carregando usuários...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gerenciamento de Usuários</h1>
        <p className="text-muted-foreground">Controle de acesso e permissões dos usuários do sistema</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.status === "ACTIVE").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Banidos</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {users.filter(u => u.status === "BANNED").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administradores</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {users.filter(u => u.role === "ADMIN").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuários por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-accent hover:bg-red-accent/90">
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Usuário</DialogTitle>
              <DialogDescription>
                Adicione um novo usuário ao sistema com as permissões apropriadas.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Tipo de Usuário</Label>
                <Select value={newUser.role} onValueChange={(value: "USER" | "ADMIN") => setNewUser(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">Usuário Comum</SelectItem>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-red-accent hover:bg-red-accent/90">
                  Criar Usuário
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>
            {filteredUsers.length} usuário{filteredUsers.length !== 1 ? 's' : ''} encontrado{filteredUsers.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de Cadastro</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getRoleIcon(user.role)}
                      <span className="text-sm">
                        {user.role === "ADMIN" ? "Administrador" : "Usuário"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(user.status)}
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          {user.status === "BANNED" ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Ban className="h-4 w-4 text-red-600" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {user.status === "BANNED" ? "Reativar Usuário" : "Banir Usuário"}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {user.status === "BANNED"
                              ? `Tem certeza que deseja reativar o acesso de ${user.name}?`
                              : `Tem certeza que deseja banir ${user.name}? O usuário perderá o acesso ao sistema.`
                            }
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleToggleUserStatus(user.id, user.status)}
                            className={user.status === "BANNED" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
                          >
                            {user.status === "BANNED" ? "Reativar" : "Banir"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum usuário encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Activities Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Movimentações dos Alunos
          </CardTitle>
          <CardDescription>
            Acompanhe as atividades e acessos dos usuários alunos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Recent Check-ins */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                Check-ins Recentes
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="font-medium">João Silva</p>
                      <p className="text-sm text-muted-foreground">Check-in realizado</p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    2h atrás
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="font-medium">Maria Santos</p>
                      <p className="text-sm text-muted-foreground">Check-in realizado</p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    4h atrás
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Appointments */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Agendamentos Recentes
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="font-medium">Pedro Costa</p>
                      <p className="text-sm text-muted-foreground">Aula Experimental - Musculação</p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    1 dia atrás
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="font-medium">Ana Oliveira</p>
                      <p className="text-sm text-muted-foreground">Aula Experimental - Crossfit</p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    2 dias atrás
                  </div>
                </div>
              </div>
            </div>

            {/* Access Control */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Controle de Acesso
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="font-bold text-green-800">Acesso Liberado</div>
                  <div className="text-sm text-green-600">15 usuários</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                  <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <div className="font-bold text-red-800">Acesso Bloqueado</div>
                  <div className="text-sm text-red-600">2 usuários</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <div className="font-bold text-yellow-800">Pendente</div>
                  <div className="text-sm text-yellow-600">1 usuário</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}