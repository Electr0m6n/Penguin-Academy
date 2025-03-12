'use client'

import React, { useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, X } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-black/90 border rounded-xl p-6 w-full max-w-xl mx-auto relative"
        style={{ 
          borderColor: themeColors.correct,
          boxShadow: `0 0 20px ${themeColors.correct}40`
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-mono" style={{ color: themeColors.correct }}>
            <Trophy size={24} className="inline-block mr-2" style={{ color: themeColors.correct }} />
            Top 25 Ranking
          </h2>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Tabla de clasificación */}
        <div className="overflow-y-auto max-h-[60vh]">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b" style={{ borderColor: `${themeColors.correct}40` }}>
                <th className="p-2 font-mono text-gray-400">Posición</th>
                <th className="p-2 font-mono text-gray-400">Usuario</th>
                <th className="p-2 font-mono text-gray-400">WPM</th>
                <th className="p-2 font-mono text-gray-400">Precisión</th>
                <th className="p-2 font-mono text-gray-400">Modo</th>
              </tr>
            </thead>
            <tbody>
              {data.map((entry, index) => (
                <tr 
                  key={index} 
                  className={`border-b ${isInTop25 && entry.username === 'TuNombreDeUsuario' ? 'bg-yellow-500/20' : ''}`}
                  style={{ borderColor: `${themeColors.correct}20` }}
                >
                  <td className="p-2 font-mono" style={{ color: index < 3 ? themeColors.correct : themeColors.correct }}>
                    {index + 1}
                  </td>
                  <td className="p-2 font-mono" style={{ color: themeColors.correct }}>
                    {entry.username} {isInTop25 && entry.username === 'TuNombreDeUsuario' && '(Tú)'}
                  </td>
                  <td className="p-2 font-mono" style={{ color: themeColors.correct }}>
                    {entry.wpm}
                  </td>
                  <td className="p-2 font-mono" style={{ color: themeColors.correct }}>
                    {entry.accuracy}%
                  </td>
                  <td className="p-2 font-mono" style={{ color: entry.is_competitive ? themeColors.correct : themeColors.correct }}>
                    {entry.is_competitive ? (
                      <div className="flex items-center">
                        <Trophy 
                          size={14} 
                          className="mr-1" 
                          style={{
                            color: entry.is_competitive 
                              ? themeColors.correct 
                              : ''
                          }}
                        />
                        <span>Comp</span>
                      </div>
                    ) : (
                      <span className="opacity-70">Normal</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {data.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              Cargando datos...
            </div>
          )}
        </div>
        
        {/* Botón para enviar puntaje si se ha completado una prueba */}
        {endTime && !hasSubmittedScore && (
          <div className="mt-6 border-t pt-4" style={{ borderColor: `${themeColors.correct}20` }}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <p className="text-gray-400 font-mono">Tu puntaje actual:</p>
                <p className="font-mono" style={{ color: themeColors.correct }}>
                  <span className="text-xl font-bold">{wpm} WPM</span> con 
                  <span className="ml-2 text-xl font-bold">{accuracy}% precisión</span>
                  <span className="ml-2">
                    {isCompetitiveMode && (
                      <Trophy 
                        size={14} 
                        className="inline-block ml-1 mr-1" 
                        style={{
                          color: isCompetitiveMode 
                            ? themeColors.correct 
                            : ''
                        }}
                      />
                    )}
                    <span className="text-sm opacity-70">
                      {isCompetitiveMode ? 'Competitivo' : 'Normal'}
                    </span>
                  </span>
                </p>
              </div>
              <button
                onClick={memoizedSubmitScore}
                disabled={isSubmittingScore}
                className="px-4 py-2 rounded font-mono font-bold transition-all"
                style={{ 
                  backgroundColor: isSubmittingScore ? `${themeColors.correct}50` : themeColors.correct,
                  color: isSubmittingScore ? 'gray' : 'black',
                }}
              >
                {isSubmittingScore ? 'Enviando...' : 'Publicar puntaje'}
              </button>
            </div>
          </div>
        )}
        
        {hasSubmittedScore && (
          <div className="mt-6 border-t pt-4" style={{ borderColor: `${themeColors.correct}20` }}>
            <p className="text-center font-mono" style={{ color: themeColors.correct }}>
              {isInTop25 
                ? '¡Felicidades! Tu puntaje está en el Top 25' 
                : 'Puntaje enviado. Sigue practicando para entrar al Top 25'}
            </p>
          </div>
        )}
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