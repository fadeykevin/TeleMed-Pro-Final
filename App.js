import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, StyleSheet } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ChatScreen from './src/screens/ChatScreen';
import AppointmentsScreen from './src/screens/AppointmentsScreen';
import PrescriptionsScreen from './src/screens/PrescriptionsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import EmergencyScreen from './src/screens/EmergencyScreen';
import VideoCallScreen from './src/screens/VideoCallScreen';
import NewAppointmentScreen from './src/screens/NewAppointmentScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ emoji, label, focused }) {
  return (
    <View style={styles.tabIconContainer}>
      <Text style={[styles.iconEmoji, focused && styles.iconEmojiFocused]}>{emoji}</Text>
      <Text style={[styles.iconLabel, focused && styles.iconLabelFocused]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: 90,
          paddingBottom: 55,
          paddingTop: 3,
          paddingHorizontal: 0,
          backgroundColor: '#ffffff',
          borderTopWidth: 2,
          borderTopColor: '#0066cc',
          elevation: 25,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -6 },
          shadowOpacity: 0.3,
          shadowRadius: 20
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#0066cc',
        tabBarInactiveTintColor: '#777'
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏠" label="Inicio" focused={focused} />
          )
        }}
      />
      <Tab.Screen 
        name="Appointments" 
        component={AppointmentsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📅" label="Citas" focused={focused} />
          )
        }}
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="💬" label="Chat" focused={focused} />
          )
        }}
      />
      <Tab.Screen 
        name="Prescriptions" 
        component={PrescriptionsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="💊" label="Recetas" focused={focused} />
          )
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="👤" label="Perfil" focused={focused} />
          )
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 65,
    paddingVertical: 0
  },
  iconEmoji: {
    fontSize: 24,
    opacity: 0.5,
    marginBottom: 2
  },
  iconEmojiFocused: {
    fontSize: 26,
    opacity: 1,
    transform: [{ scale: 1.1 }]
  },
  iconLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#777',
    textAlign: 'center',
    letterSpacing: 0.2
  },
  iconLabelFocused: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0066cc',
    letterSpacing: 0.3
  }
});

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Main" 
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Emergency" 
            component={EmergencyScreen}
            options={{ 
              title: 'Emergencia Medica',
              headerStyle: { backgroundColor: '#ff4444' },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold', fontSize: 18 }
            }}
          />
          <Stack.Screen 
            name="VideoCall" 
            component={VideoCallScreen}
            options={{ 
              headerShown: false
            }}
          />
          <Stack.Screen 
            name="NewAppointment" 
            component={NewAppointmentScreen}
            options={{ 
              headerShown: false
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}