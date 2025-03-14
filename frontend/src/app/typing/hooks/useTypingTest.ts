import { useState, useEffect, useRef, useCallback } from 'react';
import { TestDuration } from '../types';
import { timeTexts, typingTexts } from '../constants/texts';
import { useTypingMetrics } from './useTypingMetrics';
import { useSupabase } from './useSupabase';
import { mixedCodeTexts } from '../constants/code_texts';

// Bandera para evitar múltiples actualizaciones durante el cambio de modo
let isChangingMode = false;

export function useTypingTest() {
  const {
    wpmHistory,
    accuracyHistory,
    correctChars,
    incorrectChars,
    missedChars,
    extraChars,
    consistency,
    calculateWPM,
    calculateAccuracy,
    calculateFinalAccuracy,
    calculateDetailedStats,
    updateHistory,
    resetMetrics,
    trackTextChanges
  } = useTypingMetrics();

  const {
    isSubmittingScore,
    hasSubmittedScore,
    isInTop25,
    submitScoreAutomatically,
    submitScore,
    resetUserState
  } = useSupabase();

  // Estados básicos del test
  const [text, setText] = useState('');
  const [targetText, setTargetText] = useState(typingTexts[0]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [lastMouseY, setLastMouseY] = useState(0);
  
  // Cargar preferencias desde localStorage
  const getDefaultTime = (): TestDuration => {
    if (typeof window === 'undefined') return 60;
    
    const savedTime = localStorage.getItem('penguintype_time');
    if (savedTime === 'competitive') return 'competitive';
    return parseInt(savedTime || '60') as 15 | 30 | 60 | 120 || 60;
  };
  
  const getDefaultCodeMode = (): boolean => {
    if (typeof window === 'undefined') return false;
    
    const savedCodeMode = localStorage.getItem('penguintype_code_mode');
    return savedCodeMode === 'true';
  };
  
  // Estados para la selección de tiempo y texto
  const [selectedTime, setSelectedTime] = useState<TestDuration>(getDefaultTime());
  const [showTimeSelector, setShowTimeSelector] = useState(true);
  const [currentLines, setCurrentLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [maxTime, setMaxTime] = useState<number | null>(null);
  const [isCompetitiveMode, setIsCompetitiveMode] = useState(selectedTime === 'competitive');
  const [codeMode, setCodeMode] = useState(getDefaultCodeMode());
  
  // Estados para tooltips
  const [showAccTooltip, setShowAccTooltip] = useState(false);
  const [showCharTooltip, setShowCharTooltip] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  // Efecto para inicializar las líneas basadas en el tiempo seleccionado
  useEffect(() => {
    if (typeof selectedTime === 'number') {
      // Seleccionamos aleatoriamente un conjunto de textos del tiempo seleccionado
      const randomIndex = Math.floor(Math.random() * timeTexts[selectedTime].length);
      const selectedTextSet = timeTexts[selectedTime][randomIndex];
      
      // Dividimos el texto en líneas (por ahora solo usamos el texto completo como una línea)
      setCurrentLines([selectedTextSet]);
      setCurrentLineIndex(0);
      
      // Configuramos el texto objetivo como la primera línea
      setTargetText(selectedTextSet);
      
      // Establecemos el tiempo máximo
      setMaxTime(selectedTime);
    }
  }, [selectedTime]);

  // Efecto para manejar el movimiento del mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const mouseY = e.clientY;
      setLastMouseY(mouseY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Efecto para manejar eventos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ocultar el selector de tiempo cuando el usuario empieza a escribir
      if (showTimeSelector && text.length === 0) {
        setShowTimeSelector(false);
      }
      
      // Reiniciar con ESC, mantener el modo actual y tiempo seleccionado
      if (e.key === 'Escape') {
        // Guardar el modo actual y tiempo antes de reiniciar
        const currentCodeMode = codeMode;
        const currentSelectedTime = selectedTime;
        
        // Reiniciar estados básicos
        setText('');
        setStartTime(null);
        setEndTime(null);
        setCurrentPosition(0);
        setIsActive(false);
        
        // Resetear métricas y estado de usuario
        resetMetrics();
        resetUserState();
        
        // Asegurar que se mantengan los modos correctos
        setCodeMode(currentCodeMode);
        setSelectedTime(currentSelectedTime);
        
        // Generar nuevas líneas después de que los estados se hayan actualizado
        setTimeout(() => {
          const newTargetText = generateLines(currentSelectedTime, currentCodeMode);
          setTargetText(newTargetText);
          
          // Mostrar el selector de tiempo nuevamente
          setShowTimeSelector(true);
        }, 0);
        
        return;
      }
      
      // Asegurar que el input tenga el foco cuando se presiona una tecla
      if (inputRef.current && !e.ctrlKey && !e.altKey && !e.metaKey) {
        if (document.activeElement !== inputRef.current) {
          inputRef.current.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTimeSelector, text, codeMode, selectedTime, resetMetrics, resetUserState]);

  // Efecto para iniciar el contador y verificar el progreso
  useEffect(() => {
    if (text.length === 1 && startTime === null) {
      setStartTime(Date.now());
      setIsActive(true);
      // Ocultar el selector de tiempo cuando comienza a escribir
      setShowTimeSelector(false);
    }

    if (text.length === targetText.length && startTime !== null) {
      // Si es la última línea, termina la prueba
      if (currentLineIndex >= currentLines.length - 1) {
        setEndTime(Date.now());
        setIsActive(false);
      } else {
        // Si no es la última línea, avanza a la siguiente
        const nextLineIndex = currentLineIndex + 1;
        setCurrentLineIndex(nextLineIndex);
        setTargetText(currentLines[nextLineIndex]);
        setText(''); // Reinicia el texto escrito
      }
    }
    
    setCurrentPosition(text.length);
  }, [text, targetText, startTime, currentLineIndex, currentLines]);

  // Efecto para el contador de tiempo
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && startTime && !endTime) {
      interval = setInterval(() => {
        // Verificar si se ha excedido el tiempo máximo
        if (maxTime && (Date.now() - startTime) / 1000 >= maxTime) {
          setEndTime(Date.now());
          setIsActive(false);
        } else {
          // Forzar actualización del componente para mostrar el tiempo actualizado
          setText(prevText => prevText);
        }
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, startTime, endTime, maxTime]);

  // Efecto para calcular WPM y precisión al finalizar
  useEffect(() => {
    if (startTime && endTime) {
      // Usar el método sofisticado de useTypingMetrics para el cálculo final
      const finalWpm = calculateWPM(text, targetText, currentPosition, startTime, endTime);
      setWpm(finalWpm);

      // Calcular precisión en base a lo que escribió el usuario vs. el texto objetivo
      const finalAccuracy = calculateAccuracy(text, targetText);
      setAccuracy(finalAccuracy);
    }
  }, [endTime, startTime, text, targetText, currentPosition, calculateWPM, calculateAccuracy]);

  // Manejar cuando se termina de escribir todo el texto
  useEffect(() => {
    // Solo proceder si estamos en un test activo
    if (isActive && startTime && !endTime && text.length > 0) {
      // Comprobar si hemos llegado al final del texto
      if (text.length >= targetText.length) {
        // Marca el tiempo final
        const finalTime = Date.now();
        setEndTime(finalTime);
        setIsActive(false);

        // Calcular el WPM y precisión finales
        const finalWpm = calculateWPM(text, targetText, text.length, startTime, finalTime);
        const finalAccuracy = calculateAccuracy(text, targetText);
        
        console.log('Finalizando prueba - Calculando estadísticas detalladas');
        
        // Primero calcular estadísticas detalladas
        calculateDetailedStats(text, targetText);
        
        // Luego actualizar historial con el tiempo final
        updateHistory(finalTime, finalTime, finalWpm, finalAccuracy);
        
        // Enviar automáticamente la puntuación
        if (startTime && finalTime) {
          const finalSeconds = (finalTime - startTime) / 1000;
          // Solo enviar si la prueba duró al menos 10 segundos para evitar puntuaciones falsas
          if (finalSeconds >= 10) {
            handleSubmitScoreAutomatically(finalWpm, finalAccuracy);
          }
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, targetText, isActive, startTime, endTime]);

  // Efecto para actualizar la prueba
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && startTime && !endTime) {
      // Iniciar con un valor base inmediatamente
      const initialWpm = calculateCurrentWPM();
      const initialAcc = calculateAccuracy(text, targetText);
      updateHistory(0, null, initialWpm, initialAcc);
      
      // Actualizar inmediatamente con los valores actuales
      const currentTime = (Date.now() - startTime) / 1000;
      if (currentPosition > 0) {
        const currentWpm = calculateCurrentWPM();
        const currentAcc = calculateAccuracy(text, targetText);
        updateHistory(currentTime, null, currentWpm, currentAcc);
      }
      
      // Usar un intervalo muy corto para actualización ultra fluida
      let lastUpdate = Date.now();
      interval = setInterval(() => {
        const now = Date.now();
        const deltaMs = now - lastUpdate;
        
        // Calcular valores siempre, pero solo actualizar la gráfica si ha pasado suficiente tiempo
        // o si ha habido un cambio significativo en la posición del texto
        const currentTime = (now - startTime) / 1000;
        
        // Siempre calcular para tener los valores más recientes
        if (currentPosition > 0) {
          const currentWpm = calculateCurrentWPM();
          const currentAcc = calculateAccuracy(text, targetText);
          
          // Optimizar actualizaciones - solo actualizar en estos casos:
          // 1. Ha pasado al menos 50ms desde la última actualización
          // 2. El usuario ha escrito más caracteres (delta importante)
          // 3. Es un momento clave (cada 5 caracteres)
          if (
            deltaMs >= 50 || 
            currentPosition % 5 === 0 ||
            currentPosition === targetText.length // Punto final
          ) {
            updateHistory(currentTime, null, currentWpm, currentAcc);
            lastUpdate = now; // Actualizar el tiempo de la última actualización
          }
        }
      }, 50); // Intervalo ultra corto para capturar cambios rápidamente
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, startTime, endTime, text, currentPosition]);

  // Función para generar líneas aleatorias para la prueba de escritura
  const generateLines = useCallback((time: TestDuration, isCodeMode: boolean = false) => {
    let targetText = '';
    let availableTexts: string[] = [];
  
    // Imprimir valores para debug
    console.log(`Generando líneas para tiempo: ${time}, modo código: ${isCodeMode}`);
    
    // Seleccionar la fuente de textos según el modo actual
    if (isCodeMode) {
      // Obtener los textos para el tiempo especificado, con un valor por defecto de array vacío
      const textsForTime = mixedCodeTexts[time] as string[] | undefined;
      const textsForBackup = mixedCodeTexts[30] as string[] | undefined;
      
      // Verificar si hay textos disponibles para este tiempo en modo código
      if (textsForTime && textsForTime.length > 0) {
        availableTexts = textsForTime;
      } else {
        // Si no hay textos para este tiempo específico, usar los de 30 segundos como respaldo
        availableTexts = textsForBackup || [];
      }
      console.log(`Usando mixedCodeTexts para tiempo ${time}. Textos disponibles: ${availableTexts.length}`);
    } else {
      // El tipo timeTexts ya tiene una propiedad 'competitive' y debemos usarla
      if (time === 'competitive') {
        availableTexts = timeTexts['competitive']; // Usar textos específicos del modo competitivo
      } else {
        availableTexts = timeTexts[time as 15 | 30 | 60 | 120];
      }
      console.log(`Usando timeTexts para tiempo ${time} modo normal. Textos disponibles: ${availableTexts.length}`);
    }
    
    // Verificación adicional por seguridad
    if (!availableTexts || availableTexts.length === 0) {
      console.warn(`No se encontraron textos para tiempo: ${time}, modo código: ${isCodeMode}. Usando textos de respaldo.`);
      availableTexts = isCodeMode ? (mixedCodeTexts[30] || []) : timeTexts[30];
    }
    
    // Seleccionar un texto aleatorio
    if (availableTexts.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableTexts.length);
      targetText = availableTexts[randomIndex] || '';
      console.log(`Texto seleccionado de ${targetText.substring(0, 30)}...`);
    } else {
      // Texto de respaldo final si todo lo demás falla
      targetText = "Error al cargar textos. Por favor, intenta recargar la página.";
      console.error("No se pudieron cargar textos para la prueba de escritura.");
    }
    
    return targetText;
  }, []);

  // Función para cambiar el tiempo de prueba
  const handleTimeChange = (time: TestDuration) => {
    // No permitir cambios durante una prueba activa
    if (isActive) return;
    
    setSelectedTime(time);
    setIsCompetitiveMode(time === 'competitive');
    
    // Guardar preferencia en localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('penguintype_time', time.toString());
    }
    
    // Generar nuevas líneas de texto para el tiempo seleccionado
    const newTargetText = generateLines(time, codeMode);
    setTargetText(newTargetText);
    
    // Asegurarse de que la prueba comience desde cero
    handleReset();
  };

  // Manejar la entrada de texto
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (newText.length <= targetText.length) {
      // Activar inmediatamente al empezar a escribir
      if (newText.length === 1 && startTime === null) {
        setIsActive(true);
      }
      
      // Rastrear cambios para contar correctamente todas las pulsaciones
      trackTextChanges(newText, targetText);
      setText(newText);
    }
  };

  // Manejar el foco en el área de texto
  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Función para calcular el WPM actual
  const calculateCurrentWPM = () => {
    // Si el test ha terminado, mostrar el valor final calculado
    if (endTime && startTime) {
      // Calcular directamente con la longitud completa del texto
      const finalWpm = calculateWPM(text, targetText, text.length, startTime, endTime);
      console.log(`WPM final calculado: ${finalWpm}`);
      return finalWpm;
    }
    
    // Si el test está en progreso pero sin posición actual válida, retornar 0
    if (!currentPosition) return 0;
    
    // De lo contrario, calcular el WPM actual en tiempo real
    const currentWpm = calculateWPM(text, targetText, currentPosition, startTime, null);
    return currentWpm;
  };

  // Resetear el test
  const handleReset = () => {
    // Si estamos en proceso de cambiar el modo, ignorar resets adicionales
    if (isChangingMode) {
      console.log('Reset ignorado durante cambio de modo');
      return;
    }
    
    // Resetear todos los estados y métricas
    setText('');
    setStartTime(null);
    setEndTime(null);
    setCurrentPosition(0);
    setIsActive(false);
    
    // Resetear métricas y estado de usuario
    resetMetrics();
    resetUserState();
    
    // Guardar el modo actual para usarlo al generar el nuevo texto
    const currentCodeMode = codeMode;
    
    // Generar nuevas líneas según el tiempo seleccionado y el modo actual
    const newTargetText = generateLines(selectedTime, currentCodeMode);
    setTargetText(newTargetText);
  };

  // Enviar puntuación automáticamente
  const handleSubmitScoreAutomatically = async (finalWpm: number, finalAccuracy: number) => {
    if (typeof selectedTime === 'number') {
      await submitScoreAutomatically(
        finalWpm,
        finalAccuracy,
        selectedTime,
        text.length,
        correctChars,
        incorrectChars,
        isCompetitiveMode
      );
    }
  };

  // Enviar puntuación manualmente
  const handleSubmitScore = async () => {
    if (typeof selectedTime === 'number' && wpm !== null && accuracy !== null) {
      await submitScore(
        wpm,
        accuracy,
        selectedTime,
        text.length,
        correctChars,
        incorrectChars,
        isCompetitiveMode
      );
    }
  };

  // Efecto para regenerar el texto cuando cambia el modo código
  useEffect(() => {
    // No cambiar el texto durante una prueba activa
    if (isActive) return;
    
    // Generar nuevo texto basado en el modo código actual
    console.log(`Efecto de cambio de modo código ejecutado. Modo actual: ${codeMode ? 'código' : 'normal'}, tiempo: ${selectedTime}`);
    
    // Pequeño retraso para asegurar que los estados se han actualizado
    const timeoutId = setTimeout(() => {
      const newText = generateLines(selectedTime, codeMode);
      console.log(`Nuevo texto generado para modo ${codeMode ? 'código' : 'normal'}, tiempo ${selectedTime}: ${newText.substring(0, 50)}...`);
      setTargetText(newText);
      
      // Forzar un refresco del componente
      setText('');
      setCurrentPosition(0);
    }, 50);
    
    return () => clearTimeout(timeoutId);
  }, [codeMode, selectedTime, generateLines, isActive]);

  // Función para establecer el modo código con protección contra actualizaciones múltiples
  const setCodeModeWithProtection = (newValue: boolean | ((prevState: boolean) => boolean)) => {
    // Si ya estamos en proceso de cambiar el modo, no hacer nada
    if (isChangingMode) return;
    
    // Activar la bandera
    isChangingMode = true;
    
    // Llamar a la función original
    if (typeof newValue === 'function') {
      setCodeMode(prevMode => {
        const result = newValue(prevMode);
        return result;
      });
    } else {
      setCodeMode(newValue);
    }
    
    // Desactivar la bandera después de un tiempo
    setTimeout(() => {
      isChangingMode = false;
    }, 300); // Un tiempo suficiente para que todas las actualizaciones se completen
  };

  // Efecto para manejar cambios en el modo código
  useEffect(() => {
    // No hacer nada en la primera renderización
    if (codeMode === getDefaultCodeMode()) return;
    
    // Si no estamos en una prueba activa, forzar un reset para actualizar el texto
    if (!isActive) {
      // Usar setTimeout para asegurar que los estados se hayan actualizado completamente
      setTimeout(() => {
        const currentCodeMode = codeMode;
        console.log(`Forzando reset después de cambio de modo a: ${currentCodeMode ? 'código' : 'normal'}`);
        
        // Generar nuevas líneas con el modo actualizado
        const newTargetText = generateLines(selectedTime, currentCodeMode);
        setTargetText(newTargetText);
      }, 100);
    }
  }, [codeMode, isActive, selectedTime, generateLines]);

  return {
    text,
    targetText,
    startTime,
    endTime,
    wpm,
    accuracy,
    currentPosition,
    isActive,
    lastMouseY,
    selectedTime,
    showTimeSelector,
    currentLines,
    currentLineIndex,
    maxTime,
    isCompetitiveMode,
    showAccTooltip,
    showCharTooltip,
    wpmHistory,
    accuracyHistory,
    correctChars,
    incorrectChars,
    missedChars,
    extraChars,
    consistency,
    hasSubmittedScore,
    isInTop25,
    isSubmittingScore,
    inputRef,
    textContainerRef,
    setText,
    setShowTimeSelector,
    setShowAccTooltip,
    setShowCharTooltip,
    calculateCurrentWPM,
    calculateAccuracy: (text: string, targetText: string) => calculateAccuracy(text, targetText),
    calculateFinalAccuracy,
    handleTimeChange,
    handleInput,
    handleFocus,
    handleReset,
    handleSubmitScore,
    codeMode,
    setCodeMode: setCodeModeWithProtection,
  };
} 