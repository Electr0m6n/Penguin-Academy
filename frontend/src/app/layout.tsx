import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import type { Viewport } from 'next'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Penguin AI - Plataforma de Aprendizaje en IA",
  description: "Aprende Inteligencia Artificial desde cero con cursos prácticos y una comunidad activa.",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#020617',
  viewportFit: 'cover'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark scroll-smooth">
      <body className={`${inter.className} bg-[#020617] text-white antialiased min-h-screen flex flex-col overflow-x-hidden selection:bg-blue-500/30 selection:text-white`}>
        <Header />
        <main className="flex-grow pt-14 sm:pt-16 relative">
          {children}
        </main>
      </body>
    </html>
  );
}
