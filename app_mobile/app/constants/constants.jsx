export const CRITICALITY_LEVELS = {
  ÓPTIMO: { color: '#4CAF50', textColor: '#FFFFFF' },
  BUENO: { color: '#8BC34A', textColor: '#FFFFFF' },
  MODERADO: { color: '#FFC107', textColor: '#FFFFFF' },
  ALTO: { color: '#FF9800', textColor: '#FFFFFF' },
  CRÍTICO: { color: '#FE0000', textColor: '#FFFFFF' },
};

export const UBICACION_AULA_MAGNA = {
  latitude: -4.0304380864135645,
  longitude: -79.19930051117329,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export const URL_INFO = 'https://dph.illinois.gov/topics-services/environmental-health-protection/toxicology/indoor-air-quality-healthy-homes/idph-guidelines-indoor-air-quality.html';


export const chartConfigHumidity = {
  backgroundGradientFrom: '#e0f7fa',
  backgroundGradientTo: '#b2ebf2',
  color: (opacity = 1) => `rgba(0, 150, 136, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
};

export const chartConfigTemperature = {
  backgroundGradientFrom: '#FFE0B2',
  backgroundGradientTo: '#FFCC80',
  color: (opacity = 1) => `rgba(255, 87, 34, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
};

export const chartConfigCO2 = {
  backgroundGradientFrom: '#FFF9C4',
  backgroundGradientTo: '#FFF59D',
  color: (opacity = 1) => `rgba(255, 193, 7, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
};

export const getCriticityLevel = (co2, temp, hum) => {
  if (hum < 5 || hum > 90 || co2 > 1500 || temp < 14 || temp > 32) return 'CRÍTICO';
  if (hum < 10 || hum > 80 || co2 > 1200 || temp < 16 || temp > 30) return 'ALTO';
  if (hum < 20 || hum > 70 || co2 > 1000 || temp < 18 || temp > 28) return 'MODERADO';
  if (hum < 30 || hum > 60 || co2 > 800 || temp < 20 || temp > 26) return 'BUENO';
  return 'ÓPTIMO';
};

export const TIMEREFRESH = 10000;