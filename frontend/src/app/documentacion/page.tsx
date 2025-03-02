'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Book, Code, FileText, HelpCircle, GitBranch, ChevronRight, Copy, ThumbsUp, ThumbsDown, ArrowUp, Github } from 'lucide-react'
import Link from 'next/link'

const sections = [
  {
    id: 'getting-started',
    title: 'Primeros Pasos',
    icon: Book,
    subsections: [
      { id: 'introduction', title: 'Introducción' },
      { id: 'installation', title: 'Instalación' },
      { id: 'quickstart', title: 'Guía Rápida' }
    ]
  },
  {
    id: 'api-reference',
    title: 'Referencia API',
    icon: Code,
    subsections: [
      { id: 'authentication', title: 'Autenticación' },
      { id: 'endpoints', title: 'Endpoints' },
      { id: 'models', title: 'Modelos' }
    ]
  },
  {
    id: 'tutorials',
    title: 'Tutoriales',
    icon: FileText,
    subsections: [
      { id: 'beginner', title: 'Principiante' },
      { id: 'intermediate', title: 'Intermedio' },
      { id: 'advanced', title: 'Avanzado' }
    ]
  },
  {
    id: 'faq',
    title: 'Preguntas Frecuentes',
    icon: HelpCircle,
    subsections: [
      { id: 'general', title: 'General' },
      { id: 'technical', title: 'Técnico' },
      { id: 'billing', title: 'Facturación' }
    ]
  },
  {
    id: 'release-notes',
    title: 'Notas de Versión',
    icon: GitBranch,
    subsections: [
      { id: 'latest', title: 'Última Versión' },
      { id: 'changelog', title: 'Historial de Cambios' },
      { id: 'roadmap', title: 'Roadmap' }
    ]
  }
]

const quickLinks = [
  { title: 'Guía de Instalación', href: '/documentacion/getting-started/installation' },
  { title: 'API Authentication', href: '/documentacion/api-reference/authentication' },
  { title: 'Ejemplos de Código', href: '/documentacion/tutorials/beginner' },
  { title: 'Preguntas Comunes', href: '/documentacion/faq/general' },
  { title: 'Últimas Actualizaciones', href: '/documentacion/release-notes/latest' }
]

const codeExample = `
import { PenguinAI } from '@penguin/ai'

// Inicializar el cliente
const ai = new PenguinAI({
  apiKey: 'tu-api-key'
})

// Crear un modelo de clasificación
const model = await ai.createModel({
  type: 'classification',
  data: trainingData,
  labels: categories
})

// Entrenar el modelo
await model.train({
  epochs: 100,
  batchSize: 32
})

// Hacer predicciones
const predictions = await model.predict(newData)
`

export default function DocumentationPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSection, setActiveSection] = useState('getting-started')
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeExample.trim())
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#020617]">
      {/* Barra de navegación superior */}
      <nav className="sticky top-0 z-50 bg-white/5 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="relative w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar en la documentación..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="https://github.com/example/penguin-ai"
                target="_blank"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar izquierdo */}
          <div className="col-span-3">
            <div className="sticky top-24 space-y-8">
              {sections.map((section) => (
                <div key={section.id}>
                  <button
                    onClick={() => setActiveSection(section.id)}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-2 rounded-lg
                      ${activeSection === section.id ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:text-white'}
                      transition-colors
                    `}
                  >
                    <section.icon className="h-5 w-5" />
                    <span className="font-medium">{section.title}</span>
                  </button>
                  {activeSection === section.id && (
                    <div className="mt-2 ml-9 space-y-2">
                      {section.subsections.map((subsection) => (
                        <Link
                          key={subsection.id}
                          href={`/documentacion/${section.id}/${subsection.id}`}
                          className="block text-sm text-gray-400 hover:text-white transition-colors py-1"
                        >
                          {subsection.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contenido principal */}
          <div className="col-span-6">
            <div className="prose prose-invert max-w-none">
              <div className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
                <Link href="/documentacion" className="hover:text-white transition-colors">
                  Documentación
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-white">Primeros Pasos</span>
              </div>

              <h1 className="text-4xl font-bold text-white mb-8">
                Documentación de Penguin AI
              </h1>

              <p className="text-lg text-gray-300 mb-8">
                Bienvenido a la documentación de Penguin AI. Aquí encontrarás todo lo que necesitas para comenzar a construir aplicaciones de IA increíbles.
              </p>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Ejemplo Rápido
                </h2>
                <div className="relative">
                  <pre className="bg-[#1a1a1a] rounded-lg p-4 overflow-x-auto">
                    <code className="text-sm text-gray-300">{codeExample}</code>
                  </pre>
                  <button
                    onClick={handleCopyCode}
                    className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <Copy className={`h-5 w-5 ${copiedCode ? 'text-green-400' : 'text-gray-400'}`} />
                  </button>
                </div>
              </div>

              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">
                    Características Principales
                  </h2>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 p-1">
                        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <ChevronRight className="h-4 w-4 text-blue-400" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-white">
                          Fácil de Usar
                        </h3>
                        <p className="text-gray-400">
                          API intuitiva diseñada para desarrolladores de todos los niveles.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 p-1">
                        <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <ChevronRight className="h-4 w-4 text-purple-400" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-white">
                          Alto Rendimiento
                        </h3>
                        <p className="text-gray-400">
                          Optimizado para manejar grandes volúmenes de datos y entrenamientos complejos.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 p-1">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <ChevronRight className="h-4 w-4 text-emerald-400" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-white">
                          Personalizable
                        </h3>
                        <p className="text-gray-400">
                          Amplia gama de opciones de configuración para adaptarse a tus necesidades.
                        </p>
                      </div>
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-white mb-4">
                    ¿Fue útil esta página?
                  </h2>
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                      <ThumbsUp className="h-5 w-5" />
                      <span>Sí</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                      <ThumbsDown className="h-5 w-5" />
                      <span>No</span>
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </div>

          {/* Sidebar derecho */}
          <div className="col-span-3">
            <div className="sticky top-24 space-y-8">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Enlaces Rápidos
                </h3>
                <ul className="space-y-2">
                  {quickLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botón "Volver arriba" */}
      {showBackToTop && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-colors"
        >
          <ArrowUp className="h-6 w-6" />
        </motion.button>
      )}
    </div>
  )
} 