import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';

export default function NewAppointmentScreen({ navigation, route }) {
  const [appointmentType, setAppointmentType] = useState(route.params?.type || 'videollamada');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');

  const specialties = [
    { id: 1, name: 'Medicina General', emoji: '👨‍⚕️' },
    { id: 2, name: 'Cardiología', emoji: '❤️' },
    { id: 3, name: 'Pediatría', emoji: '👶' },
    { id: 4, name: 'Dermatología', emoji: '🩺' },
    { id: 5, name: 'Psiquiatría', emoji: '🧠' },
    { id: 6, name: 'Traumatología', emoji: '🦴' }
  ];

  const doctors = {
    'Medicina General': [
      { id: 1, name: 'Dra. María Salazar', emoji: '👩‍⚕️' },
      { id: 2, name: 'Dr. Juan Torres', emoji: '👨‍⚕️' }
    ],
    'Cardiología': [
      { id: 3, name: 'Dr. Carlos Rivera', emoji: '👨‍⚕️' },
      { id: 4, name: 'Dra. Ana Martínez', emoji: '👩‍⚕️' }
    ],
    'Pediatría': [
      { id: 5, name: 'Dra. Laura Gómez', emoji: '👩‍⚕️' },
      { id: 6, name: 'Dr. Pedro Silva', emoji: '👨‍⚕️' }
    ],
    'Dermatología': [
      { id: 7, name: 'Dr. Miguel Rojas', emoji: '👨‍⚕️' },
      { id: 8, name: 'Dra. Sofía Vargas', emoji: '👩‍⚕️' }
    ],
    'Psiquiatría': [
      { id: 9, name: 'Dra. Patricia Morales', emoji: '👩‍⚕️' },
      { id: 10, name: 'Dr. Roberto Díaz', emoji: '👨‍⚕️' }
    ],
    'Traumatología': [
      { id: 11, name: 'Dr. Fernando López', emoji: '👨‍⚕️' },
      { id: 12, name: 'Dra. Carmen Ruiz', emoji: '👩‍⚕️' }
    ]
  };

  const availableDates = [
    '2025-06-15',
    '2025-06-16',
    '2025-06-17',
    '2025-06-18',
    '2025-06-19',
    '2025-06-20'
  ];

  const availableTimes = [
    '09:00', '10:00', '11:00', '12:00',
    '14:00', '15:00', '16:00', '17:00'
  ];

  const handleSubmit = () => {
    if (!selectedSpecialty || !selectedDoctor || !selectedDate || !selectedTime || !reason) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    Alert.alert(
      'Confirmar Cita',
      'Tipo: ' + (appointmentType === 'videollamada' ? 'Videollamada 📹' : 'Presencial 🏥') + '\n' +
      'Especialidad: ' + selectedSpecialty + '\n' +
      'Doctor: ' + selectedDoctor + '\n' +
      'Fecha: ' + selectedDate + '\n' +
      'Hora: ' + selectedTime + '\n' +
      'Motivo: ' + reason,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            Alert.alert(
              '✅ Cita Agendada',
              'Tu cita ha sido agendada exitosamente.\n\nRecibirás una confirmación por correo.',
              [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nueva Cita Médica</Text>
      </View>

      <View style={styles.content}>
        {/* Tipo de cita */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipo de Consulta</Text>
          <View style={styles.typeButtons}>
            <TouchableOpacity
              style={[styles.typeButton, appointmentType === 'videollamada' && styles.typeButtonActive]}
              onPress={() => setAppointmentType('videollamada')}
            >
              <Text style={styles.typeButtonEmoji}>📹</Text>
              <Text style={[styles.typeButtonText, appointmentType === 'videollamada' && styles.typeButtonTextActive]}>
                Videollamada
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.typeButton, appointmentType === 'presencial' && styles.typeButtonActive]}
              onPress={() => setAppointmentType('presencial')}
            >
              <Text style={styles.typeButtonEmoji}>🏥</Text>
              <Text style={[styles.typeButtonText, appointmentType === 'presencial' && styles.typeButtonTextActive]}>
                Presencial
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Especialidad */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Especialidad</Text>
          <View style={styles.optionsGrid}>
            {specialties.map(specialty => (
              <TouchableOpacity
                key={specialty.id}
                style={[styles.optionCard, selectedSpecialty === specialty.name && styles.optionCardActive]}
                onPress={() => {
                  setSelectedSpecialty(specialty.name);
                  setSelectedDoctor('');
                }}
              >
                <Text style={styles.optionEmoji}>{specialty.emoji}</Text>
                <Text style={styles.optionText}>{specialty.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Doctor */}
        {selectedSpecialty && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Selecciona un Doctor</Text>
            {doctors[selectedSpecialty]?.map(doctor => (
              <TouchableOpacity
                key={doctor.id}
                style={[styles.doctorCard, selectedDoctor === doctor.name && styles.doctorCardActive]}
                onPress={() => setSelectedDoctor(doctor.name)}
              >
                <Text style={styles.doctorEmoji}>{doctor.emoji}</Text>
                <Text style={styles.doctorName}>{doctor.name}</Text>
                {selectedDoctor === doctor.name && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Fecha */}
        {selectedDoctor && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fecha Disponible</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
              {availableDates.map(date => (
                <TouchableOpacity
                  key={date}
                  style={[styles.dateCard, selectedDate === date && styles.dateCardActive]}
                  onPress={() => setSelectedDate(date)}
                >
                  <Text style={styles.dateText}>{date}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Hora */}
        {selectedDate && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hora Disponible</Text>
            <View style={styles.timeGrid}>
              {availableTimes.map(time => (
                <TouchableOpacity
                  key={time}
                  style={[styles.timeCard, selectedTime === time && styles.timeCardActive]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text style={[styles.timeText, selectedTime === time && styles.timeTextActive]}>{time}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Motivo */}
        {selectedTime && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Motivo de la Consulta</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Describe brevemente el motivo de tu consulta..."
              multiline
              numberOfLines={4}
              value={reason}
              onChangeText={setReason}
            />
          </View>
        )}

        {/* Botón de confirmar */}
        {selectedTime && reason && (
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>✓ Agendar Cita</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
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
    color: '#fff'
  },
  content: {
    padding: 20
  },
  section: {
    marginBottom: 30
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12
  },
  typeButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0'
  },
  typeButtonActive: {
    borderColor: '#4CAF50',
    backgroundColor: '#e8f5e9'
  },
  typeButtonEmoji: {
    fontSize: 32,
    marginBottom: 8
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666'
  },
  typeButtonTextActive: {
    color: '#4CAF50'
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  optionCard: {
    width: '47%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0'
  },
  optionCardActive: {
    borderColor: '#4CAF50',
    backgroundColor: '#e8f5e9'
  },
  optionEmoji: {
    fontSize: 28,
    marginBottom: 8
  },
  optionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center'
  },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0'
  },
  doctorCardActive: {
    borderColor: '#4CAF50',
    backgroundColor: '#e8f5e9'
  },
  doctorEmoji: {
    fontSize: 32,
    marginRight: 12
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1
  },
  checkmark: {
    fontSize: 24,
    color: '#4CAF50'
  },
  dateScroll: {
    flexDirection: 'row'
  },
  dateCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    minWidth: 120
  },
  dateCardActive: {
    borderColor: '#4CAF50',
    backgroundColor: '#e8f5e9'
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center'
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  timeCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    width: '22%',
    alignItems: 'center'
  },
  timeCardActive: {
    borderColor: '#4CAF50',
    backgroundColor: '#4CAF50'
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  timeTextActive: {
    color: '#fff'
  },
  textArea: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    fontSize: 14,
    textAlignVertical: 'top'
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  }
});