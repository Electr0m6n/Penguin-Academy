'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Github, AlertCircle, User, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>
  onPasswordRecovery: (email: string) => Promise<void>
  onGoogleLogin: () => Promise<void>
  onGithubLogin: () => Promise<void>
  errorMessage?: string | null;
  successMessage?: string | null;
}

export function LoginForm({ 
  onSubmit, 
  onPasswordRecovery, 
  onGoogleLogin, 
  onGithubLogin, 
  errorMessage, 
  successMessage 
}: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return

    try {
      setIsLoading(true)
      await onSubmit(email, password)
    } catch {
      // Handle error
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordRecovery = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (isLoading) return

    try {
      setIsLoading(true)
      await onPasswordRecovery(email)
    } catch {
      // Handle error
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    if (isLoading) return
    try {
      setIsLoading(true)
      await onGoogleLogin()
    } catch {
      // Handle Google login error
    } finally {
      setIsLoading(false)
    }
  }

  const handleGithubLogin = async () => {
    if (isLoading) return
    try {
      setIsLoading(true)
      await onGithubLogin()
    } catch {
      // Handle GitHub login error
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
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 opacity-10 blur-xl" />

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
                Iniciar Sesión
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                ¿No tienes una cuenta?{' '}
                <Link href="/registro" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Regístrate
                </Link>
              </p>
            </div>

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-3 text-green-400"
              >
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">{successMessage}</p>
              </motion.div>
            )}

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
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">Correo o nombre de usuario</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-lg py-2 pl-10 pr-3 bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all"
                    placeholder="Tu correo o nombre de usuario"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-lg py-2 pl-10 pr-3 bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-white/10 bg-white/5 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                    Recordarme
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handlePasswordRecovery}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`
                  w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white
                  bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500
                  hover:from-blue-500 hover:via-blue-400 hover:to-cyan-400
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20
                  transition-all duration-300 transform hover:scale-[1.02]
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                `}
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 text-gray-400 bg-[#020617]">O continúa con</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
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
                  onClick={handleGithubLogin}
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