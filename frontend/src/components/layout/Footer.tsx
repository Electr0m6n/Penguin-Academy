'use client'

import Link from 'next/link'
import { Github, Twitter, Linkedin, Instagram } from 'lucide-react'

export function Footer() {
  return (
    <footer className="relative">
      <div className="mx-auto max-w-7xl px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1">
          <Link href="/" className="text-xl font-bold text-white">
            Penguin Academy
          </Link>
          <p className="mt-2 text-sm text-gray-400">
            Transformando el futuro a través de la educación en Inteligencia Artificial.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Enlaces</h3>
          <ul className="mt-4 space-y-2">
            <li>
              <Link href="/sobre-nosotros" className="text-sm text-gray-400 hover:text-white transition-colors">
                Sobre Nosotros
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-sm text-gray-400 hover:text-white transition-colors">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/cursos" className="text-sm text-gray-400 hover:text-white transition-colors">
                Cursos
              </Link>
            </li>
            <li>
              <Link href="/contacto" className="text-sm text-gray-400 hover:text-white transition-colors">
                Contacto
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Legal</h3>
          <ul className="mt-4 space-y-2">
            <li>
              <Link href="/privacidad" className="text-sm text-gray-400 hover:text-white transition-colors">
                Política de Privacidad
              </Link>
            </li>
            <li>
              <Link href="/terminos" className="text-sm text-gray-400 hover:text-white transition-colors">
                Términos y Condiciones
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Síguenos</h3>
          <div className="mt-4 flex space-x-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <p className="text-center text-xs text-gray-400">
            Hecho con <span className="text-red-500">♥</span> por Luis Cortes Penguin
          </p>
        </div>
      </div>
    </footer>
  )
} 