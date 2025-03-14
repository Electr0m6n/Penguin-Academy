'use client'

import { useCallback } from 'react';
import { WpmDataPoint, AccuracyDataPoint } from '../../types';
import { Theme } from '../../types';
import { getChartData as getFormattedChartData } from './getChartData';

interface ChartProps {
  wpmHistory: WpmDataPoint[];
  accuracyHistory: AccuracyDataPoint[];
  safeStyles: {
    backgroundColor: string;
    color: string;
  };
  isHydrated: boolean;
  themes: Theme[];
  currentTheme: string;
}

export const useChartConfig = ({
  wpmHistory,
  accuracyHistory,
  safeStyles,
  isHydrated
}: ChartProps) => {
  // Función para obtener datos del gráfico
  const getChartData = useCallback(() => {
    // Si no hay datos suficientes o no está hidratado, devolver un dataset vacío
    if (!isHydrated || wpmHistory.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }
    
    // Usar la función externa para obtener los datos formateados
    return getFormattedChartData(wpmHistory, accuracyHistory, safeStyles);
  }, [isHydrated, wpmHistory, accuracyHistory, safeStyles]);

  // Calcular el máximo del eje Y de forma dinámica
  const getYAxisMax = useCallback(() => {
    if (wpmHistory.length === 0) return 100; // Valor predeterminado más alto
    
    // Obtener el máximo WPM histórico, asegurando que sea al menos 1
    const validWpms = wpmHistory.map(entry => isNaN(entry.wpm) ? 1 : entry.wpm);
    const maxWpm = Math.max(...validWpms, 1);
    
    // Redondear hacia arriba al siguiente múltiplo de 20 y añadir un margen
    const roundedMax = Math.ceil(maxWpm / 20) * 20;
    
    // Establecer un margen adicional basado en el rango de valores
    const margin = maxWpm > 150 ? 50 : 30;
    
    // Devolver al menos 100 o el valor calculado
    return Math.max(100, roundedMax + margin);
  }, [wpmHistory]);
  
  // Determinar el tamaño del paso para las marcas del eje Y
  const getYAxisStepSize = useCallback(() => {
    if (wpmHistory.length === 0) return 20; // Valor predeterminado
    
    const maxWpm = Math.max(...wpmHistory.map(entry => entry.wpm));
    
    // Ajustar el tamaño del paso según el rango
    if (maxWpm > 200) return 50;
    if (maxWpm > 100) return 40;
    return 20;
  }, [wpmHistory]);

  // Opciones de la gráfica - actualizadas para usar safeStyles
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    devicePixelRatio: 1, // Forzar una resolución constante
    scales: {
      y: {
        type: 'linear' as const,
        min: 0,
        max: getYAxisMax(),
        title: {
          display: true,
          text: 'Words per Minute',
          color: `${safeStyles.color}AA`,
          font: {
            family: 'monospace',
            size: 12,
            weight: 'bold' as 'bold' | 'normal'
          },
          position: 'left' as const,
          rotation: -90 // Girar el texto verticalmente
        },
        grid: {
          color: `${safeStyles.color}20`,
          drawBorder: false,
          lineWidth: 1,
        },
        ticks: {
          color: `${safeStyles.color}AA`,
          font: {
            family: 'monospace',
            weight: 'bold' as 'bold' | 'normal'
          },
          stepSize: getYAxisStepSize(),
          padding: 10
        },
        border: {
          display: true,
          color: `${safeStyles.color}60`,
          width: 1
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        beginAtZero: true, // Asegurarse de que comience en 0
        min: 0,
        max: 100, // Accuracy siempre de 0 a 100%
        title: {
          display: true,
          text: 'Accuracy (%)',
          color: safeStyles.color,
          font: {
            family: 'monospace',
            size: 12,
            weight: 'bold' as 'bold' | 'normal'
          },
          position: 'right' as const,
          rotation: 90 // Girar el texto verticalmente
        },
        grid: {
          drawOnChartArea: false, // No dibujar líneas de cuadrícula para este eje
        },
        ticks: {
          color: safeStyles.color,
          font: {
            family: 'monospace',
            weight: 'bold' as 'bold' | 'normal'
          },
          stepSize: 20, // Mostrar marcas cada 20%
          padding: 10,
          callback: function(tickValue: number | string) {
            return tickValue + '%'; // Agregar el símbolo de porcentaje a las etiquetas
          }
        },
        border: {
          display: true,
          color: `${safeStyles.color}AA`,
          width: 1
        }
      },
      x: {
        grid: {
          color: `${safeStyles.color}10`,
          drawBorder: false,
          lineWidth: 1,
        },
        ticks: {
          display: false, // Ocultar etiquetas del eje X para una apariencia más limpia
          font: {
            family: 'monospace'
          }
        },
        border: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        display: true, // Mostrar la leyenda para distinguir WPM y precisión
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          color: `${safeStyles.color}AA`,
          font: {
            family: 'monospace',
            size: 10
          },
          boxWidth: 10,
          padding: 5
        },
      },
      tooltip: {
        enabled: true,
        mode: 'index' as const,
        intersect: false,
        backgroundColor: `${safeStyles.backgroundColor}EE`,
        titleColor: safeStyles.color,
        bodyColor: safeStyles.color,
        borderColor: `${safeStyles.color}40`,
        borderWidth: 1,
        cornerRadius: 4,
        padding: 8,
        titleFont: {
          family: 'monospace',
          weight: 'bold' as 'bold' | 'normal',
          size: 12,
        },
        bodyFont: {
          family: 'monospace',
          size: 12,
          weight: 'bold' as 'bold' | 'normal'
        },
        callbacks: {
          title: function(tooltipItems: Array<{dataIndex: number}>) {
            // Convertir el índice de tiempo a segundos
            if (tooltipItems.length > 0) {
              const dataIndex = tooltipItems[0].dataIndex;
              const validWpmEntry = wpmHistory[dataIndex];
              return validWpmEntry ? `${validWpmEntry.time.toFixed(1)}s` : '';
            }
            return '';
          },
          label: function(context: {dataset: {label?: string}, parsed: {y: number}}) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            
            if (label === 'WPM') {
              return `WPM: ${value}`;
            } else if (label === 'Accuracy') {
              return `Precisión: ${value}%`;
            }
            return `${label}: ${value}`;
          },
        },
        displayColors: false,
      }
    },
    animation: {
      duration: 0 // Duración cero para eliminar todas las animaciones
    },
    interaction: {
      mode: 'nearest' as const,
      intersect: false,
    }
  };

  return {
    getChartData,
    chartOptions
  };
}; 