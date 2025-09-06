"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Save, Building, Clock, Palette, Bell, Loader2 } from "lucide-react"
import DataService, { type AcademySettingsData } from "@/lib/data-service"

export default function SettingsPage() {
  const [settings, setSettings] = useState<AcademySettingsData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

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
