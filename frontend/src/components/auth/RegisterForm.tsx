'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, Github, AlertCircle, User } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface RegisterFormProps {
  onSubmit: (name: string, email: string, password: string) => Promise<void>
  onGoogleRegister: () => Promise<void>
  onGithubRegister: () => Promise<void>
  errorMessage?: string | null;
}

export function RegisterForm({ onSubmit, onGoogleRegister, onGithubRegister, errorMessage }: RegisterFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return

    try {
      setIsLoading(true)
      await onSubmit(name, email, password)
    } catch {
      // No need to set error message here, as it's handled by the component
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
    if (isLoading) return
    try {
      setIsLoading(true)
      await onGoogleRegister()
    } catch {
      // No need to set error message here, as it's handled by the component
    } finally {
      setIsLoading(false)
    }
  }

  const handleGithubRegister = async () => {
    if (isLoading) return
    try {
      setIsLoading(true)
      await onGithubRegister()
    } catch {
      // No need to set error message here, as it's handled by the component
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Fondo decorativo */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 opacity-10 blur-xl" />

          <div className="relative rounded-2xl bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <Link href="/" className="inline-block">
                <Image
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
                  alt="Logo"
                  width={48}
                  height={48}
                  className="mx-auto mb-4"
                />
              </Link>
              <h2 className="text-3xl font-bold tracking-tight text-white">
                Crear Cuenta
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                ¿Ya tienes una cuenta?{' '}
                <Link href="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                  Inicia Sesión
                </Link>
              </p>
            </div>

            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400"
              >
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">{errorMessage}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre de usuario
                </label>
                <div className="relative">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full rounded-lg py-2 pl-10 pr-3 bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-20 transition-all"
                    placeholder="Tu nombre de usuario"
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Correo electrónico
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-lg py-2 pl-10 pr-3 bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-20 transition-all"
                    placeholder="tu@email.com"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-lg py-2 pl-10 pr-3 bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-20 transition-all"
                    placeholder="••••••••"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`
                  w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white
                  bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500
                  hover:from-emerald-500 hover:via-emerald-400 hover:to-teal-400
                  focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-20
                  transition-all duration-300 transform hover:scale-[1.02]
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                `}
              >
                {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 text-gray-400 bg-[#020617]">O regístrate con</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={handleGoogleRegister}
                  disabled={isLoading}
                  className={`
                    flex items-center justify-center gap-2 rounded-lg px-4 py-2.5
                    bg-white/5 hover:bg-white/10 border border-white/10
                    text-sm font-medium text-white
                    transition-all duration-300 transform hover:scale-[1.02]
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                  `}
                >
                  <Image
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                    alt="Google"
                    width={20}
                    height={20}
                  />
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={handleGithubRegister}
                  disabled={isLoading}
                  className={`
                    flex items-center justify-center gap-2 rounded-lg px-4 py-2.5
                    bg-white/5 hover:bg-white/10 border border-white/10
                    text-sm font-medium text-white
                    transition-all duration-300 transform hover:scale-[1.02]
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                  `}
                >
                  <Github className="h-5 w-5" />
                  <span>GitHub</span>
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}