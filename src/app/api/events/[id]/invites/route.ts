import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuthToken } from '@/lib/auth-middleware'
import { generateQRCodeImage } from '@/lib/qrcode'
import { v4 as uuidv4 } from 'uuid'

// GET /api/events/[id]/invites - Listar convites de um evento
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = parseInt(params.id)

    const invites = await prisma.invite.findMany({
      where: { eventId },
      include: {
        attendances: {
          take: 1,
          orderBy: {
            checkedInAt: 'desc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const formattedInvites = invites.map(invite => ({
      id: invite.id,
      eventId: invite.eventId,
      guestName: invite.guestName,
      guestEmail: invite.guestEmail,
      qrCode: invite.qrCode,
      qrCodeImage: invite.qrCodeImage,
      emailSent: invite.emailSent,
      sentAt: invite.sentAt?.toISOString(),
      checkedIn: invite.attendances.length > 0,
      checkedInAt: invite.attendances[0]?.checkedInAt?.toISOString(),
      createdAt: invite.createdAt.toISOString(),
    }))

    return NextResponse.json(formattedInvites)
  } catch (error) {
    console.error('Erro ao buscar convites:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar convites' },
      { status: 500 }
    )
  }
}

// POST /api/events/[id]/invites - Criar novo convite
export async function POST(
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
    const { guestName, guestEmail } = body

    if (!guestName || !guestEmail) {
      return NextResponse.json(
        { error: 'Nome e email são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se o evento existe
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Evento não encontrado' },
        { status: 404 }
      )
    }

    // Gerar QR Code único
    const qrCode = uuidv4()
    const qrCodeImage = await generateQRCodeImage(qrCode)

    const invite = await prisma.invite.create({
      data: {
        eventId,
        guestName,
        guestEmail,
        qrCode,
        qrCodeImage,
      }
    })

    return NextResponse.json({
      id: invite.id,
      eventId: invite.eventId,
      guestName: invite.guestName,
      guestEmail: invite.guestEmail,
      qrCode: invite.qrCode,
      qrCodeImage: invite.qrCodeImage,
      emailSent: invite.emailSent,
      sentAt: invite.sentAt?.toISOString(),
      createdAt: invite.createdAt.toISOString(),
    }, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar convite:', error)
    return NextResponse.json(
      { error: 'Erro ao criar convite' },
      { status: 500 }
    )
  }
}
