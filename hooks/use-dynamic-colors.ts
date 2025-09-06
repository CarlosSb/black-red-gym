import { useEffect } from 'react'
import { AcademySettingsData } from '@/lib/data-service'

// Helper function to convert hex to oklch (simplified)
function hexToOklch(hex: string): string {
  // For now, we'll use the hex color directly
  // In a production app, you'd want to convert to oklch properly
  return hex
}

export function useDynamicColors(settings: AcademySettingsData | null) {
  useEffect(() => {
    if (!settings?.colors) return

    const { primary, secondary } = settings.colors

    // Apply primary color
    if (primary) {
      const primaryColor = hexToOklch(primary)
      document.documentElement.style.setProperty('--red-accent', primaryColor)
      document.documentElement.style.setProperty('--primary', primaryColor)
    }

    // Apply secondary color
    if (secondary) {
      const secondaryColor = hexToOklch(secondary)
      document.documentElement.style.setProperty('--secondary', secondaryColor)
    }
  }, [settings?.colors])
}
