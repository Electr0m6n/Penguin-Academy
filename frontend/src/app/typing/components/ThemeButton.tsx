'use client'

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check, X, Sparkles, Heart, Star, Moon, Sun } from 'lucide-react';
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
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [recentlySelected, setRecentlySelected] = useState<string[]>([]);

  // Organizar temas en categorías para mejor navegación
  const themeCategories = useMemo(() => {
    // Puedes categorizar tus temas como prefieras
    // Por ejemplo: oscuros, claros, coloridos, neón, etc.
    const categories: {[key: string]: Theme[]} = {
      'Favoritos': [],
      'Oscuros': [],
      'Claros': [],
      'Coloridos': [],
      'Especiales': []
    };

    // Obtener los últimos 3 temas usados para la sección de favoritos
    const recents = [...recentlySelected];
    
    themes.forEach(theme => {
      // Añadir a favoritos si está en recientes
      if (recents.includes(theme.id)) {
        categories['Favoritos'].push(theme);
      }
      
      // Lógica simple para categorizar (puedes personalizarla)
      const isLight = theme.background.match(/#[a-fA-F0-9]{6}/) && 
                     parseInt(theme.background.substring(1), 16) > 0x7FFFFF;
                     
      const isColorful = theme.colors.some(color => 
        color.match(/#[a-fA-F0-9]{6}/) && 
        (parseInt(color.substring(1, 3), 16) > 200 || 
         parseInt(color.substring(3, 5), 16) > 200 || 
         parseInt(color.substring(5, 7), 16) > 200)
      );
      
      if (theme.name.toLowerCase().includes('neón') || 
          theme.name.toLowerCase().includes('neon') ||
          theme.name.toLowerCase().includes('special')) {
        categories['Especiales'].push(theme);
      } else if (isLight) {
        categories['Claros'].push(theme);
      } else if (isColorful) {
        categories['Coloridos'].push(theme);
      } else {
        categories['Oscuros'].push(theme);
      }
    });
    
    // Limpiar categorías vacías
    Object.keys(categories).forEach(key => {
      if (categories[key].length === 0) {
        delete categories[key];
      }
    });
    
    return categories;
  }, [themes, recentlySelected]);
  
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
  
  // Guardar tema recientemente seleccionado
  useEffect(() => {
    if (!currentTheme) return;
    
    setRecentlySelected(prev => {
      // Evitar duplicados - eliminar el currentTheme si ya existe
      const filtered = prev.filter(id => id !== currentTheme);
      // Añadir al principio y limitar a 3 elementos
      return [currentTheme, ...filtered].slice(0, 3);
    });
  }, [currentTheme]);
  
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
    : `fixed bottom-6 right-6 z-[100] transition-opacity duration-300 ${
        isActive ? 'opacity-10 hover:opacity-100' : 'opacity-100'
      }`;
  
  // Clase para la posición del selector
  const selectorClassName = `absolute top-full ${selectorPosition === 'left' ? 'right-auto left-0' : 'left-auto right-0'} mt-2 backdrop-blur-md rounded-lg border p-3 w-64 max-h-[70vh] overflow-y-auto z-50`;
  
  // Obtener colores actuales (ya sea el tema de preview o el tema actual)
  const activeThemeColors = previewTheme 
    ? themes.find(t => t.id === previewTheme)?.colors[0] 
      ? {
          correct: themes.find(t => t.id === previewTheme)!.colors[0],
          cursor: themes.find(t => t.id === previewTheme)!.colors[1],
          error: themes.find(t => t.id === previewTheme)!.colors[2],
          background: themes.find(t => t.id === previewTheme)!.background,
          typed: themes.find(t => t.id === previewTheme)!.colors[0]
        }
      : safeColors
    : safeColors;
    
  // Obtener un ícono para cada categoría
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'Favoritos': return <Heart size={14} className="mr-1.5" />;
      case 'Oscuros': return <Moon size={14} className="mr-1.5" />;
      case 'Claros': return <Sun size={14} className="mr-1.5" />;
      case 'Coloridos': return <Palette size={14} className="mr-1.5" />;
      case 'Especiales': return <Sparkles size={14} className="mr-1.5" />;
      default: return <Star size={14} className="mr-1.5" />;
    }
  };
  
  return (
    <div className={containerClassName} ref={selectorRef}>
      {/* Selector de temas */}
      <AnimatePresence>
        {showThemeSelector && (
          <motion.div 
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={selectorClassName}
            style={{ 
              backgroundColor: `${activeThemeColors.background}EE`,
              borderColor: `${activeThemeColors.correct}40`,
              boxShadow: `0 4px 20px ${activeThemeColors.background}CC, 0 0 10px ${activeThemeColors.correct}40`
            }}
            onMouseLeave={() => setPreviewTheme(null)}
          >
            {/* Cabecera del selector */}
            <div className="flex justify-between items-center mb-3 sticky top-0 pb-2 bg-opacity-90" 
                 style={{ 
                   borderBottom: `1px solid ${activeThemeColors.correct}30`, 
                   backgroundColor: activeThemeColors.background 
                 }}>
              <h3 className="text-white text-sm font-mono font-medium flex items-center" style={{ color: activeThemeColors.correct }}>
                <Palette size={16} className="mr-1.5" />
                Seleccionar Tema
              </h3>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowThemeSelector(false)}
                className="text-gray-400 hover:text-white p-1 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
                onMouseEnter={() => setPreviewTheme(null)}
              >
                <X size={14} />
              </motion.button>
            </div>
            
            {/* Navegación por categorías */}
            <div className="flex gap-1 mb-3 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {Object.keys(themeCategories).map(category => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(activeCategory === category ? null : category)}
                  className={`px-2 py-1 rounded-md text-xs font-mono flex items-center whitespace-nowrap ${
                    activeCategory === category ? 'text-black' : 'text-white'
                  }`}
                  style={{ 
                    backgroundColor: activeCategory === category 
                      ? activeThemeColors.correct 
                      : `${activeThemeColors.correct}20`
                  }}
                >
                  {getCategoryIcon(category)}
                  {category}
                </motion.button>
              ))}
            </div>
            
            {/* Lista de temas */}
            <div className="space-y-1">
              <AnimatePresence mode="wait">
                {Object.entries(themeCategories).map(([category, categoryThemes]) => {
                  // Solo mostrar la categoría activa, o todas si no hay categoría activa
                  if (activeCategory !== null && activeCategory !== category) {
                    return null;
                  }
                  
                  return (
                    <motion.div 
                      key={category}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      {/* Mostrar categoría sólo si hay múltiples categorías visibles */}
                      {activeCategory === null && (
                        <h4 className="text-xs font-mono font-medium px-1 py-1 mb-1 text-gray-400 flex items-center">
                          {getCategoryIcon(category)}
                          {category}
                        </h4>
                      )}
                      
                      {/* Temas en esta categoría */}
                      {categoryThemes.map((theme, index) => {
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
                          <motion.button
                            key={theme.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            onClick={() => {
                              setCurrentTheme(theme.id);
                              setPreviewTheme(null);
                              // Opcionalmente cerrar después de seleccionar
                              // setShowThemeSelector(false);
                            }}
                            onMouseEnter={() => setPreviewTheme(theme.id)}
                            onMouseLeave={() => setPreviewTheme(null)}
                            className={`flex items-center justify-between w-full px-2.5 py-2 rounded-md text-left text-xs font-mono transition-all duration-200 ${
                              isSelected ? 'bg-white/10' : 'hover:bg-white/5'
                            }`}
                            style={{ 
                              backgroundColor: isSelected ? `${thisThemeColors.correct}15` : 'transparent',
                              borderLeft: isSelected ? `3px solid ${thisThemeColors.correct}` : '3px solid transparent',
                              boxShadow: isSelected ? `0 0 10px ${thisThemeColors.correct}20 inset` : 'none'
                            }}
                          >
                            <div className="flex items-center">
                              {isSelected && (
                                <motion.div 
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="mr-1.5 flex" 
                                  style={{ color: thisThemeColors.correct }}
                                >
                                  <Check size={14} />
                                </motion.div>
                              )}
                              <span className="text-gray-200 truncate max-w-[110px]" style={{ 
                                color: isSelected ? thisThemeColors.correct : undefined,
                                fontWeight: isSelected ? 'bold' : 'normal'
                              }}>
                                {theme.name}
                              </span>
                            </div>
                            
                            {/* Muestras de color */}
                            <div className="flex space-x-1">
                              {theme.colors.map((color, i) => (
                                <motion.div 
                                  key={i} 
                                  whileHover={{ scale: 1.2 }}
                                  className="w-3.5 h-3.5 rounded-full border border-white/10" 
                                  style={{ 
                                    backgroundColor: color,
                                    boxShadow: `0 0 4px ${color}80`
                                  }}
                                />
                              ))}
                            </div>
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Botón para mostrar/ocultar selector de temas */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowThemeSelector(!showThemeSelector)}
        className={`relative p-2.5 rounded-full flex items-center justify-center transition-all duration-300 ${
          showThemeSelector ? 'bg-black/30 text-white' : 'text-zinc-400 hover:text-white'
        }`}
        style={{ 
          color: showThemeSelector 
            ? activeThemeColors.correct 
            : themes.find(t => t.id === currentTheme)?.colors[0] || undefined,
          boxShadow: showThemeSelector ? `0 0 15px ${activeThemeColors.correct}60` : 'none',
          border: showThemeSelector ? `1px solid ${activeThemeColors.correct}40` : '1px solid transparent'
        }}
        aria-label="Cambiar tema"
      >
        <div className="relative">
          <Palette size={20} />
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            className="absolute -top-1 -right-1 text-yellow-400"
            style={{ display: showThemeSelector ? 'none' : 'block' }}
          >
            <Sparkles size={10} />
          </motion.div>
        </div>
      </motion.button>
    </div>
  );
}