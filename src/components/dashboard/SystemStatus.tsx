import { CheckCircle2 } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface SystemStatusProps {
  userEmail: string
}

export function SystemStatus({ userEmail }: SystemStatusProps) {
  const statusItems = [
    'Autenticação Firebase ativa',
    'API Python conectada ao SQL Server',
    `Usuário: ${userEmail}`,
    'Banco de dados: event_management'
  ]

  return (
    <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50/50 to-transparent animate-in fade-in slide-in-from-bottom-8 duration-1200">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <CardTitle className="text-lg text-green-900">Sistema Operacional</CardTitle>
            <CardDescription className="mt-2">
              <ul className="space-y-2 mt-2">
                {statusItems.map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-green-700">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}
