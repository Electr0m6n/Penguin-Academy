'use client'

import { motion } from 'framer-motion'
import { Clock, Star, ChevronRight, Users, ChevronLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { courses } from '@/data/courses'
import { useState } from 'react'

export function CoursePreview() {
  // Mostrar cursos disponibles y próximos
  const availableCourses = courses.filter(course => !course.comingSoon).slice(0, 3)
  const upcomingCourses = courses.filter(course => course.comingSoon)
  const [currentPage, setCurrentPage] = useState(0)

  const totalPages = Math.ceil(upcomingCourses.length / 3)
  const currentUpcomingCourses = upcomingCourses.slice(currentPage * 3, (currentPage + 1) * 3)

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Cursos Destacados
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Explora nuestros cursos más populares y comienza tu viaje en el mundo de la IA.
          </p>
        </motion.div>

        {/* Cursos Disponibles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {availableCourses.map((course, index) => {
            const Icon = course.icon
            const gradientClass = course.gradient.startsWith('bg-') ? course.gradient : `bg-gradient-to-r ${course.gradient}`
            
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  href={`/cursos/${course.id}`}
                  className="group block relative bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.04] hover:border-white/20 hover:shadow-2xl hover:shadow-blue-500/10"
                >
                  <div className="flex flex-col h-full">
                    {/* Imagen y gradiente */}
                    <div className="relative h-48 overflow-hidden rounded-t-2xl">
                      <Image
                        src={course.image}
                        alt={course.title}
                        width={800}
                        height={450}
                        priority={index === 0}
                        loading={index === 0 ? 'eager' : 'lazy'}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`p-2.5 rounded-xl ${gradientClass}`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-white group-hover:text-blue-400 transition-colors">
                            {course.title}
                          </h3>
                          <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-400">{course.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                              <span className="text-sm text-gray-400">{course.rating}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-400">{course.students}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-300 text-sm mb-6 line-clamp-2">
                        {course.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className={`
                          px-3 py-1 rounded-full text-xs font-medium
                          ${course.level === 'Principiante' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                            course.level === 'Intermedio' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                            'bg-red-500/10 text-red-400 border border-red-500/20'}
                        `}>
                          {course.level}
                        </span>

                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-all">
                          <span className="text-sm">Comenzar</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Efecto de iluminación */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${gradientClass}`} />
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Próximos Cursos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Próximos Cursos
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Descubre los nuevos cursos que estamos preparando para ti.
          </p>
        </motion.div>

        <div className="relative">
          {totalPages > 1 && (
            <>
              <button
                onClick={prevPage}
                className="absolute -left-12 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={nextPage}
                className="absolute -right-12 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentUpcomingCourses.map((course, index) => {
              const Icon = course.icon
              const gradientClass = course.gradient.startsWith('bg-') ? course.gradient : `bg-gradient-to-r ${course.gradient}`
              
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="group block relative bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.04] hover:border-white/20 hover:shadow-2xl hover:shadow-blue-500/10">
                    <div className="flex flex-col h-full">
                      {/* Imagen y gradiente */}
                      <div className="relative h-48 overflow-hidden rounded-t-2xl">
                        <Image
                          src={course.image}
                          alt={course.title}
                          width={800}
                          height={450}
                          priority={index === 0 && currentPage === 0}
                          loading={index === 0 && currentPage === 0 ? 'eager' : 'lazy'}
                          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white border border-white/20">
                            Próximamente
                          </span>
                        </div>
                      </div>

                      {/* Contenido */}
                      <div className="flex-1 p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`p-2.5 rounded-xl ${gradientClass}`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-white group-hover:text-blue-400 transition-colors">
                              {course.title}
                            </h3>
                            <div className="flex items-center gap-4 mt-1">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-400">{course.duration}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-300 text-sm mb-6 line-clamp-2">
                          {course.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className={`
                            px-3 py-1 rounded-full text-xs font-medium
                            ${course.level === 'Principiante' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                              course.level === 'Intermedio' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                              'bg-red-500/10 text-red-400 border border-red-500/20'}
                          `}>
                            {course.level}
                          </span>
                        </div>
                      </div>

                      {/* Efecto de iluminación */}
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${gradientClass}`} />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/cursos"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 hover:bg-blue-500/20"
          >
            Ver todos los cursos
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
} 