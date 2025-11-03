import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

/**
 * Gera um código único para o QR code
 */
export function generateUniqueCode(): string {
  return uuidv4();
}

/**
 * Gera a imagem do QR code como Data URL (base64)
 * @param data - Dados a serem codificados no QR code
 * @param options - Opções de configuração do QR code
 */
export async function generateQRCodeImage(
  data: string,
  options?: {
    width?: number;
    margin?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  }
): Promise<string> {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(data, {
      width: options?.width || 400,
      margin: options?.margin || 2,
      color: {
        dark: options?.color?.dark || '#000000',
        light: options?.color?.light || '#FFFFFF',
      },
    });
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Erro ao gerar QR code:', error);
    throw new Error('Falha ao gerar QR code');
  }
}

/**
 * Valida se um código QR é válido (UUID v4)
 */
export function validateQRCode(code: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(code);
}
