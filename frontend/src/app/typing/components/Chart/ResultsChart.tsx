'use client'

import React from 'react';
import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { useChartConfig } from './ChartOptions';
import { WpmDataPoint, AccuracyDataPoint, Theme } from '../../types';

interface ResultsChartProps {
  wpmHistory: WpmDataPoint[];
  accuracyHistory: AccuracyDataPoint[];
  safeStyles: {
    backgroundColor: string;
    color: string;
  };
  isHydrated: boolean;
  themes: Theme[];
  currentTheme: string;
  endTime: number | null;
  startTime: number | null;
  selectedTime: number | string;
  calculateCurrentWPM: () => number;
  calculateFinalAccuracy: () => number;
  correctChars: number;
  incorrectChars: number;
  showAccTooltip: boolean;
  setShowAccTooltip: (show: boolean) => void;
  handleReset: () => void;
}

export const ResultsChart: React.FC<ResultsChartProps> = ({
  wpmHistory,
  accuracyHistory,
  safeStyles,
  isHydrated,
  themes,
  currentTheme,
  endTime,
  startTime,
  selectedTime,
  calculateCurrentWPM,
  calculateFinalAccuracy,
  correctChars,
  incorrectChars,
  showAccTooltip,
  setShowAccTooltip,
  handleReset
}) => {
  const { getChartData, chartOptions } = useChartConfig({
    wpmHistory,
    accuracyHistory,
    safeStyles,
    isHydrated,
    themes,
    currentTheme
  });

  if (!endTime) return null;

  return (
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
            {wpmHistory.length > 0 ? 
              wpmHistory[wpmHistory.length - 1].wpm : 
              calculateCurrentWPM()}
          </div>
          
          {/* Añadir información de depuración solo visible si hay anomalías */}
          {wpmHistory.length > 0 && wpmHistory[wpmHistory.length - 1].wpm < 10 && (
            <div className="text-xs text-red-500 mt-1">
              WPM bajo detectado: {wpmHistory[wpmHistory.length - 1].wpm} 
              (Hist: {wpmHistory.length})
            </div>
          )}
          
          {/* Precisión con tooltip */}
          <div className="text-gray-400 text-sm mt-4 font-mono">acc</div>
          <div 
            className="text-6xl font-bold font-mono relative"
            style={{ color: safeStyles.color }}
            onMouseEnter={() => setShowAccTooltip(true)}
            onMouseLeave={() => setShowAccTooltip(false)}
          >
            {calculateFinalAccuracy() || 
              (accuracyHistory.length > 0 ? accuracyHistory[accuracyHistory.length - 1].accuracy : 0)}%
            
            {/* Tooltip de precisión */}
            {showAccTooltip && (
              <div 
                className="absolute left-0 top-0 -translate-y-full p-2 bg-black text-white text-sm rounded font-mono z-50"
                style={{ minWidth: '180px' }}
              >
                {calculateFinalAccuracy() || 
                  (accuracyHistory.length > 0 ? accuracyHistory[accuracyHistory.length - 1].accuracy : 0)}%<br />
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
  );
}; 