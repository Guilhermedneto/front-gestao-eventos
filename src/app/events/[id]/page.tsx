'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import EditEventModal from '@/components/EditEventModal'
import AddInviteModal from '@/components/AddInviteModal'
import ImportExcelModal from '@/components/ImportExcelModal'
import ViewQRCodeModal from '@/components/ViewQRCodeModal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Edit,
  Trash2,
  Mail,
  QrCode,
  Upload,
  Plus,
  Users,
  CheckCircle,
  BarChart3,
  AlertTriangle,
  Loader2,
  Send,
  Camera
} from 'lucide-react'

const PYTHON_API_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:5000'

interface Event {
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

export default function EventDetailsPage() {
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Carregando evento...</p>
        </div>
      </div>
    )
  }

  if (!user || !event) {
    return null
  }

  const isOwner = user.id === event.createdBy
  const totalInvites = invites.length
  const sentInvites = invites.filter(inv => inv.emailSent).length
  const checkedIn = invites.filter(inv => inv.checkedIn).length
  const checkInRate = totalInvites > 0 ? Math.round((checkedIn / totalInvites) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header com Glassmorphism */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/events')}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  Detalhes do Evento
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Gerenciamento completo e estatísticas
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 overflow-x-hidden">
        {/* Event Header Card com Gradiente */}
        <Card className="border-l-4 border-l-primary-500 hover:shadow-xl transition-all duration-300 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-500/10 to-transparent rounded-full -mr-32 -mt-32 pointer-events-none"></div>

          <CardHeader className="relative">
            <div className="flex flex-col lg:flex-row items-start justify-between mb-4 gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <CardTitle className="text-2xl sm:text-3xl break-words">{event.name}</CardTitle>
                  <Badge variant={getEventTypeBadgeVariant(event.type)} className="text-sm px-3 py-1 flex-shrink-0">
                    {getEventTypeLabel(event.type)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-full">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900">Data de Início</p>
                      <p className="text-sm text-gray-600 break-words">{formatDate(event.startDate)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900">Data de Término</p>
                      <p className="text-sm text-gray-600 break-words">{formatDate(event.endDate)}</p>
                    </div>
                  </div>

                  {event.location && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900">Local</p>
                        <p className="text-sm text-gray-600 break-words">{event.location}</p>
                      </div>
                    </div>
                  )}

                  {event.creatorName && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900">Criado por</p>
                        <p className="text-sm text-gray-600 break-words">{event.creatorName}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              {isOwner && (
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    onClick={() => setShowEditModal(true)}
                    className="gap-2"
                    size="sm"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="hidden sm:inline">Editar</span>
                  </Button>
                  <Button
                    onClick={() => setShowDeleteConfirm(true)}
                    variant="destructive"
                    className="gap-2"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Deletar</span>
                  </Button>
                </div>
              )}
            </div>

            {event.description && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Descrição</h3>
                <p className="text-gray-600 whitespace-pre-line">{event.description}</p>
              </div>
            )}
          </CardHeader>
        </Card>

        {/* Stats Cards com Animações */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Convites</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalInvites}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Enviados</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{sentInvites}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Check-ins</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{checkedIn}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taxa Check-in</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{checkInRate}%</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs com Design Moderno */}
        <Card>
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('info')}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-all duration-200 ${
                  activeTab === 'info'
                    ? 'border-primary-600 text-primary-600 bg-primary-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                📋 Informações
              </button>
              <button
                onClick={() => setActiveTab('invites')}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-all duration-200 flex items-center gap-2 ${
                  activeTab === 'invites'
                    ? 'border-primary-600 text-primary-600 bg-primary-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Mail className="w-4 h-4" />
                Convites
                <Badge variant="secondary" className="ml-1">{invites.length}</Badge>
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'info' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sobre o Evento</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Descrição</p>
                    <p className="text-gray-600">
                      {event.description || 'Nenhuma descrição disponível'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Período</p>
                    <p className="text-gray-600">
                      {formatDate(event.startDate)} até {formatDate(event.endDate)}
                    </p>
                  </div>
                  {event.location && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Local</p>
                      <p className="text-gray-600">{event.location}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'invites' && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Gerenciar Convites
                  </h3>
                  {isOwner && (
                    <div className="flex gap-2 flex-wrap w-full sm:w-auto">
                      <Button
                        onClick={handleSendAllEmails}
                        disabled={sendingBulk || invites.filter(inv => !inv.emailSent).length === 0}
                        variant="default"
                        className="gap-2 bg-blue-600 hover:bg-blue-700"
                      >
                        {sendingBulk ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Enviar Pendentes
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => setShowImportExcelModal(true)}
                        variant="default"
                        className="gap-2 bg-green-600 hover:bg-green-700"
                      >
                        <Upload className="w-4 h-4" />
                        Importar Excel
                      </Button>
                      <Button
                        onClick={() => setShowAddInviteModal(true)}
                        className="gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Adicionar
                      </Button>
                    </div>
                  )}
                </div>

                {loadingInvites ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-10 h-10 text-primary-600 animate-spin mb-4" />
                    <p className="text-gray-600 font-medium">Carregando convites...</p>
                  </div>
                ) : invites.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhum convite cadastrado
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Adicione convites manualmente ou importe uma planilha Excel
                    </p>
                    {isOwner && (
                      <div className="flex gap-3 justify-center">
                        <Button
                          onClick={() => router.push(`/events/${eventId}/checkin`)}
                          className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        >
                          <Camera className="w-4 h-4" />
                          Check-in QR Code
                        </Button>
                        <Button onClick={() => setShowAddInviteModal(true)} className="gap-2">
                          <Plus className="w-4 h-4" />
                          Adicionar Convite
                        </Button>
                        <Button onClick={() => setShowImportExcelModal(true)} variant="outline" className="gap-2">
                          <Upload className="w-4 h-4" />
                          Importar Excel
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-lg border border-gray-200 -mx-4 sm:mx-0">
                    <table className="w-full min-w-[800px]">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Nome</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Email</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">QR Code</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Email Status</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Check-in</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {invites.map((invite, index) => (
                          <tr
                            key={invite.id}
                            className="hover:bg-blue-50/50 transition-colors duration-150"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <td className="px-4 py-4 text-sm font-medium text-gray-900">{invite.guestName}</td>
                            <td className="px-4 py-4 text-sm text-gray-600">{invite.guestEmail}</td>
                            <td className="px-4 py-4 text-sm">
                              <code className="px-2 py-1 bg-gray-100 rounded text-xs font-mono border border-gray-200">
                                {invite.qrCode}
                              </code>
                            </td>
                            <td className="px-4 py-4 text-sm">
                              {invite.emailSent ? (
                                <Badge variant="success" className="gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  Enviado
                                </Badge>
                              ) : (
                                <Badge variant="warning" className="gap-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  Pendente
                                </Badge>
                              )}
                            </td>
                            <td className="px-4 py-4 text-sm">
                              {invite.checkedIn ? (
                                <Badge variant="success" className="gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  Presente
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="gap-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  Ausente
                                </Badge>
                              )}
                            </td>
                            <td className="px-4 py-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Button
                                  onClick={() => {
                                    setSelectedInvite(invite)
                                    setShowQRModal(true)
                                  }}
                                  variant="ghost"
                                  size="sm"
                                  className="gap-1"
                                >
                                  <QrCode className="w-4 h-4" />
                                  Ver QR
                                </Button>
                                {!invite.emailSent && (
                                  <Button
                                    onClick={() => handleSendEmail(invite.id)}
                                    disabled={sendingEmail === invite.id}
                                    variant="ghost"
                                    size="sm"
                                    className="gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  >
                                    {sendingEmail === invite.id ? (
                                      <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Enviando...
                                      </>
                                    ) : (
                                      <>
                                        <Send className="w-4 h-4" />
                                        Enviar
                                      </>
                                    )}
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </main>

      {/* Delete Confirmation Modal com Animação */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <Card className="max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">Deletar Evento?</CardTitle>
                  <p className="text-sm text-gray-600 font-normal">
                    Tem certeza que deseja deletar o evento <strong className="text-gray-900">{event.name}</strong>?
                    Esta ação não pode ser desfeita e todos os convites e check-ins serão removidos.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex gap-3 pt-2">
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleDelete}
                variant="destructive"
                className="flex-1"
              >
                Sim, Deletar
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Event Modal */}
      <EditEventModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={loadEvent}
        event={event}
      />

      {/* Add Invite Modal */}
      <AddInviteModal
        isOpen={showAddInviteModal}
        onClose={() => setShowAddInviteModal(false)}
        onSuccess={loadInvites}
        eventId={Number(eventId)}
      />

      {/* Import Excel Modal */}
      <ImportExcelModal
        isOpen={showImportExcelModal}
        onClose={() => setShowImportExcelModal(false)}
        onSuccess={loadInvites}
        eventId={Number(eventId)}
      />

      {/* View QR Code Modal */}
      <ViewQRCodeModal
        isOpen={showQRModal}
        onClose={() => {
          setShowQRModal(false)
          setSelectedInvite(null)
        }}
        invite={selectedInvite}
        eventName={event?.name || ''}
      />
    </div>
  )
}
