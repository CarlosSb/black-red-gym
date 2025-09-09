import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dumbbell, Users, Clock, Trophy, Star, MapPin, Phone, Mail, Loader2 } from "lucide-react"
import Link from "next/link"
import { MobileMenu } from "@/components/mobile-menu"
import { HomePageClient } from "@/components/home-page-client"
import { DynamicColorsProvider } from "@/components/dynamic-colors-provider"
import { MatriculeSeButton } from "@/components/matricule-se-button"
import { CheckInModal } from "@/components/checkin-modal"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { AppointmentModal } from "@/components/appointment-modal"
import { PlanSelectionModal } from "@/components/plan-selection-modal"

async function HomePageContent() {
  // Fetch settings from API
  const settingsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/settings`, {
    cache: 'no-store' // Ensure fresh data for SSR
  })
  const settingsData = await settingsResponse.json()
  const settings = settingsData.success ? settingsData.settings : null

  // Fetch plans from API
  const plansResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/plans`, {
    cache: 'no-store'
  })
  const plansData = await plansResponse.json()
  const plans = plansData.success ? plansData.plans : []

  // Fallback settings if API fails
  const defaultSettings = {
    name: "Black Red Academia",
    description: "Academia moderna com equipamentos de última geração, personal trainers qualificados e ambiente motivador.",
    phone: "(11) 99999-9999",
    email: "contato@blackred.com.br",
    address: "Rua das Academias, 123 - Centro",
    whatsapp: "5511999999999",
    hours: {
      weekdays: { open: "05:00", close: "23:00" },
      saturday: { open: "06:00", close: "20:00" },
      sunday: { open: "08:00", close: "18:00" }
    },
    colors: {
      primary: "#DC2626",
      secondary: "#000000"
    },
    notifications: {
      newMessages: true,
      newMembers: true,
      payments: true,
      weeklyReports: false
    },
    logo: "/placeholder-logo.png",
    about: "Fundada em 2024, a Black Red nasceu com o propósito de revolucionar o conceito de academia. Combinamos tecnologia de ponta com metodologias comprovadas para oferecer uma experiência única de treino. Nossa equipe de profissionais qualificados está sempre pronta para te ajudar a alcançar seus objetivos, seja ganho de massa muscular, perda de peso ou melhoria do condicionamento físico.",
    heroTitle: "TRANSFORME SEU CORPO",
    heroSubtitle: "Nova Academia",
    heroImage: "/modern-gym-interior-with-red-and-black-equipment.jpg",
    features: {
      title: "Por que escolher a Black Red?",
      description: "Oferecemos tudo que você precisa para alcançar seus objetivos fitness",
      items: [
        {
          icon: "Dumbbell",
          title: "Equipamentos Modernos",
          description: "Equipamentos de última geração para todos os tipos de treino"
        },
        {
          icon: "Users",
          title: "Personal Trainers",
          description: "Profissionais qualificados para te orientar em cada exercício"
        },
        {
          icon: "Clock",
          title: "Horário Flexível",
          description: "Aberto das 05:00 às 23:00 para se adequar à sua rotina"
        },
        {
          icon: "Trophy",
          title: "Resultados Garantidos",
          description: "Metodologia comprovada para alcançar seus objetivos"
        }
      ]
    },
    metrics: {
      activeMembers: 500,
      personalTrainers: 15,
      operatingHours: "24/7",
      foundedYear: 2024
    }
  }

  const finalSettings = settings || defaultSettings

  return (
    <DynamicColorsProvider settings={finalSettings}>
      <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-black-red text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {finalSettings.logo ? (
              <img src={finalSettings.logo} alt="Logo" className="h-8 w-8 object-contain" />
            ) : (
              <Dumbbell className="h-8 w-8 text-red-accent" />
            )}
            <h1 className="text-2xl font-bold">{finalSettings.name?.toUpperCase() || "ACADEMIA"}</h1>
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
            <MobileMenu settings={finalSettings} />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="bg-black-red text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-red-accent text-white">{finalSettings.heroSubtitle || "Nova Academia"}</Badge>
          <h2 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
            {finalSettings.heroTitle || "TRANSFORME SEU CORPO"}
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-3xl mx-auto text-pretty">
            {finalSettings.description}
          </p>

          {/* Botões na parte inferior */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <MatriculeSeButton
              settings={finalSettings}
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
            <h3 className="text-3xl md:text-4xl font-bold mb-4">{finalSettings.features?.title || `Por que escolher a ${finalSettings.name}?`}</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {finalSettings.features?.description || "Oferecemos tudo que você precisa para alcançar seus objetivos fitness"}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {finalSettings.features?.items?.map((feature: any, index: number) => {
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
              .filter((plan: any) => plan.status === "active")
              .sort((planA: any, planB: any) => planA.price - planB.price)
              .map((plan: any) => (
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
                    {plan.features.map((feature: string, index: number) => (
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
              <h3 className="text-3xl md:text-4xl font-bold mb-6">Sobre a {finalSettings.name}</h3>
              <div className="text-lg text-muted-foreground mb-8 text-pretty">
                {finalSettings.about ? (
                  <p>{finalSettings.about}</p>
                ) : (
                  <>
                    <p className="mb-6">
                      Fundada em 2024, a {finalSettings.name} nasceu com o propósito de revolucionar o conceito de academia. Combinamos
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
                  <div className="text-3xl font-bold text-red-accent">{finalSettings.metrics?.activeMembers || 500}+</div>
                  <div className="text-sm text-muted-foreground">Alunos Ativos</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-accent">{finalSettings.metrics?.personalTrainers || 15}</div>
                  <div className="text-sm text-muted-foreground">Personal Trainers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-accent">{finalSettings.metrics?.operatingHours || "24/7"}</div>
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

      {/* Testimonials Carousel */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Depoimentos dos Alunos</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Veja o que nossos alunos dizem sobre a experiência na {finalSettings.name}
            </p>
          </div>

          {/* Carousel Container */}
          <div className="relative overflow-hidden">
            <div className="flex gap-8 animate-carousel">
              {/* Testimonial 1 */}
              <Card className="flex-shrink-0 w-full md:w-1/3 text-center border-0 shadow-lg py-8">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-red-accent rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xl">JS</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">João Silva</CardTitle>
                  <div className="flex justify-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">
                    &ldquo;A BlackRed Fix transformou completamente minha rotina de treinos! Os equipamentos são de primeira linha e os profissionais são extremamente preparados.
                    Em 8 meses consegui perder 18kg e ganhar massa muscular. Recomendo para todos que querem resultados reais!&rdquo;
                  </p>
                </CardContent>
              </Card>

              {/* Testimonial 2 */}
              <Card className="flex-shrink-0 w-full md:w-1/3 text-center border-0 shadow-lg py-8">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-red-accent rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xl">MS</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">Maria Santos</CardTitle>
                  <div className="flex justify-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">
                    &ldquo;Excelente academia! Os equipamentos são modernos e sempre bem cuidados.
                    As aulas em grupo são muito divertidas e os resultados são visíveis rapidamente.&rdquo;
                  </p>
                </CardContent>
              </Card>

              {/* Testimonial 3 */}
              <Card className="flex-shrink-0 w-full md:w-1/3 text-center border-0 shadow-lg py-8">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-red-accent rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xl">PC</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">Pedro Costa</CardTitle>
                  <div className="flex justify-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">
                    &ldquo;Melhor investimento que fiz! A equipe é muito preparada e sempre disposta a ajudar.
                    Recomendo para todos que querem mudar de vida através do fitness.&rdquo;
                  </p>
                </CardContent>
              </Card>

              {/* Testimonial 4 (Duplicate for seamless loop) */}
              <Card className="flex-shrink-0 w-full md:w-1/3 text-center border-0 shadow-lg py-8">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-red-accent rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xl">JS</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">João Silva</CardTitle>
                  <div className="flex justify-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">
                    &ldquo;A Black Red transformou minha rotina de treinos. Os profissionais são incríveis e o ambiente é motivador.
                    Perdi 15kg em 6 meses e me sinto muito mais confiante!&rdquo;
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Carousel Navigation Dots */}
          <div className="flex justify-center mt-8 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-accent"></div>
            <div className="w-3 h-3 rounded-full bg-muted-foreground/30"></div>
            <div className="w-3 h-3 rounded-full bg-muted-foreground/30"></div>
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

          {/* Layout responsivo: 2 colunas em desktop, stacked em mobile */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {/* Formulário de Contato */}
            <Card className="p-6 lg:p-8 order-1">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl lg:text-2xl">Envie uma Mensagem</CardTitle>
                <CardDescription className="text-base">Responderemos em até 24 horas</CardDescription>
              </CardHeader>
              <CardContent className="px-0 space-y-4">
                <Suspense fallback={<div className="text-center py-8">Carregando formulário...</div>}>
                  <HomePageClient settings={finalSettings} plans={plans} />
                </Suspense>
              </CardContent>
            </Card>

            {/* Informações de Contato */}
            <div className="space-y-8 order-2">
              {/* Informações de Contato */}
              <div>
                <h4 className="text-xl font-bold mb-6">Informações de Contato</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-red-accent mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Endereço</p>
                      <p className="text-muted-foreground">{finalSettings.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-red-accent flex-shrink-0" />
                    <div>
                      <p className="font-medium">Telefone</p>
                      <p className="text-muted-foreground">{finalSettings.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-red-accent flex-shrink-0" />
                    <div>
                      <p className="font-medium">E-mail</p>
                      <p className="text-muted-foreground">{finalSettings.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Horários de Funcionamento */}
              <div>
                <h4 className="text-xl font-bold mb-4">Horários de Funcionamento</h4>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex justify-between items-center py-1">
                    <span className="font-medium">Segunda a Sexta:</span>
                    <span>{finalSettings.hours.weekdays.open} - {finalSettings.hours.weekdays.close}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="font-medium">Sábado:</span>
                    <span>{finalSettings.hours.saturday.open} - {finalSettings.hours.saturday.close}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="font-medium">Domingo:</span>
                    <span>{finalSettings.hours.sunday.open} - {finalSettings.hours.sunday.close}</span>
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
                <h5 className="text-xl font-bold">{finalSettings.name.toUpperCase()}</h5>
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
                <li>{finalSettings.phone}</li>
                <li>{finalSettings.email}</li>
                <li>{finalSettings.address}</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-muted-foreground/20 mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 {finalSettings.name}. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Button */}
      <WhatsAppButton
        phoneNumber={finalSettings.whatsapp || "5511999999999"}
        message={`Olá, gostaria de mais informações sobre a ${finalSettings.name}!`}
      />
      </div>
    </DynamicColorsProvider>
  )
}

export default function HomePage() {
  return <HomePageContent />
}
