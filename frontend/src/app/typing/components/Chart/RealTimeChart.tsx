'use client'

import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, CheckCircle2, TrendingUp, Timer } from 'lucide-react';
import { useChartConfig } from './ChartOptions';
import { WpmDataPoint, AccuracyDataPoint } from '../../types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
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

interface RealTimeChartProps {
  wpmHistory: WpmDataPoint[];
  accuracyHistory: AccuracyDataPoint[];
  safeStyles: {
    backgroundColor: string;
    color: string;
  };
  isHydrated: boolean;
  isActive: boolean;
  startTime: number | null;
  text: string;
  targetText: string;
  calculateCurrentWPM: () => number;
  calculateAccuracy: (text: string, targetText: string) => number;
  codeMode?: boolean;
}

export const RealTimeChart: React.FC<RealTimeChartProps> = ({
  wpmHistory,
  accuracyHistory,
  safeStyles,
  isHydrated,
  isActive,
  startTime,
  text,
  targetText,
  calculateCurrentWPM,
  calculateAccuracy,
  codeMode = false
}) => {
  const { getChartData, chartOptions } = useChartConfig({
    wpmHistory,
    accuracyHistory,
    safeStyles,
    isHydrated
  });

  // Actualizar valores directamente desde las props en lugar de useStates locales
  const currentWpm = wpmHistory.length > 0 ? 
    Math.round(wpmHistory[wpmHistory.length - 1].wpm) : 
    (isActive && startTime ? Math.round(calculateCurrentWPM()) : 0);
    
  const currentAcc = accuracyHistory.length > 0 ? 
    Math.round(accuracyHistory[accuracyHistory.length - 1].accuracy) : 
    (text.length > 0 ? Math.round(calculateAccuracy(text, targetText)) : 100);
    
  const elapsedTime = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
  
  const maxWpm = wpmHistory.length > 0 ? 
    Math.round(Math.max(...wpmHistory.map(entry => entry.wpm))) : 
    currentWpm;

  const [showDetails, setShowDetails] = useState<boolean>(false);

  // Calcular progreso aproximado
  const estimateProgress = () => {
    if (!targetText || !text) return 0;
    return Math.min(100, Math.round((text.length / targetText.length) * 100));
  };

  // Depuración para verificar datos
  React.useEffect(() => {
    if (wpmHistory.length > 0) {
      console.log('RealTimeChart - Datos disponibles:', {
        wpmPoints: wpmHistory.length,
        accuracyPoints: accuracyHistory.length,
        lastWpm: wpmHistory[wpmHistory.length - 1].wpm,
        lastAccuracy: accuracyHistory.length > 0 ? accuracyHistory[accuracyHistory.length - 1].accuracy : 'N/A',
        currentWpmCalculated: currentWpm,
        currentAccCalculated: currentAcc,
        timeElapsed: elapsedTime,
        maxWpmCalculated: maxWpm
      });
    }
  }, [wpmHistory, accuracyHistory, currentWpm, currentAcc, elapsedTime, maxWpm]);

  // Forzar actualización cada 500ms para el tiempo transcurrido y otros valores
  const [, setForceUpdate] = useState<number>(0);
  useEffect(() => {
    if (!isActive) return;
    
    const intervalId = setInterval(() => {
      setForceUpdate(prev => prev + 1);
    }, 500);
    
    return () => clearInterval(intervalId);
  }, [isActive]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ 
        duration: 0.6, 
        ease: "easeOut",
      }}
      className={`mt-4 rounded-xl w-full max-w-[85%] mx-auto border relative overflow-hidden ${codeMode ? 'mb-4' : 'mb-8'}`}
      style={{ 
        backgroundColor: `${safeStyles.backgroundColor}AA`,
        borderColor: `${safeStyles.color}40`,
        boxShadow: `0 0 15px ${safeStyles.backgroundColor}CC, inset 0 0 10px ${safeStyles.color}10`
      }}
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      {/* Micro grid background para profundidad */}
      <div className="absolute inset-0 opacity-10" style={{ 
        backgroundSize: '8px 8px',
        backgroundImage: `linear-gradient(to right, ${safeStyles.color}10 1px, transparent 1px), 
                         linear-gradient(to bottom, ${safeStyles.color}10 1px, transparent 1px)`,
        zIndex: 0
      }}></div>
      
      {/* Header con métricas principales */}
      <div className="relative z-10 flex flex-wrap justify-between items-center p-3 border-b" 
           style={{ borderColor: `${safeStyles.color}20` }}>
        <div className="flex flex-wrap gap-3 md:gap-6">
          {/* WPM Actual */}
          <div className="flex items-center bg-black/30 rounded-lg px-3 py-2 border"
               style={{ borderColor: `${safeStyles.color}30` }}>
            <Zap 
              size={18} 
              className="mr-2"
              style={{ color: safeStyles.color }} 
            />
            <div>
              <div className="text-xs uppercase tracking-wide font-mono opacity-70">
                WPM
              </div>
              <div className="text-2xl font-bold font-mono" style={{ color: safeStyles.color }}>
                {currentWpm}
              </div>
            </div>
          </div>
          
          {/* Precisión */}
          <div className="flex items-center bg-black/30 rounded-lg px-3 py-2 border"
               style={{ borderColor: `${safeStyles.color}30` }}>
            <CheckCircle2 
              size={18} 
              className="mr-2"
              style={{ color: safeStyles.color }}  
            />
            <div>
              <div className="text-xs uppercase tracking-wide font-mono opacity-70">
                Precisión
              </div>
              <div className="text-2xl font-bold font-mono" style={{ color: safeStyles.color }}>
                {currentAcc}%
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 md:gap-4 mt-2 sm:mt-0">
          {/* Tiempo transcurrido */}
          <div className="flex items-center bg-black/30 rounded-lg px-3 py-2 border"
               style={{ borderColor: `${safeStyles.color}30` }}>
            <Timer 
              size={16} 
              className="mr-2"
              style={{ color: safeStyles.color }}  
            />
            <div>
              <div className="text-xs uppercase tracking-wide font-mono opacity-70">
                Tiempo
              </div>
              <div className="text-lg font-bold font-mono" style={{ color: safeStyles.color }}>
                {elapsedTime}s
              </div>
            </div>
          </div>
          
          {/* Máximo WPM */}
          <div className="flex items-center bg-black/30 rounded-lg px-3 py-2 border"
               style={{ borderColor: `${safeStyles.color}30` }}>
            <TrendingUp 
              size={16} 
              className="mr-2"
              style={{ color: safeStyles.color }}  
            />
            <div>
              <div className="text-xs uppercase tracking-wide font-mono opacity-70">
                Máx WPM
              </div>
              <div className="text-lg font-bold font-mono" style={{ color: safeStyles.color }}>
                {maxWpm}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="h-1.5 w-full bg-black/40">
        <motion.div 
          initial={{ width: '0%' }}
          animate={{ width: `${estimateProgress()}%` }}
          className="h-full"
          style={{ backgroundColor: safeStyles.color }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      {/* Contenedor del gráfico */}
      <div className={`relative flex items-center justify-center ${codeMode ? 'h-40 md:h-52' : 'h-48 md:h-64'}`}>
        <div className="w-full h-full p-2">
          <Line 
            data={getChartData()} 
            options={chartOptions} 
            key={`real-time-chart`} 
          />
        </div>
        
        {/* Overlay de información */}
        <AnimatePresence mode="wait">
          {showDetails && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center font-mono text-center p-4"
            >
              <p className="text-sm opacity-80 mb-1">Estadísticas en tiempo real</p>
              <h3 className="text-xl font-bold mb-3" style={{ color: safeStyles.color }}>
                {currentWpm} WPM · {currentAcc}% precisión
              </h3>
              
              <div className="grid grid-cols-2 gap-4 max-w-md w-full">
                <div className="text-left">
                  <p className="text-xs opacity-60">Tiempo transcurrido</p>
                  <p className="text-base font-bold" style={{ color: safeStyles.color }}>{elapsedTime} segundos</p>
                </div>
                <div className="text-left">
                  <p className="text-xs opacity-60">Progreso</p>
                  <p className="text-base font-bold" style={{ color: safeStyles.color }}>{estimateProgress()}%</p>
                </div>
                <div className="text-left">
                  <p className="text-xs opacity-60">Máximo WPM</p>
                  <p className="text-base font-bold" style={{ color: safeStyles.color }}>{maxWpm}</p>
                </div>
                <div className="text-left">
                  <p className="text-xs opacity-60">Puntos de datos</p>
                  <p className="text-base font-bold" style={{ color: safeStyles.color }}>{wpmHistory.length}</p>
                </div>
              </div>
              
              <p className="text-xs opacity-60 mt-4">Pasa el cursor fuera para volver al gráfico</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Etiquetas de ejes (opcional - ya que Chart.js tiene sus propias) */}
      <div className="flex justify-between px-4 py-2 text-xs font-mono opacity-60 border-t"
           style={{ borderColor: `${safeStyles.color}20` }}>
        <span>Tiempo (s)</span>
        <span>WPM / Precisión (%)</span>
      </div>
    </motion.div>
  );
}; 