import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EventDetailsHeaderProps {
  onNavigateBack: () => void
}

export function EventDetailsHeader({ onNavigateBack }: EventDetailsHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onNavigateBack}
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
  )
}
