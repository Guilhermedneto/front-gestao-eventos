import { CheckCircle, XCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface CheckinResultProps {
  success: boolean
  guestName?: string
  alreadyCheckedIn?: boolean
  error?: string
}

export function CheckinResult({ success, guestName, alreadyCheckedIn, error }: CheckinResultProps) {
  return (
    <Card
      className={`border-2 ${
        success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
      } animate-in slide-in-from-bottom`}
    >
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          {success ? (
            <>
              <CheckCircle className="w-12 h-12 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-green-900">
                  Check-in realizado com sucesso!
                </h3>
                <p className="text-green-700">
                  Bem-vindo(a), <strong>{guestName}</strong>
                </p>
              </div>
            </>
          ) : (
            <>
              <XCircle className="w-12 h-12 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-red-900">
                  {alreadyCheckedIn ? 'Já registrado' : 'Erro no check-in'}
                </h3>
                <p className="text-red-700">
                  {alreadyCheckedIn
                    ? `${guestName} já fez check-in anteriormente`
                    : error || 'QR Code inválido'}
                </p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
