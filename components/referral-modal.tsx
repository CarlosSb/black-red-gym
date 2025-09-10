"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Users, CheckCircle, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface ReferralModalProps {
  children: React.ReactNode
}

export function ReferralModal({ children }: ReferralModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    referredName: "",
    referredPhone: "",
    referredEmail: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.referredName || !formData.referredPhone) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e telefone do indicado são obrigatórios.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/referrals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        toast({
          title: "Indicação realizada!",
          description: "Obrigado por indicar um amigo. Entraremos em contato em breve.",
        })

        // Reset form after 3 seconds
        setTimeout(() => {
          setIsSuccess(false)
          setFormData({
            referredName: "",
            referredPhone: "",
            referredEmail: ""
          })
          setIsOpen(false)
        }, 3000)
      } else {
        toast({
          title: "Erro na indicação",
          description: data.error || "Ocorreu um erro. Tente novamente.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Erro:", error)
      toast({
        title: "Erro de conexão",
        description: "Verifique sua conexão e tente novamente.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "")
    if (digits.length <= 2) return digits
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    setFormData(prev => ({ ...prev, referredPhone: formatted }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-red-accent" />
            Indicar um Amigo
          </DialogTitle>
          <DialogDescription>
            Indique um amigo para conhecer a Gym Starter e ganhe benefícios!
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Indicação Enviada!</h3>
            <p className="text-muted-foreground">
              Obrigado por indicar seu amigo. Entraremos em contato em breve.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="referredName">Nome do Amigo *</Label>
              <Input
                id="referredName"
                placeholder="Digite o nome completo"
                value={formData.referredName}
                onChange={(e) => setFormData(prev => ({ ...prev, referredName: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="referredPhone">Telefone do Amigo *</Label>
              <Input
                id="referredPhone"
                placeholder="(11) 99999-9999"
                value={formData.referredPhone}
                onChange={handlePhoneChange}
                maxLength={15}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="referredEmail">E-mail do Amigo (opcional)</Label>
              <Input
                id="referredEmail"
                type="email"
                placeholder="amigo@email.com"
                value={formData.referredEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, referredEmail: e.target.value }))}
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Benefícios da Indicação:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 1 mês gratuito quando seu amigo se matricular</li>
                <li>• Descontos em produtos da loja</li>
                <li>• Prioridade em agendamentos</li>
              </ul>
            </div>

            <Button
              type="submit"
              className="w-full bg-red-accent hover:bg-red-accent/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Users className="mr-2 h-4 w-4" />
                  Indicar Amigo
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}