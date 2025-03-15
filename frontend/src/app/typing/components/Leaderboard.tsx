'use client'

import React, { useCallback, memo, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, X, Zap, Medal, Award, Info } from 'lucide-react';
import { ThemeColors, LeaderboardEntry } from '../types';

interface LeaderboardProps {
  show?: boolean;
  onClose: () => void;
  data: LeaderboardEntry[];
  themeColors: ThemeColors;
  endTime: number | null;
  hasSubmittedScore: boolean;
  isInTop25: boolean;
  isSubmittingScore: boolean;
  isCompetitiveMode: boolean;
  handleSubmitScore: () => void;
  wpm: number | null;
  accuracy: number | null;
}

function LeaderboardComponent({
  onClose,
  data,
  themeColors,
  endTime,
  hasSubmittedScore,
  isInTop25,
  isSubmittingScore,
  isCompetitiveMode,
  handleSubmitScore,
  wpm,
  accuracy
}: LeaderboardProps) {
  console.log('Renderizando Leaderboard, datos:', data.length);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  
  // Evitar cierres accidentales con doble click
  const handleClose = useCallback(() => {
    console.log('Cerrando Leaderboard');
    onClose();
  }, [onClose]);
  
  const memoizedSubmitScore = useCallback(() => {
    console.log('Solicitando envío de puntuación');
    handleSubmitScore();
  }, [handleSubmitScore]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-xl mx-auto overflow-hidden rounded-xl"
      >
        {/* Grid background for Leaderboard */}
        <div className="absolute inset-0 grid-background opacity-20" style={{ 
          backgroundSize: '25px 25px',
          backgroundImage: `linear-gradient(to right, ${themeColors.correct}10 1px, transparent 1px), 
                            linear-gradient(to bottom, ${themeColors.correct}10 1px, transparent 1px)`,
          zIndex: 0
        }}></div>
        
        {/* Smaller grid */}
        <div className="absolute inset-0 grid-background-small opacity-10" style={{ 
          backgroundSize: '5px 5px',
          backgroundImage: `linear-gradient(to right, ${themeColors.correct}10 1px, transparent 1px), 
                            linear-gradient(to bottom, ${themeColors.correct}10 1px, transparent 1px)`,
          zIndex: 0
        }}></div>
        
        {/* Micro grid for extra texture */}
        <div className="absolute inset-0 grid-background-micro opacity-5" style={{ 
          backgroundSize: '2px 2px',
          backgroundImage: `linear-gradient(to right, ${themeColors.correct}10 1px, transparent 1px), 
                            linear-gradient(to bottom, ${themeColors.correct}10 1px, transparent 1px)`,
          zIndex: 0
        }}></div>
        
        {/* Content container */}
        <div className="relative z-10 bg-black/80 border rounded-xl p-6 w-full" style={{ 
          borderColor: `${themeColors.correct}40`,
          boxShadow: `0 0 20px ${themeColors.correct}40, inset 0 0 15px ${themeColors.correct}20`
        }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-mono flex items-center" style={{ color: themeColors.correct }}>
              <div className="bg-gradient-to-br from-black to-transparent p-2 rounded-full mr-3 border" style={{ borderColor: `${themeColors.correct}60` }}>
                <Trophy size={24} className="text-glow" style={{ color: themeColors.correct }} />
              </div>
              <span className="text-glow">Top 25 Ranking</span>
            </h2>
            <button 
              onClick={handleClose}
              className="text-gray-400 hover:text-white bg-black/50 rounded-full p-2 transition-all hover:bg-black/70"
              style={{ boxShadow: `0 0 10px ${themeColors.correct}20` }}
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Tabla de clasificación */}
          <div className="overflow-y-auto max-h-[60vh] scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-500 scrollbar-track-transparent pr-1">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b sticky top-0 z-10" style={{ 
                  borderColor: `${themeColors.correct}30`,
                  background: `linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.8) 100%)`
                }}>
                  <th className="p-2 font-mono text-gray-400">
                    <div className="flex items-center">
                      <Medal size={14} className="mr-1" />
                      Posición
                    </div>
                  </th>
                  <th className="p-2 font-mono text-gray-400">
                    <div className="flex items-center">
                      <Award size={14} className="mr-1" />
                      Usuario
                    </div>
                  </th>
                  <th className="p-2 font-mono text-gray-400">
                    <div className="flex items-center">
                      <Zap size={14} className="mr-1" />
                      WPM
                    </div>
                  </th>
                  <th className="p-2 font-mono text-gray-400">
                    <div className="flex items-center">
                      <Info size={14} className="mr-1" />
                      Precisión
                    </div>
                  </th>
                  <th className="p-2 font-mono text-gray-400">
                    <div className="flex items-center">
                      <Trophy size={14} className="mr-1" />
                      Modo
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((entry, index) => (
                  <motion.tr 
                    key={index} 
                    className={`border-b transition-colors ${
                      isInTop25 && entry.username === 'TuNombreDeUsuario' 
                        ? 'bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent' 
                        : index % 2 === 0 ? 'bg-black/40' : 'bg-black/20'
                    }`}
                    style={{ borderColor: `${themeColors.correct}10` }}
                    onMouseEnter={() => setHoveredRow(index)}
                    onMouseLeave={() => setHoveredRow(null)}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.2, 
                      delay: index * 0.03,
                      ease: "easeOut"
                    }}
                  >
                    <td className="p-2 font-mono flex items-center gap-2" style={{ color: index < 3 ? themeColors.correct : 'white' }}>
                      {index < 3 ? (
                        <div className={`flex items-center justify-center w-6 h-6 rounded-full text-black font-bold text-xs ${
                          index === 0 
                            ? 'bg-gradient-to-br from-yellow-300 to-yellow-600' 
                            : index === 1 
                              ? 'bg-gradient-to-br from-gray-300 to-gray-500' 
                              : 'bg-gradient-to-br from-amber-600 to-amber-800'
                        }`}>
                          {index + 1}
                        </div>
                      ) : (
                        <span className={`opacity-60 transition-opacity ${hoveredRow === index ? 'opacity-100' : ''}`}>{index + 1}</span>
                      )}
                    </td>
                    <td className="p-2 font-mono" style={{ color: themeColors.correct }}>
                      {entry.username} {isInTop25 && entry.username === 'TuNombreDeUsuario' && (
                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300">
                          Tú
                        </span>
                      )}
                    </td>
                    <td className="p-2 font-mono font-bold" style={{ 
                      color: themeColors.correct,
                      textShadow: hoveredRow === index ? `0 0 8px ${themeColors.correct}80` : 'none'
                    }}>
                      {entry.wpm}
                    </td>
                    <td className="p-2 font-mono" style={{ color: themeColors.correct }}>
                      {entry.accuracy}%
                    </td>
                    <td className="p-2 font-mono" style={{ color: themeColors.correct }}>
                      {entry.is_competitive ? (
                        <div className="flex items-center">
                          <Trophy 
                            size={14} 
                            className="mr-1 animate-pulse-slow" 
                            style={{ color: themeColors.correct }}
                          />
                          <span>Comp</span>
                        </div>
                      ) : (
                        <span className="opacity-70">Normal</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            
            {data.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <div className="inline-block p-3 rounded-full bg-black/30 border mb-3" style={{ borderColor: `${themeColors.correct}20` }}>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="h-6 w-6 border-2 border-t-transparent rounded-full" 
                    style={{ borderColor: `${themeColors.correct}60` }}
                  ></motion.div>
                </div>
                <div>Cargando datos...</div>
              </div>
            )}
          </div>
          
          {/* Botón para enviar puntaje si se ha completado una prueba */}
          {endTime && !hasSubmittedScore && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 border-t pt-4" 
              style={{ borderColor: `${themeColors.correct}20` }}
            >
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <p className="text-gray-400 font-mono">Tu puntaje actual:</p>
                  <p className="font-mono" style={{ color: themeColors.correct }}>
                    <span className="text-xl font-bold text-glow">{wpm} WPM</span> con 
                    <span className="ml-2 text-xl font-bold text-glow">{accuracy}% precisión</span>
                    <span className="ml-2">
                      {isCompetitiveMode && (
                        <Trophy 
                          size={14} 
                          className="inline-block ml-1 mr-1" 
                          style={{ color: themeColors.correct }}
                        />
                      )}
                      <span className="text-sm opacity-70">
                        {isCompetitiveMode ? 'Competitivo' : 'Normal'}
                      </span>
                    </span>
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={memoizedSubmitScore}
                  disabled={isSubmittingScore}
                  className="px-6 py-2 rounded-md font-mono font-bold transition-all relative overflow-hidden group"
                  style={{ 
                    backgroundColor: isSubmittingScore ? `${themeColors.correct}30` : themeColors.correct,
                    color: isSubmittingScore ? 'gray' : 'black',
                    boxShadow: isSubmittingScore ? 'none' : `0 0 15px ${themeColors.correct}40`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <span className="relative z-10">{isSubmittingScore ? 'Enviando...' : 'Publicar puntaje'}</span>
                </motion.button>
              </div>
            </motion.div>
          )}
          
          {hasSubmittedScore && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 border-t pt-4" 
              style={{ borderColor: `${themeColors.correct}20` }}
            >
              <p className={`text-center font-mono py-3 rounded-lg ${
                isInTop25 
                  ? 'bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent' 
                  : 'bg-gradient-to-r from-transparent via-blue-500/20 to-transparent'
              }`}
                 style={{ color: themeColors.correct }}>
                {isInTop25 
                  ? '¡Felicidades! Tu puntaje está en el Top 25' 
                  : 'Puntaje enviado. Sigue practicando para entrar al Top 25'}
              </p>
              
              {isInTop25 && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="flex justify-center mt-3"
                >
                  <Trophy size={30} className="text-yellow-500 drop-shadow-glow" style={{ 
                    filter: 'drop-shadow(0 0 8px rgba(234, 179, 8, 0.5))'
                  }} />
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// Exportar el componente memoizado para evitar renderizaciones innecesarias
export const Leaderboard = memo(LeaderboardComponent, (prevProps, nextProps) => {
  // Solo renderizar si cambian datos importantes
  const dataChanged = prevProps.data.length !== nextProps.data.length;
  const visibilityChanged = prevProps.show !== nextProps.show;
  const scoreSubmissionChanged = prevProps.hasSubmittedScore !== nextProps.hasSubmittedScore 
    || prevProps.isSubmittingScore !== nextProps.isSubmittingScore;
    
  // Renderizar solo si cambia algo relevante
  return !(dataChanged || visibilityChanged || scoreSubmissionChanged);
}); 