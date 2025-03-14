import { useState, useRef } from 'react';
import { WpmDataPoint, AccuracyDataPoint } from '../types';

export function useTypingMetrics() {
  const [wpmHistory, setWpmHistory] = useState<WpmDataPoint[]>([]);
  const [accuracyHistory, setAccuracyHistory] = useState<AccuracyDataPoint[]>([]);
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [missedChars, setMissedChars] = useState(0);
  const [extraChars, setExtraChars] = useState(0);
  const [consistency, setConsistency] = useState(0);
  const [testCompleted, setTestCompleted] = useState(false); // Nueva variable para controlar el estado de finalización
  
  // Nuevas variables para seguimiento de actividad de escritura
  const [totalKeypresses, setTotalKeypresses] = useState(0);
  const lastTextRef = useRef<string>('');
  
  // Esta función debe llamarse cada vez que cambia el texto en el campo de entrada
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const trackTextChanges = (newText: string, _targetText: string) => {
    const lastText = lastTextRef.current;
    
    // Si el texto es más corto, se eliminaron caracteres (backspace/delete)
    if (newText.length < lastText.length) {
      // Contar cuántos caracteres se eliminaron
      const charsDeleted = lastText.length - newText.length;
      // Cada caracter eliminado cuenta como una pulsación de tecla
      setTotalKeypresses(prev => prev + charsDeleted);
    } 
    // Si el texto es más largo, se añadieron caracteres
    else if (newText.length > lastText.length) {
      // Contar cuántos caracteres se añadieron
      const charsAdded = newText.length - lastText.length;
      // Cada caracter añadido cuenta como una pulsación de tecla
      setTotalKeypresses(prev => prev + charsAdded);
    }
    
    // Actualizar la referencia del último texto
    lastTextRef.current = newText;
  };

  const resetTracking = () => {
    setTotalKeypresses(0);
    lastTextRef.current = '';
    setTestCompleted(false); // Reiniciar el estado de finalización
  };

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
    
    // Tiempo transcurrido en minutos (con precisión)
    // Aseguramos un mínimo de 3 segundos (0.05 minutos) para evitar valores inflados al inicio
    const timeElapsedMin = Math.max(0.05, (currentTime - startTime) / 1000 / 60);
    
    // Para textos terminados, usar la longitud del texto para determinar chars correctos
    let correctCharsTyped = 0;
    const textToAnalyze = endTime ? text : text.substring(0, currentPosition);
    
    for (let i = 0; i < textToAnalyze.length; i++) {
      if (i < targetText.length && textToAnalyze[i] === targetText[i]) {
        correctCharsTyped++;
      }
    }
    
    // Usamos el estándar internacional: 1 palabra = 5 caracteres
    const standardCharsPerWord = 5.0;
    
    // Calcular palabras basado en el estándar internacional
    const effectiveWords = correctCharsTyped / standardCharsPerWord;
    
    // Calcular WPM bruto con los caracteres correctos
    let wpm = effectiveWords / timeElapsedMin;
    
    // Aplicar factores de ajuste solo si no es un test finalizado
    // Para tests finalizados, queremos mostrar el valor real sin ajustes
    if (!endTime) {
      // Factor de corrección que considera el esfuerzo total (incluyendo correcciones)
      const correctionFactor = Math.min(1.0, correctCharsTyped / Math.max(1, totalKeypresses));
      
      // Aplicar el factor de corrección a la velocidad bruta, pero de forma más suave
      wpm = wpm * Math.pow(correctionFactor, 0.7);
      
      // Ajuste por precisión
      const accuracy = calculateAccuracy(text, targetText) / 100; // entre 0 y 1
      
      // Aplicar un ajuste de precisión más estricto solo para valores en tiempo real
      let accuracyFactor;
      if (accuracy >= 0.9) {
        accuracyFactor = Math.pow(accuracy, 0.8); // Más suave
      } else {
        accuracyFactor = Math.pow(accuracy, 1.2); // Menos penalización
      }
      
      // Aplicar factor de precisión al WPM
      wpm = wpm * accuracyFactor;
    }
    
    // Si es un cálculo final, asegurar que sea al menos 1
    if (endTime) {
      console.log(`WPM calculado (final): ${wpm}`);
      return Math.max(1, Math.round(wpm));
    }
    
    // Retornar WPM redondeado para valores en tiempo real
    const result = Math.max(1, Math.round(wpm));
    return result;
  };

  // Calcular precisión durante la prueba
  const calculateAccuracy = (text: string, targetText: string): number => {
    if (text.length === 0) return 0;
    
    let correctChars = 0;
    let incorrectChars = 0;
    let extraChars = 0;
    
    // Contar caracteres correctos e incorrectos en el texto escrito
    const minLength = Math.min(text.length, targetText.length);
    for (let i = 0; i < minLength; i++) {
      if (text[i] === targetText[i]) {
        correctChars++;
      } else {
        incorrectChars++;
      }
    }
    
    // Contar caracteres extra (si el texto escrito es más largo)
    if (text.length > targetText.length) {
      extraChars = text.length - targetText.length;
    }
    
    // Total de caracteres incluye correctos, incorrectos y extras
    const totalChars = correctChars + incorrectChars + extraChars;
    
    // Calcular el porcentaje de precisión usando el estándar
    return Math.round((correctChars / totalChars) * 100);
  };

  // Calcular precisión final
  const calculateFinalAccuracy = (): number => {
    console.log(`calculateFinalAccuracy - correctChars: ${correctChars}, incorrectChars: ${incorrectChars}, missedChars: ${missedChars}, extraChars: ${extraChars}`);
    
    // Si tenemos valores calculados, usarlos
    if (correctChars + incorrectChars + missedChars + extraChars > 0) {
      // Calcular la precisión considerando todos los tipos de errores con enfoque estándar
      const totalChars = correctChars + incorrectChars + missedChars + extraChars;
      
      // Usar cálculo estándar: correctos / total
      const calcAccuracy = totalChars > 0 
        ? Math.round((correctChars / totalChars) * 10000) / 100
        : 0;
        
      console.log(`Accuracy calculado (estándar): ${calcAccuracy}`);
      return calcAccuracy;
    }
    
    // Si no tenemos valores pero hay historial, usar el último valor
    if (accuracyHistory.length > 0) {
      const lastAcc = accuracyHistory[accuracyHistory.length - 1].accuracy;
      console.log(`Usando último accuracy del historial: ${lastAcc}`);
      return lastAcc;
    }
    
    // Si no hay datos disponibles
    return 0;
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
    
    // Marcar el test como completado
    setTestCompleted(true);
  };

  // Actualizar historial de WPM y precisión
  const updateHistory = (
    currentTime: number,
    finalTime: number | null,
    finalWpm: number,
    finalAccuracy: number
  ) => {
    // No actualizar si el test ya ha sido completado y no es la actualización final
    if (testCompleted && !finalTime) return;
    
    // Si es la actualización final
    if (finalTime) {
      // Marcar el test como completado
      setTestCompleted(true);
      
      // Asegurar que el WPM final sea válido y nunca sea menor que 1
      const finalWpmValue = Math.max(finalWpm, 1);
      
      console.log(`Guardando WPM final: ${finalWpmValue}`);
      
      // Limpiar cualquier valor incorrecto que pudiera haber sido añadido antes
      setWpmHistory(prev => {
        // Filtrar cualquier punto que esté después del tiempo final
        const filteredHistory = prev.filter(p => p.time <= finalTime);
        
        // Verificar si ya existe un punto en el tiempo final
        const hasEndPoint = filteredHistory.some(p => Math.abs(p.time - finalTime) < 0.2);
        
        if (hasEndPoint) {
          // Actualizar el último punto para que tenga el valor final correcto
          return filteredHistory.map(p => {
            if (Math.abs(p.time - finalTime) < 0.2) {
              return { time: finalTime, wpm: finalWpmValue };
            }
            return p;
          });
        } else {
          // Añadir un punto final si no existe
          return [...filteredHistory, { time: finalTime, wpm: finalWpmValue }];
        }
      });
      
      // Hacer lo mismo con la precisión
      setAccuracyHistory(prev => {
        const filteredHistory = prev.filter(p => p.time <= finalTime);
        const hasEndPoint = filteredHistory.some(p => Math.abs(p.time - finalTime) < 0.2);
        
        if (hasEndPoint) {
          return filteredHistory.map(p => {
            if (Math.abs(p.time - finalTime) < 0.2) {
              return { time: finalTime, accuracy: finalAccuracy };
            }
            return p;
          });
        } else {
          return [...filteredHistory, { time: finalTime, accuracy: finalAccuracy }];
        }
      });
      
      return;
    } else {
      // Actualización regular durante la prueba (solo si el test no ha terminado)
      if (!testCompleted) {
        // Asegurar que el WPM que estamos registrando no esté limitado artificialmente
        // Simplemente tomamos el valor tal como viene, sin aplicar suavizado excesivo
        const currentWpm = Math.max(1, finalWpm);
        
        setWpmHistory(prev => {
          // Si es el primer punto, simplemente añadirlo
          if (prev.length === 0) {
            return [{ time: currentTime, wpm: currentWpm }];
          }
          
          // Obtener el último punto
          const lastPoint = prev[prev.length - 1];
          
          // Si han pasado al menos 0.3 segundos desde el último punto, añadir uno nuevo
          if (currentTime - lastPoint.time >= 0.3) {
            // Aplicar un suavizado muy ligero para evitar saltos bruscos pero mantener la tendencia real
            const smoothingFactor = 0.1; // Factor suave que permite cambios realistas
            const smoothedWpm = Math.round(
              lastPoint.wpm * (1 - smoothingFactor) + currentWpm * smoothingFactor
            );
            
            // Limitar la cantidad de puntos para evitar sobrecarga
            const maxPoints = 120;
            const newHistory = [...prev, { time: currentTime, wpm: smoothedWpm }];
            
            if (newHistory.length > maxPoints) {
              // Estrategia simple de muestreo para mantener un número manejable de puntos
              const samplesToKeep = Math.floor(maxPoints * 0.8);
              const sampleRate = Math.ceil(prev.length / samplesToKeep);
              
              // Conservar puntos anteriores espaciados y todos los puntos recientes
              const recentPoints = 30;
              const sampledPoints = [];
              
              for (let i = 0; i < prev.length - recentPoints; i += sampleRate) {
                sampledPoints.push(prev[i]);
              }
              
              // Añadir los puntos recientes sin muestreo
              return [
                ...sampledPoints,
                ...prev.slice(prev.length - recentPoints),
                { time: currentTime, wpm: smoothedWpm }
              ];
            }
            
            return newHistory;
          } else {
            // Para actualizaciones muy frecuentes, simplemente actualizar el último punto
            // Usamos un factor de suavizado muy pequeño para estabilidad
            const microSmoothingFactor = 0.05; 
            const microSmoothedWpm = Math.round(
              lastPoint.wpm * (1 - microSmoothingFactor) + currentWpm * microSmoothingFactor
            );
            
            return [
              ...prev.slice(0, -1),
              { time: lastPoint.time, wpm: microSmoothedWpm }
            ];
          }
        });
        
        // Lógica similar para la precisión
        setAccuracyHistory(prev => {
          if (prev.length === 0) {
            return [{ time: currentTime, accuracy: finalAccuracy }];
          }
          
          const lastPoint = prev[prev.length - 1];
          
          if (currentTime - lastPoint.time >= 0.3) {
            const smoothingFactor = 0.1;
            const smoothedAccuracy = Math.round(
              lastPoint.accuracy * (1 - smoothingFactor) + finalAccuracy * smoothingFactor
            );
            
            const maxPoints = 120;
            const newHistory = [...prev, { time: currentTime, accuracy: smoothedAccuracy }];
            
            if (newHistory.length > maxPoints) {
              // Mismo enfoque de muestreo que para WPM
              const recentPoints = 30;
              const sampleRate = Math.ceil((prev.length - recentPoints) / (maxPoints - recentPoints));
              const sampledPoints = [];
              
              for (let i = 0; i < prev.length - recentPoints; i += sampleRate) {
                sampledPoints.push(prev[i]);
              }
              
              return [
                ...sampledPoints,
                ...prev.slice(prev.length - recentPoints),
                { time: currentTime, accuracy: smoothedAccuracy }
              ];
            }
            
            return newHistory;
          } else {
            const microSmoothingFactor = 0.05;
            const microSmoothedAccuracy = Math.round(
              lastPoint.accuracy * (1 - microSmoothingFactor) + finalAccuracy * microSmoothingFactor
            );
            
            return [
              ...prev.slice(0, -1),
              { time: lastPoint.time, accuracy: microSmoothedAccuracy }
            ];
          }
        });
      }
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
    setTestCompleted(false); // Reiniciar el estado de finalización
    resetTracking(); // Reiniciar también el seguimiento de actividad
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
    resetMetrics,
    trackTextChanges,
    totalKeypresses
  };
} 