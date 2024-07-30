// utils/Chatbot.js
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import stringSimilarity from 'string-similarity';
import { useQuerySensorsLastData } from '../hooks/sensores';


const Chatbot = () => {
  const [mensaje, setMensaje] = useState([]);
  const [input, setInput] = useState('');
  const autoScroll = useRef(null);

  const patrones = [
    { keys: ['hola', 'Buen dia'], respuesta: 'Hola, ¿en qué puedo ayudarte?' },
    { keys: ['niveles de calidad', 'calidad apropiada'], respuesta: 'Según la Agencia de Protección del Medio Ambiente de EE.UU. (USEPA), los niveles aceptables relativos deben oscilar entre:<br />Humedad = 30%-60%<br />Temperatura = 20°C - 25°C<br />Dióxido de Carbono = 300ppm y 400ppm.' },
    { keys: ['temperatura'], respuesta: obtenerDato('Temperatura') },
    { keys: ['humedad'], respuesta: obtenerDato('Humedad') },
    { keys: ['CO2', 'Dioxido de carbono'], respuesta: obtenerDato('CO2') },
    { keys: ['Adios', 'Chao', 'Bye'], respuesta: 'Adios, ten un buen día' },
    { keys: ['Valores obtenidos', 'Valores actuales'], respuesta: obtenerDatos() },
  ];

  async function obtenerTemperaturas() {
    //try {
      //const response = await fetch('/api/temperatura');
      const response = await api_sensores.ultimo_registro(); 
      const datos = response.data.datos;
      const data = 25
      return `La temperatura actual es de ${data}°C.`;
    //} catch (error) {
      //console.error('Error al obtener la temperatura:', error);
      //return 'No se pudo obtener la temperatura actual. Por favor, intenta de nuevo más tarde.';
    //}
  }


  async function obtenerDatos() {
    try {
      const { data, error } = useQuerySensorsLastData();
  
      // Verifica si hay un error o si data es null o undefined
      if (error || !data || !data.datos) {
        throw new Error('No se pudieron obtener los datos del backend.');
      }
  
      // Asegúrate de que datos sea siempre un array
      const datos = Array.isArray(data.datos) ? data.datos : [];
  
      // Asignar valores por defecto si no se tienen datos válidos
      let co2 = 400; // ppm
      let humedad = 40; // %
      let temperatura = 21; // °C
  
      if (datos.length > 0) {
        datos.forEach((medicion) => {
          if (medicion && medicion.registro_climatico && medicion.registro_climatico[0]) {
            const tipo = medicion.tipo_medicion;
            const valor = medicion.registro_climatico[0].valor_medido;
  
            if (tipo === 'CO2' && valor != null) {
              co2 = valor;
            } else if (tipo === 'Humedad' && valor != null) {
              humedad = valor;
            } else if (tipo === 'Temperatura' && valor != null) {
              temperatura = valor;
            }
          }
        });
      }
  
      return `Los valores actuales son: CO2: ${co2} ppm, Humedad: ${humedad}%, Temperatura: ${temperatura}°C.`;
    } catch (error) {
      console.error('Error al obtener los datos:', error.message || error);
      return 'Los valores actuales son: CO2: 400 ppm, Humedad: 40%, Temperatura: 21°C.';
    }
  }
  
  
  

  async function obtenerDato(tipoMedicion) {
    try {
      const { data: datos, error } = useQuerySensorsLastData();
      
      
      const valormedido = datos
        .filter((medicion) => medicion.tipo_medicion === tipoMedicion)
        .map((medicion) => medicion.registro_climatico[0].valor_medido);
      
      if (tipoMedicion === 'CO2') {
        return `El CO2 en el aire actual es de ${valormedido} ppm.`;
      } else  if (tipoMedicion === 'Humedad') {
        return `La humedad actual es del ${valormedido}%.`;
      }else{

      return `La temperatura actual es de ${valormedido}°C.`;}

    } catch (error) {
    }
  }

  async function obtenerDato(tipoMedicion) {
    try {
 
      const { data: datos, error } = useQuerySensorsLastData();

      
      const valormedido = datos
        .filter((medicion) => medicion.tipo_medicion === tipoMedicion)
        .map((medicion) => medicion.registro_climatico[0].valor_medido);
      
      if (tipoMedicion === 'CO2') {
        return `El CO2 en el aire actual es de ${valormedido} ppm.`;
      } else  if (tipoMedicion === 'Humedad') {
        return `La humedad actual es del ${valormedido}%.`;
      }else{

      return `La temperatura actual es de ${valormedido}°C.`;}

    } catch (error) {
    }
  }


  const envioMensaje = (message = input) => {
    if (message.trim() !== '') {
      const newMensaje = [...mensaje, { text: message, sender: 'user' }];
      setMensaje(newMensaje);
      procesamientoMensaje(message, newMensaje);
      setInput('');
    }
  };

  const procesamientoMensaje = async (message, newMensaje) => {
    const mensajeFormato = message.trim().toLowerCase();
    let respuesta = '';

    const mejorRespuesta = patrones.reduce((best, pattern) => {
      const highestSimilarity = pattern.keys.reduce((max, key) => {
        const similarity = stringSimilarity.compareTwoStrings(mensajeFormato, key);
        return similarity > max ? similarity : max;
      }, 0);

      return highestSimilarity > best.similarity ? { similarity: highestSimilarity, respuesta: pattern.respuesta } : best;
    }, { similarity: 0, respuesta: '' });

    if (typeof mejorRespuesta.respuesta === 'function') {
      respuesta = await mejorRespuesta.respuesta();
    } else {
      respuesta = mejorRespuesta.respuesta || 'Lo siento, no entiendo tu pregunta. Por favor, pregunta sobre la temperatura, humedad, calidad del aire o estado del sistema.';
    }

    setTimeout(() => {
      setMensaje([...newMensaje, { text: respuesta, sender: 'bot' }]);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      envioMensaje();
    }
  };

  useEffect(() => {
    if (autoScroll.current) {
      autoScroll.current.scrollTop = autoScroll.current.scrollHeight; // Auto-scroll to bottom
    }
  }, [mensaje]);

  return (
    <View style={styles.container}>
      <ScrollView ref={autoScroll} style={styles.messageContainer}>
        {mensaje.map((msg, index) => (
          <View key={index} style={msg.sender === 'user' ? styles.userMessage : styles.botMessage}>
            <Text>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={envioMensaje}
          placeholder="Escribe tu mensaje aquí..."
        />
        <Button title="Enviar" onPress={() => envioMensaje()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  messageContainer: {
    flex: 1,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
});

export default Chatbot;
