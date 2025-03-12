'use client'

import { useEffect } from 'react'

export default function TypingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Ocultar el header principal cuando se carga la página de typing
  useEffect(() => {
    // Ocultar el header principal
    const mainHeader = document.querySelector('header');
    if (mainHeader) {
      mainHeader.style.display = 'none';
    }
    
    // Ajustar el padding del main para compensar la ausencia del header
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.style.paddingTop = '0';
      // Asegurar que el main ocupe toda la pantalla
      mainElement.style.height = '100vh';
      mainElement.style.maxHeight = '100vh';
      mainElement.style.overflow = 'hidden';
    }
    
    // Restaurar el header cuando se desmonte el componente
    return () => {
      if (mainHeader) {
        mainHeader.style.display = '';
      }
      if (mainElement) {
        mainElement.style.paddingTop = '';
        mainElement.style.height = '';
        mainElement.style.maxHeight = '';
        mainElement.style.overflow = '';
      }
    };
  }, []);

  return (
    <section className="flex items-center justify-center min-h-screen w-full bg-black overflow-hidden">
      {children}
    </section>
  )
} 