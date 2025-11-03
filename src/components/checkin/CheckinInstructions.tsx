import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function CheckinInstructions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Instruções</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-primary-600 font-bold">1.</span>
            <span>Clique em "Iniciar Scanner" para ativar a câmera</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 font-bold">2.</span>
            <span>Aponte a câmera para o QR Code do convite do convidado</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 font-bold">3.</span>
            <span>O sistema usa OpenCV + Python para detectar QR codes automaticamente</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 font-bold">4.</span>
            <span>O check-in é processado instantaneamente ao detectar o código</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600 font-bold">5.</span>
            <span>Você pode escanear múltiplos QR codes sequencialmente sem parar</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}
