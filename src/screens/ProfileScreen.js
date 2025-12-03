import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
  Image,
  Linking
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen({ navigation }) {
  const [profileData, setProfileData] = useState({
    fullName: 'Kevin Rodas',
    email: 'kevin@example.com',
    phone: '+56 9 1234 5678',
    birthDate: '15/03/1990',
    bloodType: 'O+',
    address: 'Av. Principal 123, Santiago, Chile',
    profileImage: null
  });

  const [medicalInfo, setMedicalInfo] = useState({
    allergies: ['Penicilina', 'Mariscos'],
    conditions: ['Hipertensión', 'Diabetes tipo 2'],
    medications: ['Omeprazol 20mg', 'Metformina 850mg']
  });

  const [emergencyContacts, setEmergencyContacts] = useState([
    { id: 1, name: 'María Rodas', relationship: 'Hija', phone: '+56987654321', emoji: '👧' },
    { id: 2, name: 'Carmen López', relationship: 'Cuidadora', phone: '+56955551234', emoji: '👩‍⚕️' },
    { id: 3, name: 'Dr. Silva', relationship: 'Médico', phone: '+56999998888', emoji: '👨‍⚕️' }
  ]);

  const [personalInfoVisible, setPersonalInfoVisible] = useState(false);
  const [allergiesVisible, setAllergiesVisible] = useState(false);
  const [conditionsVisible, setConditionsVisible] = useState(false);
  const [emergencyContactsVisible, setEmergencyContactsVisible] = useState(false);
  const [contactFormVisible, setContactFormVisible] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  const [tempContact, setTempContact] = useState({ name: '', relationship: '', phone: '', emoji: '👤' });

  const contactEmojis = ['👧', '👦', '👨', '👩', '👴', '👵', '👨‍⚕️', '👩‍⚕️', '👤', '🚑'];

  const handleChangePhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled) {
        setProfileData({ ...profileData, profileImage: result.assets[0].uri });
        Alert.alert('✅ Éxito', 'Foto actualizada');
      }
    } catch (error) {
      Alert.alert('❌ Error', 'No se pudo cambiar la foto');
    }
  };

  const handleCall = (contact) => {
    Alert.alert(
      `📞 Llamar a ${contact.name}`,
      `${contact.relationship}\n${contact.phone}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Llamar', onPress: () => Linking.openURL(`tel:${contact.phone}`) }
      ]
    );
  };

  const handleSaveContact = () => {
    if (!tempContact.name || !tempContact.phone) {
      Alert.alert('❌ Error', 'Completa nombre y teléfono');
      return;
    }
    if (editingContact) {
      setEmergencyContacts(emergencyContacts.map(c => c.id === editingContact.id ? { ...tempContact, id: c.id } : c));
      Alert.alert('✅ Actualizado');
    } else {
      setEmergencyContacts([...emergencyContacts, { ...tempContact, id: Date.now() }]);
      Alert.alert('✅ Agregado');
    }
    setContactFormVisible(false);
    setTempContact({ name: '', relationship: '', phone: '', emoji: '👤' });
  };

  const handleDeleteContact = (contactId) => {
    Alert.alert('⚠️ Confirmar', '¿Eliminar este contacto?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => {
        setEmergencyContacts(emergencyContacts.filter(c => c.id !== contactId));
        Alert.alert('✅ Eliminado');
      }}
    ]);
  };

  const openEditContact = (contact) => {
    setEditingContact(contact);
    setTempContact(contact);
    setContactFormVisible(true);
  };

  const openAddContact = () => {
    setEditingContact(null);
    setTempContact({ name: '', relationship: '', phone: '', emoji: '👤' });
    setContactFormVisible(true);
  };

  const handleAddAllergy = () => {
    Alert.prompt('⚠️ Nueva Alergia', 'Ingresa el nombre:', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Agregar', onPress: (text) => {
        if (text?.trim()) setMedicalInfo({ ...medicalInfo, allergies: [...medicalInfo.allergies, text.trim()] });
      }}
    ]);
  };

  const handleRemoveAllergy = (index) => {
    setMedicalInfo({ ...medicalInfo, allergies: medicalInfo.allergies.filter((_, i) => i !== index) });
  };

  const handleAddCondition = () => {
    Alert.prompt('🩺 Nueva Condición', 'Ingresa la condición:', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Agregar', onPress: (text) => {
        if (text?.trim()) setMedicalInfo({ ...medicalInfo, conditions: [...medicalInfo.conditions, text.trim()] });
      }}
    ]);
  };

  const handleRemoveCondition = (index) => {
    setMedicalInfo({ ...medicalInfo, conditions: medicalInfo.conditions.filter((_, i) => i !== index) });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleChangePhoto}>
          <View style={styles.profileImageContainer}>
            {profileData.profileImage ? (
              <Image source={{ uri: profileData.profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profilePlaceholderIcon}>👤</Text>
              </View>
            )}
            <View style={styles.cameraButton}>
              <Text style={styles.cameraIcon}>📷</Text>
            </View>
          </View>
        </TouchableOpacity>
        <Text style={styles.profileName}>{profileData.fullName}</Text>
        <Text style={styles.profileEmail}>{profileData.email}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          <TouchableOpacity onPress={() => setPersonalInfoVisible(true)}>
            <Text style={styles.editLink}>✏️ Editar</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <InfoItem label="NOMBRE" value={profileData.fullName} />
          <InfoItem label="EMAIL" value={profileData.email} />
          <InfoItem label="TELÉFONO" value={profileData.phone} />
          <InfoItem label="FECHA NAC." value={profileData.birthDate} />
          <InfoItem label="TIPO SANGRE" value={profileData.bloodType} icon="🩸" />
          <InfoItem label="DIRECCIÓN" value={profileData.address} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información Médica</Text>
        <TouchableOpacity style={styles.menuItem} onPress={() => setAllergiesVisible(true)}>
          <Text style={styles.menuIcon}>⚠️</Text>
          <View style={styles.menuContent}>
            <Text style={styles.menuText}>Alergias</Text>
            <Text style={styles.menuSubtext}>{medicalInfo.allergies.length} registradas</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => setConditionsVisible(true)}>
          <Text style={styles.menuIcon}>🩹</Text>
          <View style={styles.menuContent}>
            <Text style={styles.menuText}>Condiciones Médicas</Text>
            <Text style={styles.menuSubtext}>{medicalInfo.conditions.length} condiciones</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Contactos de Emergencia</Text>
          <TouchableOpacity onPress={() => setEmergencyContactsVisible(true)}>
            <Text style={styles.viewAllLink}>Ver todos ›</Text>
          </TouchableOpacity>
        </View>
        {emergencyContacts.slice(0, 2).map(contact => (
          <TouchableOpacity key={contact.id} style={styles.contactCard} onPress={() => handleCall(contact)}>
            <View style={styles.contactIcon}>
              <Text style={styles.contactEmoji}>{contact.emoji}</Text>
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactRelationship}>{contact.relationship}</Text>
              <Text style={styles.contactPhone}>{contact.phone}</Text>
            </View>
            <TouchableOpacity style={styles.callButton} onPress={() => handleCall(contact)}>
              <Text style={styles.callButtonIcon}>📞</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutIcon}>🚪</Text>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
      <View style={styles.footer} />      <Modal visible={personalInfoVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalScroll}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>✏️ Editar Información</Text>
              <Text style={styles.inputLabel}>Nombre Completo</Text>
              <TextInput style={styles.input} value={profileData.fullName} onChangeText={(text) => setProfileData({ ...profileData, fullName: text })} />
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput style={styles.input} value={profileData.email} onChangeText={(text) => setProfileData({ ...profileData, email: text })} keyboardType="email-address" />
              <Text style={styles.inputLabel}>Teléfono</Text>
              <TextInput style={styles.input} value={profileData.phone} onChangeText={(text) => setProfileData({ ...profileData, phone: text })} keyboardType="phone-pad" />
              <Text style={styles.inputLabel}>Fecha Nacimiento</Text>
              <TextInput style={styles.input} value={profileData.birthDate} onChangeText={(text) => setProfileData({ ...profileData, birthDate: text })} />
              <Text style={styles.inputLabel}>Tipo de Sangre</Text>
              <TextInput style={styles.input} value={profileData.bloodType} onChangeText={(text) => setProfileData({ ...profileData, bloodType: text })} />
              <Text style={styles.inputLabel}>Dirección</Text>
              <TextInput style={[styles.input, styles.textArea]} value={profileData.address} onChangeText={(text) => setProfileData({ ...profileData, address: text })} multiline />
              <TouchableOpacity style={styles.saveButton} onPress={() => { setPersonalInfoVisible(false); Alert.alert('✅ Guardado'); }}>
                <Text style={styles.saveButtonText}>💾 Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setPersonalInfoVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      <Modal visible={allergiesVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>⚠️ Alergias</Text>
            <ScrollView style={styles.tagsList}>
              {medicalInfo.allergies.map((allergy, index) => (
                <View key={index} style={styles.allergyTag}>
                  <Text style={styles.allergyText}>{allergy}</Text>
                  <TouchableOpacity onPress={() => handleRemoveAllergy(index)}>
                    <Text style={styles.allergyRemove}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.addButton} onPress={handleAddAllergy}>
              <Text style={styles.addButtonText}>➕ Agregar Alergia</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setAllergiesVisible(false)}>
              <Text style={styles.cancelButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={conditionsVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🩹 Condiciones Médicas</Text>
            <ScrollView style={styles.tagsList}>
              {medicalInfo.conditions.map((condition, index) => (
                <View key={index} style={styles.conditionTag}>
                  <Text style={styles.conditionText}>{condition}</Text>
                  <TouchableOpacity onPress={() => handleRemoveCondition(index)}>
                    <Text style={styles.conditionRemove}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.addButton} onPress={handleAddCondition}>
              <Text style={styles.addButtonText}>➕ Agregar Condición</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setConditionsVisible(false)}>
              <Text style={styles.cancelButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={emergencyContactsVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🚨 Contactos Emergencia</Text>
              <TouchableOpacity onPress={openAddContact}>
                <Text style={styles.addContactButton}>➕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.contactsList}>
              {emergencyContacts.map(contact => (
                <View key={contact.id} style={styles.fullContactCard}>
                  <View style={styles.contactIcon}>
                    <Text style={styles.contactEmoji}>{contact.emoji}</Text>
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    <Text style={styles.contactRelationship}>{contact.relationship}</Text>
                    <Text style={styles.contactPhone}>{contact.phone}</Text>
                  </View>
                  <View style={styles.contactActions}>
                    <TouchableOpacity style={styles.actionButton} onPress={() => handleCall(contact)}>
                      <Text style={styles.actionIcon}>📞</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={() => openEditContact(contact)}>
                      <Text style={styles.actionIcon}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={() => handleDeleteContact(contact.id)}>
                      <Text style={styles.actionIcon}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setEmergencyContactsVisible(false)}>
              <Text style={styles.cancelButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={contactFormVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <ScrollView>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{editingContact ? '✏️ Editar' : '➕ Nuevo Contacto'}</Text>
              <Text style={styles.inputLabel}>Ícono</Text>
              <View style={styles.emojiGrid}>
                {contactEmojis.map((emoji, index) => (
                  <TouchableOpacity key={index} style={[styles.emojiButton, tempContact.emoji === emoji && styles.emojiSelected]} onPress={() => setTempContact({ ...tempContact, emoji })}>
                    <Text style={styles.emojiChar}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.inputLabel}>Nombre *</Text>
              <TextInput style={styles.input} placeholder="Ej: María Rodas" value={tempContact.name} onChangeText={(text) => setTempContact({ ...tempContact, name: text })} />
              <Text style={styles.inputLabel}>Relación</Text>
              <TextInput style={styles.input} placeholder="Ej: Hija, Cuidadora" value={tempContact.relationship} onChangeText={(text) => setTempContact({ ...tempContact, relationship: text })} />
              <Text style={styles.inputLabel}>Teléfono *</Text>
              <TextInput style={styles.input} placeholder="+56987654321" value={tempContact.phone} onChangeText={(text) => setTempContact({ ...tempContact, phone: text })} keyboardType="phone-pad" />
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveContact}>
                <Text style={styles.saveButtonText}>{editingContact ? '💾 Guardar' : '➕ Agregar'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setContactFormVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

const InfoItem = ({ label, value, icon }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{icon ? `${icon} ` : ''}{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#0088CC', paddingTop: 60, paddingBottom: 30, alignItems: 'center' },
  profileImageContainer: { position: 'relative', marginBottom: 15 },
  profileImage: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: '#fff' },
  profileImagePlaceholder: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  profilePlaceholderIcon: { fontSize: 60, color: '#ccc' },
  cameraButton: { position: 'absolute', bottom: 0, right: 0, width: 40, height: 40, borderRadius: 20, backgroundColor: '#4CAF50', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff' },
  cameraIcon: { fontSize: 18 },
  profileName: { fontSize: 26, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  profileEmail: { fontSize: 14, color: '#B3E5FC' },
  section: { paddingHorizontal: 15, paddingTop: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  editLink: { fontSize: 14, color: '#0088CC', fontWeight: '600' },
  viewAllLink: { fontSize: 14, color: '#0088CC', fontWeight: '600' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, elevation: 2, marginBottom: 15 },
  infoItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  infoLabel: { fontSize: 12, color: '#999', fontWeight: '600', marginBottom: 4 },
  infoValue: { fontSize: 16, color: '#333', fontWeight: 'bold' },
  menuItem: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center', elevation: 2 },
  menuIcon: { fontSize: 28, marginRight: 15 },
  menuContent: { flex: 1 },
  menuText: { fontSize: 16, fontWeight: '600', color: '#333' },
  menuSubtext: { fontSize: 13, color: '#666', marginTop: 2 },
  menuArrow: { fontSize: 24, color: '#ccc' },
  contactCard: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 12, flexDirection: 'row', alignItems: 'center', elevation: 2 },
  contactIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  contactEmoji: { fontSize: 28 },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 2 },
  contactRelationship: { fontSize: 13, color: '#0088CC', marginBottom: 4 },
  contactPhone: { fontSize: 13, color: '#666' },
  callButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#4CAF50', justifyContent: 'center', alignItems: 'center' },
  callButtonIcon: { fontSize: 20 },
  logoutButton: { margin: 15, marginTop: 30, backgroundColor: '#F44336', padding: 16, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  logoutIcon: { fontSize: 20 },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  footer: { height: 100 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalScroll: { maxHeight: '90%' },
  modalContent: { backgroundColor: '#fff', borderRadius: 20, padding: 24, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  addContactButton: { fontSize: 28, color: '#4CAF50' },
  inputLabel: { fontSize: 14, fontWeight: 'bold', color: '#666', marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8, fontSize: 16, borderWidth: 1, borderColor: '#e0e0e0' },
  textArea: { height: 80, textAlignVertical: 'top' },
  tagsList: { maxHeight: 300, marginBottom: 15 },
  allergyTag: { flexDirection: 'row', backgroundColor: '#FFE5E5', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 20, alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  allergyText: { fontSize: 15, color: '#F44336', fontWeight: '600', flex: 1 },
  allergyRemove: { fontSize: 24, color: '#F44336', fontWeight: 'bold', marginLeft: 10 },
  conditionTag: { flexDirection: 'row', backgroundColor: '#E3F2FD', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 20, alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  conditionText: { fontSize: 15, color: '#0088CC', fontWeight: '600', flex: 1 },
  conditionRemove: { fontSize: 24, color: '#0088CC', fontWeight: 'bold', marginLeft: 10 },
  contactsList: { maxHeight: 400, marginBottom: 15 },
  fullContactCard: { backgroundColor: '#f8f8f8', borderRadius: 12, padding: 15, marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
  contactActions: { flexDirection: 'row', gap: 8 },
  actionButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  actionIcon: { fontSize: 18 },
  emojiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 15 },
  emojiButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#e0e0e0' },
  emojiSelected: { borderColor: '#0088CC', backgroundColor: '#E3F2FD' },
  emojiChar: { fontSize: 28 },
  addButton: { backgroundColor: '#4CAF50', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 10 },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  saveButton: { backgroundColor: '#4CAF50', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cancelButton: { backgroundColor: '#f0f0f0', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  cancelButtonText: { color: '#666', fontWeight: 'bold', fontSize: 15 }
});