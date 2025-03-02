'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Star, Bug, Sparkles, Wrench, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const releases = [
  {
    version: 'v2.1.0',
    date: '15 de Marzo, 2024',
    highlights: [
      {
        type: 'feature',
        icon: Sparkles,
        title: 'Nuevos Modelos de Visión',
        description: 'Añadidos modelos pre-entrenados para detección de objetos y segmentación de imágenes.'
      },
      {
        type: 'improvement',
        icon: Star,
        title: 'Mejor Rendimiento',
        description: 'Optimización del pipeline de entrenamiento, reduciendo el tiempo de entrenamiento en un 30%.'
      },
      {
        type: 'bugfix',
        icon: Bug,
        title: 'Correcciones',
        description: 'Solucionados problemas de memoria en procesamiento de grandes datasets.'
      }
    ],
    changes: [
      {
        category: 'Características Nuevas',
        items: [
          'Soporte para modelos de visión YOLOv8',
          'Nueva API para segmentación de imágenes',
          'Integración con datasets populares de visión'
        ]
      },
      {
        category: 'Mejoras',
        items: [
          'Optimización del uso de memoria en GPU',
          'Mejor manejo de errores en la API',
          'Documentación actualizada con nuevos ejemplos'
        ]
      },
      {
        category: 'Correcciones',
        items: [
          'Solucionado error de memoria en datasets grandes',
          'Corregido bug en la exportación de modelos',
          'Arreglados problemas de compatibilidad con Python 3.11'
        ]
      }
    ]
  },
  {
    version: 'v2.0.0',
    date: '1 de Marzo, 2024',
    highlights: [
      {
        type: 'feature',
        icon: Sparkles,
        title: 'Nueva Arquitectura',
        description: 'Rediseño completo de la plataforma para mejor escalabilidad y rendimiento.'
      },
      {
        type: 'improvement',
        icon: Wrench,
        title: 'API v2',
        description: 'Nueva versión de la API con mejor diseño y más funcionalidades.'
      }
    ],
    changes: [
      {
        category: 'Breaking Changes',
        items: [
          'Nueva estructura de la API v2',
          'Cambios en la autenticación',
          'Actualización requerida de dependencias'
        ]
      },
      {
        category: 'Características Nuevas',
        items: [
          'Sistema de cola de trabajos distribuido',
          'Panel de control mejorado',
          'Nuevas integraciones con servicios cloud'
        ]
      }
    ]
  }
]

export default function LatestReleasesPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
          <Link href="/documentacion" className="hover:text-white transition-colors">
            Documentación
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/documentacion/release-notes" className="hover:text-white transition-colors">
            Notas de Versión
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-white">Última Versión</span>
        </div>

        {/* Releases */}
        <div className="space-y-16">
          {releases.map((release, releaseIndex) => (
            <motion.div
              key={release.version}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * releaseIndex }}
            >
              {/* Release Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {release.version}
                  </h2>
                  <p className="text-gray-400">
                    {release.date}
                  </p>
                </div>
                <Link
                  href={`/documentacion/release-notes/${release.version}`}
                  className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Ver detalles
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {release.highlights.map((highlight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="bg-white/5 border border-white/10 rounded-xl p-6"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                      <highlight.icon className="h-5 w-5 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {highlight.title}
                    </h3>
                    <p className="text-gray-400">
                      {highlight.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Changes */}
              <div className="space-y-6">
                {release.changes.map((category, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + 0.1 * index }}
                  >
                    <h3 className="text-lg font-semibold text-white mb-4">
                      {category.category}
                    </h3>
                    <ul className="space-y-3">
                      {category.items.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="flex items-start"
                        >
                          <ChevronRight className="h-5 w-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>

              {releaseIndex < releases.length - 1 && (
                <div className="mt-12 border-b border-white/10" />
              )}
            </motion.div>
          ))}
        </div>

        {/* View All Releases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16"
        >
          <Link
            href="/documentacion/release-notes/changelog"
            className="block group"
          >
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/20 rounded-xl p-6 text-center hover:bg-white/5 transition-colors">
              <h3 className="text-lg font-semibold text-white mb-2">
                Ver Historial Completo
              </h3>
              <p className="text-gray-400">
                Explora todas las versiones anteriores y sus cambios.
              </p>
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  )
} 