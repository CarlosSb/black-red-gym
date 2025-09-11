import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dumbbell, Users, Clock, Trophy, Star, MapPin, Phone, Mail } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getServerSettings, getServerPlans } from "@/lib/server-data"
import { MobileMenu } from "@/components/mobile-menu"
import { HomePageClient } from "@/components/home-page-client"
import { DynamicColorsProvider } from "@/components/dynamic-colors-provider"
import { MatriculeSeButton } from "@/components/matricule-se-button"
import { CheckInModal } from "@/components/checkin-modal"
import { AppointmentModal } from "@/components/appointment-modal"
import { ChatFlutuante } from "@/components/chat-flutuante"
import { PlanSelectionModal } from "@/components/plan-selection-modal"
import { UnifiedContentSection } from "@/components/unified-content-section"
import { AdsBanner } from "@/components/ads-banner"
import { TestimonialCard } from "@/components/ui/testimonial-card"
import { TestimonialsCarousel } from "@/components/testimonials-carousel"
import { useTestimonials } from "@/hooks/use-testimonials"

export default async function HomePage() {
  const [settings, plans] = await Promise.all([
    getServerSettings(),
    getServerPlans()
  ])

  return (
    <DynamicColorsProvider settings={settings}>
      <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-black-red text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {settings.logo ? (
              <Image src={settings.logo} alt="Logo" width={32} height={32} className="h-8 w-8 object-contain" />
            ) : (
              <Dumbbell className="h-8 w-8 text-red-accent" />
            )}
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
            <div className="hidden md:flex items-center gap-2">
              <MatriculeSeButton
                settings={settings}
                className="bg-red-accent hover:bg-red-accent/90 text-white"
              >
                Matricule-se
              </MatriculeSeButton>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="border-red-accent text-red-accent hover:bg-red-accent hover:text-white bg-transparent"
                >
                  Login
                </Button>
              </Link>
            </div>
            <MobileMenu settings={settings} />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="bg-black-red text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-red-accent text-white">{settings.heroSubtitle || "Nova Academia"}</Badge>
          <h2 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
            {settings.heroTitle || "TRANSFORME SEU CORPO"}
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-3xl mx-auto text-pretty">
            {settings.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <MatriculeSeButton
              settings={settings}
              className="bg-red-accent hover:bg-red-accent/90 text-white"
            >
              Matricule-se
            </MatriculeSeButton>

            <CheckInModal>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black bg-transparent"
              >
                Fazer Check-in
              </Button>
            </CheckInModal>

            <AppointmentModal>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black bg-transparent"
              >
                Agendar Aula Experimental
              </Button>
            </AppointmentModal>

            <Link href="#sobre">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black bg-transparent"
              >
                Conheça a Academia
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">{settings.features?.title || `Por que escolher a ${settings.name}?`}</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {settings.features?.description || "Oferecemos tudo que você precisa para alcançar seus objetivos fitness"}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {settings.features?.items?.map((feature, index) => {
              const IconComponent = feature.icon === "Dumbbell" ? Dumbbell : 
                                  feature.icon === "Users" ? Users :
                                  feature.icon === "Clock" ? Clock :
                                  feature.icon === "Trophy" ? Trophy : Dumbbell
              
              return (
                <Card key={index} className="text-center border-0 shadow-lg">
                  <CardHeader>
                    <IconComponent className="h-12 w-12 text-red-accent mx-auto mb-4" />
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            }) || (
              <>
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
              </>
            )}
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
              .filter(plan => plan.status === "ACTIVE")
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
                <CardContent className="space-y-4 flex flex-col justify-between h-full">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-red-accent" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <PlanSelectionModal plan={plan}>
                    <Button className="w-full bg-red-accent hover:bg-red-accent/90">Escolher Plano</Button>
                  </PlanSelectionModal>
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
              <div className="text-lg text-muted-foreground mb-8 text-pretty">
                {settings.about ? (
                  <p>{settings.about}</p>
                ) : (
                  <>
                    <p className="mb-6">
                      Fundada em 2024, a {settings.name} nasceu com o propósito de revolucionar o conceito de academia. Combinamos
                      tecnologia de ponta com metodologias comprovadas para oferecer uma experiência única de treino.
                    </p>
                    <p>
                      Nossa equipe de profissionais qualificados está sempre pronta para te ajudar a alcançar seus objetivos,
                      seja ganho de massa muscular, perda de peso ou melhoria do condicionamento físico.
                    </p>
                  </>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-red-accent">{settings.metrics?.activeMembers || 500}+</div>
                  <div className="text-sm text-muted-foreground">Alunos Ativos</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-accent">{settings.metrics?.personalTrainers || 15}</div>
                  <div className="text-sm text-muted-foreground">Personal Trainers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-accent">{settings.metrics?.operatingHours || "24/7"}</div>
                  <div className="text-sm text-muted-foreground">Funcionamento</div>
                </div>
              </div>
            </div>
            <div className="bg-black-red rounded-lg p-8 text-white">
              <Image
                src="/modern-gym-interior-with-red-and-black-equipment.jpg"
                alt={`Interior da academia ${settings.name}`}
                width={400}
                height={256}
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

      {/* Testimonials Carousel */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Depoimentos dos Alunos</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Veja o que nossos alunos dizem sobre a experiência na {settings.name}
            </p>
          </div>

          <TestimonialsCarousel
            testimonials={[
              {
                id: "testimonial-1",
                name: "João Silva",
                content: `A ${settings.name} transformou completamente minha rotina de treinos! Os equipamentos são de primeira linha e os profissionais são extremamente preparados. Em 8 meses consegui perder 18kg e ganhar massa muscular. Recomendo para todos que querem resultados reais!`,
                rating: 5,
                category: "Perda de Peso",
                isActive: true,
                createdAt: "2024-01-15T10:00:00Z"
              },
              {
                id: "testimonial-2",
                name: "Maria Santos",
                content: "Excelente academia! Os equipamentos são modernos e sempre bem cuidados. As aulas em grupo são muito divertidas e os resultados são visíveis rapidamente.",
                rating: 5,
                category: "Condicionamento",
                isActive: true,
                createdAt: "2024-02-20T14:30:00Z"
              },
              {
                id: "testimonial-3",
                name: "Pedro Costa",
                content: "Melhor investimento que fiz! A equipe é muito preparada e sempre disposta a ajudar. Recomendo para todos que querem mudar de vida através do fitness.",
                rating: 5,
                category: "Ganho de Massa",
                isActive: true,
                createdAt: "2024-03-10T09:15:00Z"
              }
            ]}
            autoPlay={true}
            autoPlayInterval={6000}
          />
        </div>
      </section>

      {/* Unified Content Section - Partners, Ads, Promotions */}
      <UnifiedContentSection />

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
                <Suspense fallback={<div>Carregando formulário...</div>}>
                  <HomePageClient settings={settings} plans={plans} />
                </Suspense>
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

      <ChatFlutuante />
      <AdsBanner />
      </div>
    </DynamicColorsProvider>
  )
}
