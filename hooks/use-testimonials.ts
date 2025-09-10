import { useState, useEffect } from 'react'

interface Testimonial {
  id: string
  name: string
  content: string
  rating: number
  category: string
  isActive: boolean
  createdAt: string
}

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/testimonials?active=true&limit=10')

        if (!response.ok) {
          throw new Error('Falha ao carregar depoimentos')
        }

        const data = await response.json()

        if (data.success && data.testimonials) {
          setTestimonials(data.testimonials)
        } else {
          // Fallback para depoimentos padrão se a API não retornar dados
          setTestimonials([
            {
              id: "testimonial-1",
              name: "João Silva",
              content: "A Gym Starter transformou completamente minha rotina de treinos! Os equipamentos são de primeira linha e os profissionais são extremamente preparados. Em 8 meses consegui perder 18kg e ganhar massa muscular. Recomendo para todos que querem resultados reais!",
              rating: 5,
              category: "Perda de Peso",
              isActive: true,
              createdAt: "2024-01-15T10:00:00Z"
            },
            {
              id: "testimonial-2",
              name: "Maria Santos",
              content: "Excelente academia! Os equipamentos são modernos e sempre bem cuidados. As aulas em grupo são muito divertidas e os resultados são visíveis rapidamente.",
              rating: 5,
              category: "Condicionamento",
              isActive: true,
              createdAt: "2024-02-20T14:30:00Z"
            },
            {
              id: "testimonial-3",
              name: "Pedro Costa",
              content: "Melhor investimento que fiz! A equipe é muito preparada e sempre disposta a ajudar. Recomendo para todos que querem mudar de vida através do fitness.",
              rating: 5,
              category: "Ganho de Massa",
              isActive: true,
              createdAt: "2024-03-10T09:15:00Z"
            },
            {
              id: "testimonial-4",
              name: "Ana Oliveira",
              content: "Ambiente incrível e professores muito dedicados! As aulas de dança são sensacionais e me ajudam a manter a forma de forma divertida. Já indiquei para várias amigas!",
              rating: 5,
              category: "Dança e Fitness",
              isActive: true,
              createdAt: "2024-04-05T11:45:00Z"
            },
            {
              id: "testimonial-5",
              name: "Carlos Mendes",
              content: "A Gym Starter superou todas as minhas expectativas! Em apenas 3 meses consegui definir o abdômen e ganhar força. O acompanhamento personalizado faz toda a diferença.",
              rating: 5,
              category: "Definição Muscular",
              isActive: true,
              createdAt: "2024-05-12T16:20:00Z"
            }
          ])
        }
      } catch (err) {
        console.error('Erro ao carregar depoimentos:', err)
        setError(err instanceof Error ? err.message : 'Erro desconhecido')

        // Mesmo com erro, usar depoimentos padrão
        setTestimonials([
          {
            id: "testimonial-1",
            name: "João Silva",
            content: "A Gym Starter transformou completamente minha rotina de treinos! Os equipamentos são de primeira linha e os profissionais são extremamente preparados. Em 8 meses consegui perder 18kg e ganhar massa muscular. Recomendo para todos que querem resultados reais!",
            rating: 5,
            category: "Perda de Peso",
            isActive: true,
            createdAt: "2024-01-15T10:00:00Z"
          },
          {
            id: "testimonial-2",
            name: "Maria Santos",
            content: "Excelente academia! Os equipamentos são modernos e sempre bem cuidados. As aulas em grupo são muito divertidas e os resultados são visíveis rapidamente.",
            rating: 5,
            category: "Condicionamento",
            isActive: true,
            createdAt: "2024-02-20T14:30:00Z"
          },
          {
            id: "testimonial-3",
            name: "Pedro Costa",
            content: "Melhor investimento que fiz! A equipe é muito preparada e sempre disposta a ajudar. Recomendo para todos que querem mudar de vida através do fitness.",
            rating: 5,
            category: "Ganho de Massa",
            isActive: true,
            createdAt: "2024-03-10T09:15:00Z"
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  return { testimonials, loading, error }
}