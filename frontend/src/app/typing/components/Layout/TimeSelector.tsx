'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, LineChart, AlignLeft, Code } from 'lucide-react';
import { Theme } from '../../types';
import { TestDuration } from '../../types';

interface TimeSelectorProps {
  isActive: boolean;
  isHydrated: boolean;
  selectedTime: TestDuration;
  isCompetitiveMode: boolean;
  showRealTimeChart: boolean;
  themes: Theme[];
  currentTheme: string;
  handleTimeChange: (time: TestDuration) => void;
  handleToggleChart: () => void;
  codeMode: boolean;
  handleToggleCodeMode: () => void;
}

export const TimeSelector: React.FC<TimeSelectorProps> = ({
  isActive,
  isHydrated,
  selectedTime,
  isCompetitiveMode,
  showRealTimeChart,
  themes,
  currentTheme,
  handleTimeChange,
  handleToggleChart,
  codeMode,
  handleToggleCodeMode
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-6 inset-x-0 z-[90] flex justify-center items-center space-x-2`}
      style={{ 
        opacity: isActive ? 0 : 1,
        visibility: isActive ? 'hidden' : 'visible',
        pointerEvents: isActive ? 'none' : 'auto'
      }}
    >
      <div className="bg-zinc-900/80 backdrop-blur-sm rounded-lg py-2 px-1 flex items-center gap-1 shadow-lg">
        {/* Selectores de modo: normal y código */}
        <div className="flex border-r border-zinc-700 mr-1 pr-1">
          <button
            onClick={() => !codeMode ? null : handleToggleCodeMode()}
            className={`px-3 py-1 text-sm font-medium transition-colors hover:opacity-80 flex items-center justify-center`}
            title="Modo normal: frases y citas"
            style={{ 
              color: isHydrated 
                ? !codeMode
                  ? themes.find(t => t.id === currentTheme)?.colors[2] || '#FFFFFF'
                  : themes.find(t => t.id === currentTheme)?.colors[0] || '#AAAAAA'
                : '#AAAAAA'
            }}
          >
            <AlignLeft size={16} />
          </button>
          <button
            onClick={() => codeMode ? null : handleToggleCodeMode()}
            className={`px-3 py-1 text-sm font-medium transition-colors hover:opacity-80 flex items-center justify-center`}
            title="Modo código: Python y conceptos de IA"
            style={{ 
              color: isHydrated 
                ? codeMode
                  ? themes.find(t => t.id === currentTheme)?.colors[2] || '#FFFFFF'
                  : themes.find(t => t.id === currentTheme)?.colors[0] || '#AAAAAA'
                : '#AAAAAA'
            }}
          >
            <Code size={16} />
          </button>
        </div>
        
        {/* Selectores de tiempo existentes */}
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
  );
}; 