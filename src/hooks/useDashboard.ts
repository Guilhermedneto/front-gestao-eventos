'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

const PYTHON_API_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:5000'

interface Stats {
  totalEvents: number
  totalInvites: number
  totalAttendances: number
  emailsSent: number
}

export function useDashboard() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    totalEvents: 0,
    totalInvites: 0,
    totalAttendances: 0,
    emailsSent: 0
  })
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      loadStats()
    }
  }, [user])

  const loadStats = async () => {
    try {
      setLoadingStats(true)
      const response = await fetch('/api/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    } finally {
      setLoadingStats(false)
    }
  }

  const calculateAttendanceRate = () => {
    if (stats.totalInvites === 0) return 0
    return Math.round((stats.totalAttendances / stats.totalInvites) * 100)
  }

  const navigateToEvents = () => {
    router.push('/events')
  }

  const navigateToScanner = () => {
    router.push('/scanner')
  }

  return {
    user,
    loading,
    signOut,
    stats,
    loadingStats,
    calculateAttendanceRate,
    navigateToEvents,
    navigateToScanner,
  }
}
