import { Calendar, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface DashboardHeaderProps {
  userName?: string
  userEmail: string
  userPhotoUrl?: string
  onSignOut: () => void
}

export function DashboardHeader({ userName, userEmail, userPhotoUrl, onSignOut }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Event Management
              </h1>
              <p className="text-xs text-gray-500">
                Sistema de Gestão de Eventos
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">
                {userName || userEmail}
              </p>
              <Badge variant="secondary" className="text-xs mt-1">
                Administrador
              </Badge>
            </div>
            {userPhotoUrl && (
              <div className="relative">
                <img
                  src={userPhotoUrl}
                  alt={userName || 'User'}
                  className="w-10 h-10 rounded-full ring-2 ring-primary-100"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white"></div>
              </div>
            )}
            <Button
              onClick={onSignOut}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
