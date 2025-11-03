'use client'

import { useState } from 'react'

const PYTHON_API_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:5000'

interface ImportExcelModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  eventId: number
}

interface ImportResult {
  message: string
  successCount: number
  errorCount: number
  errors: string[]
}

export default function ImportExcelModal({ isOpen, onClose, onSuccess, eventId }: ImportExcelModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<ImportResult | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Valida extensão
      if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
        setError('Por favor, selecione um arquivo Excel (.xlsx ou .xls)')
        setFile(null)
        return
      }
      setFile(selectedFile)
      setError('')
      setResult(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setResult(null)

    if (!file) {
      setError('Por favor, selecione um arquivo')
      return
    }

    try {
      setLoading(true)

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${PYTHON_API_URL}/api/events/${eventId}/invites/bulk`, {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (response.ok || data.successCount > 0) {
        setResult(data)
        if (data.successCount > 0) {
          onSuccess()
        }
      } else {
        setError(data.error || 'Erro ao importar convites')
      }
    } catch (error) {
      console.error('Erro ao importar convites:', error)
      setError('Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setFile(null)
      setError('')
      setResult(null)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Importar Convites do Excel</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500"
              disabled={loading}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {result && (
            <div className={`border rounded-lg p-4 ${result.successCount > 0 ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
              <div className="flex items-start">
                <svg
                  className={`w-5 h-5 mt-0.5 flex-shrink-0 ${result.successCount > 0 ? 'text-green-600' : 'text-yellow-600'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="ml-3 flex-1">
                  <h4 className={`text-sm font-medium ${result.successCount > 0 ? 'text-green-900' : 'text-yellow-900'}`}>
                    {result.message}
                  </h4>
                  <div className={`mt-2 text-sm ${result.successCount > 0 ? 'text-green-700' : 'text-yellow-700'}`}>
                    <p>Convites criados com sucesso: <strong>{result.successCount}</strong></p>
                    <p>Erros encontrados: <strong>{result.errorCount}</strong></p>

                    {result.errors.length > 0 && (
                      <div className="mt-3">
                        <p className="font-medium mb-1">Erros:</p>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                          {result.errors.map((err, idx) => (
                            <li key={idx}>{err}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  Formato do arquivo Excel:
                </h4>
                <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                  <li>Primeira linha deve conter os cabeçalhos</li>
                  <li><strong>Coluna A:</strong> Nome do convidado</li>
                  <li><strong>Coluna B:</strong> Email do convidado</li>
                  <li>Arquivo no formato .xlsx ou .xls</li>
                </ul>
                <div className="mt-3 text-xs text-blue-600">
                  <p>Exemplo:</p>
                  <div className="mt-1 bg-white rounded p-2 font-mono text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-bold">Nome</div>
                      <div className="font-bold">Email</div>
                      <div>João Silva</div>
                      <div>joao@email.com</div>
                      <div>Maria Santos</div>
                      <div>maria@email.com</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="excelFile" className="block text-sm font-medium text-gray-700 mb-2">
              Selecione o arquivo Excel *
            </label>
            <div className="relative">
              <input
                type="file"
                id="excelFile"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                disabled={loading}
              />
            </div>
            {file && (
              <p className="mt-2 text-sm text-gray-600">
                Arquivo selecionado: <strong>{file.name}</strong>
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={loading}
            >
              {result ? 'Fechar' : 'Cancelar'}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !file}
            >
              {loading ? 'Importando...' : 'Importar Convites'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
