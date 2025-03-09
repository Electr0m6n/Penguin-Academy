'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

// Textos de práctica para typing
const typingTexts = [
  'La inteligencia artificial es una rama de la informática que busca crear sistemas capaces de realizar tareas que normalmente requieren inteligencia humana.',
  'El aprendizaje automático permite a las computadoras mejorar automáticamente a través de la experiencia sin ser programadas explícitamente.',
  'Las redes neuronales son un conjunto de algoritmos diseñados para reconocer patrones, inspirados en el funcionamiento del cerebro humano.',
  'El procesamiento del lenguaje natural es un campo de la IA que se centra en la interacción entre las computadoras y el lenguaje humano.'
]

export default function TypingPage() {
  const [text, setText] = useState('')
  const [targetText, setTargetText] = useState(typingTexts[0])
  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)
  const [wpm, setWpm] = useState<number | null>(null)
  const [accuracy, setAccuracy] = useState<number | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (text.length === 1 && startTime === null) {
      setStartTime(Date.now())
    }

    if (text.length === targetText.length && startTime !== null) {
      setEndTime(Date.now())
    }
  }, [text, targetText, startTime])

  useEffect(() => {
    if (startTime && endTime) {
      const timeInMinutes = (endTime - startTime) / 60000
      const wordsTyped = text.trim().split(/\s+/).length
      const calculatedWpm = Math.round(wordsTyped / timeInMinutes)
      setWpm(calculatedWpm)

      // Calcular precisión
      let correctChars = 0
      for (let i = 0; i < text.length; i++) {
        if (text[i] === targetText[i]) {
          correctChars++
        }
      }
      const calculatedAccuracy = Math.round((correctChars / targetText.length) * 100)
      setAccuracy(calculatedAccuracy)
    }
  }, [endTime, startTime, text, targetText])

  const handleReset = () => {
    setText('')
    setStartTime(null)
    setEndTime(null)
    setWpm(null)
    setAccuracy(null)
    // Cambiar a un texto aleatorio diferente
    const newTextIndex = Math.floor(Math.random() * typingTexts.length)
    setTargetText(typingTexts[newTextIndex])
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <div className="relative isolate min-h-screen bg-black">
      {/* Fondo con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-green-950/20 z-0" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl"
        >
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl text-center">
            Práctica de Typing
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300 text-center">
            Mejora tu velocidad y precisión de escritura con nuestro ejercicio de typing.
          </p>
          
          <div className="mt-12 space-y-8">
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-white mb-4">Texto a escribir:</h2>
              <p className="text-gray-300 text-lg leading-relaxed font-mono">
                {targetText.split('').map((char, index) => {
                  let color = 'text-gray-400'
                  if (index < text.length) {
                    color = text[index] === char ? 'text-green-400' : 'text-red-400'
                  }
                  return (
                    <span key={index} className={color}>
                      {char}
                    </span>
                  )
                })}
              </p>
            </div>
            
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <textarea
                ref={inputRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={endTime !== null}
                className="w-full h-32 bg-black/50 text-white border border-white/20 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
                placeholder="Comienza a escribir aquí..."
                autoFocus
              />
              
              {endTime && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-black/30 rounded-lg p-4 text-center">
                    <p className="text-gray-400 text-sm">Velocidad</p>
                    <p className="text-3xl font-bold text-green-400">{wpm} WPM</p>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4 text-center">
                    <p className="text-gray-400 text-sm">Precisión</p>
                    <p className="text-3xl font-bold text-green-400">{accuracy}%</p>
                  </div>
                </div>
              )}
              
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleReset}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-full font-medium hover:from-green-500 hover:to-emerald-400 transition-all duration-300 transform hover:scale-105"
                >
                  {endTime ? 'Reiniciar' : 'Empezar de nuevo'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 