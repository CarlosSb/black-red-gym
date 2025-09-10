"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Users, ExternalLink, ImageOff } from "lucide-react"
import { toast } from "sonner"

interface Partner {
   id: string
   name: string
   description: string
   logo?: string
   link?: string
   category: string
   isActive: boolean
   featured: boolean
   priority: number
   displayOrder: number
   createdAt: string
}

const categories = [
  "Nutricionista",
  "Fisioterapeuta",
  "Personal Trainer",
  "Médico",
  "Psicólogo",
  "Esteticista",
  "Massagista",
  "Outro"
]

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: '',
    link: '',
    category: '',
    isActive: true,
    featured: false,
    priority: 0,
    displayOrder: 0
  })

  useEffect(() => {
    fetchPartners()
  }, [])

  const fetchPartners = async () => {
    try {
      const response = await fetch('/api/partners?status=all')
      const data = await response.json()

      if (data.success) {
        setPartners(data.partners)
      }
    } catch (error) {
      console.error('Erro ao carregar parceiros:', error)
      toast.error('Erro ao carregar parceiros')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingPartner
        ? `/api/partners/${editingPartner.id}`
        : '/api/partners'

      const method = editingPartner ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        toast.success(editingPartner ? 'Parceiro atualizado!' : 'Parceiro criado!')
        setIsDialogOpen(false)
        setEditingPartner(null)
        resetForm()
        fetchPartners()
      } else {
        toast.error(data.error || 'Erro ao salvar parceiro')
      }
    } catch (error) {
      console.error('Erro ao salvar parceiro:', error)
      toast.error('Erro ao salvar parceiro')
    }
  }

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner)
    setFormData({
      name: partner.name,
      description: partner.description,
      logo: partner.logo || '',
      link: partner.link || '',
      category: partner.category,
      isActive: partner.isActive,
      featured: partner.featured,
      priority: partner.priority,
      displayOrder: partner.displayOrder
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este parceiro?')) return

    try {
      const response = await fetch(`/api/partners/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Parceiro excluído!')
        fetchPartners()
      } else {
        toast.error(data.error || 'Erro ao excluir parceiro')
      }
    } catch (error) {
      console.error('Erro ao excluir parceiro:', error)
      toast.error('Erro ao excluir parceiro')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      logo: '',
      link: '',
      category: '',
      isActive: true,
      featured: false,
      priority: 0,
      displayOrder: 0
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const handleImageError = (imageUrl: string) => {
    setImageErrors(prev => new Set(prev).add(imageUrl))
  }

  const getImageSource = (imageUrl?: string) => {
    if (!imageUrl || imageErrors.has(imageUrl)) {
      return null
    }
    return imageUrl
  }

  const getPartnerInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-accent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Parceiros</h1>
          <p className="text-muted-foreground">
            Gerencie os parceiros exibidos na landing page
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingPartner(null)
                resetForm()
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Parceiro
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingPartner ? 'Editar Parceiro' : 'Novo Parceiro'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Dr. João Silva"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva os serviços oferecidos..."
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="logo">URL do Logo (opcional)</Label>
                <Input
                  id="logo"
                  type="url"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  placeholder="https://exemplo.com/logo.jpg"
                />
              </div>

              <div>
                <Label htmlFor="link">Link do Site (opcional)</Label>
                <Input
                  id="link"
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="https://exemplo.com"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">Ativo</Label>
              </div>

              <div>
                <Label htmlFor="featured">Destaque</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                  <Label htmlFor="featured" className="text-sm text-muted-foreground">
                    Parceiro destacado (aparece com mais frequência)
                  </Label>
                </div>
              </div>

              <div>
                <Label htmlFor="priority">Prioridade (0-10)</Label>
                <Input
                  id="priority"
                  type="number"
                  min="0"
                  max="10"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Maior prioridade = mais visibilidade
                </p>
              </div>

              <div>
                <Label htmlFor="displayOrder">Ordem de Exibição</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  min="0"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Ordem de exibição entre parceiros com mesma prioridade
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingPartner ? 'Atualizar' : 'Criar'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{partners.length}</p>
                <p className="text-sm text-muted-foreground">Total de Parceiros</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <ExternalLink className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {partners.filter(p => p.link).length}
                </p>
                <p className="text-sm text-muted-foreground">Com Link</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Badge className="h-8 w-8 bg-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {new Set(partners.map(p => p.category)).size}
                </p>
                <p className="text-sm text-muted-foreground">Categorias</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Partners List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Parceiros</CardTitle>
        </CardHeader>
        <CardContent>
          {partners.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum parceiro cadastrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Logo */}
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                      {getImageSource(partner.logo) ? (
                        <img
                          src={partner.logo!}
                          alt={partner.name}
                          className="w-full h-full object-cover"
                          onError={() => handleImageError(partner.logo!)}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {getPartnerInitials(partner.name)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{partner.name}</h3>
                        <Badge variant="outline">{partner.category}</Badge>
                        {partner.featured && (
                          <Badge className="bg-yellow-500/90 text-white hover:bg-yellow-500">
                            ⭐ Destaque
                          </Badge>
                        )}
                        <Badge variant={partner.isActive ? "default" : "secondary"}>
                          {partner.isActive ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {partner.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Criado em: {formatDate(partner.createdAt)}</span>
                        <span>Prioridade: {partner.priority}</span>
                        <span>Ordem: {partner.displayOrder}</span>
                        {partner.link && (
                          <span className="flex items-center gap-1">
                            <ExternalLink className="h-3 w-3" />
                            Site disponível
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(partner)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(partner.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}