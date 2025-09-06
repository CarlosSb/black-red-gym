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
    }
  }, [settings])

  return <>{children}</>
}
