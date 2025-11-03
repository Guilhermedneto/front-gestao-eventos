import { Calendar, MapPin, User, Edit, Trash2 } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Event } from '@/hooks/useEventDetails'

interface EventInfoCardProps {
  event: Event
  isOwner: boolean
  formatDate: (date: string) => string
  getEventTypeLabel: (type: string) => string
  getEventTypeBadgeVariant: (type: string) => "default" | "secondary" | "destructive" | "success" | "warning" | "outline"
  onEdit: () => void
  onDelete: () => void
}

export function EventInfoCard({ event, isOwner, formatDate, getEventTypeLabel, getEventTypeBadgeVariant, onEdit, onDelete }: EventInfoCardProps) {
  return (
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

          {isOwner && (
            <div className="flex gap-2 flex-shrink-0">
              <Button onClick={onEdit} className="gap-2" size="sm">
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">Editar</span>
              </Button>
              <Button onClick={onDelete} variant="destructive" className="gap-2" size="sm">
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
  )
}
