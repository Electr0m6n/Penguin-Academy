'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, ChevronDown, X, Clock, Upload, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const categories = [
  { id: 'ml', name: 'Machine Learning' },
  { id: 'dl', name: 'Deep Learning' },
  { id: 'dev', name: 'Desarrollo IA' },
  { id: 'theory', name: 'Teoría y Fundamentos' }
]

const scheduleOptions = [
  { id: 'morning', name: 'Mañana (8:00 - 12:00)' },
  { id: 'afternoon', name: 'Tarde (13:00 - 17:00)' },
  { id: 'evening', name: 'Noche (18:00 - 22:00)' }
]

const daysOptions = [
  { id: 'monday', name: 'Lunes' },
  { id: 'tuesday', name: 'Martes' },
  { id: 'wednesday', name: 'Miércoles' },
  { id: 'thursday', name: 'Jueves' },
  { id: 'friday', name: 'Viernes' },
  { id: 'saturday', name: 'Sábado' },
  { id: 'sunday', name: 'Domingo' }
]

export default function NewGroupPage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [schedule, setSchedule] = useState('')
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [maxMembers, setMaxMembers] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return

    if (!name.trim() || !description.trim() || !category || !schedule || selectedDays.length === 0) {
      setError('Por favor, completa todos los campos requeridos.')
      return
    }

    try {
      setIsLoading(true)
      setError('')
      // TODO: Implementar lógica para crear nuevo grupo
      console.log({ name, description, category, schedule, selectedDays, maxMembers, tags, image })
    } catch {
      setError('Error al crear el grupo. Por favor, intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault()
      if (tags.length >= 5) {
        setError('Máximo 5 etiquetas permitidas.')
        return
      }
      if (!tags.includes(newTag.trim())) {
        setTags([...tags, newTag.trim()])
      }
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const toggleDay = (dayId: string) => {
    setSelectedDays(prev =>
      prev.includes(dayId)
        ? prev.filter(id => id !== dayId)
        : [...prev, dayId]
    )
  }

  return (
    <main className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/comunidad/grupos"
              className="text-blue-400 hover:text-blue-300 transition-colors mb-4 inline-block"
            >
              ← Volver a grupos
            </Link>
            <h1 className="text-3xl font-bold text-white">
              Crear Nuevo Grupo de Estudio
            </h1>
          </motion.div>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Group Image */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Imagen del grupo
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-white/10 border-dashed rounded-lg hover:border-white/20 transition-colors">
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <div className="relative w-full h-48">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImage(null)
                          setImagePreview('')
                        }}
                        className="absolute top-2 right-2 p-1 rounded-full bg-red-500/90 text-white hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-400">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md font-medium text-blue-400 hover:text-blue-300 focus-within:outline-none"
                        >
                          <span>Sube una imagen</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">o arrastra y suelta</p>
                      </div>
                      <p className="text-xs text-gray-400">
                        PNG, JPG, GIF hasta 10MB
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre del grupo
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                  placeholder="Ej: Deep Learning Avanzado"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 resize-y"
                  placeholder="Describe el propósito y objetivos del grupo..."
                  required
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                  Categoría
                </label>
                <div className="relative">
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white appearance-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                    required
                  >
                    <option value="">Selecciona una categoría</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Horario</h3>
              
              <div>
                <label htmlFor="schedule" className="block text-sm font-medium text-gray-300 mb-2">
                  Franja horaria
                </label>
                <div className="relative">
                  <select
                    id="schedule"
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white appearance-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                    required
                  >
                    <option value="">Selecciona un horario</option>
                    {scheduleOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.name}
                      </option>
                    ))}
                  </select>
                  <Clock className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Días de reunión
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {daysOptions.map((day) => (
                    <button
                      key={day.id}
                      type="button"
                      onClick={() => toggleDay(day.id)}
                      className={`
                        px-4 py-2 rounded-lg text-sm font-medium
                        ${selectedDays.includes(day.id)
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10'
                        }
                        transition-all duration-200
                      `}
                    >
                      {day.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Configuración adicional</h3>

              <div>
                <label htmlFor="maxMembers" className="block text-sm font-medium text-gray-300 mb-2">
                  Máximo de miembros (opcional)
                </label>
                <input
                  type="number"
                  id="maxMembers"
                  value={maxMembers}
                  onChange={(e) => setMaxMembers(e.target.value)}
                  min="2"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                  placeholder="Sin límite"
                />
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-2">
                  Etiquetas (opcional)
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    id="tags"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleAddTag}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                    placeholder="Presiona Enter para agregar una etiqueta"
                  />
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-2 focus:outline-none"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className={`
                  inline-flex items-center px-6 py-3 rounded-lg text-base font-semibold text-white
                  bg-gradient-to-r from-blue-600 to-violet-600
                  hover:from-blue-500 hover:to-violet-500
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <Users className="w-5 h-5 mr-2" />
                {isLoading ? 'Creando grupo...' : 'Crear Grupo'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  )
} 