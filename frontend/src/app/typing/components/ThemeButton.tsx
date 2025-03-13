'use client'

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check, X } from 'lucide-react';
import { Theme, ThemeColors } from '../types';

// Colores predeterminados seguros
const DEFAULT_THEME_COLORS: ThemeColors = {
  correct: '#777777',
  cursor: '#999999',
  error: '#FF5555',
  typed: '#FFFFFF',
  background: '#000000'
};

interface ThemeButtonProps {
  themes: Theme[];
  currentTheme: string;
  themeColors: ThemeColors;
  isActive: boolean;
  showThemeSelector: boolean;
  setShowThemeSelector: (show: boolean) => void;
  setCurrentTheme: (theme: string) => void;
  position?: 'top' | 'bottom';
}

export function ThemeButton({
  themes,
  currentTheme,
  themeColors,
  isActive,
  showThemeSelector,
  setShowThemeSelector,
  setCurrentTheme,
  position = 'bottom'
}: ThemeButtonProps) {
  const selectorRef = useRef<HTMLDivElement>(null);
  const [selectorPosition, setSelectorPosition] = useState<'left' | 'right'>('right');
  const [previewTheme, setPreviewTheme] = useState<string | null>(null);
  
  // Usar useMemo para obtener colores seguros que no cambien durante la renderización
  const safeColors = useMemo(() => {
    // Verificar si themeColors es válido y tiene todas las propiedades necesarias
    if (
      themeColors && 
      themeColors.correct && 
      themeColors.cursor && 
      themeColors.error && 
      themeColors.background
    ) {
      return themeColors;
    }
    // Si no es válido, usar colores predeterminados seguros
    return DEFAULT_THEME_COLORS;
  }, [themeColors]);
  
  // Aplicar tema de vista previa al hacer hover
  useEffect(() => {
    if (!previewTheme) return;
    
    // Guardar el tema original para restaurarlo
    const originalBackgroundColor = document.body.style.backgroundColor;
    
    // Obtener colores del tema de vista previa
    const theme = themes.find(t => t.id === previewTheme);
    if (theme) {
      document.body.style.backgroundColor = theme.background;
    }
    
    // Restaurar cuando se desmonte o cambie
    return () => {
      document.body.style.backgroundColor = originalBackgroundColor;
    };
  }, [previewTheme, themes]);
  
  // Detectar si estamos cerca del borde derecho de la pantalla
  useEffect(() => {
    if (!showThemeSelector || !selectorRef.current) return;

    const checkPosition = () => {
      const rect = selectorRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const isMobile = window.innerWidth < 768;
      // En móviles, colocamos el selector a la izquierda siempre
      if (isMobile) {
        setSelectorPosition('left');
      } else {
        setSelectorPosition('right');
      }
    };
    
    checkPosition();
    window.addEventListener('resize', checkPosition);
    
    return () => {
      window.removeEventListener('resize', checkPosition);
    };
  }, [showThemeSelector]);
  
  // Cerrar el selector cuando se hace clic fuera
  useEffect(() => {
    if (!showThemeSelector) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setShowThemeSelector(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showThemeSelector, setShowThemeSelector]);
  
  // Estilos condicionales basados en la posición
  const containerClassName = position === 'top' 
    ? `relative` 
    : `fixed bottom-6 right-6 z-50 transition-opacity duration-300 ${
        isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`;
  
  // Clase para la posición del selector
  const selectorClassName = `absolute top-full ${selectorPosition === 'left' ? 'right-auto left-0' : 'left-auto right-0'} mt-2 backdrop-blur-md rounded-lg border p-2 w-56 max-h-[70vh] overflow-y-auto z-50`;
  
  // Obtener colores actuales (ya sea el tema de preview o el tema actual)
  const activeThemeColors = previewTheme 
    ? themes.find(t => t.id === previewTheme)?.colors[0] 
      ? {
          correct: themes.find(t => t.id === previewTheme)!.colors[0],
          cursor: themes.find(t => t.id === previewTheme)!.colors[1],
          error: themes.find(t => t.id === previewTheme)!.colors[2],
          background: themes.find(t => t.id === previewTheme)!.background
        }
      : safeColors
    : safeColors;
  
  return (
    <div className={containerClassName} ref={selectorRef}>
      {/* Selector de temas */}
      <AnimatePresence>
        {showThemeSelector && (
          <motion.div 
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={selectorClassName}
            style={{ 
              backgroundColor: `${activeThemeColors.background}EE`,
              borderColor: `${activeThemeColors.correct}30`,
              boxShadow: `0 4px 20px ${activeThemeColors.background}CC, 0 0 10px ${activeThemeColors.correct}20`
            }}
            onMouseLeave={() => setPreviewTheme(null)}
          >
            <div className="flex justify-between items-center mb-2 sticky top-0 pb-1 bg-opacity-90" 
                 style={{ 
                   borderBottom: `1px solid ${activeThemeColors.correct}20`, 
                   backgroundColor: activeThemeColors.background 
                 }}>
              <h3 className="text-white text-xs font-medium flex items-center">
                <Palette size={12} className="mr-1" style={{ color: activeThemeColors.correct }} />
                Seleccionar tema
              </h3>
              <button 
                onClick={() => setShowThemeSelector(false)}
                className="text-gray-400 hover:text-white p-0.5"
                onMouseEnter={() => setPreviewTheme(null)}
              >
                <X size={14} />
              </button>
            </div>
            <div className="space-y-0.5">
              {themes.map((theme) => {
                // Determinar si este es el tema actualmente seleccionado
                const isSelected = currentTheme === theme.id;
                // Crear colores de tema para estilar este botón específico
                const thisThemeColors = {
                  correct: theme.colors[0],
                  cursor: theme.colors[1],
                  error: theme.colors[2],
                  background: theme.background
                };
                
                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setCurrentTheme(theme.id);
                      setPreviewTheme(null);
                      // Opcionalmente cerrar después de seleccionar
                      // setShowThemeSelector(false);
                    }}
                    onMouseEnter={() => setPreviewTheme(theme.id)}
                    onMouseLeave={() => setPreviewTheme(null)}
                    className={`flex items-center justify-between w-full px-2 py-1.5 rounded text-left text-xs transition-colors duration-150 ${
                      isSelected ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
                    style={{ 
                      backgroundColor: isSelected ? `${thisThemeColors.correct}20` : 'transparent',
                      borderLeft: isSelected ? `2px solid ${thisThemeColors.correct}` : '2px solid transparent',
                    }}
                  >
                    <div className="flex items-center">
                      {isSelected && (
                        <div className="mr-1" style={{ color: thisThemeColors.correct }}>
                          <Check size={10} />
                        </div>
                      )}
                      <span className="text-gray-200 truncate max-w-[110px]">{theme.name}</span>
                    </div>
                    <div className="flex space-x-0.5">
                      {theme.colors.map((color, i) => (
                        <div 
                          key={i} 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Botón para mostrar/ocultar selector de temas (solo icono) */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowThemeSelector(!showThemeSelector)}
        className="relative p-2 text-zinc-400 hover:text-white transition-colors"
        style={{ color: showThemeSelector 
          ? activeThemeColors.correct 
          : themes.find(t => t.id === currentTheme)?.colors[0] || undefined 
        }}
        aria-label="Cambiar tema"
      >
        <Palette size={22} />
      </motion.button>
    </div>
  );
}