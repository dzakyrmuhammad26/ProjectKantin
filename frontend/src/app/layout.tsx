import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Kantin POS — Pesan Makanan',
  description: 'Sistem POS Kantin Multi-Gerai (Halaman Pelanggan)',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={inter.variable}>
      <body className={`${inter.className} min-h-screen bg-[#F8F9FA] text-[#1F2937] antialiased`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
