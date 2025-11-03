'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Calendar } from 'lucide-react'

const PYTHON_API_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:5000'

interface Event {
  id: number
  name: string
  type: 'feira' | 'evento' | 'congresso' | 'workshop'
  startDate: string
  endDate: string
  location?: string
  description?: string
}

interface EditEventModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  event: Event
}

export default function EditEventModal({ isOpen, onClose, onSuccess, event }: EditEventModalProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    type: 'evento' as 'feira' | 'evento' | 'congresso' | 'workshop',
    startDate: '',
    endDate: '',
    location: '',
    description: ''
  })
  const [loading, setLoading] = useState(false)

  // Preencher formulário quando o evento mudar
  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name,
        type: event.type,
        startDate: event.startDate.split('T')[0],
        endDate: event.endDate.split('T')[0],
        location: event.location || '',
        description: event.description || ''
      })
    }
  }, [event])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validações
    if (!formData.name.trim()) {
      toast({
        title: 'Campo obrigatório',
        description: 'Nome do evento é obrigatório',
        variant: 'destructive',
      })
      return
    }

    if (!formData.startDate || !formData.endDate) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Datas de início e término são obrigatórias',
        variant: 'destructive',
      })
      return
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast({
        title: 'Datas inválidas',
        description: 'Data de início deve ser anterior à data de término',
        variant: 'destructive',
      })
      return
    }

    try {
      setLoading(true)

      const response = await fetch(`${PYTHON_API_URL}/api/events/${event.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          type: formData.type,
          startDate: formData.startDate,
          endDate: formData.endDate,
          location: formData.location || null,
          description: formData.description || null
        })
      })

      if (response.ok) {
        toast({
          title: 'Evento atualizado!',
          description: 'As alterações foram salvas com sucesso.',
        })
        onSuccess()
        onClose()
      } else {
        const errorData = await response.json()
        toast({
          title: 'Erro ao atualizar',
          description: errorData.error || 'Não foi possível atualizar o evento.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Erro ao atualizar evento:', error)
      toast({
        title: 'Erro de conexão',
        description: 'Não foi possível conectar ao servidor.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Calendar className="w-6 h-6 text-primary-600" />
            Editar Evento
          </DialogTitle>
          <DialogDescription>
            Atualize as informações do evento abaixo. Campos com * são obrigatórios.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Evento *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Digite o nome do evento"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo *</Label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading}
            >
              <option value="feira">Feira</option>
              <option value="evento">Evento</option>
              <option value="congresso">Congresso</option>
              <option value="workshop">Workshop</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Data de Início *</Label>
              <Input
                type="date"
                id="startDate"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Data de Término *</Label>
              <Input
                type="date"
                id="endDate"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Localização</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Ex: São Paulo Convention Center"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Descreva o evento..."
              disabled={loading}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
