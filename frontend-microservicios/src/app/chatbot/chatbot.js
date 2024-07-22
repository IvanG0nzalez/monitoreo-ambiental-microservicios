'use client';
import React, { useState, useRef, useEffect } from 'react';
import stringSimilarity from 'string-similarity';

const Chatbot = () => {
  const [abierto, setAbierto] = useState(false);
  const [mensaje, setMensaje] = useState([]);
  const [input, setInput] = useState('');
  const [pregunta, setPregunta] = useState(true);
  const autoScroll = useRef(null);

  const patrones = [
    { keys: ['hola'], respuesta: 'Hola, ¿en qué puedo ayudarte?' },
    { keys: ['niveles de calidad', 'calidad apropiada'], respuesta: 'Según la Agencia de Protección del Medio Ambiente de EE.UU. (USEPA), los niveles aceptables relativos deben oscilar entre:<br />Humedad = 30%-60%<br />Temperatura = 20°C - 25°C<br />Dióxido de Carbono = 300ppm y 400ppm.' },
    { keys: ['temperatura'], respuesta: obtenerTemperatura },
    { keys: ['humedad'], respuesta: 'La humedad actual es del 60%.' },
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
                  <button onClick={() => handleFAQClick('¿Cuales son los niveles aceptables?')}>¿Cuales son los niveles aceptables?</button>
                  <button onClick={() => handleFAQClick('¿Cuál es la humedad actual?')}>¿Cuál es la humedad actual?</button>
                  <button onClick={() => handleFAQClick('¿Cuál es la temperatura actual?')}>¿Cuál es la temperatura actual?</button>
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
