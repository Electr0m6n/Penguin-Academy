'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Search } from 'lucide-react'
import Link from 'next/link'

const faqs = [
  {
    category: 'General',
    questions: [
      {
        question: '¿Qué es Penguin AI?',
        answer: 'Penguin AI es una plataforma de inteligencia artificial que permite a desarrolladores y empresas crear, entrenar y desplegar modelos de IA de manera sencilla. Ofrecemos herramientas para procesamiento de lenguaje natural, visión por computadora y análisis predictivo.'
      },
      {
        question: '¿Necesito conocimientos avanzados de IA?',
        answer: 'No, Penguin AI está diseñado para ser accesible tanto para principiantes como para expertos. Nuestra API y documentación están pensadas para que puedas comenzar rápidamente, incluso si eres nuevo en IA.'
      },
      {
        question: '¿Puedo usar Penguin AI en producción?',
        answer: 'Sí, Penguin AI está diseñado para uso en producción con alta disponibilidad y escalabilidad. Ofrecemos diferentes niveles de servicio según tus necesidades, incluyendo soporte empresarial.'
      }
    ]
  },
  {
    category: 'Precios y Planes',
    questions: [
      {
        question: '¿Cuánto cuesta usar Penguin AI?',
        answer: 'Ofrecemos varios planes, incluyendo uno gratuito para comenzar. Los precios varían según el uso y las características necesarias. Consulta nuestra página de precios para más detalles.'
      },
      {
        question: '¿Hay período de prueba?',
        answer: 'Sí, ofrecemos un período de prueba gratuito de 14 días en nuestros planes pagos, con acceso completo a todas las características.'
      },
      {
        question: '¿Puedo cambiar de plan en cualquier momento?',
        answer: 'Sí, puedes actualizar o cambiar tu plan en cualquier momento. Los cambios se aplican inmediatamente y se ajusta la facturación de manera proporcional.'
      }
    ]
  },
  {
    category: 'Soporte',
    questions: [
      {
        question: '¿Cómo puedo obtener ayuda?',
        answer: 'Ofrecemos múltiples canales de soporte: documentación detallada, foros de la comunidad, chat en vivo para planes pagos, y soporte por correo electrónico. Los planes empresariales incluyen soporte técnico dedicado.'
      },
      {
        question: '¿Cuál es el tiempo de respuesta del soporte?',
        answer: 'El tiempo de respuesta varía según el plan: \n• Gratuito: 48 horas (días hábiles)\n• Pro: 24 horas\n• Empresa: 4 horas con soporte 24/7'
      }
    ]
  },
  {
    category: 'Seguridad y Privacidad',
    questions: [
      {
        question: '¿Cómo protegen mis datos?',
        answer: 'Implementamos múltiples capas de seguridad: cifrado de datos en reposo y en tránsito, autenticación de dos factores, auditorías regulares de seguridad, y cumplimiento con estándares como SOC 2 y GDPR.'
      },
      {
        question: '¿Dónde se almacenan los datos?',
        answer: 'Los datos se almacenan en centros de datos seguros con certificación ISO 27001. Ofrecemos opciones de región para cumplir con requisitos de residencia de datos.'
      }
    ]
  }
]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [expandedQuestions, setExpandedQuestions] = React.useState<Set<string>>(new Set())

  const toggleQuestion = (question: string) => {
    const newExpanded = new Set(expandedQuestions)
    if (newExpanded.has(question)) {
      newExpanded.delete(question)
    } else {
      newExpanded.add(question)
    }
    setExpandedQuestions(newExpanded)
  }

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
          <Link href="/documentacion" className="hover:text-white transition-colors">
            Documentación
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/documentacion/faq" className="hover:text-white transition-colors">
            FAQ
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-white">General</span>
        </div>

        {/* Header */}
        {/* Eliminado Header */}

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar en las preguntas frecuentes..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </motion.div>

        {/* FAQ Categories */}
        <div className="space-y-12">
          {filteredFaqs.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * categoryIndex }}
            >
              <h2 className="text-2xl font-semibold text-white mb-6">
                {category.category}
              </h2>
              <div className="space-y-4">
                {category.questions.map((item) => (
                  <div
                    key={item.question}
                    className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => toggleQuestion(item.question)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
                    >
                      <span className="text-lg font-medium text-white">
                        {item.question}
                      </span>
                      <ChevronRight
                        className={`
                          h-5 w-5 text-gray-400 transform transition-transform
                          ${expandedQuestions.has(item.question) ? 'rotate-90' : ''}
                        `}
                      />
                    </button>
                    
                    {expandedQuestions.has(item.question) && (
                      <div className="px-6 pb-6 text-gray-300 whitespace-pre-line">
                        {item.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {searchQuery && filteredFaqs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-400">
              No se encontraron resultados para &quot;{searchQuery}&quot;
            </p>
          </motion.div>
        )}

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16"
        >
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/20 rounded-xl p-8 text-center">
            <h3 className="text-xl font-semibold text-white mb-4">
              ¿No encontraste lo que buscabas?
            </h3>
            <p className="text-gray-300 mb-6">
              Nuestro equipo de soporte está aquí para ayudarte.
            </p>
            <Link
              href="/soporte"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              Contactar Soporte
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}