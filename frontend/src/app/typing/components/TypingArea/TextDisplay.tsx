'use client'

import React, { useEffect, useRef } from 'react';
import { Theme } from '../../types';
import { motion } from 'framer-motion';
import { Code2, Terminal, Zap } from 'lucide-react';

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

  // Referencias para el auto-scroll
  const codeEditorRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const lastScrollPositionRef = useRef<number>(0);
  const cursorLineRef = useRef<number>(0);
  
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
  
  // Efecto para implementar el auto-scroll
  useEffect(() => {
    if (!codeMode || !scrollContainerRef.current) return;
    
    // Calcular en qué línea está el cursor actual
    const lines = targetText.trim().split('\n');
    let currentCharCount = 0;
    let currentLineIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const lineLength = lines[i].length + 1; // +1 para el salto de línea
      
      if (currentCharCount + lineLength > text.length) {
        currentLineIndex = i;
        break;
      }
      
      currentCharCount += lineLength;
    }
    
    // Guardar la línea actual del cursor
    cursorLineRef.current = currentLineIndex;
    
    // Si el contenedor tiene scrollbar y el cursor llegó a cierta línea dentro de la ventana visible
    const container = scrollContainerRef.current;
    const containerHeight = container.clientHeight;
    
    // Calcular la altura aproximada de cada línea en píxeles
    const lineHeight = showRealTimeChart ? 28 : 32; // Basado en las clases leading-7 y leading-8
    
    // Calcular líneas visibles en la ventana
    const visibleLines = Math.floor(containerHeight / lineHeight);
    
    // Número de líneas actualmente visibles
    const halfVisibleLines = Math.floor(visibleLines / 2);
    
    // Si el cursor está en la segunda mitad de las líneas visibles, hacer auto-scroll
    if (currentLineIndex > halfVisibleLines) {
      // Calcular la posición de scroll ideal para mantener el cursor en el centro
      const idealScrollTop = Math.max(0, (currentLineIndex - halfVisibleLines) * lineHeight);
      
      // Aplicar solo si es diferente (para evitar scroll innecesario)
      if (Math.abs(idealScrollTop - container.scrollTop) > lineHeight) {
        // Scroll suave a la posición calculada
        container.scrollTo({
          top: idealScrollTop,
          behavior: 'smooth'
        });
        
        // Guardar la última posición de scroll
        lastScrollPositionRef.current = idealScrollTop;
      }
    }
  }, [text, targetText, codeMode, showRealTimeChart]);
  
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
      return 'max-w-[92%]';
    }
    // Para texto normal o conceptos, mantener el ancho original de 80%
    return 'max-w-[80%]';
  };

  // Función mejorada para el resaltado de sintaxis
  const getSyntaxHighlightedStyle = (line: string, char: string, charIdx: number, globalIndex: number) => {
    const style: React.CSSProperties = { color: '#d4d4d4' }; // Color por defecto
    
    // Estilizar cada carácter según el estado de escritura
    if (isHydrated) {
      if (globalIndex < text.length) {
        // Carácter ya escrito
        if (text[globalIndex] === char) {
          // Carácter correcto
          style.color = '#8BE98B'; // Verde más brillante
          style.textShadow = '0 0 3px rgba(139, 233, 139, 0.4)';
        } else {
          // Carácter incorrecto
          style.color = '#FF5555'; // Rojo más brillante
          style.textDecoration = 'underline';
          style.textDecorationColor = '#FF5555';
          style.textShadow = '0 0 4px rgba(255, 85, 85, 0.4)';
        }
      } else if (globalIndex === text.length) {
        // Cursor
        style.backgroundColor = '#1976D2'; // Azul más vibrante
        style.color = '#FFFFFF';
        style.borderRadius = '2px';
        style.boxShadow = '0 0 8px rgba(25, 118, 210, 0.6)';
        style.padding = '0 2px';
      }
      
      // Resaltado de sintaxis mejorado
      const currentWord = line.slice(charIdx).split(/\s|:|\(|\)|=|\{|\}|,|\[|\]|;/)[0];
      
      // Palabras clave
      const keywords = ['def', 'return', 'import', 'from', 'for', 'if', 'else', 'elif', 'while', 'class', 'and', 'or', 'not', 'in', 'is', 'protected', 'val', 'String', 'function', 'var', 'const', 'let', 'async', 'await', 'try', 'catch', 'finally', 'throw', 'new'];
      const types = ['int', 'float', 'str', 'bool', 'list', 'dict', 'tuple', 'set', 'number', 'string', 'boolean', 'object', 'array'];
      
      // Resaltado mejorado con diferentes categorías
      if (line.trim().startsWith('#') || line.trim().startsWith('//')) {
        // Línea de comentario completa
        style.color = '#6A9955'; // Verde para comentarios
        style.fontStyle = 'italic';
      } else if (char === '#' || (char === '/' && line[charIdx + 1] === '/')) {
        // Inicio de comentario
        style.color = '#6A9955'; // Verde para comentarios
        style.fontStyle = 'italic';
      } else if (keywords.includes(currentWord)) {
        // Palabra clave
        style.color = '#C586C0'; // Violeta para palabras clave
        style.fontWeight = 'bold';
      } else if (types.includes(currentWord)) {
        // Tipos de datos
        style.color = '#4EC9B0'; // Verde azulado para tipos
      } else if (/^[A-Z][a-zA-Z0-9_]*$/.test(currentWord)) {
        // Clases/tipos (comienzan con mayúscula)
        style.color = '#4EC9B0'; // Verde azulado para clases
      } else if (char === '(' || char === ')' || char === '[' || char === ']' || char === '{' || char === '}' || char === '=' || char === '+' || char === '-' || char === '*' || char === '/' || char === ':' || char === ',') {
        // Operadores y símbolos
        style.color = '#DCDCAA'; // Amarillo claro para operadores
      } else if (char === '"' || char === "'") {
        // Strings
        style.color = '#CE9178'; // Naranja para strings
      } else if (/^[0-9]+([.][0-9]+)?$/.test(currentWord)) {
        // Números
        style.color = '#B5CEA8'; // Verde claro para números
      } else if (/^[a-zA-Z0-9_]+\(/.test(line.slice(charIdx))) {
        // Llamadas a funciones
        style.color = '#DCDCAA'; // Amarillo para funciones
      }
    }
    
    return style;
  };

  return (
    <div 
      className={`cursor-text w-full ${getCodeContainerWidth()} mx-auto relative mb-6 ${codeMode && !isTextConcept ? 'h-auto' : 'h-64'}`}
      onClick={handleFocus}
      ref={textContainerRef}
    >
      {codeMode && !isTextConcept ? (
        // Vista de editor de código mejorado (solo para código real)
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl border border-gray-700 text-left"
          style={{ 
            boxShadow: `0 10px 25px -5px rgba(0, 0, 0, 0.7), 
                        0 0 15px rgba(0, 0, 0, 0.6), 
                        0 0 1px ${themeColors.cursor}80 inset` 
          }}
          ref={codeEditorRef}
        >
          {/* Barra superior del editor mejorada */}
          <div className="h-10 bg-gradient-to-r from-[#2d2d2d] to-[#252525] border-b border-gray-700 flex items-center px-3 justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56] mr-1.5 hover:opacity-80 transition-opacity"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e] mr-1.5 hover:opacity-80 transition-opacity"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f] hover:opacity-80 transition-opacity"></div>
              <div className="ml-3 text-sm text-gray-300 font-mono flex items-center">
                <Code2 size={14} className="mr-1.5 text-blue-400" />
                <span>código_editor.py</span>
              </div>
            </div>
            <div className="flex items-center text-xs font-mono text-gray-500">
              <Zap size={12} className="mr-1 text-yellow-500" />
              <span>Línea {cursorLineRef.current + 1}</span>
            </div>
          </div>
          
          {/* Contenedor con scrollbar único */}
          <div 
            className={`${getCodeContainerHeight()} overflow-auto ${!showRealTimeChart ? 'my-2' : ''} code-editor-container`}
            ref={scrollContainerRef}
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#4a4a4a #1e1e1e'
            }}
          >
            <div className="flex min-w-full">
              {/* Números de línea mejorados */}
              <div className="py-2 px-1 bg-[#1a1a1a] text-gray-500 font-mono text-right select-none w-12 border-r border-gray-700 flex-shrink-0">
                {textLines.map((_, idx) => {
                  // Destacar la línea actual donde está el cursor
                  const isCurrentLine = cursorLineRef.current === idx;
                  return (
                    <div 
                      key={`line-${idx}`} 
                      className={`px-1 text-base font-medium transition-colors duration-200 ${!showRealTimeChart ? 'leading-8' : 'leading-7'} ${isCurrentLine ? 'text-blue-400 font-bold' : ''}`}
                    >
                      {idx + 1}
                    </div>
                  );
                })}
              </div>
              
              {/* Código con sintaxis mejorada */}
              <div className="py-2 px-4 font-mono w-full relative">
                {(() => {
                  const lines = targetText.trim().split('\n');
                  let charIndex = 0;
                  
                  return lines.map((line, lineIdx) => {
                    // Verificar si esta es la línea actual
                    const isCurrentLine = cursorLineRef.current === lineIdx;
                    
                    // Procesar cada línea
                    const lineChars = line.split('').map((char, charIdx) => {
                      const globalIndex = charIndex + charIdx;
                      const style = getSyntaxHighlightedStyle(line, char, charIdx, globalIndex);
                      
                      return (
                        <span key={`char-${lineIdx}-${charIdx}`} style={style}>
                          {char === ' ' ? '\u00A0' : char}
                        </span>
                      );
                    });
                    
                    // Actualizar el índice global después de procesar cada línea
                    charIndex += line.length + 1; // +1 por el salto de línea
                    
                    return (
                      <div 
                        key={`line-content-${lineIdx}`} 
                        className={`whitespace-pre text-base transition-colors duration-200 ${!showRealTimeChart ? 'leading-8' : 'leading-7'} ${isCurrentLine ? 'bg-[#282828] -mx-4 px-4 rounded' : ''}`}
                      >
                        {lineChars}
                      </div>
                    );
                  });
                })()}
                
                {/* Indicador de posición */}
                <div 
                  className="absolute right-4 h-full top-0 w-0.5 bg-gradient-to-b from-transparent via-gray-600 to-transparent opacity-30"
                  style={{ opacity: 0.2 }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Barra inferior con información */}
          <div className="text-sm text-gray-400 py-2 px-4 border-t border-gray-700 bg-gradient-to-r from-[#1e1e1e] to-[#252525] flex justify-between items-center">
            <span className="font-mono flex items-center">
              <Terminal size={12} className="mr-1.5 text-gray-500" />
              <span>
                {text.length} / {targetText.length} caracteres
              </span>
            </span>
            <span className="text-xs text-gray-500 opacity-70">
              {Math.round((text.length / targetText.length) * 100)}% completado
            </span>
          </div>
        </motion.div>
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
      
      {/* Estilos globales para el editor de código */}
      <style jsx global>{`
        .code-editor-container::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        .code-editor-container::-webkit-scrollbar-track {
          background: #1a1a1a;
          border-radius: 4px;
        }
        
        .code-editor-container::-webkit-scrollbar-thumb {
          background: #4a4a4a;
          border-radius: 4px;
          border: 2px solid #1a1a1a;
        }
        
        .code-editor-container::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        
        .text-update-flash {
          animation: flash-update 0.3s ease-out;
        }
        
        @keyframes flash-update {
          0% { background-color: rgba(25, 118, 210, 0.2); }
          100% { background-color: transparent; }
        }
      `}</style>
    </div>
  );
}; 