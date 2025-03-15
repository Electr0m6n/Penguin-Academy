'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, X, Award, CheckCircle2, Star } from 'lucide-react'

// Añadir estilos personalizados para animaciones
const customStyles = `
  @keyframes pulse-slow {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.85;
    }
  }
  
  @keyframes bounce-slow {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-4px);
    }
  }
  
  .animate-pulse-slow {
    animation: pulse-slow 2s ease-in-out infinite;
  }
  
  .animate-bounce-slow {
    animation: bounce-slow 2s ease-in-out infinite;
  }
  
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
  
  .animate-shimmer {
    background: linear-gradient(
      90deg, 
      rgba(255, 255, 255, 0) 0%, 
      rgba(255, 255, 255, 0.3) 25%, 
      rgba(255, 255, 255, 0.3) 50%, 
      rgba(255, 255, 255, 0) 100%
    );
    background-size: 200% 100%;
    animation: shimmer 3s linear infinite;
  }

  /* Estilo del fondo con variables para los colores */
  :root {
    --grid-color: var(--grid-color-value, 60, 90, 180);
    --smoke-color: var(--smoke-color-value, 80, 120, 220);
    --background-darkness: var(--background-darkness-value, 0.97);
  }
  
  /* Fondo global oscurecido */
  .global-background-darkener {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      ellipse at 50% 50%,
      rgba(0, 0, 0, 0.7) 0%,
      rgba(0, 0, 0, 0.8) 70%,
      rgba(0, 0, 0, 0.9) 100%
    );
    z-index: 0;
    pointer-events: none;
  }
  
  /* Cuadrícula global para toda la página */
  .global-grid-background {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-size: 25px 25px;
    background-image: linear-gradient(rgba(var(--grid-color), 0.03) 1px, transparent 1px),
                     linear-gradient(90deg, rgba(var(--grid-color), 0.03) 1px, transparent 1px);
    z-index: 0;
    opacity: 0.7;
    pointer-events: none;
    transform-origin: center;
    animation: grid-pulse 15s ease-in-out infinite;
  }
  
  .global-grid-small {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-size: 5px 5px;
    background-image: linear-gradient(rgba(var(--grid-color), 0.02) 1px, transparent 1px),
                     linear-gradient(90deg, rgba(var(--grid-color), 0.02) 1px, transparent 1px);
    z-index: 0;
    opacity: 0.5;
    pointer-events: none;
  }
  
  .global-grid-micro {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-size: 2px 2px;
    background-image: linear-gradient(rgba(var(--grid-color), 0.01) 1px, transparent 1px),
                     linear-gradient(90deg, rgba(var(--grid-color), 0.01) 1px, transparent 1px);
    z-index: 0;
    opacity: 0.3;
    pointer-events: none;
  }
  
  /* Animación más sutil para la cuadrícula */
  @keyframes grid-pulse {
    0%, 100% {
      opacity: 0.7;
      background-size: 25px 25px;
    }
    50% {
      opacity: 0.8;
      background-size: 25px 25px;
    }
  }
  
  /* Ajustar bruma azul para que cubra todo */
  .blue-haze {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: 
      radial-gradient(
        ellipse at 15% 50%,
        rgba(20, 40, 130, 0.05) 0%,
        rgba(20, 40, 130, 0.02) 50%,
        rgba(20, 40, 130, 0) 90%
      ),
      radial-gradient(
        ellipse at 85% 50%,
        rgba(30, 64, 144, 0.07) 0%,
        rgba(30, 64, 144, 0.03) 50%,
        rgba(30, 64, 144, 0) 90%
      );
    z-index: 0;
    pointer-events: none;
    mix-blend-mode: screen;
  }
  
  /* Bottom fog para toda la página */
  .global-bottom-fog {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40%;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(var(--smoke-color), 0.05) 20%,
      rgba(var(--smoke-color), 0.1) 40%,
      rgba(var(--smoke-color), 0.15) 60%,
      rgba(var(--smoke-color), 0.2) 80%,
      rgba(var(--smoke-color), 0.25) 100%
    );
    filter: blur(20px);
    opacity: 0.7;
    mix-blend-mode: screen;
    pointer-events: none;
    z-index: 1;
  }
  
  .smoke-effect {
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle at var(--x, 50%) var(--y, 50%),
      rgba(var(--smoke-color), 0.15) 0%,
      rgba(var(--smoke-color), 0.1) 20%,
      rgba(var(--smoke-color), 0.05) 40%,
      transparent 60%
    );
    filter: blur(40px);
    opacity: 0.8;
    mix-blend-mode: screen;
    animation: smoke-drift 20s infinite linear;
    pointer-events: none;
  }

  .smoke-effect:nth-child(1) {
    --x: 30%;
    --y: 40%;
    animation-delay: -5s;
    animation-duration: 25s;
    opacity: 0.6;
  }

  .smoke-effect:nth-child(2) {
    --x: 70%;
    --y: 60%;
    animation-delay: -10s;
    animation-duration: 30s;
    opacity: 0.5;
  }

  .smoke-effect:nth-child(3) {
    --x: 50%;
    --y: 30%;
    animation-delay: -15s;
    animation-duration: 35s;
    opacity: 0.4;
  }

  .smoke-effect:nth-child(4) {
    --x: 20%;
    --y: 70%;
    animation-delay: -20s;
    animation-duration: 40s;
    opacity: 0.3;
  }

  .smoke-effect:nth-child(5) {
    --x: 80%;
    --y: 20%;
    animation-delay: -25s;
    animation-duration: 45s;
    opacity: 0.2;
  }

  @keyframes smoke-drift {
    0% {
      transform: translate(0, 0) scale(1) rotate(0deg);
    }
    25% {
      transform: translate(5%, 5%) scale(1.1) rotate(5deg);
    }
    50% {
      transform: translate(-5%, -5%) scale(0.9) rotate(-5deg);
    }
    75% {
      transform: translate(5%, -5%) scale(1.1) rotate(5deg);
    }
    100% {
      transform: translate(0, 0) scale(1) rotate(0deg);
    }
  }

  .smoke-cloud {
    position: absolute;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(
        ellipse at var(--x1, 30%) var(--y1, 40%),
        rgba(var(--smoke-color), 0.1) 0%,
        transparent 50%
      ),
      radial-gradient(
        ellipse at var(--x2, 70%) var(--y2, 60%),
        rgba(var(--smoke-color), 0.08) 0%,
        transparent 40%
      ),
      radial-gradient(
        ellipse at var(--x3, 50%) var(--y3, 30%),
        rgba(var(--smoke-color), 0.06) 0%,
        transparent 30%
      );
    filter: blur(30px);
    opacity: 0.6;
    mix-blend-mode: screen;
    animation: smoke-cloud-drift 30s infinite linear;
    pointer-events: none;
  }

  .smoke-cloud:nth-child(1) {
    --x1: 30%;
    --y1: 40%;
    --x2: 70%;
    --y2: 60%;
    --x3: 50%;
    --y3: 30%;
    animation-delay: -5s;
    animation-duration: 35s;
  }

  .smoke-cloud:nth-child(2) {
    --x1: 70%;
    --y1: 30%;
    --x2: 30%;
    --y2: 70%;
    --x3: 60%;
    --y3: 50%;
    animation-delay: -15s;
    animation-duration: 40s;
  }

  @keyframes smoke-cloud-drift {
    0% {
      transform: translate(0, 0) scale(1) rotate(0deg);
    }
    25% {
      transform: translate(3%, 3%) scale(1.05) rotate(3deg);
    }
    50% {
      transform: translate(-3%, -3%) scale(0.95) rotate(-3deg);
    }
    75% {
      transform: translate(3%, -3%) scale(1.05) rotate(3deg);
    }
    100% {
      transform: translate(0, 0) scale(1) rotate(0deg);
    }
  }

  .bottom-fog {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40%;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(var(--smoke-color), 0.05) 20%,
      rgba(var(--smoke-color), 0.1) 40%,
      rgba(var(--smoke-color), 0.15) 60%,
      rgba(var(--smoke-color), 0.2) 80%,
      rgba(var(--smoke-color), 0.25) 100%
    );
    filter: blur(20px);
    opacity: 0.7;
    mix-blend-mode: screen;
    pointer-events: none;
  }

  .notification-backdrop {
    backdrop-filter: blur(5px);
    background: radial-gradient(
      circle at center,
      rgba(0, 0, 0, 0.7) 0%,
      rgba(10, 10, 30, 0.9) 80%
    );
  }

  .text-glow {
    text-shadow: 0 0 10px rgba(74, 222, 128, 0.6);
  }
  
  .text-glow-bright {
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.8),
                0 0 20px rgba(74, 222, 128, 0.9);
  }
  
  .glow-pulse {
    animation: glow-pulse 2.5s ease-in-out infinite;
  }

  @keyframes glow-pulse {
    0%, 100% {
      filter: brightness(1);
    }
    50% {
      filter: brightness(1.3);
    }
  }

  @keyframes rotate-slow {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  .rotate-slow {
    animation: rotate-slow 8s linear infinite;
  }

  .shadow-glow {
    box-shadow: 0 0 20px rgba(74, 222, 128, 0.4), 
                0 0 40px rgba(74, 222, 128, 0.2);
  }

  .shadow-glow-intense {
    box-shadow: 0 0 25px rgba(93, 156, 255, 0.5), 
                0 0 50px rgba(93, 156, 255, 0.3),
                0 0 75px rgba(93, 156, 255, 0.2);
  }
`;

// Hooks personalizados
import { useTheme } from './hooks/useTheme'
import { useTypingTest } from './hooks/useTypingTest'
import { useSupabase } from './hooks/useSupabase'

// Componentes
import { UserProfile } from './components/UserProfile'
import { Leaderboard } from './components/Leaderboard'

// Nuevos componentes
import { Header } from './components/Layout/Header'
import { TimeSelector } from './components/Layout/TimeSelector'
import { TextDisplay } from './components/TypingArea/TextDisplay'
import { TypingInput } from './components/TypingArea/TypingInput'
import { RealTimeChart } from './components/Chart/RealTimeChart'
import { ResultsChart } from './components/Chart/ResultsChart'

export default function TypingPage() {
  // Estado para controlar la hidratación
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Estado para controlar la visualización de la gráfica en tiempo real
  const [showRealTimeChart, setShowRealTimeChart] = useState(false);
  
  // Estado para mostrar la notificación de mejora de marca
  const [showTopScoreAlert, setShowTopScoreAlert] = useState(false);
  const [topScoreData, setTopScoreData] = useState({ wpm: 0, accuracy: 0 });
  
  // Hook de tema
  const {
    currentTheme,
    setCurrentTheme,
    showThemeSelector,
    setShowThemeSelector,
    getThemeColors,
    themes
  } = useTheme();
  
  // Hook de prueba de tipeo
  const {
    text,
    targetText,
    startTime,
    endTime,
    wpm,
    accuracy,
    isActive,
    selectedTime,
    isCompetitiveMode,
    correctChars,
    incorrectChars,
    wpmHistory,
    accuracyHistory,
    showAccTooltip,
    setShowAccTooltip,
    textContainerRef,
    inputRef,
    handleTimeChange,
    handleInput,
    handleFocus,
    calculateCurrentWPM,
    calculateAccuracy,
    handleReset,
    handleSubmitScore,
    codeMode,
    setCodeMode,
    error
  } = useTypingTest();
  
  // Hook de Supabase
  const {
    currentUser,
    isLoadingUser,
    leaderboardData,
    showLeaderboard,
    toggleLeaderboard,
    isSubmittingScore,
    hasSubmittedScore,
    isInTop25,
    showUserProfile,
    setShowUserProfile,
    handleProfileClick
  } = useSupabase();
  
  // Obtener los colores del tema actual
  const themeColors = getThemeColors();
  
  // Detectar cuando la hidratación ha completado
  useEffect(() => {
    setIsHydrated(true);
    
    // Cargar la preferencia de la gráfica desde localStorage
    if (typeof window !== 'undefined') {
      const savedChartPreference = localStorage.getItem('penguintype_chart');
      if (savedChartPreference !== null) {
        setShowRealTimeChart(savedChartPreference === 'true');
      }
    }
    
    // Añadir estilos personalizados al documento
    const styleEl = document.createElement('style');
    styleEl.textContent = customStyles;
    document.head.appendChild(styleEl);
    
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  // Generar colores RGB para la cuadrícula y el humo basados en el tema
  const getGridColors = useCallback(() => {
    if (!isHydrated) return { gridRGB: '60, 90, 180', smokeRGB: '80, 100, 220' };
    
    const theme = themes.find(t => t.name === currentTheme);
    if (!theme) return { gridRGB: '60, 90, 180', smokeRGB: '80, 100, 220' };
    
    // Extraer colores del tema actual
    const correctColor = themeColors.correct;
    if (typeof correctColor !== 'string') return { gridRGB: '60, 90, 180', smokeRGB: '80, 100, 220' };
    
    // Limpiar el color si tiene formato con #
    const colorHex = correctColor.startsWith('#') ? correctColor.substring(1) : correctColor;
    
    const colorValues = {
      r: parseInt(colorHex.slice(0, 2), 16),
      g: parseInt(colorHex.slice(2, 4), 16),
      b: parseInt(colorHex.slice(4, 6), 16)
    };
    
    // Ajustar colores para dar un tono más futurista al fondo
    // Aumentar el componente azul para la cuadrícula
    const gridBlue = Math.min(255, colorValues.b + 60);
    const gridRGB = `${Math.floor(colorValues.r * 0.5)}, ${Math.floor(colorValues.g * 0.6)}, ${gridBlue}`;
    
    // Para el humo, usar un tono más azul violáceo
    const smokeRGB = `${Math.floor(colorValues.r * 0.4)}, ${Math.floor(colorValues.g * 0.3)}, ${Math.min(255, colorValues.b + 100)}`;
    
    return { gridRGB, smokeRGB };
  }, [isHydrated, currentTheme, themes, themeColors.correct]);
  
  const { gridRGB, smokeRGB } = getGridColors();

  // Usar estilos seguros para SSR hasta que se complete la hidratación
  const safeStyles = isHydrated ? {
    backgroundColor: themeColors.background,
    color: themeColors.correct
  } : {
    backgroundColor: '#000000', // Color predeterminado seguro para SSR
    color: '#777777'
  };
  
  // Variables CSS para los colores de la cuadrícula y el humo
  const backgroundVars = {
    '--grid-color-rgb': gridRGB,
    '--smoke-color-rgb': smokeRGB
  } as React.CSSProperties;

  // Botón de leaderboard
  const handleLeaderboardToggle = useCallback(() => {
    console.log('Botón de leaderboard presionado');
    toggleLeaderboard();
  }, [toggleLeaderboard]);

  // Memoizar la función handleSubmitScore para pasarla al componente Leaderboard
  const memoizedSubmitScore = useCallback(() => {
    handleSubmitScore();
  }, [handleSubmitScore]);

  // Efecto para forzar la actualización de la gráfica cuando cambia wpmHistory
  useEffect(() => {
    if (isActive && showRealTimeChart) {
      // Reducir la frecuencia de actualizaciones forzadas
      const timeoutId = setTimeout(() => {
        // No usamos graphUpdateCounter pero lo mantenemos para posibles futuras actualizaciones
      }, 300); // Actualizar solo cada 300ms para reducir parpadeo
      
      return () => clearTimeout(timeoutId);
    }
  }, [wpmHistory, isActive, showRealTimeChart]);

  // Efecto para forzar la actualización del texto cuando cambia el modo código
  useEffect(() => {
    // Solo registramos el cambio sin forzar renderizaciones
    if (codeMode !== undefined) {
      console.log(`Modo código cambiado a: ${codeMode ? 'código' : 'normal'}, targetText actualizado`);
    }
    // No incluimos targetText en las dependencias para evitar actualizaciones innecesarias
  }, [codeMode]);

  // Función para alternar la visibilidad de la gráfica y guardar en localStorage
  const handleToggleChart = useCallback(() => {
    setShowRealTimeChart(prev => {
      const newValue = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('penguintype_chart', newValue.toString());
      }
      return newValue;
    });
  }, []);
  
  // Función para alternar el modo código
  const handleToggleCodeMode = useCallback(() => {
    // Usar un único valor booleano para mayor claridad y menos complejidad
    const newMode = !codeMode;
    console.log(`Cambiando a modo: ${newMode ? 'código' : 'normal'}`);
    
    // Guardar en localStorage antes de actualizar el estado
    if (typeof window !== 'undefined') {
      localStorage.setItem('penguintype_code_mode', newMode.toString());
    }
    
    // Actualizar el modo - esto usará nuestra versión protegida en useTypingTest
    setCodeMode(newMode);
    
    // El reset se hará después automáticamente debido a los efectos en useTypingTest
  }, [codeMode, setCodeMode]);

  // Efecto para mostrar la notificación cuando se entra en el Top 25
  useEffect(() => {
    if (hasSubmittedScore && isInTop25) {
      console.log('Condiciones para mostrar alerta de Top 25 detectadas:', {
        hasSubmittedScore,
        isInTop25,
        showTopScoreAlert,
        wpm,
        accuracy
      });
      
      // Establecer los datos de la puntuación
      setTopScoreData({
        wpm: wpm || 0,
        accuracy: accuracy || 0
      });
      
      // Mostrar la notificación
      setShowTopScoreAlert(true);
      
      // Ocultar después de 8 segundos
      const timeout = setTimeout(() => {
        setShowTopScoreAlert(false);
      }, 8000);
      
      return () => clearTimeout(timeout);
    }
  }, [hasSubmittedScore, isInTop25, wpm, accuracy, showTopScoreAlert]);
  
  // Efecto para escuchar el evento personalizado de mejora de puntuación
  useEffect(() => {
    const handleScoreImproved = (event: CustomEvent) => {
      console.log('Evento scoreImproved recibido:', event.detail);
      
      // Establecer los datos de la puntuación
      setTopScoreData({
        wpm: event.detail.wpm || 0,
        accuracy: event.detail.accuracy || 0
      });
      
      // Mostrar la notificación
      setShowTopScoreAlert(true);
      
      // Ocultar después de 8 segundos
      setTimeout(() => {
        setShowTopScoreAlert(false);
      }, 8000);
    };
    
    // Añadir el listener
    window.addEventListener('scoreImproved', handleScoreImproved as EventListener);
    
    // Eliminar el listener cuando el componente se desmonte
    return () => {
      window.removeEventListener('scoreImproved', handleScoreImproved as EventListener);
    };
  }, []);
  
  // Efecto adicional para monitorear cambios en las variables relevantes
  useEffect(() => {
    console.log('Estado de variables para alerta Top 25:', {
      hasSubmittedScore,
      isInTop25,
      showTopScoreAlert,
      wpm,
      accuracy
    });
  }, [hasSubmittedScore, isInTop25, showTopScoreAlert, wpm, accuracy]);
  
  // Cerrar la notificación manualmente
  const handleCloseTopAlert = () => {
    setShowTopScoreAlert(false);
  };

  return (
    <div 
      className="relative isolate flex items-center justify-center min-h-screen w-full overflow-hidden"
      style={{ 
        backgroundColor: safeStyles.backgroundColor,
        ...backgroundVars 
      }}
    >
      {/* Efectos globales aplicados a toda la página */}
      <div className="global-background-darkener"></div>
      <div className="global-grid-background"></div>
      <div className="global-grid-small"></div>
      <div className="global-grid-micro"></div>
      <div className="blue-haze"></div>
      <div className="global-bottom-fog"></div>
      
      <div className="relative w-full h-full overflow-hidden">
      {/* Header con logo y botones */}
      <Header 
        isActive={isActive}
        isHydrated={isHydrated}
        themes={themes}
        currentTheme={currentTheme}
        showThemeSelector={showThemeSelector}
        setShowThemeSelector={setShowThemeSelector}
        setCurrentTheme={setCurrentTheme}
        safeStyles={safeStyles}
        themeColors={themeColors}
        isLoadingUser={isLoadingUser}
        currentUser={currentUser}
        handleProfileClick={handleProfileClick}
        handleLeaderboardToggle={handleLeaderboardToggle}
        handleReset={handleReset}
      />
      
      {/* Selector de tiempo */}
      <TimeSelector 
        isActive={isActive}
        isHydrated={isHydrated}
        selectedTime={selectedTime}
        isCompetitiveMode={isCompetitiveMode}
        showRealTimeChart={showRealTimeChart}
        themes={themes}
        currentTheme={currentTheme}
        handleTimeChange={handleTimeChange}
        handleToggleChart={handleToggleChart}
        codeMode={codeMode}
        handleToggleCodeMode={handleToggleCodeMode}
      />

      <div className="relative z-10 w-full flex flex-col items-center justify-center mt-12 pt-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full px-4 py-8"
        >
          {/* Área de texto para escribir */}
          <TextDisplay 
            text={text}
            targetText={targetText}
            textContainerRef={textContainerRef}
            handleFocus={handleFocus}
            isHydrated={isHydrated}
            themes={themes}
            currentTheme={currentTheme}
            themeColors={themeColors}
            codeMode={codeMode}
            showRealTimeChart={showRealTimeChart}
          />
            
          {/* Entrada de texto oculta */}
          <TypingInput 
            text={text}
            handleInput={handleInput}
            endTime={endTime}
            inputRef={inputRef}
          />
              
          {/* Gráfica en tiempo real */}
          {showRealTimeChart && isActive && (
            <RealTimeChart 
              wpmHistory={wpmHistory}
              accuracyHistory={accuracyHistory}
              safeStyles={safeStyles}
              isHydrated={isHydrated}
              isActive={isActive}
              startTime={startTime}
              text={text}
              targetText={targetText}
              calculateCurrentWPM={calculateCurrentWPM}
              calculateAccuracy={calculateAccuracy}
              codeMode={codeMode}
            />
          )}
          
          {/* Resultados del test */}
          <ResultsChart 
            wpmHistory={wpmHistory}
            accuracyHistory={accuracyHistory}
            safeStyles={safeStyles}
            isHydrated={isHydrated}
            endTime={endTime}
            startTime={startTime}
            selectedTime={selectedTime}
            calculateCurrentWPM={calculateCurrentWPM}
            correctChars={correctChars}
            incorrectChars={incorrectChars}
            showAccTooltip={showAccTooltip}
            setShowAccTooltip={setShowAccTooltip}
            handleReset={handleReset}
          />
          
          {/* Instrucciones (solo visibles al inicio) */}
          {!startTime && !isActive && (
            <div className="text-center text-gray-400 text-sm mt-4">
              
            </div>
          )}
        </motion.div>
      </div>
        
        {/* Notificación de Top 25 */}
        <AnimatePresence>
          {showTopScoreAlert && (
            <motion.div
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="fixed top-20 right-4 z-[90] max-w-xs sm:max-w-sm md:max-w-md overflow-hidden rounded-lg"
              style={{ boxShadow: `0 0 15px rgba(72, 187, 120, 0.5)` }}
            >
              {/* Container principal con marco */}
              <div className="relative border border-green-400/40 rounded-lg overflow-hidden">
                {/* Grid grande */}
                <div className="absolute inset-0 opacity-20" style={{ 
                  backgroundSize: '25px 25px',
                  backgroundImage: 'linear-gradient(to right, rgba(72, 187, 120, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(72, 187, 120, 0.1) 1px, transparent 1px)',
                  zIndex: 0
                }}></div>
                
                {/* Grid pequeño */}
                <div className="absolute inset-0 opacity-10" style={{ 
                  backgroundSize: '5px 5px',
                  backgroundImage: 'linear-gradient(to right, rgba(72, 187, 120, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(72, 187, 120, 0.1) 1px, transparent 1px)',
                  zIndex: 0
                }}></div>
                
                {/* Efecto shimmer minimalista */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/10 to-transparent animate-shimmer z-10"></div>
                
                {/* Contenido principal */}
                <div className="bg-black/80 backdrop-blur-md p-5 relative z-20">
                  {/* Insignia TOP */}
                  <div className="absolute -top-3 -right-3 bg-green-400 rounded-full w-8 h-8 flex items-center justify-center animate-bounce-slow shadow-lg">
                    <span className="text-black font-bold text-xs">TOP</span>
                  </div>
                  
                  {/* Encabezado */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-full p-2 border border-green-500/40">
                        <Trophy className="h-6 w-6 text-green-200" />
                      </div>
                      <h3 className="text-xl font-bold text-green-400 text-glow">¡Has mejorado tu marca!</h3>
                    </div>
                    <button 
                      onClick={handleCloseTopAlert}
                      className="text-gray-400 hover:text-white bg-black/50 rounded-full p-1.5 transition-all hover:bg-black/70"
                      style={{ boxShadow: `0 0 10px rgba(72, 187, 120, 0.2)` }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                  
                  {/* Contenido */}
                  <div className="mt-4 pl-11">
                    <p className="text-green-200 mb-4 font-mono">
                      ¡Felicidades! Tu puntuación ha entrado en el Top 25.
                    </p>
                    
                    {/* WPM Card */}
                    <div className="flex items-center justify-between mb-4 
                                   bg-black/60 rounded-lg p-4 border border-green-500/30 relative overflow-hidden backdrop-blur-sm">
                      {/* Grid pequeño interior */}
                      <div className="absolute inset-0 opacity-20" style={{ 
                        backgroundSize: '8px 8px',
                        backgroundImage: 'linear-gradient(to right, rgba(72, 187, 120, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(72, 187, 120, 0.1) 1px, transparent 1px)',
                        zIndex: 0
                      }}></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent animate-pulse-slow"></div>
                      <div className="flex items-center space-x-3 z-10">
                        <Award className="text-green-400 h-6 w-6" />
                        <span className="text-green-200 font-medium">WPM</span>
                      </div>
                      <span className="font-mono text-3xl font-bold text-green-400 z-10 text-glow">
                        {topScoreData.wpm}
                      </span>
                    </div>
                    
                    {/* Precisión Card */}
                    <div className="flex items-center justify-between mb-2
                                   bg-black/60 rounded-lg p-4 border border-green-500/30 relative overflow-hidden backdrop-blur-sm">
                      {/* Grid pequeño interior */}
                      <div className="absolute inset-0 opacity-20" style={{ 
                        backgroundSize: '8px 8px',
                        backgroundImage: 'linear-gradient(to right, rgba(72, 187, 120, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(72, 187, 120, 0.1) 1px, transparent 1px)',
                        zIndex: 0
                      }}></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                      <div className="flex items-center space-x-3 z-10">
                        <CheckCircle2 className="text-green-400 h-6 w-6" />
                        <span className="text-green-200 font-medium">Precisión</span>
                      </div>
                      <span className="font-mono text-3xl font-bold text-green-400 z-10 text-glow">
                        {topScoreData.accuracy}%
                      </span>
                    </div>
                    
                    {/* Mensaje motivacional */}
                    <div className="mt-6 text-center">
                      <div className="inline-flex items-center space-x-2 bg-green-900/20 text-green-200 text-sm px-4 py-2 rounded-full border border-green-500/30">
                        <Star className="h-4 w-4 text-green-300 animate-pulse-slow" />
                        <p className="font-mono">Sigue practicando para mejorar tu posición</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      
      {/* Modal del Leaderboard */}
      {showLeaderboard && (
        <Leaderboard
          show={true}
          onClose={handleLeaderboardToggle}
          data={leaderboardData}
          themeColors={themeColors}
          endTime={endTime}
          hasSubmittedScore={hasSubmittedScore}
          isInTop25={isInTop25}
          isSubmittingScore={isSubmittingScore}
          isCompetitiveMode={isCompetitiveMode}
          handleSubmitScore={memoizedSubmitScore}
          wpm={wpm}
          accuracy={accuracy}
        />
      )}
      
      {/* Modal de perfil de usuario */}
      {showUserProfile && (
        <UserProfile
          show={true}
          onClose={() => setShowUserProfile(false)}
          user={currentUser}
          themeColors={themeColors}
          onLeaderboardClick={handleLeaderboardToggle}
        />
      )}
        
        {/* Mostrar mensajes de error */}
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-500/90 text-white px-4 py-2 rounded-lg shadow-lg font-mono z-50">
            {error}
          </div>
        )}
      </div>
    </div>
  )
} 