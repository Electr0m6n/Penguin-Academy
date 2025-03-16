'use client'

import React from 'react';
import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { useChartConfig } from './ChartOptions';
import { WpmDataPoint, AccuracyDataPoint } from '../../types';
import { Zap, CheckCircle2, Timer, TrendingUp, Flag, Award, Activity } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  Chart
} from 'chart.js';

// Registrar los componentes necesarios para Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ResultsChartProps {
  wpmHistory: WpmDataPoint[];
  accuracyHistory: AccuracyDataPoint[];
  safeStyles: {
    backgroundColor: string;
    color: string;
  };
  isHydrated: boolean;
  endTime: number | null;
  startTime: number | null;
  selectedTime: number | string;
  calculateCurrentWPM: () => number;
  correctChars: number;
  incorrectChars: number;
  showAccTooltip: boolean;
  setShowAccTooltip: (show: boolean) => void;
}

export const ResultsChart: React.FC<ResultsChartProps> = ({
  wpmHistory,
  accuracyHistory,
  safeStyles,
  isHydrated,
  endTime,
  startTime,
  selectedTime,
  calculateCurrentWPM,
  correctChars,
  incorrectChars,
  showAccTooltip,
  setShowAccTooltip
}) => {
  const { getChartData, chartOptions } = useChartConfig({
    wpmHistory,
    accuracyHistory,
    safeStyles,
    isHydrated,
    isResultsChart: true
  });

  // Calcular estadísticas importantes
  const finalWpm = wpmHistory.length > 0 ? 
    Math.round(wpmHistory[wpmHistory.length - 1].wpm) : 
    calculateCurrentWPM();
    
  const finalAccuracy = accuracyHistory.length > 0 ? 
    Math.round(accuracyHistory[accuracyHistory.length - 1].accuracy) : 
    0;
    
  const totalTime = startTime && endTime ? Math.round((endTime - startTime) / 1000) : 0;
  
  const maxWpm = wpmHistory.length > 0 ? 
    Math.round(Math.max(...wpmHistory.map(entry => entry.wpm))) : 
    finalWpm;
    
  // Calcular la consistencia (desviación estándar inversa normalizada)
  const calculateConsistency = () => {
    if (wpmHistory.length < 3) return 0;
    
    const values = wpmHistory.map(entry => entry.wpm);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    
    // Calcular desviación estándar
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    // Convertir a un porcentaje de consistencia (menor desviación = mayor consistencia)
    // Normalizar a un rango aproximado de 0-100
    const consistencyScore = Math.max(0, 100 - (stdDev / mean) * 100);
    return Math.min(100, Math.round(consistencyScore));
  };
  
  const consistency = calculateConsistency();

  // Depuración para verificar datos
  React.useEffect(() => {
    if (wpmHistory.length > 0) {
      console.log('ResultsChart - Datos disponibles:', {
        wpmPoints: wpmHistory.length,
        accuracyPoints: accuracyHistory.length,
        lastWpm: wpmHistory[wpmHistory.length - 1].wpm,
        lastAccuracy: accuracyHistory.length > 0 ? accuracyHistory[accuracyHistory.length - 1].accuracy : 'N/A',
        maxWpm: maxWpm,
        consistency: consistency
      });
    }
  }, [wpmHistory, accuracyHistory, maxWpm, consistency]);

  // Usamos un estado para controlar la gráfica interactiva
  const [activePoint, setActivePoint] = React.useState<number | null>(null);
  const [showGraphTooltip, setShowGraphTooltip] = React.useState(false);
  
  // Referencia para el componente Chart
  const chartRef = React.useRef<Chart<'line'>>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  // Función para manejar el movimiento del ratón sobre la gráfica
  const handleChartHover = React.useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    // Calcular posición rel
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const relativeX = x / rect.width;
    
    // Mapear a un índice de punto (con límites para evitar errores)
    const pointCount = wpmHistory.length;
    if (pointCount === 0) return;
    
    const pointIndex = Math.min(
      Math.max(0, Math.floor(relativeX * (pointCount - 1))), 
      pointCount - 1
    );
    
    // Actualizar el punto activo
    setActivePoint(pointIndex);
    setShowGraphTooltip(true);
    
    // Asegurarnos de que el punto se muestre visualmente
    if (chartRef.current) {
      try {
        const chart = chartRef.current;
        // Intentar marcar el punto como activo para que se muestre
        const datasetIndex = 0; // WPM dataset
        chart.setActiveElements([{
          datasetIndex: datasetIndex,
          index: pointIndex
        }]);
        chart.update();
      } catch (err) {
        console.error("Error al activar el punto:", err);
      }
    }
  }, [wpmHistory.length]);
  
  // Ocultar tooltip al salir del gráfico
  const handleChartLeave = React.useCallback(() => {
    // Solo ocultamos el tooltip si no hay un punto fijo
    if (activePoint !== null) {
      setShowGraphTooltip(false);
    }
  }, [activePoint]);
  
  // Función para obtener el momento exacto de la prueba
  const getMomentData = React.useCallback((index: number) => {
    if (index < 0 || index >= wpmHistory.length || !wpmHistory[index]) {
      return null;
    }
    
    const wpm = wpmHistory[index].wpm;
    const time = wpmHistory[index].time;
    const accuracy = index < accuracyHistory.length ? accuracyHistory[index].accuracy : 0;
    
    // Calcular cuánto texto se había completado en ese momento
    const progress = time / (totalTime || 1) * 100;
    
    return {
      wpm: Math.round(wpm),
      time: time.toFixed(1),
      accuracy: Math.round(accuracy),
      progress: Math.min(100, Math.round(progress))
    };
  }, [wpmHistory, accuracyHistory, totalTime]);
  
  // Función para manejar el clic en un punto del gráfico
  const handleChartClick = React.useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const relativeX = x / rect.width;
    
    // Asegurar que tenemos datos
    const pointCount = wpmHistory.length;
    if (pointCount === 0) return;
    
    // Mapear a un índice de punto (con límites para evitar errores)
    const pointIndex = Math.min(
      Math.max(0, Math.floor(relativeX * (pointCount - 1))),
      pointCount - 1
    );
    
    // Si hacemos clic en el mismo punto que ya está activo, lo desactivamos
    setActivePoint(prevIndex => 
      prevIndex === pointIndex ? null : pointIndex
    );
    setShowGraphTooltip(true);
    
    // Actualizar visualmente el punto en la gráfica
    if (chartRef.current) {
      try {
        const chart = chartRef.current;
        const datasetIndex = 0; // WPM dataset
        
        // Si estamos desactivando el punto
        if (activePoint === pointIndex) {
          chart.setActiveElements([]);
        } else {
          // Si estamos activando un nuevo punto
          chart.setActiveElements([{
            datasetIndex: datasetIndex,
            index: pointIndex
          }]);
        }
        chart.update();
      } catch (err) {
        console.error("Error al modificar el punto activo:", err);
      }
    }
    
    console.log('Punto seleccionado:', pointIndex, getMomentData(pointIndex));
  }, [wpmHistory.length, activePoint, getMomentData]);
  
  // Este efecto asegura que tengamos un punto activo tan pronto como los datos estén disponibles
  React.useEffect(() => {
    if (wpmHistory.length > 0 && activePoint === null) {
      // Seleccionar el último punto por defecto
      setActivePoint(wpmHistory.length - 1);
      setShowGraphTooltip(true);
    }
  }, [wpmHistory.length, activePoint]);

  // Solo mostrar si tenemos datos de una prueba completada
  if (!endTime || wpmHistory.length === 0) {
    console.log('ResultsChart no se muestra: no hay datos completos', { 
      endTime: !!endTime, 
      endTimeValue: endTime,
      wpmHistoryLength: wpmHistory.length,
      wpmHistoryData: wpmHistory.slice(0, 3) // Mostrar los primeros 3 elementos para depuración
    });
    return null;
  }

  // Si llegamos aquí, tenemos datos para mostrar
  console.log('ResultsChart se va a mostrar', { 
    endTime: !!endTime, 
    wpmHistoryLength: wpmHistory.length,
    finalWPM: finalWpm,
    finalAccuracy: finalAccuracy
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mt-6 rounded-xl w-full max-w-[95%] sm:max-w-[90%] md:max-w-[85%] mx-auto border relative overflow-hidden"
      style={{ 
        backgroundColor: `${safeStyles.backgroundColor}AA`,
        borderColor: `${safeStyles.color}40`,
        boxShadow: `0 0 20px ${safeStyles.backgroundColor}CC, inset 0 0 15px ${safeStyles.color}20`
      }}
    >
      {/* Efecto de rejilla de fondo */}
      <div className="absolute inset-0 opacity-5" style={{ 
        backgroundSize: '8px 8px',
        backgroundImage: `linear-gradient(to right, ${safeStyles.color}10 1px, transparent 1px), 
                          linear-gradient(to bottom, ${safeStyles.color}10 1px, transparent 1px)`,
        zIndex: 0
      }}></div>
      
      {/* Cabecera con título */}
      <div className="relative z-10 flex justify-center items-center p-3 border-b" 
           style={{ borderColor: `${safeStyles.color}30` }}>
        <Flag 
          size={18} 
          className="mr-2"
          style={{ color: safeStyles.color }} 
        />
        <h2 className="text-lg sm:text-xl font-bold font-mono" style={{ color: safeStyles.color }}>
          Resultados finales
        </h2>
      </div>
      
      {/* Contenido principal */}
      <div className="p-3 sm:p-4 md:p-6">
        {/* Primera fila: métricas principales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6">
          {/* WPM Final */}
          <div className="flex flex-col items-center bg-black/30 rounded-lg p-2 sm:p-3 border"
               style={{ borderColor: `${safeStyles.color}30` }}>
            <div className="flex items-center mb-1">
              <Zap 
                size={16} 
                className="mr-1.5"
                style={{ color: safeStyles.color }} 
              />
              <div className="text-xs uppercase tracking-wide font-mono opacity-70">
                WPM Final
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono" style={{ color: safeStyles.color }}>
              {finalWpm}
            </div>
          </div>
          
          {/* Precisión */}
          <div className="flex flex-col items-center bg-black/30 rounded-lg p-2 sm:p-3 border"
               style={{ borderColor: `${safeStyles.color}30` }}>
            <div className="flex items-center mb-1">
              <CheckCircle2 
                size={16} 
                className="mr-1.5"
                style={{ color: safeStyles.color }} 
              />
              <div className="text-xs uppercase tracking-wide font-mono opacity-70">
                Precisión
              </div>
            </div>
          <div 
              className="text-2xl sm:text-3xl font-bold font-mono relative"
            style={{ color: safeStyles.color }}
            onMouseEnter={() => setShowAccTooltip(true)}
            onMouseLeave={() => setShowAccTooltip(false)}
          >
              {finalAccuracy}%
            
            {/* Tooltip de precisión */}
            {showAccTooltip && (
              <div 
                  className="absolute left-1/2 bottom-full -translate-x-1/2 mb-2 p-2 sm:p-3 bg-black/80 backdrop-blur-md text-white text-xs sm:text-sm rounded font-mono z-50 border"
                  style={{ minWidth: '160px', maxWidth: '95vw', borderColor: `${safeStyles.color}40` }}
                >
                  <div className="text-center mb-1 sm:mb-2 font-bold" style={{ color: safeStyles.color }}>Detalles de precisión</div>
                  <div className="flex justify-between mb-1">
                    <span className="opacity-70">Correctos:</span> 
                    <span className="font-bold">{correctChars}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">Incorrectos:</span> 
                    <span className="font-bold" style={{ color: 'rgba(255, 100, 100, 0.9)' }}>{incorrectChars}</span>
                  </div>
                  <div className="mt-1 pt-1 border-t" style={{ borderColor: `${safeStyles.color}30` }}>
                    <div className="flex justify-between">
                      <span className="opacity-70">Precisión:</span> 
                      <span className="font-bold">{finalAccuracy}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Tiempo */}
          <div className="flex flex-col items-center bg-black/30 rounded-lg p-2 sm:p-3 border"
               style={{ borderColor: `${safeStyles.color}30` }}>
            <div className="flex items-center mb-1">
              <Timer 
                size={16} 
                className="mr-1.5"
                style={{ color: safeStyles.color }} 
              />
              <div className="text-xs uppercase tracking-wide font-mono opacity-70">
                Tiempo
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono" style={{ color: safeStyles.color }}>
              {totalTime}s
            </div>
          </div>
          
          {/* Máximo WPM */}
          <div className="flex flex-col items-center bg-black/30 rounded-lg p-2 sm:p-3 border"
               style={{ borderColor: `${safeStyles.color}30` }}>
            <div className="flex items-center mb-1">
              <TrendingUp 
                size={16} 
                className="mr-1.5"
                style={{ color: safeStyles.color }} 
              />
              <div className="text-xs uppercase tracking-wide font-mono opacity-70">
                Máx WPM
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono" style={{ color: safeStyles.color }}>
              {maxWpm}
            </div>
          </div>
        </div>
        
        {/* Segunda fila: Gráfica y métricas secundarias */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
          {/* Gráfica (ocupa toda la pantalla en móvil, 3/4 en desktop) */}
          <div className="lg:col-span-3 bg-black/20 rounded-xl p-2 sm:p-4 border overflow-hidden"
               style={{ borderColor: `${safeStyles.color}20` }}>
            <div 
              className="h-48 sm:h-56 md:h-64 w-full relative" 
              onClick={handleChartClick}
              onMouseMove={handleChartHover}
              onMouseLeave={handleChartLeave}
              ref={containerRef}
            >
            <Line 
              data={getChartData()} 
              options={chartOptions} 
                key="results-chart"
                ref={chartRef}
            />
              
              {/* Línea vertical que indica el punto activo */}
              {activePoint !== null && wpmHistory.length > 0 && (
            <div 
                  className="absolute top-8 bottom-0 border-l-2 border-white/30 z-10 pointer-events-none"
              style={{ 
                    left: `${activePoint / (wpmHistory.length - 1) * 100}%`,
                    borderColor: `${safeStyles.color}60`
                  }}
                ></div>
              )}
              
              {/* Mostrar indicador del punto activo si existe */}
              {activePoint !== null && showGraphTooltip && getMomentData(activePoint) && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md text-xs p-2 rounded-md text-white/90 font-mono border border-white/20"
                  style={{ boxShadow: `0 4px 12px rgba(0,0,0,0.5)` }}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center">
                      <Zap size={12} className="mr-1.5" style={{ color: safeStyles.color }} />
                      <span className="opacity-80 mr-1.5">WPM:</span> 
                      <span className="font-bold">{getMomentData(activePoint)?.wpm}</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 size={12} className="mr-1.5" style={{ color: '#56CCF2' }} />
                      <span className="opacity-80 mr-1.5">Precisión:</span> 
                      <span className="font-bold">{getMomentData(activePoint)?.accuracy}%</span>
                    </div>
                    <div className="flex items-center">
                      <Timer size={12} className="mr-1.5" style={{ color: safeStyles.color }} />
                      <span className="opacity-80 mr-1.5">Tiempo:</span> 
                      <span className="font-bold">{getMomentData(activePoint)?.time}s</span>
                    </div>
                    <div className="mt-1 pt-1 border-t border-white/10">
                      <span className="opacity-80 mr-1.5">Progreso:</span> 
                      <span className="font-bold">{getMomentData(activePoint)?.progress}%</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
          
          {/* Métricas secundarias (en móvil: debajo, en desktop: al lado) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2 md:gap-3">
            {/* Consistencia */}
            <div className="bg-black/20 rounded-lg p-2 sm:p-3 border"
                 style={{ borderColor: `${safeStyles.color}20` }}>
              <div className="flex items-center mb-1">
                <Activity 
                  size={14} 
                  className="mr-1.5"
                  style={{ color: safeStyles.color }} 
                />
                <span className="text-xs uppercase tracking-wide font-mono opacity-70">
                  Consistencia
                </span>
              </div>
              <div className="flex items-center">
                <div className="text-xl font-bold font-mono mr-2" style={{ color: safeStyles.color }}>
                  {consistency}%
                </div>
                <div className="w-full bg-black/30 rounded-full h-1.5">
                  <div 
                    className="h-full rounded-full"
                    style={{ 
                      width: `${consistency}%`,
                      backgroundColor: safeStyles.color
                    }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Tipo de prueba */}
            <div className="bg-black/20 rounded-lg p-2 sm:p-3 border"
                 style={{ borderColor: `${safeStyles.color}20` }}>
              <div className="flex items-center mb-1">
                <Award 
                  size={14} 
                  className="mr-1.5"
                  style={{ color: safeStyles.color }} 
                />
                <span className="text-xs uppercase tracking-wide font-mono opacity-70">
                  Tipo de prueba
                </span>
              </div>
              <div className="font-mono text-xs sm:text-sm" style={{ color: safeStyles.color }}>
                <div className="flex justify-between">
                  <span>Duración:</span> 
                  <span className="font-bold">{selectedTime}s</span>
                </div>
                <div className="flex justify-between">
                  <span>Idioma:</span> 
                  <span className="font-bold">español</span>
                </div>
              </div>
            </div>
            
            {/* Caracteres */}
            <div className="bg-black/20 rounded-lg p-2 sm:p-3 border"
                 style={{ borderColor: `${safeStyles.color}20` }}>
              <div className="text-xs uppercase tracking-wide font-mono opacity-70 mb-1">
                Caracteres
              </div>
              <div className="font-mono text-xs sm:text-sm" style={{ color: safeStyles.color }}>
                <div className="flex justify-between">
                  <span>Total:</span> 
                  <span className="font-bold">{correctChars + incorrectChars}</span>
                </div>
                <div className="flex justify-between">
                  <span>Correctos:</span> 
                  <span className="font-bold">{correctChars}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}; 