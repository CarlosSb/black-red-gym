import { Suspense } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dumbbell } from "lucide-react"
import { RegisterForm } from "./register-form"
import { getServerSettings } from "@/lib/server-data"

export default async function RegisterPage() {
  const settings = await getServerSettings()

  return (
    <div className="min-h-screen bg-black-red flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Dumbbell className="h-8 w-8 text-red-accent" />
            <h1 className="text-2xl font-bold">{settings?.name?.toUpperCase() || "GYM STARTER"}</h1>
          </div>
          <CardTitle className="text-2xl">Criar sua conta</CardTitle>
          <CardDescription>Cadastre-se para acessar o painel da academia</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="text-center py-8">Carregando formulário...</div>}>
            <RegisterForm />
          </Suspense>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-red-accent hover:underline">
                Faça login
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
