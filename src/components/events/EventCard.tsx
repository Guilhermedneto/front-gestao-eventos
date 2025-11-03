import { Calendar, MapPin, User, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Event } from '@/hooks/useEvents'

interface EventCardProps {
  event: Event
  index: number
  onNavigate: (eventId: number) => void
  getEventTypeLabel: (type: string) => string
  getEventTypeBadgeVariant: (type: string) => "default" | "secondary" | "destructive" | "success" | "warning"
  formatDate: (dateString: string) => string
}

export function EventCard({
  event,
  index,
  onNavigate,
  getEventTypeLabel,
  getEventTypeBadgeVariant,
  formatDate
}: EventCardProps) {
  return (
    <Card
      className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer border-l-4 border-l-primary-500 overflow-hidden animate-in fade-in slide-in-from-bottom-4 relative"
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={() => onNavigate(event.id)}
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary-500/10 to-transparent rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>

      <CardHeader className="relative">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl group-hover:text-primary-600 transition-colors line-clamp-2">
            {event.name}
          </CardTitle>
        </div>
        <div className="flex gap-2 mt-2">
          <Badge variant={getEventTypeBadgeVariant(event.type)}>
            {getEventTypeLabel(event.type)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 relative">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4 text-primary-600 flex-shrink-0" />
          <span className="line-clamp-1">
            {formatDate(event.startDate)} - {formatDate(event.endDate)}
          </span>
        </div>

        {event.location && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        )}

        {event.creatorName && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span className="line-clamp-1">{event.creatorName}</span>
          </div>
        )}

        {event.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mt-3 pt-3 border-t border-gray-100">
            {event.description}
          </p>
        )}
      </CardContent>

      <CardFooter className="bg-gradient-to-r from-gray-50 to-transparent border-t border-gray-100">
        <Button
          variant="ghost"
          className="w-full justify-between group/button hover:bg-primary-50"
          onClick={(e) => {
            e.stopPropagation()
            onNavigate(event.id)
          }}
        >
          <span className="text-primary-600 font-medium">Ver Detalhes</span>
          <ArrowRight className="w-4 h-4 text-primary-600 group-hover/button:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  )
}
