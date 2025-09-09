"use client"

import { MessageCircle, X } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface WhatsAppButtonProps {
  phoneNumber?: string
  message?: string
}

export function WhatsAppButton({
  phoneNumber = "5511999999999",
  message = "Olá, gostaria de mais informações sobre a Black Red Academia!"
}: WhatsAppButtonProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  useEffect(() => {
    // Mostrar o botão após 3 segundos
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, "")}?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isMinimized ? (
        <Button
          onClick={() => setIsMinimized(false)}
          className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg transition-all duration-300 hover:scale-110"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl border max-w-xs animate-in slide-in-from-bottom-4">
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-sm">Black Red Academia</p>
                  <p className="text-xs text-muted-foreground">Online</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Precisa de ajuda? Fale conosco pelo WhatsApp!
            </p>
            <Button
              onClick={handleWhatsAppClick}
              className="w-full bg-green-500 hover:bg-green-600 text-white"
              size="sm"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Conversar no WhatsApp
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}