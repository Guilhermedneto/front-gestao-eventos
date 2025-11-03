import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ScannerHeaderProps {
  onNavigateBack: () => void
}

export function ScannerHeader({ onNavigateBack }: ScannerHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={onNavigateBack}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Scanner de QR Code
            </h1>
            <p className="text-sm text-gray-600">Selecione um evento para fazer check-in</p>
          </div>
        </div>
      </div>
    </div>
  )
}
