import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Alert, Linking, Vibration } from 'react-native';

export default function HomeScreen({ navigation }) {
  const [emergencyModalVisible, setEmergencyModalVisible] = useState(false);

  const patientData = {
    nombre: 'Kevin Rodas',
    tipoSangre: 'O+',
    alergias: ['Penicilina', 'Mariscos'],
    condiciones: ['Hipertensión', 'Diabetes tipo 2'],
  };

  const activateEmergency = () => {
    Alert.alert(
      '🚨 EMERGENCIA MÉDICA',
      '¿Confirmas que necesitas ayuda médica urgente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'SÍ, ES EMERGENCIA',
          style: 'destructive',
          onPress: () => {
            Vibration.vibrate([0, 500, 200, 500]);
            
            Alert.alert(
              '🚑 EMERGENCIA ACTIVADA',
              'Datos enviados:\n\n' +
              `Paciente: ${patientData.nombre}\n` +
              `Sangre: ${patientData.tipoSangre}\n` +
              `Alergias: ${patientData.alergias.join(', ')}\n` +
              `Ubicación: Av. Principal 123, Santiago\n\n` +
              '¿Llamar al 131?',
              [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'LLAMAR 131', onPress: () => Linking.openURL('tel:131') }
              ]
            );
            
            setEmergencyModalVisible(false);
          }
        }
      ]
    );
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hola, Kevin Rodas 👋</Text>
          <Text style={styles.subtext}>Como te sientes hoy?</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones rapidas</Text>
          <View style={styles.grid}>
            <TouchableOpacity 
              style={[styles.card, { backgroundColor: '#FF5252' }]}
              onPress={() => setEmergencyModalVisible(true)}
            >
              <Text style={styles.cardIcon}>🆘</Text>
              <Text style={styles.cardText}>Emergencia</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.card, { backgroundColor: '#4CAF50' }]}
              onPress={() => navigation.navigate('Citas')}
            >
              <Text style={styles.cardIcon}>📅</Text>
              <Text style={styles.cardText}>Nueva Cita</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.card, { backgroundColor: '#2196F3' }]}
              onPress={() => navigation.navigate('Chat')}
            >
              <Text style={styles.cardIcon}>💬</Text>
              <Text style={styles.cardText}>Chat Medico</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.card, { backgroundColor: '#9C27B0' }]}
              onPress={() => navigation.navigate('Recetas')}
            >
              <Text style={styles.cardIcon}>💊</Text>
              <Text style={styles.cardText}>Recetas</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Proximas citas</Text>
          
          <View style={styles.appointmentCard}>
            <View style={styles.appointmentHeader}>
              <Text style={styles.appointmentTitle}>Cita con Dra. Salazar</Text>
              <Text style={styles.appointmentDate}>2025-06-01 10:00</Text>
            </View>
            <TouchableOpacity 
              style={styles.detailsButton}
              onPress={() => navigation.navigate('Citas')}
            >
              <Text style={styles.detailsButtonText}>Ver detalles</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.appointmentCard}>
            <View style={styles.appointmentHeader}>
              <Text style={styles.appointmentTitle}>Cita con Dr. Rivera</Text>
              <Text style={styles.appointmentDate}>2025-06-10 15:30</Text>
            </View>
            <TouchableOpacity 
              style={styles.detailsButton}
              onPress={() => navigation.navigate('Citas')}
            >
              <Text style={styles.detailsButtonText}>Ver detalles</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={emergencyModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.emergencyModal}>
          <View style={styles.emergencyContent}>
            <Text style={styles.emergencyTitle}>🚨 EMERGENCIA</Text>
            
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                ⚠️ Presiona el botón solo en caso de emergencia real
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.panicButton}
              onPress={activateEmergency}
            >
              <Text style={styles.panicIcon}>🚨</Text>
              <Text style={styles.panicText}>ACTIVAR{'\n'}EMERGENCIA</Text>
            </TouchableOpacity>

            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>📋 Datos a enviar:</Text>
              <Text style={styles.infoItem}>👤 {patientData.nombre}</Text>
              <Text style={styles.infoItem}>🩸 {patientData.tipoSangre}</Text>
              <Text style={styles.infoItem}>⚠️ {patientData.alergias.join(', ')}</Text>
              <Text style={styles.infoItem}>📍 Av. Principal 123, Santiago</Text>
            </View>

            <View style={styles.emergencyNumbers}>
              <TouchableOpacity onPress={() => Linking.openURL('tel:131')}>
                <Text style={styles.emergencyNumberText}>🚑 SAMU: 131</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL('tel:132')}>
                <Text style={styles.emergencyNumberText}>🚒 Bomberos: 132</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL('tel:133')}>
                <Text style={styles.emergencyNumberText}>👮 Carabineros: 133</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setEmergencyModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#0088CC', padding: 24, paddingTop: 60, paddingBottom: 30 },
  greeting: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  subtext: { fontSize: 16, color: '#B3E5FC' },
  section: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  card: { width: '48%', aspectRatio: 1, borderRadius: 16, padding: 20, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  cardIcon: { fontSize: 48, marginBottom: 12 },
  cardText: { fontSize: 16, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  appointmentCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  appointmentHeader: { marginBottom: 12 },
  appointmentTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  appointmentDate: { fontSize: 14, color: '#666' },
  detailsButton: { backgroundColor: '#E3F2FD', padding: 12, borderRadius: 8, alignItems: 'center' },
  detailsButtonText: { color: '#0088CC', fontSize: 14, fontWeight: '600' },
  emergencyModal: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
  emergencyContent: { backgroundColor: '#fff', borderRadius: 20, padding: 24, maxHeight: '90%' },
  emergencyTitle: { fontSize: 28, fontWeight: 'bold', color: '#F44336', textAlign: 'center', marginBottom: 20 },
  warningBox: { backgroundColor: '#FFF3E0', padding: 16, borderRadius: 12, marginBottom: 20, borderWidth: 2, borderColor: '#FF9800' },
  warningText: { fontSize: 14, color: '#E65100', fontWeight: '600', textAlign: 'center' },
  panicButton: { width: 180, height: 180, borderRadius: 90, backgroundColor: '#F44336', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginBottom: 20, elevation: 8 },
  panicIcon: { fontSize: 50 },
  panicText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginTop: 10 },
  infoSection: { backgroundColor: '#f5f5f5', padding: 16, borderRadius: 12, marginBottom: 20 },
  infoTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 12 },
  infoItem: { fontSize: 14, color: '#333', marginBottom: 6 },
  emergencyNumbers: { marginBottom: 20 },
  emergencyNumberText: { fontSize: 16, color: '#0088CC', paddingVertical: 8, fontWeight: '600', textAlign: 'center' },
  closeButton: { backgroundColor: '#f0f0f0', padding: 16, borderRadius: 12, alignItems: 'center' },
  closeButtonText: { color: '#666', fontWeight: 'bold', fontSize: 16 },
});