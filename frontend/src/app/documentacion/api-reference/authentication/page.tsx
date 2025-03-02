'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Shield, AlertTriangle, Copy, ChevronRight, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

type Language = 'javascript' | 'python' | 'curl'

const authExamples: Record<Language, string> = {
  javascript: `import { PenguinAI } from '@penguin/ai'

// Inicializar el cliente con tu API key
const ai = new PenguinAI({
  apiKey: 'pk_live_xxxxxxxxxxxxxxxxxxxx'
})`,
  python: `from penguin_ai import PenguinAI

# Inicializar el cliente con tu API key
ai = PenguinAI(
    api_key='pk_live_xxxxxxxxxxxxxxxxxxxx'
)`,
  curl: `curl -X POST https://api.penguin-ai.com/v1/models \\
  -H "Authorization: Bearer pk_live_xxxxxxxxxxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "classification",
    "name": "mi-modelo"
  }'`
}

export default function AuthenticationPage() {
  const [selectedLanguage, setSelectedLanguage] = React.useState<Language>('javascript')
  const [copiedCode, setCopiedCode] = React.useState(false)

  const handleCopyCode = () => {
    navigator.clipboard.writeText(authExamples[selectedLanguage])
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
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
          <Link href="/documentacion/api-reference" className="hover:text-white transition-colors">
            Referencia API
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-white">Autenticación</span>
        </div>

        {/* API Keys Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-semibold text-white mb-6">
            API Keys
          </h2>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <p className="text-gray-300 mb-6">
              Penguin AI usa API keys para autenticar todas las solicitudes a la API. Puedes ver y gestionar tus API keys en el dashboard.
            </p>
            
            <div className="flex items-start space-x-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg mb-6">
              <Shield className="h-6 w-6 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-white font-medium mb-1">
                  Mantén tus API keys seguras
                </h3>
                <p className="text-gray-400">
                  Tus API keys tienen acceso completo a tu cuenta. No las compartas ni las expongas en código público.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">
                Tipos de API Keys
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                    <span className="text-white font-medium">Producción</span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Comienzan con &apos;pk_live_&apos;. Usar en producción con límites completos.
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <XCircle className="h-5 w-5 text-amber-400" />
                    <span className="text-white font-medium">Pruebas</span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Comienzan con &apos;pk_test_&apos;. Usar para desarrollo y pruebas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Code Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-semibold text-white mb-6">
            Ejemplos de Autenticación
          </h2>
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <div className="flex border-b border-white/10">
              {Object.keys(authExamples).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang as Language)}
                  className={`
                    px-4 py-2 text-sm font-medium
                    ${selectedLanguage === lang
                      ? 'text-white bg-white/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }
                    transition-colors
                  `}
                >
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </button>
              ))}
            </div>
            <div className="relative">
              <pre className="p-4 overflow-x-auto">
                <code className="text-sm text-gray-300">
                  {authExamples[selectedLanguage]}
                </code>
              </pre>
              <button
                onClick={handleCopyCode}
                className="absolute top-3 right-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <Copy 
                  className={`h-5 w-5 ${copiedCode ? 'text-green-400' : 'text-gray-400'}`}
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Error Handling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-semibold text-white mb-6">
            Manejo de Errores
          </h2>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-start space-x-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg mb-6">
              <AlertTriangle className="h-6 w-6 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-white font-medium mb-1">
                  Error de Autenticación
                </h3>
                <p className="text-gray-400">
                  Si la API key es inválida o ha expirado, recibirás un error 401 Unauthorized.
                </p>
              </div>
            </div>

            <div className="bg-[#1a1a1a] rounded-lg p-4 overflow-x-auto">
              <code className="text-sm text-gray-300">
{`{
  "error": {
    "code": "invalid_api_key",
    "message": "La API key proporcionada no es válida.",
    "status": 401
  }
}`}
              </code>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}