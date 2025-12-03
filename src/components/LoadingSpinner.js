import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, Modal } from 'react-native';

export default function LoadingSpinner({ visible, message = 'Cargando...' }) {
  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0088CC" />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    minWidth: 150,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
    fontWeight: '600'
  }
});