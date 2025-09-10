"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Menu, Dumbbell, MessageCircle } from "lucide-react"
import { AcademySettingsData } from "@/lib/data-service"

// Hook para aplicar cores dinâmicas
function useDynamicColors(settings: AcademySettingsData) {
  useEffect(() => {
    if (!settings?.colors) return

    // Aplicar cores dinâmicas ao CSS root
    const root = document.documentElement
    root.style.setProperty('--dynamic-primary', settings.colors.primary)
    root.style.setProperty('--dynamic-secondary', settings.colors.secondary)

    // Cleanup
    return () => {
      root.style.removeProperty('--dynamic-primary')
      root.style.removeProperty('--dynamic-secondary')
    }
  }, [settings?.colors])
}

interface MobileMenuProps {
  settings: AcademySettingsData
}

export function MobileMenu({ settings }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Aplicar cores dinâmicas
  useDynamicColors(settings)

  // Fechar menu automaticamente quando a tela for redimensionada para > md
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen])

  const handleLinkClick = () => {
    setIsOpen(false)
  }

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${settings.whatsapp || '5511999999999'}?text=Olá! Gostaria de me matricular na ${settings.name || 'Gym Starter'}.`, '_blank')
    setIsOpen(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden text-white hover:bg-white/10 transition-all duration-200 rounded-lg p-2"
          style={{
            color: 'white',
            '--hover-color': settings.colors?.primary || '#DC2626'
          } as React.CSSProperties}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[280px] sm:w-[320px] text-white border-l backdrop-blur-sm"
        style={{
          backgroundColor: settings.colors?.secondary || '#000000',
          borderLeftColor: `${settings.colors?.primary}20` || '#DC262620'
        }}
      >
        <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
        <div className="flex flex-col h-full pt-6">
          {/* Header com logo e nome otimizado */}
          <div className="mb-8 px-2">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {settings.logo ? (
                  <img
                    src={settings.logo}
                    alt="Logo"
                    className="h-10 w-10 object-contain rounded-lg bg-white/10 p-1"
                  />
                ) : (
                  <div
                    className="h-10 w-10 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: `${settings.colors?.primary}20` || '#DC262620'
                    }}
                  >
                    <Dumbbell
                      className="h-6 w-6"
                      style={{ color: settings.colors?.primary || '#DC2626' }}
                    />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg font-bold text-white truncate">
                  {settings.name}
                </h1>
                <p className="text-xs text-white/60">Academia</p>
              </div>
            </div>
          </div>

          {/* Navigation com design moderno */}
          <nav className="flex-1 px-2">
            <div className="space-y-1">
              {[
                { href: "#inicio", label: "Início" },
                { href: "#planos", label: "Planos" },
                { href: "#sobre", label: "Sobre" },
                { href: "#contato", label: "Contato" }
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center px-4 py-3 text-base font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 border border-transparent hover:border-white/20"
                  onClick={handleLinkClick}
                  style={{
                    '--hover-bg': `${settings.colors?.primary}10` || '#DC262610'
                  } as React.CSSProperties}
                >
                  <span className="truncate">{item.label}</span>
                  <div
                    className="ml-auto w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ backgroundColor: settings.colors?.primary || '#DC2626' }}
                  />
                </Link>
              ))}
            </div>
          </nav>

          {/* Auth Buttons com design moderno */}
          <div className="px-2 pb-6">
            <div className="pt-6 border-t border-white/10">
              <div className="space-y-4 gap-0. flex flex-col">
                <Link href="/login" onClick={handleLinkClick}>
                  <Button
                    variant="outline"
                    className="w-full bg-white/5 border-white/20 text-white rounded-xl py-3 backdrop-blur-sm"
                  >
                    Entrar
                  </Button>
                </Link>
                <Button
                  className="w-full text-white font-semibold rounded-xl py-3 shadow-lg transition-all duration-200 flex items-center gap-2"
                  onClick={handleWhatsAppClick}
                  style={{
                    backgroundColor: settings.colors?.primary || '#DC2626',
                    '--hover-bg': settings.colors?.primary ? `${settings.colors.primary}E6` : '#DC2626E6',
                    '--shadow-color': settings.colors?.primary ? `${settings.colors.primary}40` : '#DC262640'
                  } as React.CSSProperties}
                >
                  <MessageCircle className="h-4 w-4" />
                  Matricule-se
                </Button>
              </div>
            </div>

            {/* Footer discreto */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <p className="text-xs text-white/40 text-center">
                © 2024 {settings.name}
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
