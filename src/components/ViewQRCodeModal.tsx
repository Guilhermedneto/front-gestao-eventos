'use client'

import { useRef } from 'react'

interface ViewQRCodeModalProps {
  isOpen: boolean
  onClose: () => void
  invite: {
    id: number
    guestName: string
    guestEmail: string
    qrCode: string
    qrCodeImage: string
  } | null
  eventName: string
}

export default function ViewQRCodeModal({ isOpen, onClose, invite, eventName }: ViewQRCodeModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  if (!isOpen || !invite) return null

  const handleDownload = () => {
    if (!invite.qrCodeImage) return

    // Cria um link de download
    const link = document.createElement('a')
    link.href = `data:image/png;base64,${invite.qrCodeImage}`
    link.download = `qrcode-${invite.guestName.replace(/\s+/g, '-')}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePrint = () => {
    // Abre janela de impressão com apenas o QR code
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>QR Code - ${invite.guestName}</title>
            <style>
              body {
                margin: 0;
                padding: 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                font-family: Arial, sans-serif;
              }
              .container {
                text-align: center;
                page-break-inside: avoid;
              }
              h1 {
                font-size: 24px;
                margin-bottom: 10px;
                color: #111827;
              }
              h2 {
                font-size: 18px;
                margin-bottom: 20px;
                color: #6B7280;
                font-weight: normal;
              }
              img {
                width: 300px;
                height: 300px;
                margin: 20px 0;
                border: 2px solid #E5E7EB;
                border-radius: 8px;
              }
              .info {
                margin-top: 20px;
                font-size: 14px;
                color: #6B7280;
              }
              @media print {
                body {
                  padding: 0;
                }
                .container {
                  page-break-inside: avoid;
                }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>${eventName}</h1>
              <h2>Convite para ${invite.guestName}</h2>
              <img src="data:image/png;base64,${invite.qrCodeImage}" alt="QR Code" />
              <div class="info">
                <p><strong>Email:</strong> ${invite.guestEmail}</p>
                <p><strong>Código:</strong> ${invite.qrCode}</p>
              </div>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 250)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">QR Code do Convite</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {invite.guestName}
            </h3>
            <p className="text-sm text-gray-600">{invite.guestEmail}</p>
          </div>

          {/* QR Code Image */}
          <div className="flex justify-center mb-6">
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
              {invite.qrCodeImage ? (
                <img
                  src={`data:image/png;base64,${invite.qrCodeImage}`}
                  alt="QR Code"
                  className="w-64 h-64"
                />
              ) : (
                <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded">
                  <p className="text-gray-500">QR Code não disponível</p>
                </div>
              )}
            </div>
          </div>

          {/* QR Code Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-xs font-medium text-gray-700 mb-1">Código Único:</p>
            <code className="text-xs text-gray-900 break-all bg-white px-2 py-1 rounded border border-gray-200 block">
              {invite.qrCode}
            </code>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Baixar PNG
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Imprimir
            </button>
          </div>

          <div className="mt-4">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
