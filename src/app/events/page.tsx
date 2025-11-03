'use client'

import { useEvents } from '@/hooks/useEvents'
import CreateEventModal from '@/components/CreateEventModal'
import { EventsHeader } from '@/components/events/EventsHeader'
import { EventsFilters } from '@/components/events/EventsFilters'
import { EventCard } from '@/components/events/EventCard'
import { EmptyState } from '@/components/events/EmptyState'
import { EventsPagination } from '@/components/events/EventsPagination'
import { EventsQuickStats } from '@/components/events/EventsQuickStats'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function EventsPage() {
  const {
    user,
    loading,
    events,
    loadingEvents,
    showCreateModal,
    setShowCreateModal,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    filteredEvents,
    paginatedEvents,
    totalPages,
    startIndex,
    endIndex,
    loadEvents,
    getEventTypeLabel,
    getEventTypeBadgeVariant,
    formatDate,
    navigateToDashboard,
    navigateToEvent,
    clearFilters,
    hasActiveFilters,
  } = useEvents()

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
          <p className="text-sm text-gray-600 animate-pulse">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-x-hidden">
      <EventsHeader
        onNavigateToDashboard={navigateToDashboard}
        onCreateEvent={() => setShowCreateModal(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <EventsFilters
          totalEvents={events.length}
          filteredCount={filteredEvents.length}
          startIndex={startIndex}
          endIndex={endIndex}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterType={filterType}
          setFilterType={setFilterType}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          sortBy={sortBy}
          setSortBy={setSortBy}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
          paginatedCount={paginatedEvents.length}
        />

        {/* Events Grid */}
        {loadingEvents ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <EmptyState
            searchTerm={searchTerm}
            onCreateEvent={() => setShowCreateModal(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {paginatedEvents.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                index={index}
                onNavigate={navigateToEvent}
                getEventTypeLabel={getEventTypeLabel}
                getEventTypeBadgeVariant={getEventTypeBadgeVariant}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}

        {/* Paginação */}
        {!loadingEvents && filteredEvents.length > itemsPerPage && (
          <EventsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        {/* Quick Stats Footer */}
        {!loadingEvents && events.length > 0 && (
          <EventsQuickStats events={events} />
        )}
      </main>

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadEvents}
        userId={user?.id || 0}
      />
    </div>
  )
}
