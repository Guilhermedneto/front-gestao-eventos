import { Calendar, Sparkles, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Event } from '@/hooks/useEvents'

interface EventsQuickStatsProps {
  events: Event[]
}

export function EventsQuickStats({ events }: EventsQuickStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total de Eventos</p>
              <p className="text-2xl font-bold text-gray-900">{events.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-green-500">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tipos Diferentes</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(events.map(e => e.type)).size}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-purple-500">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Localizações</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.filter(e => e.location).length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
