import { Calendar } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface EmptyEventsStateProps {
  onNavigateToEvents: () => void
}

export function EmptyEventsState({ onNavigateToEvents }: EmptyEventsStateProps) {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhum evento cadastrado
        </h3>
        <p className="text-gray-500 mb-6">
          Crie um evento para começar a fazer check-ins
        </p>
        <Button onClick={onNavigateToEvents} className="gap-2">
          <Calendar className="w-4 h-4" />
          Gerenciar Eventos
        </Button>
      </CardContent>
    </Card>
  )
}
