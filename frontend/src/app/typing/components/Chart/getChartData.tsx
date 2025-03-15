'use client'

import { WpmDataPoint, AccuracyDataPoint } from '../../types';
import { ChartData } from 'chart.js';

interface ChartStyleProps {
  backgroundColor: string;
  color: string;
}

export const getChartData = (
  wpmHistory: WpmDataPoint[],
  accuracyHistory: AccuracyDataPoint[],
  safeStyles: ChartStyleProps
): ChartData<'line'> => {
  if (wpmHistory.length === 0) {
    return {
      labels: [],
      datasets: []
    };
  }
  
  // Filtrar valores no válidos y asegurar que sean números
  const validWpmHistory = wpmHistory.filter(entry => 
    !isNaN(entry.wpm) && 
    isFinite(entry.wpm) && 
    entry.wpm > 0
  );
  
  // Si después de filtrar no quedan puntos válidos, devolver un conjunto vacío
  if (validWpmHistory.length === 0) {
    console.log('No hay puntos válidos de WPM después de filtrar');
    return {
      labels: [],
      datasets: []
    };
  }
  
  // Reducir la cantidad de puntos si hay demasiados (mejor rendimiento)
  const MAX_POINTS = 100;
  let filteredWpmHistory = validWpmHistory;
  let filteredAccHistory = accuracyHistory.filter(entry => 
    !isNaN(entry.accuracy) && 
    isFinite(entry.accuracy) && 
    entry.accuracy >= 0 && 
    entry.accuracy <= 100
  );
  
  // Si hay demasiados puntos, tomamos una muestra representativa
  if (validWpmHistory.length > MAX_POINTS) {
    const step = Math.ceil(validWpmHistory.length / MAX_POINTS);
    filteredWpmHistory = validWpmHistory.filter((_, index) => index % step === 0 || index === validWpmHistory.length - 1);
    
    // Aseguramos que el último punto siempre esté incluido
    if (filteredWpmHistory[filteredWpmHistory.length - 1] !== validWpmHistory[validWpmHistory.length - 1]) {
      filteredWpmHistory.push(validWpmHistory[validWpmHistory.length - 1]);
    }
    
    // Filtramos los datos de precisión correspondientes
    filteredAccHistory = filteredAccHistory.filter((_, index) => 
      index % step === 0 || index === filteredAccHistory.length - 1
    );
    
    // Si hay menos puntos de precisión que WPM, aseguramos que el array tenga el mismo tamaño
    if (filteredAccHistory.length < filteredWpmHistory.length) {
      // Rellenar con el último valor disponible
      const lastAccuracy = filteredAccHistory[filteredAccHistory.length - 1] || { time: 0, accuracy: 100 };
      while (filteredAccHistory.length < filteredWpmHistory.length) {
        filteredAccHistory.push(lastAccuracy);
      }
    }
  }
  
  // Generar etiquetas basadas en tiempo
  const labels = filteredWpmHistory.map(entry => `${entry.time.toFixed(1)}s`);
  
  // Derivar colores para líneas y áreas con mayor contraste visual
  const wpmLineColor = safeStyles.color;
  const wpmFillColor = `${safeStyles.color}50`; // Semi-transparente
  
  // Crear un gradiente para WPM y un color contrastante para precisión
  const wpmHighlightColor = getHighlightColor(safeStyles.color);
  const accuracyBaseColor = getAccuracyColor(safeStyles.color);
  const accuracyHighlightColor = getHighlightColor(accuracyBaseColor);
  const accuracyFillColor = `${accuracyBaseColor}30`; // Muy transparente
    
  // Preparar el conjunto de datos con opciones visuales mejoradas
  return {
    labels,
    datasets: [
      {
        label: 'WPM',
        data: filteredWpmHistory.map(entry => entry.wpm),
        borderColor: wpmLineColor,
        backgroundColor: wpmFillColor,
        tension: 0.4,
        pointRadius: 0, // Cambiado de 3 a 0: puntos no visibles por defecto
        pointHoverRadius: 7, // Puntos más grandes al hacer hover
        pointBackgroundColor: wpmHighlightColor, // Color de puntos destacado
        pointHoverBackgroundColor: 'white',
        pointBorderColor: 'transparent',
        pointHoverBorderColor: wpmHighlightColor,
        pointBorderWidth: 1,
        pointHoverBorderWidth: 2,
        borderWidth: 3,
        fill: true,
        yAxisID: 'y',
        cubicInterpolationMode: 'monotone'
      },
      {
        label: 'Accuracy',
        data: filteredAccHistory.map(entry => entry.accuracy),
        borderColor: accuracyBaseColor,
        backgroundColor: accuracyFillColor,
        tension: 0.4,
        pointRadius: 0, // Cambiado de 2 a 0: puntos no visibles por defecto
        pointHoverRadius: 5, // Puntos más grandes al hacer hover
        pointBackgroundColor: accuracyHighlightColor,
        pointHoverBackgroundColor: 'white',
        pointBorderColor: 'transparent',
        pointHoverBorderColor: accuracyHighlightColor,
        pointBorderWidth: 1,
        pointHoverBorderWidth: 2,
        borderWidth: 2.5,
        borderDash: [5, 5], // Línea punteada para distinguir de WPM
        fill: true,
        yAxisID: 'y1',
        cubicInterpolationMode: 'monotone'
      }
    ]
  };
};

// Función para generar un color de resaltado basado en el color base
function getHighlightColor(baseColor: string): string {
  // Si es un color HEX, generamos un color más brillante
  if (baseColor.startsWith('#')) {
    // Convertir a RGB para poder ajustar el brillo
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);
    
    // Hacer el color más brillante, pero preservando el tono
    const factor = 1.3; // 30% más brillante
    const newR = Math.min(255, Math.round(r * factor));
    const newG = Math.min(255, Math.round(g * factor));
    const newB = Math.min(255, Math.round(b * factor));
    
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  }
  
  // Para otros formatos de color, simplemente devolvemos uno predefinido brillante
  return '#56CCF2';
}

// Función para generar un color para la precisión que contraste con el color WPM
function getAccuracyColor(baseColor: string): string {
  // Para la precisión usamos un color más azulado que contrasta bien
  return baseColor.startsWith('#') 
    ? `#56CCF2` 
    : 'rgba(86, 204, 242, 0.8)';
} 