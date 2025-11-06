import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuthToken } from '@/lib/auth-middleware'

// GET /api/events/[id] - Buscar detalhes de um evento
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = parseInt(params.id)

    const event = await prisma.event.findUnique({
      where: { id: eventId },
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
      }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Evento não encontrado' },
        { status: 404 }
      )
    }

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
      totalInvites: event._count.invites,
      totalAttendances: event._count.attendances,
    })
  } catch (error) {
    console.error('Erro ao buscar evento:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar evento' },
      { status: 500 }
    )
  }
}

// PUT /api/events/[id] - Atualizar evento
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuthToken(req)
    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const eventId = parseInt(params.id)
    const body = await req.json()
    const { name, type, startDate, endDate, location, description } = body

    // Verificar se o evento existe e se o usuário é o criador
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId }
    })

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Evento não encontrado' },
        { status: 404 }
      )
    }

    if (existingEvent.createdBy !== user.id) {
      return NextResponse.json(
        { error: 'Sem permissão para editar este evento' },
        { status: 403 }
      )
    }

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        name,
        type,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        location,
        description,
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
      id: updatedEvent.id,
      name: updatedEvent.name,
      type: updatedEvent.type,
      startDate: updatedEvent.startDate.toISOString(),
      endDate: updatedEvent.endDate.toISOString(),
      location: updatedEvent.location,
      description: updatedEvent.description,
      createdBy: updatedEvent.createdBy,
      creatorName: updatedEvent.creator.displayName,
      creatorEmail: updatedEvent.creator.email,
    })
  } catch (error) {
    console.error('Erro ao atualizar evento:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar evento' },
      { status: 500 }
    )
  }
}

// DELETE /api/events/[id] - Deletar evento
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuthToken(req)
    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const eventId = parseInt(params.id)

    // Verificar se o evento existe e se o usuário é o criador
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId }
    })

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Evento não encontrado' },
        { status: 404 }
      )
    }

    if (existingEvent.createdBy !== user.id) {
      return NextResponse.json(
        { error: 'Sem permissão para deletar este evento' },
        { status: 403 }
      )
    }

    // Deletar evento (CASCADE vai deletar invites e attendances)
    await prisma.event.delete({
      where: { id: eventId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar evento:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar evento' },
      { status: 500 }
    )
  }
}
