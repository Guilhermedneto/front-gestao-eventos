import { ArrowLeft, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EventsHeaderProps {
  onNavigateToDashboard: () => void
  onCreateEvent: () => void
}

export function EventsHeader({ onNavigateToDashboard, onCreateEvent }: EventsHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={onNavigateToDashboard}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Eventos
              </h1>
              <p className="text-xs text-gray-500">
                Gerencie seus eventos e feiras
              </p>
            </div>
          </div>
          <Button
            onClick={onCreateEvent}
            className="gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            Novo Evento
          </Button>
        </div>
      </div>
    </header>
  )
}
