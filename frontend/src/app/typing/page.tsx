'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { Line } from 'react-chartjs-2'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Keyboard, Crown, User, Trophy } from 'lucide-react'

// Hooks personalizados
import { useTheme } from './hooks/useTheme'
import { useTypingTest } from './hooks/useTypingTest'
import { useSupabase } from './hooks/useSupabase'

// Componentes
import { ThemeButton } from './components/ThemeButton'
import { UserProfile } from './components/UserProfile'
import { Leaderboard } from './components/Leaderboard'

export default function TypingPage() {
  // Estado para controlar la hidratación
  const [isHydrated, setIsHydrated] = useState(false);
  
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
    handleSubmitScore
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
  }, []);

  // Usar estilos seguros para SSR hasta que se complete la hidratación
  const safeStyles = isHydrated ? {
    backgroundColor: themeColors.background,
    color: themeColors.correct
  } : {
    backgroundColor: '#000000', // Color predeterminado seguro para SSR
    color: '#777777'
  };
  
  // Función para obtener datos del gráfico
  const getChartData = () => {
    // Si no hay datos suficientes o no está hidratado, devolver un dataset vacío
    if (!isHydrated || wpmHistory.length <= 1 || accuracyHistory.length <= 1) {
      return {
        labels: [],
        datasets: []
      };
    }
    
    const validWpmHistory = wpmHistory.filter(entry => !isNaN(entry.wpm) && entry.wpm !== 0);
    const labels = validWpmHistory.map((entry, index) => `${index + 1}s`);
    
    return {
      labels,
      datasets: [
        {
          label: 'WPM',
          // Usar valores históricos reales
          data: validWpmHistory.map(entry => entry.wpm),
          borderColor: safeStyles.color,
          backgroundColor: 'transparent',
          tension: 0.2,
          pointRadius: 0,
          borderWidth: 2,
          fill: false,
          yAxisID: 'y'
        },
        {
          label: 'Accuracy',
          // Usar los valores de accuracy interpolados
          data: accuracyHistory.map(entry => entry.accuracy),
          borderColor: safeStyles.color,
          backgroundColor: 'transparent',
          tension: 0.2,
          pointRadius: 0,
          borderWidth: 2,
          fill: false,
          yAxisID: 'y1'
        }
      ]
    };
  };

  // Opciones de la gráfica - actualizadas para usar safeStyles
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        type: 'linear' as const,
        min: 0,
        max: wpmHistory.length > 0 ? 
             Math.max(80, Math.ceil(Math.max(...wpmHistory.map(entry => entry.wpm)) / 20) * 20) : 
             80, // Mínimo 80 WPM o el máximo redondeado hacia arriba
        title: {
          display: true,
          text: 'Words per Minute',
          color: `${safeStyles.color}AA`,
          font: {
            family: 'monospace',
            size: 12,
            weight: 'bold' as const
          },
          position: 'left' as const,
          rotation: -90 // Girar el texto verticalmente
        },
        grid: {
          color: `${safeStyles.color}20`,
          drawBorder: false,
          lineWidth: 1,
        },
        ticks: {
          color: `${safeStyles.color}AA`,
          font: {
            family: 'monospace',
            weight: 'bold' as const
          },
          stepSize: 20, // Mostrar marcas cada 20 WPM
          padding: 10
        },
        border: {
          display: true,
          color: `${safeStyles.color}60`,
          width: 1
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        beginAtZero: true, // Asegurarse de que comience en 0
        min: 0,
        max: 100, // Accuracy siempre de 0 a 100%
        title: {
          display: true,
          text: 'Accuracy (%)',
          color: safeStyles.color,
          font: {
            family: 'monospace',
            size: 12,
            weight: 'bold' as const
          },
          position: 'right' as const,
          rotation: 90 // Girar el texto verticalmente
        },
        grid: {
          drawOnChartArea: false, // No dibujar líneas de cuadrícula para este eje
        },
        ticks: {
          color: safeStyles.color,
          font: {
            family: 'monospace',
            weight: 'bold' as const
          },
          stepSize: 20, // Mostrar marcas cada 20%
          padding: 10,
          callback: function(tickValue: number | string) {
            return tickValue + '%'; // Agregar el símbolo de porcentaje a las etiquetas
          }
        },
        border: {
          display: true,
          color: `${safeStyles.color}AA`,
          width: 1
        }
      },
      x: {
        grid: {
          color: `${safeStyles.color}10`,
          drawBorder: false,
          lineWidth: 1,
        },
        ticks: {
          display: false, // Ocultar etiquetas del eje X para una apariencia más limpia
          font: {
            family: 'monospace'
          }
        },
        border: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        display: true, // Mostrar la leyenda para distinguir WPM y precisión
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          color: `${safeStyles.color}AA`,
          font: {
            family: 'monospace',
            size: 10
          },
          boxWidth: 10,
          padding: 5
        },
      },
      tooltip: {
        enabled: false
      }
    },
    animation: {
      duration: 0 // Desactivar todas las animaciones
    },
    transitions: {
      active: {
        animation: {
          duration: 0
        }
      }
    },
    elements: {
      line: {
        tension: 0.2, // Suavizar la línea
        borderWidth: 2, // Ancho de línea constante
      },
      point: {
        radius: 0 // Desactivar puntos
      }
    },
    redraw: false // Evitar redibujar todo el gráfico
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

  return (
    <div 
      className="relative isolate flex items-center justify-center min-h-screen w-full"
      style={{ backgroundColor: safeStyles.backgroundColor }}
    >
      {/* Selector de tiempo en la parte superior */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isActive ? 0 : 1, y: isActive ? -30 : 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`fixed top-6 inset-x-0 z-50 flex justify-center items-center space-x-2 transition-opacity duration-300 ${
          isActive ? 'pointer-events-none' : ''
        }`}
      >
        <div className="bg-zinc-900/80 backdrop-blur-sm rounded-lg py-2 px-1 flex items-center gap-1 shadow-lg">
          {[15, 30, 60, 120].map((time) => (
            <button
              key={time}
              onClick={() => handleTimeChange(time as 15 | 30 | 60 | 120)}
              className={`px-3 py-1 text-sm font-medium transition-colors ${
                selectedTime === time && !isCompetitiveMode
                  ? 'text-white' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {time}
            </button>
          ))}
          <button
            onClick={() => handleTimeChange('competitive')}
            className={`px-3 py-1 text-sm font-medium transition-colors flex items-center justify-center ${
              isCompetitiveMode 
                ? 'text-white' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Trophy size={16} />
          </button>
        </div>
      </motion.div>
      
      {/* Logo en la esquina izquierda */}
      <div className="fixed top-6 left-20 z-50 flex items-center space-x-4">
        <Keyboard 
          size={32} 
          className="text-white opacity-90"
          style={{ color: safeStyles.color }}
        />
        <Link href="/">
          <span 
            className="text-3xl font-mono font-bold tracking-tight cursor-pointer hover:opacity-80 transition-opacity"
            style={{ color: safeStyles.color }}
          >
            penguintype
          </span>
        </Link>
      </div>
      
      {/* Botones de perfil, ranking y temas */}
      <div 
        className={`fixed top-6 right-6 z-50 flex items-center space-x-4 transition-opacity duration-300 ${
          isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleProfileClick}
          className="text-zinc-400 hover:text-white transition-colors p-2"
          aria-label={isLoadingUser ? 'Cargando...' : currentUser ? 'Perfil' : 'Iniciar sesión'}
        >
          <User size={22} />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLeaderboardToggle}
          className="text-zinc-400 hover:text-white transition-colors p-2"
          aria-label="Ranking"
        >
          <Crown size={22} />
        </motion.button>
        
        {/* Botón de temas integrado en la barra superior */}
        <ThemeButton
          themes={themes}
          currentTheme={currentTheme}
          themeColors={safeStyles.color === '#777777' ? {
            correct: '#777777',
            cursor: '#999999',
            error: '#FF5555',
            background: '#000000'
          } : themeColors}
          isActive={isActive}
          showThemeSelector={showThemeSelector}
          setShowThemeSelector={setShowThemeSelector}
          setCurrentTheme={setCurrentTheme}
          position="top"
        />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full px-4 py-8"
        >
          {/* Contenedor del texto a escribir */}
          <div 
            className="rounded-xl p-4 cursor-text w-full max-w-[80%] mx-auto"
            onClick={handleFocus}
            ref={textContainerRef}
          >
            <div className="flex items-center justify-center">
              <div className="text-2xl md:text-3xl leading-loose font-mono w-full text-justify">
                {targetText.split('').map((char, index) => {
                  let className = "opacity-70";
                  let style: React.CSSProperties = { color: '#777777' };
                  
                  if (isHydrated) {
                    // Solo aplicar estilos específicos del tema después de la hidratación
                    if (index < text.length) {
                      // Carácter ya escrito
                      if (text[index] === char) {
                        className = "text-theme-correct";
                        style = { color: themeColors.correct };
                      } else {
                        className = "text-theme-error border-b-2";
                        style = { 
                          color: themeColors.error,
                          borderBottomColor: themeColors.error
                        };
                      }
                    } else if (index === text.length) {
                      // Carácter actual (cursor)
                      className = "text-white animate-pulse";
                      style = { 
                        backgroundColor: `${themeColors.cursor}50`,
                        color: '#FFFFFF'
                      };
                    }
                  }
                  
                  // Espacio en blanco
                  if (char === ' ') {
                  return (
                      <span 
                        key={index} 
                        className={`${className} px-2`}
                        style={style}
                      >
                      {char}
                    </span>
                    );
                  }
                  
                  return (
                    <span 
                      key={index} 
                      className={`${className} tracking-wide`}
                      style={style}
                    >
                      {char}
                    </span>
                  );
                })}
              </div>
            </div>
            </div>
            
          {/* Área de texto oculta para capturar la entrada */}
              <textarea
                ref={inputRef}
                value={text}
            onChange={handleInput}
                disabled={endTime !== null}
            className="sr-only"
                autoFocus
              />
              
          {/* Resultados del test */}
              {endTime && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-12 rounded-xl p-6 w-full max-w-[80%] mx-auto"
              style={{ backgroundColor: safeStyles.backgroundColor, borderColor: safeStyles.color }}
            >
              {/* Resultados principales */}
              <div className="flex flex-col md:flex-row justify-between items-stretch mb-8">
                {/* WPM y precisión */}
                <div className="flex flex-col items-start mb-6 md:mb-0">
                  <div className="text-gray-400 text-sm font-mono">wpm</div>
                  <div className="text-6xl font-bold font-mono" style={{ color: safeStyles.color }}>
                    {calculateCurrentWPM()}
                  </div>
                  
                  {/* Precisión con tooltip */}
                  <div className="text-gray-400 text-sm mt-4 font-mono">acc</div>
                  <div 
                    className="text-6xl font-bold font-mono relative"
                    style={{ color: safeStyles.color }}
                    onMouseEnter={() => setShowAccTooltip(true)}
                    onMouseLeave={() => setShowAccTooltip(false)}
                  >
                    {calculateFinalAccuracy()}%
                    
                    {/* Tooltip de precisión */}
                    {showAccTooltip && (
                      <div 
                        className="absolute left-0 top-0 -translate-y-full p-2 bg-black text-white text-sm rounded font-mono z-50"
                        style={{ minWidth: '180px' }}
                      >
                        {calculateFinalAccuracy()}%<br />
                        {correctChars} correct<br />
                        {incorrectChars} incorrect
                </div>
              )}
                  </div>
                </div>
                
                {/* Gráfica */}
                <div className="flex-grow w-full md:w-auto h-48 md:h-64 flex items-center justify-center mb-2">
                  <div className="w-full h-full relative">
                    <Line 
                      data={getChartData()} 
                      options={chartOptions} 
                      key="static-chart-component" 
                    />
                    {/* Etiqueta X explícita abajo a la derecha */}
                    <div 
                      className="absolute bottom-0 right-0 text-xs font-mono font-bold" 
                      style={{ 
                        color: `${safeStyles.color}AA`, 
                        marginRight: '5px', 
                        marginBottom: '5px' 
                      }}
                    >
                      other
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Estadísticas simplificadas */}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6 text-left font-mono">
                <div>
                  <div className="text-gray-400 text-xs">test type</div>
                  <div className="text-sm" style={{ color: safeStyles.color }}>
                    time {selectedTime}s - español
                  </div>
                </div>
              </div>
              
              {/* Tiempo */}
              <div className="flex justify-end mt-2 font-mono">
                <div>
                  <div className="text-gray-400 text-xs">time</div>
                  <div className="text-2xl font-semibold" style={{ color: safeStyles.color }}>
                    {startTime && endTime ? Math.round((endTime - startTime) / 1000) : 0}s
                  </div>
                </div>
              </div>
              
              {/* Botones */}
              <div className="mt-8 flex justify-center gap-4">
                <button
                  onClick={handleReset}
                  className="px-6 py-2 text-white rounded-md font-medium transition-all duration-300 bg-black/30 border border-white/20 hover:bg-black/50"
                >
                  Next test
                </button>
              </div>
            </motion.div>
          )}
          
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