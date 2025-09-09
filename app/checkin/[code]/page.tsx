"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export default function CheckinPage() {
  const params = useParams()
  const router = useRouter()
  const code = params.code as string

  const [isValidating, setIsValidating] = useState(true)
  const [isValid, setIsValid] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    phone: ""
  })

  // Validar código QR ao carregar a página
  useEffect(() => {
    const validateCode = async () => {
      try {
        const response = await fetch(`/api/checkin/validate?code=${code}`)
        const data = await response.json()

        if (response.ok && data.valid) {
          setIsValid(true)
        } else {
          setError(data.error || "Código QR inválido ou expirado")
        }
      } catch (err) {
        setError("Erro ao validar código QR")
      } finally {
        setIsValidating(false)
      }
    }

    if (code) {
      validateCode()
    }
  }, [code])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          code
        })
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        // Redirecionar após 3 segundos
        setTimeout(() => {
          router.push("/")
        }, 3000)
      } else {
        setError(data.error || "Erro ao realizar check-in")
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-red-600" />
              <span className="ml-2">Validando código QR...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <CardTitle className="text-red-600">Código Inválido</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => router.push("/")}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <CardTitle className="text-green-600">Check-in Realizado!</CardTitle>
            <CardDescription>
              Bem-vindo à Black Red Gym! Seu check-in foi registrado com sucesso.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 text-center">
              Você será redirecionado em alguns segundos...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-red-600">Check-in</CardTitle>
          <CardDescription>
            Preencha seus dados para registrar sua presença
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Digite seu nome completo"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={formData.phone}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrando...
                </>
              ) : (
                "Confirmar Check-in"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}