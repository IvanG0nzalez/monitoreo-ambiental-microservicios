import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

// Componente de pantalla de carga de la aplicación se puede personalizar con un icono y una versión

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../static/icono.jpg')} style={styles.icon} />
      <Text style={styles.version}>Versión 1.0.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  icon: {
    width: 100,
    height: 100,
  },
  version: {
    marginTop: 20,
    fontSize: 18,
    color: '#333',
  },
});

export default SplashScreen;
