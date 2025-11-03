'use client'

import { Loader2 } from 'lucide-react'
import { useScanner } from '@/hooks/useScanner'
import { ScannerHeader } from '@/components/scanner/ScannerHeader'
import { EventsList } from '@/components/scanner/EventsList'
import { EmptyEventsState } from '@/components/scanner/EmptyEventsState'
import { ScannerInstructions } from '@/components/scanner/ScannerInstructions'

export default function ScannerPage() {
  const {
    user,
    authLoading,
    events,
    loading,
    formatDate,
    getEventTypeBadgeVariant,
    getEventTypeLabel,
    navigateToDashboard,
    navigateToEvents,
    navigateToCheckin,
  } = useScanner()

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Carregando eventos...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <ScannerHeader onNavigateBack={navigateToDashboard} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {events.length === 0 ? (
          <EmptyEventsState onNavigateToEvents={navigateToEvents} />
        ) : (
          <EventsList
            events={events}
            formatDate={formatDate}
            getEventTypeLabel={getEventTypeLabel}
            getEventTypeBadgeVariant={getEventTypeBadgeVariant}
            onSelectEvent={navigateToCheckin}
          />
        )}

        <ScannerInstructions />
      </div>
    </div>
  )
}
