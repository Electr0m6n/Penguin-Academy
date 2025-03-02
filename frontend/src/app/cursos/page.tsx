import React from 'react'
import CourseList from '@/components/features/courses/CourseList'
import type { Metadata } from "next"
import { BackgroundPatterns } from '@/components/features/BackgroundPatterns'
import { StarField2 } from '@/components/ui/StarField'

export const metadata: Metadata = {
  title: "Cursos - Penguin AI",
  description: "Explora nuestra colección de cursos de IA y matemáticas.",
}

export default function CoursesPage() {
  return (
    <main className="min-h-screen bg-black pt-20 relative">
      <BackgroundPatterns />
      <StarField2 className="z-10" />
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 relative z-20">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400/90 to-cyan-400/90 mb-12 text-center backdrop-blur-none">
          Cursos Disponibles :)
        </h1>

        <CourseList />
      </div>
    </main>
  )
} 