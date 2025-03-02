'use client'

import { useEffect, useRef } from 'react'

export function BackgroundLines() {
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

    // Crear estrellas
    const stars: { x: number; y: number; size: number; speed: number }[] = []
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5,
        speed: Math.random() * 0.5 + 0.2
      })
    }

    // Animar estrellas
    let animationFrameId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Dibujar estrellas
      stars.forEach(star => {
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
        ctx.fill()

        // Mover estrellas
        star.y += star.speed
        if (star.y > canvas.height) {
          star.y = 0
          star.x = Math.random() * canvas.width
        }
      })

      // Dibujar líneas entre estrellas cercanas
      stars.forEach((star1, i) => {
        stars.slice(i + 1).forEach(star2 => {
          const distance = Math.hypot(star1.x - star2.x, star1.y - star2.y)
          if (distance < 150) {
            ctx.beginPath()
            ctx.moveTo(star1.x, star1.y)
            ctx.lineTo(star2.x, star2.y)
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.3 * (1 - distance / 150)})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        })
      })

      animationFrameId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none opacity-50"
      style={{ mixBlendMode: 'screen' }}
    />
  )
} 