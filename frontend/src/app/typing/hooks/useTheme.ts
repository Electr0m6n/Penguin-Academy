import { useEffect, useState, useCallback } from 'react';
import { ThemeColors } from '../types';
import { themes } from '../constants/themes';

export function useTheme(initialTheme: string = 'stealth') {
  // Iniciar siempre con el tema inicial predeterminado
  const [currentTheme, setCurrentTheme] = useState<string>(initialTheme);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Efecto para cargar el tema guardado solo del lado del cliente
  useEffect(() => {
    setIsClient(true);
    const savedTheme = localStorage.getItem('penguintype_theme');
    
    // Verificar que el tema guardado exista en nuestra lista de temas
    if (savedTheme && themes.some(theme => theme.id === savedTheme)) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Cambiar el tema y guardarlo en localStorage
  const changeTheme = (themeId: string) => {
    setCurrentTheme(themeId);
    // Guardar en localStorage solo si estamos en el cliente
    if (isClient) {
      localStorage.setItem('penguintype_theme', themeId);
    }
  };

  // Obtener colores del tema actual (envuelto en useCallback)
  const getThemeColors = useCallback((): ThemeColors => {
    const theme = themes.find(t => t.id === currentTheme) || themes[0];
    return {
      correct: theme.colors[0],
      cursor: theme.colors[1],
      error: theme.colors[2],
      typed: theme.colors[2],
      background: theme.background
    };
  }, [currentTheme]); // Solo se recrea cuando cambia currentTheme

  // Aplicar el tema al cargar y cuando cambie
  useEffect(() => {
    if (isClient) {
      const themeColors = getThemeColors();
      document.body.style.backgroundColor = themeColors.background;
      
      // Limpiar al desmontar
      return () => {
        document.body.style.backgroundColor = '';
      };
    }
  }, [currentTheme, getThemeColors, isClient]);

  const toggleThemeSelector = () => {
    setShowThemeSelector(!showThemeSelector);
  };

  return {
    currentTheme,
    setCurrentTheme: changeTheme,
    showThemeSelector,
    setShowThemeSelector,
    toggleThemeSelector,
    getThemeColors,
    themes
  };
} 