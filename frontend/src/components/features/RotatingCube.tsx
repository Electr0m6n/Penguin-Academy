'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface RotatingCubeProps {
  className?: string
  position?: 'left' | 'right' | 'center'
}

export function RotatingCube({ className = 'w-96 h-96', position = 'center' }: RotatingCubeProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Configuración básica
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
      precision: "highp"
    })
    
    // Detección de dispositivo móvil
    const isMobile = window.innerWidth < 768

    // Ajuste responsivo del tamaño
    const updateSize = () => {
      const width = Math.min(384, window.innerWidth * 0.8)
      const height = width
      renderer.setSize(width, height)
      camera.aspect = 1
      camera.updateProjectionMatrix()
    }
    
    updateSize()
    window.addEventListener('resize', updateSize)
    container.appendChild(renderer.domElement)

    // Crear grupo para el cubo Rubik
    const rubikGroup = new THREE.Group()
    scene.add(rubikGroup)

    // Función para crear un subcubo
    const createSubCube = (x: number, y: number, z: number) => {
      const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8)
      const material = new THREE.MeshPhongMaterial({
        color: 0x0066FF,
        emissive: 0x0066FF,
        emissiveIntensity: 0.1,
        transparent: true,
        opacity: 0.05,
        shininess: 50
      })
      
      const cube = new THREE.Mesh(geometry, material)
      cube.position.set(x, y, z)

      // Añadir bordes
      const edges = new THREE.EdgesGeometry(geometry)
      const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.3
      })
      const wireframe = new THREE.LineSegments(edges, lineMaterial)
      cube.add(wireframe)

      // Añadir puntos en las esquinas
      const vertices = geometry.attributes.position
      const pointsGeometry = new THREE.BufferGeometry()
      pointsGeometry.setAttribute('position', vertices)
      const pointsMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 0.05,
        transparent: true,
        opacity: 0.8
      })
      const points = new THREE.Points(pointsGeometry, pointsMaterial)
      cube.add(points)

      return cube
    }

    // Crear cubo 3x3x3
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const subcube = createSubCube(x, y, z)
          rubikGroup.add(subcube)
        }
      }
    }

    // Añadir luces
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5)
    scene.add(ambientLight)

    const pointLight1 = new THREE.PointLight(0x0066FF, 2, 10)
    pointLight1.position.set(2, 2, 2)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0xFFFFFF, 1.5, 10)
    pointLight2.position.set(-2, -2, -2)
    scene.add(pointLight2)

    // Ajustar posición de la cámara
    camera.position.z = isMobile ? 8 : 6
    camera.position.y = 2
    camera.position.x = 0

    // Rotación inicial
    rubikGroup.rotation.x = 0.7
    rubikGroup.rotation.y = -0.5

    // Animación
    let frame = 0
    function animate() {
      frame = requestAnimationFrame(animate)
      
      // Reducir velocidad de rotación
      rubikGroup.rotation.x += 0.001
      rubikGroup.rotation.y += 0.001
      
      // Optimizar movimiento de luces
      const time = Date.now() * 0.0005
      pointLight1.position.x = Math.sin(time) * 3
      pointLight1.position.y = Math.cos(time) * 3
      pointLight2.position.x = Math.cos(time) * 3
      pointLight2.position.y = Math.sin(time) * 3
      
      renderer.render(scene, camera)
    }

    animate()

    // Optimización de rendimiento para móviles
    if (isMobile) {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      camera.position.z = 7 // Ajuste de la distancia de la cámara para móviles
    }

    // Limpieza
    return () => {
      window.removeEventListener('resize', updateSize)
      cancelAnimationFrame(frame)
      if (container) {
        container.removeChild(renderer.domElement)
      }
      rubikGroup.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose())
          } else {
            object.material.dispose()
          }
        }
      })
      renderer.dispose()
    }
  }, [position])

  return (
    <div 
      ref={containerRef} 
      className={`${className} cube-container absolute left-1/2 -translate-x-1/2 -top-20 pointer-events-none`}
      style={{
        filter: 'drop-shadow(0 0 20px rgba(0, 102, 255, 0.2))'
      }}
    />
  )
} 