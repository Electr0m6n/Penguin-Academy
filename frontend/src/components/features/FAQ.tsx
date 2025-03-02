'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

const faqs = [
  {
    question: '¿Por qué aprender IA con nosotros?',
    answer: 'Ofrecemos una combinación única de teoría y práctica, con proyectos del mundo real y una comunidad activa de estudiantes y profesionales. Nuestros cursos están diseñados por expertos en la industria y se actualizan constantemente.'
  },
  {
    question: '¿Necesito conocimientos previos?',
    answer: 'No necesitas experiencia previa en IA. Nuestros cursos comienzan desde lo básico y progresan gradualmente. Sin embargo, es útil tener conocimientos básicos de programación y matemáticas.'
  },
  {
    question: '¿Cómo funcionan las clases?',
    answer: 'Las clases son 100% online y a tu ritmo. Incluyen videos, ejercicios interactivos, proyectos prácticos y acceso a mentores. También organizamos sesiones en vivo y workshops regularmente.'
  },
  {
    question: '¿Qué certificación obtendré?',
    answer: 'Al completar cada curso, recibirás un certificado digital verificable que puedes compartir en LinkedIn y otras plataformas profesionales. Nuestros certificados son reconocidos por empresas líderes en tecnología.'
  },
  {
    question: '¿Hay soporte disponible?',
    answer: 'Sí, ofrecemos soporte 24/7 a través de nuestra comunidad y mentores. Además, tenemos sesiones de mentoría personalizadas y foros de discusión para resolver dudas.'
  }
]

export function FAQ() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-200 to-white mb-6">
            Preguntas Frecuentes
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="mb-4"
            >
              <button
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="w-full text-left bg-[#1a2236] p-6 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors hover:bg-[#1e293f]"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 text-blue-400 transition-transform duration-200 ${
                      expandedIndex === index ? 'transform rotate-180' : ''
                    }`}
                  />
                </div>

                <AnimatePresence>
                  {expandedIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-4 text-gray-400 leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
    </section>
  )
} 