'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Search, Brain, Code, ChartBar, Users, Star, Clock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const categories = [
  {
    name: 'Machine Learning',
    description: 'Discusiones sobre algoritmos, modelos y técnicas de Machine Learning.',
    icon: Brain,
    count: 245,
    gradient: 'from-blue-600 via-blue-500 to-cyan-500'
  },
  {
    name: 'Deep Learning',
    description: 'Todo sobre redes neuronales, CNN, RNN y más.',
    icon: ChartBar,
    count: 189,
    gradient: 'from-violet-600 via-violet-500 to-purple-500'
  },
  {
    name: 'Proyectos y Código',
    description: 'Comparte y discute implementaciones de IA.',
    icon: Code,
    count: 156,
    gradient: 'from-emerald-600 via-emerald-500 to-teal-500'
  },
  {
    name: 'Comunidad',
    description: 'Eventos, networking y discusiones generales.',
    icon: Users,
    count: 134,
    gradient: 'from-amber-600 via-amber-500 to-yellow-500'
  }
]

const recentDiscussions = [
  {
    id: 1,
    title: '¿Cómo optimizar hiperparámetros en modelos de Deep Learning?',
    category: 'Deep Learning',
    author: {
      name: 'Ana Martínez',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&h=200'
    },
    replies: 23,
    views: 156,
    lastActivity: '2h'
  },
  {
    id: 2,
    title: 'Implementación de BERT para clasificación de texto en español',
    category: 'Proyectos y Código',
    author: {
      name: 'Carlos Rodríguez',
      image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=200&h=200'
    },
    replies: 15,
    views: 98,
    lastActivity: '4h'
  },
  {
    id: 3,
    title: 'Mejores prácticas para preprocesamiento de datos',
    category: 'Machine Learning',
    author: {
      name: 'María González',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200'
    },
    replies: 31,
    views: 245,
    lastActivity: '6h'
  }
]

export default function ForosPage() {
  const [searchQuery, setSearchQuery] = useState('')

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
              Foros de Discusión
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Participa en conversaciones sobre IA, comparte conocimientos y conecta con otros estudiantes.
            </p>
          </motion.div>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar discusiones..."
              className="w-full px-4 py-3 pl-12 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-200"
            >
              <div className="flex items-start">
                <div className={`
                  w-12 h-12 rounded-lg flex items-center justify-center
                  bg-gradient-to-r ${category.gradient}
                `}>
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    {category.name}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    {category.description}
                  </p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    <span>{category.count} discusiones</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Discussions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Discusiones Recientes
            </h2>
            <Link
              href="/comunidad/foros/nuevo"
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 transition-all duration-200"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Nueva Discusión
            </Link>
          </div>

          <div className="space-y-4">
            {recentDiscussions.map((discussion, index) => (
              <motion.div
                key={discussion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-200"
              >
                <div className="flex items-start">
                  <Image
                    src={discussion.author.image}
                    alt={discussion.author.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-white hover:text-blue-400 transition-colors">
                      <Link href={`/comunidad/foros/discusion/${discussion.id}`}>
                        {discussion.title}
                      </Link>
                    </h3>
                    <div className="flex items-center mt-2 text-sm text-gray-400">
                      <span className="mr-4">{discussion.author.name}</span>
                      <span className="mr-4 text-gray-500">en {discussion.category}</span>
                      <div className="flex items-center space-x-4 text-gray-500">
                        <span className="flex items-center">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {discussion.replies}
                        </span>
                        <span className="flex items-center">
                          <Star className="w-4 h-4 mr-1" />
                          {discussion.views}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {discussion.lastActivity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  )
}