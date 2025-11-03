import {
  Calendar,
  Mail,
  Users,
  TrendingUp,
  CheckCircle2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Stats {
  totalEvents: number
  totalInvites: number
  totalAttendances: number
  emailsSent: number
}

interface StatsCardsProps {
  stats: Stats
  loadingStats: boolean
  attendanceRate: number
}

export function StatsCards({ stats, loadingStats, attendanceRate }: StatsCardsProps) {
  const statCards = [
    {
      title: 'Total de Eventos',
      value: stats.totalEvents,
      icon: Calendar,
      subtitle: 'Eventos cadastrados',
      subtitleIcon: TrendingUp,
      color: 'primary',
      borderColor: 'border-l-primary-500',
      bgColor: 'bg-primary-100',
      bgHoverColor: 'group-hover:bg-primary-200',
      iconColor: 'text-primary-600'
    },
    {
      title: 'Convites Enviados',
      value: stats.emailsSent,
      icon: Mail,
      subtitle: 'Emails confirmados',
      subtitleIcon: CheckCircle2,
      color: 'green',
      borderColor: 'border-l-green-500',
      bgColor: 'bg-green-100',
      bgHoverColor: 'group-hover:bg-green-200',
      iconColor: 'text-green-600'
    },
    {
      title: 'Check-ins',
      value: stats.totalAttendances,
      icon: Users,
      subtitle: 'Participantes presentes',
      subtitleIcon: Users,
      color: 'blue',
      borderColor: 'border-l-blue-500',
      bgColor: 'bg-blue-100',
      bgHoverColor: 'group-hover:bg-blue-200',
      iconColor: 'text-blue-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {statCards.map((card, index) => {
        const Icon = card.icon
        const SubtitleIcon = card.subtitleIcon

        return (
          <Card
            key={index}
            className={`border-l-4 ${card.borderColor} hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <div className={`w-10 h-10 ${card.bgColor} rounded-lg flex items-center justify-center ${card.bgHoverColor} transition-colors`}>
                <Icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {loadingStats ? (
                  <div className="h-9 w-16 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  card.value
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <SubtitleIcon className="w-3 h-3" />
                {card.subtitle}
              </p>
            </CardContent>
          </Card>
        )
      })}

      {/* Taxa de Presença Card */}
      <Card className="border-l-4 border-l-purple-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Taxa de Presença
          </CardTitle>
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">
            {loadingStats ? (
              <div className="h-9 w-16 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              `${attendanceRate}%`
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Comparecimento médio
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
