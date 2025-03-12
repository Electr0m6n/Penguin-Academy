'use client'

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Keyboard, User, Crown } from 'lucide-react';
import { ThemeColors } from '../types';

interface HeaderProps {
  themeColors: ThemeColors;
  isActive: boolean;
  onProfileClick: () => void;
  onLeaderboardClick: () => void;
  isLoadingUser: boolean;
}

export function Header({
  themeColors,
  isActive,
  onProfileClick,
  onLeaderboardClick,
  isLoadingUser
}: HeaderProps) {
  return (
    <>
      {/* Logo en la esquina izquierda - Siempre visible */}
      <div className="fixed top-6 left-20 z-50 flex items-center space-x-4">
        <Keyboard 
          size={32} 
          className="text-white opacity-90"
          style={{ color: themeColors.correct }}
        />
        <Link href="/">
          <span 
            className="text-3xl font-mono font-bold tracking-tight cursor-pointer hover:opacity-80 transition-opacity"
            style={{ color: themeColors.correct }}
          >
            penguintype
          </span>
        </Link>
      </div>
      
      {/* Botones de perfil y ranking en la esquina superior derecha - Visible solo cuando no está escribiendo */}
      <div 
        className={`fixed top-6 right-6 z-50 flex space-x-4 transition-opacity duration-300 ${
          isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onProfileClick}
          className="text-zinc-400 hover:text-white transition-colors p-2"
          aria-label={isLoadingUser ? 'Cargando...' : 'Perfil'}
        >
          <User size={22} />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onLeaderboardClick}
          className="text-zinc-400 hover:text-white transition-colors p-2"
          aria-label="Ranking"
        >
          <Crown size={22} />
        </motion.button>
      </div>
    </>
  );
} 