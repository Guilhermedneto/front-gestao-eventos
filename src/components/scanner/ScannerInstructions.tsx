import { Users } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export function ScannerInstructions() {
  const instructions = [
    'Selecione o evento clicando no card acima',
    'Permita acesso à câmera quando solicitado',
    'Aponte a câmera para o QR code do convite do convidado',
    'O check-in será registrado automaticamente'
  ]

  return (
    <Card className="mt-8 border-l-4 border-l-blue-500 bg-blue-50/50">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-lg text-blue-900">Como funciona o check-in?</CardTitle>
            <CardDescription className="mt-2">
              <ul className="space-y-2 mt-2 text-sm text-blue-700">
                {instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">{index + 1}.</span>
                    <span>{instruction}</span>
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
