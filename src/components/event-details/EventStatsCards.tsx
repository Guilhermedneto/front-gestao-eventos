import { Mail, CheckCircle, Users, BarChart3 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface EventStatsCardsProps {
  totalInvites: number
  sentInvites: number
  checkedIn: number
  checkInRate: number
}

export function EventStatsCards({ totalInvites, sentInvites, checkedIn, checkInRate }: EventStatsCardsProps) {
  const stats = [
    {
      title: 'Total Convites',
      value: totalInvites,
      icon: Mail,
      color: 'blue',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      borderColor: 'border-l-blue-500'
    },
    {
      title: 'Enviados',
      value: sentInvites,
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      borderColor: 'border-l-green-500'
    },
    {
      title: 'Check-ins',
      value: checkedIn,
      icon: Users,
      color: 'purple',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      borderColor: 'border-l-purple-500'
    },
    {
      title: 'Taxa Check-in',
      value: `${checkInRate}%`,
      icon: BarChart3,
      color: 'orange',
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
      borderColor: 'border-l-orange-500'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className={`hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 ${stat.borderColor}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
