"use client"

import { useState } from "react"
import { Facebook, Twitter, MessageCircle, Share2, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SocialShareButtonsProps {
  url: string
  title: string
  description?: string
  hashtags?: string[]
  className?: string
  variant?: 'compact' | 'full'
}

export function SocialShareButtons({
  url,
  title,
  description = '',
  hashtags = ['gymstarter', 'fitness'],
  className,
  variant = 'compact'
}: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== 'undefined' ? window.location.origin + url : 'http://localhost:3000' + url

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(title)}`
    window.open(facebookUrl, '_blank', 'noopener,noreferrer')
  }

  const handleTwitterShare = () => {
    const twitterText = `${title} ${hashtags.map(tag => `#${tag}`).join(' ')}`
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(shareUrl)}`
    window.open(twitterUrl, '_blank', 'noopener,noreferrer')
  }

  const handleWhatsAppShare = () => {
    const whatsappText = `*${title}*\n\n${description}\n\n${shareUrl}\n\n${hashtags.map(tag => `#${tag}`).join(' ')}`
    const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(whatsappText)}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Erro ao copiar link:', err)
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        })
      } catch (err) {
        console.error('Erro ao compartilhar:', err)
      }
    }
  }

  if (variant === 'compact') {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Button
          variant="outline"
          size="sm"
          onClick={handleFacebookShare}
          className="h-8 w-8 p-0"
          title="Compartilhar no Facebook"
        >
          <Facebook className="h-4 w-4 text-blue-600" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleTwitterShare}
          className="h-8 w-8 p-0"
          title="Compartilhar no Twitter"
        >
          <Twitter className="h-4 w-4 text-blue-400" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleWhatsAppShare}
          className="h-8 w-8 p-0"
          title="Compartilhar no WhatsApp"
        >
          <MessageCircle className="h-4 w-4 text-green-600" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="h-8 w-8 p-0"
          title="Copiar link"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>

        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleNativeShare}
            className="h-8 w-8 p-0"
            title="Compartilhar"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className={cn("space-y-3", className)}>
      <h4 className="text-sm font-medium text-gray-900">Compartilhar</h4>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={handleFacebookShare}
          className="flex items-center gap-2"
        >
          <Facebook className="h-4 w-4 text-blue-600" />
          Facebook
        </Button>

        <Button
          variant="outline"
          onClick={handleTwitterShare}
          className="flex items-center gap-2"
        >
          <Twitter className="h-4 w-4 text-blue-400" />
          Twitter
        </Button>

        <Button
          variant="outline"
          onClick={handleWhatsAppShare}
          className="flex items-center gap-2"
        >
          <MessageCircle className="h-4 w-4 text-green-600" />
          WhatsApp
        </Button>

        <Button
          variant="outline"
          onClick={handleCopyLink}
          className="flex items-center gap-2"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-600" />
              Copiado!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copiar Link
            </>
          )}
        </Button>

        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <Button
            variant="outline"
            onClick={handleNativeShare}
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Compartilhar
          </Button>
        )}
      </div>
    </div>
  )
}