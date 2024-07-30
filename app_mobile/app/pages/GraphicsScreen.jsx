import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Dimensions, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { chartConfigCO2, chartConfigHumidity, chartConfigTemperature } from '../constants/constants';
import { useQueryRegistryDataDay } from '../hooks/registros';

const screenWidth = Dimensions.get('window').width;

const GraphicsScreen = () => {
  const { data: registryDay, isLoading, error, refetch } = useQueryRegistryDataDay();
  const [chartData, setChartData] = useState({
    humidity: { labels: [], data: [] },
    temperature: { labels: [], data: [] },
    co2: { labels: [], data: [] },
  });

  const processData = useMemo(() => (data, type) => {
    const processed = { labels: [], data: [] };
    const filteredData = data.filter(item => item.tipo_medicion === type);
    filteredData.forEach((item, index) => {
      processed.data.push(parseFloat(item.valor_medido));
      if (index % 15 === 0) {
        processed.labels.push(item.hora.split(':').slice(0, 2).join(':'));
      } else {
        processed.labels.push('');
      }
    });
    return processed;
  }, []);

  useEffect(() => {
    if (registryDay && registryDay.datos) {
      setChartData({
        humidity: processData(registryDay.datos, 'Humedad'),
        temperature: processData(registryDay.datos, 'Temperatura'),
        co2: processData(registryDay.datos, 'CO2'),
      });
    }
  }, [registryDay, processData]);

  const renderChart = (title, data, config) => {
    if (data.labels.length === 0 || data.data.length === 0) {
      return null;
    }

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>{title}</Text>
        <LineChart
          data={{
            labels: data.labels,
            datasets: [{ data: data.data }],
          }}
          width={screenWidth - 40}
          height={320}
          chartConfig={config}
          bezier
          style={styles.chart}
          xLabelsOffset={-10}
          formatXLabel={(value) => value}
          verticalLabelRotation={90}
        />
      </View>
    );
  };

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
        <Text>Error: {error}</Text>
        <Text onPress={refetch} style={styles.retryText}>Toca para reintentar</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    >
      <Text style={styles.title}>Gráficas del día</Text>
      {renderChart('Humedad', chartData.humidity, chartConfigHumidity)}
      {renderChart('Temperatura', chartData.temperature, chartConfigTemperature)}
      {renderChart('CO2', chartData.co2, chartConfigCO2)}
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  chartContainer: {
    marginBottom: 30,
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryText: {
    color: 'blue',
    marginTop: 10,
  },
});

export default GraphicsScreen;