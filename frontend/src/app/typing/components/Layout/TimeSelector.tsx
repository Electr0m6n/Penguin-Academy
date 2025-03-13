'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, LineChart } from 'lucide-react';
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
  handleToggleChart
}) => {
  return (
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
  );
}; 