'use client'

import React from 'react';
import { Theme } from '../../types';

interface TextDisplayProps {
  text: string;
  targetText: string;
  textContainerRef: React.RefObject<HTMLDivElement | null>;
  handleFocus: () => void;
  isHydrated: boolean;
  themes: Theme[];
  currentTheme: string;
  themeColors: {
    correct: string;
    cursor: string;
    error: string;
    typed: string;
    background: string;
  };
}

export const TextDisplay: React.FC<TextDisplayProps> = ({
  text,
  targetText,
  textContainerRef,
  handleFocus,
  isHydrated,
  themes,
  currentTheme,
  themeColors
}) => {
  return (
    <div 
      className="rounded-xl p-4 cursor-text w-full max-w-[80%] mx-auto h-64 relative overflow-hidden"
      onClick={handleFocus}
      ref={textContainerRef}
    >
      <div className="flex items-center justify-center h-full">
        <div className="text-xl md:text-4xl leading-relaxed font-mono tracking-wide w-full text-justify" style={{ 
          fontVariantLigatures: 'none', 
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Menlo', 'Consolas', monospace",
          textShadow: isHydrated ? `0 0 8px ${themeColors.background}, 0 0 2px ${themes.find(t => t.id === currentTheme)?.colors[0]}40` : 'none'
        }}>
          {(() => {
            // Número aproximado de caracteres por línea basado en el ancho del contenedor
            const charsPerLine = 59; // Ajusta este valor según el ancho de tu contenedor y tamaño de fuente
            
            // Dividir el texto en líneas lógicas (por palabras)
            const textLines: string[] = [];
            let currentLine = '';
            let wordBuffer = '';
            
            // Crear las líneas dividiendo por palabras
            for (let i = 0; i < targetText.length; i++) {
              const char = targetText[i];
              wordBuffer += char;
              
              if (char === ' ' || i === targetText.length - 1) {
                // Si añadir esta palabra excede el límite de caracteres y la línea no está vacía
                if (currentLine.length + wordBuffer.length > charsPerLine && currentLine.length > 0) {
                  textLines.push(currentLine);
                  currentLine = wordBuffer;
                } else {
                  currentLine += wordBuffer;
                }
                wordBuffer = '';
              }
            }
            
            // Añadir la última línea si queda algo
            if (currentLine.length > 0) {
              textLines.push(currentLine);
            }
            
            // Calcular índices de inicio y fin de cada línea para navegación precisa
            const lineIndices = [];
            let charCount = 0;
            
            for (const line of textLines) {
              const startIndex = charCount;
              charCount += line.length;
              const endIndex = charCount;
              lineIndices.push({ startIndex, endIndex });
            }
            
            // Encontrar en qué línea está actualmente el cursor
            let currentLineIndex = 0;
            for (let i = 0; i < lineIndices.length; i++) {
              if (text.length < lineIndices[i].endIndex) {
                currentLineIndex = i;
                break;
              }
            }
            
            // Si hemos llegado al final del texto, quedarnos en la última línea
            if (text.length >= targetText.length && lineIndices.length > 0) {
              currentLineIndex = lineIndices.length - 1;
            }
            
            // Decidir qué líneas mostrar (3 líneas)
            let startLineIndex = Math.max(0, currentLineIndex);
            
            // Asegurarnos de no exceder los límites
            startLineIndex = Math.max(0, Math.min(startLineIndex, textLines.length - 3));
            const endLineIndex = Math.min(textLines.length - 1, startLineIndex + 2);
            
            // Calcular el rango de caracteres a mostrar
            const startCharIndex = startLineIndex > 0 ? lineIndices[startLineIndex].startIndex : 0;
            const endCharIndex = endLineIndex < lineIndices.length ? lineIndices[endLineIndex].endIndex : targetText.length;
            
            // Renderizar solo los caracteres dentro del rango visible
            return targetText.slice(startCharIndex, endCharIndex).split('').map((char, localIndex) => {
              const globalIndex = startCharIndex + localIndex;
              let className = "opacity-70";
              let style: React.CSSProperties = { color: '#777777' };
              
              if (isHydrated) {
                // Encontrar el tema actual para colores específicos
                const currentThemeObj = themes.find(t => t.id === currentTheme) || themes[0];
                
                // Solo aplicar estilos específicos del tema después de la hidratación
                if (globalIndex < text.length) {
                  // Carácter ya escrito
                  if (text[globalIndex] === char) {
                    className = "text-theme-correct";
                    // Usar el tercer color del tema (index 2) para texto ya escrito
                    style = { 
                      color: currentThemeObj.colors[2],
                      textShadow: `0 0 4px ${currentThemeObj.colors[2]}30`
                    };
                  } else {
                    className = "text-theme-error border-b-2";
                    // Siempre usar rojo para caracteres incorrectos
                    style = { 
                      color: '#FF3333',
                      borderBottomColor: '#FF3333',
                      textShadow: '0 0 5px rgba(255, 0, 0, 0.3)',
                      fontWeight: 'bold'
                    };
                  }
                } else if (globalIndex === text.length) {
                  // Carácter actual (cursor)
                  className = "text-white animate-pulse";
                  const cursorColor = themes.find(t => t.id === currentTheme)?.colors[1] || themeColors.cursor;
                  style = { 
                    backgroundColor: `${cursorColor}90`,
                    color: '#FFFFFF',
                    borderRadius: '2px',
                    padding: '0 2px',
                    textShadow: `0 0 8px #FFFFFF90`,
                    boxShadow: `0 0 8px ${cursorColor}70`
                  };
                } else {
                  // Carácter no escrito todavía - usar el primer color del tema
                  className = "opacity-70";
                  // Usar el primer color del tema (index 0) para texto no escrito
                  style = { color: currentThemeObj.colors[0] };
                }
              }
              
              // Espacio en blanco
              if (char === ' ') {
                return (
                  <span 
                    key={globalIndex} 
                    className={`${className} px-2 font-light`}
                    style={{...style, letterSpacing: '0.05em'}}
                  >
                    {char}
                  </span>
                );
              }
              
              return (
                <span 
                  key={globalIndex} 
                  className={`${className} font-light`}
                  style={{...style, letterSpacing: '0.05em'}}
                >
                  {char}
                </span>
              );
            });
          })()}
        </div>
      </div>
    </div>
  );
}; 