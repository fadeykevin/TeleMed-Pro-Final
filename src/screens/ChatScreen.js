import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from 'react-native';

const getDoctorResponse = (userMessage) => {
  const message = userMessage.toLowerCase();
  
  if (message.match(/hola|buenos dias|buenas tardes|buenas noches|hey|hi/i)) {
    return 'Hola! Soy el Dr. IA de TeleMed Pro. Como te sientes hoy? En que puedo ayudarte?';
  }
  
  if (message.match(/bien|mejor|excelente|genial/i)) {
    return 'Que bueno escuchar eso! Me alegra que te sientas mejor. Hay algo mas en lo que pueda ayudarte?';
  }
  
  if (message.match(/mal|dolor|enferm|sintoma|molest|fiebre/i)) {
    return 'Lamento escuchar que no te sientes bien. Podrias describirme con mas detalle que sintomas tienes?';
  }
  
  if (message.match(/cabeza/i)) {
    return 'Para el dolor de cabeza te recomiendo: Paracetamol 500mg cada 8 horas, Beber mucha agua, Descansar en un lugar oscuro. El dolor es intenso o moderado?';
  }
  
  if (message.match(/estomago|barriga|nausea|vomito/i)) {
    return 'Para las molestias estomacales: Toma mucha agua, Dieta blanda (arroz, platano), Omeprazol 20mg en ayunas. Tienes vomitos o solo nauseas?';
  }
  
  if (message.match(/gripe|tos|resfr|garganta/i)) {
    return 'Para sintomas de gripe: Paracetamol para fiebre, Te con miel para la tos, Mucha hidratacion, Reposo. Tienes fiebre alta?';
  }
  
  if (message.match(/fiebre/i)) {
    return 'Para la fiebre: Toma tu temperatura cada 4 horas, Paracetamol 500mg si supera 38C, Panos de agua tibia. Que temperatura tienes?';
  }
  
  if (message.match(/gracias|thank|thx|vale/i)) {
    return 'De nada! Estoy aqui para ayudarte. No dudes en consultarme si necesitas algo mas. Cuidate!';
  }
  
  if (message.match(/adios|chao|bye|hasta luego/i)) {
    return 'Hasta pronto! Que te mejores. Recuerda que estoy disponible 24/7 para ayudarte. Cuidate!';
  }
  
  return 'Entiendo tu consulta. Como asistente medico virtual, te recomiendo: 1. Describir tus sintomas con detalle, 2. Agendar una cita si persisten, 3. Consultar la seccion de Recetas. Hay algo especifico que te preocupe?';
};

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hola, como te sientes hoy?',
      sender: 'doctor',
      time: '10:30',
      read: true
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      read: true
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputText;
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const doctorResponse = {
        id: Date.now() + 1,
        text: getDoctorResponse(messageToSend),
        sender: 'doctor',
        time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        read: true
      };
      setIsTyping(false);
      setMessages(prev => [...prev, doctorResponse]);
    }, 1500);
  };

  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.messageContainer, isUser ? styles.userMessage : styles.doctorMessage]}>
        <View style={[styles.messageBubble, isUser && styles.userBubble]}>
          {!isUser && <Text style={styles.senderName}>Doctor</Text>}
          <Text style={[styles.messageText, isUser && styles.userMessageText]}>{item.text}</Text>
          <Text style={[styles.messageTime, isUser && styles.userMessageTime]}>{item.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat Medico</Text>
        <Text style={styles.headerSubtitle}>Conectado</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id.toString()}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
      />

      {isTyping && (
        <View style={styles.typingContainer}>
          <View style={styles.typingBubble}>
            <ActivityIndicator size="small" color="#666" />
            <Text style={styles.typingText}>Doctor esta escribiendo...</Text>
          </View>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe aqui..."
          placeholderTextColor="#999"
          value={inputText}
          onChangeText={setInputText}
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, inputText.trim() === '' && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={inputText.trim() === ''}
        >
          <Text style={styles.sendIcon}>ENVIAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5DDD5'
  },
  header: {
    backgroundColor: '#0088CC',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff'
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#B3E5FC',
    marginTop: 2
  },
  messagesList: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    paddingBottom: 150
  },
  messageContainer: {
    marginBottom: 12,
    maxWidth: '80%'
  },
  doctorMessage: {
    alignSelf: 'flex-start'
  },
  userMessage: {
    alignSelf: 'flex-end'
  },
  messageBubble: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    elevation: 2
  },
  userBubble: {
    backgroundColor: '#0088CC'
  },
  senderName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0088CC',
    marginBottom: 4
  },
  messageText: {
    fontSize: 15,
    color: '#262626',
    lineHeight: 22
  },
  userMessageText: {
    color: '#fff'
  },
  messageTime: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    alignSelf: 'flex-end'
  },
  userMessageTime: {
    color: '#B3E5FC'
  },
  typingContainer: {
    paddingHorizontal: 10,
    paddingBottom: 5,
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0
  },
  typingBubble: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    maxWidth: '80%'
  },
  typingText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic'
  },
  inputContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 8
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
    height: 48
  },
  sendButton: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 25,
    backgroundColor: '#0088CC',
    justifyContent: 'center',
    alignItems: 'center',
    height: 48
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc'
  },
  sendIcon: {
    fontSize: 13,
    color: '#fff',
    fontWeight: 'bold'
  }
});
