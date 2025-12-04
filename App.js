import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ChatScreen from './src/screens/ChatScreen';
import AppointmentsScreen from './src/screens/AppointmentsScreen';
import PrescriptionsScreen from './src/screens/PrescriptionsScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

function TabIcon({ emoji, label, focused }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 5 }}>
      <Text style={{ fontSize: 24, marginBottom: 3 }}>
        {emoji}
      </Text>
      <Text style={{ 
        fontSize: 10, 
        fontWeight: '600',
        color: focused ? '#0088CC' : '#999',
      }}>
        {label}
      </Text>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { 
          position: 'absolute',
          bottom: 20,
          left: 10,
          right: 10,
          height: 65,
          paddingBottom: 10,
          paddingTop: 5,
          backgroundColor: '#fff',
          borderRadius: 15,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
      }}
    >
      <Tab.Screen 
        name="Inicio" 
        component={HomeScreen}
        options={{ 
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label="Inicio" focused={focused} /> 
        }}
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{ 
          tabBarIcon: ({ focused }) => <TabIcon emoji="💬" label="Chat" focused={focused} /> 
        }}
      />
      <Tab.Screen 
        name="Citas" 
        component={AppointmentsScreen}
        options={{ 
          tabBarIcon: ({ focused }) => <TabIcon emoji="📅" label="Citas" focused={focused} /> 
        }}
      />
      <Tab.Screen 
        name="Recetas" 
        component={PrescriptionsScreen}
        options={{ 
          tabBarIcon: ({ focused }) => <TabIcon emoji="💊" label="Recetas" focused={focused} /> 
        }}
      />
      <Tab.Screen 
        name="Perfil" 
        component={ProfileScreen}
        options={{ 
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" label="Perfil" focused={focused} /> 
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <NavigationContainer>
      <MainTabs />
    </NavigationContainer>
  );
}