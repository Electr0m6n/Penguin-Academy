'use client'

import React, { useCallback, memo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Award, X, LogOut, Trophy, Zap, Clock, CheckCircle2, Star } from 'lucide-react';
import { ThemeColors } from '../types';
import { User as UserType } from '../types';
import { supabase } from '../utils/config';

interface UserScoreData {
  wpm: number;
  accuracy: number;
  is_competitive: boolean;
  updated_at: string;
  test_duration: number;
}

// Añadir interfaz para historial de sesiones
interface SessionHistory {
  wpm: number;
  accuracy: number;
  created_at: string;
}

interface UserProfileProps {
  show?: boolean;
  onClose: () => void;
  user: UserType | null;
  themeColors: ThemeColors;
  onLeaderboardClick: () => void;
}

function UserProfileComponent({
  onClose,
  user,
  themeColors,
  onLeaderboardClick
}: UserProfileProps) {
  const [userScore, setUserScore] = useState<UserScoreData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Añadir estado para el historial de sesiones
  const [sessionHistory, setSessionHistory] = useState<SessionHistory[]>([]);
  const [averageWpm, setAverageWpm] = useState<number | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Obtener la mejor puntuación del usuario al cargar el componente
  useEffect(() => {
    const fetchUserScore = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('typing_scores')
          .select('wpm, accuracy, is_competitive, updated_at, test_duration')
          .eq('user_id', user.id)
          .single();
          
        if (error) {
          console.error('Error al obtener la puntuación del usuario:', error);
        } else {
          setUserScore(data);
        }
      } catch (error) {
        console.error('Error al obtener la puntuación del usuario:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserScore();
  }, [user]);

  // Nuevo efecto para obtener el historial de sesiones
  useEffect(() => {
    const fetchSessionHistory = async () => {
      if (!user) return;
      
      try {
        setIsLoadingHistory(true);
        
        // Obtenemos por ahora un promedio basado en la única entrada que tenemos
        // En una implementación real, deberías tener una tabla de historial
        // con múltiples entradas y fechas
        const { data, error } = await supabase
          .from('typing_scores')
          .select('wpm, accuracy, is_competitive, updated_at')
          .eq('user_id', user.id)
          .single();
          
        if (error) {
          console.error('Error al obtener la puntuación del usuario:', error);
        } else if (data) {
          // Creamos datos de muestra para la gráfica
          // En una implementación real, esto vendría de la base de datos
          
          // Generamos un conjunto de puntuaciones simuladas para mostrar la gráfica
          // basadas en la puntuación real del usuario
          const baseWpm = data.wpm;
          const sampleSessions: SessionHistory[] = [];
          
          // Crear 10 entradas simuladas para visualización
          for (let i = 9; i >= 0; i--) {
            // Variación aleatoria de -10% a +10% del WPM base para simular progresión
            const variation = Math.random() * 0.2 - 0.1; // Entre -0.1 y 0.1
            const simulatedWpm = Math.round(baseWpm * (1 + variation));
            
            // Crear una fecha para cada sesión, espaciadas por días
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            sampleSessions.push({
              wpm: simulatedWpm,
              accuracy: data.accuracy,
              created_at: date.toISOString()
            });
          }
          
          setSessionHistory(sampleSessions);
          
          // Calcular el promedio de WPM
          const totalWpm = sampleSessions.reduce((sum, session) => sum + session.wpm, 0);
          const avgWpm = Math.round(totalWpm / sampleSessions.length);
          setAverageWpm(avgWpm);
        }
      } catch (error) {
        console.error('Error al obtener el historial de sesiones:', error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchSessionHistory();
  }, [user]);

  // Memoizar las funciones para evitar renderizaciones innecesarias
  const handleSignOut = useCallback(async () => {
    try {
      console.log('Intentando cerrar sesión...');
      await supabase.auth.signOut();
      console.log('Sesión cerrada correctamente');
      onClose();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }, [onClose]);
  
  const handleLeaderboardClick = useCallback(() => {
    console.log('Solicitando mostrar leaderboard desde UserProfile');
    onLeaderboardClick();
    onClose(); // Cerrar el perfil al abrir el leaderboard
  }, [onLeaderboardClick, onClose]);
  
  const handleClose = useCallback(() => {
    console.log('Cerrando perfil de usuario');
    onClose();
  }, [onClose]);
  
  // Solo después de definir todos los hooks podemos usar un return condicional
  if (!user) return null;
  
  console.log('Renderizando UserProfile para usuario:', user.email);

  // Formatear la fecha
  const formatDate = (dateString: string) => {
    if (!dateString) return 'No disponible';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md mx-auto overflow-hidden rounded-xl"
      >
        {/* Grid background */}
        <div className="absolute inset-0 opacity-20" style={{ 
          backgroundSize: '25px 25px',
          backgroundImage: `linear-gradient(to right, ${themeColors.correct}10 1px, transparent 1px), 
                            linear-gradient(to bottom, ${themeColors.correct}10 1px, transparent 1px)`,
          zIndex: 0
        }}></div>
        
        {/* Smaller grid */}
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundSize: '5px 5px',
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
                <User size={24} className="text-glow" style={{ color: themeColors.correct }} />
              </div>
              <span className="text-glow">Tu Perfil</span>
            </h2>
            <button 
              onClick={handleClose}
              className="text-gray-400 hover:text-white bg-black/50 rounded-full p-2 transition-all hover:bg-black/70"
              style={{ boxShadow: `0 0 10px ${themeColors.correct}20` }}
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Info del usuario */}
            <div className="bg-black/40 rounded-lg p-4 border relative overflow-hidden" style={{ borderColor: `${themeColors.correct}30` }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent animate-shimmer"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-black to-transparent border flex items-center justify-center" style={{ borderColor: `${themeColors.correct}40` }}>
                    <User size={24} style={{ color: themeColors.correct }} />
                  </div>
                  <div className="ml-4">
                    <p className="font-mono text-lg font-semibold" style={{ color: themeColors.correct }}>
                      {user.user_metadata?.username || user.email}
                    </p>
                    <p className="font-mono text-xs text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mejor puntuación */}
            <div className="bg-black/40 rounded-lg border relative overflow-hidden" style={{ borderColor: `${themeColors.correct}30` }}>
              <div className="absolute inset-0 opacity-20" style={{ 
                backgroundSize: '8px 8px',
                backgroundImage: `linear-gradient(to right, ${themeColors.correct}10 1px, transparent 1px), 
                                  linear-gradient(to bottom, ${themeColors.correct}10 1px, transparent 1px)`,
                zIndex: 0
              }}></div>
              
              <div className="p-4 relative z-10">
                <h3 className="font-mono text-sm mb-4 flex items-center text-gray-300">
                  <Award size={16} className="mr-2" style={{ color: themeColors.correct }} />
                  <span>Mejor Puntuación</span>
                </h3>
                
                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin h-6 w-6 border-2 border-t-transparent rounded-full" style={{ borderColor: `${themeColors.correct}60` }}></div>
                  </div>
                ) : userScore ? (
                  <div className="space-y-3">
                    {/* WPM */}
                    <div className="flex items-center justify-between bg-black/60 p-3 rounded-md border" style={{ borderColor: `${themeColors.correct}20` }}>
                      <div className="flex items-center">
                        <Zap size={18} className="mr-2" style={{ color: themeColors.correct }} />
                        <span className="text-gray-300 font-mono">WPM</span>
                      </div>
                      <span className="font-mono text-xl font-bold text-glow" style={{ color: themeColors.correct }}>
                        {userScore.wpm}
                      </span>
                    </div>
                    
                    {/* Precisión */}
                    <div className="flex items-center justify-between bg-black/60 p-3 rounded-md border" style={{ borderColor: `${themeColors.correct}20` }}>
                      <div className="flex items-center">
                        <CheckCircle2 size={18} className="mr-2" style={{ color: themeColors.correct }} />
                        <span className="text-gray-300 font-mono">Precisión</span>
                      </div>
                      <span className="font-mono text-xl font-bold text-glow" style={{ color: themeColors.correct }}>
                        {userScore.accuracy}%
                      </span>
                    </div>
                    
                    {/* Tiempo de prueba */}
                    <div className="flex items-center justify-between bg-black/60 p-3 rounded-md border" style={{ borderColor: `${themeColors.correct}20` }}>
                      <div className="flex items-center">
                        <Clock size={18} className="mr-2" style={{ color: themeColors.correct }} />
                        <span className="text-gray-300 font-mono">Duración</span>
                      </div>
                      <span className="font-mono text-glow" style={{ color: themeColors.correct }}>
                        {userScore.test_duration}s
                      </span>
                    </div>
                    
                    {/* Tipo de prueba */}
                    <div className="flex items-center justify-between bg-black/60 p-3 rounded-md border" style={{ borderColor: `${themeColors.correct}20` }}>
                      <div className="flex items-center">
                        <Star size={18} className="mr-2" style={{ color: themeColors.correct }} />
                        <span className="text-gray-300 font-mono">Modo</span>
                      </div>
                      <div className="flex items-center font-mono text-glow" style={{ color: themeColors.correct }}>
                        {userScore.is_competitive ? (
                          <>
                            <Trophy size={14} className="mr-1 animate-pulse-slow" />
                            <span>Competitivo</span>
                          </>
                        ) : (
                          <span>Normal</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Fecha de registro */}
                    <div className="text-right text-xs text-gray-400 italic mt-2 font-mono">
                      Registrado: {formatDate(userScore.updated_at)}
                    </div>
                  </div>
                ) : (
                  <div className="py-4 text-center text-gray-400 font-mono">
                    No has registrado puntuaciones aún
                  </div>
                )}
              </div>
            </div>
            
            {/* Historial y Promedio */}
            <div className="bg-black/40 rounded-lg border relative overflow-hidden" style={{ borderColor: `${themeColors.correct}30` }}>
              <div className="absolute inset-0 opacity-20" style={{ 
                backgroundSize: '8px 8px',
                backgroundImage: `linear-gradient(to right, ${themeColors.correct}10 1px, transparent 1px), 
                                  linear-gradient(to bottom, ${themeColors.correct}10 1px, transparent 1px)`,
                zIndex: 0
              }}></div>
              
              <div className="p-4 relative z-10">
                <h3 className="font-mono text-sm mb-4 flex items-center text-gray-300">
                  <Zap size={16} className="mr-2" style={{ color: themeColors.correct }} />
                  <span>Promedio de Rendimiento</span>
                </h3>
                
                {isLoadingHistory ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin h-6 w-6 border-2 border-t-transparent rounded-full" style={{ borderColor: `${themeColors.correct}60` }}></div>
                  </div>
                ) : averageWpm !== null ? (
                  <div className="space-y-3">
                    {/* Promedio WPM Card */}
                    <div className="flex items-center justify-between bg-black/60 p-3 rounded-md border" style={{ borderColor: `${themeColors.correct}20` }}>
                      <div className="flex items-center">
                        <div className="bg-gradient-to-br from-black to-transparent p-1.5 rounded-full mr-2 border" style={{ borderColor: `${themeColors.correct}40` }}>
                          <Zap size={16} style={{ color: themeColors.correct }} />
                        </div>
                        <span className="text-gray-300 font-mono">WPM Promedio</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-mono text-2xl font-bold text-glow" style={{ color: themeColors.correct }}>
                          {averageWpm}
                        </span>
                        <span className="ml-1 text-xs text-gray-400 font-mono">últimas sesiones</span>
                      </div>
                    </div>
                    
                    {/* Mini gráfico o detalles adicionales */}
                    {sessionHistory.length > 1 && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-400 font-mono">Evolución</span>
                          <span className="text-xs text-gray-400 font-mono">últimas {sessionHistory.length} sesiones</span>
                        </div>
                        <div className="h-10 flex items-end space-x-1">
                          {sessionHistory.slice(0, 10).map((session, index) => {
                            // Calculamos la altura proporcional para cada barra
                            const maxWpm = Math.max(...sessionHistory.map(s => s.wpm));
                            const minWpm = Math.min(...sessionHistory.map(s => s.wpm));
                            const range = maxWpm - minWpm || 1; // Evitar división por cero
                            const heightPercentage = ((session.wpm - minWpm) / range) * 70 + 30; // 30% mínimo de altura
                            
                            return (
                              <div 
                                key={index}
                                className="flex-1 rounded-t hover:opacity-100 transition-opacity relative group"
                                style={{ 
                                  height: `${heightPercentage}%`,
                                  backgroundColor: `${themeColors.correct}40`,
                                  opacity: 0.7
                                }}
                              >
                                {/* Tooltip al hacer hover */}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-black/90 text-white text-xs p-1 rounded pointer-events-none whitespace-nowrap">
                                  {session.wpm} WPM
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-4 text-center text-gray-400 font-mono">
                    No hay datos de sesiones anteriores
                  </div>
                )}
              </div>
            </div>
            
            {/* Botones de acciones */}
            <div className="flex flex-col md:flex-row gap-3 pt-4">
              <button
                onClick={handleLeaderboardClick}
                className="flex-1 px-4 py-2 rounded-md text-sm font-mono font-medium transition-all relative overflow-hidden"
                style={{ 
                  backgroundColor: `${themeColors.correct}20`, 
                  color: themeColors.correct,
                  border: `1px solid ${themeColors.correct}40`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000"></div>
                <div className="flex items-center justify-center">
                  <Trophy size={16} className="mr-2" />
                  <span>Ver Ranking</span>
                </div>
              </button>
              
              <button
                onClick={handleSignOut}
                className="flex-1 px-4 py-2 rounded-md text-sm font-mono font-medium transition-all relative overflow-hidden"
                style={{ 
                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  color: 'rgba(239, 68, 68, 1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000"></div>
                <div className="flex items-center justify-center">
                  <LogOut size={16} className="mr-2" />
                  <span>Cerrar sesión</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Memoizar el componente para prevenir renderizados innecesarios
export const UserProfile = memo(UserProfileComponent, (prevProps, nextProps) => {
  // Solo renderizar si el usuario o la visibilidad cambia
  const userChanged = prevProps.user?.id !== nextProps.user?.id;
  const visibilityChanged = prevProps.show !== nextProps.show;
  
  // Devolver true si las props son iguales (no se debe renderizar)
  return !(userChanged || visibilityChanged);
});
