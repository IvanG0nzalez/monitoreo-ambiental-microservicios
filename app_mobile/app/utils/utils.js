import React from 'react';
import { View, Text } from 'react-native';
import { styleSensorScreen } from '../styles/stylesSensorScreen';
export const renderLevelInfo = (level, conditions, description, recommendation) => (
    <View style={styles.levelInfo}>
        <Text style={styles.levelTitle}>{level}</Text>
        <Text style={styles.levelConditions}>{conditions}</Text>
        <Text style={styles.levelDescription}>{description}</Text>
        <Text style={styles.levelRecommendation}>{recommendation}</Text>
    </View>
);
const styles = styleSensorScreen;


export const getAverage = (sensors, type) => {
    const filteredSensors = sensors.filter(sensor => sensor.tipo_medicion === type);
    if (filteredSensors.length === 0) return 0;
    const sum = filteredSensors.reduce((sum, sensor) => sum + sensor.registro_climatico[0]?.valor_medido, 0);
    return sum / filteredSensors.length;
}