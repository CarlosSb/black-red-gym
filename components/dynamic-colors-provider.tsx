"use client"

import { useEffect } from "react"
import { AcademySettingsData } from "@/lib/data-service"

interface DynamicColorsProviderProps {
  settings: AcademySettingsData
  children: React.ReactNode
}

export function DynamicColorsProvider({ settings, children }: DynamicColorsProviderProps) {
  useEffect(() => {
    if (settings?.colors) {
      const root = document.documentElement
      root.style.setProperty('--red-accent', settings.colors.primary)
      root.style.setProperty('--black-red', settings.colors.secondary)
      // Create a darker version of secondary for gradient
      const darkerSecondary = darkenColor(settings.colors.secondary, 0.2)
      root.style.setProperty('--black-red-dark', darkerSecondary)
    }
  }, [settings])

  // Helper function to darken a color
  function darkenColor(color: string, amount: number): string {
    // Simple darkening by reducing brightness
    const hex = color.replace('#', '')
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) * (1 - amount))
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) * (1 - amount))
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) * (1 - amount))
    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`
  }

  return <>{children}</>
}
