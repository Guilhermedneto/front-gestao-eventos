'use client'

import { useDashboard } from '@/hooks/useDashboard'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { WelcomeSection } from '@/components/dashboard/WelcomeSection'
import { StatsCards } from '@/components/dashboard/StatsCards'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { SystemStatus } from '@/components/dashboard/SystemStatus'

export default function DashboardPage() {
  const {
    user,
    loading,
    signOut,
    stats,
    loadingStats,
    calculateAttendanceRate,
    navigateToEvents,
    navigateToScanner,
  } = useDashboard()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
          <p className="text-sm text-gray-600 animate-pulse">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-x-hidden">
      <DashboardHeader
        userName={user.displayName}
        userEmail={user.email}
        userPhotoUrl={user.photoUrl}
        onSignOut={signOut}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <WelcomeSection />

        <StatsCards
          stats={stats}
          loadingStats={loadingStats}
          attendanceRate={calculateAttendanceRate()}
        />

        <QuickActions
          onNavigateToEvents={navigateToEvents}
          onNavigateToScanner={navigateToScanner}
        />

        <SystemStatus userEmail={user.email} />
      </main>
    </div>
  )
}
