import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuthToken } from '@/lib/auth-middleware'

// GET /api/events - Listar todos os eventos
export async function GET(req: NextRequest) {
  try {
    const events = await prisma.event.findMany({
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            displayName: true,
          }
        },
        _count: {
          select: {
            invites: true,
            attendances: true,
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    })

    const formattedEvents = events.map(event => ({
      id: event.id,
      name: event.name,
      type: event.type,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      location: event.location,
      description: event.description,
      createdBy: event.createdBy,
      creatorName: event.creator.displayName,
      creatorEmail: event.creator.email,
      totalInvites: event._count.invites,
      totalAttendances: event._count.attendances,
    }))

    return NextResponse.json(formattedEvents)
  } catch (error) {
    console.error('Erro ao buscar eventos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar eventos' },
      { status: 500 }
    )
  }
}

// POST /api/events - Criar novo evento
export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuthToken(req)
    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { name, type, startDate, endDate, location, description } = body

    if (!name || !type || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      )
    }

    const event = await prisma.event.create({
      data: {
        name,
        type,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        location,
        description,
        createdBy: user.id,
      },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            displayName: true,
          }
        }
      }
    })

    return NextResponse.json({
      id: event.id,
      name: event.name,
      type: event.type,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      location: event.location,
      description: event.description,
      createdBy: event.createdBy,
      creatorName: event.creator.displayName,
      creatorEmail: event.creator.email,
    }, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar evento:', error)
    return NextResponse.json(
      { error: 'Erro ao criar evento' },
      { status: 500 }
    )
  }
}
