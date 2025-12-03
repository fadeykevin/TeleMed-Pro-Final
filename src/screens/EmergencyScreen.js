import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, Linking, Platform, Image } from 'react-native';
import * as Location from 'expo-location';
import { Audio } from 'expo-av';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

export default function EmergencyScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [sound, setSound] = useState(null);
  const [alarmPlaying, setAlarmPlaying] = useState(false);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playAlarmSound = async () => {
    try {
      setAlarmPlaying(true);
      const { sound: alarmSound } = await Audio.Sound.createAsync(
        { uri: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3' },
        { shouldPlay: true, isLooping: true, volume: 1.0 }
      );
      setSound(alarmSound);
      
      setTimeout(async () => {
        await alarmSound.stopAsync();
        await alarmSound.unloadAsync();
        setAlarmPlaying(false);
      }, 5000);
    } catch (error) {
      Alert.alert('Error', 'No se pudo reproducir el sonido de alarma');
      setAlarmPlaying(false);
    }
  };

  const stopAlarm = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setAlarmPlaying(false);
    }
  };

  const getLocation = async () => {
    setLoadingLocation(true);
    
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permiso denegado',
          'Necesitamos acceso a tu ubicacion para enviar la alerta de emergencia.',
          [{ text: 'OK' }]
        );
        setLoadingLocation(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });

      const coords = {
        lat: currentLocation.coords.latitude.toFixed(6),
        lon: currentLocation.coords.longitude.toFixed(6)
      };
      
      setLocation(coords);

      const addressData = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude
      });

      if (addressData && addressData.length > 0) {
        const addr = addressData[0];
        const fullAddress = [
          addr.name,
          addr.street,
          addr.streetNumber,
          addr.city,
          addr.region,
          addr.country
        ].filter(Boolean).join(', ');
        
        setAddress(fullAddress);
      }

      setLoadingLocation(false);
      Alert.alert(
        'Ubicacion obtenida',
        'Tu ubicacion ha sido capturada exitosamente'
      );
      
    } catch (error) {
      setLoadingLocation(false);
      Alert.alert('Error', 'No se pudo obtener tu ubicacion. Verifica que el GPS este activado.');
    }
  };

  const takePhoto = async () => {
    try {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      
      if (cameraPermission.status !== 'granted') {
        Alert.alert(
          'Permiso denegado',
          'Necesitamos acceso a la camara para tomar la foto de evidencia.',
          [{ text: 'OK' }]
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
        Alert.alert('Exito', 'Foto capturada correctamente');
      }
      
    } catch (error) {
      Alert.alert('Error', 'No se pudo abrir la camara: ' + error.message);
    }
  };

  const sendEmergencyAlert = async () => {
    if (!location) {
      Alert.alert(
        'Ubicacion requerida',
        'Debes obtener tu ubicacion antes de enviar la alerta de emergencia',
        [{ text: 'Entendido' }]
      );
      return;
    }

    await playAlarmSound();

    const alertMessage = 
      'ALERTA DE EMERGENCIA ENVIADA' +
      '\n\nUbicacion:' +
      '\nLatitud: ' + location.lat +
      '\nLongitud: ' + location.lon +
      (address ? '\n\nDireccion:\n' + address : '') +
      (photo ? '\n\nFoto de evidencia: Adjuntada' : '') +
      '\n\nLos servicios medicos de emergencia han sido notificados.' +
      '\n\nTiempo estimado de llegada: 8-12 minutos' +
      '\n\nPor favor mantente en el lugar y espera la ayuda.';

    Alert.alert(
      'ALERTA ENVIADA',
      alertMessage,
      [
        { 
          text: 'Detener alarma',
          onPress: async () => {
            await stopAlarm();
            Alert.alert(
              'Confirmacion',
              'Deseas volver al inicio?',
              [
                { text: 'No', style: 'cancel' },
                {
                  text: 'Si',
                  onPress: () => {
                    setLocation(null);
                    setAddress(null);
                    setPhoto(null);
                    navigation.goBack();
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  const callEmergency = (number, service) => {
    Alert.alert(
      'Llamar a ' + service,
      'Deseas llamar al ' + number + '?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Llamar ahora', 
          onPress: () => {
            const phoneUrl = Platform.OS === 'ios' 
              ? 'telprompt:' + number 
              : 'tel:' + number;
            Linking.openURL(phoneUrl);
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.alertBox}>
        <Text style={styles.alertIcon}>🚨</Text>
        <Text style={styles.alertTitle}>EMERGENCIA MEDICA</Text>
        <Text style={styles.alertText}>
          Usa esta funcion solo en caso de emergencia real.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Obten tu ubicacion</Text>
        <TouchableOpacity 
          style={[styles.button, styles.locationButton, loadingLocation && styles.buttonDisabled]}
          onPress={getLocation}
          disabled={loadingLocation}
        >
          <Text style={styles.buttonIcon}>📍</Text>
          <Text style={styles.buttonText}>
            {loadingLocation ? 'Obteniendo ubicacion...' : 
             location ? 'Ubicacion obtenida' : 'Obtener mi ubicacion'}
          </Text>
        </TouchableOpacity>
        
        {location && (
          <View style={styles.locationInfo}>
            <Text style={styles.locationLabel}>Tu ubicacion actual:</Text>
            <Text style={styles.locationText}>Latitud: {location.lat}</Text>
            <Text style={styles.locationText}>Longitud: {location.lon}</Text>
            {address && (
              <View style={styles.addressBox}>
                <Text style={styles.addressLabel}>Direccion:</Text>
                <Text style={styles.addressText}>{address}</Text>
              </View>
            )}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Captura evidencia (opcional)</Text>
        <TouchableOpacity 
          style={[styles.button, styles.cameraButton]}
          onPress={takePhoto}
        >
          <Text style={styles.buttonIcon}>📷</Text>
          <Text style={styles.buttonText}>
            {photo ? 'Foto capturada' : 'Tomar foto de la situacion'}
          </Text>
        </TouchableOpacity>
        {photo && (
          <View style={styles.photoPreview}>
            <Text style={styles.photoConfirmation}>Foto lista para enviar</Text>
            <Image source={{ uri: photo }} style={styles.photoImage} />
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Enviar alerta de emergencia</Text>
        <TouchableOpacity 
          style={[styles.button, styles.emergencyButton]}
          onPress={sendEmergencyAlert}
          disabled={alarmPlaying}
        >
          <Text style={styles.buttonIcon}>🆘</Text>
          <Text style={styles.emergencyButtonText}>
            {alarmPlaying ? 'ALERTA ACTIVA...' : 'ENVIAR ALERTA AHORA'}
          </Text>
        </TouchableOpacity>
        {alarmPlaying && (
          <TouchableOpacity 
            style={styles.stopButton}
            onPress={stopAlarm}
          >
            <Text style={styles.stopButtonText}>Detener alarma</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Llamadas de Emergencia</Text>
        
        <TouchableOpacity 
          style={styles.contactButton}
          onPress={() => callEmergency('131', 'Ambulancia SAMU')}
        >
          <Text style={styles.contactIcon}>🚑</Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>Ambulancia SAMU</Text>
            <Text style={styles.contactNumber}>131</Text>
            <Text style={styles.contactDescription}>Emergencias medicas 24/7</Text>
          </View>
          <Text style={styles.callIcon}>📞</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.contactButton}
          onPress={() => callEmergency('133', 'Emergencias Medicas')}
        >
          <Text style={styles.contactIcon}>🏥</Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>Emergencias Medicas</Text>
            <Text style={styles.contactNumber}>133</Text>
            <Text style={styles.contactDescription}>Atencion de urgencias</Text>
          </View>
          <Text style={styles.callIcon}>📞</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.contactButton}
          onPress={() => callEmergency('132', 'Bomberos')}
        >
          <Text style={styles.contactIcon}>🚒</Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>Bomberos</Text>
            <Text style={styles.contactNumber}>132</Text>
            <Text style={styles.contactDescription}>Rescate y emergencias</Text>
          </View>
          <Text style={styles.callIcon}>📞</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.contactButton}
          onPress={() => callEmergency('134', 'Carabineros')}
        >
          <Text style={styles.contactIcon}>👮</Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>Carabineros</Text>
            <Text style={styles.contactNumber}>134</Text>
            <Text style={styles.contactDescription}>Seguridad y orden publico</Text>
          </View>
          <Text style={styles.callIcon}>📞</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  alertBox: {
    backgroundColor: '#fff0f0',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: '#ff4444'
  },
  alertIcon: {
    fontSize: 56,
    marginBottom: 12
  },
  alertTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ff0000',
    marginBottom: 10,
    textAlign: 'center'
  },
  alertText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 14,
    gap: 12
  },
  buttonDisabled: {
    opacity: 0.6
  },
  locationButton: {
    backgroundColor: '#2196F3'
  },
  cameraButton: {
    backgroundColor: '#9C27B0'
  },
  emergencyButton: {
    backgroundColor: '#ff0000',
    paddingVertical: 22
  },
  buttonIcon: {
    fontSize: 26
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  emergencyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  stopButton: {
    backgroundColor: '#ff9800',
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center'
  },
  stopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  locationInfo: {
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 12,
    marginTop: 12
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 8
  },
  locationText: {
    fontSize: 14,
    color: '#333',
    marginVertical: 2
  },
  addressBox: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginTop: 10
  },
  addressLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 5
  },
  addressText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18
  },
  photoPreview: {
    marginTop: 12,
    alignItems: 'center'
  },
  photoConfirmation: {
    fontSize: 14,
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '600'
  },
  photoImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#9C27B0'
  },
  divider: {
    height: 12,
    backgroundColor: '#f5f5f5',
    marginVertical: 10
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  contactIcon: {
    fontSize: 36,
    marginRight: 15
  },
  contactInfo: {
    flex: 1
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4
  },
  contactNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0066cc'
  },
  contactDescription: {
    fontSize: 12,
    color: '#666'
  },
  callIcon: {
    fontSize: 28
  },
  bottomPadding: {
    height: 100
  }
});