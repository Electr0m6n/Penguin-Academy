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
    
    // Solo contar caracteres correctamente escritos
    // Esta vez verificamos estrictamente cada carácter con el original
    let correctCharsTyped = 0;
    const textToAnalyze = text.substring(0, currentPosition);
    
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
    
    // Factor de corrección que considera el esfuerzo total (incluyendo correcciones)
    const correctionFactor = Math.min(1.0, correctCharsTyped / Math.max(1, totalKeypresses));
    
    // Aplicar el factor de corrección a la velocidad bruta
    wpm = wpm * Math.pow(correctionFactor, 0.85); // Ligeramente más estricto
    
    // Ajuste por precisión
    const accuracy = calculateAccuracy(text, targetText) / 100; // entre 0 y 1
    
    // Aplicar un ajuste de precisión más estricto
    // Penalizar más significativamente precisiones por debajo del 90%
    let accuracyFactor;
    if (accuracy >= 0.9) {
      accuracyFactor = Math.pow(accuracy, 1.1);
    } else {
      // Penalización más fuerte para precisión baja
      accuracyFactor = Math.pow(accuracy, 1.5);
    }
    wpm = wpm * accuracyFactor;
    
    // Aplicar un factor de calibración más conservador
    const calibrationFactor = 0.92; // Ajuste del 8% para mayor precisión
    const calibratedWpm = wpm * calibrationFactor;
    
    // Implementar un límite superior razonable de WPM (300 WPM es considerado muy rápido)
    const cappedWpm = Math.min(300, Math.max(1, Math.round(calibratedWpm)));
    
    return cappedWpm;
  };

  // Calcular precisión durante la prueba
  const calculateAccuracy = (text: string, targetText: string): number => {
    if (text.length === 0) return 0;
    
    let correctChars = 0;
    const minLength = Math.min(text.length, targetText.length);
    
    for (let i = 0; i < minLength; i++) {
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
    } else {
      // Actualización regular durante la prueba (solo si el test no ha terminado)
      if (!testCompleted) {
        setWpmHistory(prev => {
          // Si es el primer punto, simplemente añadirlo
          if (prev.length === 0) {
            return [{ time: currentTime, wpm: finalWpm }];
          }
          
          // Obtener el último punto
          const lastPoint = prev[prev.length - 1];
          
          // Si han pasado al menos 0.3 segundos desde el último punto, añadir uno nuevo (más frecuente)
          if (currentTime - lastPoint.time >= 0.3) {
            // ------ Aplicar suavizado avanzado ------
            
            // 1. Obtener los últimos puntos para calcular tendencia (hasta 5 puntos)
            const recentPoints = prev.slice(-Math.min(5, prev.length));
            
            // 2. Calcular la mediana de los últimos WPM para eliminar valores extremos
            const recentWpms = [...recentPoints.map(p => p.wpm), finalWpm].sort((a, b) => a - b);
            const medianWpm = recentWpms[Math.floor(recentWpms.length / 2)];
            
            // 3. Detectar si el valor actual es un pico anómalo
            const isAnomaly = Math.abs(finalWpm - medianWpm) > 15; // Reducido para ser más sensible a anomalías
            
            // 4. Calcular el valor suavizado usando diferentes factores según contexto
            let smoothedWpm;
            
            if (isAnomaly) {
              // Si es un valor anómalo, usar un suavizado más fuerte
              const adjustmentFactor = finalWpm > lastPoint.wpm ? 0.92 : 0.85;
              smoothedWpm = lastPoint.wpm * adjustmentFactor + medianWpm * (1 - adjustmentFactor);
            } else {
              // Suavizado adaptativo basado en la volatilidad reciente
              const recentVariance = Math.max(1, 
                recentPoints.reduce((sum, p, i, arr) => 
                  i > 0 ? sum + Math.abs(p.wpm - arr[i-1].wpm) : sum, 0) / (recentPoints.length - 1 || 1)
              );
              
              // Factor de suavizado adaptativo - ajustado para reducir inflación
              const adaptiveFactor = Math.min(0.3, Math.max(0.05, 1 / (recentVariance * 0.25)));
              
              // Bias ligeramente hacia abajo para compensar la tendencia a subir
              const biasCorrection = finalWpm > lastPoint.wpm ? 0.97 : 1.0;
              
              // Aplicar suavizado exponencial con factor adaptativo y corrección
              smoothedWpm = (lastPoint.wpm * (1 - adaptiveFactor) + finalWpm * adaptiveFactor) * biasCorrection;
            }
            
            // Redondear para valores enteros
            const roundedWpm = Math.round(smoothedWpm);
            
            // Limitar la cantidad de puntos para evitar sobrecarga en gráfica
            const maxPoints = 120; // Más puntos para mayor resolución
            const newHistory = [...prev, { time: currentTime, wpm: roundedWpm }];
            
            // Si hay demasiados puntos, aplicar un muestreo estratégico
            if (newHistory.length > maxPoints) {
              // Estrategia de muestreo que preserva más detalles recientes
              // y menos detalles antiguos
              const preserveRecent = 30; // Preservar los últimos 30 puntos tal cual
              const oldPoints = newHistory.slice(0, -preserveRecent);
              const recentPoints = newHistory.slice(-preserveRecent);
              
              // Para puntos antiguos, hacer un submuestreo adaptativo
              const samplingRate = Math.ceil(oldPoints.length / (maxPoints - preserveRecent));
              const sampledOldPoints = [];
              
              for (let i = 0; i < oldPoints.length; i += samplingRate) {
                sampledOldPoints.push(oldPoints[i]);
              }
              
              // Asegurar que exista un buen enlace entre puntos viejos y recientes
              if (sampledOldPoints.length > 0 && recentPoints.length > 0) {
                // Si hay un salto grande de tiempo, agregar puntos intermedios
                const lastOldTime = sampledOldPoints[sampledOldPoints.length - 1].time;
                const firstRecentTime = recentPoints[0].time;
                
                if (firstRecentTime - lastOldTime > 2) {
                  const midTime = (lastOldTime + firstRecentTime) / 2;
                  const midWpm = (sampledOldPoints[sampledOldPoints.length - 1].wpm + recentPoints[0].wpm) / 2;
                  sampledOldPoints.push({ time: midTime, wpm: Math.round(midWpm) });
                }
              }
              
              return [...sampledOldPoints, ...recentPoints];
            }
            
            return newHistory;
          } else {
            // Para actualizaciones muy frecuentes, solo actualizar el último punto
            // con un factor de suavizado aún más suave para estabilidad
            const microSmoothingFactor = 0.05; // Reducido para mayor estabilidad
            // Mismo ajuste que arriba para evitar inflación de valores
            const biasCorrection = finalWpm > lastPoint.wpm ? 0.96 : 1.0;
            const microSmoothedWpm = (lastPoint.wpm * (1 - microSmoothingFactor) + finalWpm * microSmoothingFactor) * biasCorrection;
            
            return [
              ...prev.slice(0, -1),
              { time: lastPoint.time, wpm: Math.round(microSmoothedWpm) }
            ];
          }
        });
        
        // Lógica similar para la precisión pero con parámetros ajustados
        setAccuracyHistory(prev => {
          if (prev.length === 0) {
            return [{ time: currentTime, accuracy: finalAccuracy }];
          }
          
          const lastPoint = prev[prev.length - 1];
          
          if (currentTime - lastPoint.time >= 0.3) {
            // Suavizado más sencillo para precisión ya que tiende a ser más estable
            const smoothingFactor = 0.06; // Reducido para mayor estabilidad
            const smoothedAccuracy = lastPoint.accuracy * (1 - smoothingFactor) + finalAccuracy * smoothingFactor;
            
            const maxPoints = 120;
            const newHistory = [...prev, { time: currentTime, accuracy: Math.round(smoothedAccuracy) }];
            
            if (newHistory.length > maxPoints) {
              const preserveRecent = 30;
              const oldPoints = newHistory.slice(0, -preserveRecent);
              const recentPoints = newHistory.slice(-preserveRecent);
              
              const samplingRate = Math.ceil(oldPoints.length / (maxPoints - preserveRecent));
              const sampledOldPoints = [];
              
              for (let i = 0; i < oldPoints.length; i += samplingRate) {
                sampledOldPoints.push(oldPoints[i]);
              }
              
              return [...sampledOldPoints, ...recentPoints];
            }
            
            return newHistory;
          } else {
            const microSmoothingFactor = 0.02; // Más suave para mayor estabilidad
            const microSmoothedAccuracy = lastPoint.accuracy * (1 - microSmoothingFactor) + finalAccuracy * microSmoothingFactor;
            
            return [
              ...prev.slice(0, -1),
              { time: lastPoint.time, accuracy: Math.round(microSmoothedAccuracy) }
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