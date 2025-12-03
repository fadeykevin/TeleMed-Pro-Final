import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
  TextInput,
  Share as RNShare
} from 'react-native';
import * as MailComposer from 'expo-mail-composer';

const mockPrescriptionsData = [
  {
    id: 1,
    medication: 'Ibuprofeno',
    dosage: '400mg',
    frequency: 'Cada 8 horas',
    duration: '7 días',
    doctor: 'Dra. Salazar',
    date: '2025-05-28',
    instructions: 'Tomar después de las comidas para evitar molestias estomacales.',
    emoji: '💊'
  },
  {
    id: 2,
    medication: 'Paracetamol',
    dosage: '500mg',
    frequency: 'Cada 6 horas',
    duration: '5 días',
    doctor: 'Dr. Rivera',
    date: '2025-05-25',
    instructions: 'Tomar con alimentos. No exceder 4 dosis diarias.',
    emoji: '💉'
  },
  {
    id: 3,
    medication: 'Omeprazol',
    dosage: '20mg',
    frequency: '1 vez al día',
    duration: '30 días',
    doctor: 'Dra. Salazar',
    date: '2025-05-20',
    instructions: 'Tomar en ayunas, 30 minutos antes del desayuno.',
    emoji: '⚕️'
  }
];

export default function PrescriptionsScreen({ navigation }) {
  const [prescriptions, setPrescriptions] = useState(mockPrescriptionsData);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Estados para el formulario
  const [formData, setFormData] = useState({
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    doctor: '',
    instructions: '',
    emoji: '💊'
  });

  const emojis = ['💊', '💉', '⚕️', '🩺', '💊', '🔬', '🧪'];

  const openDetails = (prescription) => {
    setSelectedPrescription(prescription);
    setModalVisible(true);
  };

  const openAddModal = () => {
    setEditMode(false);
    setFormData({
      medication: '',
      dosage: '',
      frequency: '',
      duration: '',
      doctor: '',
      instructions: '',
      emoji: '💊'
    });
    setAddModalVisible(true);
  };

  const openEditModal = (prescription) => {
    setEditMode(true);
    setFormData(prescription);
    setModalVisible(false);
    setAddModalVisible(true);
  };

  const handleSavePrescription = () => {
    if (!formData.medication || !formData.dosage || !formData.frequency) {
      Alert.alert('❌ Error', 'Por favor completa al menos: Medicamento, Dosis y Frecuencia');
      return;
    }

    if (editMode) {
      // Editar receta existente
      setPrescriptions(prescriptions.map(p => 
        p.id === formData.id ? { ...formData } : p
      ));
      Alert.alert('✅ Actualizado', 'Receta modificada exitosamente');
    } else {
      // Agregar nueva receta
      const newPrescription = {
        ...formData,
        id: Date.now(),
        date: new Date().toISOString().split('T')[0]
      };
      setPrescriptions([newPrescription, ...prescriptions]);
      Alert.alert('✅ Agregado', 'Nueva receta guardada');
    }

    setAddModalVisible(false);
  };

  const handleDeletePrescription = (prescriptionId) => {
    Alert.alert(
      '⚠️ Confirmar',
      '¿Estás seguro de eliminar esta receta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setPrescriptions(prescriptions.filter(p => p.id !== prescriptionId));
            setModalVisible(false);
            Alert.alert('✅ Eliminado', 'Receta eliminada correctamente');
          }
        }
      ]
    );
  };

  const generateTextSummary = () => {
    return prescriptions.map((p, i) => 
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 RECETA ${i + 1} DE ${prescriptions.length}
━━━━━━━━━━━━━━━━━━━━━━━━━━━

${p.emoji} ${p.medication}

💊 DOSIS: ${p.dosage}
⏰ FRECUENCIA: ${p.frequency}
📅 DURACIÓN: ${p.duration}

👨‍⚕️ MÉDICO: ${p.doctor}
📆 FECHA: ${p.date}

📝 INSTRUCCIONES:
${p.instructions}

`
    ).join('\n');
  };

  const downloadAllPrescriptions = async () => {
    try {
      const content = `
╔═══════════════════════════════════════╗
║   💊 RECETAS MÉDICAS TELEMED PRO     ║
║   ${prescriptions.length} Recetas Activas                    ║
╚═══════════════════════════════════════╝

${generateTextSummary()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Documento generado por TeleMed Pro
Fecha: ${new Date().toLocaleString('es-ES')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

      const result = await RNShare.share({
        message: content,
        title: 'Recetas Médicas TeleMed Pro'
      });

      if (result.action === RNShare.sharedAction) {
        Alert.alert('✅ ¡Listo!', 'Recetas compartidas exitosamente');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const sendAllPrescriptionsByEmail = async () => {
    try {
      const isAvailable = await MailComposer.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('❌ Error', 'Correo no disponible');
        return;
      }

      await MailComposer.composeAsync({
        recipients: [],
        subject: `${prescriptions.length} Recetas Médicas - TeleMed Pro`,
        body: `RECETAS MÉDICAS - TELEMED PRO\n\n${generateTextSummary()}`
      });
    } catch (error) {
      Alert.alert('❌ Error', 'No se pudo abrir correo');
    }
  };

  const renderPrescription = ({ item }) => (
    <TouchableOpacity onPress={() => openDetails(item)} style={styles.card}>
      <View style={styles.prescriptionCard}>
        <View style={styles.prescriptionIcon}>
          <Text style={styles.iconEmoji}>{item.emoji}</Text>
        </View>
        <View style={styles.prescriptionInfo}>
          <Text style={styles.prescriptionName}>{item.medication}</Text>
          <Text style={styles.prescriptionDosage}>{item.dosage} • {item.frequency}</Text>
          <Text style={styles.prescriptionDoctor}>Recetado por: {item.doctor}</Text>
          <Text style={styles.prescriptionDate}>Fecha: {item.date}</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Recetas Médicas</Text>
        <Text style={styles.headerSubtitle}>{prescriptions.length} recetas activas</Text>
      </View>

      {prescriptions.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📋</Text>
          <Text style={styles.emptyText}>No tienes recetas médicas</Text>
          <Text style={styles.emptySubtext}>Presiona el botón + para agregar una</Text>
        </View>
      ) : (
        <FlatList
          data={prescriptions}
          keyExtractor={item => item.id.toString()}
          renderItem={renderPrescription}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Botón flotante para agregar */}
      <TouchableOpacity style={styles.fabButton} onPress={openAddModal}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {prescriptions.length > 0 && (
        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.pdfButtonBottom} onPress={downloadAllPrescriptions}>
            <Text style={styles.buttonIcon}>📄</Text>
            <Text style={styles.buttonText}>Compartir</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.emailButtonBottom} onPress={sendAllPrescriptionsByEmail}>
            <Text style={styles.buttonIcon}>📧</Text>
            <Text style={styles.buttonText}>Email</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal de Detalles */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalScrollView}>
            <View style={styles.modalContent}>
              {selectedPrescription && (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalIcon}>{selectedPrescription.emoji}</Text>
                    <Text style={styles.modalTitle}>{selectedPrescription.medication}</Text>
                  </View>

                  <View style={styles.detailsBox}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Dosis:</Text>
                      <Text style={styles.detailValue}>{selectedPrescription.dosage}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Frecuencia:</Text>
                      <Text style={styles.detailValue}>{selectedPrescription.frequency}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Duración:</Text>
                      <Text style={styles.detailValue}>{selectedPrescription.duration}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Médico:</Text>
                      <Text style={styles.detailValue}>{selectedPrescription.doctor}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Fecha:</Text>
                      <Text style={styles.detailValue}>{selectedPrescription.date}</Text>
                    </View>
                  </View>

                  <View style={styles.instructionsBox}>
                    <Text style={styles.instructionsTitle}>Instrucciones</Text>
                    <Text style={styles.instructionsText}>{selectedPrescription.instructions}</Text>
                  </View>

                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      style={styles.editButton} 
                      onPress={() => openEditModal(selectedPrescription)}
                    >
                      <Text style={styles.buttonIcon}>✏️</Text>
                      <Text style={styles.buttonText}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.deleteButton} 
                      onPress={() => handleDeletePrescription(selectedPrescription.id)}
                    >
                      <Text style={styles.buttonIcon}>🗑️</Text>
                      <Text style={styles.buttonText}>Eliminar</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                    <Text style={styles.closeButtonText}>Cerrar</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Modal de Agregar/Editar */}
      <Modal
        visible={addModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalScrollView}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editMode ? '✏️ Editar Receta' : '➕ Nueva Receta'}
                </Text>
              </View>

              {/* Selector de emoji */}
              <Text style={styles.formLabel}>Ícono</Text>
              <View style={styles.emojiSelector}>
                {emojis.map((emoji, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.emojiOption,
                      formData.emoji === emoji && styles.emojiSelected
                    ]}
                    onPress={() => setFormData({ ...formData, emoji })}
                  >
                    <Text style={styles.emojiText}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.formLabel}>Medicamento *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Ibuprofeno"
                value={formData.medication}
                onChangeText={(text) => setFormData({ ...formData, medication: text })}
              />

              <Text style={styles.formLabel}>Dosis *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: 400mg"
                value={formData.dosage}
                onChangeText={(text) => setFormData({ ...formData, dosage: text })}
              />

              <Text style={styles.formLabel}>Frecuencia *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Cada 8 horas"
                value={formData.frequency}
                onChangeText={(text) => setFormData({ ...formData, frequency: text })}
              />

              <Text style={styles.formLabel}>Duración</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: 7 días"
                value={formData.duration}
                onChangeText={(text) => setFormData({ ...formData, duration: text })}
              />

              <Text style={styles.formLabel}>Médico</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Dra. Salazar"
                value={formData.doctor}
                onChangeText={(text) => setFormData({ ...formData, doctor: text })}
              />

              <Text style={styles.formLabel}>Instrucciones</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Instrucciones especiales..."
                value={formData.instructions}
                onChangeText={(text) => setFormData({ ...formData, instructions: text })}
                multiline
                numberOfLines={4}
              />

              <TouchableOpacity style={styles.saveButton} onPress={handleSavePrescription}>
                <Text style={styles.saveButtonText}>
                  {editMode ? '💾 Guardar Cambios' : '➕ Agregar Receta'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setAddModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#9C27B0', padding: 20, paddingTop: 50, paddingBottom: 25 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  headerSubtitle: { fontSize: 14, color: '#f3e5f5' },
  listContent: { padding: 15, paddingBottom: 180 },
  card: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 12, padding: 15, elevation: 2 },
  prescriptionCard: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  prescriptionIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#f3e5f5', justifyContent: 'center', alignItems: 'center' },
  iconEmoji: { fontSize: 28 },
  prescriptionInfo: { flex: 1 },
  prescriptionName: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  prescriptionDosage: { fontSize: 14, color: '#666', marginBottom: 4 },
  prescriptionDoctor: { fontSize: 13, color: '#9C27B0', fontWeight: '600', marginBottom: 2 },
  prescriptionDate: { fontSize: 12, color: '#999' },
  arrow: { fontSize: 24, color: '#ccc' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
  emptyEmoji: { fontSize: 80, marginBottom: 20 },
  emptyText: { fontSize: 20, fontWeight: 'bold', color: '#666', marginBottom: 10 },
  emptySubtext: { fontSize: 14, color: '#999' },
  fabButton: { position: 'absolute', bottom: 200, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#9C27B0', justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4 },
  fabIcon: { fontSize: 32, color: '#fff', fontWeight: 'bold' },
  bottomButtons: { position: 'absolute', bottom: 70, left: 15, right: 15, flexDirection: 'row', gap: 12 },
  pdfButtonBottom: { flex: 1, backgroundColor: '#2196F3', padding: 18, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, elevation: 8 },
  emailButtonBottom: { flex: 1, backgroundColor: '#4CAF50', padding: 18, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, elevation: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalScrollView: { maxHeight: '90%' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalHeader: { alignItems: 'center', marginBottom: 24 },
  modalIcon: { fontSize: 60, marginBottom: 12 },
  modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  detailsBox: { backgroundColor: '#f3e5f5', padding: 16, borderRadius: 12, marginBottom: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#e1bee7' },
  detailLabel: { fontSize: 14, color: '#666', fontWeight: '600' },
  detailValue: { fontSize: 14, color: '#333', fontWeight: 'bold' },
  instructionsBox: { backgroundColor: '#fff3e0', padding: 16, borderRadius: 12, marginBottom: 20 },
  instructionsTitle: { fontSize: 16, fontWeight: 'bold', color: '#FF9800', marginBottom: 8 },
  instructionsText: { fontSize: 14, color: '#555', lineHeight: 22 },
  actionButtons: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  editButton: { flex: 1, backgroundColor: '#FF9800', padding: 16, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  deleteButton: { flex: 1, backgroundColor: '#F44336', padding: 16, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  buttonIcon: { fontSize: 20 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  closeButton: { backgroundColor: '#f0f0f0', padding: 16, borderRadius: 12, alignItems: 'center' },
  closeButtonText: { color: '#666', fontWeight: 'bold', fontSize: 15 },
  formLabel: { fontSize: 14, fontWeight: 'bold', color: '#666', marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8, fontSize: 16, borderWidth: 1, borderColor: '#e0e0e0' },
  textArea: { height: 100, textAlignVertical: 'top' },
  emojiSelector: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 10 },
  emojiOption: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#e0e0e0' },
  emojiSelected: { borderColor: '#9C27B0', backgroundColor: '#f3e5f5' },
  emojiText: { fontSize: 28 },
  saveButton: { backgroundColor: '#4CAF50', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cancelButton: { backgroundColor: '#f0f0f0', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  cancelButtonText: { color: '#666', fontWeight: 'bold', fontSize: 15 }
});