import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EventsFiltersProps {
  totalEvents: number
  filteredCount: number
  startIndex: number
  endIndex: number
  searchTerm: string
  setSearchTerm: (value: string) => void
  filterType: string
  setFilterType: (value: string) => void
  filterStatus: string
  setFilterStatus: (value: string) => void
  sortBy: string
  setSortBy: (value: string) => void
  hasActiveFilters: boolean
  onClearFilters: () => void
  paginatedCount: number
}

export function EventsFilters({
  totalEvents,
  filteredCount,
  startIndex,
  endIndex,
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus,
  sortBy,
  setSortBy,
  hasActiveFilters,
  onClearFilters,
  paginatedCount
}: EventsFiltersProps) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Linha 1: Stats e Busca */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-900">
            {filteredCount} {filteredCount === 1 ? 'Evento' : 'Eventos'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {paginatedCount > 0 && (
              <>Mostrando {startIndex + 1}-{Math.min(endIndex, filteredCount)} de {filteredCount}</>
            )}
            {filteredCount !== totalEvents && ` (${totalEvents} no total)`}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative sm:min-w-[320px] w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar eventos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      {/* Linha 2: Filtros */}
      <div className="flex flex-wrap gap-3">
        {/* Filtro de Tipo */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
        >
          <option value="all">Todos os Tipos</option>
          <option value="feira">Feira</option>
          <option value="evento">Evento</option>
          <option value="congresso">Congresso</option>
          <option value="workshop">Workshop</option>
        </select>

        {/* Filtro de Status */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
        >
          <option value="all">Todos os Status</option>
          <option value="upcoming">Próximos</option>
          <option value="ongoing">Em Andamento</option>
          <option value="past">Finalizados</option>
        </select>

        {/* Ordenação */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
        >
          <option value="recent">Mais Recentes</option>
          <option value="oldest">Mais Antigos</option>
          <option value="name">Nome (A-Z)</option>
        </select>

        {/* Botão Limpar Filtros */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="gap-2"
          >
            Limpar Filtros
          </Button>
        )}
      </div>
    </div>
  )
}
