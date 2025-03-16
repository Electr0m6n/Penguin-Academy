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
  const [error, setError] = useState<string | null>(null);
  
  // Estados para la pausa automática
  const [isPaused, setIsPaused] = useState(false);
  const [pauseStartTime, setPauseStartTime] = useState<number | null>(null);
  const [totalPausedTime, setTotalPausedTime] = useState(0);
  const [lastTypingTime, setLastTypingTime] = useState<number | null>(null);
  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Constantes para la pausa automática
  const INACTIVITY_THRESHOLD = 3000; // 3 segundos de inactividad para pausar
  
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

  // Efecto para actualizar el tiempo de tipeo y detectar fin del modo
  useEffect(() => {
    if (selectedTime !== null) {
      console.log(`Seleccionando tiempo: ${selectedTime}`);
      
      // Si estamos en proceso de cambio de modo, no hacer nada
      if (isChangingMode) {
        console.log('Cambio de modo en progreso, saltando efecto de cambio de tiempo');
        return;
      }
      
      // Seleccionamos aleatoriamente un conjunto de textos del tiempo seleccionado
      const randomIndex = Math.floor(Math.random() * timeTexts[selectedTime].length);
      const selectedTextSet = timeTexts[selectedTime][randomIndex];
      
      // Dividimos el texto en líneas (por ahora solo usamos el texto completo como una línea)
      setCurrentLines([selectedTextSet]);
      setCurrentLineIndex(0);
      
      // Configuramos el texto objetivo solo si no hay uno establecido
      if (!targetText || targetText === typingTexts[0]) {
        setTargetText(selectedTextSet);
      }
      
      // Establecemos el tiempo máximo solo si es un número
      if (typeof selectedTime === 'number') {
        setMaxTime(selectedTime);
      }
    }
  // Omitimos timeTexts y typingTexts ya que son valores del scope externo
  }, [selectedTime, targetText]);

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
      // Si la prueba está pausada, reanudarla con cualquier tecla
      if (isPaused && isActive && !endTime) {
        // Ignorar teclas como Escape, Alt, Ctrl, etc.
        if (e.key === 'Escape' || e.altKey || e.ctrlKey || e.metaKey) {
          return;
        }
        
        // Reanudar la prueba
        resumeTest();
        return;
      }
      
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
        setIsPaused(false);
        setPauseStartTime(null);
        setTotalPausedTime(0);
        setLastTypingTime(null);
        
        // Limpiar el temporizador de inactividad
        if (inactivityTimer) {
          clearTimeout(inactivityTimer);
          setInactivityTimer(null);
        }
        
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
  // eslint-disable-next-line react-hooks/exhaustive-deps -- Omitimos dependencias como generateLines para evitar actualizaciones innecesarias cuando cambia
  }, [showTimeSelector, text, codeMode, selectedTime, resetMetrics, resetUserState, isPaused, isActive, endTime]);

  // Efecto para iniciar el contador y verificar el progreso
  useEffect(() => {
    if (text.length === 1 && startTime === null) {
      console.log('Iniciando test - primer caracter detectado');
      setStartTime(Date.now());
      setIsActive(true);
      setLastTypingTime(Date.now());
      setShowTimeSelector(false);
    }

    // Actualizar el tiempo de la última escritura y reiniciar el temporizador de inactividad
    if (isActive && !endTime && !isPaused && text.length > 0) {
      const currentTime = Date.now();
      setLastTypingTime(currentTime);
      
      // Limpiar el temporizador anterior si existe
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
      
      // Configurar un nuevo temporizador para detectar inactividad
      const newTimer = setTimeout(() => {
        const now = Date.now();
        const lastType = lastTypingTime || 0;
        // Solo pausar si el tiempo de inactividad excede el umbral
        if (isActive && !endTime && (now - lastType >= INACTIVITY_THRESHOLD)) {
          pauseTest();
        }
      }, INACTIVITY_THRESHOLD);
      
      setInactivityTimer(newTimer);
    }

    // Verificar si hemos llegado al final del texto
    if (text.length >= targetText.length && startTime !== null && !endTime) {
      console.log('Detectada finalización del test:', {
        textLength: text.length,
        targetLength: targetText.length,
        hasStartTime: !!startTime,
        hasEndTime: !!endTime,
        textoEscrito: text.slice(0, 30) + '...',
        textoObjetivo: targetText.slice(0, 30) + '...',
        comparación: text.slice(0, 30) === targetText.slice(0, 30)
      });
      
      // Limpiar el temporizador de inactividad si existe
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
        setInactivityTimer(null);
      }
      
      const finalTime = Date.now();
      console.log('⭐ Estableciendo endTime:', finalTime);
      setEndTime(finalTime);
      setIsActive(false);
      setIsPaused(false);
      
      // Calcular estadísticas inmediatamente
      const testDuration = (finalTime - startTime - totalPausedTime) / 1000;
      console.log('Duración del test:', testDuration, 'segundos');
      
      // Calcular estadísticas detalladas primero
      calculateDetailedStats(text, targetText);
      
      // Calcular WPM y precisión final
      const finalWpm = calculateWPM(text, targetText, text.length, startTime, finalTime, totalPausedTime);
      const finalAccuracy = calculateAccuracy(text, targetText);
      
      // Asegurar que se actualice el historial con el tiempo final
      console.log('⭐ Actualizando historial con tiempo final:', finalTime);
      updateHistory(
        testDuration,  // tiempo actual en segundos
        finalTime,     // tiempo final en milisegundos
        finalWpm,
        finalAccuracy
      );
      
      // Calcular y enviar resultados si cumple el tiempo mínimo
      if (testDuration >= 10) {
        console.log('Resultados finales calculados:', {
          wpm: finalWpm,
          accuracy: finalAccuracy,
          duration: testDuration,
          correctChars,
          incorrectChars
        });
        
        // Pequeño retraso para asegurar que las estadísticas se han actualizado
        setTimeout(() => {
          handleSubmitScoreAutomatically(finalWpm, finalAccuracy);
        }, 100);
      } else {
        console.log('Test demasiado corto para enviar:', testDuration, 'segundos');
      }
    }
    
    setCurrentPosition(text.length);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- Omitimos intencionalmente dependencias como calculateAccuracy, calculateWPM, calculateDetailedStats, handleSubmitScoreAutomatically, correctChars, incorrectChars, isCompetitiveMode, targetText, text y updateHistory para evitar actualizaciones innecesarias
  }, [text, targetText, startTime, endTime, isPaused]);

  // Efecto para el contador de tiempo
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && startTime && !endTime && !isPaused) {
      interval = setInterval(() => {
        // Verificar si se ha excedido el tiempo máximo
        const adjustedElapsedTime = (Date.now() - startTime - totalPausedTime) / 1000;
        
        if (maxTime && adjustedElapsedTime >= maxTime) {
          setEndTime(Date.now());
          setIsActive(false);
          setIsPaused(false);
        } else {
          // Forzar actualización del componente para mostrar el tiempo actualizado
          setText(prevText => prevText);
        }
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, startTime, endTime, maxTime, isPaused, totalPausedTime]);

  // Efecto para calcular WPM y precisión al finalizar
  useEffect(() => {
    if (startTime && endTime) {
      // Ajustar los cálculos para tener en cuenta el tiempo pausado
      const adjustedEndTime = endTime;
      const adjustedStartTime = startTime;
      
      setWpm(calculateWPM(text, targetText, currentPosition, adjustedStartTime, adjustedEndTime, totalPausedTime));
      setAccuracy(calculateAccuracy(text, targetText));
    }
  }, [endTime, startTime, text, targetText, currentPosition, calculateWPM, calculateAccuracy, totalPausedTime]);

  // Efecto para manejar cuando se termina de escribir todo el texto
  useEffect(() => {
    // Solo proceder si el test ha terminado pero aún no se han enviado los resultados
    if (!isActive && startTime && endTime && !hasSubmittedScore) {
      console.log('Procesando finalización del test:', {
        isActive,
        hasStartTime: !!startTime,
        hasEndTime: !!endTime,
        hasSubmittedScore,
        textLength: text.length,
        targetLength: targetText.length
      });
      
      const testDuration = (endTime - startTime) / 1000;
      
      // Calcular estadísticas finales
      calculateDetailedStats(text, targetText);
      
      const finalWpm = calculateWPM(text, targetText, text.length, startTime, endTime);
      const finalAccuracy = calculateAccuracy(text, targetText);
      
      // Actualizar historial con valores finales
      updateHistory(
        endTime,
        endTime,
        finalWpm,
        finalAccuracy
      );
      
      console.log('Estadísticas finales actualizadas:', {
        wpm: finalWpm,
        accuracy: finalAccuracy,
        duration: testDuration,
        isCompetitiveMode
      });
      
      // Verificar si cumple los criterios para envío
      if (testDuration >= 10) {
        console.log('Preparando envío automático de resultados...');
        handleSubmitScoreAutomatically(finalWpm, finalAccuracy);
      } else {
        console.log('Test no cumple duración mínima:', testDuration, 'segundos');
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- Omitimos calculateWPM, calculateAccuracy, calculateDetailedStats, updateHistory, handleSubmitScoreAutomatically, text, targetText e isCompetitiveMode para evitar re-renders innecesarios
  }, [isActive, startTime, endTime, hasSubmittedScore]);

  // Efecto para actualizar la prueba
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && startTime && !endTime && !isPaused) {
      // Iniciar con un valor base inmediatamente
      const initialWpm = calculateCurrentWPM();
      const initialAcc = calculateAccuracy(text, targetText);
      updateHistory(0, null, initialWpm, initialAcc);
      
      // Actualizar inmediatamente con los valores actuales
      const currentTime = (Date.now() - startTime - totalPausedTime) / 1000;
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
        const currentTime = (now - startTime - totalPausedTime) / 1000;
        
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
  // eslint-disable-next-line react-hooks/exhaustive-deps -- Omitimos calculateAccuracy, targetText, calculateCurrentWPM y updateHistory para evitar actualizaciones innecesarias que afectarían el rendimiento
  }, [isActive, startTime, endTime, text, currentPosition, isPaused, totalPausedTime]);

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
    
    // Activar la bandera de cambio para prevenir actualizaciones múltiples
    isChangingMode = true;
    
    // Guardar preferencia en localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('penguintype_time', time.toString());
    }
    
    console.log(`Cambiando tiempo a: ${time}`);
    
    // Generar nuevas líneas de texto para el tiempo seleccionado
    const newTargetText = generateLines(time, codeMode);
    
    // Actualizar estados en secuencia para evitar rerenders múltiples
    // Resetear todos los estados y métricas
    setText('');
    setStartTime(null);
    setEndTime(null);
    setCurrentPosition(0);
    setIsActive(false);
    setError(null);
    
    // Resetear métricas y estado de usuario
    resetMetrics();
    resetUserState();
    
    // Actualizar el modo competitivo después de los resets
    setIsCompetitiveMode(time === 'competitive');
    
    // Actualizar el tiempo seleccionado al final
    setSelectedTime(time);
    
    // Establecer el texto objetivo directamente en vez de llamar a handleReset
    setTargetText(newTargetText);
    
    // Establecer el tiempo máximo
    if (typeof time === 'number') {
      setMaxTime(time);
    }
    
    // Desactivar la bandera después de completar todos los cambios
    setTimeout(() => {
      isChangingMode = false;
      console.log('Cambio de tiempo completado');
    }, 50);
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
    if (endTime && startTime) {
      return calculateWPM(text, targetText, text.length, startTime, endTime, totalPausedTime);
    }
    
    if (!currentPosition) return 0;
    
    return calculateWPM(text, targetText, currentPosition, startTime, null, totalPausedTime);
  };

  // Funciones de validación y estadísticas
  const validateScoreData = (
    wpm: number,
    accuracy: number,
    chars: number
  ): boolean => {
    return (
      typeof wpm === 'number' &&
      !isNaN(wpm) &&
      wpm > 0 &&
      typeof accuracy === 'number' &&
      !isNaN(accuracy) &&
      accuracy >= 0 &&
      accuracy <= 100 &&
      typeof chars === 'number' &&
      chars > 0
    );
  };

  const getFinalStats = () => {
    const finalWpm = calculateCurrentWPM();
    const currentAccuracy = calculateAccuracy(text, targetText);
    
    return {
      wpm: finalWpm,
      accuracy: currentAccuracy,
      correctChars,
      incorrectChars,
      totalChars: text.length
    };
  };

  // Resetear el test
  const handleReset = () => {
    console.log('Iniciando reset de la prueba - Forzando reset completo');
    
    // Desactivar la bandera de cambio primero para evitar bloqueos
    isChangingMode = false;
    
    try {
      // Realizar limpieza de todos los estados de forma forzada
      
      // 1. Resetear estados básicos del test
      setText('');
      setStartTime(null);
      setEndTime(null);
      setCurrentPosition(0);
      setIsActive(false);
      setError(null); // Limpiar cualquier error previo
      
      // Resetear estados de pausa
      setIsPaused(false);
      setPauseStartTime(null);
      setTotalPausedTime(0);
      setLastTypingTime(null);
      
      // Limpiar el temporizador de inactividad
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
        setInactivityTimer(null);
      }
      
      // 2. Resetear métricas y estado de usuario
      resetMetrics();
      resetUserState();
      
      // 3. Guardar el modo actual para usarlo al generar el nuevo texto
      const currentCodeMode = codeMode;
      const currentSelectedTime = selectedTime;
      
      // 4. Generar nuevas líneas según el tiempo seleccionado y el modo actual
      console.log(`Generando nuevo texto para tiempo: ${currentSelectedTime}, modo: ${currentCodeMode ? 'código' : 'normal'}`);
      const newTargetText = generateLines(currentSelectedTime, currentCodeMode);
      
      if (!newTargetText) {
        throw new Error('Error al generar nuevo texto');
      }
      
      // 5. Actualizar el texto objetivo
      setTargetText(newTargetText);
      
      // 6. Restablecer la visibilidad del selector de tiempo
      setShowTimeSelector(true);
      
      // 7. Forzar el foco en el input después de un pequeño retraso
      setTimeout(() => {
        if (inputRef.current) {
          console.log('Enfocando input después del reset');
          inputRef.current.focus();
        }
        console.log('Test reseteado completamente');
      }, 100);
    } catch (error) {
      console.error('Error al resetear el test:', error);
      setError('Error al reiniciar la prueba. Por favor, recarga la página.');
    }
  };

  // Enviar puntuación automáticamente
  const handleSubmitScoreAutomatically = async (finalWpm: number, finalAccuracy: number) => {
    console.log('Iniciando proceso de envío automático');
    
    if (!endTime || !startTime) {
      console.error('Error: Intento de envío sin tiempos finales', {
        tieneEndTime: !!endTime,
        tieneStartTime: !!startTime
      });
      return;
    }

    try {
      // Calcular valores finales
      const testDuration = (endTime - startTime) / 1000;
      
      console.log('Preparando datos para envío:', {
        wpm: finalWpm,
        accuracy: finalAccuracy,
        tiempo: testDuration,
        caracteres: {
          total: text.length,
          correctos: correctChars,
          incorrectos: incorrectChars
        },
        modo: isCompetitiveMode ? 'competitivo' : 'normal'
      });
      
      // Validar datos antes del envío
      if (!validateScoreData(finalWpm, finalAccuracy, text.length)) {
        console.error('Datos inválidos detectados:', {
          wpm: finalWpm,
          accuracy: finalAccuracy,
          chars: text.length,
          correctChars,
          incorrectChars
        });
        throw new Error('Datos de puntuación inválidos');
      }

      console.log('Iniciando envío a Supabase...');
      
      await submitScoreAutomatically(
        finalWpm,
        finalAccuracy,
        selectedTime,
        text.length,
        correctChars,
        incorrectChars,
        isCompetitiveMode
      );
      
      console.log('¡Datos enviados exitosamente!');
    } catch (error) {
      console.error('Error durante el envío automático:', error);
      setError('Error al enviar puntuación. Por favor, intenta de nuevo o usa el envío manual.');
    }
  };

  // Enviar puntuación manualmente
  const handleSubmitScore = async () => {
    console.log('Iniciando envío manual de puntuación');
    
    if (!endTime || !startTime) {
      console.error('Intento de envío manual sin tiempo final');
      return;
    }

    try {
      // Obtener estadísticas finales
      const stats = getFinalStats();
      
      console.log('Valores a enviar a Supabase (manual):', {
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        correctChars: stats.correctChars,
        incorrectChars: stats.incorrectChars,
        totalChars: stats.totalChars,
        tiempoTotal: (endTime - startTime) / 1000,
        tiempoSeleccionado: selectedTime,
        isCompetitiveMode
      });
      
      // Validar datos antes del envío
      if (!validateScoreData(stats.wpm, stats.accuracy, stats.correctChars)) {
        console.error('Datos inválidos para envío manual:', {
          wpm: stats.wpm,
          accuracy: stats.accuracy,
          correctChars: stats.correctChars
        });
        throw new Error('Datos de puntuación manual inválidos');
      }

      console.log('Enviando datos manualmente a Supabase...');
      await submitScore(
        stats.wpm,
        stats.accuracy,
        selectedTime,
        stats.totalChars,
        stats.correctChars,
        stats.incorrectChars,
        isCompetitiveMode
      );
      console.log('Datos enviados manualmente con éxito a Supabase');
    } catch (error) {
      console.error('Error al enviar puntuación manual:', error);
      setError('Error al enviar puntuación. Por favor, inténtalo de nuevo.');
    }
  };

  // Efecto para regenerar el texto cuando cambia el modo código
  useEffect(() => {
    // No cambiar el texto durante una prueba activa o si estamos en proceso de cambio
    if (isActive || isChangingMode) {
      console.log('Ignorando cambio de modo - Test activo o cambio en proceso');
      return;
    }
    
    // Solo regenerar si realmente hubo un cambio en el modo
    const savedCodeMode = localStorage.getItem('penguintype_code_mode') === 'true';
    if (savedCodeMode === codeMode) {
      console.log('Ignorando cambio de modo - No hay cambio real en el modo');
      return;
    }
    
    console.log('Regenerando texto por cambio de modo:', {
      nuevoModo: codeMode ? 'código' : 'normal',
      tiempo: selectedTime
    });
    
    // Guardar el nuevo modo en localStorage
    localStorage.setItem('penguintype_code_mode', String(codeMode));
    
    // Generar nuevo texto con un pequeño retraso para asegurar estados actualizados
    const timeoutId = setTimeout(() => {
      const newText = generateLines(selectedTime, codeMode);
      setTargetText(newText);
      setText('');
      setCurrentPosition(0);
      console.log('Texto regenerado exitosamente');
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [codeMode, selectedTime, generateLines, isActive]);

  // Función para establecer el modo código con protección contra actualizaciones múltiples
  const setCodeModeWithProtection = (newValue: boolean | ((prevState: boolean) => boolean)) => {
    // Si ya estamos en proceso de cambiar el modo, no hacer nada
    if (isChangingMode) return;
    
    // Activar la bandera
    isChangingMode = true;
    
    // Registrar el cambio de modo para depuración
    console.log(`Iniciando cambio de modo a: ${typeof newValue === 'function' ? 'función' : (newValue ? 'código' : 'normal')}`);
    
    // Capturar el valor actual antes del cambio
    const currentModeBeforeChange = codeMode;
    
    // Llamar a la función original
    if (typeof newValue === 'function') {
      setCodeMode(prevMode => {
        const result = newValue(prevMode);
        return result;
      });
    } else {
      setCodeMode(newValue);
    }
    
    // Forzar una actualización inmediata del texto objetivo
    setTimeout(() => {
      // Obtener el nuevo valor después del cambio
      const newMode = typeof newValue === 'function' ? !currentModeBeforeChange : newValue;
      console.log(`Generando nuevo texto para modo: ${newMode ? 'código' : 'normal'}`);
      
      // Generar nuevas líneas con el modo actualizado
      const newTargetText = generateLines(selectedTime, newMode);
      setTargetText(newTargetText);
      
      // Resetear el texto escrito si no hay una prueba activa
      if (!isActive) {
        setText('');
        setCurrentPosition(0);
      }
      
      // Desactivar la bandera después de completar todos los cambios
      isChangingMode = false;
      console.log('Cambio de modo completado');
    }, 50);
  };

  // Efecto para manejar cambios en el modo código
  useEffect(() => {
    // No hacer nada en la primera renderización o si estamos en proceso de cambio
    if (codeMode === getDefaultCodeMode() || isChangingMode) return;
    
    // Si no estamos en una prueba activa, actualizar el texto objetivo
    if (!isActive) {
      console.log(`Efecto detectó cambio de modo a: ${codeMode ? 'código' : 'normal'}`);
      
      // Generar nuevas líneas con el modo actualizado
      const newTargetText = generateLines(selectedTime, codeMode);
      
      // Forzar la actualización del texto objetivo
      if (newTargetText !== targetText) {
        console.log('Actualizando texto objetivo en efecto de cambio de modo');
        setTargetText(newTargetText);
      }
    }
  }, [codeMode, isActive, selectedTime, generateLines, targetText]);

  // Función para pausar la prueba
  const pauseTest = () => {
    if (isActive && !endTime && !isPaused) {
      console.log('Pausando prueba por inactividad');
      setIsPaused(true);
      setPauseStartTime(Date.now());
      
      // Limpiar el temporizador de inactividad
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
        setInactivityTimer(null);
      }
    }
  };
  
  // Función para reanudar la prueba
  const resumeTest = () => {
    if (isActive && !endTime && isPaused && pauseStartTime) {
      const currentTime = Date.now();
      const pauseDuration = currentTime - pauseStartTime;
      
      console.log(`Reanudando prueba después de ${pauseDuration / 1000} segundos de pausa`);
      
      // Actualizar el tiempo total de pausa
      setTotalPausedTime(prev => prev + pauseDuration);
      
      // Restablecer estados de pausa
      setIsPaused(false);
      setPauseStartTime(null);
      setLastTypingTime(currentTime);
      
      // Configurar un nuevo temporizador para detectar inactividad
      const newTimer = setTimeout(() => {
        if (isActive && !endTime) {
          pauseTest();
        }
      }, INACTIVITY_THRESHOLD);
      
      setInactivityTimer(newTimer);
    }
  };

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
    isPaused,
    totalPausedTime,
    pauseTest,
    resumeTest,
    setText,
    setShowTimeSelector,
    setShowAccTooltip,
    setShowCharTooltip,
    calculateCurrentWPM,
    calculateAccuracy: (text: string, targetText: string) => calculateAccuracy(text, targetText),
    handleTimeChange,
    handleInput,
    handleFocus,
    handleReset,
    handleSubmitScore,
    codeMode,
    setCodeMode: setCodeModeWithProtection,
    error,
  };
}