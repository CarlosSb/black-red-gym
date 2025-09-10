import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Gera um código único para anúncios e promoções
 * @param prefix - Prefixo do código (ex: 'GS', 'PROMO')
 * @returns Código único formatado
 */
export function generateUniqueCode(prefix: string = 'GS'): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substr(2, 5).toUpperCase()
  return `${prefix}${timestamp}${random}`
}

/**
 * Detecta se o dispositivo é móvel
 * @returns true se for dispositivo móvel
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

/**
 * Gera URL do WhatsApp com mensagem pré-preenchida
 * @param phone - Número do WhatsApp (com código do país)
 * @param message - Mensagem a ser enviada
 * @returns URL do WhatsApp
 */
export function generateWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, '')
  const encodedMessage = encodeURIComponent(message)

  if (isMobile()) {
    // Deep link para mobile
    return `whatsapp://send?phone=${cleanPhone}&text=${encodedMessage}`
  } else {
    // Fallback para web
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
  }
}

/**
 * Gera mensagem pré-preenchida para promoções
 * @param promotion - Dados da promoção
 * @returns Mensagem formatada
 */
export function generatePromotionMessage(promotion: {
  title: string
  description: string
  validUntil: string
  uniqueCode?: string
}): string {
  const validUntil = new Date(promotion.validUntil).toLocaleDateString('pt-BR')

  return `*PROMOÇÃO ESPECIAL - GymStarter*

🏋️‍♂️ *${promotion.title}*
📝 ${promotion.description}
📅 Válido até: ${validUntil}
${promotion.uniqueCode ? `🔢 Código único: ${promotion.uniqueCode}` : ''}

Gostaria de aproveitar esta promoção! 🚀`
}

/**
 * Gera mensagem pré-preenchida para anúncios
 * @param ad - Dados do anúncio
 * @returns Mensagem formatada
 */
export function generateAdMessage(ad: {
  title: string
  description?: string
  validUntil: string
  uniqueCode?: string
}): string {
  const validUntil = new Date(ad.validUntil).toLocaleDateString('pt-BR')
  const description = ad.description || 'Confira este anúncio especial!'

  return `*ANÚNCIO ESPECIAL - GymStarter*

📢 *${ad.title}*
📝 ${description}
📅 Válido até: ${validUntil}
${ad.uniqueCode ? `🔢 Código único: ${ad.uniqueCode}` : ''}

Tenho interesse neste anúncio! 📱`
}

/**
 * Compartilha conteúdo usando a Web Share API (se disponível)
 * @param data - Dados para compartilhar
 */
export async function shareContent(data: {
  title: string
  text: string
  url: string
}): Promise<boolean> {
  if (typeof navigator === 'undefined' || !('share' in navigator)) {
    return false
  }

  try {
    await navigator.share(data)
    return true
  } catch (error) {
    console.error('Erro ao compartilhar:', error)
    return false
  }
}

/**
 * Copia texto para a área de transferência
 * @param text - Texto a ser copiado
 * @returns Promise que resolve quando copiado
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    return false
  }

  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Erro ao copiar:', error)
    return false
  }
}

/**
 * Formata data para português brasileiro
 * @param dateString - String da data
 * @param options - Opções de formatação
 * @returns Data formatada
 */
export function formatDateBR(
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }
): string {
  return new Date(dateString).toLocaleDateString('pt-BR', options)
}

/**
 * Trunca texto com reticências
 * @param text - Texto a ser truncado
 * @param maxLength - Comprimento máximo
 * @returns Texto truncado
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

/**
 * Gera slug a partir de texto
 * @param text - Texto para gerar slug
 * @returns Slug formatado
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}
