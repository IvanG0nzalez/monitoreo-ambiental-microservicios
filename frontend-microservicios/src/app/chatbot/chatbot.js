'use client';
import { api_sensores } from '@/hooks/Api';
import React, { useState, useRef, useEffect } from 'react';
import stringSimilarity from 'string-similarity';

const nivelDeCalidad = (tipo_medicion, valor) => {
  let nivel = "";
  let indicador = "";

  if (tipo_medicion === "CO2") {
    if (valor <= 400) {
      nivel = "Bajo";
      indicador = "El aire está muy limpio";
    } else if (valor > 400 && valor <= 800) {
      nivel = "Normal";
      indicador = "El aire es aceptable";
    } else if (valor > 800 && valor <= 1000) {
      nivel = "Óptimo";
      indicador = "El aire es de buena calidad";
    } else if (valor > 1000 && valor <= 1500) {
      nivel = "Alto";
      indicador = "El aire está ligeramente contaminado";
    } else if (valor > 1500 && valor <= 2000) {
      nivel = "Muy Alto";
      indicador = "El aire está contaminado";
    } else {
      nivel = "Peligroso";
      indicador = "El aire está muy contaminado";
    }
  } else if (tipo_medicion === "Temperatura") {
    if (valor <= 10) {
      nivel = "Muy Frío";
      indicador = "Temperatura muy baja";
    } else if (valor > 10 && valor <= 18) {
      nivel = "Frío";
      indicador = "Temperatura baja";
    } else if (valor > 18 && valor <= 24) {
      nivel = "Óptimo";
      indicador = "Temperatura confortable";
    } else if (valor > 24 && valor <= 30) {
      nivel = "Cálido";
      indicador = "Temperatura alta";
    } else if (valor > 30 && valor <= 35) {
      nivel = "Muy Cálido";
      indicador = "Temperatura muy alta";
    } else {
      nivel = "Peligroso";
      indicador = "Temperatura peligrosa";
    }
  } else if (tipo_medicion === "Humedad") {
    if (valor <= 20) {
      nivel = "Muy Baja";
      indicador = "Humedad muy baja";
    } else if (valor > 20 && valor <= 40) {
      nivel = "Baja";
      indicador = "Humedad baja";
    } else if (valor > 40 && valor <= 60) {
      nivel = "Óptimo";
      indicador = "Humedad ideal";
    } else if (valor > 60 && valor <= 80) {
      nivel = "Alta";
      indicador = "Humedad alta";
    } else if (valor > 80 && valor <= 95) {
      nivel = "Muy Alta";
      indicador = "Humedad muy alta";
    } else {
      nivel = "Peligroso";
      indicador = "Humedad extremadamente alta";
    }
  }

  return { nivel, indicador };
};

const Chatbot = () => {
  const [abierto, setAbierto] = useState(false);
  const [mensaje, setMensaje] = useState([]);
  const [input, setInput] = useState('');
  const [pregunta, setPregunta] = useState(true);
  const autoScroll = useRef(null);

  const patrones = [
    { keys: ['hola', 'Buen dia'], respuesta: 'Hola, ¿en qué puedo ayudarte?' },
    { keys: ['niveles', 'apropiada'], respuesta: 'Según la Agencia de Protección del Medio Ambiente de EE.UU. (USEPA), los niveles aceptables relativos deben oscilar entre:<br />Humedad = 30%-60%<br />Temperatura = 20°C - 25°C<br />Dióxido de Carbono = 300ppm y 400ppm.' },
    { keys: ['temperatura'], respuesta: () => obtenerDato('Temperatura') },
    { keys: ['humedad'], respuesta: () => obtenerDato('Humedad') },
    { keys: ['Dioxido de carbono', 'co2'], respuesta: () => obtenerDato('CO2') },
    { keys: ['Adios', 'Chao', 'Bye'], respuesta: 'Adios, ten un buen día' },
    { keys: ['Valores obtenidos', 'Valores actuales'], respuesta: () => obtenerDatos() },
    { keys: ['ambiente', 'calidad de aire', 'calidad', 'contaminación'], respuesta: () => niveldeCalidadAire('CO2') },
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
  };


  async function obtenerDatos() {
    try {
      const response = await api_sensores.ultimo_registro();
      const datos = response.data.datos;
      console.log("obtener datos");
      const valoresMedidos = datos.map((medicion) => ({
        tipo: medicion.tipo_medicion,
        valor: medicion.registro_climatico[0].valor_medido
      }));
  
      let co2 = null;
      let humedad = null;
      let temperatura = null;
  
      valoresMedidos.forEach(({ tipo, valor }) => {
        if (tipo === 'CO2') {
          co2 = valor;
        } else if (tipo === 'Humedad') {
          humedad = valor;
        } else if (tipo === 'Temperatura') {
          temperatura = valor;
        }
      });
  
      return "Los valores actuales son: CO2: " + co2 + " ppm, Humedad: " + humedad + "%, Temperatura: " + temperatura + "°C.";
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      return 'No se pudieron obtener los datos. Por favor, intenta de nuevo más tarde.';
    }
  };

  async function niveldeCalidadAire(tipoMedicion) {
    try {
      const response = await api_sensores.ultimo_registro();
      const datos = response.data.datos;

      const valormedido = datos
        .filter((medicion) => medicion.tipo_medicion === tipoMedicion)
        .map((medicion) => medicion.registro_climatico[0].valor_medido);

      const { nivel, indicador } = nivelDeCalidad(tipoMedicion, valormedido[0]);

      return `El nivel de contaminación del aire es "${nivel}". <br/> Indica que: ${indicador}.`;

    } catch (error) {
      console.error('Error al obtener los niveles de calidad:', error);
      return 'No se pudieron obtener los niveles de calidad. Por favor, intenta de nuevo más tarde.';
    }
  }
  

  async function obtenerDato(tipoMedicion) {
    try {
      const response = await api_sensores.ultimo_registro();
      const datos = response.data.datos;
      console.log(datos);
      
      const valormedido = datos
        .filter((medicion) => medicion.tipo_medicion === tipoMedicion)
        .map((medicion) => medicion.registro_climatico[0].valor_medido);

      console.log(valormedido[0], "valor medido");

      if (tipoMedicion === 'CO2') {
        return `El CO2 en el aire actual es de ${valormedido[0]} ppm.`;
      } else  if (tipoMedicion === 'Humedad') {
        return `La humedad actual es del ${valormedido[0]}%.`;
      }else{

      return `La temperatura actual es de ${valormedido[0]}°C.`;}

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

  const handleChatbotClick = (e) => {
    e.stopPropagation();
  };

  const handleFAQClick = (faq) => {
    setPregunta(false);
    envioMensaje(faq);
  };

  const toggleChatbot = () => {
    setAbierto(!abierto);
    if (!abierto) {
      setPregunta(true); 
    }
  };

  useEffect(() => {
    if (autoScroll.current) {
      autoScroll.current.scrollTop = autoScroll.current.scrollHeight; // Auto-scroll to bottom
    }
  }, [mensaje]);

  return (
    <div className="chatbotC">
      <div className={`burbujaCB ${abierto ? 'open' : ''}`} onClick={toggleChatbot}>
        {abierto ? (
          <div className="chatbot" onClick={handleChatbotClick}>
            <div className="chat-header">
              <div className="chatbot-title">Chatbot</div>
              <button className="close-button" onClick={toggleChatbot}>✖</button>
            </div>
            <div className="chat-window" ref={autoScroll}>
              {mensaje.map((msg, index) => (
                <div key={index} className={`message ${msg.sender}`} dangerouslySetInnerHTML={{ __html: msg.text }} />
              ))}
              {pregunta && mensaje.length === 0 && (
                <div className="faq-buttons">
                  <button onClick={() => handleFAQClick('¿Cuales son los niveles apropiados?')}>¿Cuales son los niveles aceptables?</button>
                  <button onClick={() => handleFAQClick('¿Cuál es la humedad actual?')}>¿Cuál es la humedad actual?</button>
                  <button onClick={() => handleFAQClick('¿Cuál es la temperatura actual?')}>¿Cuál es la temperatura actual?</button>
                  <button onClick={() => handleFAQClick('¿Cómo está la contaminación del aire?')}>¿Cómo está la contaminación del aire?</button>

                </div>
              )}
            </div>
            <div className="input-container">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button onClick={() => envioMensaje()}>Enviar</button>
            </div>
          </div>
        ) : (
          <div className="chat-icon">💬</div>
        )}
      </div>
      <style jsx>{`
        .chatbotC {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
        }
        .burbujaCB {
          cursor: pointer;
          background: #007bff;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-size: 24px;
          transition: width 0.3s, height 0.3s;
        }
        .burbujaCB.open {
          width: 300px;
          height: 400px;
          border-radius: 10px;
        }
        .chatbot {
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
          max-width: 300px;
          max-height: 400px;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          background: #007bff;
          border-bottom: 1px solid #ccc;
        }
        .chatbot-title {
          color: white;
          font-size: 16px;
        }
        .close-button {
          background: none;
          border: none;
          color: white;
          font-size: 18px;
          cursor: pointer;
        }
        .chat-window {
          flex: 1;
          overflow-y: auto;
          padding: 10px;
          background: #f9f9f9;
        }
        .message {
          padding: 8px 12px;
          margin-bottom: 8px;
          border-radius: 15px;
          max-width: 80%;
          clear: both;
          font-size: 14px;
        }
        .message.user {
          background: #007bff;
          color: white;
          float: right;
        }
        .message.bot {
          background: #e0e0e0;
          color: black;
          float: left;
        }
        .input-container {
          display: flex;
          padding: 10px;
          background: white;
          border-top: 1px solid #ccc;
        }
        .input-container input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        .input-container button {
          padding: 10px 15px;
          margin-left: 10px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .faq-buttons {
          display: flex;
          flex-direction: column;
          margin-bottom: 10px;
        }
        .faq-buttons button {
          background: #e0e0e0;
          border: none;
          border-radius: 5px;
          padding: 10px;
          margin-bottom: 5px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
