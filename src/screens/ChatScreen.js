import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

// Respuestas inteligentes del doctor IA
const getDoctorResponse = (userMessage) => {
  const message = userMessage.toLowerCase();
  
  // Saludos
  if (message.match(/hola|buenos días|buenas tardes|buenas noches|hey|hi/i)) {
    return '¡Hola! Soy el Dr. IA de TeleMed Pro. ¿Cómo te sientes hoy? ¿En qué puedo ayudarte? 😊';
  }
  
  // Estado de salud
  if (message.match(/bien|mejor|excelente|genial/i)) {
    return '¡Qué bueno escuchar eso! Me alegra que te sientas mejor. ¿Hay algo más en lo que pueda ayudarte? 😊';
  }
  
  if (message.match(/mal|dolor|enferm|síntoma|molest|fiebre/i)) {
    return 'Lamento escuchar que no te sientes bien. ¿Podrías describirme con más detalle qué síntomas tienes? (dolor de cabeza, fiebre, náuseas, etc.)';
  }
  
  // Síntomas específicos
  if (message.match(/cabeza/i)) {
    return 'Para el dolor de cabeza te recomiendo:\n\n💊 Paracetamol 500mg cada 8 horas\n💧 Beber mucha agua\n😴 Descansar en un lugar oscuro\n\n¿El dolor es intenso o moderado?';
  }
  
  if (message.match(/estómago|barriga|nausea|vómito/i)) {
    return 'Para las molestias estomacales:\n\n🥤 Toma mucha agua\n🍚 Dieta blanda (arroz, plátano)\n💊 Omeprazol 20mg en ayunas\n\n¿Tienes vómitos o solo náuseas?';
  }
  
  if (message.match(/gripe|tos|resfr|garganta/i)) {
    return 'Para síntomas de gripe:\n\n💊 Paracetamol para fiebre\n🍯 Té con miel para la tos\n💧 Mucha hidratación\n😴 Reposo\n\n¿Tienes fiebre alta?';
  }
  
  if (message.match(/fiebre/i)) {
    return 'Para la fiebre:\n\n🌡️ Toma tu temperatura cada 4 horas\n💊 Paracetamol 500mg si supera 38°C\n🧊 Paños de agua tibia en la frente\n\n¿Qué temperatura tienes?';
  }
  
  // Medicamentos
  if (message.match(/receta|medicamento|medicina|pastilla/i)) {
    return 'Puedo ayudarte con recetas médicas. Ve a la sección "Recetas" en el menú inferior para ver tus medicamentos actuales. ¿Necesitas una nueva receta? 💊';
  }
  
  // Citas
  if (message.match(/cita|turno|consulta|ver|doctor/i)) {
    return 'Para agendar una cita médica, ve a la sección "Citas" en el menú inferior. Allí podrás:\n\n📅 Ver citas programadas\n➕ Agendar nueva cita\n⏰ Modificar horarios\n\n¿Te gustaría que te ayude con algo más?';
  }
  
  // Agradecimientos
  if (message.match(/gracias|thank|thx|vale/i)) {
    return '¡De nada! Estoy aquí para ayudarte. No dudes en consultarme si necesitas algo más. ¡Cuídate! 😊';
  }
  
  // Despedidas
  if (message.match(/adiós|chao|bye|hasta luego/i)) {
    return '¡Hasta pronto! Que te mejores. Recuerda que estoy disponible 24/7 para ayudarte. ¡Cuídate! 👋';
  }
  
  // Emergencias
  if (message.match(/emergencia|urgente|grave|ayuda|socorro/i)) {
    return '⚠️ Si es una emergencia médica grave:\n\n🚨 Llama al 911 inmediatamente\n🏥 Ve a urgencias más cercana\n\n¿Puedes describir la situación?';
  }
  
  // Respuesta por defecto
  return 'Entiendo tu consulta. Como asistente médico virtual, te recomiendo:\n\n1️⃣ Describir tus síntomas con detalle\n2️⃣ Agendar una cita si persisten\n3️⃣ Consultar la sección de Recetas\n\n¿Hay algo específico que te preocupe? 🩺';
};

export default function ChatScreen({ navigation }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hola, ¿cómo te sientes hoy?',
      sender: 'doctor',
      time: '10:30',
      read: true
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    // Scroll al final cuando hay nuevos mensajes
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const sendMessage = async () => {
    if (inputText.trim() === '') return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      read: true
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    
    // Simular que el doctor está escribiendo
    setIsTyping(true);
    
    // Respuesta del doctor después de 1-2 segundos
    setTimeout(() => {
      const doctorResponse = {
        id: Date.now() + 1,
        text: getDoctorResponse(inputText),
        sender: 'doctor',
        time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        read: true
      };
      
      setIsTyping(false);
      setMessages(prev => [...prev, doctorResponse]);
    }, 1500);
  };

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        const imageMessage = {
          id: Date.now(),
          text: '📷 Imagen adjunta',
          sender: 'user',
          time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
          image: result.assets[0].uri,
          read: true
        };

        setMessages(prev => [...prev, imageMessage]);

        // Respuesta del doctor
        setTimeout(() => {
          const doctorResponse = {
            id: Date.now() + 1,
            text: 'He recibido tu imagen. La estoy revisando... ¿Podrías describir qué es lo que te preocupa de lo que se ve en la foto?',
            sender: 'doctor',
            time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            read: true
          };
          setMessages(prev => [...prev, doctorResponse]);
        }, 2000);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la imagen');
    }
  };

  const handleCameraPick = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se necesita acceso a la cámara');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        const imageMessage = {
          id: Date.now(),
          text: '📷 Foto tomada',
          sender: 'user',
          time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
          image: result.assets[0].uri,
          read: true
        };

        setMessages(prev => [...prev, imageMessage]);

        setTimeout(() => {
          const doctorResponse = {
            id: Date.now() + 1,
            text: 'Foto recibida. Estoy analizando la imagen. ¿En qué área del cuerpo sientes la molestia?',
            sender: 'doctor',
            time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            read: true
          };
          setMessages(prev => [...prev, doctorResponse]);
        }, 2000);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        const docMessage = {
          id: Date.now(),
          text: `📄 ${result.name}`,
          sender: 'user',
          time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
          document: result.uri,
          read: true
        };

        setMessages(prev => [...prev, docMessage]);

        setTimeout(() => {
          const doctorResponse = {
            id: Date.now() + 1,
            text: 'He recibido tu documento. Lo revisaré y te daré una respuesta en breve. ¿Es un examen médico o resultado de laboratorio?',
            sender: 'doctor',
            time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            read: true
          };
          setMessages(prev => [...prev, doctorResponse]);
        }, 2000);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el documento');
    }
  };

  const showAttachmentOptions = () => {
    Alert.alert(
      '📎 Adjuntar',
      'Selecciona una opción',
      [
        {
          text: '📷 Tomar Foto',
          onPress: handleCameraPick
        },
        {
          text: '🖼️ Galería',
          onPress: handleImagePick
        },
        {
          text: '📄 Documento',
          onPress: handleDocumentPick
        },
        {
          text: 'Cancelar',
          style: 'cancel'
        }
      ]
    );
  };

  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';
    
    return (
      <View style={[styles.messageContainer, isUser ? styles.userMessage : styles.doctorMessage]}>
        {!isUser && (
          <View style={styles.messageBubble}>
            <Text style={styles.senderName}>Doctor</Text>
            <Text style={styles.messageText}>{item.text}</Text>
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.messageImage} />
            )}
            <Text style={styles.messageTime}>{item.time}</Text>
          </View>
        )}
        
        {isUser && (
          <View style={[styles.messageBubble, styles.userBubble]}>
            <Text style={[styles.messageText, styles.userMessageText]}>{item.text}</Text>
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.messageImage} />
            )}
            <Text style={[styles.messageTime, styles.userMessageTime]}>{item.time}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>👨‍⚕️</Text>
            <View style={styles.onlineIndicator} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Chat Médico</Text>
            <Text style={styles.headerSubtitle}>Conectado</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.callButton}>
          <Text style={styles.callIcon}>📞</Text>
          <Text style={styles.callText}>03:27</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de mensajes */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id.toString()}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Indicador de escritura */}
      {isTyping && (
        <View style={styles.typingContainer}>
          <View style={styles.typingBubble}>
            <ActivityIndicator size="small" color="#666" />
            <Text style={styles.typingText}>Doctor está escribiendo...</Text>
          </View>
        </View>
      )}

      {/* Input de mensaje */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton} onPress={showAttachmentOptions}>
          <Text style={styles.attachIcon}>📎</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Escribe tu mensaje..."
          placeholderTextColor="#999"
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />

        <TouchableOpacity 
          style={[styles.sendButton, inputText.trim() === '' && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={inputText.trim() === ''}
        >
          <Text style={styles.sendIcon}>✈️</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5DDD5'
  },
  header: {
    backgroundColor: '#0088CC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  avatarContainer: {
    position: 'relative'
  },
  avatar: {
    fontSize: 40
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#0088CC'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#B3E5FC',
    marginTop: 2
  },
  callButton: {
    backgroundColor: '#00A884',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  callIcon: {
    fontSize: 16
  },
  callText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12
  },
  messagesList: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    paddingBottom: 10
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
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1
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
    lineHeight: 20
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
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginTop: 8
  },
  typingContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 8
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center'
  },
  attachIcon: {
    fontSize: 20
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    color: '#262626'
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0088CC',
    justifyContent: 'center',
    alignItems: 'center'
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc'
  },
  sendIcon: {
    fontSize: 22
  }
});