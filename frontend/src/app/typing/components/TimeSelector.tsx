'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { TestDuration } from '../types';

interface TimeSelectorProps {
  selectedTime: TestDuration;
  isCompetitiveMode: boolean;
  isActive: boolean;
  onTimeChange: (time: TestDuration) => void;
}

export function TimeSelector({
  selectedTime,
  isCompetitiveMode,
  isActive,
  onTimeChange
}: TimeSelectorProps) {
  return (
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
            onClick={() => onTimeChange(time as 15 | 30 | 60 | 120)}
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
          onClick={() => onTimeChange('competitive')}
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
  );
} 