import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SensorComponent } from '../components/SensorComponent';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { CRITICALITY_LEVELS, UBICACION_AULA_MAGNA, getCriticityLevel } from '../constants/constants';
import { styleSensorScreen } from '../styles/stylesSensorScreen';
import { useQuerySensorsLastData } from '../hooks/sensores';
import { renderLevelInfo } from '../utils/utils';
import { getAverage } from '../utils/utils';

export function SensorScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [lastCriticityLevel, setLastCriticityLevel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const { data: sensors, error } = useQuerySensorsLastData();

  const formatValue = (value) => {
    return Number(value.toFixed(1));
  };

  const handleInfoPress = () => {
    navigation.navigate('Criticidad del Aire');
  };

  useEffect(() => {
    if (sensors) {
      setIsLoading(false);
      const co2 = getAverage(sensors, 'CO2');
      const temp = getAverage(sensors, 'Temperatura');
      const hum = getAverage(sensors, 'Humedad');

      const criticityLevel = getCriticityLevel(co2, temp, hum);

      if (criticityLevel !== lastCriticityLevel) {
        setLastCriticityLevel(criticityLevel);

        if (criticityLevel === 'CRÍTICO') {
          setModalVisible(true);
        } else {
          console.log(`Notificación: El nivel de calidad del aire ha cambiado a ${criticityLevel}.`);
        }
      }
    }
  }, [sensors]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const criticityLevel = lastCriticityLevel ? lastCriticityLevel : 'Desconocido';
  const { color, textColor } = CRITICALITY_LEVELS[criticityLevel] || { color: '#FFFFFF', textColor: '#000000' };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Monitoreo del Aula Magna</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sensorScroll}>
        <View style={styles.sensorContainer}>
          {sensors.map((sensor, index) => {
            if (sensor.registro_climatico && sensor.registro_climatico.length > 0) {
              const value = formatValue(sensor.registro_climatico[0].valor_medido);
              let unit = '';
              let lineColor = '';

              switch (sensor.tipo_medicion) {
                case 'Temperatura':
                  unit = '°C';
                  lineColor = '#FE9100';
                  break;
                case 'Humedad':
                  unit = '%';
                  lineColor = '#3DE7CD';
                  break;
                case 'CO2':
                  unit = 'ppm';
                  lineColor = '#FEEA00';
                  break;
                default:
                  unit = '';
                  lineColor = '#000000';
              }

              return (
                <SensorComponent
                  key={sensor.external_id}
                  value={`${value}${unit}`}
                  type={sensor.tipo_medicion.toUpperCase()}
                  alias={sensor.alias}
                  lineColor={lineColor}
                />
              );
            }
            return null;
          })}
          <Ionicons name="chevron-forward" size={24} color="black" style={styles.arrow} />
        </View>
      </ScrollView>

      <ScrollView style={styles.contentScroll} contentContainerStyle={styles.contentContainer}>
        <View style={[styles.criticalityContainer, { backgroundColor: color }]}>
          <Text style={[styles.criticalityText, { color: textColor }]}>calidad del aire</Text>
          <Text style={[styles.criticalityStatus, { color: textColor }]}>{criticityLevel}</Text>
          <TouchableOpacity style={styles.infoButton} onPress={handleInfoPress}>
            <Ionicons name="information-circle-outline" size={24} color={textColor} />
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoBoxTitle}>Ubicación del Aula Magna: </Text>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={UBICACION_AULA_MAGNA}
            >
              <Marker
                coordinate={{
                  latitude: UBICACION_AULA_MAGNA.latitude,
                  longitude: UBICACION_AULA_MAGNA.longitude
                }}
                title="Aula Magna"
              />
            </MapView>
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>¡Alerta Crítica!</Text>
            {renderLevelInfo(
              'Condiciones peligrosas para la salud y el bienestar.',
              'Evacuar inmediatamente y ventilar el área. Contactar a profesionales.')}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.textStyle}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = styleSensorScreen;

export default SensorScreen;