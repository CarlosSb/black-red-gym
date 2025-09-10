"use client"

import { ReactNode, forwardRef } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StandardCardProps {
  variant?: 'promotion' | 'partner' | 'ad' | 'testimonial'
  size?: 'sm' | 'md' | 'lg'
  featured?: boolean
  interactive?: boolean
  onClick?: () => void
  className?: string
  children: ReactNode
  role?: string
  tabIndex?: number
  'aria-label'?: string
  onKeyDown?: (event: React.KeyboardEvent) => void
}

const StandardCard = forwardRef<HTMLDivElement, StandardCardProps>(({
  variant = 'promotion',
  size = 'md',
  featured = false,
  interactive = false,
  onClick,
  className,
  children,
  role,
  tabIndex,
  'aria-label': ariaLabel,
  onKeyDown,
  ...props
}, ref) => {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (interactive && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault()
      onClick?.()
    }
    onKeyDown?.(event)
  }

  const cardClasses = cn(
    // Base styles
    "relative overflow-hidden transition-all duration-300 ease-in-out",
    "border border-gray-200 bg-white shadow-sm",

    // Size variants
    {
      'max-w-sm': size === 'sm',
      'max-w-md': size === 'md',
      'max-w-lg': size === 'lg',
    },

    // Interactive states
    {
      'cursor-pointer hover:shadow-lg hover:-translate-y-1 focus-within:shadow-lg focus-within:-translate-y-1': interactive,
      'hover:border-red-300 focus-within:border-red-300': interactive && variant === 'promotion',
      'hover:border-blue-300 focus-within:border-blue-300': interactive && variant === 'partner',
      'hover:border-purple-300 focus-within:border-purple-300': interactive && variant === 'ad',
      'hover:border-green-300 focus-within:border-green-300': interactive && variant === 'testimonial',
    },

    // Featured styles
    {
      'ring-2 ring-yellow-400 ring-opacity-50': featured,
      'border-yellow-300': featured,
    },

    className
  )

  const content = (
    <>
      {featured && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white shadow-sm">
            ⭐ Destaque
          </Badge>
        </div>
      )}

      {children}
    </>
  )

  if (interactive) {
    return (
      <Card
        ref={ref}
        className={cardClasses}
        role={role || "button"}
        tabIndex={tabIndex ?? 0}
        aria-label={ariaLabel}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {content}
      </Card>
    )
  }

  return (
    <Card
      ref={ref}
      className={cardClasses}
      {...props}
    >
      {content}
    </Card>
  )
})

StandardCard.displayName = "StandardCard"

export { StandardCard }
export type { StandardCardProps }