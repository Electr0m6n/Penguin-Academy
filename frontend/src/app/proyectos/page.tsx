'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Brain, Code, ChartBar, Database, Star, Users, Clock, Github, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const categories = [
  {
    id: 'ml',
    name: 'Machine Learning',
    description: 'Proyectos de aprendizaje automático y algoritmos predictivos.',
    icon: Brain,
    gradient: 'from-blue-600 via-blue-500 to-cyan-500'
  },
  {
    id: 'dl',
    name: 'Deep Learning',
    description: 'Implementaciones de redes neuronales y modelos profundos.',
    icon: ChartBar,
    gradient: 'from-violet-600 via-violet-500 to-purple-500'
  },
  {
    id: 'nlp',
    name: 'NLP',
    description: 'Procesamiento de lenguaje natural y análisis de texto.',
    icon: Code,
    gradient: 'from-emerald-600 via-emerald-500 to-teal-500'
  },
  {
    id: 'cv',
    name: 'Computer Vision',
    description: 'Visión por computadora y procesamiento de imágenes.',
    icon: Database,
    gradient: 'from-amber-600 via-amber-500 to-yellow-500'
  }
]

const projects = [
  {
    id: 1,
    title: 'Sistema de Recomendación con Deep Learning',
    description: 'Implementación de un sistema de recomendación utilizando redes neuronales profundas para personalizar sugerencias de contenido.',
    category: 'dl',
    image: 'https://picsum.photos/800/600?random=1',
    author: {
      name: 'Ana Martínez',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&h=200'
    },
    stats: {
      stars: 156,
      forks: 45,
      contributors: 8
    },
    technologies: ['PyTorch', 'FastAPI', 'Redis'],
    lastUpdate: '2 días',
    difficulty: 'Avanzado',
    repoUrl: 'https://github.com/example/deep-recommender'
  },
  {
    id: 2,
    title: 'Clasificador de Imágenes con CNN',
    description: 'Modelo de clasificación de imágenes usando redes neuronales convolucionales, entrenado con un dataset personalizado.',
    category: 'cv',
    image: 'https://picsum.photos/800/600?random=2',
    author: {
      name: 'Carlos Rodríguez',
      image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=200&h=200'
    },
    stats: {
      stars: 89,
      forks: 23,
      contributors: 4
    },
    technologies: ['TensorFlow', 'OpenCV', 'NumPy'],
    lastUpdate: '5 días',
    difficulty: 'Intermedio',
    repoUrl: 'https://github.com/example/image-classifier'
  },
  {
    id: 3,
    title: 'Análisis de Sentimientos con BERT',
    description: 'Implementación de un modelo de análisis de sentimientos utilizando BERT para procesar texto en español.',
    category: 'nlp',
    image: 'https://picsum.photos/800/600?random=3',
    author: {
      name: 'María González',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200'
    },
    stats: {
      stars: 234,
      forks: 67,
      contributors: 12
    },
    technologies: ['Transformers', 'Scikit-learn', 'Pandas'],
    lastUpdate: '1 semana',
    difficulty: 'Avanzado',
    repoUrl: 'https://github.com/example/sentiment-analysis'
  },
  {
    id: 4,
    title: 'Predicción de Series Temporales',
    description: 'Modelo de predicción de series temporales usando LSTM para pronóstico de datos financieros.',
    category: 'ml',
    image: 'https://picsum.photos/800/600?random=4',
    author: {
      name: 'David López',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200'
    },
    stats: {
      stars: 167,
      forks: 34,
      contributors: 6
    },
    technologies: ['Keras', 'Pandas', 'Matplotlib'],
    lastUpdate: '3 días',
    difficulty: 'Intermedio',
    repoUrl: 'https://github.com/example/time-series'
  }
]

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === null || project.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-[#020617]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Proyectos de IA
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Explora proyectos prácticos, contribuye a la comunidad y construye tu portafolio.
          </p>
        </div>

        {/* Barra de búsqueda */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar proyectos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Categorías */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id === selectedCategory ? null : category.id)}
              className={`relative p-6 rounded-xl overflow-hidden transition-all ${
                category.id === selectedCategory
                  ? 'ring-2 ring-blue-500 scale-[1.02]'
                  : 'hover:scale-[1.02]'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${category.gradient} opacity-10`} />
              <category.icon className="h-8 w-8 text-white mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">{category.name}</h3>
              <p className="text-sm text-gray-400">{category.description}</p>
            </button>
          ))}
        </div>

        {/* Lista de proyectos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-colors"
            >
              <div className="relative aspect-video">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-10 w-10 rounded-full overflow-hidden relative">
                    <Image
                      src={project.author.image}
                      alt={project.author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{project.author.name}</h4>
                    <p className="text-sm text-gray-400">Data Scientist</p>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-400 mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      {project.stats.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <Github className="h-4 w-4" />
                      {project.stats.forks}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {project.stats.contributors}
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {project.lastUpdate}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-purple-400">
                    {project.difficulty}
                  </span>
                  <Link
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Ver proyecto
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
} 