"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dumbbell, LayoutDashboard, CreditCard, MessageSquare, Settings, LogOut, Menu, X, Calendar, Info, Bot, Gift, Users, Megaphone, ChevronDown, ChevronRight } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
import { useAcademySettings } from "@/hooks/use-academy-settings"

const navigationGroups = [
  {
    title: "Principal",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Agendamentos", href: "/dashboard/appointments", icon: Calendar },
      { name: "Mensagens", href: "/dashboard/messages", icon: MessageSquare },
    ]
  },
  {
    title: "Conteúdo",
    items: [
      { name: "Planos", href: "/dashboard/plans", icon: CreditCard },
      { name: "Promoções", href: "/dashboard/promotions", icon: Gift },
      { name: "Parceiros", href: "/dashboard/partners", icon: Users },
      { name: "Anúncios", href: "/dashboard/ads", icon: Megaphone },
    ]
  },
  {
    title: "Sistema",
    items: [
      { name: "Assistente AI", href: "/dashboard/knowledge", icon: Bot },
      { name: "Sobre", href: "/dashboard/about", icon: Info },
      { name: "Configurações", href: "/dashboard/settings", icon: Settings },
    ]
  }
]

export function DashboardSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const { settings } = useAcademySettings()

  // Estado inicial - sempre começa com todas as seções fechadas
  const [expandedSections, setExpandedSections] = useState({
    principal: false,
    conteudo: false,
    sistema: false
  })

  // Efeito para abrir a seção correta baseada na página atual
  useEffect(() => {
    const principalItems = navigationGroups[0].items.map(item => item.href)
    const conteudoItems = navigationGroups[1].items.map(item => item.href)
    const sistemaItems = navigationGroups[2].items.map(item => item.href)

    let newState = { principal: false, conteudo: false, sistema: false }

    if (principalItems.includes(pathname)) {
      newState.principal = true
    } else if (conteudoItems.includes(pathname)) {
      newState.conteudo = true
    } else if (sistemaItems.includes(pathname)) {
      newState.sistema = true
    } else {
      // Se não encontrou nenhuma correspondência, abre a principal
      newState.principal = true
    }

    setExpandedSections(newState)
  }, [pathname])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => {
      // Se a seção já está aberta, fecha ela
      if (prev[section]) {
        return {
          ...prev,
          [section]: false
        }
      }

      // Caso contrário, fecha todas e abre apenas a selecionada
      return {
        principal: false,
        conteudo: false,
        sistema: false,
        [section]: true
      }
    })
  }

  // Função para verificar se uma seção tem itens selecionados
  const hasSelectedItem = (sectionKey: keyof typeof expandedSections) => {
    const section = navigationGroups.find(group => group.title.toLowerCase() === sectionKey)
    if (!section) return false

    return section.items.some(item => pathname === item.href)
  }

  // Função para verificar se uma seção deve estar destacada (apenas se tem item ativo)
  const shouldHighlightSection = (sectionKey: keyof typeof expandedSections) => {
    return hasSelectedItem(sectionKey)
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl border-r-2 border-red-600">
      {/* Header */}
      <div className="flex items-center gap-3 p-6 border-b border-white/10">
        <Dumbbell className="h-6 w-6 text-red-500" />
        <h1 className="text-lg font-bold tracking-wide">{settings?.name?.toUpperCase() || "GYM STARTER"}</h1>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-red-accent text-white">{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user?.name}</p>
            <p className="text-sm text-white/70 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-6">
          {navigationGroups.map((group, index) => {
            const sectionKey = group.title.toLowerCase() as keyof typeof expandedSections
            const isExpanded = expandedSections[sectionKey]

            return (
              <div key={group.title}>
                <button
                  onClick={() => toggleSection(sectionKey)}
                  className={`flex items-center justify-between w-full px-4 py-3 text-xs font-semibold uppercase tracking-wider hover:text-white hover:bg-white/5 transition-all duration-200 rounded-lg ${
                    shouldHighlightSection(sectionKey)
                      ? 'text-white bg-red-600/20 border-l-2 border-red-500'
                      : 'text-white/60'
                  }`}
                >
                  <span className="font-bold">{group.title}</span>
                  <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {isExpanded && (
                  <ul className="space-y-1 mt-2">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href
                      return (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 overflow-hidden",
                              isActive ? "bg-red-600 text-white" : "text-white/70 hover:text-white hover:bg-white/10",
                            )}
                            onClick={() => setIsMobileMenuOpen(false)}
                            title={item.name}
                          >
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                            <span className="truncate">{item.name}</span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <Button
          variant="ghost"
          className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-lg py-3"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          <span className="font-medium">Sair</span>
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-background"
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-72 border-r-0">{sidebarContent}</div>

      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-72">{sidebarContent}</div>
        </div>
      )}
    </>
  )
}
