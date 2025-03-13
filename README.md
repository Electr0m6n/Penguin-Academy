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
│   │   │   ├── components/       # Componentes para módulo de typing
│   │   │   │   ├── Header.tsx          # Cabecera de la sección de typing
│   │   │   │   ├── Leaderboard.tsx     # Componente de tabla de clasificación
│   │   │   │   ├── ThemeButton.tsx     # Selector de temas visuales
│   │   │   │   ├── TimeSelector.tsx    # Selector de duración de prueba
│   │   │   │   └── UserProfile.tsx     # Perfil y estadísticas del usuario
│   │   │   ├── constants/       # Constantes para módulo de typing
│   │   │   │   ├── texts.ts           # Textos para pruebas de typing
│   │   │   │   └── themes.ts          # Definiciones de temas visuales
│   │   │   ├── hooks/           # Hooks personalizados
│   │   │   │   ├── useSupabase.ts      # Integración con Supabase
│   │   │   │   ├── useTheme.ts         # Gestión de temas visuales
│   │   │   │   ├── useTypingMetrics.ts # Cálculo de métricas de typing
│   │   │   │   └── useTypingTest.ts    # Lógica principal de prueba de typing
│   │   │   ├── types/           # Definiciones de tipos
│   │   │   │   └── index.ts           # Tipos para el módulo de typing
│   │   │   ├── utils/           # Utilidades
│   │   │   │   └── config.ts          # Configuraciones generales
│   │   │   ├── layout.tsx       # Layout personalizado para typing
│   │   │   └── page.tsx         # Página principal de typing
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

##### Arquitectura del Módulo de Typing
- **Componentes principales**:
  - `ThemeButton.tsx`: Permite al usuario seleccionar entre distintos temas visuales predefinidos
  - `Leaderboard.tsx`: Muestra una tabla de clasificación con los mejores resultados
  - `UserProfile.tsx`: Gestiona la visualización del perfil y estadísticas del usuario
  - `TimeSelector.tsx`: Permite seleccionar la duración de la prueba de escritura
  - `Header.tsx`: Cabecera personalizada para la sección de typing

- **Hooks personalizados**:
  - `useTypingTest.ts`: Gestiona la lógica principal de la prueba, incluyendo el estado del texto, entrada del usuario y temporizador
  - `useTypingMetrics.ts`: Calcula métricas como WPM, precisión y consistencia
  - `useTheme.ts`: Gestiona la selección y aplicación de temas visuales
  - `useSupabase.ts`: Proporciona integración con Supabase para persistencia de datos

- **Sistema de datos**:
  - Almacenamiento de estadísticas de usuario en Supabase
  - Clasificación en tiempo real con actualizaciones automáticas
  - Persistencia de preferencias de tema y configuración

- **Visualización de datos**:
  - Gráficos de rendimiento en tiempo real con Chart.js
  - Análisis visual de rendimiento histórico
  - Animaciones fluidas con Framer Motion

##### Flujo de trabajo del usuario
1. El usuario selecciona una duración de prueba (15s, 30s, 60s, 120s)
2. Comienza a escribir el texto mostrado
3. El sistema realiza un seguimiento en tiempo real de su rendimiento
4. Al finalizar, se muestran estadísticas detalladas y se actualiza la tabla de clasificación
5. Los datos se sincronizan con Supabase para persistencia

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
4. **Módulo de Typing**:
   - Añadir más textos de práctica categorizados por dificultad
   - Implementar modo de competición en tiempo real contra otros usuarios
   - Añadir un sistema de logros por hitos de rendimiento

#### Mediano Plazo
1. Sistema de gamificación
2. Marketplace de recursos
3. API pública para desarrolladores
4. **Módulo de Typing**:
   - Desarrollar ejercicios específicos para programadores (código)
   - Añadir análisis de debilidades y recomendaciones de práctica
   - Integración con herramientas de productividad externas

#### Largo Plazo
1. Sistema de mentorías
2. Plataforma de certificaciones
3. Herramientas de IA personalizadas
4. **Módulo de Typing**:
   - Implementar aprendizaje automático para predecir y mejorar el rendimiento del usuario
   - Desarrollo de un teclado virtual con seguimiento de movimiento
   - Añadir soporte para múltiples idiomas y teclados

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