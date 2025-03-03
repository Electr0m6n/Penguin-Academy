'use client'

import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { RotatingCube } from './RotatingCube'

export function Hero() {
  const scrollToFeatures = () => {
    const featuresSection = document.querySelector('#features')
    featuresSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="relative min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-64px)] flex flex-col items-center justify-center overflow-hidden">
      {/* Cubo rotativo */}
      <div className="absolute inset-x-0 -top-28 flex items-start justify-center pointer-events-none cube-container">
        <div className="relative w-[650px] h-[650px]">
          <RotatingCube className="w-full h-full opacity-90" position="center" />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 sm:mb-8 tracking-tight">
            <span className="inline-block">
              Domina la{' '}
              <span className="relative">
                Inteligencia
                <span className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 opacity-20 blur-lg"></span>
              </span>
            </span>
            {' '}
            <span className="relative inline-block mt-2 sm:mt-0">
              Artificial
              <span className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 opacity-20 blur-lg"></span>
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-3xl mx-auto px-4">
            Aprende a crear el futuro con IA. Desde principiantes hasta expertos, te guiamos en cada paso del camino.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <Link
              href="/cursos"
              className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white hover:from-emerald-600 hover:via-emerald-500 hover:to-teal-500 transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
            >
              Comienza tu Viaje
              <motion.span
                className="ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Elementos decorativos - solo visibles en desktop */}
      <div className="absolute inset-0 hidden md:block">
        {/* <div className="absolute inset-0 stars-pattern bg-[url('/patterns/stars.svg')] bg-repeat opacity-10 animate-twinkle"></div> */}
      </div>

      {/* Gradiente de fondo */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40 pointer-events-none" />
      <div className="absolute top-0 right-0 w-screen h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent" />

      {/* Flecha de scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 cursor-pointer z-20 flex flex-col items-center gap-2"
        onClick={scrollToFeatures}
      >
        <span className="text-sm font-medium text-white/80">Descubre más</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="bg-white/10 rounded-full p-2 backdrop-blur-sm"
        >
          <ChevronDown className="w-6 h-6 text-white/80" />
        </motion.div>
      </motion.div>
    </div>
  )
} 