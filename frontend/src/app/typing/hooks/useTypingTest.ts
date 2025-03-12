import { useState, useEffect, useRef } from 'react';
import { TestDuration } from '../types';
import { timeTexts, typingTexts } from '../constants/texts';
import { useTypingMetrics } from './useTypingMetrics';
import { useSupabase } from './useSupabase';

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
    resetMetrics
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
  
  // Estados para la selección de tiempo y texto
  const [selectedTime, setSelectedTime] = useState<TestDuration>(60);
  const [showTimeSelector, setShowTimeSelector] = useState(true);
  const [currentLines, setCurrentLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [maxTime, setMaxTime] = useState<number | null>(null);
  const [isCompetitiveMode, setIsCompetitiveMode] = useState(false);
  
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
      
      // Reiniciar con ESC
      if (e.key === 'Escape') {
        handleReset();
        // Mostrar el selector de tiempo nuevamente
        setShowTimeSelector(true);
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
  }, [showTimeSelector, text]);

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
      const timeInMinutes = (endTime - startTime) / 60000;
      // Para el cálculo del WPM, consideramos todas las palabras escritas en todas las líneas
      const wordsTyped = currentLines.slice(0, currentLineIndex + 1).join(' ').split(/\s+/).length;
      const calculatedWpm = Math.round(wordsTyped / timeInMinutes);
      setWpm(calculatedWpm);

      // Calcular precisión en base a lo que escribió el usuario vs. el texto objetivo
      let correctCharsCount = 0;
      let totalCharsCount = 0;
      
      // Si fue una prueba completa (todas las líneas)
      if (currentLineIndex === currentLines.length - 1) {
        for (let i = 0; i < text.length; i++) {
          if (text[i] === targetText[i]) {
            correctCharsCount++;
          }
          totalCharsCount++;
        }
      }
      
      const calculatedAccuracy = Math.round((correctCharsCount / totalCharsCount) * 100);
      setAccuracy(calculatedAccuracy);
    }
  }, [endTime, startTime, text, targetText, currentLineIndex, currentLines]);

  // Efecto que se ejecuta cuando termina la prueba
  useEffect(() => {
    // Solo ejecutar cuando endTime cambia de null a un valor (test terminado)
    if (endTime && startTime) {
      // Calcular los valores finales una vez
      const finalTime = (endTime - startTime) / 1000;
      const finalWpm = calculateCurrentWPM();
      const finalAccuracy = calculateAccuracy(text, targetText);
      
      // Actualizar el WPM y Accuracy una última vez, con los valores finales correctos
      setWpm(finalWpm);
      setAccuracy(finalAccuracy);
      
      // Actualizar el historial con los valores finales
      updateHistory(finalTime, finalTime, finalWpm, finalAccuracy);
      
      // Calcular estadísticas detalladas
      calculateDetailedStats(text, targetText);
      
      // Enviar puntaje automáticamente al finalizar
      setTimeout(() => {
        if (!hasSubmittedScore) {
          handleSubmitScoreAutomatically(finalWpm, finalAccuracy);
        }
      }, 1000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endTime]);

  // Efecto que actualiza durante la prueba para registrar la evolución del WPM
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && startTime && !endTime) {
      // Iniciar con un valor base
      if (wpmHistory.length === 0 && currentPosition > 0) {
        const initialWpm = calculateCurrentWPM();
        const initialAcc = calculateAccuracy(text, targetText);
        updateHistory(0, null, initialWpm, initialAcc);
      }
      
      interval = setInterval(() => {
        const currentTime = (Date.now() - startTime) / 1000;
        // Solo registrar si se ha escrito algo
        if (currentPosition > 0) {
          const currentWpm = calculateCurrentWPM();
          const currentAcc = calculateAccuracy(text, targetText);
          
          // Solo registrar si el WPM es mayor a 0
          if (currentWpm > 0) {
            updateHistory(currentTime, null, currentWpm, currentAcc);
          }
        }
        
      }, 2000); // Actualizar cada 2 segundos
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, startTime, endTime, currentPosition]);

  // Función para cambiar el tiempo seleccionado
  const handleTimeChange = (time: TestDuration) => {
    // Reiniciar antes de cambiar el tiempo
    handleReset();
    
    if (time === 'competitive') {
      setIsCompetitiveMode(true);
      setSelectedTime(120); // Por defecto, usamos 120 segundos para el modo competitivo
    } else {
      setIsCompetitiveMode(false);
      setSelectedTime(time);
    }
  };

  // Manejar la entrada de texto
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (newText.length <= targetText.length) {
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
    return calculateWPM(text, targetText, currentPosition, startTime, endTime);
  };

  // Resetear el test
  const handleReset = () => {
    setText('');
    setStartTime(null);
    setEndTime(null);
    setWpm(null);
    setAccuracy(null);
    setCurrentPosition(0);
    setIsActive(false);
    resetMetrics();
    setShowAccTooltip(false);
    setShowCharTooltip(false);
    resetUserState();
    
    // Generar nuevas líneas según el tiempo seleccionado
    if (typeof selectedTime === 'number') {
      const randomIndex = Math.floor(Math.random() * timeTexts[selectedTime].length);
      setCurrentLines([timeTexts[selectedTime][randomIndex]]);
      setCurrentLineIndex(0);
      setTargetText(timeTexts[selectedTime][randomIndex]);
    }
    
    // Enfocar el textarea
    if (inputRef.current) {
      inputRef.current.focus();
    }
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

  return {
    // Estados
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
    
    // Referencias
    inputRef,
    textContainerRef,
    
    // Funciones
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
    handleSubmitScore
  };
} 