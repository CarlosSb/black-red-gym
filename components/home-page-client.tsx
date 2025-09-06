"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import DataService, { type PlanData, type AcademySettingsData } from "@/lib/data-service"

interface HomePageClientProps {
  settings: AcademySettingsData
  plans: PlanData[]
}

export function HomePageClient({ settings, plans }: HomePageClientProps) {
  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contactForm.name || !contactForm.email || !contactForm.message) return

    setIsSubmitting(true)
    try {
      await DataService.createMessage({
        name: contactForm.name,
        email: contactForm.email,
        phone: contactForm.phone,
        subject: "Contato via site",
        message: contactForm.message,
        status: "unread",
        priority: "medium"
      })
      
      // Reset form
      setContactForm({ name: "", phone: "", email: "", message: "" })
      alert("Mensagem enviada com sucesso! Entraremos em contato em breve.")
    } catch (error) {
      console.error("Error sending message:", error)
      alert("Erro ao enviar mensagem. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleContactSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input 
          placeholder="Nome" 
          value={contactForm.name}
          onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
          required
        />
        <Input 
          placeholder="Telefone" 
          value={contactForm.phone}
          onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
        />
      </div>
      <Input 
        placeholder="E-mail" 
        type="email"
        value={contactForm.email}
        onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
        required
      />
      <Textarea 
        placeholder="Sua mensagem..." 
        rows={4}
        value={contactForm.message}
        onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
        required
      />
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
          "Enviar Mensagem"
        )}
      </Button>
    </form>
  )
}
