'use client'

import { useEffect, useRef } from 'react'

export function AuthBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Ajustar el tamaño del canvas al tamaño de la ventana
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Configuración de partículas
    const particles: Particle[] = []
    const particleCount = 50
    const colors = ['#10B981', '#059669', '#0D9488', '#0891B2', '#0EA5E9']

    interface Particle {
      x: number
      y: number
      radius: number
      color: string
      speedX: number
      speedY: number
      life: number
      maxLife: number
    }

    // Crear partículas iniciales
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        life: Math.random() * 100,
        maxLife: 100 + Math.random() * 100
      })
    }

    // Función para dibujar una partícula
    const drawParticle = (particle: Particle) => {
      const opacity = (particle.life / particle.maxLife) * 0.5
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
      ctx.fillStyle = particle.color.replace(')', `,${opacity})`)
      ctx.fill()
    }

    // Función para dibujar líneas entre partículas cercanas
    const drawLines = (particles: Particle[]) => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            const opacity = (1 - distance / 150) * 0.15
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }
    }

    // Función de animación
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Actualizar y dibujar partículas
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i]

        // Mover partícula
        particle.x += particle.speedX
        particle.y += particle.speedY
        particle.life -= 0.5

        // Reiniciar partícula si sale del canvas o su vida termina
        if (
          particle.x < 0 ||
          particle.x > canvas.width ||
          particle.y < 0 ||
          particle.y > canvas.height ||
          particle.life <= 0
        ) {
          particle.x = Math.random() * canvas.width
          particle.y = Math.random() * canvas.height
          particle.life = particle.maxLife
        }

        drawParticle(particle)
      }

      drawLines(particles)
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 bg-[#020617] opacity-80"
    />
  )
} 