import { Camera, Loader2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ScannerVideoProps {
  videoRef: React.RefObject<HTMLVideoElement>
  canvasRef: React.RefObject<HTMLCanvasElement>
  scanning: boolean
  processing: boolean
  cameraError: boolean
  onStartScanning: () => void
  onStopScanning: () => void
}

export function ScannerVideo({
  videoRef,
  canvasRef,
  scanning,
  processing,
  cameraError,
  onStartScanning,
  onStopScanning
}: ScannerVideoProps) {
  if (!scanning) {
    return (
      <div className="text-center py-12">
        <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <Button onClick={onStartScanning} size="lg" className="gap-2">
          <Camera className="w-5 h-5" />
          Iniciar Scanner
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {!cameraError ? (
        <div className="relative rounded-lg overflow-hidden bg-black">
          <video
            ref={videoRef}
            className="w-full h-auto"
            autoPlay
            playsInline
            muted
          />
          <canvas ref={canvasRef} className="hidden" />
          {processing && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="w-12 h-12 animate-spin text-white" />
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-red-600">
          <XCircle className="w-16 h-16 mx-auto mb-4" />
          <p>Não foi possível acessar a câmera</p>
          <p className="text-sm text-gray-600 mt-2">
            Verifique as permissões do navegador
          </p>
        </div>
      )}
      <Button onClick={onStopScanning} variant="outline" className="w-full">
        Parar Scanner
      </Button>
    </div>
  )
}
