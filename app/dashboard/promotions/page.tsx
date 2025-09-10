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
import { Plus, Edit, Trash2, Gift, Calendar, Eye, EyeOff, ImageOff } from "lucide-react"
import { toast } from "sonner"

interface Promotion {
  id: string
  title: string
  description: string
  image?: string
  validUntil: string
  isActive: boolean
  uniqueCode?: string
  shortCode?: string
  accessCount: number
  createdAt: string
}

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    validUntil: '',
    isActive: true
  })

  useEffect(() => {
    fetchPromotions()
  }, [])

  const fetchPromotions = async () => {
    try {
      console.log('🔍 Buscando promoções...')
      const response = await fetch('/api/promotions?status=all')
      console.log('📡 Resposta da API:', response.status, response.statusText)

      const data = await response.json()
      console.log('📊 Dados recebidos:', data)

      if (data.success) {
        console.log('✅ Promoções encontradas:', data.promotions.length)
        setPromotions(data.promotions)
      } else {
        console.log('❌ Erro na resposta:', data.error)
        toast.error(data.error || 'Erro ao carregar promoções')
      }
    } catch (error) {
      console.error('💥 Erro ao carregar promoções:', error)
      toast.error('Erro ao carregar promoções')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingPromotion
        ? `/api/promotions/${editingPromotion.id}`
        : '/api/promotions'

      const method = editingPromotion ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        toast.success(editingPromotion ? 'Promoção atualizada!' : 'Promoção criada!')
        setIsDialogOpen(false)
        setEditingPromotion(null)
        resetForm()
        fetchPromotions()
      } else {
        toast.error(data.error || 'Erro ao salvar promoção')
      }
    } catch (error) {
      console.error('Erro ao salvar promoção:', error)
      toast.error('Erro ao salvar promoção')
    }
  }

  const handleEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion)
    setFormData({
      title: promotion.title,
      description: promotion.description,
      image: promotion.image || '',
      validUntil: new Date(promotion.validUntil).toISOString().split('T')[0],
      isActive: promotion.isActive
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta promoção?')) return

    try {
      const response = await fetch(`/api/promotions/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Promoção excluída!')
        fetchPromotions()
      } else {
        toast.error(data.error || 'Erro ao excluir promoção')
      }
    } catch (error) {
      console.error('Erro ao excluir promoção:', error)
      toast.error('Erro ao excluir promoção')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      validUntil: '',
      isActive: true
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
          <h1 className="text-3xl font-bold">Promoções</h1>
          <p className="text-muted-foreground">
            Gerencie as promoções exibidas na landing page
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingPromotion(null)
                resetForm()
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Promoção
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingPromotion ? 'Editar Promoção' : 'Nova Promoção'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Desconto Especial de Verão"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva a promoção em detalhes..."
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="image">URL da Imagem (opcional)</Label>
                <Input
                  id="image"
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>

              <div>
                <Label htmlFor="validUntil">Válido até</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">Ativa</Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingPromotion ? 'Atualizar' : 'Criar'}
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Gift className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{promotions.length}</p>
                <p className="text-sm text-muted-foreground">Total de Promoções</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Eye className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">
                  {promotions.filter(p => p.isActive).length}
                </p>
                <p className="text-sm text-muted-foreground">Ativas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">
                  {promotions.filter(p => new Date(p.validUntil) > new Date()).length}
                </p>
                <p className="text-sm text-muted-foreground">Válidas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <EyeOff className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {promotions.reduce((acc, p) => acc + p.accessCount, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Acessos via Links Únicos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Promotions List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Promoções</CardTitle>
        </CardHeader>
        <CardContent>
          {promotions.length === 0 ? (
            <div className="text-center py-8">
              <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma promoção cadastrada</p>
            </div>
          ) : (
            <div className="space-y-4">
              {promotions.map((promotion) => (
                <div
                  key={promotion.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{promotion.title}</h3>
                      <Badge variant={promotion.isActive ? "default" : "secondary"}>
                        {promotion.isActive ? 'Ativa' : 'Inativa'}
                      </Badge>
                      {new Date(promotion.validUntil) < new Date() && (
                        <Badge variant="destructive">Expirada</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {promotion.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Criado em: {formatDate(promotion.createdAt)}</span>
                      <span>Válido até: {formatDate(promotion.validUntil)}</span>
                      {promotion.uniqueCode && (
                        <span>Código: {promotion.uniqueCode}</span>
                      )}
                      {promotion.shortCode && (
                        <span>Short URL: /promo/{promotion.shortCode}</span>
                      )}
                      <span className="font-medium">Acessos: {promotion.accessCount}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(promotion)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(promotion.id)}
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