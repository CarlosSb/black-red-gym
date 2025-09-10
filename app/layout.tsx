import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AuthProvider } from "@/contexts/auth-context"
import { getServerSettings } from "@/lib/server-data"
import "./globals.css"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getServerSettings()
  const academyName = settings.name || "Gym Starter"
  const description = settings.description || `Academia moderna com equipamentos de última geração, personal trainers qualificados e ambiente motivador. Venha fazer parte da família ${academyName}!`
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  // Criar favicon SVG dinâmico baseado nas cores da academia
  const primaryColor = settings.colors?.primary || '#DC2626'
  const faviconSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
      <rect width="32" height="32" rx="6" fill="${primaryColor}"/>
      <path d="M8 12 L16 6 L24 12 L24 22 L16 28 L8 22 Z" fill="white"/>
      <circle cx="16" cy="16" r="4" fill="${primaryColor}"/>
    </svg>
  `.trim()

  return {
    title: {
      default: `${academyName} - Transforme seu Corpo, Transforme sua Vida`,
      template: `%s | ${academyName}`
    },
    description,
    keywords: [
      academyName,
      'academia',
      'musculação',
      'fitness',
      'personal trainer',
      'treino',
      'saúde',
      'bem-estar',
      'transformação corporal',
      'academia moderna',
      'equipamentos fitness'
    ],
    authors: [
      {
        name: "Antônio Carlos Martins Gomes",
        url: "https://github.com/CarlosSb"
      },
      { name: academyName }
    ],
    creator: "Antônio Carlos Martins Gomes",
    publisher: academyName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: `${academyName} - Transforme seu Corpo, Transforme sua Vida`,
      description,
      url: baseUrl,
      siteName: academyName,
      images: [
        {
          url: settings.heroImage || `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: `Academia ${academyName} - Transforme seu corpo`,
        },
      ],
      locale: 'pt_BR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${academyName} - Transforme seu Corpo, Transforme sua Vida`,
      description,
      images: [settings.heroImage || `${baseUrl}/og-image.jpg`],
      creator: '@gymstarter',
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: `data:image/svg+xml,${encodeURIComponent(faviconSvg)}`,
      shortcut: `data:image/svg+xml,${encodeURIComponent(faviconSvg)}`,
      apple: `data:image/svg+xml,${encodeURIComponent(faviconSvg)}`,
    },
    manifest: '/manifest.json',
    generator: "Next.js",
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Buscar configurações para o schema markup
  const settings = await getServerSettings()
  const academyName = settings.name || "Gym Starter"
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  // Schema markup JSON-LD para SEO
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SportsActivityLocation",
        "name": academyName,
        "description": settings.description || `Academia moderna com equipamentos de última geração, personal trainers qualificados e ambiente motivador.`,
        "url": baseUrl,
        "telephone": settings.phone || "(85) 99999-9999",
        "email": settings.email || "contato@gymstarter.com.br",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": settings.address || "Av. Santos Dumont, 1515",
          "addressLocality": "São Benedito",
          "addressRegion": "CE",
          "postalCode": "60150-161",
          "addressCountry": "BR"
        },
        "openingHours": [
          `Mo-Fr ${settings.hours?.weekdays?.open || '05:00'}-${settings.hours?.weekdays?.close || '23:00'}`,
          `Sa ${settings.hours?.saturday?.open || '07:00'}-${settings.hours?.saturday?.close || '20:00'}`,
          `Su ${settings.hours?.sunday?.open || '08:00'}-${settings.hours?.sunday?.close || '18:00'}`
        ],
        "priceRange": "R$",
        "image": settings.heroImage || `${baseUrl}/og-image.jpg`,
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "150"
        },
        "sameAs": [
          "https://www.instagram.com/gymstarter",
          "https://www.facebook.com/gymstarter"
        ]
      },
      {
        "@type": "Person",
        "name": "Antônio Carlos Martins Gomes",
        "alternateName": "CarlosSb",
        "url": "https://github.com/CarlosSb",
        "sameAs": [
          "https://github.com/CarlosSb",
          "https://www.linkedin.com/in/antonio-carlos-martins/"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+5588992017400",
          "email": "antoniocarlossbcdd@gmail.com",
          "contactType": "Developer"
        },
        "jobTitle": "Desenvolvedor Full Stack",
        "knowsAbout": [
          "Next.js",
          "React",
          "TypeScript",
          "Node.js",
          "SEO",
          "Performance Web"
        ]
      },
      {
        "@type": "WebSite",
        "name": academyName,
        "url": baseUrl,
        "description": settings.description || `Academia moderna com equipamentos de última geração, personal trainers qualificados e ambiente motivador.`,
        "author": {
          "@type": "Person",
          "name": "Antônio Carlos Martins Gomes",
          "url": "https://github.com/CarlosSb"
        },
        "publisher": {
          "@type": "Organization",
          "name": academyName
        }
      }
    ]
  }

  return (
    <html lang="pt-BR">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaMarkup),
          }}
        />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`} cz-shortcut-listen="true">
        <AuthProvider>
          <Suspense fallback={null}>{children}</Suspense>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
