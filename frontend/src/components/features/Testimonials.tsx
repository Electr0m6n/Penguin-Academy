'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import Image from 'next/image'
import { CSSProperties } from 'react'

const testimonials = [
  {
    content: "Los cursos de IA son excepcionales. La combinación de teoría y práctica me ayudó a conseguir mi primer trabajo como Data Scientist.",
    author: {
      name: 'Ana García',
      role: 'Data Scientist @ Google',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&h=400&q=80',
    },
    rating: 5,
    gradient: 'from-blue-600 via-blue-500 to-cyan-500'
  },
  {
    content: "La comunidad es increíble. Siempre hay alguien dispuesto a ayudar y los proyectos prácticos son muy relevantes para la industria actual.",
    author: {
      name: 'Carlos Rodríguez',
      role: 'ML Engineer @ Amazon',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80',
    },
    rating: 5,
    gradient: 'from-purple-600 via-purple-500 to-fuchsia-500'
  },
  {
    content: "La ruta de aprendizaje está muy bien estructurada. Pasé de no saber nada de IA a conseguir un trabajo en menos de un año.",
    author: {
      name: 'María Sánchez',
      role: 'AI Developer @ Microsoft',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&h=400&q=80',
    },
    rating: 5,
    gradient: 'from-emerald-600 via-green-500 to-teal-500'
  },
]

const gradientStyle = {
  '--tw-gradient-from': '#2563eb',
  '--tw-gradient-to': '#0891b2',
  '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-to)',
} as CSSProperties

export function Testimonials() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Nuestros Estudiantes
          </h2>
        </motion.div>

        <div className="mx-auto grid max-w-lg grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="group relative rounded-2xl bg-white/5 p-8 hover:bg-white/10 transition-all duration-300">
                <div 
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r opacity-10 transition-opacity duration-300 group-hover:opacity-20" 
                  style={gradientStyle}
                />
                
                <div className="relative">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden group-hover:scale-110 transition-transform duration-300">
                      <Image
                        src={testimonial.author.image}
                        alt={testimonial.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-white group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-cyan-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                        {testimonial.author.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {testimonial.author.role}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-500 fill-yellow-500"
                      />
                    ))}
                  </div>

                  <blockquote className="text-lg text-gray-300 leading-relaxed">
                    &ldquo;{testimonial.content}&rdquo;
                  </blockquote>

                  <div className="absolute -bottom-1 left-8 right-8 h-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Elementos decorativos */}
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 -left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
    </section>
  )
} 