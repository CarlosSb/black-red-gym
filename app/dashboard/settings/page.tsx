"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Save, Building, Clock, Palette, Bell, Loader2, Upload, Image, Star, Plus, Trash2 } from "lucide-react"
import DataService, { type AcademySettingsData } from "@/lib/data-service"

export default function SettingsPage() {
  const [settings, setSettings] = useState<AcademySettingsData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true)
      try {
        const loadedSettings = await DataService.getSettings()
        setSettings(loadedSettings)
      } catch (error) {
        console.error("Error loading settings:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadSettings()
  }, [])

  const handleSaveInformation = async () => {
    if (!settings) return

    setIsSaving(true)
    try {
      const updatedSettings = await DataService.updateSettings({
        name: settings.name,
        description: settings.description,
        phone: settings.phone,
        email: settings.email,
        address: settings.address,
      })
      setSettings(updatedSettings)
    } catch (error) {
      console.error("Error saving information:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveHours = async () => {
    if (!settings) return

    setIsSaving(true)
    try {
      const updatedSettings = await DataService.updateSettings({
        hours: settings.hours,
      })
      setSettings(updatedSettings)
    } catch (error) {
      console.error("Error saving hours:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveAppearance = async () => {
    if (!settings) return

    setIsSaving(true)
    try {
      const updatedSettings = await DataService.updateSettings({
        colors: settings.colors,
      })
      setSettings(updatedSettings)
    } catch (error) {
      console.error("Error saving appearance:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveNotifications = async () => {
    if (!settings) return

    setIsSaving(true)
    try {
      const updatedSettings = await DataService.updateSettings({
        notifications: settings.notifications,
      })
      setSettings(updatedSettings)
    } catch (error) {
      console.error("Error saving notifications:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveAbout = async () => {
    if (!settings) return

    setIsSaving(true)
    try {
      const updatedSettings = await DataService.updateSettings({
        about: settings.about,
      })
      setSettings(updatedSettings)
    } catch (error) {
      console.error("Error saving about:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveHero = async () => {
    if (!settings) return

    setIsSaving(true)
    try {
      const updatedSettings = await DataService.updateSettings({
        heroTitle: settings.heroTitle,
        heroSubtitle: settings.heroSubtitle,
        heroImage: settings.heroImage,
      })
      setSettings(updatedSettings)
    } catch (error) {
      console.error("Error saving hero:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveFeatures = async () => {
    if (!settings) return

    setIsSaving(true)
    try {
      const updatedSettings = await DataService.updateSettings({
        features: settings.features,
      })
      setSettings(updatedSettings)
    } catch (error) {
      console.error("Error saving features:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveMetrics = async () => {
    if (!settings) return

    setIsSaving(true)
    try {
      const updatedSettings = await DataService.updateSettings({
        metrics: settings.metrics,
      })
      setSettings(updatedSettings)
    } catch (error) {
      console.error("Error saving metrics:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      if (result.success) {
        const updatedSettings = await DataService.updateSettings({
          logo: result.url,
        })
        setSettings(updatedSettings)
      } else {
        console.error('Upload failed:', result.error)
        alert('Erro ao fazer upload: ' + result.error)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Erro ao fazer upload da imagem')
    } finally {
      setIsUploading(false)
    }
  }

  const handleHeroImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      if (result.success) {
        setSettings({ ...settings!, heroImage: result.url })
      } else {
        console.error('Upload failed:', result.error)
        alert('Erro ao fazer upload: ' + result.error)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Erro ao fazer upload da imagem')
    } finally {
      setIsUploading(false)
    }
  }

  const addFeature = () => {
    if (!settings?.features) return
    
    const newFeature = {
      icon: "Dumbbell",
      title: "Nova Feature",
      description: "Descrição da nova feature"
    }
    
    setSettings({
      ...settings,
      features: {
        ...settings.features,
        items: [...(settings.features.items || []), newFeature]
      }
    })
  }

  const removeFeature = (index: number) => {
    if (!settings?.features?.items) return
    
    setSettings({
      ...settings,
      features: {
        ...settings.features,
        items: settings.features.items.filter((_, i) => i !== index)
      }
    })
  }

  const updateFeature = (index: number, field: string, value: string) => {
    if (!settings?.features?.items) return
    
    const updatedItems = [...settings.features.items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    
    setSettings({
      ...settings,
      features: {
        ...settings.features,
        items: updatedItems
      }
    })
  }

  if (isLoading || !settings) {
    return (
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-red-accent" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Configurações</h1>
        <p className="text-muted-foreground">Configure as informações e preferências da academia</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Logo Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Logo da Academia
            </CardTitle>
            <CardDescription>Faça upload do logo da academia</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {settings.logo && (
                <div className="w-20 h-20 border rounded-lg overflow-hidden bg-muted">
                  <img
                    src={settings.logo}
                    alt="Logo da academia"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className="flex-1">
                <Label htmlFor="logo-upload" className="cursor-pointer">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center hover:border-red-accent transition-colors">
                    {isUploading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Fazendo upload...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Upload className="h-4 w-4" />
                        <span>Clique para fazer upload</span>
                      </div>
                    )}
                  </div>
                </Label>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  disabled={isUploading}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Formatos aceitos: JPG, PNG, GIF, WebP (máx. 5MB)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Seção Destaque (Hero)
            </CardTitle>
            <CardDescription>Configure o título, subtítulo e imagem da seção principal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hero-subtitle">Subtítulo (Badge)</Label>
              <Input
                id="hero-subtitle"
                value={settings.heroSubtitle || ""}
                onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                placeholder="Ex: Nova Academia"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hero-title">Título Principal</Label>
              <Input
                id="hero-title"
                value={settings.heroTitle || ""}
                onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                placeholder="Ex: TRANSFORME SEU CORPO"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hero-image">Imagem de Fundo</Label>
              <div className="flex items-center gap-4">
                {settings.heroImage && (
                  <div className="w-20 h-20 border rounded-lg overflow-hidden bg-muted">
                    <img
                      src={settings.heroImage}
                      alt="Imagem do hero"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <Label htmlFor="hero-image-upload" className="cursor-pointer">
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center hover:border-red-accent transition-colors">
                      {isUploading ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Fazendo upload...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <Upload className="h-4 w-4" />
                          <span>Clique para fazer upload</span>
                        </div>
                      )}
                    </div>
                  </Label>
                  <input
                    id="hero-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleHeroImageUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={handleSaveHero}
              className="bg-red-accent hover:bg-red-accent/90"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Hero
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Features Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Seção "Por que escolher a Black Red"
            </CardTitle>
            <CardDescription>Configure os itens de destaque da academia</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="features-title">Título da Seção</Label>
              <Input
                id="features-title"
                value={settings.features?.title || ""}
                onChange={(e) => setSettings({ 
                  ...settings, 
                  features: { 
                    ...settings.features!, 
                    title: e.target.value 
                  } 
                })}
                placeholder="Ex: Por que escolher a Black Red?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="features-description">Descrição da Seção</Label>
              <Textarea
                id="features-description"
                value={settings.features?.description || ""}
                onChange={(e) => setSettings({ 
                  ...settings, 
                  features: { 
                    ...settings.features!, 
                    description: e.target.value 
                  } 
                })}
                rows={2}
                placeholder="Ex: Oferecemos tudo que você precisa para alcançar seus objetivos fitness"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Itens de Destaque</Label>
                <Button onClick={addFeature} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Item
                </Button>
              </div>

              {settings.features?.items?.map((feature, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Item {index + 1}</Label>
                    <Button 
                      onClick={() => removeFeature(index)} 
                      size="sm" 
                      variant="destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label>Ícone</Label>
                      <select
                        value={feature.icon}
                        onChange={(e) => updateFeature(index, "icon", e.target.value)}
                        className="w-full p-2 border rounded"
                      >
                        <option value="Dumbbell">Dumbbell</option>
                        <option value="Users">Users</option>
                        <option value="Clock">Clock</option>
                        <option value="Trophy">Trophy</option>
                        <option value="Star">Star</option>
                        <option value="Heart">Heart</option>
                        <option value="Shield">Shield</option>
                        <option value="Zap">Zap</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <Label>Título</Label>
                      <Input
                        value={feature.title}
                        onChange={(e) => updateFeature(index, "title", e.target.value)}
                        placeholder="Título do item"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Descrição</Label>
                      <Input
                        value={feature.description}
                        onChange={(e) => updateFeature(index, "description", e.target.value)}
                        placeholder="Descrição do item"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={handleSaveFeatures}
              className="bg-red-accent hover:bg-red-accent/90"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Features
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Academy Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Informações da Academia
            </CardTitle>
            <CardDescription>Dados básicos e informações de contato</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="academy-name">Nome da Academia</Label>
              <Input
                id="academy-name"
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={settings.description}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp (com código do país)</Label>
              <Input
                id="whatsapp"
                placeholder="5511999999999"
                value={settings.whatsapp || ""}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Formato: 55 + DDD + número (ex: 5511999999999)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              />
            </div>

            <Button
              onClick={handleSaveInformation}
              className="bg-red-accent hover:bg-red-accent/90"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Informações
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Academy Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Métricas da Academia
            </CardTitle>
            <CardDescription>Configure as métricas exibidas na página inicial</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="active-members">Alunos Ativos</Label>
                <Input
                  id="active-members"
                  type="number"
                  value={settings.metrics?.activeMembers || 500}
                  onChange={(e) => setSettings({ 
                    ...settings, 
                    metrics: { 
                      ...settings.metrics!, 
                      activeMembers: parseInt(e.target.value) || 500 
                    } 
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="personal-trainers">Personal Trainers</Label>
                <Input
                  id="personal-trainers"
                  type="number"
                  value={settings.metrics?.personalTrainers || 15}
                  onChange={(e) => setSettings({ 
                    ...settings, 
                    metrics: { 
                      ...settings.metrics!, 
                      personalTrainers: parseInt(e.target.value) || 15 
                    } 
                  })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="operating-hours">Horário de Funcionamento</Label>
                <Input
                  id="operating-hours"
                  placeholder="24/7"
                  value={settings.metrics?.operatingHours || "24/7"}
                  onChange={(e) => setSettings({ 
                    ...settings, 
                    metrics: { 
                      ...settings.metrics!, 
                      operatingHours: e.target.value || "24/7" 
                    } 
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="founded-year">Ano de Fundação</Label>
                <Input
                  id="founded-year"
                  type="number"
                  value={settings.metrics?.foundedYear || 2024}
                  onChange={(e) => setSettings({ 
                    ...settings, 
                    metrics: { 
                      ...settings.metrics!, 
                      foundedYear: parseInt(e.target.value) || 2024 
                    } 
                  })}
                />
              </div>
            </div>

            <Button
              onClick={handleSaveMetrics}
              className="bg-red-accent hover:bg-red-accent/90"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Métricas
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Operating Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Horários de Funcionamento
            </CardTitle>
            <CardDescription>Configure os horários de abertura e fechamento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Segunda a Sexta</Label>
                <div className="flex items-center gap-2">
                  <Input
                    className="w-20"
                    value={settings.hours.weekdays.open}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hours: {
                          ...settings.hours,
                          weekdays: { ...settings.hours.weekdays, open: e.target.value },
                        },
                      })
                    }
                  />
                  <span>às</span>
                  <Input
                    className="w-20"
                    value={settings.hours.weekdays.close}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hours: {
                          ...settings.hours,
                          weekdays: { ...settings.hours.weekdays, close: e.target.value },
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label>Sábado</Label>
                <div className="flex items-center gap-2">
                  <Input
                    className="w-20"
                    value={settings.hours.saturday.open}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hours: {
                          ...settings.hours,
                          saturday: { ...settings.hours.saturday, open: e.target.value },
                        },
                      })
                    }
                  />
                  <span>às</span>
                  <Input
                    className="w-20"
                    value={settings.hours.saturday.close}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hours: {
                          ...settings.hours,
                          saturday: { ...settings.hours.saturday, close: e.target.value },
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label>Domingo</Label>
                <div className="flex items-center gap-2">
                  <Input
                    className="w-20"
                    value={settings.hours.sunday.open}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hours: {
                          ...settings.hours,
                          sunday: { ...settings.hours.sunday, open: e.target.value },
                        },
                      })
                    }
                  />
                  <span>às</span>
                  <Input
                    className="w-20"
                    value={settings.hours.sunday.close}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hours: {
                          ...settings.hours,
                          sunday: { ...settings.hours.sunday, close: e.target.value },
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <Button onClick={handleSaveHours} className="bg-red-accent hover:bg-red-accent/90" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Horários
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Aparência
            </CardTitle>
            <CardDescription>Personalize as cores e tema da academia</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Cor Principal</Label>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded border" style={{ backgroundColor: settings.colors.primary }}></div>
                  <Input
                    className="w-24"
                    value={settings.colors.primary}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        colors: { ...settings.colors, primary: e.target.value },
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label>Cor Secundária</Label>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded border" style={{ backgroundColor: settings.colors.secondary }}></div>
                  <Input
                    className="w-24"
                    value={settings.colors.secondary}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        colors: { ...settings.colors, secondary: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <Button onClick={handleSaveAppearance} className="bg-red-accent hover:bg-red-accent/90" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Aparência
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
            </CardTitle>
            <CardDescription>Configure as preferências de notificação</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Novas mensagens</Label>
                  <p className="text-sm text-muted-foreground">Receber notificação por e-mail</p>
                </div>
                <Switch
                  checked={settings.notifications.newMessages}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, newMessages: checked },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Novos membros</Label>
                  <p className="text-sm text-muted-foreground">Notificar sobre novos cadastros</p>
                </div>
                <Switch
                  checked={settings.notifications.newMembers}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, newMembers: checked },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Pagamentos</Label>
                  <p className="text-sm text-muted-foreground">Alertas sobre pagamentos recebidos</p>
                </div>
                <Switch
                  checked={settings.notifications.payments}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, payments: checked },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Relatórios semanais</Label>
                  <p className="text-sm text-muted-foreground">Resumo semanal por e-mail</p>
                </div>
                <Switch
                  checked={settings.notifications.weeklyReports}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, weeklyReports: checked },
                    })
                  }
                />
              </div>
            </div>

            <Button
              onClick={handleSaveNotifications}
              className="bg-red-accent hover:bg-red-accent/90"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Preferências
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
