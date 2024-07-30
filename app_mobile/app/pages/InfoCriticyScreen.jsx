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
      <Text style={styles.title}>Información de Calidad del Aire (CO2)</Text>

      {renderLevelInfo('BAJO',
        'CO2 ≤ 400ppm',
        'Aire muy limpio. Niveles típicos de espacios exteriores bien ventilados.',
        'Mantener estas condiciones excelentes. Ideal para espacios ocupados.')}

      {renderLevelInfo('NORMAL',
        '400ppm < CO2 ≤ 800ppm',
        'Aire aceptable. Calidad de aire interior típica en espacios bien ventilados.',
        'Continuar con las prácticas actuales de ventilación. Monitorear regularmente.')}

      {renderLevelInfo('ÓPTIMO',
        '800ppm < CO2 ≤ 1000ppm',
        'Aire de buena calidad. Aún dentro de rangos aceptables para la mayoría de las personas.',
        'Considerar aumentar ligeramente la ventilación si es posible. Mantener un monitoreo constante.')}

      {renderLevelInfo('ALTO',
        '1000ppm < CO2 ≤ 1500ppm',
        'Aire ligeramente contaminado. Puede causar somnolencia y afectar la concentración.',
        'Mejorar la ventilación. Reducir la ocupación si es posible. Identificar y controlar fuentes de CO2.')}

      {renderLevelInfo('MUY ALTO',
        '1500ppm < CO2 ≤ 2000ppm',
        'Aire contaminado. Puede causar dolores de cabeza, fatiga y disminución del rendimiento.',
        'Aumentar significativamente la ventilación. Considerar evacuar si no se puede mejorar rápidamente.')}

      {renderLevelInfo('PELIGROSO',
        'CO2 > 2000ppm',
        'Aire muy contaminado. Riesgo de problemas de salud más serios con exposición prolongada.',
        'Evacuar el área inmediatamente. Ventilar exhaustivamente antes de reocupar. Investigar las causas.')}

      <TouchableOpacity style={styles.moreInfoContainer} onPress={handleLinkPress}>
        <Text style={styles.moreInfoTitle}>Más Información</Text>
        <Text style={styles.moreInfoText}>
          Para obtener información adicional sobre los niveles de CO2 y sus efectos en la salud, puede visitar el siguiente enlace:
        </Text>
        <Text style={styles.linkText}>Toque aquí para visitar el sitio</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = stylesInfoCriticyScreen;