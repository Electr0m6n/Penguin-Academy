# Penguin Academy

## Plataforma de Aprendizaje en Inteligencia Artificial

### Contexto y Descripción General
Penguin Academy es una plataforma educativa especializada en Inteligencia Artificial que ofrece una experiencia de aprendizaje integral. El proyecto está diseñado para proporcionar cursos, recursos y una comunidad activa para estudiantes y profesionales interesados en IA.

#### Propósito Principal
- Ofrecer educación de alta calidad en IA
- Facilitar el aprendizaje práctico mediante proyectos reales
- Crear una comunidad colaborativa de aprendizaje
- Proporcionar recursos y herramientas especializadas

#### Público Objetivo
- Estudiantes de tecnología e ingeniería
- Profesionales en transición a IA
- Desarrolladores interesados en machine learning
- Entusiastas de la tecnología

### Arquitectura del Sistema

#### Stack Tecnológico
- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Estilizado**: TailwindCSS, Framer Motion
- **Visualización de datos**: Chart.js, React-ChartJS-2
- **Backend**: Supabase (Backend as a Service)
- **Autenticación**: Supabase Auth
- **Base de Datos**: PostgreSQL (Supabase)
- **Despliegue**: Vercel

### Estructura del Proyecto

```
frontend/
├── .next/                      # Directorio de build de Next.js
├── public/                     # Archivos estáticos públicos
├── src/
│   ├── app/                    # Rutas y páginas (Next.js App Router)
│   │   ├── comunidad/         # Sección de comunidad
│   │   │   ├── desafios/     
│   │   │   │   └── page.tsx  # Página de desafíos
│   │   │   ├── foros/        
│   │   │   │   └── page.tsx  # Página de foros
│   │   │   ├── grupos/       
│   │   │   │   └── page.tsx  # Página de grupos
│   │   │   └── page.tsx      # Página principal de comunidad
│   │   ├── cursos/           
│   │   │   ├── [courseId]/   # Ruta dinámica para cursos
│   │   │   │   └── page.tsx  # Página de detalle de curso
│   │   │   └── page.tsx      # Catálogo de cursos
│   │   ├── documentacion/    
│   │   │   └── page.tsx      # Documentación técnica
│   │   ├── login/           
│   │   │   └── page.tsx      # Página de inicio de sesión
│   │   ├── perfil/          
│   │   │   └── page.tsx      # Página de perfil de usuario
│   │   ├── problemas/       
│   │   │   ├── layout.tsx    # Layout de problemas
│   │   │   └── page.tsx      # Página de problemas
│   │   ├── typing/        
│   │   │   ├── layout.tsx    # Layout de typing
│   │   │   └── page.tsx      # Página de typing
│   │   ├── registro/        
│   │   │   └── page.tsx      # Página de registro
│   │   ├── favicon.ico       # Favicon del sitio
│   │   ├── globals.css       # Estilos globales
│   │   ├── layout.tsx        # Layout principal
│   │   └── page.tsx          # Página principal
│   ├── components/           # Componentes reutilizables
│   │   ├── auth/            # Componentes de autenticación
│   │   │   ├── AuthBackground.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── features/        # Componentes principales
│   │   │   ├── BackgroundPatterns.tsx
│   │   │   ├── Benefits.tsx
│   │   │   ├── FAQ.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── RotatingCube.tsx
│   │   │   ├── StarField.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   └── courses/
│   │   │       ├── CourseList.tsx
│   │   │       └── CoursePreview.tsx
│   │   ├── layout/          # Componentes de estructura
│   │   │   ├── Footer.tsx
│   │   │   └── Header.tsx
│   │   └── ui/              # Componentes de interfaz
│   │       ├── BackgroundLines.tsx
│   │       └── StarField.tsx
│   ├── data/                # Datos estáticos
│   │   └── courses.ts       # Datos de cursos
│   └── types/               # Definiciones de tipos
│       └── course.ts        # Tipos para cursos
├── node_modules/            # Dependencias
├── .env.local              # Variables de entorno locales
├── .gitignore              # Configuración de Git
├── eslint.config.mjs       # Configuración de ESLint
├── next-env.d.ts           # Tipos de Next.js
├── next.config.js          # Configuración de Next.js
├── next.config.ts          # Configuración tipada de Next.js
├── package-lock.json       # Lock de dependencias
├── package.json            # Configuración del proyecto
├── postcss.config.mjs      # Configuración de PostCSS
├── tailwind.config.ts      # Configuración de Tailwind
└── tsconfig.json          # Configuración de TypeScript

backend/                    # Servicios de backend (Supabase)
└── .gitkeep               # Marcador de directorio
```

### Módulos Principales

#### 1. Sistema de Autenticación
- Implementado con Supabase Auth
- Soporte para email/password
- Integración con proveedores OAuth (Google, GitHub)
- Gestión de sesiones y tokens

#### 2. Gestión de Cursos
- Catálogo de cursos interactivo
- Sistema de progreso
- Contenido multimedia
- Evaluaciones y ejercicios

#### 3. Comunidad
- Foros de discusión
- Grupos de estudio
- Desafíos y competencias

#### 4. Typing
- Práctica de velocidad de escritura
- Medición de palabras por minuto (WPM)
- Análisis de precisión
- Ejercicios personalizados
- Gráficas de rendimiento en tiempo real
- Estadísticas detalladas (caracteres correctos/incorrectos/perdidos)
- Análisis de consistencia
- Selección de duración de prueba (15s, 30s, 60s, 120s)
- Temas visuales personalizables

#### 5. Problemas de IA
- Desafíos prácticos
- Ejercicios de programación
- Casos de estudio
- Competencias

### Integraciones y Servicios

#### Supabase
- **Autenticación**: Gestión de usuarios y sesiones
- **Base de Datos**: Almacenamiento de datos de usuarios y cursos
- **Storage**: Almacenamiento de archivos y recursos
- **Realtime**: Funcionalidades en tiempo real para foros y chat

### Flujos de Datos

#### Autenticación
1. Usuario ingresa credenciales
2. Supabase Auth valida y genera token
3. Token almacenado en cliente
4. Acceso a recursos protegidos

#### Cursos
1. Carga inicial desde Supabase
2. Caché local para rendimiento
3. Sincronización de progreso
4. Actualización en tiempo real

### Mejoras Propuestas

#### Corto Plazo
1. Implementar sistema de búsqueda avanzada
2. Mejorar la experiencia móvil
3. Agregar más integraciones sociales

#### Mediano Plazo
1. Sistema de gamificación
2. Marketplace de recursos
3. API pública para desarrolladores

#### Largo Plazo
1. Sistema de mentorías
2. Plataforma de certificaciones
3. Herramientas de IA personalizadas

### Consideraciones Técnicas

#### Rendimiento
- Optimización de imágenes y assets
- Implementación de SSR/SSG
- Lazy loading de componentes

#### Seguridad
- Validación de datos en cliente y servidor
- Protección contra XSS y CSRF
- Encriptación de datos sensibles

#### Escalabilidad
- Arquitectura modular
- Patrones de diseño escalables
- Cache estratégico

### Contribución
1. Fork del repositorio
2. Crear rama feature/fix
3. Commit de cambios
4. Pull request a main

### Licencia
MIT License - Ver archivo LICENSE para detalles 