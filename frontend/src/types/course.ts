import type { LucideIcon } from 'lucide-react'

export interface Course {
  id: string
  title: string
  description: string
  image: string
  duration: string
  level: 'Principiante' | 'Intermedio' | 'Avanzado'
  rating: number
  icon: LucideIcon
  gradient: string
  progress?: number
  comingSoon?: boolean
  students?: string
} 