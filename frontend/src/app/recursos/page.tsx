'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Book, Video, Code, Download, ExternalLink, Search, Tag, ChevronRight, Star } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const categories = [
  {
    id: 'tutorials',
    name: 'Tutoriales',
    icon: Book,
    description: 'Guías paso a paso para aprender conceptos clave.'
  },
  {
    id: 'videos',
    name: 'Videos',
    icon: Video,
    description: 'Contenido audiovisual educativo y demostraciones.'
  },
  {
    id: 'code',
    name: 'Código',
    icon: Code,
    description: 'Ejemplos y proyectos de código fuente.'
  },
  {
    id: 'tools',
    name: 'Herramientas',
    icon: Download,
    description: 'Software y utilidades para desarrollo.'
  }
]

const resources = [
  {
    category: 'tutorials',
    title: 'Introducción a Machine Learning',
    description: 'Aprende los fundamentos del aprendizaje automático desde cero.',
    image: 'https://picsum.photos/400/250?random=1',
    tags: ['ML', 'Principiante'],
    rating: 4.8,
    reviews: 128,
    link: '/tutoriales/machine-learning-intro'
  },
  {
    category: 'tutorials',
    title: 'Deep Learning con PyTorch',
    description: 'Guía completa de redes neuronales con PyTorch.',
    image: 'https://picsum.photos/400/250?random=2',
    tags: ['DL', 'PyTorch', 'Intermedio'],
    rating: 4.9,
    reviews: 95,
    link: '/tutoriales/pytorch-deep-learning'
  },
  {
    category: 'videos',
    title: 'Serie de Computer Vision',
    description: 'Videos prácticos sobre procesamiento de imágenes y visión por computadora.',
    image: 'https://picsum.photos/400/250?random=3',
    tags: ['CV', 'Video', 'Avanzado'],
    rating: 4.7,
    reviews: 73,
    link: '/videos/computer-vision-series'
  },
  {
    category: 'code',
    title: 'Ejemplos de NLP',
    description: 'Colección de notebooks con ejemplos de procesamiento de lenguaje natural.',
    image: 'https://picsum.photos/400/250?random=4',
    tags: ['NLP', 'Código', 'Intermedio'],
    rating: 4.6,
    reviews: 84,
    link: '/codigo/nlp-examples'
  },
  {
    category: 'tools',
    title: 'Dataset Explorer',
    description: 'Herramienta para visualizar y analizar datasets de manera interactiva.',
    image: 'https://picsum.photos/400/250?random=5',
    tags: ['Herramienta', 'Datos'],
    rating: 4.5,
    reviews: 62,
    link: '/herramientas/dataset-explorer'
  }
]

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = React.useState('all')
  const [searchQuery, setSearchQuery] = React.useState('')

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Recursos de Aprendizaje
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explora nuestra colección de recursos educativos, herramientas y materiales para mejorar tus habilidades en IA.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar recursos..."
                  className="w-full px-4 py-3 pl-12 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                }`}
              >
                Todos
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className={`
                relative overflow-hidden rounded-xl p-6 cursor-pointer
                ${selectedCategory === category.id ? 'bg-white/10' : 'bg-white/5'}
                hover:bg-white/10 transition-all duration-200
              `}
              onClick={() => setSelectedCategory(category.id)}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                  <category.icon className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-400">
                  {category.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredResources.map((resource, index) => (
            <motion.div
              key={resource.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + 0.1 * index }}
            >
              <Link href={resource.link} className="block group">
                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-200">
                  <div className="relative aspect-video">
                    <Image
                      src={resource.image}
                      alt={resource.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {resource.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-gray-400 mb-4">
                      {resource.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-400 mr-1" />
                        <span className="text-white font-medium">{resource.rating}</span>
                        <span className="text-gray-400 ml-1">({resource.reviews})</span>
                      </div>
                      <div className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
                        Explorar
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredResources.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-400">
              No se encontraron recursos que coincidan con tu búsqueda.
            </p>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16"
        >
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/20 rounded-xl p-8 text-center">
            <h3 className="text-xl font-semibold text-white mb-4">
              ¿Quieres contribuir con recursos?
            </h3>
            <p className="text-gray-300 mb-6">
              Comparte tus conocimientos y ayuda a otros a aprender.
            </p>
            <Link
              href="/contribuir"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              Contribuir Recursos
              <ExternalLink className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 