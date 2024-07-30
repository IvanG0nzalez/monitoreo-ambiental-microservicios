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

export const CRITICALITY_LEVELS = {
  BAJO: { color: '#8BC34A', textColor: '#FFFFFF' }, // Verde claro
  NORMAL: { color: '#4CAF50', textColor: '#FFFFFF' }, // Verde medio
  ÓPTIMO: { color: '#CDDC39', textColor: '#FFFFFF' }, // Lima
  ALTO: { color: '#FFEB3B', textColor: '#FFFFFF' }, // Amarillo
  'MUY ALTO': { color: '#FFC107', textColor: '#FFFFFF' }, // Ámbar
  PELIGROSO: { color: '#F44336', textColor: '#FFFFFF' }, // Rojo
};

export const getCriticityLevel = (co2) => {
  if (co2 <= 400) return 'BAJO';
  if (co2 <= 800) return 'NORMAL';
  if (co2 <= 1000) return 'ÓPTIMO';
  if (co2 <= 1500) return 'ALTO';
  if (co2 <= 2000) return 'MUY ALTO';
  return 'PELIGROSO';
};

export const TIMEREFRESH = 10000;