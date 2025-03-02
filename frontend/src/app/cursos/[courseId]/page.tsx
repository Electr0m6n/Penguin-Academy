'use client'

import { use } from 'react'
import { courses } from '@/data/courses'
import { BackgroundPatterns } from '@/components/features/BackgroundPatterns'
import { Clock, Star, ChevronRight, Users } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { StarField2 } from '@/components/ui/StarField'

export default function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const resolvedParams = use(params)
  const course = courses.find(c => c.id === resolvedParams.courseId)

  if (!course) {
    notFound()
  }

  const Icon = course.icon
  const gradientClass = course.gradient.startsWith('bg-') ? course.gradient : `bg-gradient-to-r ${course.gradient}`

  return (
    <main className="min-h-screen bg-black pt-20 relative">
      <BackgroundPatterns />
      <StarField2 className="z-10" />
      
      <div className="relative z-20">
        {/* Hero del curso */}
        <div className="relative h-[40vh] min-h-[300px] sm:min-h-[400px] overflow-hidden">
          <Image
            src={course.image}
            alt={course.title}
            width={1920}
            height={1080}
            priority
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl ${gradientClass}`}>
                  <Icon className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-4">
                    {course.title}
                  </h1>
                  <p className="text-base sm:text-xl text-gray-300 max-w-2xl">
                    {course.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-6 mt-4 sm:mt-6">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      <span className="text-sm sm:text-base text-gray-300">{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm sm:text-base text-gray-300">{course.rating}</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      <span className="text-sm sm:text-base text-gray-300">{course.students} estudiantes</span>
                    </div>
                    <span className={`
                      px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium
                      ${course.level === 'Principiante' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                        course.level === 'Intermedio' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                        'bg-red-500/10 text-red-400 border border-red-500/20'}
                    `}>
                      {course.level}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido del curso */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                ¿Qué aprenderás?
              </h2>
              <div className="prose prose-invert max-w-none text-sm sm:text-base">
                <p>El contenido del curso estará disponible próximamente.</p>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="sticky top-20 sm:top-24">
                <div className="bg-white/[0.02] border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden backdrop-blur-sm">
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">
                      Comienza tu aprendizaje
                    </h3>
                    <Link
                      href="#"
                      className={`
                        w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-white text-sm sm:text-base font-medium
                        ${gradientClass} hover:opacity-90 transition-opacity
                      `}
                    >
                      Comenzar curso
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 