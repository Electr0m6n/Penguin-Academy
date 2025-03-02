import { Brain, Code, Calculator, FunctionSquare, ChartBar, Network } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface Course {
  id: string
  title: string
  description: string
  image: string
  duration: string
  level: 'Principiante' | 'Intermedio' | 'Avanzado'
  rating: number
  students: string
  icon: LucideIcon
  gradient: string
  comingSoon?: boolean
  progress?: number
  version: number
}

export const courses: Course[] = [
  {
    id: 'primeros-pasos-c',
    title: 'Primeros Pasos en C',
    description: 'Aprende los fundamentos de la programación con el lenguaje C desde cero.',
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=2000&q=80',
    duration: '4 semanas',
    level: 'Principiante',
    rating: 4.8,
    icon: Code,
    gradient: 'from-blue-500 to-cyan-500',
    progress: 0,
    students: '0',
    version: 1
  },
  {
    id: 'aprender-a-aprender',
    title: 'Aprender a Aprender',
    description: 'Desarrolla técnicas efectivas de estudio y aprendizaje para maximizar tu potencial educativo.',
    image: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=2000&q=80',
    duration: '4 semanas',
    level: 'Principiante',
    rating: 4.9,
    icon: Brain,
    gradient: 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500',
    comingSoon: true,
    students: '0',
    version: 1
  },
  {
    id: 'calculo',
    title: 'Cálculo I y II',
    description: 'Domina los conceptos fundamentales del cálculo diferencial e integral.',
    image: 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?auto=format&fit=crop&w=2000&q=80',
    duration: '16 semanas',
    level: 'Intermedio',
    rating: 4.8,
    icon: Calculator,
    gradient: 'bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500',
    comingSoon: true,
    students: '0',
    version: 1
  },
  {
    id: 'algebra-lineal',
    title: 'Álgebra Lineal',
    description: 'Explora los fundamentos del álgebra lineal y sus aplicaciones en la IA.',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=2000&q=80',
    duration: '12 semanas',
    level: 'Intermedio',
    rating: 4.6,
    icon: FunctionSquare,
    gradient: 'bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500',
    comingSoon: true,
    students: '0',
    version: 1
  },
  {
    id: 'probabilidad-estadistica',
    title: 'Probabilidad y Estadística',
    description: 'Aprende los conceptos fundamentales de probabilidad y estadística para análisis de datos.',
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=2000&q=80',
    duration: '10 semanas',
    level: 'Intermedio',
    rating: 4.7,
    icon: ChartBar,
    gradient: 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500',
    comingSoon: true,
    students: '0',
    version: 1
  },
  {
    id: 'logica',
    title: 'Lógica y Razonamiento',
    description: 'Desarrolla habilidades de pensamiento lógico y resolución de problemas.',
    image: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=2000&q=80',
    duration: '6 semanas',
    level: 'Principiante',
    rating: 4.5,
    icon: Brain,
    gradient: 'bg-gradient-to-r from-red-600 via-red-500 to-orange-500',
    comingSoon: true,
    students: '0',
    version: 1
  },
  {
    id: 'python-principiantes',
    title: 'Python para Principiantes',
    description: 'Inicia tu viaje en la programación con Python, el lenguaje más popular en IA.',
    image: 'https://images.unsplash.com/photo-1649180556628-9ba704115795?auto=format&fit=crop&w=2000&q=80',
    duration: '8 semanas',
    level: 'Principiante',
    rating: 4.8,
    icon: Code,
    gradient: 'bg-gradient-to-r from-green-600 via-green-500 to-emerald-500',
    comingSoon: true,
    students: '0',
    version: 1
  },
  {
    id: 'machine-learning',
    title: 'Machine Learning Básico',
    description: 'Introducción a los conceptos fundamentales del aprendizaje automático.',
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=2000&q=80',
    duration: '8 semanas',
    level: 'Intermedio',
    rating: 4.9,
    icon: Brain,
    gradient: 'from-purple-500 to-pink-500',
    comingSoon: true,
    students: '0',
    version: 1
  },
  {
    id: 'deep-learning',
    title: 'Deep Learning Avanzado',
    description: 'Domina las redes neuronales profundas y sus aplicaciones.',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=2000&q=80',
    duration: '12 semanas',
    level: 'Avanzado',
    rating: 4.7,
    icon: Network,
    gradient: 'bg-gradient-to-r from-red-600 via-red-500 to-orange-500',
    comingSoon: true,
    students: '0',
    version: 1
  }
] 