import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken } from '@/lib/firebase-admin';
import prisma from '@/lib/prisma';

export interface AuthUser {
  id: number;
  firebaseUid: string;
  email: string;
  displayName: string | null;
}

/**
 * Middleware para verificar autenticação e retornar o usuário
 */
export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest, user: AuthUser) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token não fornecido' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];
    const { success, uid, error } = await verifyIdToken(token);

    if (!success || !uid) {
      return NextResponse.json(
        { error: error || 'Token inválido' },
        { status: 401 }
      );
    }

    // Busca o usuário no SQL Server
    const user = await prisma.user.findUnique({
      where: { firebaseUid: uid },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    return handler(request, user);

  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
