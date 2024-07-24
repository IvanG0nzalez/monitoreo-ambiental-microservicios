import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

export const SensorComponent = ({ value, type, alias, lineColor }) => {
  return (
    <View style={styles.sensorComponentContainer}>
      <View style={styles.valueContainer}>
        <Text style={styles.valueText}>{value}</Text>
      </View>
      <Text style={styles.aliasText}>{alias}</Text>
      <Text style={styles.typeText}>{type}</Text>
      <View style={[styles.bottomLine, { backgroundColor: lineColor }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  sensorComponentContainer: {
    width: (windowWidth - 60) / 3,
    height: 100,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    alignItems: 'center',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  valueContainer: {
    backgroundColor: '#f0f4f7',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  valueText: {
    color: '#007bff',
    fontSize: 12,
    fontWeight: 'bold'
  },
  aliasText: {
    color: '#6c757d',
    fontSize: 12,
    marginTop: 5,
  },
  typeText: {
    color: '#000',
    fontSize: 9,
  },
  bottomLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 5,
  },
});

export default SensorComponent;
