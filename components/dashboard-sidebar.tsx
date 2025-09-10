"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dumbbell, LayoutDashboard, CreditCard, MessageSquare, Settings, LogOut, Menu, X, Calendar, Info, Bot, Gift, Users, Megaphone } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Agendamentos", href: "/dashboard/appointments", icon: Calendar },
  { name: "Planos", href: "/dashboard/plans", icon: CreditCard },
  { name: "Mensagens", href: "/dashboard/messages", icon: MessageSquare },
  { name: "Promoções", href: "/dashboard/promotions", icon: Gift },
  { name: "Parceiros", href: "/dashboard/partners", icon: Users },
  { name: "Anúncios", href: "/dashboard/ads", icon: Megaphone },
  { name: "Assistente AI", href: "/dashboard/knowledge", icon: Bot },
  { name: "Sobre", href: "/dashboard/about", icon: Info },
  { name: "Configurações", href: "/dashboard/settings", icon: Settings },
]

export function DashboardSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-black-red text-white">
      {/* Header */}
      <div className="flex items-center gap-2 p-6 border-b border-white/10">
        <Dumbbell className="h-8 w-8 text-red-accent" />
        <h1 className="text-xl font-bold">BLACK RED</h1>
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
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive ? "bg-red-accent text-white" : "text-white/70 hover:text-white hover:bg-white/10",
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <Button
          variant="ghost"
          className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sair
        </Button>
      </div>
    </div>
  )

  if (!mounted) {
    return null
  }

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
      <div className="hidden lg:block w-64 border-r">{sidebarContent}</div>

      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-64">{sidebarContent}</div>
        </div>
      )}
    </>
  )
}
