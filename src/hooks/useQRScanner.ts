import { useState, useRef, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'

const PYTHON_API_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:5000'

interface CheckInResult {
  success: boolean
  guestName?: string
  alreadyCheckedIn?: boolean
  error?: string
}

export function useQRScanner(eventId: string | string[]) {
  const { toast } = useToast()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const [scanning, setScanning] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [lastResult, setLastResult] = useState<CheckInResult | null>(null)
  const [lastQRCode, setLastQRCode] = useState<string | null>(null)
  const [cameraError, setCameraError] = useState(false)

  const startScanning = useCallback(async () => {
    try {
      console.log('Solicitando acesso à câmera...')

      // Primeiro ativa o scanning para renderizar o elemento de vídeo
      setScanning(true)
      setCameraError(false)

      // Aguarda um tick para garantir que o React renderizou o vídeo
      await new Promise(resolve => setTimeout(resolve, 0))

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })

      console.log('Câmera acessada com sucesso!', stream)

      if (videoRef.current) {
        console.log('VideoRef existe:', videoRef.current)
        videoRef.current.srcObject = stream
        console.log('Stream anexado ao vídeo')

        // Aguarda o vídeo estar pronto e força play
        videoRef.current.onloadedmetadata = async () => {
          console.log('Metadados do vídeo carregados')
          console.log('Dimensões do vídeo:', {
            videoWidth: videoRef.current?.videoWidth,
            videoHeight: videoRef.current?.videoHeight
          })
          try {
            await videoRef.current?.play()
            console.log('Vídeo iniciado com sucesso!')
            console.log('Video readyState:', videoRef.current?.readyState)
            console.log('Video paused:', videoRef.current?.paused)

            // Inicia o loop de escaneamento
            console.log('Iniciando loop de escaneamento...')
            scanIntervalRef.current = setInterval(captureAndScan, 300)
          } catch (err) {
            console.error('Erro ao iniciar vídeo:', err)
          }
        }

        // Tenta forçar play imediatamente também
        setTimeout(async () => {
          try {
            console.log('Tentando play forçado...')
            await videoRef.current?.play()
            console.log('Play forçado com sucesso!')
            console.log('Video readyState após play forçado:', videoRef.current?.readyState)
            console.log('Video paused após play forçado:', videoRef.current?.paused)
          } catch (err) {
            console.log('Play forçado falhou:', err)
          }
        }, 100)
      } else {
        console.error('VideoRef é null!')
        throw new Error('Elemento de vídeo não encontrado')
      }
    } catch (error: any) {
      console.error('Erro ao acessar câmera:', error)
      console.error('Erro detalhado:', error.name, error.message)
      setScanning(false)
      setCameraError(true)
      toast({
        title: 'Erro na câmera',
        description: `Não foi possível acessar a câmera: ${error.message}`,
        variant: 'destructive',
      })
    }
  }, [toast])

  const stopScanning = useCallback(() => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
      scanIntervalRef.current = null
    }

    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
    }

    setScanning(false)
  }, [])

  const captureAndScan = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || processing) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) return

    // Define o tamanho do canvas igual ao vídeo
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Captura o frame atual do vídeo
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Converte para base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8)

    try {
      // Envia para a API Python processar com OpenCV
      const response = await fetch(`${PYTHON_API_URL}/api/scan-qr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData })
      })

      const result = await response.json()

      if (result.qrCodes && result.qrCodes.length > 0) {
        const qrCodeData = result.qrCodes[0].data

        // Ignora se for o mesmo QR Code
        if (lastQRCode === qrCodeData) {
          return
        }

        // Processa o check-in
        await processCheckIn(qrCodeData)
      }
    } catch (error) {
      console.error('Erro ao escanear:', error)
    }
  }, [processing, lastQRCode])

  const processCheckIn = useCallback(async (qrCodeData: string) => {
    if (processing) return

    try {
      setProcessing(true)
      setLastQRCode(qrCodeData)

      const response = await fetch(`${PYTHON_API_URL}/api/events/${eventId}/checkin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrCode: qrCodeData })
      })

      const result = await response.json()

      if (response.ok) {
        if (result.alreadyCheckedIn) {
          setLastResult({
            success: false,
            guestName: result.guestName,
            alreadyCheckedIn: true,
          })
          toast({
            title: 'Já registrado',
            description: `${result.guestName} já fez check-in anteriormente.`,
            variant: 'destructive',
          })
        } else {
          setLastResult({
            success: true,
            guestName: result.guestName,
          })
          toast({
            title: 'Check-in realizado!',
            description: `Bem-vindo(a), ${result.guestName}!`,
          })
        }
      } else {
        setLastResult({
          success: false,
          error: result.error || 'QR Code inválido',
        })
        toast({
          title: 'Erro no check-in',
          description: result.error || 'QR Code inválido para este evento.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Erro ao processar check-in:', error)
      toast({
        title: 'Erro de conexão',
        description: 'Não foi possível conectar ao servidor.',
        variant: 'destructive',
      })
    } finally {
      setProcessing(false)

      // Limpa o lastQRCode após 1 segundo para permitir nova leitura
      setTimeout(() => {
        setLastQRCode(null)
      }, 1000)

      // Limpa o resultado após 3 segundos
      setTimeout(() => {
        setLastResult(null)
      }, 3000)
    }
  }, [processing, eventId, toast])

  return {
    videoRef,
    canvasRef,
    scanning,
    processing,
    lastResult,
    cameraError,
    startScanning,
    stopScanning,
  }
}
