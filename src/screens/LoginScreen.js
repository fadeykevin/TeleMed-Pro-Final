import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Por favor ingresa un correo válido');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    
    // Simular autenticación
    setTimeout(() => {
      setLoading(false);
      navigation.replace('Main');
    }, 1000);
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Recuperar contraseña',
      'Se enviará un enlace de recuperación a tu correo electrónico',
      [{ text: 'OK' }]
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoEmoji}>🏥</Text>
          <Text style={styles.title}>TeleMed Pro</Text>
          <Text style={styles.subtitle}>Tu salud, en tus manos</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="correo@ejemplo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity 
            style={styles.forgotButton}
            onPress={handleForgotPassword}
          >
            <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>¿No tienes cuenta? </Text>
            <TouchableOpacity onPress={() => Alert.alert('Registro', 'Función de registro próximamente')}>
              <Text style={styles.registerLink}>Regístrate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40
  },
  logoEmoji: {
    fontSize: 60,
    marginBottom: 10
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0066cc',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#666'
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
    marginBottom: 20
  },
  forgotText: {
    color: '#0066cc',
    fontSize: 14
  },
  loginButton: {
    backgroundColor: '#0066cc',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10
  },
  loginButtonDisabled: {
    backgroundColor: '#999'
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20
  },
  registerText: {
    color: '#666',
    fontSize: 14
  },
  registerLink: {
    color: '#0066cc',
    fontSize: 14,
    fontWeight: '600'
  }
});