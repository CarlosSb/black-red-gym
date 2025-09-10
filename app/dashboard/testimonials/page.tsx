"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MessageSquare, Plus, Star, Eye, EyeOff, Trash2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Testimonial {
  id: string
  name: string
  content: string
  rating: number
  image?: string
  isActive: boolean
  createdAt: string
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    content: "",
    rating: 5,
    image: ""
  })

  useEffect(() => {
    loadTestimonials()
  }, [])

  const loadTestimonials = async () => {
    try {
      const response = await fetch("/api/testimonials")
      if (response.ok) {
        const data = await response.json()
        setTestimonials(data.testimonials)
      }
    } catch (error) {
      console.error("Erro ao carregar depoimentos:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os depoimentos.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTestimonial = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newTestimonial)
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Depoimento criado com sucesso!",
        })
        setIsCreateDialogOpen(false)
        setNewTestimonial({ name: "", content: "", rating: 5, image: "" })
        loadTestimonials()
      } else {
        const error = await response.json()
        toast({
          title: "Erro",
          description: error.error || "Erro ao criar depoimento.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Erro ao criar depoimento:", error)
      toast({
        title: "Erro",
        description: "Erro interno do servidor.",
        variant: "destructive"
      })
    }
  }

  const handleToggleTestimonialStatus = async (testimonialId: string, currentStatus: boolean) => {
    const action = currentStatus ? "ocultar" : "exibir"

    try {
      const response = await fetch(`/api/testimonials/${testimonialId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ isActive: !currentStatus })
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: `Depoimento ${action}do com sucesso!`,
        })
        loadTestimonials()
      } else {
        const error = await response.json()
        toast({
          title: "Erro",
          description: error.error || `Erro ao ${action} depoimento.`,
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error(`Erro ao ${action} depoimento:`, error)
      toast({
        title: "Erro",
        description: "Erro interno do servidor.",
        variant: "destructive"
      })
    }
  }

  const handleDeleteTestimonial = async (testimonialId: string) => {
    try {
      const response = await fetch(`/api/testimonials/${testimonialId}`, {
        method: "DELETE"
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Depoimento excluído com sucesso!",
        })
        loadTestimonials()
      } else {
        const error = await response.json()
        toast({
          title: "Erro",
          description: error.error || "Erro ao excluir depoimento.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Erro ao excluir depoimento:", error)
      toast({
        title: "Erro",
        description: "Erro interno do servidor.",
        variant: "destructive"
      })
    }
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-accent mx-auto mb-4"></div>
          <p>Carregando depoimentos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gerenciamento de Depoimentos</h1>
        <p className="text-muted-foreground">Gerencie os depoimentos exibidos no site</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Depoimentos</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testimonials.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
            <Eye className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {testimonials.filter(t => t.isActive).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {Array.isArray(testimonials) && testimonials.length > 0
                ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
                : "0.0"
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-accent hover:bg-red-accent/90">
              <Plus className="mr-2 h-4 w-4" />
              Novo Depoimento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Novo Depoimento</DialogTitle>
              <DialogDescription>
                Adicione um novo depoimento de cliente ao site.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateTestimonial} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Cliente</Label>
                <Input
                  id="name"
                  value={newTestimonial.name}
                  onChange={(e) => setNewTestimonial(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Depoimento</Label>
                <Textarea
                  id="content"
                  value={newTestimonial.content}
                  onChange={(e) => setNewTestimonial(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Avaliação (estrelas)</Label>
                <Select
                  value={newTestimonial.rating.toString()}
                  onValueChange={(value) => setNewTestimonial(prev => ({ ...prev, rating: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">⭐⭐⭐⭐⭐ (5 estrelas)</SelectItem>
                    <SelectItem value="4">⭐⭐⭐⭐ (4 estrelas)</SelectItem>
                    <SelectItem value="3">⭐⭐⭐ (3 estrelas)</SelectItem>
                    <SelectItem value="2">⭐⭐ (2 estrelas)</SelectItem>
                    <SelectItem value="1">⭐ (1 estrela)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Iniciais ou URL da Imagem (opcional)</Label>
                <Input
                  id="image"
                  value={newTestimonial.image}
                  onChange={(e) => setNewTestimonial(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="Ex: JS ou https://..."
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-red-accent hover:bg-red-accent/90">
                  Criar Depoimento
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Testimonials Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Depoimentos</CardTitle>
          <CardDescription>
            {testimonials.length} depoimento{testimonials.length !== 1 ? 's' : ''} cadastrado{testimonials.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Depoimento</TableHead>
                <TableHead>Avaliação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testimonials.map((testimonial) => (
                <TableRow key={testimonial.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-accent rounded-full flex items-center justify-center text-white font-bold">
                        {testimonial.image || testimonial.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <span className="font-medium">{testimonial.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate" title={testimonial.content}>
                      {testimonial.content}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {renderStars(testimonial.rating)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={testimonial.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {testimonial.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(testimonial.createdAt).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleTestimonialStatus(testimonial.id, testimonial.isActive)}
                      >
                        {testimonial.isActive ? (
                          <EyeOff className="h-4 w-4 text-gray-600" />
                        ) : (
                          <Eye className="h-4 w-4 text-green-600" />
                        )}
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir Depoimento</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o depoimento de {testimonial.name}?
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteTestimonial(testimonial.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {testimonials.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum depoimento cadastrado</p>
              <p className="text-sm">Clique em &ldquo;Novo Depoimento&rdquo; para adicionar o primeiro.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}