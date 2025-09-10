"use client"

import { Button } from "@/components/ui/button"
import { AcademySettingsData } from "@/lib/data-service"

interface MatriculeSeButtonProps {
  settings: AcademySettingsData
  className?: string
  children: React.ReactNode
}

export function MatriculeSeButton({ settings, className, children }: MatriculeSeButtonProps) {
  const handleClick = () => {
    window.open(`https://wa.me/${settings.whatsapp || '5511999999999'}?text=Olá! Gostaria de me matricular na ${settings.name || 'Gym Starter'}.`, '_blank')
  }

  return (
    <Button
      size="lg"
      className={className}
      onClick={handleClick}
    >
      {children}
    </Button>
  )
}
