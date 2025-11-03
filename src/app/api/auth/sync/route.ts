import { NextRequest, NextResponse } from 'next/server';

const PYTHON_API_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:5000';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token não fornecido' },
        { status: 401 }
      );
    }

    // Chama a API Python para sincronizar o usuário
    const response = await fetch(`${PYTHON_API_URL}/api/auth/sync`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || 'Erro ao sincronizar usuário' },
        { status: response.status }
      );
    }

    const userData = await response.json();

    return NextResponse.json({
      success: true,
      user: userData,
    });

  } catch (error) {
    console.error('Erro ao sincronizar usuário:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
