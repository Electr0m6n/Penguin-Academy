'use client'

import Link from 'next/link'
import { BackgroundPatterns } from '@/components/features/BackgroundPatterns'
import { ChevronLeft } from 'lucide-react'
import { StarField2 } from '@/components/ui/StarField'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black pt-20 relative">
      <BackgroundPatterns />
      <StarField2 className="z-10" />
      
      <div className="relative z-20 flex flex-col items-center justify-center min-h-[60vh] text-center px-4 sm:px-6">
        <h1 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">
          Curso no encontrado
        </h1>
        <p className="text-base sm:text-xl text-gray-400 mb-6 sm:mb-8 max-w-2xl">
          Lo sentimos, el curso que buscas no está disponible en este momento.
        </p>
        <Link
          href="/cursos"
          className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-full text-sm sm:text-base text-white bg-blue-500 hover:bg-blue-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          Volver a cursos
        </Link>
      </div>
    </main>
  )
} 