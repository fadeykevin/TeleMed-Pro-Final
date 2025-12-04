import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Linking, Vibration } from 'react-native';

export default function EmergencyScreen({ navigation }) {
  const [emergencyActive, setEmergencyActive] = useState(false);

  const patientData = {
    nombre: 'Kevin Rodas',
    edad: 34,
    tipoSangre: 'O+',
    alergias: ['Penicilina', 'Mariscos'],
    condiciones: ['Hipertensión', 'Diabetes tipo 2'],
    contactoEmergencia: '+56987654321',
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
            setEmergencyActive(true);
            
            // Vibración de emergencia
            Vibration.vibrate([0, 500, 200, 500, 200, 500]);
            
            // Llamar al número de emergencia
            Alert.alert(
              '🚑 LLAMANDO A EMERGENCIAS',
              'Se enviaron tus datos y ubicación\n\n' +
              `Nombre: ${patientData.nombre}\n` +
              `Tipo de sangre: ${patientData.tipoSangre}\n` +
              `Alergias: ${patientData.alergias.join(', ')}\n` +
              `Ubicación: Av. Principal 123, Santiago\n\n` +
              '¿Deseas llamar ahora al 131?',
              [
                { text: 'Cancelar', style: 'cancel', onPress: () => setEmergencyActive(false) },
                { 
                  text: 'LLAMAR 131', 
                  onPress: () => {
                    Linking.openURL('tel:131');
                    setEmergencyActive(false);
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  const callEmergencyContact = () => {
    Alert.alert(
      '📞 Llamar contacto de emergencia',
      `¿Llamar a ${patientData.contactoEmergencia}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Llamar', onPress: () => Linking.openURL(`tel:${patientData.contactoEmergencia}`) }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🚨 Emergencia</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.warningBox}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningText}>
            Presiona el botón solo en caso de emergencia real
          </Text>
        </View>

        <TouchableOpacity 
          style={[styles.panicButton, emergencyActive && styles.panicButtonActive]}
          onPress={activateEmergency}
          activeOpacity={0.7}
        >
          <View style={styles.panicButtonInner}>
            <Text style={styles.panicIcon}>🚨</Text>
            <Text style={styles.panicText}>
              {emergencyActive ? 'EMERGENCIA\nACTIVADA' : 'BOTÓN DE\nEMERGENCIA'}
            </Text>
            <Text style={styles.panicSubtext}>
              {emergencyActive ? 'Ayuda en camino' : 'Presiona para activar'}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>📋 Datos que se enviarán:</Text>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Paciente:</Text>
            <Text style={styles.infoValue}>{patientData.nombre}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Tipo de sangre:</Text>
            <Text style={styles.infoValue}>{patientData.tipoSangre}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Alergias:</Text>
            <Text style={styles.infoValue}>{patientData.alergias.join(', ')}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Condiciones:</Text>
            <Text style={styles.infoValue}>{patientData.condiciones.join(', ')}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>📍 Ubicación:</Text>
            <Text style={styles.infoValue}>Av. Principal 123, Santiago, Chile</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.contactButton} onPress={callEmergencyContact}>
          <Text style={styles.contactButtonText}>📞 Llamar contacto de emergencia</Text>
        </TouchableOpacity>

        <View style={styles.emergencyNumbers}>
          <Text style={styles.numbersTitle}>Números de emergencia:</Text>
          <TouchableOpacity onPress={() => Linking.openURL('tel:131')}>
            <Text style={styles.emergencyNumber}>🚑 SAMU: 131</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('tel:133')}>
            <Text style={styles.emergencyNumber}>🚒 Bomberos: 132</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('tel:133')}>
            <Text style={styles.emergencyNumber}>👮 Carabineros: 133</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#F44336',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  backIcon: {
    fontSize: 28,
    color: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  warningBox: {
    backgroundColor: '#FFF3E0',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#FF9800',
  },
  warningIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: '#E65100',
    fontWeight: '600',
  },
  panicButton: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#F44336',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    elevation: 8,
    shadowColor: '#F44336',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  panicButtonActive: {
    backgroundColor: '#C62828',
    transform: [{ scale: 1.05 }],
  },
  panicButtonInner: {
    alignItems: 'center',
  },
  panicIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  panicText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  panicSubtext: {
    color: '#FFCDD2',
    fontSize: 12,
    textAlign: 'center',
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  contactButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emergencyNumbers: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
  },
  numbersTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  emergencyNumber: {
    fontSize: 16,
    color: '#0088CC',
    paddingVertical: 8,
    fontWeight: '600',
  },
});