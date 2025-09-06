"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Menu, X, Dumbbell } from "lucide-react"
import { AcademySettingsData } from "@/lib/data-service"

interface MobileMenuProps {
  settings: AcademySettingsData
}

export function MobileMenu({ settings }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const breakpoint = 768
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= breakpoint && isOpen) {
        setIsOpen(false) 
      }
    }

    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [isOpen, setIsOpen])

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden text-white hover:text-black"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" hideClose className="w-[300px] sm:w-[400px] bg-black-red text-white md:hidden">
        <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
        <div className="flex flex-col h-full p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              {settings.logo ? (
                <img src={settings.logo} alt="Logo" className="h-8 w-8 object-contain" />
              ) : (
                <Dumbbell className="h-8 w-8 text-red-accent" />
              )}
              <h1 className="text-xl font-bold">{settings.name.toUpperCase()}</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-black"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-4">
            <Link
              href="#inicio"
              className="block py-3 px-4 text-lg hover:text-red-accent transition-colors border-b border-gray-700"
              onClick={() => setIsOpen(false)}
            >
              Início
            </Link>
            <Link
              href="#planos"
              className="block py-3 px-4 text-lg hover:text-red-accent transition-colors border-b border-gray-700"
              onClick={() => setIsOpen(false)}
            >
              Planos
            </Link>
            <Link
              href="#sobre"
              className="block py-3 px-4 text-lg hover:text-red-accent transition-colors border-b border-gray-700"
              onClick={() => setIsOpen(false)}
            >
              Sobre
            </Link>
            <Link
              href="#contato"
              className="block py-3 px-4 text-lg hover:text-red-accent transition-colors border-b border-gray-700"
              onClick={() => setIsOpen(false)}
            >
              Contato
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="space-y-3 pt-6 border-t border-gray-700 ">
            <Link href="/login" className="block" onClick={() => setIsOpen(false)}>
              <Button
                variant="outline"
                className="w-full border-red-accent text-red-accent hover:bg-red-accent hover:text-white bg-transparent"
              >
                Login
              </Button>
            </Link>
            <Button 
              className="w-full bg-red-accent hover:bg-red-accent/90"
              onClick={() => {
                window.open(`https://wa.me/${settings.whatsapp || '5511999999999'}?text=Olá! Gostaria de me matricular na Black Red Academia.`, '_blank')
                setIsOpen(false)
              }}
            >
              Matricule-se
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
