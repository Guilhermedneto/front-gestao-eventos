'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'

const PYTHON_API_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:5000'

export interface Event {
  id: number
  name: string
  type: 'feira' | 'evento' | 'congresso' | 'workshop'
  startDate: string
  endDate: string
  location?: string
  description?: string
  createdBy: number
  creatorName?: string
  creatorEmail?: string
}

export function useEventDetails() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const eventId = params?.id
  const { toast } = useToast()

  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showAddInviteModal, setShowAddInviteModal] = useState(false)
  const [showImportExcelModal, setShowImportExcelModal] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [selectedInvite, setSelectedInvite] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'info' | 'invites'>('info')
  const [invites, setInvites] = useState<any[]>([])
  const [loadingInvites, setLoadingInvites] = useState(false)
  const [sendingEmail, setSendingEmail] = useState<number | null>(null)
  const [sendingBulk, setSendingBulk] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (eventId) {
      loadEvent()
      loadInvites()
    }
  }, [eventId])

  const loadInvites = async () => {
    try {
      setLoadingInvites(true)
      const response = await fetch(`${PYTHON_API_URL}/api/events/${eventId}/invites`)
      if (response.ok) {
        const data = await response.json()
        setInvites(data)
      }
    } catch (error) {
      console.error('Erro ao carregar convites:', error)
    } finally {
      setLoadingInvites(false)
    }
  }

  const loadEvent = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${PYTHON_API_URL}/api/events/${eventId}`)
      if (response.ok) {
        const data = await response.json()
        setEvent(data)
      } else {
        console.error('Evento não encontrado')
        router.push('/events')
      }
    } catch (error) {
      console.error('Erro ao carregar evento:', error)
      router.push('/events')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`${PYTHON_API_URL}/api/events/${eventId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'Evento deletado',
          description: 'O evento foi deletado com sucesso.',
        })
        router.push('/events')
      } else {
        const errorData = await response.json()
        toast({
          title: 'Erro ao deletar evento',
          description: errorData.error || 'Ocorreu um erro ao deletar o evento.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Erro ao deletar evento:', error)
      toast({
        title: 'Erro de conexão',
        description: 'Não foi possível conectar ao servidor.',
        variant: 'destructive',
      })
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

  const getEventTypeBadgeVariant = (type: string): "default" | "secondary" | "destructive" | "success" | "warning" | "outline" => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "success" | "warning" | "outline"> = {
      feira: 'default',
      evento: 'success',
      congresso: 'secondary',
      workshop: 'warning'
    }
    return variants[type] || 'outline'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  const handleSendEmail = async (inviteId: number) => {
    try {
      setSendingEmail(inviteId)
      const response = await fetch(`${PYTHON_API_URL}/api/invites/${inviteId}/send-email`, {
        method: 'POST',
      })

      if (response.ok) {
        toast({
          title: 'Email enviado',
          description: 'O convite foi enviado com sucesso.',
        })
        await loadInvites()
      } else {
        const errorData = await response.json()
        toast({
          title: 'Erro ao enviar email',
          description: errorData.error || 'Não foi possível enviar o email.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Erro ao enviar email:', error)
      toast({
        title: 'Erro de conexão',
        description: 'Não foi possível conectar ao servidor.',
        variant: 'destructive',
      })
    } finally {
      setSendingEmail(null)
    }
  }

  const handleSendAllEmails = async () => {
    const pendingInvites = invites.filter(invite => !invite.emailSent)

    if (pendingInvites.length === 0) {
      toast({
        title: 'Nenhum convite pendente',
        description: 'Todos os convites já foram enviados.',
        variant: 'default',
      })
      return
    }

    if (!confirm(`Deseja enviar ${pendingInvites.length} email(s) pendente(s)?`)) {
      return
    }

    try {
      setSendingBulk(true)
      const response = await fetch(`${PYTHON_API_URL}/api/events/${eventId}/invites/send-all`, {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: 'Emails enviados!',
          description: `Total: ${data.total} | Sucesso: ${data.success} | Erros: ${data.errors}`,
        })
        await loadInvites()
      } else {
        const errorData = await response.json()
        toast({
          title: 'Erro ao enviar emails',
          description: errorData.error || 'Não foi possível enviar os emails.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Erro ao enviar emails:', error)
      toast({
        title: 'Erro de conexão',
        description: 'Não foi possível conectar ao servidor.',
        variant: 'destructive',
      })
    } finally {
      setSendingBulk(false)
    }
  }

  const isOwner = user && event ? user.id === event.createdBy : false
  const totalInvites = invites.length
  const sentInvites = invites.filter(inv => inv.emailSent).length
  const checkedIn = invites.filter(inv => inv.checkedIn).length
  const checkInRate = totalInvites > 0 ? Math.round((checkedIn / totalInvites) * 100) : 0

  const navigateToEvents = () => {
    router.push('/events')
  }

  const navigateToCheckin = () => {
    router.push(`/events/${eventId}/checkin`)
  }

  return {
    user,
    authLoading,
    event,
    loading,
    eventId,
    showEditModal,
    setShowEditModal,
    showDeleteConfirm,
    setShowDeleteConfirm,
    showAddInviteModal,
    setShowAddInviteModal,
    showImportExcelModal,
    setShowImportExcelModal,
    showQRModal,
    setShowQRModal,
    selectedInvite,
    setSelectedInvite,
    activeTab,
    setActiveTab,
    invites,
    loadingInvites,
    sendingEmail,
    sendingBulk,
    isOwner,
    totalInvites,
    sentInvites,
    checkedIn,
    checkInRate,
    loadEvent,
    loadInvites,
    handleDelete,
    getEventTypeLabel,
    getEventTypeBadgeVariant,
    formatDate,
    handleSendEmail,
    handleSendAllEmails,
    navigateToEvents,
    navigateToCheckin,
  }
}
