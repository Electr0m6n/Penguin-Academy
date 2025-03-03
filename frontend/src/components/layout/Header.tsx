'use client'

import Link from 'next/link'
import { Menu, X, Brain, Sparkles, Users, BookOpen, Terminal } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { createClient, User } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

const navigation = [
  { 
    name: 'Cursos IA', 
    href: '/cursos', 
    icon: Brain, 
    gradient: 'from-red-500 to-rose-500'
  },
  { 
    name: 'Proyectos', 
    href: '/proyectos', 
    icon: Terminal, 
    gradient: 'from-violet-500 to-purple-500'
  },
  { 
    name: 'Recursos', 
    href: '/recursos', 
    icon: BookOpen, 
    gradient: 'from-emerald-500 to-green-500'
  },
  { 
    name: 'Comunidad', 
    href: '/comunidad', 
    icon: Users, 
    gradient: 'from-blue-500 to-cyan-500'
  },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const checkScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUser(session.user)
        console.log('Usuario autenticado:', session.user)
      } else {
        console.log('No hay sesión activa')
      }
    }

    if (typeof window !== 'undefined') {
      checkScroll()
      fetchSession()
      window.addEventListener('scroll', checkScroll)
      return () => window.removeEventListener('scroll', checkScroll)
    }
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${isScrolled ? 'bg-black/20 backdrop-blur-md' : 'bg-transparent'}`}>
      <nav className="border-b border-white/5 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-2 sm:p-3 lg:px-6">
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-1.5 sm:gap-2 group">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
              <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                Penguin Academy
              </span>
            </Link>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2 sm:p-2.5 text-white/80 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Abrir menú principal</span>
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center gap-1.5 text-sm font-semibold leading-6 text-white/80 hover:text-white relative py-1.5 transition-all duration-300"
              >
                <div className={`
                  p-2 rounded-lg bg-gradient-to-r ${item.gradient} opacity-0
                  transition-all duration-300 absolute inset-0 -z-10
                  group-hover:opacity-10
                `} />
                <item.icon className={`
                  h-4 w-4 bg-gradient-to-r ${item.gradient} [&>path]:fill-white/0 [&>path]:stroke-white/80
                  group-hover:[&>path]:stroke-white transition-all duration-300 transform group-hover:scale-110
                `} />
                <span className="relative">
                  {item.name}
                  <span className={`
                    absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r ${item.gradient}
                    group-hover:w-full transition-all duration-300
                  `}></span>
                </span>
              </Link>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
            {user ? (
              <Link
                href="/perfil"
                className="group relative px-4 py-2 text-sm font-semibold text-white/80 hover:text-white transition-colors"
              >
                <span className="relative">Perfil</span>
              </Link>
            ) : (
              <>  
                <Link
                  href="/registro"
                  className="group relative px-4 py-2 text-sm font-semibold text-white/80 hover:text-white transition-colors"
                >
                  <span className="relative">Registro</span>
                </Link>
                <Link
                  href="/login"
                  className="rounded-full px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-emerald-600 hover:via-emerald-500 hover:to-teal-500 transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                >
                  Iniciar Sesión
                </Link>
              </>
            )}
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div 
              className="fixed inset-0 bg-black/70 backdrop-blur-xl" 
              onClick={() => setMobileMenuOpen(false)} 
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-[280px] bg-black/40 backdrop-blur-2xl px-4 py-4 sm:py-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-1.5 sm:gap-2 group" onClick={() => setMobileMenuOpen(false)}>
                  <Sparkles className="h-5 w-5 sm:h-7 sm:w-7 text-blue-500 group-hover:text-blue-400 transition-all duration-300" />
                  <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                    Penguin Academy
                  </span>
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2 sm:p-2.5 text-white/90 hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Cerrar menú</span>
                  <X className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                </button>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flow-root"
              >
                <div className="space-y-0.5 py-4 sm:py-6">
                  {navigation.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        className="group flex items-center gap-3 rounded-lg px-3 py-2 sm:py-2.5 text-[15px] font-medium leading-6 text-white/90 hover:text-white bg-white/5 hover:bg-white/10 transition-all duration-300"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <item.icon className={`h-4 w-4 sm:h-5 sm:w-5 bg-gradient-to-r ${item.gradient} [&>path]:fill-white/0 [&>path]:stroke-white transition-all duration-300`} />
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <div className="space-y-2 pt-4">
                  <Link
                    href="/registro"
                    className="block w-full px-3 py-2 sm:py-2.5 text-center text-[15px] font-medium rounded-lg bg-white/10 text-white hover:bg-white/15 transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Registro
                  </Link>
                  <Link
                    href="/login"
                    className="block w-full px-3 py-2 sm:py-2.5 text-center text-[15px] font-medium rounded-lg bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white hover:from-emerald-600 hover:via-emerald-500 hover:to-teal-500 transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </nav>
    </header>
  )
} 