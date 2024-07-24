import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const AboutProjectScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Estación Integrada de Monitoreo Ambiental</Text>
      <Text style={styles.subtitle}>Universidad Nacional de Loja (UNL)</Text>
      
      <Text style={styles.sectionTitle}>Problemática</Text>
      <Text style={styles.paragraph}>
        En el aula magna de la Universidad Nacional de Loja, se ha observado que las condiciones ambientales pueden variar considerablemente, afectando la comodidad y el rendimiento tanto de los estudiantes como de los docentes. Las fluctuaciones en temperatura, niveles de humedad y concentración de CO2 no solo pueden causar incomodidad, sino también problemas de salud a largo plazo. La falta de un sistema de monitoreo y alerta eficaz hace difícil gestionar y mejorar estas condiciones de manera proactiva, llevando a un entorno de aprendizaje subóptimo.
      </Text>

      <Text style={styles.sectionTitle}>Objetivos</Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>General:</Text> Diseñar e implementar una estación integrada de monitoreo ambiental en el aula magna de la UNL que permita la recolección, análisis y visualización en tiempo real de datos críticos de calor, temperatura, humedad y niveles de CO2, para asegurar un entorno de aprendizaje saludable y confortable para estudiantes y docentes.
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Específicos:</Text>
      </Text>
      <Text style={styles.listItem}>1. Desarrollar un sistema de sensores integrados que sea capaz de medir con precisión y de manera continua la temperatura, la humedad, los niveles de calor y CO2 dentro del aula magna. Este sistema deberá ser capaz de operar de manera autónoma, con una interfaz de usuario amigable para la configuración y el monitoreo de los parámetros ambientales.</Text>
      <Text style={styles.listItem}>2. Implementar un software de análisis de datos que recopile las mediciones de los sensores en tiempo real, procese la información y genere alertas cuando los valores excedan los umbrales preestablecidos de calidad ambiental. Además, este software facilitará la visualización de datos históricos y en tiempo real a través de una plataforma accesible para la administración de la universidad, docentes y estudiantes, promoviendo así la toma de decisiones informadas para mejorar la calidad del aire y el confort térmico en el aula magna.</Text>

      <Text style={styles.sectionTitle}>Descripción</Text>
      <Text style={styles.paragraph}>
        La "Estación Integrada de Monitoreo Ambiental en el Aula Magna de la Universidad Nacional de Loja (UNL)" es una iniciativa innovadora diseñada para garantizar un entorno interior óptimo y saludable dentro del aula magna. Este proyecto busca implementar una solución tecnológica avanzada que permita la recolección, análisis y visualización en tiempo real de datos críticos relacionados con el ambiente interior, incluyendo calor, temperatura, humedad y niveles de CO2.
      </Text>
      <Text style={styles.paragraph}>
        La estación de monitoreo ambiental estará equipada con una variedad de sensores, entre ellos el DHT11 para la medición de temperatura y humedad, así como el MQ135 para la detección precisa de CO2. Estos sensores estratégicamente ubicados dentro del aula magna proporcionarán lecturas continuas y actualizadas de las condiciones ambientales, permitiendo una vigilancia exhaustiva y proactiva del entorno.
      </Text>

      <Text style={styles.sectionTitle}>Alcance</Text>
      <Text style={styles.paragraph}>
        Con el presente proyecto se pretende lograr la creación de un sistema que permita el monitoreo de datos dentro del aula magna de la UNL con el fin de identificar y abordar de manera eficiente las condiciones ambientales que están presentes en el aula ya que podría afectar de manera negativa el bienestar de los estudiantes y el personal.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
    textAlign: 'justify',
  },
  bold: {
    fontWeight: 'bold',
  },
  listItem: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
    marginLeft: 20,
    textAlign: 'justify',
  },
});

export default AboutProjectScreen;
