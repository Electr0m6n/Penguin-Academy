'use client'

import { motion } from 'framer-motion'
import { Brain, Calculator, Users, Code, BookOpen, Trophy, Rocket, Star, Zap } from 'lucide-react'
import Link from 'next/link'

const features = [
  {
    name: 'Inteligencia Artificial',
    description: 'Aprende Machine Learning, Deep Learning y Neural Networks con proyectos prácticos.',
    href: '/cursos/ia',
    icon: Brain,
    gradient: 'from-red-600 via-red-500 to-rose-500',
    shadowColor: 'rgba(239, 68, 68, 0.5)',
    delay: 0.1
  },
  {
    name: 'Matemáticas Aplicadas',
    description: 'Domina Cálculo, Álgebra Lineal y Estadística aplicada a la IA.',
    href: '/cursos/matematicas',
    icon: Calculator,
    gradient: 'from-emerald-600 via-green-500 to-teal-500',
    shadowColor: 'rgba(16, 185, 129, 0.5)',
    delay: 0.2
  },
  {
    name: 'Comunidad Activa',
    description: 'Únete a una comunidad de estudiantes y profesionales apasionados por la IA.',
    href: '/comunidad',
    icon: Users,
    gradient: 'from-blue-600 via-blue-500 to-cyan-500',
    shadowColor: 'rgba(37, 99, 235, 0.5)',
    delay: 0.3
  },
  {
    name: 'Proyectos Reales',
    description: 'Desarrolla proyectos del mundo real usando las últimas tecnologías.',
    href: '/proyectos',
    icon: Code,
    gradient: 'from-violet-600 via-purple-500 to-fuchsia-500',
    shadowColor: 'rgba(147, 51, 234, 0.5)',
    delay: 0.4
  },
  {
    name: 'Recursos Completos',
    description: 'Accede a material didáctico, notebooks y datasets curados.',
    href: '/recursos',
    icon: BookOpen,
    gradient: 'from-red-600 via-orange-500 to-amber-500',
    shadowColor: 'rgba(245, 158, 11, 0.5)',
    delay: 0.5
  },
  {
    name: 'Certificaciones',
    description: 'Obtén certificados reconocidos al completar los cursos.',
    href: '/certificaciones',
    icon: Trophy,
    gradient: 'from-emerald-600 via-green-500 to-lime-500',
    shadowColor: 'rgba(16, 185, 129, 0.5)',
    delay: 0.6
  },
]

const stats = [
  { icon: Rocket, value: '100+', label: 'Proyectos Prácticos', gradient: 'from-red-500 to-rose-500' },
  { icon: Star, value: '50+', label: 'Ejercicios Interactivos', gradient: 'from-emerald-500 to-green-500' },
  { icon: Users, value: '1000+', label: 'Estudiantes Activos', gradient: 'from-blue-500 to-cyan-500' },
  { icon: Zap, value: '24/7', label: 'Soporte Dedicado', gradient: 'from-violet-500 to-purple-500' },
]

export function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Todo lo que necesitas para dominar la IA
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Nuestra plataforma te ofrece todas las herramientas y recursos necesarios para convertirte en un experto en Inteligencia Artificial.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-lg grid-cols-1 gap-8 sm:max-w-xl sm:gap-x-8 sm:gap-y-10 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {features.map((feature) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: feature.delay }}
            >
              <Link
                href={feature.href}
                className="relative flex flex-col gap-6 p-6 group"
              >
                <div className={`
                  absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-0 
                  transition-all duration-300 group-hover:opacity-10
                `} />
                <div className={`
                  absolute inset-0 rounded-2xl border border-white/10 bg-white/5
                  transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/10
                `} />
                <div className="relative flex items-center gap-4">
                  <div className={`
                    rounded-xl bg-gradient-to-r ${feature.gradient} p-3.5
                    shadow-[0_0_30px_rgba(0,0,0,0.2)] group-hover:shadow-[0_0_30px_${feature.shadowColor}]
                    transition-all duration-300 scale-100 group-hover:scale-110
                  `}>
                    <feature.icon className="h-7 w-7 text-white" aria-hidden="true" />
                  </div>
                  <h3 className={`
                    text-xl font-semibold leading-7 tracking-tight text-white
                    group-hover:bg-gradient-to-r ${feature.gradient} group-hover:bg-clip-text
                    transition-all duration-300
                  `}>
                    {feature.name}
                  </h3>
                </div>
                <p className="relative text-base leading-7 text-gray-300">
                  {feature.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="relative group"
            >
              <div className={`
                relative p-6 rounded-2xl bg-white/5 border border-white/10
                group-hover:bg-white/10 group-hover:border-white/20
                transition-all duration-300
              `}>
                <div className={`
                  flex justify-center mb-4 rounded-xl bg-gradient-to-r ${stat.gradient}
                  p-3 scale-100 group-hover:scale-110 transition-all duration-300
                `}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white text-center mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400 text-center">
                  {stat.label}
                </div>
              </div>
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