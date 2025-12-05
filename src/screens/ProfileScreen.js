import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  Linking, 
  Modal,
  TextInput
} from 'react-native';

export default function ProfileScreen({ navigation }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [showMedicalModal, setShowMedicalModal] = useState(false);
  const [showPersonalModal, setShowPersonalModal] = useState(false);
  
  const [userProfile, setUserProfile] = useState({
    name: 'Juan Perez',
    email: 'juan.perez@email.com',
    phone: '+56912345678',
    birthDate: '15/03/1990',
    bloodType: 'O+',
    address: 'Av. Principal 123, Santiago, Chile',
    allergies: ['Penicilina', 'Polen'],
    conditions: ['Hipertension', 'Diabetes tipo 2'],
    emergencyContacts: [
      { name: 'Maria Rodas', relation: 'Hija', phone: '+56987654321' },
      { name: 'Carmen Lopez', relation: 'Cuidadora', phone: '+56955551234' }
    ]
  });

  const [editName, setEditName] = useState(userProfile.name);
  const [editEmail, setEditEmail] = useState(userProfile.email);
  const [editPhone, setEditPhone] = useState(userProfile.phone);
  const [editBirthDate, setEditBirthDate] = useState(userProfile.birthDate);
  const [editBloodType, setEditBloodType] = useState(userProfile.bloodType);
  const [editAddress, setEditAddress] = useState(userProfile.address);

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleEditContacts = () => {
    setShowEditModal(false);
    setTimeout(() => setShowContactsModal(true), 300);
  };

  const handleEditMedical = () => {
    setShowEditModal(false);
    setTimeout(() => setShowMedicalModal(true), 300);
  };

  const handleEditPersonal = () => {
    setShowEditModal(false);
    setEditName(userProfile.name);
    setEditEmail(userProfile.email);
    setEditPhone(userProfile.phone);
    setEditBirthDate(userProfile.birthDate);
    setEditBloodType(userProfile.bloodType);
    setEditAddress(userProfile.address);
    setTimeout(() => setShowPersonalModal(true), 300);
  };

  const savePersonalData = () => {
    setUserProfile({
      ...userProfile,
      name: editName,
      email: editEmail,
      phone: editPhone,
      birthDate: editBirthDate,
      bloodType: editBloodType,
      address: editAddress
    });
    setShowPersonalModal(false);
    Alert.alert('Exito', 'Datos personales actualizados correctamente');
  };

  const addAllergy = () => {
    Alert.prompt(
      'Agregar Alergia',
      'Ingresa el nombre de la alergia:',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Agregar',
          onPress: (text) => {
            if (text && text.trim()) {
              setUserProfile({
                ...userProfile,
                allergies: [...userProfile.allergies, text.trim()]
              });
              Alert.alert('Exito', 'Alergia agregada correctamente');
            }
          }
        }
      ],
      'plain-text'
    );
  };

  const removeAllergy = (index) => {
    Alert.alert(
      'Eliminar Alergia',
      'Estas seguro de eliminar esta alergia?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            const newAllergies = userProfile.allergies.filter((_, i) => i !== index);
            setUserProfile({ ...userProfile, allergies: newAllergies });
            Alert.alert('Exito', 'Alergia eliminada');
          }
        }
      ]
    );
  };

  const addCondition = () => {
    Alert.prompt(
      'Agregar Condicion',
      'Ingresa el nombre de la condicion medica:',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Agregar',
          onPress: (text) => {
            if (text && text.trim()) {
              setUserProfile({
                ...userProfile,
                conditions: [...userProfile.conditions, text.trim()]
              });
              Alert.alert('Exito', 'Condicion agregada correctamente');
            }
          }
        }
      ],
      'plain-text'
    );
  };

  const removeCondition = (index) => {
    Alert.alert(
      'Eliminar Condicion',
      'Estas seguro de eliminar esta condicion?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            const newConditions = userProfile.conditions.filter((_, i) => i !== index);
            setUserProfile({ ...userProfile, conditions: newConditions });
            Alert.alert('Exito', 'Condicion eliminada');
          }
        }
      ]
    );
  };

  const addContact = () => {
    Alert.alert('Agregar Contacto', 'Funcionalidad de agregar contacto completo en desarrollo');
  };

  const removeContact = (index) => {
    Alert.alert(
      'Eliminar Contacto',
      'Estas seguro de eliminar este contacto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            const newContacts = userProfile.emergencyContacts.filter((_, i) => i !== index);
            setUserProfile({ ...userProfile, emergencyContacts: newContacts });
            Alert.alert('Exito', 'Contacto eliminado');
          }
        }
      ]
    );
  };

  const handleAllergies = () => {
    const allergiesList = userProfile.allergies.join('\n- ');
    Alert.alert(
      'Mis Alergias',
      'Tienes ' + userProfile.allergies.length + ' alergias registradas:\n\n- ' + allergiesList,
      [
        { text: 'Agregar Nueva', onPress: addAllergy },
        { text: 'Cerrar' }
      ]
    );
  };

  const handleConditions = () => {
    const conditionsList = userProfile.conditions.join('\n- ');
    Alert.alert(
      'Condiciones Medicas',
      'Tienes ' + userProfile.conditions.length + ' condiciones registradas:\n\n- ' + conditionsList,
      [
        { text: 'Agregar Nueva', onPress: addCondition },
        { text: 'Cerrar' }
      ]
    );
  };

  const handleViewAllContacts = () => {
    setShowContactsModal(true);
  };

  const handleCall = (phone, name) => {
    Alert.alert(
      'Llamar a ' + name,
      'Deseas llamar a ' + phone + '?',
      [
        {
          text: 'Llamar',
          onPress: () => {
            Linking.openURL('tel:' + phone).catch(() => {
              Alert.alert('Error', 'No se pudo realizar la llamada');
            });
          }
        },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesion',
      'Estas seguro de que deseas cerrar sesion?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesion',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Exito', 'Sesion cerrada correctamente');
            setTimeout(() => {
              navigation.replace('Login');
            }, 1000);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>JP</Text>
          </View>
          <Text style={styles.userName}>{userProfile.name}</Text>
          <Text style={styles.userEmail}>{userProfile.email}</Text>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informacion Personal</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>TELEFONO</Text>
              <Text style={styles.infoValue}>{userProfile.phone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>FECHA NAC.</Text>
              <Text style={styles.infoValue}>{userProfile.birthDate}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>TIPO SANGRE</Text>
              <Text style={styles.infoValue}>{userProfile.bloodType}</Text>
            </View>
            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.infoLabel}>DIRECCION</Text>
              <Text style={styles.infoValue}>{userProfile.address}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informacion Medica</Text>
          
          <TouchableOpacity style={styles.medicalCard} onPress={handleAllergies}>
            <View style={styles.medicalIcon}>
              <Text style={styles.medicalIconText}>!</Text>
            </View>
            <View style={styles.medicalInfo}>
              <Text style={styles.medicalTitle}>Alergias</Text>
              <Text style={styles.medicalSubtitle}>{userProfile.allergies.length} registradas</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.medicalCard} onPress={handleConditions}>
            <View style={styles.medicalIcon}>
              <Text style={styles.medicalIconText}>+</Text>
            </View>
            <View style={styles.medicalInfo}>
              <Text style={styles.medicalTitle}>Condiciones Medicas</Text>
              <Text style={styles.medicalSubtitle}>{userProfile.conditions.length} condiciones</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Contactos de Emergencia</Text>
            <TouchableOpacity onPress={handleViewAllContacts}>
              <Text style={styles.viewAll}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          {userProfile.emergencyContacts.map((contact, index) => (
            <View key={index} style={styles.contactCard}>
              <View style={styles.contactAvatar}>
                <Text style={styles.contactAvatarText}>{contact.name.charAt(0)}</Text>
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactRelation}>{contact.relation}</Text>
                <Text style={styles.contactPhone}>{contact.phone}</Text>
              </View>
              <TouchableOpacity
                style={styles.callButton}
                onPress={() => handleCall(contact.phone, contact.name)}
              >
                <Text style={styles.callButtonText}>LLAMAR</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Cerrar Sesion</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpace} />
      </ScrollView>
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowEditModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowEditModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>
            <Text style={styles.modalSubtitle}>Selecciona que deseas editar:</Text>

            <TouchableOpacity style={styles.modalButton} onPress={handleEditContacts}>
              <Text style={styles.modalButtonText}>CONTACTOS</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButton} onPress={handleEditMedical}>
              <Text style={styles.modalButtonText}>INFORMACION MEDICA</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButton} onPress={handleEditPersonal}>
              <Text style={styles.modalButtonText}>DATOS PERSONALES</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalButtonCancel} 
              onPress={() => setShowEditModal(false)}
            >
              <Text style={styles.modalButtonCancelText}>CANCELAR</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showContactsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowContactsModal(false)}
      >
        <View style={styles.fullModalOverlay}>
          <View style={styles.fullModalContent}>
            <View style={styles.fullModalHeader}>
              <Text style={styles.fullModalTitle}>Contactos de Emergencia</Text>
              <TouchableOpacity onPress={() => setShowContactsModal(false)}>
                <Text style={styles.closeButton}>X</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.fullModalScroll}>
              {userProfile.emergencyContacts.map((contact, index) => (
                <View key={index} style={styles.editContactCard}>
                  <View style={styles.contactAvatar}>
                    <Text style={styles.contactAvatarText}>{contact.name.charAt(0)}</Text>
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    <Text style={styles.contactRelation}>{contact.relation}</Text>
                    <Text style={styles.contactPhone}>{contact.phone}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => removeContact(index)}
                  >
                    <Text style={styles.deleteButtonText}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.addButton} onPress={addContact}>
              <Text style={styles.addButtonText}>+ Agregar Contacto</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showMedicalModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMedicalModal(false)}
      >
        <View style={styles.fullModalOverlay}>
          <View style={styles.fullModalContent}>
            <View style={styles.fullModalHeader}>
              <Text style={styles.fullModalTitle}>Informacion Medica</Text>
              <TouchableOpacity onPress={() => setShowMedicalModal(false)}>
                <Text style={styles.closeButton}>X</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.fullModalScroll}>
              <Text style={styles.medicalSectionTitle}>Alergias</Text>
              {userProfile.allergies.map((allergy, index) => (
                <View key={index} style={styles.medicalItem}>
                  <Text style={styles.medicalItemText}>{allergy}</Text>
                  <TouchableOpacity onPress={() => removeAllergy(index)}>
                    <Text style={styles.deleteButtonText}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity style={styles.addButton} onPress={addAllergy}>
                <Text style={styles.addButtonText}>+ Agregar Alergia</Text>
              </TouchableOpacity>

              <Text style={[styles.medicalSectionTitle, { marginTop: 30 }]}>Condiciones Medicas</Text>
              {userProfile.conditions.map((condition, index) => (
                <View key={index} style={styles.medicalItem}>
                  <Text style={styles.medicalItemText}>{condition}</Text>
                  <TouchableOpacity onPress={() => removeCondition(index)}>
                    <Text style={styles.deleteButtonText}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity style={styles.addButton} onPress={addCondition}>
                <Text style={styles.addButtonText}>+ Agregar Condicion</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showPersonalModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPersonalModal(false)}
      >
        <View style={styles.fullModalOverlay}>
          <View style={styles.fullModalContent}>
            <View style={styles.fullModalHeader}>
              <Text style={styles.fullModalTitle}>Datos Personales</Text>
              <TouchableOpacity onPress={() => setShowPersonalModal(false)}>
                <Text style={styles.closeButton}>X</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.fullModalScroll}>
              <Text style={styles.inputLabel}>Nombre Completo</Text>
              <TextInput
                style={styles.input}
                value={editName}
                onChangeText={setEditName}
                placeholder="Nombre completo"
              />

              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={editEmail}
                onChangeText={setEditEmail}
                placeholder="Email"
                keyboardType="email-address"
              />

              <Text style={styles.inputLabel}>Telefono</Text>
              <TextInput
                style={styles.input}
                value={editPhone}
                onChangeText={setEditPhone}
                placeholder="Telefono"
                keyboardType="phone-pad"
              />

              <Text style={styles.inputLabel}>Fecha de Nacimiento</Text>
              <TextInput
                style={styles.input}
                value={editBirthDate}
                onChangeText={setEditBirthDate}
                placeholder="DD/MM/AAAA"
              />

              <Text style={styles.inputLabel}>Tipo de Sangre</Text>
              <TextInput
                style={styles.input}
                value={editBloodType}
                onChangeText={setEditBloodType}
                placeholder="Tipo de sangre"
              />

              <Text style={styles.inputLabel}>Direccion</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editAddress}
                onChangeText={setEditAddress}
                placeholder="Direccion completa"
                multiline
                numberOfLines={3}
              />
            </ScrollView>

            <TouchableOpacity style={styles.saveButton} onPress={savePersonalData}>
              <Text style={styles.saveButtonText}>Guardar Cambios</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: '#0088CC',
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center'
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#0088CC'
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5
  },
  userEmail: {
    fontSize: 14,
    color: '#B3E5FC',
    marginBottom: 15
  },
  editButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20
  },
  editButtonText: {
    color: '#0088CC',
    fontWeight: 'bold',
    fontSize: 14
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 15
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  viewAll: {
    fontSize: 14,
    color: '#0088CC',
    fontWeight: '600'
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    elevation: 2
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600'
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right'
  },
  medicalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2
  },
  medicalIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  medicalIconText: {
    fontSize: 24,
    color: '#FF9800'
  },
  medicalInfo: {
    flex: 1
  },
  medicalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4
  },
  medicalSubtitle: {
    fontSize: 14,
    color: '#999'
  },
  arrow: {
    fontSize: 24,
    color: '#ccc'
  },
  contactCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2
  },
  contactAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  contactAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0088CC'
  },
  contactInfo: {
    flex: 1
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2
  },
  contactRelation: {
    fontSize: 14,
    color: '#0088CC',
    marginBottom: 4
  },
  contactPhone: {
    fontSize: 13,
    color: '#666'
  },
  callButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20
  },
  callButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12
  },
  logoutButton: {
    backgroundColor: '#f44336',
    marginHorizontal: 15,
    marginTop: 30,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center'
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  bottomSpace: {
    height: 100
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '85%',
    maxWidth: 400
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20
  },
  modalButton: {
    backgroundColor: '#fff',
    borderWidth: 0,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'flex-end'
  },
  modalButtonText: {
    color: '#0088CC',
    fontSize: 14,
    fontWeight: '600'
  },
  modalButtonCancel: {
    backgroundColor: '#fff',
    borderWidth: 0,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 5,
    alignItems: 'flex-end'
  },
  modalButtonCancelText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '600'
  },
  fullModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  fullModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '85%',
    paddingTop: 20
  },
  fullModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  fullModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333'
  },
  closeButton: {
    fontSize: 24,
    color: '#999',
    fontWeight: 'bold'
  },
  fullModalScroll: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20
  },
  editContactCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  deleteButton: {
    backgroundColor: '#ffebee',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15
  },
  deleteButtonText: {
    color: '#f44336',
    fontSize: 12,
    fontWeight: 'bold'
  },
  addButton: {
    backgroundColor: '#0088CC',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    margin: 20
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  medicalSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15
  },
  medicalItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  medicalItemText: {
    fontSize: 16,
    color: '#333',
    flex: 1
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginTop: 15
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top'
  },
  saveButton: {
    backgroundColor: '#0088CC',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    margin: 20
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

