import { Plus, Upload, QrCode, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface QuickActionsProps {
  onNavigateToEvents: () => void
  onNavigateToScanner: () => void
}

export function QuickActions({ onNavigateToEvents, onNavigateToScanner }: QuickActionsProps) {
  const actions = [
    {
      title: 'Gerenciar Eventos',
      description: 'Ver, criar e editar eventos',
      icon: Plus,
      onClick: onNavigateToEvents,
      color: 'primary',
      borderColor: 'hover:border-primary-500',
      bgColor: 'hover:bg-primary-50/50',
      iconBg: 'from-primary-500 to-primary-600',
      textColor: 'text-primary-600',
      bgCircle: 'bg-primary-500/5'
    },
    {
      title: 'Importar Convidados',
      description: 'Acesse um evento para importar convites',
      icon: Upload,
      onClick: onNavigateToEvents,
      color: 'green',
      borderColor: 'hover:border-green-500',
      bgColor: 'hover:bg-green-50/50',
      iconBg: 'from-green-500 to-green-600',
      textColor: 'text-green-600',
      bgCircle: 'bg-green-500/5'
    },
    {
      title: 'Scanner QR Code',
      description: 'Fazer check-in de participantes',
      icon: QrCode,
      onClick: onNavigateToScanner,
      color: 'blue',
      borderColor: 'hover:border-blue-500',
      bgColor: 'hover:bg-blue-50/50',
      iconBg: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-600',
      bgCircle: 'bg-blue-500/5'
    }
  ]

  return (
    <Card className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <CardHeader>
        <CardTitle className="text-xl">Ações Rápidas</CardTitle>
        <CardDescription>
          Acesse as funcionalidades principais do sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon

            return (
              <button
                key={index}
                onClick={action.onClick}
                className={`group relative overflow-hidden p-6 border-2 border-dashed border-gray-300 rounded-xl ${action.borderColor} ${action.bgColor} transition-all duration-300 text-left`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 ${action.bgCircle} rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}></div>
                <div className="relative">
                  <div className={`w-12 h-12 bg-gradient-to-br ${action.iconBg} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-semibold text-gray-900 text-lg mb-1">{action.title}</p>
                  <p className="text-sm text-gray-500 mb-3">{action.description}</p>
                  <div className={`flex items-center ${action.textColor} text-sm font-medium`}>
                    Acessar
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
