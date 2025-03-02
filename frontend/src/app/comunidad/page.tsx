'use client'

import { motion } from 'framer-motion'
import { Users, MessageCircle, Code, Trophy, Brain } from 'lucide-react' // Sparkles removido
import Image from 'next/image'
import Link from 'next/link'

const features = [
  {
    name: 'Foros de Discusión',
    description: 'Participa en conversaciones sobre IA, comparte conocimientos y resuelve dudas con otros estudiantes.',
    icon: MessageCircle,
    href: '/comunidad/foros',
    gradient: 'from-blue-600 via-blue-500 to-cyan-500',
    shadowColor: 'shadow-blue-500/20'
  },
  {
    name: 'Proyectos Colaborativos',
    description: 'Únete a proyectos de código abierto, comparte tus propios proyectos y colabora con otros desarrolladores.',
    icon: Code,
    href: '/comunidad/proyectos',
    gradient: 'from-violet-600 via-violet-500 to-purple-500',
    shadowColor: 'shadow-violet-500/20'
  },
  {
    name: 'Grupos de Estudio',
    description: 'Forma parte de grupos de estudio especializados en diferentes áreas de la IA y el aprendizaje automático.',
    icon: Users,
    href: '/comunidad/grupos',
    gradient: 'from-emerald-600 via-emerald-500 to-teal-500',
    shadowColor: 'shadow-emerald-500/20'
  },
  {
    name: 'Desafíos y Competencias',
    description: 'Participa en desafíos semanales y competencias para poner a prueba tus habilidades.',
    icon: Trophy,
    href: '/comunidad/desafios',
    gradient: 'from-amber-600 via-amber-500 to-yellow-500',
    shadowColor: 'shadow-amber-500/20'
  }
]

const testimonials = [
  {
    content: 'La comunidad me ha ayudado enormemente en mi aprendizaje. Los foros y grupos de estudio son increíbles.',
    author: {
      name: 'María González',
      role: 'Estudiante de Machine Learning',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200'
    }
  },
  {
    content: 'Los proyectos colaborativos me han permitido ganar experiencia práctica y construir un portafolio sólido.',
    author: {
      name: 'Carlos Rodríguez',
      role: 'Desarrollador IA',
      image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=200&h=200'
    }
  },
  {
    content: 'Los desafíos semanales son una excelente manera de mantenerse motivado y aprender nuevas técnicas.',
    author: {
      name: 'Ana Martínez',
      role: 'Data Scientist',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&h=200'
    }
  }
]

const stats = [
  { name: 'Miembros activos', value: '10,000+' },
  { name: 'Proyectos compartidos', value: '500+' },
  { name: 'Grupos de estudio', value: '100+' },
  { name: 'Países representados', value: '50+' }
]

export default function CommunityPage() {
  return (
    <main className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-blue-950/50 to-[#020617]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                Únete a nuestra{' '}
                <span className="bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500 text-transparent bg-clip-text">
                  Comunidad de IA
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Conecta con otros estudiantes y profesionales, comparte conocimientos y crece juntos en el mundo de la Inteligencia Artificial.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-10"
            >
              <Link
                href="/registro"
                className="inline-flex items-center px-6 py-3 rounded-lg text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 transform hover:scale-[1.02] transition-all duration-200"
              >
                <Users className="w-5 h-5 mr-2" />
                Únete Ahora
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Todo lo que necesitas para crecer
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Nuestra comunidad ofrece todas las herramientas y recursos necesarios para tu desarrollo profesional en IA.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  href={feature.href}
                  className={`
                    block p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm
                    hover:bg-white/10 transition-all duration-200 group
                    ${feature.shadowColor} hover:shadow-2xl
                  `}
                >
                  <div className={`
                    w-12 h-12 rounded-lg flex items-center justify-center mb-4
                    bg-gradient-to-r ${feature.gradient}
                  `}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.name}
                  </h3>
                  <p className="text-gray-400">
                    {feature.description}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </p>
                <p className="text-gray-400">
                  {stat.name}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Lo que dicen nuestros miembros
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Descubre cómo nuestra comunidad está ayudando a otros a alcanzar sus metas en IA.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 border border-white/10 rounded-2xl p-8"
              >
                <p className="text-gray-300 mb-6">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="flex items-center">
                  <Image
                    src={testimonial.author.image}
                    alt={testimonial.author.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div className="ml-4">
                    <p className="text-white font-semibold">
                      {testimonial.author.name}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {testimonial.author.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              ¿Listo para comenzar?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-10">
              Únete a nuestra comunidad y comienza tu viaje en el mundo de la Inteligencia Artificial.
            </p>
            <Link
              href="/registro"
              className="inline-flex items-center px-8 py-4 rounded-lg text-lg font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 transform hover:scale-[1.02] transition-all duration-200"
            >
              <Brain className="w-5 h-5 mr-2" />
              Comienza tu Viaje
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  )
}