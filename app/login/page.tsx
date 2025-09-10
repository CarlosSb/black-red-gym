import { Suspense } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dumbbell } from "lucide-react"
import { LoginForm } from "./login-form"
import { getServerSettings } from "@/lib/server-data"

export default async function LoginPage() {
  const settings = await getServerSettings()

  return (
    <div className="min-h-screen bg-black-red flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Dumbbell className="h-8 w-8 text-red-accent" />
            <h1 className="text-2xl font-bold">{settings?.name?.toUpperCase() || "GYM STARTER"}</h1>
          </div>
          <CardTitle className="text-2xl">Entrar na sua conta</CardTitle>
          <CardDescription>Digite suas credenciais para acessar o painel</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="text-center py-8">Carregando formulário...</div>}>
            <LoginForm />
          </Suspense>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Não tem uma conta?{" "}
              <Link href="/register" className="text-red-accent hover:underline">
                Cadastre-se
              </Link>
            </p>
            <p className="mt-2 text-muted-foreground">
              <Link href="/" className="text-red-accent hover:underline">
                Voltar ao site
              </Link>
            </p>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
