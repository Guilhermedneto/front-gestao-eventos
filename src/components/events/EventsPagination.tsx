import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EventsPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function EventsPagination({ currentPage, totalPages, onPageChange }: EventsPaginationProps) {
  return (
    <div className="flex justify-center items-center gap-2 py-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Button
        variant="outline"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Anterior
      </Button>

      <div className="flex gap-1">
        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
          let pageNumber: number

          if (totalPages <= 7) {
            pageNumber = i + 1
          } else if (currentPage <= 4) {
            pageNumber = i + 1
          } else if (currentPage >= totalPages - 3) {
            pageNumber = totalPages - 6 + i
          } else {
            pageNumber = currentPage - 3 + i
          }

          return (
            <Button
              key={pageNumber}
              variant={currentPage === pageNumber ? "default" : "outline"}
              onClick={() => onPageChange(pageNumber)}
              className={`w-10 h-10 p-0 ${currentPage === pageNumber ? 'pointer-events-none' : ''}`}
            >
              {pageNumber}
            </Button>
          )
        })}
      </div>

      <Button
        variant="outline"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="gap-2"
      >
        Próxima
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  )
}
