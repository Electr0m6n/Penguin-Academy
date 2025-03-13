'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'

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
    calculateFinalAccuracy,
    handleReset,
    handleSubmitScore,
    calculateAccuracy
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
  }, []);

  // Usar estilos seguros para SSR hasta que se complete la hidratación
  const safeStyles = isHydrated ? {
    backgroundColor: themeColors.background,
    color: themeColors.correct
  } : {
    backgroundColor: '#000000', // Color predeterminado seguro para SSR
    color: '#777777'
  };

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

  return (
    <div 
      className="relative isolate flex items-center justify-center min-h-screen w-full"
      style={{ backgroundColor: safeStyles.backgroundColor }}
    >
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
      />

      <div className="relative z-10 w-full flex flex-col items-center justify-center">
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
              themes={themes}
              currentTheme={currentTheme}
              isActive={isActive}
              startTime={startTime}
              text={text}
              targetText={targetText}
              calculateCurrentWPM={calculateCurrentWPM}
              calculateAccuracy={calculateAccuracy}
            />
          )}
          
          {/* Resultados del test */}
          <ResultsChart 
            wpmHistory={wpmHistory}
            accuracyHistory={accuracyHistory}
            safeStyles={safeStyles}
            isHydrated={isHydrated}
            themes={themes}
            currentTheme={currentTheme}
            endTime={endTime}
            startTime={startTime}
            selectedTime={selectedTime}
            calculateCurrentWPM={calculateCurrentWPM}
            calculateFinalAccuracy={calculateFinalAccuracy}
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
    </div>
  )
} 