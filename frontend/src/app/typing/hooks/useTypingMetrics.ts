import { useState } from 'react';
import { WpmDataPoint, AccuracyDataPoint } from '../types';

export function useTypingMetrics() {
  const [wpmHistory, setWpmHistory] = useState<WpmDataPoint[]>([]);
  const [accuracyHistory, setAccuracyHistory] = useState<AccuracyDataPoint[]>([]);
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [missedChars, setMissedChars] = useState(0);
  const [extraChars, setExtraChars] = useState(0);
  const [consistency, setConsistency] = useState(0);

  // Función de cálculo de WPM
  const calculateWPM = (
    text: string,
    targetText: string,
    currentPosition: number,
    startTime: number | null,
    endTime: number | null
  ): number => {
    if (!startTime) return 0;
    
    // Usar endTime si el test ha terminado, de lo contrario usar el tiempo actual
    const currentTime = endTime || Date.now();
    
    // Tiempo transcurrido en minutos
    const timeElapsedMin = Math.max(0.01, (currentTime - startTime) / 1000 / 60);
    
    // Solo contar caracteres correctos
    const correctCharsTyped = text.substring(0, currentPosition).split('').filter((char, i) => {
      // Si el carácter es un espacio o signo de puntuación, contar como correcto
      if (char === ' ' || /[.,;:!?]/.test(char)) {
        return true;
      }
      // Si estamos dentro del rango del texto objetivo, comparar con el carácter esperado
      if (i < targetText.length) {
        return char === targetText[i];
      }
      return false;
    }).length;
    
    // Aplicar un factor de corrección más realista
    // El estándar dice que 1 palabra = 5 caracteres, pero en la práctica 
    // las palabras promedian 4.7 caracteres en inglés y 4.2 en español (incluyendo espacios)
    // Usamos 4.5 como un valor intermedio más realista
    const effectiveWords = correctCharsTyped / 4.5;
    
    // Calcular WPM con los caracteres correctos y factor ajustado
    let wpm = effectiveWords / timeElapsedMin;
    
    // Ajuste basado en precisión - reduce el WPM si hay muchos errores
    const accuracy = calculateAccuracy(text, targetText) / 100; // entre 0 y 1
    
    // Si la precisión es muy baja, aplicar una penalización al WPM
    if (accuracy < 0.9) {
      // A menor precisión, mayor penalización (suave)
      wpm = wpm * (0.9 + (accuracy * 0.1));
    }
    
    // Aplicar un factor de escala general para mejor precisión
    // Factor calibrado basado en comparaciones con otras herramientas de typing
    const calibratedWpm = wpm * 0.95; // Ajuste fino del 5% a la baja
    
    // Redondear y asegurar que no sea menor a 1
    return Math.max(1, Math.round(calibratedWpm));
  };

  // Calcular precisión durante la prueba
  const calculateAccuracy = (text: string, targetText: string): number => {
    if (text.length === 0) return 0;
    
    let correctChars = 0;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === targetText[i]) {
        correctChars++;
      }
    }
    
    return Math.round((correctChars / text.length) * 100);
  };

  // Calcular precisión final
  const calculateFinalAccuracy = (): number => {
    const total = correctChars + incorrectChars;
    return total > 0 ? Math.round((correctChars / total) * 10000) / 100 : 0;
  };

  // Calcular estadísticas detalladas al finalizar
  const calculateDetailedStats = (text: string, targetText: string) => {
    let correct = 0;
    let incorrect = 0;
    let missed = 0;
    let extra = 0;
    
    // Verificamos caracteres
    for (let i = 0; i < Math.max(text.length, targetText.length); i++) {
      if (i < text.length && i < targetText.length) {
        if (text[i] === targetText[i]) {
          correct++;
        } else {
          incorrect++;
        }
      } else if (i >= text.length && i < targetText.length) {
        missed++;
      } else if (i >= targetText.length && i < text.length) {
        extra++;
      }
    }
    
    setCorrectChars(correct);
    setIncorrectChars(incorrect);
    setMissedChars(missed);
    setExtraChars(extra);
    
    // Calcular consistencia (variabilidad del WPM)
    if (wpmHistory.length > 0) {
      const wpmValues = wpmHistory.map(entry => entry.wpm);
      const avgWpm = wpmValues.reduce((sum, val) => sum + val, 0) / wpmValues.length;
      
      // Desviación estándar como medida de variabilidad
      const squaredDiffs = wpmValues.map(val => Math.pow(val - avgWpm, 2));
      const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / wpmValues.length;
      const stdDev = Math.sqrt(variance);
      
      // Consistencia como porcentaje (100% - coeficiente de variación normalizado)
      const consistency = Math.max(0, Math.min(100, 100 - (stdDev / avgWpm * 100)));
      setConsistency(Math.round(consistency));
    }
  };

  // Actualizar historial de WPM y precisión
  const updateHistory = (
    currentTime: number,
    finalTime: number | null,
    finalWpm: number,
    finalAccuracy: number
  ) => {
    // Si es la actualización final
    if (finalTime) {
      // Limpiar cualquier valor bajo que pudiera haber sido añadido antes
      setWpmHistory(prev => {
        // Filtrar cualquier punto que esté después del tiempo final
        const filteredHistory = prev.filter(p => p.time <= finalTime);
        
        // Verificar si ya existe un punto en el tiempo final
        const hasEndPoint = filteredHistory.some(p => Math.abs(p.time - finalTime) < 0.5);
        
        if (hasEndPoint) {
          // Actualizar el último punto para que tenga el valor final correcto
          return filteredHistory.map(p => {
            if (Math.abs(p.time - finalTime) < 0.5) {
              return { time: finalTime, wpm: finalWpm };
            }
            return p;
          });
        } else {
          // Añadir un punto final si no existe
          return [...filteredHistory, { time: finalTime, wpm: finalWpm }];
        }
      });
      
      // Hacer lo mismo con la precisión
      setAccuracyHistory(prev => {
        const filteredHistory = prev.filter(p => p.time <= finalTime);
        const hasEndPoint = filteredHistory.some(p => Math.abs(p.time - finalTime) < 0.5);
        
        if (hasEndPoint) {
          return filteredHistory.map(p => {
            if (Math.abs(p.time - finalTime) < 0.5) {
              return { time: finalTime, accuracy: finalAccuracy };
            }
            return p;
          });
        } else {
          return [...filteredHistory, { time: finalTime, accuracy: finalAccuracy }];
        }
      });
    } else {
      // Actualización regular durante la prueba
      // Solo agregar si han pasado al menos 0.5 segundos desde el último registro
      setWpmHistory(prev => {
        if (prev.length === 0 || currentTime - prev[prev.length - 1].time >= 0.5) {
          return [...prev, { time: currentTime, wpm: finalWpm }];
        }
        return prev;
      });
      
      // Registrar la precisión
      setAccuracyHistory(prev => {
        if (prev.length === 0 || currentTime - prev[prev.length - 1].time >= 0.5) {
          return [...prev, { time: currentTime, accuracy: finalAccuracy }];
        }
        return prev;
      });
    }
  };

  const resetMetrics = () => {
    setWpmHistory([]);
    setAccuracyHistory([]);
    setCorrectChars(0);
    setIncorrectChars(0);
    setMissedChars(0);
    setExtraChars(0);
    setConsistency(0);
  };

  return {
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
  };
} 