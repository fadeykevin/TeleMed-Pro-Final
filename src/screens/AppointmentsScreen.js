import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Alert, Linking, ScrollView } from 'react-native';
import Card from '../components/Card';

const mockAppointmentsData = [
  {
    id: 1,
    title: 'Cita con Dra. Salazar',
    date: '2025-06-01 10:00',
    doctor: 'Dra. María Salazar',
    specialty: 'Medicina General',
    type: 'videollamada',
    duration: '30 minutos',
    cost: '25000',
    status: 'Confirmada',
    description: 'Consulta de control general y revisión de exámenes',
    videoUrl: 'https://meet.google.com/abc-defg-hij',
    instructions: 'Tener a mano los exámenes recientes y lista de medicamentos actuales',
    emoji: '👩‍⚕️'
  },
  {
    id: 2,
    title: 'Cita con Dr. Rivera',
    date: '2025-06-10 15:30',
    doctor: 'Dr. Carlos Rivera',
    specialty: 'Cardiología',
    type: 'presencial',
    duration: '45 minutos',
    cost: '35000',
    status: 'Confirmada',
    location: 'Clínica Santa María, Av. Providencia 2345, Piso 3, Consulta 301',
    description: 'Evaluación cardíaca completa con electrocardiograma',
    requirements: [
      'Llegar 15 minutos antes',
      'Traer exámenes cardíacos previos',
      'Usar ropa cómoda',
      'Venir en ayunas (8 horas)',
      'Traer documento de identidad y orden médica'
    ],
    parking: 'Estacionamiento disponible en subterráneo (-2)',
    emoji: '👨‍⚕️'
  }
];

export default function AppointmentsScreen({ navigation }) {
  const [appointments, setAppointments] = useState(mockAppointmentsData);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setModalVisible(true);
  };

  const startVideoCall = () => {
    setModalVisible(false);
    setTimeout(() => {
      navigation.navigate('VideoCall', {
        doctor: selectedAppointment.doctor,
        specialty: selectedAppointment.specialty
      });
    }, 300);
  };

  const openMaps = (address) => {
    const url = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(address);
    Linking.openURL(url);
  };

  const cancelAppointment = (id) => {
    Alert.alert(
      'Cancelar Cita',
      'Estas seguro que deseas cancelar esta cita?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Si, cancelar',
          style: 'destructive',
          onPress: () => {
            setAppointments(appointments.filter(a => a.id !== id));
            setModalVisible(false);
            Alert.alert('Exito', 'Cita cancelada correctamente');
          }
        }
      ]
    );
  };

  const rescheduleAppointment = () => {
    setModalVisible(false);
    setTimeout(() => {
      Alert.alert(
        'Reagendar Cita',
        'Selecciona una nueva fecha para tu cita con ' + selectedAppointment.doctor,
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Proxima semana', 
            onPress: () => Alert.alert('Confirmado', 'Tu cita ha sido reagendada para la proxima semana')
          },
          { 
            text: 'Proximo mes', 
            onPress: () => Alert.alert('Confirmado', 'Tu cita ha sido reagendada para el proximo mes')
          }
        ]
      );
    }, 300);
  };

  const addNewAppointment = () => {
    Alert.alert(
      'Nueva Cita',
      'Que tipo de cita deseas agendar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Videollamada', 
          onPress: () => navigation.navigate('NewAppointment', { type: 'videollamada' })
        },
        { 
          text: 'Presencial', 
          onPress: () => navigation.navigate('NewAppointment', { type: 'presencial' })
        }
      ]
    );
  };

  const renderAppointment = ({ item }) => (
    <TouchableOpacity onPress={() => openDetails(item)}>
      <Card>
        <View style={styles.appointmentCard}>
          <View style={styles.appointmentIcon}>
            <Text style={styles.iconEmoji}>{item.emoji}</Text>
          </View>
          <View style={styles.appointmentInfo}>
            <Text style={styles.appointmentTitle}>{item.title}</Text>
            <Text style={styles.appointmentDate}>{item.date}</Text>
            <View style={styles.typeContainer}>
              {item.type === 'videollamada' ? (
                <View style={[styles.typeBadge, styles.videoBadge]}>
                  <Text style={styles.typeBadgeText}>Videollamada</Text>
                </View>
              ) : (
                <View style={[styles.typeBadge, styles.presencialBadge]}>
                  <Text style={styles.typeBadgeText}>Presencial</Text>
                </View>
              )}
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.arrow}>›</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Citas Medicas</Text>
        <Text style={styles.headerSubtitle}>{appointments.length} citas programadas</Text>
      </View>

      <FlatList
        data={appointments}
        keyExtractor={item => item.id.toString()}
        renderItem={renderAppointment}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyText}>No tienes citas programadas</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={addNewAppointment}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ScrollView 
            style={styles.modalScrollView}
            contentContainerStyle={styles.modalScrollContent}
          >
            <View style={styles.modalContent}>
              {selectedAppointment && (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalIcon}>{selectedAppointment.emoji}</Text>
                    <Text style={styles.modalTitle}>{selectedAppointment.doctor}</Text>
                    <Text style={styles.modalSpecialty}>{selectedAppointment.specialty}</Text>
                  </View>

                  {selectedAppointment.type === 'videollamada' ? (
                    <View style={styles.videoSection}>
                      <View style={styles.videoCallBox}>
                        <Text style={styles.videoCallIcon}>📹</Text>
                        <Text style={styles.videoCallTitle}>Consulta por Videollamada</Text>
                        <Text style={styles.videoCallDesc}>
                          Conecta con tu medico desde tu hogar
                        </Text>
                      </View>

                      <View style={styles.detailSection}>
                        <View style={styles.infoRow}>
                          <Text style={styles.infoLabel}>Fecha y hora</Text>
                          <Text style={styles.infoValue}>{selectedAppointment.date}</Text>
                        </View>

                        <View style={styles.infoRow}>
                          <Text style={styles.infoLabel}>Duracion</Text>
                          <Text style={styles.infoValue}>{selectedAppointment.duration}</Text>
                        </View>

                        <View style={styles.infoRow}>
                          <Text style={styles.infoLabel}>Costo</Text>
                          <Text style={styles.infoValue}>\$ {selectedAppointment.cost} CLP</Text>
                        </View>

                        <View style={styles.descriptionBox}>
                          <Text style={styles.descriptionTitle}>Descripcion</Text>
                          <Text style={styles.descriptionText}>{selectedAppointment.description}</Text>
                        </View>

                        <View style={styles.instructionsBox}>
                          <Text style={styles.instructionsTitle}>Instrucciones</Text>
                          <Text style={styles.instructionsText}>{selectedAppointment.instructions}</Text>
                        </View>
                      </View>

                      <TouchableOpacity 
                        style={styles.videoCallButton}
                        onPress={startVideoCall}
                      >
                        <Text style={styles.videoCallButtonIcon}>📹</Text>
                        <Text style={styles.videoCallButtonText}>INICIAR VIDEOLLAMADA</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.presencialSection}>
                      <View style={styles.presencialBox}>
                        <Text style={styles.presencialIcon}>🏥</Text>
                        <Text style={styles.presencialTitle}>Consulta Presencial</Text>
                        <Text style={styles.presencialDesc}>
                          Asiste a la clinica en la fecha programada
                        </Text>
                      </View>

                      <View style={styles.detailSection}>
                        <View style={styles.infoRow}>
                          <Text style={styles.infoLabel}>Fecha y hora</Text>
                          <Text style={styles.infoValue}>{selectedAppointment.date}</Text>
                        </View>

                        <View style={styles.infoRow}>
                          <Text style={styles.infoLabel}>Duracion</Text>
                          <Text style={styles.infoValue}>{selectedAppointment.duration}</Text>
                        </View>

                        <View style={styles.infoRow}>
                          <Text style={styles.infoLabel}>Costo</Text>
                          <Text style={styles.infoValue}>\$ {selectedAppointment.cost} CLP</Text>
                        </View>

                        <View style={styles.locationBox}>
                          <Text style={styles.locationTitle}>Ubicacion</Text>
                          <Text style={styles.locationText}>{selectedAppointment.location}</Text>
                          <TouchableOpacity 
                            style={styles.mapsButton}
                            onPress={() => openMaps(selectedAppointment.location)}
                          >
                            <Text style={styles.mapsButtonText}>Ver en Google Maps</Text>
                          </TouchableOpacity>
                        </View>

                        <View style={styles.descriptionBox}>
                          <Text style={styles.descriptionTitle}>Descripcion</Text>
                          <Text style={styles.descriptionText}>{selectedAppointment.description}</Text>
                        </View>

                        <View style={styles.requirementsBox}>
                          <Text style={styles.requirementsTitle}>Requisitos:</Text>
                          {selectedAppointment.requirements.map((req, index) => (
                            <Text key={index} style={styles.requirementItem}>• {req}</Text>
                          ))}
                        </View>

                        {selectedAppointment.parking && (
                          <View style={styles.parkingBox}>
                            <Text style={styles.parkingText}>{selectedAppointment.parking}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  )}

                  <View style={styles.modalActions}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={rescheduleAppointment}
                    >
                      <Text style={styles.actionButtonText}>Reagendar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.actionButton, styles.cancelButton]}
                      onPress={() => cancelAppointment(selectedAppointment.id)}
                    >
                      <Text style={[styles.actionButtonText, styles.cancelButtonText]}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>Cerrar</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 50,
    paddingBottom: 25
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e0f5e0'
  },
  listContent: {
    padding: 15,
    paddingBottom: 100
  },
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  appointmentIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconEmoji: {
    fontSize: 28
  },
  appointmentInfo: {
    flex: 1
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4
  },
  appointmentDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap'
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  videoBadge: {
    backgroundColor: '#e3f2fd'
  },
  presencialBadge: {
    backgroundColor: '#fff3e0'
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '600'
  },
  statusBadge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  statusText: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: '600'
  },
  arrow: {
    fontSize: 24,
    color: '#ccc'
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16
  },
  emptyText: {
    fontSize: 16,
    color: '#999'
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  fabIcon: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalScrollView: {
    flex: 1,
    marginTop: 80
  },
  modalScrollContent: {
    paddingBottom: 40
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24
  },
  modalIcon: {
    fontSize: 60,
    marginBottom: 12
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333'
  },
  modalSpecialty: {
    fontSize: 16,
    color: '#666',
    marginTop: 4
  },
  videoSection: {
    marginBottom: 20
  },
  videoCallBox: {
    backgroundColor: '#e3f2fd',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20
  },
  videoCallIcon: {
    fontSize: 48,
    marginBottom: 10
  },
  videoCallTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 8
  },
  videoCallDesc: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center'
  },
  presencialSection: {
    marginBottom: 20
  },
  presencialBox: {
    backgroundColor: '#fff3e0',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20
  },
  presencialIcon: {
    fontSize: 48,
    marginBottom: 10
  },
  presencialTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 8
  },
  presencialDesc: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center'
  },
  detailSection: {
    marginBottom: 20
  },
  infoRow: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10
  },
  infoLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6
  },
  infoValue: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold'
  },
  descriptionBox: {
    backgroundColor: '#f0f8ff',
    padding: 16,
    borderRadius: 12,
    marginTop: 6,
    marginBottom: 10
  },
  descriptionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 10
  },
  descriptionText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22
  },
  instructionsBox: {
    backgroundColor: '#fff9e6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10
  },
  instructionsTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FF9800',
    marginBottom: 10
  },
  instructionsText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22
  },
  locationBox: {
    backgroundColor: '#fff3e0',
    padding: 16,
    borderRadius: 12,
    marginTop: 6,
    marginBottom: 10
  },
  locationTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 10
  },
  locationText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
    marginBottom: 12
  },
  mapsButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  mapsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14
  },
  requirementsBox: {
    backgroundColor: '#e8f5e9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10
  },
  requirementsTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 12
  },
  requirementItem: {
    fontSize: 13,
    color: '#555',
    lineHeight: 24,
    marginLeft: 8
  },
  parkingBox: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginTop: 6
  },
  parkingText: {
    fontSize: 13,
    color: '#666'
  },
  videoCallButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 14,
    marginBottom: 20,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  videoCallButtonIcon: {
    fontSize: 26
  },
  videoCallButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#0066cc',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center'
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ff4444'
  },
  cancelButtonText: {
    color: '#ff4444'
  },
  closeButton: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center'
  },
  closeButtonText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 15
  }
});