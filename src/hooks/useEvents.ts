'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

const PYTHON_API_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:5000'

export interface Event {
  id: number
  name: string
  type: 'feira' | 'evento' | 'congresso' | 'workshop'
  startDate: string
  endDate: string
  location?: string
  description?: string
  creatorName?: string
  creatorEmail?: string
}

export function useEvents() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Filtros e Paginação
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('recent')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      loadEvents()
    }
  }, [user])

  const loadEvents = async () => {
    try {
      setLoadingEvents(true)
      const response = await fetch(`${PYTHON_API_URL}/api/events`)
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      }
    } catch (error) {
      console.error('Erro ao carregar eventos:', error)
    } finally {
      setLoadingEvents(false)
    }
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

  const getEventTypeBadgeVariant = (type: string): "default" | "secondary" | "destructive" | "success" | "warning" => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "success" | "warning"> = {
      feira: 'default',
      evento: 'success',
      congresso: 'secondary',
      workshop: 'warning'
    }
    return variants[type] || 'secondary'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const getEventStatus = (event: Event) => {
    const now = new Date()
    const startDate = new Date(event.startDate)
    const endDate = new Date(event.endDate)

    if (now < startDate) return 'upcoming'
    if (now > endDate) return 'past'
    return 'ongoing'
  }

  // Aplicar filtros
  const filteredEvents = events
    .filter(event => {
      const matchesSearch =
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchTerm.toLowerCase())

      if (!matchesSearch) return false

      if (filterType !== 'all' && event.type !== filterType) return false

      if (filterStatus !== 'all') {
        const status = getEventStatus(event)
        if (filterStatus !== status) return false
      }

      return true
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      }
      if (sortBy === 'oldest') {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name)
      }
      return 0
    })

  // Paginação
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedEvents = filteredEvents.slice(startIndex, endIndex)

  // Reset para página 1 quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filterType, filterStatus, sortBy])

  const navigateToDashboard = () => {
    router.push('/dashboard')
  }

  const navigateToEvent = (eventId: number) => {
    router.push(`/events/${eventId}`)
  }

  const clearFilters = () => {
    setFilterType('all')
    setFilterStatus('all')
    setSortBy('recent')
    setSearchTerm('')
  }

  const hasActiveFilters = filterType !== 'all' || filterStatus !== 'all' || sortBy !== 'recent' || searchTerm !== ''

  return {
    user,
    loading,
    events,
    loadingEvents,
    showCreateModal,
    setShowCreateModal,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    filteredEvents,
    paginatedEvents,
    totalPages,
    startIndex,
    endIndex,
    loadEvents,
    getEventTypeLabel,
    getEventTypeBadgeVariant,
    formatDate,
    getEventStatus,
    navigateToDashboard,
    navigateToEvent,
    clearFilters,
    hasActiveFilters,
  }
}
