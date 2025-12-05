import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

// Importar todas las pantallas
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ChatScreen from './src/screens/ChatScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AppointmentsScreen from './src/screens/AppointmentsScreen';
import PrescriptionsScreen from './src/screens/PrescriptionsScreen';
import VideoCallScreen from './src/screens/VideoCallScreen';
import EmergencyScreen from './src/screens/EmergencyScreen';
import NewAppointmentScreen from './src/screens/NewAppointmentScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Navegador de pestañas inferior
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#0088CC',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 10
        }
      }}
    >
      <Tab.Screen 
        name="Inicio" 
        component={HomeScreen}
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>🏠</Text>
        }}
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>💬</Text>
        }}
      />
      <Tab.Screen 
        name="Citas" 
        component={AppointmentsScreen}
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>📅</Text>
        }}
      />
      <Tab.Screen 
        name="Recetas" 
        component={PrescriptionsScreen}
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>💊</Text>
        }}
      />
      <Tab.Screen 
        name="Perfil" 
        component={ProfileScreen}
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>👤</Text>
        }}
      />
    </Tab.Navigator>
  );
}

// Navegador principal
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={MainTabs} />
        <Stack.Screen name="VideoCall" component={VideoCallScreen} />
        <Stack.Screen name="Emergency" component={EmergencyScreen} />
        <Stack.Screen name="NewAppointment" component={NewAppointmentScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Prescriptions" component={PrescriptionsScreen} />
        <Stack.Screen name="Appointments" component={AppointmentsScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
