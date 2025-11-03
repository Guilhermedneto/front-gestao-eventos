'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'

const PYTHON_API_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:5000'

interface Event {
  id: number
  name: string
  type: string
  startDate: string
  endDate: string
  location?: string
  description?: string
}

export function useScanner() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      loadEvents()
    }
  }, [user])

  const loadEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${PYTHON_API_URL}/api/events`)
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      } else {
        toast({
          title: 'Erro ao carregar eventos',
          description: 'Não foi possível carregar a lista de eventos.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Erro ao carregar eventos:', error)
      toast({
        title: 'Erro de conexão',
        description: 'Não foi possível conectar ao servidor.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const getEventTypeBadgeVariant = (type: string): "default" | "secondary" | "destructive" | "success" | "warning" | "outline" => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "success" | "warning" | "outline"> = {
      feira: 'default',
      evento: 'success',
      congresso: 'secondary',
      workshop: 'warning'
    }
    return variants[type] || 'outline'
  }

  const getEventTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      feira: 'Feira',
      evento: 'Evento',
      congresso: 'Congresso',
      workshop: 'Workshop'
    }
    return types[type] || type
  }

  const navigateToDashboard = () => {
    router.push('/dashboard')
  }

  const navigateToEvents = () => {
    router.push('/events')
  }

  const navigateToCheckin = (eventId: number) => {
    router.push(`/events/${eventId}/checkin`)
  }

  return {
    user,
    authLoading,
    events,
    loading,
    formatDate,
    getEventTypeBadgeVariant,
    getEventTypeLabel,
    navigateToDashboard,
    navigateToEvents,
    navigateToCheckin,
  }
}
