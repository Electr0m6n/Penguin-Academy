'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Search, Brain, Code, ChartBar, BookOpen, Star, Clock, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const categories = [
  {
    name: 'Machine Learning',
    description: 'Grupos enfocados en algoritmos y modelos de ML.',
    icon: Brain,
    count: 12,
    gradient: 'from-blue-600 via-blue-500 to-cyan-500'
  },
  {
    name: 'Deep Learning',
    description: 'Estudio de redes neuronales y arquitecturas avanzadas.',
    icon: ChartBar,
    count: 8,
    gradient: 'from-violet-600 via-violet-500 to-purple-500'
  },
  {
    name: 'Desarrollo IA',
    description: 'Implementación práctica de soluciones de IA.',
    icon: Code,
    count: 15,
    gradient: 'from-emerald-600 via-emerald-500 to-teal-500'
  },
  {
    name: 'Teoría y Fundamentos',
    description: 'Matemáticas y conceptos teóricos de IA.',
    icon: BookOpen,
    count: 10,
    gradient: 'from-amber-600 via-amber-500 to-yellow-500'
  }
]

const studyGroups = [
  {
    id: 1,
    name: 'Deep Learning Avanzado',
    description: 'Grupo dedicado al estudio de arquitecturas avanzadas de redes neuronales y sus aplicaciones.',
    category: 'Deep Learning',
    members: 45,
    rating: 4.8,
    schedule: 'Martes y Jueves, 18:00-20:00',
    image: 'https://picsum.photos/400/300?random=1',
    leader: {
      name: 'Ana Martínez',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&h=200'
    }
  },
  {
    id: 2,
    name: 'Matemáticas para ML',
    description: 'Exploramos los fundamentos matemáticos necesarios para comprender algoritmos de Machine Learning.',
    category: 'Teoría y Fundamentos',
    members: 32,
    rating: 4.9,
    schedule: 'Lunes y Miércoles, 19:00-21:00',
    image: 'https://picsum.photos/400/300?random=2',
    leader: {
      name: 'Carlos Rodríguez',
      image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=200&h=200'
    }
  },
  {
    id: 3,
    name: 'Proyectos Prácticos IA',
    description: 'Desarrollamos proyectos reales aplicando diferentes técnicas de IA en equipo.',
    category: 'Desarrollo IA',
    members: 38,
    rating: 4.7,
    schedule: 'Sábados, 10:00-13:00',
    image: 'https://picsum.photos/400/300?random=3',
    leader: {
      name: 'María González',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200'
    }
  }
]

export default function GruposPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredGroups = studyGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || group.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <main className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              Grupos de Estudio
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Únete a grupos especializados, aprende con otros estudiantes y mejora tus habilidades en IA.
            </p>
          </motion.div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-1"
          >
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar grupos..."
                className="w-full px-4 py-3 pl-12 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex gap-2 overflow-x-auto pb-2"
          >
            <button
              onClick={() => setSelectedCategory('all')}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap
                ${selectedCategory === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }
                transition-all duration-200
              `}
            >
              Todos
            </button>
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap
                  ${selectedCategory === category.name
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }
                  transition-all duration-200
                `}
              >
                {category.name}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Categories Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-200"
            >
              <div className={`
                w-12 h-12 rounded-lg flex items-center justify-center mb-4
                bg-gradient-to-r ${category.gradient}
              `}>
                <category.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {category.name}
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                {category.description}
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <Users className="w-4 h-4 mr-1" />
                <span>{category.count} grupos</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Study Groups */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGroups.map((group, index) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Link href={`/comunidad/grupos/${group.id}`} className="block group">
                <div className="relative rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-200">
                  <div className="aspect-video relative">
                    <Image
                      src={group.image}
                      alt={group.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-500/90 text-white">
                        {group.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {group.name}
                      </h3>
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="ml-1 text-white">{group.rating}</span>
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                      {group.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Image
                          src={group.leader.image}
                          alt={group.leader.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <div className="ml-2">
                          <p className="text-sm text-white">
                            {group.leader.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            Líder del grupo
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-400 text-sm">
                        <Users className="w-4 h-4 mr-1" />
                        {group.members} miembros
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">
                          <Clock className="w-4 h-4 inline mr-1" />
                          {group.schedule}
                        </span>
                        <span className="text-blue-400 group-hover:text-blue-300 transition-colors">
                          Ver detalles
                          <ArrowRight className="w-4 h-4 inline ml-1 transform group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Create Group CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Link
            href="/comunidad/grupos/nuevo"
            className="inline-flex items-center px-6 py-3 rounded-lg text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 transform hover:scale-[1.02] transition-all duration-200"
          >
            <Users className="w-5 h-5 mr-2" />
            Crear Nuevo Grupo
          </Link>
        </motion.div>
      </div>
    </main>
  )
} 