'use client'

import { motion } from 'framer-motion'

export default function ProblemasPage() {
  return (
    <div className="relative isolate min-h-screen bg-black">
      {/* Fondo con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-purple-950/20 z-0" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl lg:max-w-4xl"
        >
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl text-center">
            Problemas de IA
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300 text-center">
            Explora nuestra colección de problemas y desafíos de inteligencia artificial para poner a prueba tus habilidades.
          </p>
          
          <div className="mt-16 space-y-8">
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-white">Próximamente</h2>
              <p className="mt-2 text-gray-400">
                Estamos preparando una serie de problemas interesantes para que puedas practicar tus habilidades en IA. ¡Vuelve pronto!
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 