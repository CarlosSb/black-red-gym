import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Dumbbell, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black-red flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <Dumbbell className="h-16 w-16 text-red-accent" />
        </div>

        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-4">Página não encontrada</h2>

        <p className="text-muted-foreground mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>

        <div className="flex justify-center">
          <Link href="/">
            <Button className="bg-red-accent hover:bg-red-accent/90">
              <Home className="mr-2 h-4 w-4" />
              Voltar ao Início
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}