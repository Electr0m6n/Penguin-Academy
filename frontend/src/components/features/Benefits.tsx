'use client'

import { Brain, Calculator, Users, Code, BookOpen, Trophy } from 'lucide-react'
import { motion } from 'framer-motion'

const benefits = [
  {
    title: 'Inteligencia Artificial',
    description: 'Aprende Machine Learning, Deep Learning y Neural Networks con proyectos prácticos.',
    icon: Brain,
  },
  {
    title: 'Matemáticas Aplicadas',
    description: 'Domina Cálculo, Álgebra Lineal y Estadística aplicada a la IA.',
    icon: Calculator,
  },
  {
    title: 'Comunidad Activa',
    description: 'Únete a una comunidad de estudiantes y profesionales apasionados por la IA.',
    icon: Users,
  },
  {
    title: 'Proyectos Reales',
    description: 'Desarrolla proyectos del mundo real usando las últimas tecnologías.',
    icon: Code,
  },
  {
    title: 'Recursos Completos',
    description: 'Accede a material didáctico, notebooks y datasets curados.',
    icon: BookOpen,
  },
  {
    title: 'Certificaciones',
    description: 'Obtén certificados reconocidos al completar los cursos.',
    icon: Trophy,
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export function Benefits() {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 relative">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center text-white mb-4"
        >
          ¿Por qué Penguin Academy?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xl text-gray-400 text-center mb-16 max-w-2xl mx-auto"
        >
          Nuestra plataforma está diseñada para convertirte en un experto en IA y matemáticas
        </motion.p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {benefits.map((benefit) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={benefit.title}
                variants={itemVariants}
                className="p-8 rounded-2xl bg-blue-600/5 border border-blue-500/10 hover:border-blue-500/30 transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-blue-600/10 flex items-center justify-center mb-6 group-hover:bg-blue-600/20 transition-colors">
                  <Icon className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  {benefit.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
} 