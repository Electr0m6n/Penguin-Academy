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
  codeMode?: boolean; // Añadir prop para detectar el modo código
  showRealTimeChart?: boolean; // Añadir prop para detectar si el gráfico está activo
}

export const TextDisplay: React.FC<TextDisplayProps> = ({
  text,
  targetText,
  textContainerRef,
  handleFocus,
  isHydrated,
  themes,
  currentTheme,
  themeColors,
  codeMode = false, // Valor por defecto
  showRealTimeChart = false // Valor por defecto
}) => {
  // Almacenar la versión anterior del texto objetivo para detectar cambios
  const prevTargetTextRef = React.useRef(targetText);
  
  // Efecto para detectar y responder a cambios en el texto objetivo
  React.useEffect(() => {
    // Verificar si ha habido un cambio en el texto objetivo
    if (prevTargetTextRef.current !== targetText) {
      console.log(`TextDisplay: Texto objetivo actualizado debido a cambio de modo: ${codeMode ? 'código' : 'normal'}`);
      
      // Si tenemos acceso al DOM, podemos hacer un "flash" para indicar el cambio
      if (textContainerRef && textContainerRef.current) {
        const container = textContainerRef.current;
        // Aplicar una animación de flash para indicar que el texto ha cambiado
        container.classList.add('text-update-flash');
        setTimeout(() => {
          container.classList.remove('text-update-flash');
        }, 300);
      }
      
      // Actualizar la referencia con el nuevo valor
      prevTargetTextRef.current = targetText;
    }
  }, [targetText, codeMode, textContainerRef]);
  
  // Memorizar el resultado para evitar recálculos innecesarios
  const isTextConcept = React.useMemo(
    () => {
      if (!codeMode) return false;
    
      // Verificar si el texto tiene indentación (común en código)
      const hasCodeIndentation = targetText.split('\n').some(line => line.startsWith('  ') || line.startsWith('\t'));
      
      // Verificar si contiene palabras clave típicas de código
      const hasCodeKeywords = targetText.split('\n').some(line => 
        /^\s*(def|class|import|from|if|for|while|return|function|var|const|let)\b/.test(line)
      );
      
      // Si no tiene indentación ni palabras clave típicas, probablemente es un concepto
      return !hasCodeIndentation && !hasCodeKeywords;
    }, 
    [targetText, codeMode]
  );
  
  // Dividir el texto en líneas (para mostrar números de línea en modo código)
  const textLines = React.useMemo(() => {
    if (!codeMode || isTextConcept) return [];
    // Usamos trim() para eliminar espacios en blanco al final del texto
    // que podrían causar líneas vacías adicionales
    return targetText.trim().split('\n');
  }, [targetText, codeMode, isTextConcept]);

  // Calcular la altura del contenedor de código basado en si se muestra el gráfico
  const getCodeContainerHeight = () => {
    // Si no hay gráfico, podemos usar mucho más espacio vertical
    if (!showRealTimeChart) {
      return 'max-h-[600px]';
    }
    return 'max-h-[250px]';
  };

  // Ajustar el ancho del contenedor basado en si se muestra el editor de código o no
  const getCodeContainerWidth = () => {
    // Si estamos en modo código y no es un concepto, usar el ancho expandido
    if (codeMode && !isTextConcept) {
      // Si no hay gráfico, podemos usar más ancho
      if (!showRealTimeChart) {
        return 'max-w-[95%]';
      }
      return 'max-w-[90%]';
    }
    // Para texto normal o conceptos, mantener el ancho original de 80%
    return 'max-w-[80%]';
  };

  return (
    <div 
      className={`cursor-text w-full ${getCodeContainerWidth()} mx-auto relative mb-6 ${codeMode && !isTextConcept ? 'h-auto' : 'h-64'}`}
      onClick={handleFocus}
      ref={textContainerRef}
    >
      {codeMode && !isTextConcept ? (
        // Vista de editor de código (solo para código real)
        <div className="bg-[#1e1e1e] rounded-lg overflow-hidden shadow-xl border border-gray-700 text-left">
          {/* Barra superior del editor */}
          <div className="h-8 bg-[#2d2d2d] border-b border-gray-700 flex items-center px-3">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56] mr-1.5"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] mr-1.5"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            <div className="ml-3 text-sm text-gray-400 font-mono">code-editor.py</div>
          </div>
          
          {/* Contenedor con scrollbar único */}
          <div className={`${getCodeContainerHeight()} overflow-auto ${!showRealTimeChart ? 'my-2' : ''}`}>
            <div className="flex min-w-full">
              {/* Números de línea */}
              <div className="py-2 px-1 bg-[#1e1e1e] text-gray-500 font-mono text-right select-none w-12 border-r border-gray-700 flex-shrink-0">
                {textLines.map((_, idx) => (
                  <div key={`line-${idx}`} className={`px-1 text-base font-medium ${!showRealTimeChart ? 'leading-8' : 'leading-7'}`}>
                    {idx + 1}
                  </div>
                ))}
              </div>
              
              {/* Código con sintaxis */}
              <div className="py-2 px-4 font-mono w-full">
                {(() => {
                  const lines = targetText.trim().split('\n');
                  let charIndex = 0;
                  
                  return lines.map((line, lineIdx) => {
                    // Procesar cada línea
                    const lineChars = line.split('').map((char, charIdx) => {
                      const globalIndex = charIndex + charIdx;
                      const style: React.CSSProperties = { color: '#d4d4d4' }; // Color por defecto
                      
                      // Estilizar cada carácter según el estado de escritura
                      if (isHydrated) {
                        if (globalIndex < text.length) {
                          // Carácter ya escrito
                          if (text[globalIndex] === char) {
                            // Carácter correcto
                            style.color = '#8BE98B'; // Verde más brillante
                          } else {
                            // Carácter incorrecto
                            style.color = '#FF5555'; // Rojo más brillante
                            style.textDecoration = 'underline';
                            style.textDecorationColor = '#FF5555';
                          }
                        } else if (globalIndex === text.length) {
                          // Cursor
                          style.backgroundColor = '#1976D2'; // Azul más vibrante
                          style.color = '#FFFFFF';
                        }
                        
                        // Colorear sintaxis para código similar al ejemplo
                        if (char === '#') {
                          style.color = '#6A9955'; // Comentarios
                        } else if (['def', 'return', 'import', 'from', 'for', 'if', 'else', 'elif', 'while', 'class', 'and', 'or', 'not', 'in', 'is', 'protected', 'val', 'String'].includes(line.slice(charIdx).split(/\s|:|\(|\)|=|\{|\}|,/)[0])) {
                          style.color = '#C586C0'; // Palabras clave en violeta
                        } else if (char === '(' || char === ')' || char === '[' || char === ']' || char === '{' || char === '}' || char === '=' || char === '+' || char === '-' || char === '*' || char === '/' || char === ':') {
                          style.color = '#DCDCAA'; // Operadores y símbolos en amarillo claro
                        } else if (char === '"' || char === "'") {
                          style.color = '#CE9178'; // Strings
                        }
                      }
                      
                      return (
                        <span key={`char-${lineIdx}-${charIdx}`} style={style}>
                          {char === ' ' ? '\u00A0' : char}
                        </span>
                      );
                    });
                    
                    // Actualizar el índice global después de procesar cada línea
                    charIndex += line.length + 1; // +1 por el salto de línea
                    
                    return (
                      <div key={`line-content-${lineIdx}`} className={`whitespace-pre text-base ${!showRealTimeChart ? 'leading-8' : 'leading-7'}`}>
                        {lineChars}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
          
          {/* Barra inferior con información */}
          <div className="text-sm text-gray-500 py-1 px-3 border-t border-gray-800 bg-[#1e1e1e]">
            <span className="font-mono">
              {text.length} / {targetText.length} caracteres
            </span>
          </div>
        </div>
      ) : (
        // Vista de texto normal (para texto normal y conceptos)
        <div className={`flex items-center justify-center h-full p-4 rounded-xl`}>
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
              
              // Crear las líneas dividiendo por palabras o respetando saltos de línea
              for (let i = 0; i < targetText.length; i++) {
                const char = targetText[i];
                
                // Si encontramos un salto de línea, respetarlo
                if (char === '\n') {
                  if (currentLine.length > 0) {
                    textLines.push(currentLine);
                    currentLine = '';
                  } else {
                    textLines.push(''); // Línea vacía
                  }
                  continue;
                }
                
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
              
              // Decidir qué líneas mostrar (3 líneas para texto normal)
              const startLineIndex = Math.max(0, Math.min(currentLineIndex, textLines.length - 3));
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
                  }
                  
                  if (globalIndex === text.length) {
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
                  } else if (globalIndex > text.length) {
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
                
                // Salto de línea
                if (char === '\n') {
                  return <br key={globalIndex} />;
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
      )}
    </div>
  );
}; 