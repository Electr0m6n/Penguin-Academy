import { WpmDataPoint, AccuracyDataPoint } from '../../types';

export const getChartData = (
  wpmHistory: WpmDataPoint[],
  accuracyHistory: AccuracyDataPoint[],
  safeStyles: {
    backgroundColor: string;
    color: string;
  }
) => {
  if (wpmHistory.length === 0) {
    return {
      labels: [],
      datasets: []
    };
  }
  
  console.log(`Renderizando gráfico con ${wpmHistory.length} puntos de WPM. Último WPM: ${wpmHistory[wpmHistory.length - 1].wpm}`);
  
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
  
  // Generar etiquetas basadas en tiempo relativo
  const labels = validWpmHistory.map((entry, index) => `${index + 1}s`);
  
  // Preparar el conjunto de datos
  return {
    labels,
    datasets: [
      {
        label: 'WPM',
        data: validWpmHistory.map(entry => entry.wpm),
        borderColor: safeStyles.color,
        backgroundColor: 'transparent',
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
        fill: false,
        yAxisID: 'y'
      },
      {
        label: 'Accuracy',
        data: accuracyHistory.map(entry => entry.accuracy),
        borderColor: safeStyles.color,
        backgroundColor: 'transparent',
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
        fill: false,
        yAxisID: 'y1'
      }
    ]
  };
}; 