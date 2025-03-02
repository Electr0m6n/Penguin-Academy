'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Terminal, Package, Container, Copy, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const installationMethods = [
  {
    id: 'npm',
    title: 'NPM',
    icon: Package,
    command: 'npm install @penguin/ai',
    description: 'Instala Penguin AI usando npm, el gestor de paquetes de Node.js.'
  },
  {
    id: 'pip',
    title: 'PIP',
    icon: Terminal,
    command: 'pip install penguin-ai',
    description: 'Instala Penguin AI usando pip, el gestor de paquetes de Python.'
  },
  {
    id: 'docker',
    title: 'Docker',
    icon: Container,
    command: 'docker pull penguinai/penguin-ai:latest',
    description: 'Usa nuestra imagen oficial de Docker para comenzar rápidamente.'
  }
]

export default function InstallationPage() {
  const [copiedMethod, setCopiedMethod] = React.useState<string | null>(null)

  const handleCopyCommand = (method: string, command: string) => {
    navigator.clipboard.writeText(command)
    setCopiedMethod(method)
    setTimeout(() => setCopiedMethod(null), 2000)
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
          <Link href="/documentacion" className="hover:text-white transition-colors">
            Documentación
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/documentacion/getting-started" className="hover:text-white transition-colors">
            Primeros Pasos
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-white">Instalación</span>
        </div>

        {/* Installation Methods */}
        <div className="space-y-8">
          {installationMethods.map((method, index) => (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-xl p-6"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mr-4">
                  <method.icon className="h-6 w-6 text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">
                  Instalación con {method.title}
                </h2>
              </div>

              <p className="text-gray-400 mb-4">
                {method.description}
              </p>

              <div className="relative">
                <pre className="bg-[#1a1a1a] rounded-lg p-4 overflow-x-auto">
                  <code className="text-sm text-gray-300">
                    {method.command}
                  </code>
                </pre>
                <button
                  onClick={() => handleCopyCommand(method.id, method.command)}
                  className="absolute top-3 right-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <Copy 
                    className={`h-5 w-5 ${copiedMethod === method.id ? 'text-green-400' : 'text-gray-400'}`}
                  />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Requisitos del Sistema */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-semibold text-white mb-6">
            Requisitos del Sistema
          </h2>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start">
                <ChevronRight className="h-5 w-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <span className="font-medium text-white">Node.js:</span> v16.0.0 o superior
                </div>
              </li>
              <li className="flex items-start">
                <ChevronRight className="h-5 w-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <span className="font-medium text-white">Python:</span> 3.8 o superior
                </div>
              </li>
              <li className="flex items-start">
                <ChevronRight className="h-5 w-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <span className="font-medium text-white">Docker:</span> 20.10.0 o superior (si usas Docker)
                </div>
              </li>
              <li className="flex items-start">
                <ChevronRight className="h-5 w-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <span className="font-medium text-white">RAM:</span> Mínimo 4GB, recomendado 8GB o más
                </div>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Siguientes Pasos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-semibold text-white mb-6">
            Siguientes Pasos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/documentacion/getting-started/quickstart"
              className="block group"
            >
              <div className="h-full bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Guía Rápida
                </h3>
                <p className="text-gray-400">
                  Aprende los conceptos básicos y crea tu primer modelo de IA.
                </p>
              </div>
            </Link>
            <Link
              href="/documentacion/api-reference/authentication"
              className="block group"
            >
              <div className="h-full bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Autenticación
                </h3>
                <p className="text-gray-400">
                  Configura tu API key y comienza a usar Penguin AI.
                </p>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 