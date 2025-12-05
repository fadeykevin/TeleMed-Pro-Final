import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email.trim() === '' || password.trim() === '') {
      Alert.alert('Error', 'Por favor ingresa email y contraseña');
      return;
    }

    // Simular login exitoso
    Alert.alert(
      'Bienvenido',
      'Inicio de sesion exitoso',
      [
        {
          text: 'OK',
          onPress: () => navigation.replace('Home')
        }
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🏥</Text>
          <Text style={styles.title}>TeleMed Pro</Text>
          <Text style={styles.subtitle}>Tu salud en tus manos</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="tu@email.com"
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
            autoCapitalize="none"
          />

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Iniciar Sesion</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.forgotPassword}
            onPress={() => Alert.alert('Recuperar Contraseña', 'Funcionalidad en desarrollo')}
          >
            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>¿No tienes cuenta? </Text>
            <TouchableOpacity onPress={() => Alert.alert('Registro', 'Funcionalidad en desarrollo')}>
              <Text style={styles.registerLink}>Registrate</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0088CC'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50
  },
  logo: {
    fontSize: 80,
    marginBottom: 10
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 16,
    color: '#B3E5FC'
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    elevation: 5
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 15
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  loginButton: {
    backgroundColor: '#0088CC',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 25
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 15
  },
  forgotPasswordText: {
    color: '#0088CC',
    fontSize: 14
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
    color: '#0088CC',
    fontSize: 14,
    fontWeight: 'bold'
  },
  version: {
    textAlign: 'center',
    color: '#B3E5FC',
    fontSize: 12,
    marginTop: 30
  }
});
