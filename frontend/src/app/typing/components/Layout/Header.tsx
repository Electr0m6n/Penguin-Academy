'use client'

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Keyboard, Crown, User } from 'lucide-react';
import { ThemeButton } from '../ThemeButton';
import { Theme, ThemeColors } from '../../types';

interface HeaderProps {
  isActive: boolean;
  isHydrated: boolean;
  themes: Theme[];
  currentTheme: string;
  showThemeSelector: boolean;
  setShowThemeSelector: (show: boolean) => void;
  setCurrentTheme: (theme: string) => void;
  safeStyles: {
    backgroundColor: string;
    color: string;
  };
  themeColors: ThemeColors;
  isLoadingUser: boolean;
  currentUser: { id?: string; username?: string } | null;
  handleProfileClick: () => void;
  handleLeaderboardToggle: () => void;
  handleReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isActive,
  isHydrated,
  themes,
  currentTheme,
  showThemeSelector,
  setShowThemeSelector,
  setCurrentTheme,
  safeStyles,
  themeColors,
  isLoadingUser,
  currentUser,
  handleProfileClick,
  handleLeaderboardToggle,
  handleReset
}) => {
  return (
    <>
      {/* Logo en la esquina izquierda */}
      <div className="fixed top-6 left-20 z-50 flex items-center space-x-4" style={{ opacity: 1, visibility: 'visible' }}>
        <Keyboard 
          size={32} 
          className="text-white opacity-90"
          style={{ color: isHydrated 
            ? themes.find(t => t.id === currentTheme)?.colors[2] || safeStyles.color 
            : safeStyles.color 
          }}
        />
        <div className="flex items-baseline">
          <Link href="/">
            <span 
              className="text-3xl font-mono font-bold tracking-tight cursor-pointer hover:opacity-80 transition-opacity"
              style={{ color: isHydrated 
                ? themes.find(t => t.id === currentTheme)?.colors[1] || safeStyles.color 
                : safeStyles.color 
              }}
            >
              penguin
            </span>
          </Link>
          <span 
            onClick={handleReset}
            className="text-3xl font-mono font-bold tracking-tight cursor-pointer hover:opacity-80 transition-opacity"
            style={{ color: isHydrated 
              ? themes.find(t => t.id === currentTheme)?.colors[2] || safeStyles.color 
              : safeStyles.color 
            }}
          >
            type
          </span>
        </div>
      </div>
      
      {/* Botones de perfil, ranking y temas */}
      <div 
        className="fixed top-6 right-6 z-50 flex items-center space-x-4 transition-opacity duration-300"
        style={{ 
          opacity: isActive ? 0 : 1, 
          pointerEvents: isActive ? 'none' : 'auto',
          visibility: isActive ? 'hidden' : 'visible'
        }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleProfileClick}
          className="text-zinc-400 hover:text-white transition-colors p-2"
          aria-label={isLoadingUser ? 'Cargando...' : currentUser ? 'Perfil' : 'Iniciar sesión'}
          style={{ color: isHydrated 
            ? themes.find(t => t.id === currentTheme)?.colors[0] || '#AAAAAA' 
            : '#AAAAAA'
          }}
        >
          <User size={22} />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLeaderboardToggle}
          className="text-zinc-400 hover:text-white transition-colors p-2"
          aria-label="Ranking"
          style={{ color: isHydrated 
            ? themes.find(t => t.id === currentTheme)?.colors[0] || '#AAAAAA' 
            : '#AAAAAA'
          }}
        >
          <Crown size={22} />
        </motion.button>
        
        {/* Botón de temas integrado en la barra superior */}
        <ThemeButton
          themes={themes}
          currentTheme={currentTheme}
          themeColors={safeStyles.color === '#777777' ? {
            correct: '#777777',
            cursor: '#999999',
            error: '#FF5555',
            typed: '#FFFFFF',
            background: '#000000'
          } : themeColors}
          isActive={isActive}
          showThemeSelector={showThemeSelector}
          setShowThemeSelector={setShowThemeSelector}
          setCurrentTheme={setCurrentTheme}
          position="top"
        />
      </div>
    </>
  );
}; 