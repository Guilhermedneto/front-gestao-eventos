import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gestão de Eventos',
  description: 'Sistema de gestão de eventos com QR Code',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} overflow-x-hidden`}>
        <div className="w-full max-w-[100vw] overflow-x-hidden">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
