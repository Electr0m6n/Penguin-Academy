# Penguin Academy

## Estructura del Proyecto de Cursos en Línea

### Contexto y Descripción General del Proyecto
Este proyecto es una página de cursos en línea que incluye secciones como catálogo de cursos, inscripción, perfil de usuario, administración de contenidos y pagos. El propósito principal del sitio es ofrecer una plataforma accesible para que los usuarios puedan buscar, inscribirse y gestionar sus cursos. El público objetivo son estudiantes y profesionales que buscan mejorar sus habilidades a través de cursos en línea.

### Funcionalidades Clave
- Búsqueda de cursos
- Filtrado de cursos
- Sistema de recomendaciones

### Arquitectura
El proyecto utiliza una arquitectura de frontend-backend, donde el frontend está construido con Next.js y el backend está diseñado para ser implementado, aunque actualmente el directorio está vacío. Se prevé la integración con APIs de terceros para pagos y autenticación.

### Estructura del Proyecto
#### Estructura de Carpetas y Archivos
```
Estructura del Proyecto
├── frontend/
│   ├── .next/
│   ├── src/
│   │   ├── components/
│   │   │   ├── features/
│   │   │   │   ├── BackgroundPatterns.tsx
│   │   │   │   ├── Benefits.tsx
│   │   │   │   ├── FAQ.tsx
│   │   │   │   ├── Features.tsx
│   │   │   │   ├── Hero.tsx
│   │   │   │   ├── RotatingCube.tsx
│   │   │   │   ├── StarField.tsx
│   │   │   │   ├── Testimonials.tsx
│   │   │   │   └── courses/
│   │   │   │       ├── CourseList.tsx
│   │   │   │       └── CoursePreview.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── Header.tsx
│   │   │   ├── ui/
│   │   │   │   ├── BackgroundLines.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   └── StarField.tsx
│   │   │   └── auth/
│   │   │       ├── AuthBackground.tsx
│   │   │       ├── LoginForm.tsx
│   │   │       └── RegisterForm.tsx
│   │   ├── data/
│   │   │   └── courses.ts
│   │   ├── types/
│   │   │   └── course.ts
│   │   └── app/
│   │       ├── documentacion/
│   │       ├── favicon.ico
│   │       ├── globals.css
│   │       ├── layout.tsx
│   │       ├── login/
│   │       │   └── page.tsx
│   │       ├── page.tsx
│   │       ├── proyectos/
│   │       ├── recursos/
│   │       ├── registro/
│   │       │   └── page.tsx
│   │       ├── comunidad/
│   │       │   ├── desafios/
│   │       │   ├── foros/
│   │       │   ├── grupos/
│   │       │   ├── layout.tsx
│   │       │   └── page.tsx
│   │       └── cursos/
│   │           ├── [courseId]/
│   │           └── page.tsx
└── backend/
```
- **frontend/**: Contiene el código del frontend.
- **backend/**: Actualmente vacío, pero se espera que contenga el código del backend.

### Configuración de Supabase
Para utilizar Supabase en este proyecto, asegúrate de tener un archivo `.env.local` en la raíz del proyecto con las siguientes variables:
```
NEXT_PUBLIC_SUPABASE_URL=https://tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio
```

### Descripción de Conexiones y Relaciones
La comunicación entre el frontend y el backend se realizará a través de API REST o GraphQL. Se gestionará el estado en el cliente utilizando herramientas como Redux o Context API.

### Creación de Ramas Lógicas
#### Rama Frontend
- **Descripción**: Contiene todos los componentes y servicios del frontend.
- **Estructura**: Se detalla en la sección anterior.

#### Rama Backend
- **Descripción**: Contendrá los endpoints y la lógica de negocio.
- **Estructura**: Controladores, Modelos, Middleware.

#### Rama Base de Datos
- **Descripción**: Se espera que contenga esquemas y relaciones.

#### Rama Integraciones
- **Descripción**: Integraciones con servicios externos y APIs de terceros.

### Detalles Técnicos y Sugerencias de Mejora
Se recomienda definir la estructura del backend y las integraciones con APIs de terceros. Mantener el documento actualizado a medida que se realicen cambios en la estructura del proyecto. 