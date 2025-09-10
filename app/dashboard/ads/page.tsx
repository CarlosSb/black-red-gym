"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, Megaphone, Calendar, Eye, EyeOff, ExternalLink } from "lucide-react"
import { toast } from "sonner"

interface Ad {
  id: string
  title: string
  image?: string
  link?: string
  validUntil: string
  isActive: boolean
  createdAt: string
}

export default function AdsPage() {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAd, setEditingAd] = useState<Ad | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    link: '',
    validUntil: '',
    isActive: true
  })

  useEffect(() => {
    fetchAds()
  }, [])

  const fetchAds = async () => {
    try {
      const response = await fetch('/api/ads?status=all')
      const data = await response.json()

      if (data.success) {
        setAds(data.ads)
      }
    } catch (error) {
      console.error('Erro ao carregar anúncios:', error)
      toast.error('Erro ao carregar anúncios')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingAd
        ? `/api/ads/${editingAd.id}`
        : '/api/ads'

      const method = editingAd ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        toast.success(editingAd ? 'Anúncio atualizado!' : 'Anúncio criado!')
        setIsDialogOpen(false)
        setEditingAd(null)
        resetForm()
        fetchAds()
      } else {
        toast.error(data.error || 'Erro ao salvar anúncio')
      }
    } catch (error) {
      console.error('Erro ao salvar anúncio:', error)
      toast.error('Erro ao salvar anúncio')
    }
  }

  const handleEdit = (ad: Ad) => {
    setEditingAd(ad)
    setFormData({
      title: ad.title,
      image: ad.image || '',
      link: ad.link || '',
      validUntil: new Date(ad.validUntil).toISOString().split('T')[0],
      isActive: ad.isActive
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este anúncio?')) return

    try {
      const response = await fetch(`/api/ads/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Anúncio excluído!')
        fetchAds()
      } else {
        toast.error(data.error || 'Erro ao excluir anúncio')
      }
    } catch (error) {
      console.error('Erro ao excluir anúncio:', error)
      toast.error('Erro ao excluir anúncio')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      image: '',
      link: '',
      validUntil: '',
      isActive: true
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-accent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Anúncios</h1>
          <p className="text-muted-foreground">
            Gerencie os anúncios exibidos discretamente na landing page
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingAd(null)
                resetForm()
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Anúncio
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingAd ? 'Editar Anúncio' : 'Novo Anúncio'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Suplementos com 20% OFF"
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
                  placeholder="https://exemplo.com/banner.jpg"
                />
              </div>

              <div>
                <Label htmlFor="link">URL de Destino (opcional)</Label>
                <Input
                  id="link"
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="https://exemplo.com/produto"
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
                <Label htmlFor="isActive">Ativo</Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingAd ? 'Atualizar' : 'Criar'}
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Megaphone className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{ads.length}</p>
                <p className="text-sm text-muted-foreground">Total de Anúncios</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Eye className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {ads.filter(ad => ad.isActive).length}
                </p>
                <p className="text-sm text-muted-foreground">Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <ExternalLink className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">
                  {ads.filter(ad => ad.link).length}
                </p>
                <p className="text-sm text-muted-foreground">Com Link</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ads List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Anúncios</CardTitle>
        </CardHeader>
        <CardContent>
          {ads.length === 0 ? (
            <div className="text-center py-8">
              <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum anúncio cadastrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ads.map((ad) => (
                <div
                  key={ad.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Preview */}
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                      {ad.image ? (
                        <img
                          src={ad.image}
                          alt={ad.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Megaphone className="h-6 w-6 text-gray-400" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{ad.title}</h3>
                        <Badge variant={ad.isActive ? "default" : "secondary"}>
                          {ad.isActive ? 'Ativo' : 'Inativo'}
                        </Badge>
                        {new Date(ad.validUntil) < new Date() && (
                          <Badge variant="destructive">Expirado</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Criado em: {formatDate(ad.createdAt)}</span>
                        <span>Válido até: {formatDate(ad.validUntil)}</span>
                        {ad.link && (
                          <span className="flex items-center gap-1">
                            <ExternalLink className="h-3 w-3" />
                            Link disponível
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(ad)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(ad.id)}
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

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Megaphone className="h-6 w-6 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Sobre os Anúncios</h3>
              <p className="text-sm text-blue-800 mb-2">
                Os anúncios são exibidos de forma discreta no canto inferior direito da landing page,
                com rotação automática a cada 10 segundos.
              </p>
              <p className="text-sm text-blue-700">
                <strong>Dicas:</strong> Mantenha os anúncios relevantes ao público da academia
                (suplementos, equipamentos, serviços relacionados) e use imagens atrativas mas não invasivas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}