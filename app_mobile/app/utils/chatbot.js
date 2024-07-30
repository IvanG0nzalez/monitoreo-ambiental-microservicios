// utils/Chatbot.js
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import stringSimilarity from 'string-similarity';

const Chatbot = () => {
  const [mensaje, setMensaje] = useState([]);
  const [input, setInput] = useState('');
  const autoScroll = useRef(null);

  const patrones = [
    { keys: ['hola'], respuesta: 'Hola, ¿en qué puedo ayudarte?' },
    { keys: ['niveles de calidad', 'calidad apropiada'], respuesta: 'Según la Agencia de Protección del Medio Ambiente de EE.UU. (USEPA), los niveles aceptables relativos deben oscilar entre:<br />Humedad = 30%-60%<br />Temperatura = 20°C - 25°C<br />Dióxido de Carbono = 300ppm y 400ppm.' },
    { keys: ['temperatura'], respuesta: obtenerTemperatura },
    { keys: ['humedad'], respuesta: 'La humedad actual es del 60%.' },
    { keys: ['CO2', 'Dioxido de Carbono', 'carbono'], respuesta: 'El CO2, es de 800ppm' },
    { keys: ['calidad actual'], respuesta: 'La calidad del aire es buena.' },
    { keys: ['cambiar ip de sensor'], respuesta: 'Para actualizar la información de los sensores, dirígete al área de Sensores dentro de Control, que puedes encontrar en el menú lateral.' },
    { keys: ['administrar cuentas'], respuesta: 'Para administrar la información de las cuentas, dirígete al área de Cuentas dentro de Control, que puedes encontrar en el menú lateral.' },
    { keys: ['administrar mi cuenta'], respuesta: 'Para administrar la información de tu cuenta, dirígete al área superior sobre la imagen de tu usuario y selecciona el Perfil.' },
    { keys: ['cerrar sesion', 'salir', 'desloguearse'], respuesta: 'Para cerrar sesión, dirígete al área superior sobre la imagen de tu usuario y selecciona "Cerrar Sesión".' },
    { keys: ['estado del sistema'], respuesta: 'El sistema de monitoreo ambiental está funcionando correctamente.' },
  ];

  async function obtenerTemperatura() {
    //try {
      //const response = await fetch('/api/temperatura'); 
      const data = 25
      return `La temperatura actual es de ${data}°C.`;
    //} catch (error) {
      //console.error('Error al obtener la temperatura:', error);
      //return 'No se pudo obtener la temperatura actual. Por favor, intenta de nuevo más tarde.';
    //}
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
