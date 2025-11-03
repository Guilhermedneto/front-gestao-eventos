import { Calendar, MapPin, QrCode } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Event {
  id: number
  name: string
  type: string
  startDate: string
  endDate: string
  location?: string
  description?: string
}

interface EventsListProps {
  events: Event[]
  formatDate: (date: string) => string
  getEventTypeLabel: (type: string) => string
  getEventTypeBadgeVariant: (type: string) => "default" | "secondary" | "destructive" | "success" | "warning" | "outline"
  onSelectEvent: (eventId: number) => void
}

export function EventsList({ events, formatDate, getEventTypeLabel, getEventTypeBadgeVariant, onSelectEvent }: EventsListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Card
          key={event.id}
          className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group border-l-4 border-l-primary-500"
          onClick={() => onSelectEvent(event.id)}
        >
          <CardHeader>
            <div className="flex items-start justify-between mb-2">
              <Badge variant={getEventTypeBadgeVariant(event.type)} className="text-xs">
                {getEventTypeLabel(event.type)}
              </Badge>
              <QrCode className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
            </div>
            <CardTitle className="text-xl group-hover:text-primary-600 transition-colors">
              {event.name}
            </CardTitle>
            <CardDescription className="space-y-2 mt-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{formatDate(event.startDate)} - {formatDate(event.endDate)}</span>
              </div>
              {event.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{event.location}</span>
                </div>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full gap-2 group-hover:bg-primary-700 transition-colors">
              <QrCode className="w-4 h-4" />
              Fazer Check-in
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
