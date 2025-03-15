'use client'

import { useCallback } from 'react';
import { WpmDataPoint, AccuracyDataPoint } from '../../types';
import { getChartData as getFormattedChartData } from './getChartData';
import { ChartOptions } from 'chart.js';

interface ChartProps {
  wpmHistory: WpmDataPoint[];
  accuracyHistory: AccuracyDataPoint[];
  safeStyles: {
    backgroundColor: string;
    color: string;
  };
  isHydrated: boolean;
  isResultsChart?: boolean; // Nuevo parámetro para identificar si es el gráfico de resultados
}

export const useChartConfig = ({
  wpmHistory,
  accuracyHistory,
  safeStyles,
  isHydrated,
  isResultsChart = false // Por defecto es falso
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

  // Opciones de la gráfica mejoradas para un aspecto más moderno
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    // Añadir animación para la gráfica de resultados
    animation: {
      duration: isResultsChart ? 1200 : 800, // Animación más larga para resultados
      easing: 'easeOutQuad'
    },
    
    // Configuración de escalas
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: getYAxisMax(),
        title: {
          display: true,
          text: 'WPM',
          color: `${safeStyles.color}CC`,
          font: {
            family: 'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
            size: 12,
            weight: 'bold'
          },
        },
        grid: {
          color: `${safeStyles.color}15`,
          lineWidth: 0.5,
          // Mejoramos la grilla para resultados sin usar propiedades inválidas
          display: true,
        },
        ticks: {
          color: `${safeStyles.color}AA`,
          font: {
            family: 'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
            weight: 'bold',
            size: 10
          },
          stepSize: getYAxisStepSize(),
          // Mostrar más información en las etiquetas para la gráfica de resultados
          callback: function(value) {
            return value.toString();
          }
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        beginAtZero: true,
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Precisión %',
          color: `${safeStyles.color}CC`,
          font: {
            family: 'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
            size: 12,
            weight: 'bold'
          }
        },
        grid: {
          drawOnChartArea: false,
          display: true,
        },
        ticks: {
          color: `${safeStyles.color}AA`,
          font: {
            family: 'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
            weight: 'bold',
            size: 10
          },
          callback: function(value: string | number) {
            return value + '%';
          }
        }
      },
      x: {
        grid: {
          color: `${safeStyles.color}10`,
          lineWidth: 0.5,
          display: isResultsChart // Mostrar cuadrícula X sólo en resultados finales
        },
        ticks: {
          display: isResultsChart, // Mostrar etiquetas de tiempo solo en resultados finales
          maxRotation: 0,
          font: {
            family: 'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
            weight: 'bold',
            size: 9
          },
          color: `${safeStyles.color}80`,
          autoSkip: true,
          maxTicksLimit: 6,
          callback: function(value, index, ticks) {
            // Mostrar solo algunos valores de segundos para mantener clara la visualización
            if (index === 0 || index === ticks.length - 1 || index % Math.ceil(ticks.length / 6) === 0) {
              return this.getLabelForValue(Number(value)).replace('s', '') + 's';
            }
            return '';
          }
        }
      }
    },
    
    // Configuración de plugins
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: {
          color: `${safeStyles.color}DD`,
          font: {
            family: 'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
            size: 11,
            weight: 'bold'
          },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: isResultsChart ? 15 : 10, // Más espaciado para resultados
          boxWidth: isResultsChart ? 10 : 8, // Íconos más grandes para resultados
        }
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        backgroundColor: `${safeStyles.backgroundColor}EE`,
        titleColor: safeStyles.color,
        bodyColor: safeStyles.color,
        borderColor: `${safeStyles.color}40`,
        borderWidth: 1,
        padding: isResultsChart ? 12 : 8,
        cornerRadius: 6,
        titleFont: {
          family: 'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
          weight: 'bold',
          size: isResultsChart ? 13 : 11,
        },
        bodyFont: {
          family: 'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
          weight: 'normal',
          size: isResultsChart ? 12 : 10,
        },
        callbacks: {
          title: function(tooltipItems) {
            if (tooltipItems.length > 0) {
              const dataIndex = tooltipItems[0].dataIndex;
              const validWpmEntry = wpmHistory[dataIndex];
              if (validWpmEntry) {
                // Formato mejorado para el título del tooltip
                return isResultsChart 
                  ? `Tiempo: ${validWpmEntry.time.toFixed(1)} segundos`
                  : `${validWpmEntry.time.toFixed(1)}s`;
              }
            }
            return '';
          },
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            
            // Formato mejorado para las etiquetas
            if (label === 'WPM') {
              return `${label}: ${Math.round(value)} palabras/min`;
            } else if (label === 'Accuracy') {
              return `Precisión: ${Math.round(value)}%`;
            }
            return `${label}: ${value}`;
          },
          // Footer opcional para resultados
          footer: function(tooltipItems) {
            if (!isResultsChart || tooltipItems.length <= 0) return '';
            
            // Calcular progreso como porcentaje del tiempo total
            const dataIndex = tooltipItems[0].dataIndex;
            const totalPoints = wpmHistory.length;
            const progressPercent = Math.round((dataIndex / (totalPoints - 1)) * 100);
            
            return `Progreso: ${progressPercent}% completado`;
          }
        }
      }
    },
    
    // Configuración de elementos
    elements: {
      point: {
        radius: 0, // Puntos nunca visibles por defecto, incluso en la gráfica de resultados
        hoverRadius: isResultsChart ? 6 : 4, // Puntos más grandes al hacer hover en resultados
        hitRadius: isResultsChart ? 10 : 5, // Área de detección de click/hover más grande en resultados
        // Efecto de brillo al hacer hover
        hoverBackgroundColor: 'white',
        hoverBorderWidth: 2
      },
      line: {
        tension: 0.4, // Líneas más suaves
        borderWidth: isResultsChart ? 3.5 : 3, // Líneas más gruesas para resultados
        fill: true, // Rellenar el área bajo la línea
        capBezierPoints: true // Mejorar la visualización de las curvas
      }
    },
    
    // Interacción
    interaction: {
      mode: 'nearest',
      intersect: false,
      axis: 'x',
      includeInvisible: true // Cambiado para mejorar la detección de puntos incluso cuando no son visibles
    }
  };

  return {
    getChartData,
    chartOptions
  };
}; 