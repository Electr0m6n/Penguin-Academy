'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export function BackgroundPatterns() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Ajustar el tamaño del canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Configuración del cubo
    const cube = {
      angle: 0,
      size: 100,
      speed: 0.02,
      points: [
        [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
        [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
      ]
    }

    // Función para rotar un punto en 3D optimizada
    const rotatePoint = (point: number[], angle: number) => {
      const [x, y, z] = point
      const cosA = Math.cos(angle)
      const sinA = Math.sin(angle)
      return [
        x * cosA - z * sinA,
        y,
        x * sinA + z * cosA
      ]
    }

    // Función para proyectar un punto 3D en 2D optimizada
    const project = (point: number[]) => {
      const scale = 400 / (400 - point[2])
      return [
        point[0] * scale + canvas.width / 2,
        point[1] * scale + canvas.height / 2
      ]
    }

    // Animación optimizada
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Rotar y proyectar puntos
      const rotatedPoints = cube.points.map(point => 
        rotatePoint(point.map(p => p * cube.size), cube.angle)
      )
      const projectedPoints = rotatedPoints.map(project)

      // Dibujar aristas con path batching
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)'
      ctx.lineWidth = 1.5

      // Dibujar todas las líneas en un solo path
      const drawEdge = (i: number, j: number) => {
        ctx.moveTo(projectedPoints[i][0], projectedPoints[i][1])
        ctx.lineTo(projectedPoints[j][0], projectedPoints[j][1])
      }

      // Cara frontal
      for (let i = 0; i < 4; i++) {
        drawEdge(i, (i + 1) % 4)
      }

      // Cara trasera
      for (let i = 4; i < 8; i++) {
        drawEdge(i, (i + 1) % 4 + 4)
      }

      // Conectar caras
      for (let i = 0; i < 4; i++) {
        drawEdge(i, i + 4)
      }

      ctx.stroke()

      // Actualizar ángulo
      cube.angle += cube.speed
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }} // Aumentado a 0.5 de opacidad
        transition={{ duration: 1 }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ mixBlendMode: 'screen' }}
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/60 to-black" />
    </div>
  )
}