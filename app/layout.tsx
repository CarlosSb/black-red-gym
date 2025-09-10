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

  return {
    title: `${academyName} - Transforme seu Corpo, Transforme sua Vida`,
    description: `Academia moderna com equipamentos de última geração, personal trainers qualificados e ambiente motivador. Venha fazer parte da família ${academyName}!`,
    generator: "v0.app",
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`} cz-shortcut-listen="true">
        <AuthProvider>
          <Suspense fallback={null}>{children}</Suspense>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
