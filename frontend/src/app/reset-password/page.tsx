'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Lock, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@supabase/supabase-js'
import { AuthBackground } from '@/components/auth/AuthBackground'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [hash, setHash] = useState<string | null>(null)

  useEffect(() => {
    // Obtener el hash de la URL
    const hashFromUrl = window.location.hash.substring(1)
    if (hashFromUrl) {
      setHash(hashFromUrl)
    }

    // Temporizador para limpiar mensajes de error
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [errorMessage])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!password || !confirmPassword) {
      setErrorMessage('Por favor, completa todos los campos.')
      return
    }

    if (password.length < 8) {
      setErrorMessage('La contraseña debe tener al menos 8 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.')
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        console.error('Error al restablecer la contraseña:', error.message)
        setErrorMessage('Error al restablecer la contraseña. Por favor, solicita un nuevo enlace de restablecimiento.')
      } else {
        setSuccessMessage('Contraseña restablecida exitosamente. Redirigiendo a la página de inicio de sesión...')
        
        // Redirigir a la página de inicio de sesión después de 3 segundos
        setTimeout(() => {
          window.location.href = '/login'
        }, 3000)
      }
    } catch (error) {
      console.error('Error inesperado:', error)
      setErrorMessage('Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main>
      <AuthBackground />
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
                  Restablecer Contraseña
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                  Ingresa tu nueva contraseña para continuar
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

              {!hash ? (
                <div className="text-center p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                  <p className="text-sm">El enlace de restablecimiento no es válido o ha expirado. Por favor, solicita un nuevo enlace de restablecimiento.</p>
                  <Link href="/login" className="mt-4 inline-block text-blue-400 hover:text-blue-300 transition-colors">
                    Volver a inicio de sesión
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Nueva contraseña</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
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
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showPassword ? 'Ocultar' : 'Mostrar'}
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">La contraseña debe tener al menos 8 caracteres</p>
                  </div>

                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300 mb-2">Confirmar contraseña</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="confirm-password"
                        name="confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="block w-full rounded-lg py-2 pl-10 pr-3 bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-20 transition-all"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
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
                    {isLoading ? 'Restableciendo...' : 'Restablecer Contraseña'}
                  </button>

                  <div className="text-center mt-4">
                    <Link href="/login" className="text-sm text-gray-400 hover:text-gray-300 transition-colors">
                      Volver a inicio de sesión
                    </Link>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
} 