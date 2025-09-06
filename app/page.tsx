"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dumbbell, Users, Clock, Trophy, Star, MapPin, Phone, Mail, Loader2 } from "lucide-react"
import Link from "next/link"
import DataService, { type PlanData, type AcademySettingsData } from "@/lib/data-service"
import { useDynamicColors } from "@/hooks/use-dynamic-colors"

export default function HomePage() {
  const [settings, setSettings] = useState<AcademySettingsData | null>(null)
  const [plans, setPlans] = useState<PlanData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Apply dynamic colors
  useDynamicColors(settings)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [loadedSettings, loadedPlans] = await Promise.all([
          DataService.getSettings(),
          DataService.getPlans()
        ])
        setSettings(loadedSettings)
        setPlans(loadedPlans)
      } catch (error) {
        console.error("Error loading homepage data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-red-accent mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Erro ao carregar dados da academia.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-black-red text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-8 w-8 text-red-accent" />
            <h1 className="text-2xl font-bold">{settings.name.toUpperCase()}</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#inicio" className="hover:text-red-accent transition-colors">
              Início
            </Link>
            <Link href="#planos" className="hover:text-red-accent transition-colors">
              Planos
            </Link>
            <Link href="#sobre" className="hover:text-red-accent transition-colors">
              Sobre
            </Link>
            <Link href="#contato" className="hover:text-red-accent transition-colors">
              Contato
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button
                variant="outline"
                className="border-red-accent text-red-accent hover:bg-red-accent hover:text-white bg-transparent"
              >
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-red-accent hover:bg-red-accent/90">Matricule-se</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="bg-black-red text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-red-accent text-white">Nova Academia</Badge>
          <h2 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
            TRANSFORME SEU <span className="text-red-accent">CORPO</span>
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-3xl mx-auto text-pretty">
            {settings.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-red-accent hover:bg-red-accent/90 text-white">
                Comece Hoje
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black bg-transparent"
            >
              Conheça a Academia
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Por que escolher a Black Red?</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Oferecemos tudo que você precisa para alcançar seus objetivos fitness
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <Dumbbell className="h-12 w-12 text-red-accent mx-auto mb-4" />
                <CardTitle>Equipamentos Modernos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Equipamentos de última geração para todos os tipos de treino</p>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <Users className="h-12 w-12 text-red-accent mx-auto mb-4" />
                <CardTitle>Personal Trainers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Profissionais qualificados para te orientar em cada exercício</p>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <Clock className="h-12 w-12 text-red-accent mx-auto mb-4" />
                <CardTitle>Horário Flexível</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Aberto das {settings.hours.weekdays.open} às {settings.hours.weekdays.close} para se adequar à sua rotina</p>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <Trophy className="h-12 w-12 text-red-accent mx-auto mb-4" />
                <CardTitle>Resultados Garantidos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Metodologia comprovada para alcançar seus objetivos</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="planos" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Escolha seu Plano</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Planos flexíveis que se adaptam ao seu estilo de vida e objetivos
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans
              .filter(plan => plan.status === "active")
              .sort((planA, planB) => planA.price - planB.price)
              .map((plan) => (
              <Card 
                key={plan.id} 
                className={`border-2 transition-colors ${
                  plan.popular 
                    ? "border-red-accent relative" 
                    : "hover:border-red-accent"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-accent text-white">
                    Mais Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="text-4xl font-bold text-red-accent">
                    R$ {plan.price}<span className="text-lg text-muted-foreground">/mês</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-red-accent" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-red-accent hover:bg-red-accent/90">Escolher Plano</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="sobre" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold mb-6">Sobre a {settings.name}</h3>
              <p className="text-lg text-muted-foreground mb-6 text-pretty">
                Fundada em 2024, a Black Red nasceu com o propósito de revolucionar o conceito de academia. Combinamos
                tecnologia de ponta com metodologias comprovadas para oferecer uma experiência única de treino.
              </p>
              <p className="text-lg text-muted-foreground mb-8 text-pretty">
                Nossa equipe de profissionais qualificados está sempre pronta para te ajudar a alcançar seus objetivos,
                seja ganho de massa muscular, perda de peso ou melhoria do condicionamento físico.
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-red-accent">500+</div>
                  <div className="text-sm text-muted-foreground">Alunos Ativos</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-accent">15</div>
                  <div className="text-sm text-muted-foreground">Personal Trainers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-accent">24/7</div>
                  <div className="text-sm text-muted-foreground">Funcionamento</div>
                </div>
              </div>
            </div>
            <div className="bg-black-red rounded-lg p-8 text-white">
              <img
                src="/modern-gym-interior-with-red-and-black-equipment.jpg"
                alt="Interior da academia Black Red"
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <h4 className="text-xl font-bold mb-4">Ambiente Motivador</h4>
              <p className="text-muted-foreground">
                Espaço moderno e climatizado, com música ambiente e iluminação especial para criar o ambiente perfeito
                para seus treinos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contato" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Entre em Contato</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tire suas dúvidas ou agende uma visita. Estamos aqui para te ajudar!
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <Card className="p-8">
              <CardHeader className="px-0 pt-0">
                <CardTitle>Envie uma Mensagem</CardTitle>
                <CardDescription>Responderemos em até 24 horas</CardDescription>
              </CardHeader>
              <CardContent className="px-0 space-y-4">
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
              </CardContent>
            </Card>

            <div className="space-y-8">
              <div>
                <h4 className="text-xl font-bold mb-6">Informações de Contato</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-red-accent" />
                    <div>
                      <p className="font-medium">Endereço</p>
                      <p className="text-muted-foreground">{settings.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-red-accent" />
                    <div>
                      <p className="font-medium">Telefone</p>
                      <p className="text-muted-foreground">{settings.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-red-accent" />
                    <div>
                      <p className="font-medium">E-mail</p>
                      <p className="text-muted-foreground">{settings.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-bold mb-4">Horários de Funcionamento</h4>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Segunda a Sexta:</span>
                    <span>{settings.hours.weekdays.open} - {settings.hours.weekdays.close}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sábado:</span>
                    <span>{settings.hours.saturday.open} - {settings.hours.saturday.close}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Domingo:</span>
                    <span>{settings.hours.sunday.open} - {settings.hours.sunday.close}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black-red text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Dumbbell className="h-6 w-6 text-red-accent" />
                <h5 className="text-xl font-bold">{settings.name.toUpperCase()}</h5>
              </div>
              <p className="text-muted-foreground">Transformando vidas através do fitness desde 2024.</p>
            </div>
            <div>
              <h6 className="font-bold mb-4">Links Rápidos</h6>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="#inicio" className="hover:text-red-accent transition-colors">
                    Início
                  </Link>
                </li>
                <li>
                  <Link href="#planos" className="hover:text-red-accent transition-colors">
                    Planos
                  </Link>
                </li>
                <li>
                  <Link href="#sobre" className="hover:text-red-accent transition-colors">
                    Sobre
                  </Link>
                </li>
                <li>
                  <Link href="#contato" className="hover:text-red-accent transition-colors">
                    Contato
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h6 className="font-bold mb-4">Serviços</h6>
              <ul className="space-y-2 text-muted-foreground">
                <li>Musculação</li>
                <li>Personal Training</li>
                <li>Aulas em Grupo</li>
                <li>Avaliação Física</li>
              </ul>
            </div>
            <div>
              <h6 className="font-bold mb-4">Contato</h6>
              <ul className="space-y-2 text-muted-foreground">
                <li>{settings.phone}</li>
                <li>{settings.email}</li>
                <li>{settings.address}</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-muted-foreground/20 mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 {settings.name}. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
