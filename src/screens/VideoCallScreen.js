import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

const { width, height } = Dimensions.get('window');

export default function VideoCallScreen({ route, navigation }) {
  const { doctor, specialty } = route.params;
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraFacing, setCameraFacing] = useState('front');
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (permission && permission.granted) {
      setTimeout(() => {
        setIsConnected(true);
        Alert.alert('Conectado', doctor + ' se ha unido a la llamada');
      }, 2000);
    }
  }, [permission]);

  useEffect(() => {
    let interval;
    if (isConnected) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
  };

  const switchCamera = () => {
    setCameraFacing(cameraFacing === 'back' ? 'front' : 'back');
  };

  const endCall = () => {
    Alert.alert(
      'Finalizar llamada',
      '¿Estas seguro que deseas finalizar la videollamada?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Finalizar',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Llamada finalizada',
              'Duracion: ' + formatDuration(callDuration) + '\n\nLa consulta ha sido registrada.',
              [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
          }
        }
      ]
    );
  };

  if (!permission) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando camara...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Se necesita permiso para usar la camara</Text>
        <TouchableOpacity style={styles.backButton} onPress={requestPermission}>
          <Text style={styles.backButtonText}>Permitir Camara</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.backButton, { marginTop: 10, backgroundColor: '#666' }]} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.doctorVideoContainer}>
        {isConnected ? (
          <View style={styles.doctorVideo}>
            <View style={styles.doctorAvatar}>
              <Text style={styles.doctorAvatarText}>👨‍⚕️</Text>
            </View>
            <View style={styles.doctorInfoOverlay}>
              <Text style={styles.doctorName}>{doctor}</Text>
              <Text style={styles.doctorSpecialty}>{specialty}</Text>
            </View>
            <View style={styles.statusIndicator}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>En linea</Text>
            </View>
          </View>
        ) : (
          <View style={styles.connectingContainer}>
            <Text style={styles.connectingText}>Conectando...</Text>
            <Text style={styles.connectingSubtext}>Esperando a {doctor}</Text>
          </View>
        )}
      </View>

      <View style={styles.myVideoContainer}>
        {isCameraOn ? (
          <CameraView
            style={styles.camera}
            facing={cameraFacing}
          />
        ) : (
          <View style={styles.cameraOff}>
            <Text style={styles.cameraOffIcon}>📷</Text>
            <Text style={styles.cameraOffText}>Camara apagada</Text>
          </View>
        )}
        <View style={styles.myVideoLabel}>
          <Text style={styles.myVideoLabelText}>Tu</Text>
        </View>
      </View>

      <View style={styles.durationContainer}>
        <View style={styles.durationBadge}>
          <View style={styles.recordingDot} />
          <Text style={styles.durationText}>{formatDuration(callDuration)}</Text>
        </View>
      </View>

      <View style={styles.controlsContainer}>
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, !isMicOn && styles.controlButtonOff]}
            onPress={toggleMic}
          >
            <Text style={styles.controlIcon}>{isMicOn ? '🎤' : '🔇'}</Text>
            <Text style={styles.controlLabel}>{isMicOn ? 'Micro' : 'Mudo'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.endCallButton}
            onPress={endCall}
          >
            <Text style={styles.endCallIcon}>📞</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, !isCameraOn && styles.controlButtonOff]}
            onPress={toggleCamera}
          >
            <Text style={styles.controlIcon}>{isCameraOn ? '📹' : '🚫'}</Text>
            <Text style={styles.controlLabel}>{isCameraOn ? 'Video' : 'Off'}</Text>
          </TouchableOpacity>
        </View>

        {isCameraOn && (
          <TouchableOpacity style={styles.switchButton} onPress={switchCamera}>
            <Text style={styles.switchIcon}>🔄</Text>
            <Text style={styles.switchText}>Cambiar camara</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 20
  },
  loadingText: {
    color: '#fff',
    fontSize: 16
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center'
  },
  backButton: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  doctorVideoContainer: {
    flex: 1,
    backgroundColor: '#2a2a2a'
  },
  doctorVideo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2a2a2a'
  },
  doctorAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#3a3a3a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  doctorAvatarText: {
    fontSize: 60
  },
  doctorInfoOverlay: {
    alignItems: 'center'
  },
  doctorName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5
  },
  doctorSpecialty: {
    color: '#aaa',
    fontSize: 16
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 15
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6
  },
  statusText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: 'bold'
  },
  connectingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  connectingText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8
  },
  connectingSubtext: {
    color: '#aaa',
    fontSize: 14
  },
  myVideoContainer: {
    position: 'absolute',
    top: 50,
    right: 15,
    width: width * 0.35,
    height: height * 0.25,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#0066cc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10
  },
  camera: {
    flex: 1
  },
  cameraOff: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cameraOffIcon: {
    fontSize: 40,
    marginBottom: 8
  },
  cameraOffText: {
    color: '#fff',
    fontSize: 12
  },
  myVideoLabel: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4
  },
  myVideoLabelText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold'
  },
  durationContainer: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    alignItems: 'center'
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff4444',
    marginRight: 8
  },
  durationText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 40,
    paddingHorizontal: 20
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 20
  },
  controlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.2)'
  },
  controlButtonOff: {
    backgroundColor: 'rgba(255,68,68,0.3)'
  },
  controlIcon: {
    fontSize: 28,
    marginBottom: 4
  },
  controlLabel: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600'
  },
  endCallButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '135deg' }]
  },
  endCallIcon: {
    fontSize: 32,
    transform: [{ rotate: '-135deg' }]
  },
  switchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 15,
    gap: 8
  },
  switchIcon: {
    fontSize: 20
  },
  switchText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  }
});