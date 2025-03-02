'use client'

// import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/features/Hero'
import { Features } from '@/components/features/Features'
import { Testimonials } from '@/components/features/Testimonials'
import { FAQ } from '@/components/features/FAQ'
import { BackgroundPatterns } from '@/components/features/BackgroundPatterns'
import { BackgroundLines } from '@/components/ui/BackgroundLines'
import { CoursePreview } from '@/components/features/courses/CoursePreview'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#020617] pt-20 relative">
      <BackgroundPatterns />
      <BackgroundLines />
      <Hero />
      <CoursePreview />
      <Features />
      <Testimonials />
      <FAQ />
      <Footer />
    </main>
  )
}
