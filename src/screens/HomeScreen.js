import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Audio } from 'expo-av';

export default function HomeScreen({ navigation }) {
  const soundRef = useRef(null);

  const playAlarmSound = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      }
      const { sound } = await Audio.Sound.createAsync(
        { uri: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3' },
        { shouldPlay: true, isLooping: true, volume: 1.0 }
      );
      soundRef.current = sound;
    } catch (error) {
      console.log('Error al reproducir sonido:', error);
    }
  };

  const stopAlarmSound = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    } catch (error) {
      console.log('Error al detener sonido:', error);
    }
  };

  const handleEmergency = async () => {
    await playAlarmSound();
    
    Alert.alert(
      'EMERGENCIA ACTIVADA',
      'Datos enviados:\n\nPaciente: Kevin Rodas\nSangre: O+\nAlergias: Penicilina, Mariscos\nUbicacion: Av. Principal 123, Santiago\n\nLlamar al 131?',
      [
        {
          text: 'CANCELAR',
          style: 'cancel',
          onPress: async () => {
            await stopAlarmSound();
          }
        },
        {
          text: 'LLAMAR 131',
          onPress: async () => {
            await stopAlarmSound();
            Alert.alert('Llamando al 131...', 'Conectando con servicios de emergencia');
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hola, Kevin Rodas</Text>
        <Text style={styles.subtitle}>Como te sientes hoy?</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Acciones rapidas</Text>
        
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergency}>
            <Text style={styles.emergencyIcon}>🚨</Text>
            <Text style={styles.emergencyText}>EMERGENCIA</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.videoButton}
            onPress={() => navigation.navigate('VideoCall')}
          >
            <Text style={styles.videoIcon}>📹</Text>
            <Text style={styles.videoText}>VIDEOLLAMADA</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.chatButton}
            onPress={() => navigation.navigate('Chat')}
          >
            <Text style={styles.chatIcon}>💬</Text>
            <Text style={styles.chatText}>CHAT MEDICO</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.appointmentButton}
            onPress={() => navigation.navigate('Citas')}
          >
            <Text style={styles.appointmentIcon}>📅</Text>
            <Text style={styles.appointmentText}>CITAS</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Proximas citas</Text>
        <TouchableOpacity 
          style={styles.card}
          onPress={() => {
            Alert.alert(
              'Detalles de la Cita',
              'Cita con Dra. Salazar\n\nEspecialidad: Medicina General\nFecha: 01 de Junio, 2025\nHora: 10:00 AM\nDuracion: 30 minutos\nConsultorio: 205',
              [
                { text: 'Cerrar' },
                { 
                  text: 'Cancelar Cita', 
                  style: 'destructive',
                  onPress: () => Alert.alert('Exito', 'Cita cancelada exitosamente')
                },
                { 
                  text: 'Reagendar',
                  onPress: () => navigation.navigate('NewAppointment')
                }
              ]
            );
          }}
        >
          <View style={styles.appointmentCard}>
            <View style={styles.appointmentDate}>
              <Text style={styles.dateDay}>01</Text>
              <Text style={styles.dateMonth}>JUN</Text>
            </View>
            <View style={styles.appointmentInfo}>
              <Text style={styles.appointmentDoctor}>Dra. Salazar</Text>
              <Text style={styles.appointmentSpecialty}>Medicina General</Text>
              <Text style={styles.appointmentTime}>10:00 AM</Text>
            </View>
            <View style={styles.appointmentAction}>
              <Text style={styles.appointmentActionText}>Ver</Text>
            </View>
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Servicios</Text>
        <View style={styles.servicesGrid}>
          <TouchableOpacity 
            style={styles.serviceCard}
            onPress={() => navigation.navigate('Recetas')}
          >
            <Text style={styles.serviceIcon}>💊</Text>
            <Text style={styles.serviceText}>Recetas</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.serviceCard}
            onPress={() => navigation.navigate('Perfil')}
          >
            <Text style={styles.serviceIcon}>👤</Text>
            <Text style={styles.serviceText}>Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.serviceCard}
            onPress={() => navigation.navigate('Emergency')}
          >
            <Text style={styles.serviceIcon}>🏥</Text>
            <Text style={styles.serviceText}>Emergencias</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.serviceCard}
            onPress={() => {
              Alert.alert(
                'Historial Medico',
                'Ver historial completo de:\n\n- Consultas anteriores\n- Diagnosticos\n- Tratamientos\n- Examenes realizados\n- Hospitalizaciones',
                [
                  { text: 'Cerrar' },
                  { 
                    text: 'Ver Historial', 
                    onPress: () => Alert.alert('Historial', 'Funcionalidad completa en desarrollo') 
                  }
                ]
              );
            }}
          >
            <Text style={styles.serviceIcon}>📋</Text>
            <Text style={styles.serviceText}>Historial</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: '#0088CC',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 16,
    color: '#B3E5FC'
  },
  content: {
    flex: 1,
    padding: 15
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 15
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  emergencyButton: {
    flex: 1,
    backgroundColor: '#f44336',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginRight: 8,
    elevation: 3
  },
  emergencyIcon: {
    fontSize: 40,
    marginBottom: 8
  },
  emergencyText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold'
  },
  videoButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginLeft: 8,
    elevation: 3
  },
  videoIcon: {
    fontSize: 40,
    marginBottom: 8
  },
  videoText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold'
  },
  chatButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginRight: 8,
    elevation: 3
  },
  chatIcon: {
    fontSize: 40,
    marginBottom: 8
  },
  chatText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold'
  },
  appointmentButton: {
    flex: 1,
    backgroundColor: '#FF9800',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginLeft: 8,
    elevation: 3
  },
  appointmentIcon: {
    fontSize: 40,
    marginBottom: 8
  },
  appointmentText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2
  },
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  appointmentDate: {
    backgroundColor: '#0088CC',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginRight: 15,
    minWidth: 60
  },
  dateDay: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff'
  },
  dateMonth: {
    fontSize: 12,
    color: '#B3E5FC'
  },
  appointmentInfo: {
    flex: 1
  },
  appointmentDoctor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2
  },
  appointmentSpecialty: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2
  },
  appointmentTime: {
    fontSize: 14,
    color: '#0088CC',
    fontWeight: '600'
  },
  appointmentAction: {
    backgroundColor: '#0088CC',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20
  },
  appointmentActionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  serviceCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2
  },
  serviceIcon: {
    fontSize: 40,
    marginBottom: 8
  },
  serviceText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600'
  },
  bottomSpace: {
    height: 100
  }
});
