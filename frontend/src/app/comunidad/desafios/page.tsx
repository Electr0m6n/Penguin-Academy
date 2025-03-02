'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Clock, Users, Star, Target, ArrowRight, Brain, Code, ChartBar, Award } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const categories = [
  {
    name: 'Machine Learning',
    description: 'Desafíos de predicción y clasificación.',
    icon: Brain,
    count: 8,
    gradient: 'from-blue-600 via-blue-500 to-cyan-500'
  },
  {
    name: 'Deep Learning',
    description: 'Competencias de redes neuronales.',
    icon: ChartBar,
    count: 5,
    gradient: 'from-violet-600 via-violet-500 to-purple-500'
  },
  {
    name: 'Coding',
    description: 'Implementación de algoritmos de IA.',
    icon: Code,
    count: 12,
    gradient: 'from-emerald-600 via-emerald-500 to-teal-500'
  },
  {
    name: 'Hackathons',
    description: 'Eventos intensivos de desarrollo.',
    icon: Trophy,
    count: 3,
    gradient: 'from-amber-600 via-amber-500 to-yellow-500'
  }
]

const challenges = [
  {
    id: 1,
    title: 'Clasificación de Imágenes con CNN',
    description: 'Desarrolla un modelo de CNN para clasificar imágenes de diferentes especies de aves.',
    category: 'Deep Learning',
    difficulty: 'Intermedio',
    participants: 156,
    deadline: '2024-04-15',
    prize: '$500',
    image: 'https://picsum.photos/400/300?random=1',
    badges: ['Top Prize', 'Featured']
  },
  {
    id: 2,
    title: 'Predicción de Series Temporales',
    description: 'Crea un modelo para predecir el consumo energético utilizando datos históricos.',
    category: 'Machine Learning',
    difficulty: 'Avanzado',
    participants: 89,
    deadline: '2024-04-20',
    prize: '$300',
    image: 'https://picsum.photos/400/300?random=2',
    badges: ['Popular']
  },
  {
    id: 3,
    title: 'Optimización de Algoritmos',
    description: 'Mejora la eficiencia de algoritmos de procesamiento de lenguaje natural.',
    category: 'Coding',
    difficulty: 'Experto',
    participants: 67,
    deadline: '2024-04-25',
    prize: '$750',
    image: 'https://picsum.photos/400/300?random=3',
    badges: ['High Prize']
  }
]

const leaderboard = [
  {
    rank: 1,
    name: 'Ana Martínez',
    points: 2500,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&h=200',
    badges: ['Gold', 'Expert']
  },
  {
    rank: 2,
    name: 'Carlos Rodríguez',
    points: 2350,
    image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=200&h=200',
    badges: ['Silver']
  },
  {
    rank: 3,
    name: 'María González',
    points: 2200,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200',
    badges: ['Bronze']
  }
]

export default function DesafiosPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredChallenges = challenges.filter(challenge =>
    selectedCategory === 'all' || challenge.category === selectedCategory
  )

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
              Desafíos y Competencias
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Pon a prueba tus habilidades, compite con otros desarrolladores y gana premios.
            </p>
          </motion.div>
        </div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-200 cursor-pointer"
              onClick={() => setSelectedCategory(category.name === selectedCategory ? 'all' : category.name)}
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
                <Target className="w-4 h-4 mr-1" />
                <span>{category.count} desafíos activos</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Active Challenges */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">
              Desafíos Activos
            </h2>
            <Link
              href="/comunidad/desafios/todos"
              className="text-blue-400 hover:text-blue-300 transition-colors flex items-center"
            >
              Ver todos
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredChallenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Link href={`/comunidad/desafios/${challenge.id}`} className="block group">
                  <div className="relative rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-200">
                    <div className="aspect-video relative">
                      <Image
                        src={challenge.image}
                        alt={challenge.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute top-4 left-4 flex gap-2">
                        {challenge.badges.map((badge) => (
                          <span
                            key={badge}
                            className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/90 text-white"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {challenge.category}
                        </span>
                        <span className="text-yellow-400 font-semibold">
                          {challenge.prize}
                        </span>
                      </div>

                      <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors mb-2">
                        {challenge.title}
                      </h3>

                      <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                        {challenge.description}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {challenge.participants}
                          </span>
                          <span className="flex items-center">
                            <Target className="w-4 h-4 mr-1" />
                            {challenge.difficulty}
                          </span>
                        </div>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {new Date(challenge.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-8">
            Top Participantes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leaderboard.map((user, index) => (
              <motion.div
                key={user.rank}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-center"
              >
                <div className="relative">
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div className={`
                    absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold
                    ${user.rank === 1 ? 'bg-yellow-500' : user.rank === 2 ? 'bg-gray-400' : 'bg-amber-700'}
                  `}>
                    {user.rank}
                  </div>
                </div>

                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    {user.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-gray-400">{user.points} puntos</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {user.badges.map((badge) => (
                    <span
                      key={badge}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    >
                      <Award className="w-3 h-3 mr-1" />
                      {badge}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
} 