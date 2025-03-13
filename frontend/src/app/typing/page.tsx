'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { Line } from 'react-chartjs-2'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Keyboard, Crown, User, Trophy, LineChart } from 'lucide-react'

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
  
  // Función para obtener datos del gráfico
  const getChartData = useCallback(() => {
    // Si no hay datos suficientes o no está hidratado, devolver un dataset vacío
    if (!isHydrated || wpmHistory.length === 0) {
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
          tension: 0.4,
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
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2,
          fill: false,
          yAxisID: 'y1'
        }
      ]
    };
  }, [isHydrated, wpmHistory, accuracyHistory, safeStyles.color]);

  // Calcular el máximo del eje Y de forma dinámica
  const getYAxisMax = useCallback(() => {
    if (wpmHistory.length === 0) return 80; // Valor predeterminado
    
    // Obtener el máximo WPM histórico
    const maxWpm = Math.max(...wpmHistory.map(entry => entry.wpm));
    
    // Redondear hacia arriba al siguiente múltiplo de 20 y añadir un margen
    const roundedMax = Math.ceil(maxWpm / 20) * 20;
    
    // Establecer un margen adicional basado en el rango de valores
    const margin = maxWpm > 150 ? 40 : 20;
    
    // Devolver al menos 80 o el valor calculado
    return Math.max(80, roundedMax + margin);
  }, [wpmHistory]);
  
  // Determinar el tamaño del paso para las marcas del eje Y
  const getYAxisStepSize = useCallback(() => {
    if (wpmHistory.length === 0) return 20; // Valor predeterminado
    
    const maxWpm = Math.max(...wpmHistory.map(entry => entry.wpm));
    
    // Ajustar el tamaño del paso según el rango
    if (maxWpm > 200) return 50;
    if (maxWpm > 100) return 40;
    return 20;
  }, [wpmHistory]);

  // Opciones de la gráfica - actualizadas para usar safeStyles
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    devicePixelRatio: 1, // Forzar una resolución constante
    scales: {
      y: {
        type: 'linear' as const,
        min: 0,
        max: getYAxisMax(),
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
          stepSize: getYAxisStepSize(),
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
        enabled: true,
        mode: 'index' as const,
        intersect: false,
        backgroundColor: `${safeStyles.backgroundColor}EE`,
        titleColor: safeStyles.color,
        bodyColor: safeStyles.color,
        borderColor: `${safeStyles.color}40`,
        borderWidth: 1,
        cornerRadius: 4,
        padding: 8,
        titleFont: {
          family: 'monospace',
          weight: 'bold' as const,
          size: 12,
        },
        bodyFont: {
          family: 'monospace',
          size: 12,
        },
        callbacks: {
          title: function(tooltipItems: Array<{dataIndex: number}>) {
            // Convertir el índice de tiempo a segundos
            if (tooltipItems.length > 0) {
              const dataIndex = tooltipItems[0].dataIndex;
              const validWpmEntry = wpmHistory[dataIndex];
              return validWpmEntry ? `${validWpmEntry.time.toFixed(1)}s` : '';
            }
            return '';
          },
          label: function(context: {dataset: {label?: string}, parsed: {y: number}}) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            
            if (label === 'WPM') {
              return `WPM: ${value}`;
            } else if (label === 'Accuracy') {
              return `Precisión: ${value}%`;
            }
            return `${label}: ${value}`;
          },
        },
        displayColors: false,
      }
    },
    animation: {
      duration: 0 // Duración cero para eliminar todas las animaciones
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
        tension: 0.4, // Aumentar el suavizado de la línea
        borderWidth: 2, // Ancho de línea constante
      },
      point: {
        radius: 0, // Invisible normalmente
        hoverRadius: 5, // Visible al pasar el cursor
        hoverBackgroundColor: safeStyles.color,
        hoverBorderColor: 'white',
        hoverBorderWidth: 2,
      }
    },
    redraw: false, // Evitar redibujar todo el gráfico
    resizeDelay: 0, // No retrasar redimensionamientos
    interaction: {
      mode: 'nearest' as const,
      intersect: false,
      includeInvisible: true, // Reducir problemas de hover
    }
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
      {/* Selector de tiempo en la parte superior */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`fixed top-6 inset-x-0 z-50 flex justify-center items-center space-x-2 transition-opacity duration-300`}
        style={{ 
          opacity: isActive ? 0 : 1, 
          pointerEvents: isActive ? 'none' : 'auto',
          visibility: isActive ? 'hidden' : 'visible'
        }}
      >
        <div className="bg-zinc-900/80 backdrop-blur-sm rounded-lg py-2 px-1 flex items-center gap-1 shadow-lg">
          {[15, 30, 60, 120].map((time) => (
            <button
              key={time}
              onClick={() => handleTimeChange(time as 15 | 30 | 60 | 120)}
              className={`px-3 py-1 text-sm font-medium transition-colors hover:opacity-80`}
              style={{ 
                color: isHydrated 
                  ? selectedTime === time && !isCompetitiveMode
                    ? themes.find(t => t.id === currentTheme)?.colors[2] || '#FFFFFF'
                    : themes.find(t => t.id === currentTheme)?.colors[0] || '#AAAAAA'
                  : '#AAAAAA'
              }}
            >
              {time}
            </button>
          ))}
          <button
            onClick={() => handleTimeChange('competitive')}
            className={`px-3 py-1 text-sm font-medium transition-colors flex items-center justify-center hover:opacity-80`}
            style={{ 
              color: isHydrated 
                ? isCompetitiveMode
                  ? themes.find(t => t.id === currentTheme)?.colors[2] || '#FFFFFF'
                  : themes.find(t => t.id === currentTheme)?.colors[0] || '#AAAAAA'
                : '#AAAAAA'
            }}
          >
            <Trophy size={16} />
          </button>
          <div className="h-4 w-px bg-zinc-700 mx-1"></div>
          <button
            onClick={handleToggleChart}
            className={`px-3 py-1 text-sm font-medium transition-colors flex items-center justify-center hover:opacity-80`}
            style={{ 
              color: isHydrated 
                ? showRealTimeChart
                  ? themes.find(t => t.id === currentTheme)?.colors[2] || '#FFFFFF'
                  : themes.find(t => t.id === currentTheme)?.colors[0] || '#AAAAAA'
                : '#AAAAAA'
            }}
          >
            <LineChart size={16} />
          </button>
        </div>
      </motion.div>
      
      {/* Logo en la esquina izquierda */}
      <div className="fixed top-6 left-20 z-50 flex items-center space-x-4" style={{ opacity: 1, visibility: 'visible' }}>
        <Keyboard 
          size={32} 
          className="text-white opacity-90"
          style={{ color: isHydrated 
            ? themes.find(t => t.id === currentTheme)?.colors[2] || safeStyles.color 
            : safeStyles.color 
          }}
        />
        <div className="flex items-baseline">
          <Link href="/">
            <span 
              className="text-3xl font-mono font-bold tracking-tight cursor-pointer hover:opacity-80 transition-opacity"
              style={{ color: isHydrated 
                ? themes.find(t => t.id === currentTheme)?.colors[1] || safeStyles.color 
                : safeStyles.color 
              }}
            >
              penguin
            </span>
          </Link>
          <span 
            onClick={handleReset}
            className="text-3xl font-mono font-bold tracking-tight cursor-pointer hover:opacity-80 transition-opacity"
            style={{ color: isHydrated 
              ? themes.find(t => t.id === currentTheme)?.colors[2] || safeStyles.color 
              : safeStyles.color 
            }}
          >
            type
          </span>
        </div>
      </div>
      
      {/* Botones de perfil, ranking y temas */}
      <div 
        className="fixed top-6 right-6 z-50 flex items-center space-x-4 transition-opacity duration-300"
        style={{ 
          opacity: isActive ? 0 : 1, 
          pointerEvents: isActive ? 'none' : 'auto',
          visibility: isActive ? 'hidden' : 'visible'
        }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleProfileClick}
          className="text-zinc-400 hover:text-white transition-colors p-2"
          aria-label={isLoadingUser ? 'Cargando...' : currentUser ? 'Perfil' : 'Iniciar sesión'}
          style={{ color: isHydrated 
            ? themes.find(t => t.id === currentTheme)?.colors[0] || '#AAAAAA' 
            : '#AAAAAA'
          }}
        >
          <User size={22} />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLeaderboardToggle}
          className="text-zinc-400 hover:text-white transition-colors p-2"
          aria-label="Ranking"
          style={{ color: isHydrated 
            ? themes.find(t => t.id === currentTheme)?.colors[0] || '#AAAAAA' 
            : '#AAAAAA'
          }}
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
            typed: '#FFFFFF',
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
            className="rounded-xl p-4 cursor-text w-full max-w-[80%] mx-auto h-64 relative overflow-hidden"
            onClick={handleFocus}
            ref={textContainerRef}
          >
            <div className="flex items-center justify-center h-full">
              <div className="text-xl md:text-4xl leading-relaxed font-mono tracking-wide w-full text-justify" style={{ 
                fontVariantLigatures: 'none', 
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Menlo', 'Consolas', monospace",
                textShadow: isHydrated ? `0 0 8px ${themeColors.background}, 0 0 2px ${themes.find(t => t.id === currentTheme)?.colors[0]}40` : 'none'
              }}>
                {(() => {
                  // Número aproximado de caracteres por línea basado en el ancho del contenedor
                  const charsPerLine = 59; // Ajusta este valor según el ancho de tu contenedor y tamaño de fuente
                  
                  // Dividir el texto en líneas lógicas (por palabras)
                  const textLines: string[] = [];
                  let currentLine = '';
                  let wordBuffer = '';
                  
                  // Crear las líneas dividiendo por palabras
                  for (let i = 0; i < targetText.length; i++) {
                    const char = targetText[i];
                    wordBuffer += char;
                    
                    if (char === ' ' || i === targetText.length - 1) {
                      // Si añadir esta palabra excede el límite de caracteres y la línea no está vacía
                      if (currentLine.length + wordBuffer.length > charsPerLine && currentLine.length > 0) {
                        textLines.push(currentLine);
                        currentLine = wordBuffer;
                      } else {
                        currentLine += wordBuffer;
                      }
                      wordBuffer = '';
                    }
                  }
                  
                  // Añadir la última línea si queda algo
                  if (currentLine.length > 0) {
                    textLines.push(currentLine);
                  }
                  
                  // Calcular índices de inicio y fin de cada línea para navegación precisa
                  const lineIndices = [];
                  let charCount = 0;
                  
                  for (const line of textLines) {
                    const startIndex = charCount;
                    charCount += line.length;
                    const endIndex = charCount;
                    lineIndices.push({ startIndex, endIndex });
                  }
                  
                  // Encontrar en qué línea está actualmente el cursor
                  let currentLineIndex = 0;
                  for (let i = 0; i < lineIndices.length; i++) {
                    if (text.length < lineIndices[i].endIndex) {
                      currentLineIndex = i;
                      break;
                    }
                  }
                  
                  // Si hemos llegado al final del texto, quedarnos en la última línea
                  if (text.length >= targetText.length && lineIndices.length > 0) {
                    currentLineIndex = lineIndices.length - 1;
                  }
                  
                  // Decidir qué líneas mostrar (3 líneas)
                  let startLineIndex = Math.max(0, currentLineIndex);
                  
                  // Asegurarnos de no exceder los límites
                  startLineIndex = Math.max(0, Math.min(startLineIndex, textLines.length - 3));
                  const endLineIndex = Math.min(textLines.length - 1, startLineIndex + 2);
                  
                  // Calcular el rango de caracteres a mostrar
                  const startCharIndex = startLineIndex > 0 ? lineIndices[startLineIndex].startIndex : 0;
                  const endCharIndex = endLineIndex < lineIndices.length ? lineIndices[endLineIndex].endIndex : targetText.length;
                  
                  // Renderizar solo los caracteres dentro del rango visible
                  return targetText.slice(startCharIndex, endCharIndex).split('').map((char, localIndex) => {
                    const globalIndex = startCharIndex + localIndex;
                  let className = "opacity-70";
                  let style: React.CSSProperties = { color: '#777777' };
                  
                  if (isHydrated) {
                      // Encontrar el tema actual para colores específicos
                      const currentThemeObj = themes.find(t => t.id === currentTheme) || themes[0];
                      
                    // Solo aplicar estilos específicos del tema después de la hidratación
                      if (globalIndex < text.length) {
                      // Carácter ya escrito
                        if (text[globalIndex] === char) {
                        className = "text-theme-correct";
                          // Usar el tercer color del tema (index 2) para texto ya escrito
                          style = { 
                            color: currentThemeObj.colors[2],
                            textShadow: `0 0 4px ${currentThemeObj.colors[2]}30`
                          };
                      } else {
                        className = "text-theme-error border-b-2";
                        // Siempre usar rojo para caracteres incorrectos
                        style = { 
                          color: '#FF3333',
                          borderBottomColor: '#FF3333',
                          textShadow: '0 0 5px rgba(255, 0, 0, 0.3)',
                          fontWeight: 'bold'
                        };
                      }
                      } else if (globalIndex === text.length) {
                      // Carácter actual (cursor)
                      className = "text-white animate-pulse";
                        const cursorColor = themes.find(t => t.id === currentTheme)?.colors[1] || themeColors.cursor;
                      style = { 
                          backgroundColor: `${cursorColor}90`,
                          color: '#FFFFFF',
                          borderRadius: '2px',
                          padding: '0 2px',
                          textShadow: `0 0 8px #FFFFFF90`,
                          boxShadow: `0 0 8px ${cursorColor}70`
                        };
                      } else {
                        // Carácter no escrito todavía - usar el primer color del tema
                        className = "opacity-70";
                        // Usar el primer color del tema (index 0) para texto no escrito
                        style = { color: currentThemeObj.colors[0] };
                      }
                  }
                  
                  // Espacio en blanco
                  if (char === ' ') {
                  return (
                      <span 
                          key={globalIndex} 
                          className={`${className} px-2 font-light`}
                          style={{...style, letterSpacing: '0.05em'}}
                      >
                      {char}
                    </span>
                    );
                  }
                  
                  return (
                    <span 
                        key={globalIndex} 
                        className={`${className} font-light`}
                        style={{...style, letterSpacing: '0.05em'}}
                    >
                      {char}
                    </span>
                  );
                  });
                })()}
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
              
          {/* Gráfica en tiempo real */}
          {showRealTimeChart && isActive && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 1.2, 
                ease: "easeOut",
                opacity: { duration: 1.5 },
                y: { duration: 1.2, ease: "easeInOut" }
              }}
              className="mt-8 rounded-xl p-4 w-full max-w-[80%] mx-auto bg-black/30 border border-white/10"
              style={{ backgroundColor: `${safeStyles.backgroundColor}CC` }}
            >
              {/* Valores actuales en tiempo real */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col items-center">
                  <div className="text-xs uppercase tracking-wide font-mono" style={{ color: safeStyles.color }}>
                    WPM Actual
                  </div>
                  <div className="text-3xl font-bold font-mono" style={{ color: safeStyles.color }}>
                    {isActive && startTime ? calculateCurrentWPM() : 0}
                  </div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="text-xs uppercase tracking-wide font-mono" style={{ color: safeStyles.color }}>
                    Precisión
                  </div>
                  <div className="text-3xl font-bold font-mono" style={{ color: safeStyles.color }}>
                    {isActive && text.length > 0 ? calculateAccuracy(text, targetText) : 100}%
                  </div>
                </div>
              </div>
              
              <div className="h-48 md:h-64 flex items-center justify-center">
                <div className="w-full h-full relative">
                  <Line 
                    data={getChartData()} 
                    options={chartOptions} 
                    key={`real-time-chart`} 
                  />
                  <div 
                    className="absolute bottom-0 right-0 text-xs font-mono font-bold" 
                    style={{ 
                      color: `${safeStyles.color}AA`, 
                      marginRight: '5px', 
                      marginBottom: '5px' 
                    }}
                  >
                    
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
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