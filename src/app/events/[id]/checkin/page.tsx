'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Camera, Loader2 } from 'lucide-react'
import { useQRScanner } from '@/hooks/useQRScanner'
import { ScannerVideo } from '@/components/checkin/ScannerVideo'
import { CheckinResult } from '@/components/checkin/CheckinResult'
import { CheckinInstructions } from '@/components/checkin/CheckinInstructions'

const PYTHON_API_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:5000'

interface Event {
  id: number
  name: string
  type: string
  startDate: string
  endDate: string
}

export default function CheckInPage() {
  const params = useParams()
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

  // Usa o hook personalizado para toda a lógica do scanner
  const {
    videoRef,
    canvasRef,
    scanning,
    processing,
    lastResult,
    cameraError,
    startScanning,
    stopScanning,
  } = useQRScanner(params.id)

  useEffect(() => {
    fetchEvent()
  }, [params.id])

  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, [stopScanning])

  const fetchEvent = async () => {
    try {
      const response = await fetch(`${PYTHON_API_URL}/api/events/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setEvent(data)
      }
    } catch (error) {
      console.error('Erro ao buscar evento:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-600">Evento não encontrado</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 overflow-x-hidden">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push(`/events/${params.id}`)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Check-in do Evento
              </h1>
              <p className="text-sm text-gray-600">{event.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6">
          {/* Scanner Card */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Scanner de QR Code (OpenCV + Python)
              </CardTitle>
              <CardDescription className="text-purple-100">
                Detecção avançada de QR Code com processamento de imagem
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ScannerVideo
                videoRef={videoRef}
                canvasRef={canvasRef}
                scanning={scanning}
                processing={processing}
                cameraError={cameraError}
                onStartScanning={startScanning}
                onStopScanning={stopScanning}
              />
            </CardContent>
          </Card>

          {/* Last Result Card */}
          {lastResult && <CheckinResult {...lastResult} />}

          {/* Instructions */}
          <CheckinInstructions />
        </div>
      </div>
    </div>
  )
}
