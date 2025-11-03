'use client'

import { useState } from 'react'

const PYTHON_API_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:5000'

interface AddInviteModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  eventId: number
}

export default function AddInviteModal({ isOpen, onClose, onSuccess, eventId }: AddInviteModalProps) {
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validações
    if (!formData.guestName.trim()) {
      setError('Nome do convidado é obrigatório')
      return
    }

    if (!formData.guestEmail.trim()) {
      setError('Email do convidado é obrigatório')
      return
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.guestEmail)) {
      setError('Email inválido')
      return
    }

    try {
      setLoading(true)

      const response = await fetch(`${PYTHON_API_URL}/api/events/${eventId}/invites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guestName: formData.guestName,
          guestEmail: formData.guestEmail
        })
      })

      if (response.ok) {
        setFormData({ guestName: '', guestEmail: '' })
        onSuccess()
        onClose()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Erro ao criar convite')
      }
    } catch (error) {
      console.error('Erro ao criar convite:', error)
      setError('Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setFormData({ guestName: '', guestEmail: '' })
      setError('')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Adicionar Convite</h2>
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

          <div>
            <label htmlFor="guestName" className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Convidado *
            </label>
            <input
              type="text"
              id="guestName"
              value={formData.guestName}
              onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Ex: João Silva"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="guestEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Email do Convidado *
            </label>
            <input
              type="email"
              id="guestEmail"
              value={formData.guestEmail}
              onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Ex: joao@email.com"
              required
              disabled={loading}
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Um QR code único será gerado automaticamente para este convite.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Criando...' : 'Criar Convite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
