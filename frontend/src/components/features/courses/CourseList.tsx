'use client'

import { motion } from 'framer-motion'
import { Star, Clock, ChevronRight, Search } from 'lucide-react'
import Link from 'next/link'
import { courses } from '@/data/courses'
import { useState } from 'react'
import Image from 'next/image'

export default function CourseList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('all')

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel
    return matchesSearch && matchesLevel
  })

  return (
    <section className="relative">
      {/* Gradiente sutil de fondo */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
      </div>

      <div className="relative">
        <div className="mb-8 sm:mb-12 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-xl w-full">
            <input
              type="text"
              placeholder="Buscar cursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 rounded-full bg-white/5 text-white placeholder-gray-400 border border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 outline-none transition-all backdrop-blur-sm text-base"
              aria-label="Buscar cursos"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            {['all', 'Principiante', 'Intermedio', 'Avanzado'].map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all backdrop-blur-sm whitespace-nowrap flex-shrink-0 ${
                  selectedLevel === level
                    ? 'bg-blue-500/80 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
                aria-label={`Filtrar por nivel ${level}`}
              >
                {level === 'all' ? 'Todos' : level}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {filteredCourses.map((course, index) => {
            const Icon = course.icon
            const isAvailable = !course.comingSoon
            const gradientClass = course.gradient.startsWith('bg-') ? course.gradient : `bg-gradient-to-r ${course.gradient}`
            
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="touch-manipulation"
              >
                <Link
                  href={isAvailable ? `/cursos/${course.id}` : '#'}
                  className={`course-card group block relative bg-white/[0.01] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.02] hover:border-white/20 ${!isAvailable ? 'cursor-not-allowed' : ''}`}
                >
                  <div className="flex flex-col h-full">
                    {/* Imagen y gradiente */}
                    <div className="relative h-40 sm:h-48 overflow-hidden rounded-t-2xl">
                      <Image
                        src={course.image}
                        alt={course.title}
                        width={800}
                        height={450}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 p-4 sm:p-6">
                      <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div className={`p-2 sm:p-2.5 rounded-full ${gradientClass}`}>
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-medium text-white group-hover:text-blue-400 transition-colors">
                            {course.title}
                          </h3>
                          <div className="flex items-center gap-3 sm:gap-4 mt-1">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                              <span className="text-xs sm:text-sm text-gray-400">{course.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-400" />
                              <span className="text-xs sm:text-sm text-gray-400">{course.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-300 text-xs sm:text-sm mb-4 sm:mb-6 line-clamp-2">
                        {course.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className={`
                          px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium
                          ${course.level === 'Principiante' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                            course.level === 'Intermedio' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                            'bg-red-500/10 text-red-400 border border-red-500/20'}
                        `}>
                          {course.level}
                        </span>

                        {!isAvailable ? (
                          <span className="px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium bg-white/5 text-gray-400">
                            Próximamente
                          </span>
                        ) : (
                          <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-all">
                            <span className="text-[10px] sm:text-sm">Comenzar</span>
                            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Efecto de iluminación */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${gradientClass}`} />
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
} 