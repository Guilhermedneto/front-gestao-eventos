import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    // Buscar estatísticas agregadas do banco
    const [
      totalEvents,
      totalInvites,
      totalAttendances,
      emailsSent
    ] = await Promise.all([
      prisma.event.count(),
      prisma.invite.count(),
      prisma.attendance.count(),
      prisma.invite.count({ where: { emailSent: true } })
    ])

    return NextResponse.json({
      totalEvents,
      totalInvites,
      totalAttendances,
      emailsSent
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    )
  }
}
