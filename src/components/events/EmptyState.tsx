import { Calendar, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  searchTerm: string
  onCreateEvent: () => void
}

export function EmptyState({ searchTerm, onCreateEvent }: EmptyStateProps) {
  return (
    <Card className="border-dashed border-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-indigo-100 rounded-full flex items-center justify-center mb-6">
          <Calendar className="w-10 h-10 text-primary-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {searchTerm ? 'Nenhum evento encontrado' : 'Nenhum evento cadastrado'}
        </h3>
        <p className="text-gray-500 mb-6 text-center max-w-md">
          {searchTerm
            ? 'Tente ajustar sua busca ou filtros'
            : 'Comece criando seu primeiro evento ou feira'}
        </p>
        {!searchTerm && (
          <Button
            onClick={onCreateEvent}
            size="lg"
            className="gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Criar Primeiro Evento
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
