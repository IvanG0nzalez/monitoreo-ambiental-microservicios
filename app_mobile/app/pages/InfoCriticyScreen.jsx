import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { CRITICALITY_LEVELS, URL_INFO } from '../constants/constants';
import { stylesInfoCriticyScreen } from '../styles/stylesInfoCriticyScreen';

export function InfoCriticyScreen({ navigation }) {
  const renderLevelInfo = (level, rangeText, descriptionText, recommendationText) => (
    <View style={styles.levelOuterContainer}>
      <View style={[styles.levelContainer, { backgroundColor: CRITICALITY_LEVELS[level].color }]}>
        <Text style={[styles.levelText, { color: CRITICALITY_LEVELS[level].textColor }]}>{level}</Text>
      </View>
      <View style={[styles.infoContainer, { backgroundColor: CRITICALITY_LEVELS[level].color }]}>
        <Text style={[styles.infoText, { color: CRITICALITY_LEVELS[level].textColor }]}>
          Rango: {rangeText}{'\n\n'}
          Descripción: {descriptionText}{'\n\n'}
          Recomendación: {recommendationText}
        </Text>
      </View>
    </View>
  );

  const handleLinkPress = async () => {
    const url = URL_INFO;
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log("Don't know how to open this URL: " + url);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Información</Text>
      
      {renderLevelInfo('CRÍTICO', 
        'CO2 > 1500ppm, Temp < 14°C o > 32°C, Hum < 5% o > 90%',
        'Condiciones peligrosas para la salud y el bienestar.',
        'Evacuar inmediatamente y ventilar el área. Contactar a profesionales.')}
      
      {renderLevelInfo('ALTO', 
        'CO2 > 1200ppm, Temp < 16°C o > 30°C, Hum < 10% o > 80%',
        'Condiciones insalubres que requieren atención inmediata.',
        'Mejorar ventilación urgentemente. Reducir la ocupación si es posible.')}
      
      {renderLevelInfo('MODERADO', 
        'CO2 > 1000ppm, Temp < 18°C o > 28°C, Hum < 20% o > 70%',
        'Calidad de aire subóptima que puede causar incomodidad.',
        'Considerar mejorar la ventilación. Monitorear de cerca los niveles.')}
      
      {renderLevelInfo('BUENO', 
        'CO2 > 800ppm, Temp < 20°C o > 26°C, Hum < 30% o > 60%',
        'Condiciones aceptables para la mayoría de las personas.',
        'Mantener la ventilación actual. Realizar chequeos regulares.')}
      
      {renderLevelInfo('ÓPTIMO', 
        'CO2 ≤ 800ppm, Temp 20-26°C, Hum 30-60%',
        'Condiciones ideales para el confort y la salud.',
        'Mantener estas condiciones. Usar como referencia para otras áreas.')}

      <TouchableOpacity style={styles.moreInfoContainer} onPress={handleLinkPress}>
        <Text style={styles.moreInfoTitle}>Más Información</Text>
        <Text style={styles.moreInfoText}>
          Para obtener información adicional sobre los niveles de calidad del aire puede visitar el siguiente enlace, dando click al contenedor o al enlace aqui abajo:
        </Text>
        <Text style={styles.linkText}>Toque aquí para visitar el sitio</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = stylesInfoCriticyScreen;