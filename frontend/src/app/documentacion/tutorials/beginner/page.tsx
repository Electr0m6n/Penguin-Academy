'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, ChevronRight, Copy, PlayCircle, CheckCircle, Info } from 'lucide-react'
import Link from 'next/link'

const codeSteps = [
  {
    title: 'Preparar los Datos',
    code: `import numpy as np
from penguin_ai import PenguinAI

# Datos de ejemplo para clasificación de sentimientos
textos = [
    "Me encanta este producto, es increíble!",
    "No me gustó nada, muy decepcionante",
    "Bastante bueno, lo recomiendo"
]

etiquetas = ["positivo", "negativo", "positivo"]

# Convertir a arrays de numpy
X = np.array(textos)
y = np.array(etiquetas)`
  },
  {
    title: 'Crear y Configurar el Modelo',
    code: `# Inicializar el cliente
ai = PenguinAI(api_key='tu-api-key')

# Crear un modelo de clasificación de texto
modelo = ai.create_model(
    name="clasificador-sentimientos",
    type="text_classification",
    language="es"
)`
  },
  {
    title: 'Entrenar el Modelo',
    code: `# Entrenar el modelo con nuestros datos
resultado = modelo.train(
    training_data=X,
    labels=y,
    epochs=10,
    batch_size=32,
    validation_split=0.2
)

# Ver métricas de entrenamiento
print(f"Precisión: {resultado.metrics['accuracy']:.2f}")
print(f"Pérdida: {resultado.metrics['loss']:.2f}")`
  },
  {
    title: 'Hacer Predicciones',
    code: `# Texto nuevo para clasificar
nuevo_texto = "Este producto superó mis expectativas"

# Hacer la predicción
prediccion = modelo.predict(nuevo_texto)

print(f"Sentimiento: {prediccion.label}")
print(f"Confianza: {prediccion.confidence:.2f}")`
  }
]

export default function BeginnerTutorialPage() {
  const [activeStep, setActiveStep] = React.useState(0)
  const [copiedCode, setCopiedCode] = React.useState<number | null>(null)

  const handleCopyCode = (index: number) => {
    navigator.clipboard.writeText(codeSteps[index].code)
    setCopiedCode(index)
    setTimeout(() => setCopiedCode(null), 2000)
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
          <Link href="/documentacion/tutorials" className="hover:text-white transition-colors">
            Tutoriales
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-white">Principiante</span>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold text-white">
              Creando tu Primer Modelo
            </h1>
          </div>
          <p className="text-lg text-gray-300">
            Aprende a crear un modelo básico de clasificación de sentimientos usando Penguin AI.
          </p>
        </motion.div>

        {/* Tutorial Content */}
        <div className="space-y-12">
          {/* Introducción */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-2xl font-semibold text-white mb-4">
              Introducción
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300">
                En este tutorial, crearemos un modelo de clasificación de sentimientos que puede analizar texto en español y determinar si expresa un sentimiento positivo o negativo. Aprenderás:
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                  <span>Cómo preparar datos para entrenamiento</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                  <span>Crear y configurar un modelo de clasificación</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                  <span>Entrenar el modelo con tus datos</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                  <span>Hacer predicciones con el modelo entrenado</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Requisitos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold text-white mb-4">
              Requisitos
            </h2>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-start space-x-3 text-gray-300">
                <Info className="h-6 w-6 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="mb-4">
                    Antes de comenzar, asegúrate de tener:
                  </p>
                  <ul className="space-y-2">
                    <li>• Python 3.8 o superior instalado</li>
                    <li>• Una API key de Penguin AI</li>
                    <li>• Conocimientos básicos de Python</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Pasos del Tutorial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-semibold text-white mb-6">
              Paso a Paso
            </h2>
            <div className="space-y-6">
              {codeSteps.map((step, index) => (
                <div
                  key={index}
                  className={`
                    bg-white/5 border border-white/10 rounded-xl overflow-hidden
                    ${activeStep === index ? 'ring-2 ring-blue-500' : ''}
                  `}
                >
                  <button
                    onClick={() => setActiveStep(index)}
                    className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <PlayCircle className="h-5 w-5 text-blue-400" />
                      </div>
                      <span className="text-lg font-medium text-white">
                        {index + 1}. {step.title}
                      </span>
                    </div>
                    <ChevronRight className={`
                      h-5 w-5 text-gray-400 transform transition-transform
                      ${activeStep === index ? 'rotate-90' : ''}
                    `} />
                  </button>
                  
                  {activeStep === index && (
                    <div className="border-t border-white/10">
                      <div className="relative">
                        <pre className="p-4 overflow-x-auto">
                          <code className="text-sm text-gray-300">
                            {step.code}
                          </code>
                        </pre>
                        <button
                          onClick={() => handleCopyCode(index)}
                          className="absolute top-3 right-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <Copy 
                            className={`h-5 w-5 ${copiedCode === index ? 'text-green-400' : 'text-gray-400'}`}
                          />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Siguiente Tutorial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12"
          >
            <Link
              href="/documentacion/tutorials/intermediate/fine-tuning"
              className="block group"
            >
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Siguiente Tutorial: Fine-tuning Avanzado
                </h3>
                <p className="text-gray-400">
                  Aprende a ajustar los hiperparámetros de tu modelo para obtener mejores resultados.
                </p>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}