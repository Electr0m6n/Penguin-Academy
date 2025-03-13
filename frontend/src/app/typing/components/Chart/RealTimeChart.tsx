'use client'

import React from 'react';
import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { useChartConfig } from './ChartOptions';
import { WpmDataPoint, AccuracyDataPoint, Theme } from '../../types';

interface RealTimeChartProps {
  wpmHistory: WpmDataPoint[];
  accuracyHistory: AccuracyDataPoint[];
  safeStyles: {
    backgroundColor: string;
    color: string;
  };
  isHydrated: boolean;
  themes: Theme[];
  currentTheme: string;
  isActive: boolean;
  startTime: number | null;
  text: string;
  targetText: string;
  calculateCurrentWPM: () => number;
  calculateAccuracy: (text: string, targetText: string) => number;
}

export const RealTimeChart: React.FC<RealTimeChartProps> = ({
  wpmHistory,
  accuracyHistory,
  safeStyles,
  isHydrated,
  themes,
  currentTheme,
  isActive,
  startTime,
  text,
  targetText,
  calculateCurrentWPM,
  calculateAccuracy
}) => {
  const { getChartData, chartOptions } = useChartConfig({
    wpmHistory,
    accuracyHistory,
    safeStyles,
    isHydrated,
    themes,
    currentTheme
  });

  return (
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
  );
}; 