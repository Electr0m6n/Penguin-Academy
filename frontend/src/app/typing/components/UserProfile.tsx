'use client'

import React, { useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { User, Crown, X } from 'lucide-react';
import { ThemeColors } from '../types';
import { User as UserType } from '../types';
import { supabase } from '../utils/config';

interface UserProfileProps {
  show?: boolean; // Opcional, ya que ahora es controlado por el padre
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
  // Memoizar las funciones para evitar renderizaciones innecesarias
  // IMPORTANTE: los hooks deben llamarse antes de cualquier return condicional
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
  }, [onLeaderboardClick]);
  
  const handleClose = useCallback(() => {
    console.log('Cerrando perfil de usuario');
    onClose();
  }, [onClose]);
  
  // Solo después de definir todos los hooks podemos usar un return condicional
  if (!user) return null;
  
  console.log('Renderizando UserProfile para usuario:', user.email);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-black/90 border rounded-xl p-6 w-full max-w-md mx-auto relative"
        style={{ 
          borderColor: themeColors.correct,
          boxShadow: `0 0 20px ${themeColors.correct}40`
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-mono" style={{ color: themeColors.correct }}>
            <User size={24} className="inline-block mr-2" />
            Tu Perfil
          </h2>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-gray-400 text-sm font-mono">Usuario</p>
            <p className="font-mono text-lg" style={{ color: themeColors.correct }}>
              {user.user_metadata?.username || user.email}
            </p>
          </div>
          
          <div>
            <p className="text-gray-400 text-sm font-mono">Email</p>
            <p className="font-mono" style={{ color: themeColors.correct }}>
              {user.email}
            </p>
          </div>
          
          <div>
            <p className="text-gray-400 text-sm font-mono">Mejor Puntaje Competitivo</p>
            <div className="flex items-center space-x-4 mt-1">
              <button
                onClick={handleLeaderboardClick}
                className="px-3 py-1 rounded text-sm transition-colors backdrop-blur-sm border flex items-center"
                style={{ 
                  color: themeColors.correct,
                  borderColor: `${themeColors.correct}50`,
                  backgroundColor: `${themeColors.background}90`
                }}
              >
                <Crown size={16} className="mr-1" style={{ color: themeColors.correct }} />
                Ver ranking
              </button>
            </div>
          </div>
          
          <div className="pt-4 border-t" style={{ borderColor: `${themeColors.correct}30` }}>
            <button
              onClick={handleSignOut}
              className="px-3 py-1 rounded text-sm transition-colors backdrop-blur-sm border w-full"
              style={{ 
                color: 'rgba(239, 68, 68, 1)',
                borderColor: 'rgba(239, 68, 68, 0.5)',
                backgroundColor: `${themeColors.background}90`
              }}
            >
              Cerrar sesión
            </button>
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
