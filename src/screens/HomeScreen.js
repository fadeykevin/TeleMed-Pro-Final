import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Card from '../components/Card';
import { mockUser, mockAppointments } from '../utils/mockData';

export default function HomeScreen({ navigation }) {
  const quickActions = [
    { id: 1, title: '🆘 Emergencia', color: '#ff4444', action: () => navigation.navigate('Emergency') },
    { id: 2, title: '📅 Nueva Cita', color: '#4CAF50', action: () => navigation.navigate('Appointments') },
    { id: 3, title: '💬 Chat Medico', color: '#2196F3', action: () => navigation.navigate('Chat') },
    { id: 4, title: '💊 Recetas', color: '#9C27B0', action: () => navigation.navigate('Prescriptions') }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hola, {mockUser.name} 👋</Text>
        <Text style={styles.subGreeting}>Como te sientes hoy?</Text>
      </View>

      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Acciones rapidas</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map(action => (
            <TouchableOpacity
              key={action.id}
              style={[styles.quickActionCard, { backgroundColor: action.color }]}
              onPress={action.action}
            >
              <Text style={styles.quickActionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Proximas citas</Text>
        {mockAppointments.map(appointment => (
          <Card key={appointment.id} title={appointment.title} subtitle={appointment.date}>
            <TouchableOpacity 
              style={styles.cardButton}
              onPress={() => Alert.alert('Cita', 'Ver detalles de la cita')}
            >
              <Text style={styles.cardButtonText}>Ver detalles</Text>
            </TouchableOpacity>
          </Card>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tu salud hoy</Text>
        <Card title="Recordatorios" subtitle="2 medicamentos pendientes">
          <Text style={styles.cardContent}>• Ibuprofeno 400mg - 14:00</Text>
          <Text style={styles.cardContent}>• Omeprazol 20mg - 20:00</Text>
        </Card>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  contentContainer: {
    paddingBottom: 90
  },
  header: {
    backgroundColor: '#0066cc',
    padding: 20,
    paddingTop: 50,
    paddingBottom: 30
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5
  },
  subGreeting: {
    fontSize: 16,
    color: '#e0f0ff'
  },
  quickActionsContainer: {
    padding: 15
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333'
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  quickActionCard: {
    width: '48%',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100
  },
  quickActionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  section: {
    padding: 15
  },
  cardButton: {
    marginTop: 10,
    alignSelf: 'flex-start'
  },
  cardButtonText: {
    color: '#0066cc',
    fontWeight: '600'
  },
  cardContent: {
    marginTop: 5,
    color: '#666',
    fontSize: 14
  },
  bottomPadding: {
    height: 20
  }
});